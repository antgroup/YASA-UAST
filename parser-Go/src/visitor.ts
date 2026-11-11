/**
 * visitor.ts —— tree-sitter CST -> UAST 的逐节点映射。
 *
 * 以原 Go parser 的 VisitXxx 为参照，按 CST 节点类型分派；
 * 参数分组、隐式作用域和合成节点的位置差异在对应转换函数中处理。
 */
import type { Node as SyntaxNode } from 'web-tree-sitter'
import type { Builder } from './builder'
import { TypeState } from './builder'
import { dynamicType, identifier, metaNoop, n, noop } from './nodes'
import type { UNode } from './nodes'

type Handler = (b: Builder, node: SyntaxNode) => UNode | null

// ── 基础工具 ──────────────────────────────────────────────────────────────

const BASIC_LIT_TYPES: Record<string, string> = {
  int_literal: 'INT',
  float_literal: 'FLOAT',
  imaginary_literal: 'IMAG',
  rune_literal: 'CHAR',
  raw_string_literal: 'STRING',
  interpreted_string_literal: 'STRING',
}

const IDENT_TYPES = new Set([
  'identifier',
  'type_identifier',
  'field_identifier',
  'package_identifier',
  'blank_identifier',
  'label_name',
])

function visitIdent(_b: Builder, node: SyntaxNode): UNode {
  return identifier(node.text)
}

function visitBasicLit(_b: Builder, node: SyntaxNode): UNode {
  return n('Literal', { value: node.text, literalType: BASIC_LIT_TYPES[node.type] })
}

function lowerBasicType(node: SyntaxNode): string {
  return (BASIC_LIT_TYPES[node.type] ?? '').toLowerCase()
}

function isIdentLike(node: SyntaxNode | null | undefined): node is SyntaxNode {
  return !!node && IDENT_TYPES.has(node.type)
}

function isBasicLit(node: SyntaxNode | null | undefined): node is SyntaxNode {
  return !!node && node.type in BASIC_LIT_TYPES
}

// ── 字段列表（字段声明/参数/返回值） ────────────────────────────────────────

/**
 * 复刻 go 的 `u.visitAsType(&field.Type)`：
 * - 普通参数：loc = 类型节点范围；
 * - 可变参数 `...T`：go AST 的 Field.Type 是 *ast.Ellipsis，Pos() 是 `...`
 *   的起点、End() 是元素类型结束，所以 loc 必须从 `...` 开始（中间可能有空格，
 *   不能沿用内部类型的起点）。
 */
function packedFieldType(b: Builder, field: SyntaxNode, typeNode: SyntaxNode | null): UNode {
  const visited = typeNode ? b.visitAsType(typeNode) : noop()
  const dots =
    field.type === 'variadic_parameter_declaration' ? field.children.find((c) => c.type === '...') ?? null : null
  if (dots && typeNode) {
    return b.packPosRange(visited, dots.startIndex, typeNode.endIndex)
  }
  return b.packPos(visited, typeNode ?? field)
}

/** Go 不允许命名、未命名参数混用。语法的歧义裁剪可能把长名字组的
 * 开头识别为独立类型；在后续命名字段确定分组后恢复完整字段。 */
function parameterFields(list: SyntaxNode): { field: SyntaxNode; names: SyntaxNode[]; start: number }[] {
  const fields = list.namedChildren.filter(c => c.type === 'parameter_declaration' || c.type === 'variadic_parameter_declaration')
  const result: { field: SyntaxNode; names: SyntaxNode[]; start: number }[] = []
  let pending: SyntaxNode[] = []
  for (const field of fields) {
    const names = field.childrenForFieldName('name')
    const type = field.childForFieldName('type')
    if (!names.length && type && isIdentLike(type)) {
      pending.push(field)
      continue
    }
    if (names.length && pending.length) {
      result.push({ field, names: [...pending.map(p => p.childForFieldName('type')!), ...names], start: pending[0].startIndex })
      pending = []
    } else {
      for (const p of pending) result.push({ field: p, names: [], start: p.startIndex })
      pending = []
      result.push({ field, names, start: field.startIndex })
    }
  }
  for (const p of pending) result.push({ field: p, names: [], start: p.startIndex })
  return result
}

function buildFieldDecls(b: Builder, fieldList: SyntaxNode | null): UNode[] {
  const ret: UNode[] = []
  if (!fieldList) return ret
  for (const { field, names, start } of parameterFields(fieldList)) {
    if (field.type !== 'parameter_declaration' && field.type !== 'variadic_parameter_declaration') {
      continue
    }
    const typeNode = field.childForFieldName('type')
    let typ: UNode = noop()
    b.handleInBuildState(TypeState, () => {
      typ = packedFieldType(b, field, typeNode)
    })
    const isRestElement = field.type === 'variadic_parameter_declaration'
    const meta: Record<string, unknown> = isRestElement ? { parameterKind: 'vararg' } : {}
    if (names.length === 0) {
      ret.push(
        b.packPosRange(
          n('VariableDeclaration', {
            id: null,
            init: null,
            cloned: true,
            varType: typ,
            variableParam: false,
          }, meta),
          start, field.endIndex
        )
      )
    } else {
      for (const name of names) {
        const fieldId = b.visit(name) as UNode
        fieldId._meta = { ReceiveCls: '', type: typ }
        ret.push(
          b.packPosRange(
            n('VariableDeclaration', {
              id: fieldId,
              init: null,
              cloned: true,
              varType: typ,
              variableParam: false,
            }, meta),
            start, field.endIndex
          )
        )
      }
    }
  }
  return ret
}

/** 返回值的 FieldList：tree-sitter 允许单个未命名类型直接出现在 result 位置。 */
function buildResultFields(b: Builder, resultNode: SyntaxNode | null): UNode[] {
  if (!resultNode) return []
  if (resultNode.type === 'parameter_list') return buildFieldDecls(b, resultNode)
  let typ: UNode = noop()
  b.handleInBuildState(TypeState, () => {
    typ = b.packPos(b.visitAsType(resultNode), resultNode)
  })
  return [
    b.packPos(
      n('VariableDeclaration', {
        id: null,
        init: null,
        cloned: true,
        varType: typ,
        variableParam: false,
      }),
      resultNode
    ),
  ]
}

/** 收集形参/接收者/具名返回值字段中的名字（跳过 `_`）。 */
function collectFieldNames(fieldList: SyntaxNode | null): string[] {
  const names: string[] = []
  if (!fieldList) return names
  for (const { field, names: fieldNames } of parameterFields(fieldList)) {
    if (field.type !== 'parameter_declaration' && field.type !== 'variadic_parameter_declaration') continue
    for (const name of fieldNames) {
      if (name.text !== '_') names.push(name.text)
    }
  }
  return names
}

function collectResultNames(resultNode: SyntaxNode | null): string[] {
  if (!resultNode || resultNode.type !== 'parameter_list') return []
  return collectFieldNames(resultNode)
}

function getFieldListInStructType(b: Builder, fieldList: SyntaxNode | null): UNode[] {
  const ret: UNode[] = []
  if (!fieldList) return ret
  for (const field of fieldList.namedChildren) {
    if (field.type !== 'field_declaration') continue
    let typeNode = field.childForFieldName('type')
    let namedType = typeNode
    if (!namedType) {
      // 嵌入的指针字段 `*T22` 在 tree-sitter 里没有 type 字段，只有匿名 `*` + type_identifier。
      namedType = field.namedChildren.find((c) => c.type !== 'comment') ?? null
    }
    const star = field.children.find((c) => c.type === '*') ?? null
    let typ: UNode = noop()
    b.handleInBuildState(TypeState, () => {
      if (star && namedType) {
        const el = b.visitAsType(namedType)
        typ = b.packPosRange(
          n('PointerType', { id: null, element: el, typeArguments: null, kind: 'pointer' }),
          field.startIndex,
          namedType.endIndex
        )
      } else {
        typ = b.packPos(namedType ? b.visitAsType(namedType) : noop(), namedType ?? field)
      }
    })
    typeNode = namedType
    const names = field.childrenForFieldName('name')
    if (names.length === 0) {
      // 处理 Struct Embedding
      const varName = identifier(b.getDirectName(typeNode))
      const instruction1 = b.packPos(n('SpreadElement', { argument: varName }), field)
      varName._meta = { ReceiveCls: '', type: typ }
      const instruction2 = b.packPos(
        n('VariableDeclaration', {
          id: varName,
          init: null,
          cloned: true,
          varType: typ,
          variableParam: false,
        }),
        field
      )
      ret.push(instruction1, instruction2)
    } else {
      for (const name of names) {
        const varName = b.visit(name) as UNode
        varName._meta = { ReceiveCls: '', type: typ }
        ret.push(
          b.packPos(
            n('VariableDeclaration', {
              id: varName,
              init: null,
              cloned: true,
              varType: typ,
              variableParam: false,
            }),
            field
          )
        )
      }
    }
  }
  return ret
}

function getVariableDeclarationType(vars: UNode[]): UNode {
  if (vars.length === 0) return n('VoidType', { id: null, typeArguments: null })
  if (vars.length === 1) return vars[0].varType
  return n('TupleType', {
    id: null,
    elements: vars.map((v) => v.varType),
    typeArguments: null,
  })
}

// ── 函数 ──────────────────────────────────────────────────────────────────

function buildFuncTypeFromParts(
  b: Builder,
  paramsNode: SyntaxNode | null,
  resultNode: SyntaxNode | null,
  typeParamsNode: SyntaxNode | null
): UNode {
  const paramTyp: UNode[] = []
  if (paramsNode) {
    for (const { field: param } of parameterFields(paramsNode)) {
      if (param.type !== 'parameter_declaration' && param.type !== 'variadic_parameter_declaration') continue
      const tn = param.childForFieldName('type')
      paramTyp.push(packedFieldType(b, param, tn))
    }
  }
  const typeParamTyp: UNode[] = []
  if (typeParamsNode) {
    for (const tp of typeParamsNode.namedChildren) {
      if (tp.type !== 'type_parameter_declaration') continue
      const tn = tp.childForFieldName('type')
      typeParamTyp.push(tn ? b.visitAsType(tn) : noop())
    }
  }
  const resultTyp: UNode[] = []
  if (resultNode) {
    if (resultNode.type === 'parameter_list') {
      for (const { field: res } of parameterFields(resultNode)) {
        const tn = res.childForFieldName('type')
        resultTyp.push(tn ? b.visitAsType(tn) : noop())
      }
    } else {
      resultTyp.push(b.visitAsType(resultNode))
    }
  }
  return n('FuncType', {
    id: identifier('FuncType'),
    params: paramTyp.length ? paramTyp : null,
    typeParams: typeParamTyp.length ? typeParamTyp : null,
    results: resultTyp.length ? resultTyp : null,
  })
}

function visitFuncType(b: Builder, node: SyntaxNode): UNode {
  return buildFuncTypeFromParts(
    b,
    node.childForFieldName('parameters'),
    node.childForFieldName('result'),
    node.childForFieldName('type_parameters')
  )
}

function walkUNode(node: UNode, action: (n: UNode) => void): void {
  if (!node || typeof node !== 'object') return
  action(node)
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === '_meta') continue
    const v = node[key]
    if (Array.isArray(v)) {
      for (const e of v) if (e && typeof e === 'object' && e.type) walkUNode(e, action)
    } else if (v && typeof v === 'object' && v.type) {
      walkUNode(v, action)
    }
  }
}

function visitFunc(
  b: Builder,
  bodyNode: SyntaxNode | null,
  funcParts: { paramsNode: SyntaxNode | null; resultNode: SyntaxNode | null },
  recvList: SyntaxNode | null,
  name: SyntaxNode | null
): UNode {
  // 函数体是一个隐式块作用域：形参/具名返回值/receiver 名先注入，再 visit body。
  b.pendingScopeNames = [
    ...collectFieldNames(funcParts.paramsNode),
    ...collectResultNames(funcParts.resultNode),
    ...collectFieldNames(recvList),
  ]
  const body = bodyNode
    ? (b.visit(bodyNode) as UNode)
    : n('ScopedStatement', { body: [], id: null })
  b.pendingScopeNames = []

  const returnVarDecls = buildResultFields(b, funcParts.resultNode)
  const nameNode = name ? b.packPos(identifier(name.text), name) : null

  const ret = n('FunctionDefinition', {
    id: nameNode,
    parameters: buildFieldDecls(b, funcParts.paramsNode),
    returnType: getVariableDeclarationType(returnVarDecls),
    body,
    modifiers: null,
  })

  // 具名返回值：把声明下放到函数体，裸返回补上变量名。
  if (returnVarDecls.length !== 0 && returnVarDecls[0].id != null) {
    body.body = [...returnVarDecls, ...body.body]
    walkUNode(body, (u) => {
      if (u.type !== 'ReturnStatement') return
      if (!u.argument || u.argument.type !== 'Noop') return
      if (returnVarDecls.length === 1) {
        u.argument = returnVarDecls[0].id
      } else {
        u.argument = n('TupleExpression', {
          elements: returnVarDecls.map((d) => d.id),
          modifiable: false,
        })
      }
    })
  }

  const recvDecls = buildFieldDecls(b, recvList)
  if (recvDecls.length !== 0) {
    const recv = recvDecls[0]
    const thisExpr =
      recv.varType.type === 'PointerType'
        ? n('ThisExpression', {}, { type: n('PointerType', { id: null, element: null, typeArguments: null, kind: '' }) })
        : n('ThisExpression')
    if (recv.id != null) {
      const recvId = identifier(recv.id.name)
      recvId._meta = { ReceiveCls: '', type: recv.varType }
      body.body = [
        n('VariableDeclaration', {
          id: recvId,
          init: thisExpr,
          cloned: true,
          varType: recv.varType,
          variableParam: false,
        }),
        ...body.body,
      ]
    }
  }
  return ret
}

function funcPartsOf(node: SyntaxNode): { paramsNode: SyntaxNode | null; resultNode: SyntaxNode | null } {
  return {
    paramsNode: node.childForFieldName('parameters'),
    resultNode: node.childForFieldName('result'),
  }
}

function visitFuncLit(b: Builder, node: SyntaxNode): UNode {
  return visitFunc(b, node.childForFieldName('body'), funcPartsOf(node), null, null)
}

function visitFuncDecl(b: Builder, node: SyntaxNode): UNode | null {
  const ret = visitFunc(
    b,
    node.childForFieldName('body'),
    funcPartsOf(node),
    node.childForFieldName('receiver'),
    node.childForFieldName('name')
  )

  const recvList = node.childForFieldName('receiver')
  const recvDecls = buildFieldDecls(b, recvList)
  if (recvDecls.length !== 0) {
    const firstField = recvList ? recvList.namedChildren[0] : null
    const clsName = b.getDirectName(firstField ? firstField.childForFieldName('type') : null)
    ret._meta.ReceiveCls = clsName
    const ts = b.typeDecls.get(clsName)
    const cd = ts ? b.type2Class.get(ts.id) : undefined
    if (cd) {
      b.packPos(ret, node)
      cd.body.push(ret)
      return null
    }
  }
  return ret
}

// ── 声明 ──────────────────────────────────────────────────────────────────

function visitGenDecl(b: Builder, node: SyntaxNode): UNode[] {
  const ret: UNode[] = []
  for (const spec of b.specsOf(node)) {
    const unode = b.visit(spec)
    if (unode !== null) ret.push(unode)
  }
  return ret
}

function visitValueSpec(b: Builder, node: SyntaxNode): UNode {
  // const_spec 的 name 字段里还会包含匿名的 `,`，需要过滤。
  const names = node.childrenForFieldName('name').filter((c) => isIdentLike(c))
  const typeNode = node.childForFieldName('type')
  const valueListNode = node.childForFieldName('value')
  const values = valueListNode ? valueListNode.namedChildren.filter((c) => c.type !== 'comment') : []
  const exprs: UNode[] = []

  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    let valexpr: UNode | null = null
    let typ: UNode = dynamicType()

    if (values.length !== 0 && i < values.length) {
      const val = values[i]
      valexpr = b.visit(val)
      // 模拟 reflect 检查 ast.Expr 是否有 Type 字段：CompositeLit/TypeAssertExpr/FuncLit。
      if (val.type === 'composite_literal') {
        const t = val.childForFieldName('type')
        typ = b.visitAsType(t)
      } else if (val.type === 'type_assertion_expression') {
        typ = b.visitAsType(val.childForFieldName('type'))
      } else if (val.type === 'func_literal') {
        typ = funcTypeOfFuncLit(b, val)
      }
      // id.Obj.Decl 是 ValueSpec 时取其声明类型。
      if (isIdentLike(val)) {
        const decl = b.lookupDecl(val.text)
        if (decl && decl.kind === 'valueSpec') {
          typ = b.visit(decl.typeNode)
        }
      }
      if (isBasicLit(val)) {
        typ = identifier(lowerBasicType(val))
      }
      if (val.type === 'call_expression') {
        const fn = val.childForFieldName('function')
        const argList = val.childForFieldName('arguments')
        const args = argList ? argList.namedChildren.filter((c) => c.type !== 'comment') : []
        const targs = typeArgumentNodes(val)
        if (targs.length > 0) {
          // `pkg.F[T](x)` 在 go/ast 里 Fun 是 *ast.IndexExpr/IndexListExpr，
          // 所以这里 visit(Fun) 会保留类型实参（与 visitCall 的 callee 丢弃不同）。
          typ = callFunTypeExpr(b, val, fn, targs)
        } else if (fn && isIdentLike(fn)) {
          if (fn.text === 'make' && args.length > 0) typ = b.visit(args[0])
        } else if (fn) {
          typ = b.visit(fn)
        }
      }
      if (val.type === 'type_conversion_expression') {
        // go/ast: CallExpr{Fun: 类型表达式} 且 Fun 不是 Ident -> typ = visit(Fun)
        typ = b.visitAsType(val.childForFieldName('type'))
      }
    }
    if (typeNode) typ = b.visit(typeNode)

    const id = b.visit(name) as UNode
    id._meta = { ReceiveCls: '', type: typ }
    const vd = n('VariableDeclaration', {
      id,
      init: valexpr,
      cloned: false,
      varType: typ,
      variableParam: false,
    })
    b.setVarInCurrentScope(id.name)
    b.registerDecl(id.name, { kind: 'valueSpec', typeNode })
    exprs.push(vd)
  }

  if (exprs.length === 1) return exprs[0]
  return n('Sequence', { expressions: exprs })
}

function visitImportSpec(b: Builder, node: SyntaxNode): UNode {
  const cached = b.import2Stmt.get(node.id)
  if (cached) return cached

  const pathNode = node.childForFieldName('path')
  let importPath = pathNode ? pathNode.text : ''
  importPath = importPath.replace(/"/g, '')
  const nameNode = node.childForFieldName('name')

  if (!nameNode) {
    const baseName = baseNameOf(importPath)
    return n('VariableDeclaration', {
      id: identifier(baseName),
      init: b.packPos(
        n('ImportExpression', {
          from: n('Literal', { value: importPath, literalType: 'string' }),
          local: null,
          imported: null,
        }),
        pathNode!
      ),
      cloned: false,
      varType: dynamicType(),
      variableParam: false,
    }, { isDefaultImport: true })
  }

  const localName = nameNode.text
  if (localName === '.') {
    return n('SpreadElement', {
      argument: n('ImportExpression', {
        from: b.packPos(n('Literal', { value: importPath, literalType: 'string' }), pathNode!),
        local: null,
        imported: null,
      }),
    })
  }
  return n('VariableDeclaration', {
    id: identifier(localName),
    init: b.packPos(
      n('ImportExpression', {
        from: n('Literal', { value: importPath, literalType: 'string' }),
        local: null,
        imported: null,
      }),
      pathNode!
    ),
    cloned: false,
    varType: dynamicType(),
    variableParam: false,
  })
}

function baseNameOf(p: string): string {
  const clean = p.replace(/\\/g, '/').replace(/\/+$/, '')
  const idx = clean.lastIndexOf('/')
  return idx >= 0 ? clean.slice(idx + 1) : clean
}

function visitTypeSpec(b: Builder, node: SyntaxNode): UNode {
  const cached = b.type2Class.get(node.id)
  if (cached) return cached

  const nameNode = node.childForFieldName('name')
  const ret = n('ClassDefinition', {
    id: b.visit(nameNode) as UNode,
    body: [],
    supers: [],
  })

  const typeNode = node.childForFieldName('type')
  const unode = b.visitAsType(typeNode)
  if (unode.type === 'Identifier') {
    ret.supers.push(unode)
  } else if (unode.type === 'Sequence') {
    ret.body.push(...unode.expressions)
    if (unode._meta.isInterface) ret._meta.isInterface = true
  } else if (unode.type === 'MapType' || unode.type === 'ArrayType' || unode.type === 'ChanType') {
    ret.supers.push(b.visitAsType(typeNode))
  }
  b.type2Class.set(node.id, ret)
  if (nameNode) b.typeDecls.set(nameNode.text, node)
  return ret
}

function visitStructType(b: Builder, node: SyntaxNode): UNode {
  const fieldList = node.childForFieldName('body') ?? b.child(node, 'field_declaration_list')
  const decls = getFieldListInStructType(b, fieldList)
  return n('Sequence', { expressions: decls })
}

function visitInterfaceType(b: Builder, node: SyntaxNode): UNode {
  const ret: UNode[] = []
  const methods = node.namedChildren.filter((c) => c.type === 'method_elem' || c.type === 'type_elem')
  if (methods.length === 0) return dynamicType()
  for (const method of methods) {
    if (method.type !== 'method_elem') continue // type_elem（嵌入/类型集合）Names 为空，跳过
    const methodName = method.childForFieldName('name')
    if (!methodName) continue
    const paramsNode = method.childForFieldName('parameters')
    const resultNode = method.childForFieldName('result')
    const startIndex = paramsNode ? paramsNode.startIndex : method.startIndex
    const endIndex = resultNode ? resultNode.endIndex : paramsNode ? paramsNode.endIndex : method.endIndex
    const methodType = buildFuncTypeFromParts(b, paramsNode, resultNode, null)
    b.packPosRange(methodType, startIndex, endIndex)
    methodType.id.name = methodName.text
    ret.push(methodType)
  }
  return n('Sequence', { expressions: ret }, { isInterface: true })
}

// ── 类型 ──────────────────────────────────────────────────────────────────

function visitArrayType(b: Builder, node: SyntaxNode): UNode {
  return n('ArrayType', {
    id: identifier('ArrayType'),
    element: b.visitAsType(node.childForFieldName('element')),
    typeArguments: null,
    size: b.visit(node.childForFieldName('length')),
  })
}

function visitSliceType(b: Builder, node: SyntaxNode): UNode {
  return n('ArrayType', {
    id: identifier('ArrayType'),
    element: b.visitAsType(node.childForFieldName('element')),
    typeArguments: null,
    size: b.visit(null),
  })
}

function visitImplicitLengthArrayType(b: Builder, node: SyntaxNode): UNode {
  // go/ast: ArrayType.Len 是 *ast.Ellipsis{Elt:nil}；VisitEllipsis -> visit(nil)=Noop，
  // visit(Ellipsis) 再给这个 Noop 打上 `...` 的 loc。
  const ell = b.ellipsisToken(node)
  const size = ell ? b.packPos(noop(), ell) : noop()
  return n('ArrayType', {
    id: identifier('ArrayType'),
    element: b.visitAsType(node.childForFieldName('element')),
    typeArguments: null,
    size,
  })
}

function visitMapType(b: Builder, node: SyntaxNode): UNode {
  return n('MapType', {
    id: identifier('MapType'),
    keyType: b.visitAsType(node.childForFieldName('key')),
    valueType: b.visitAsType(node.childForFieldName('value')),
    typeArguments: null,
  })
}

function visitChanType(b: Builder, node: SyntaxNode): UNode {
  // go/ast: Dir==1 -> send (chan<- T)，Dir==2 -> receive (<-chan T)，否则 ''
  let dir = ''
  const arrow = node.children.find((c) => c.type === '<-')
  if (arrow) {
    const chanTok = node.children.find((c) => c.type === 'chan')
    dir = chanTok && arrow.startIndex < chanTok.startIndex ? 'receive' : 'send'
  }
  return n('ChanType', {
    id: identifier('ChanType'),
    dir,
    valueType: b.visitAsType(node.childForFieldName('value')),
  })
}

function visitPointerType(b: Builder, node: SyntaxNode): UNode {
  const inner = node.childForFieldName('type') ?? b.child(node, 'type_identifier') ?? node.namedChildren[0] ?? null
  if (b.isInBuildState(TypeState)) {
    return n('PointerType', {
      id: null,
      element: inner ? b.visitAsType(inner) : noop(),
      typeArguments: null,
      kind: 'pointer',
    })
  }
  return n('DereferenceExpression', {
    argument: inner ? b.visitAsType(inner) : noop(),
  })
}

function visitQualifiedType(b: Builder, node: SyntaxNode): UNode {
  return merge(b.visit(node.childForFieldName('package')), b.visit(node.childForFieldName('name')), false)
}

function visitGenericType(b: Builder, node: SyntaxNode): UNode {
  const typeNode = node.childForFieldName('type')
  const argsNode = node.childForFieldName('type_arguments')
  const args: SyntaxNode[] = []
  if (argsNode) {
    for (const c of argsNode.namedChildren) {
      if (c.type === 'type_elem') {
        const inner = c.namedChildren[0]
        if (inner) args.push(inner)
      } else {
        args.push(c)
      }
    }
  }
  if (args.length === 1 && typeNode) {
    return merge(b.visitAsType(typeNode), b.visitAsType(args[0]), true)
  }
  const properties: UNode[] = args.map((a) => b.visitAsType(a))
  return n('MemberAccess', {
    object: typeNode ? b.visitAsType(typeNode) : noop(),
    property: n('Sequence', { expressions: properties }),
    computed: true,
  })
}

/** 取 type_arguments 里的实际类型（解包 type_elem）。 */
function typeArgumentNodes(node: SyntaxNode): SyntaxNode[] {
  const argsNode = node.childForFieldName('type_arguments')
  const out: SyntaxNode[] = []
  if (!argsNode) return out
  for (const c of argsNode.namedChildren) {
    if (c.type === 'type_elem') {
      const inner = c.namedChildren[0]
      if (inner) out.push(inner)
    } else if (c.type !== 'comment') {
      out.push(c)
    }
  }
  return out
}

/**
 * 把 `pkg.F[T1, T2]` 重建成 go/ast 的 Fun 表达式：
 * 单类型实参 -> IndexExpr（merge）；多类型实参 -> IndexListExpr（MemberAccess + Sequence）。
 */
function callFunTypeExpr(b: Builder, callNode: SyntaxNode, fn: SyntaxNode | null, targs: SyntaxNode[]): UNode {
  let res: UNode
  if (targs.length === 1) {
    res = merge(fn ? b.visit(fn) : noop(), b.visitAsType(targs[0]), true)
  } else {
    const props = targs.map((t) => b.visitAsType(t))
    res = n('MemberAccess', {
      object: fn ? b.visit(fn) : noop(),
      property: n('Sequence', { expressions: props }),
      computed: true,
    })
  }
  // go/ast IndexExpr/IndexListExpr 的 loc = X.Pos()..Rbrack+1。
  const targsNode = callNode.childForFieldName('type_arguments')
  const startIndex = fn ? fn.startIndex : callNode.startIndex
  const endIndex = targsNode ? targsNode.endIndex : fn ? fn.endIndex : callNode.endIndex
  return b.packPosRange(res, startIndex, endIndex)
}

function visitTypeConstraint(b: Builder, node: SyntaxNode): UNode {
  const inner = node.namedChildren[0]
  return inner ? b.visitAsType(inner) : noop()
}

function visitTypeElem(b: Builder, node: SyntaxNode): UNode {
  const inner = node.namedChildren[0]
  return inner ? b.visitAsType(inner) : noop()
}

function visitNegatedType(b: Builder, node: SyntaxNode): UNode {
  const inner = node.namedChildren[0]
  return n('UnaryExpression', {
    operator: '~',
    argument: inner ? b.visitAsType(inner) : noop(),
    isSuffix: false,
  })
}

function visitParen(b: Builder, node: SyntaxNode): UNode {
  // 注释也是 named child；括号中的实际表达式不能被前置注释替代。
  const inner = node.namedChildren.find((child) => child.type !== 'comment')
  return inner ? b.visit(inner) : noop()
}

// ── 表达式 ────────────────────────────────────────────────────────────────

function merge(a: UNode, b: UNode, computed: boolean): UNode {
  if (a === null || a === undefined) return b
  if (b === null || b === undefined) return a
  const aIsMember = a.type === 'MemberAccess'
  const bIsMember = b.type === 'MemberAccess'
  if (!bIsMember) {
    return n('MemberAccess', { object: a, property: b, computed })
  }
  if (!aIsMember) {
    return n('MemberAccess', { object: merge(a, b.object, computed), property: b.property, computed })
  }
  return n('MemberAccess', {
    object: merge(a, b.object, computed),
    property: b.property,
    computed,
  })
}

function visitSelector(b: Builder, node: SyntaxNode): UNode {
  return merge(b.visit(node.childForFieldName('operand')), b.visit(node.childForFieldName('field')), false)
}

/** 表达式位置的泛型 CST 也可能是成员表达式构成的嵌套索引。 */
function visitInstantiation(b: Builder, node: SyntaxNode): UNode {
  const operand = node.childForFieldName('type')
  const args = node.namedChildren.filter(child => child.id !== operand?.id && child.type !== 'comment')
  const base = operand ? b.visit(operand) : noop()
  if (args.length === 1) return merge(base, b.visit(args[0]), true)
  return n('MemberAccess', {
    object: base,
    property: n('Sequence', { expressions: args.map(arg => b.visit(arg)) }),
    computed: true,
  })
}

function visitIndex(b: Builder, node: SyntaxNode): UNode {
  return merge(b.visit(node.childForFieldName('operand')), b.visit(node.childForFieldName('index')), true)
}

// Go 构造时留空 `Type`、依赖 defaults.Set 填默认值的节点（见 uast/asttype.go 的
// `default:"..."` 标签）。其余节点构造时都显式设置了 Type。
const DEFAULTED_TYPE_NAMES = new Set(['Noop', 'FuncType', 'VoidType'])

/**
 * 清掉“只挂在 Meta.Type 下”子树的默认 Type。
 *
 * go 的 defaults.Set 是通过 recursiveActionInUNode 遍历执行的，而它不会递归进
 * 嵌入的 Meta 结构，所以 `_meta.type` 子树里的 Noop/FuncType/VoidType 保留空
 * `type`（例如 `x.(interface{...})`、`x.(func())`、`x.(*[N]T)` 的 size）。
 * 这里对 visitTypeAssert 生成的 meta-only 子树做同样处理。
 */
function clearMetaDefaults(node: UNode): void {
  if (!node || typeof node !== 'object') return
  if (DEFAULTED_TYPE_NAMES.has(node.type)) node.type = ''
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === '_meta') continue
    const v = node[key]
    if (Array.isArray(v)) {
      for (const e of v) clearMetaDefaults(e)
    } else if (v && typeof v === 'object') {
      clearMetaDefaults(v)
    }
  }
}

function visitTypeAssert(b: Builder, node: SyntaxNode): UNode {
  const typeNode = node.childForFieldName('type')
  // go 的 VisitTypeAssertExpr 在**当前** build state 下 visit(node.Type)，不额外
  // 置 TypeState；因此 `v.(*T)` 的 _meta.type 是 DereferenceExpression 而非
  // PointerType（与 VisitStarExpr 的 state 分支一致）。
  const metaType: UNode = typeNode ? b.visitAsType(typeNode) : metaNoop()
  // metaType 只会进 `_meta.type`，不受 defaults.Set 影响。
  clearMetaDefaults(metaType)
  return n('BinaryExpression', {
    operator: 'instanceof',
    left: b.visit(node.childForFieldName('operand')),
    right: b.visit(typeNode),
  }, { type: metaType })
}

function funcTypeOfFuncLit(b: Builder, litNode: SyntaxNode): UNode {
  const paramsNode = litNode.childForFieldName('parameters')
  const resultNode = litNode.childForFieldName('result')
  const ft = buildFuncTypeFromParts(b, paramsNode, resultNode, null)
  const endIndex = resultNode ? resultNode.endIndex : paramsNode ? paramsNode.endIndex : litNode.endIndex
  return b.packPosRange(ft, litNode.startIndex, endIndex)
}

function visitCall(b: Builder, node: SyntaxNode): UNode {
  const fn = node.childForFieldName('function')
  const argList = node.childForFieldName('arguments')
  const args = argList ? argList.namedChildren.filter((c) => c.type !== 'comment') : []

  if (fn && isIdentLike(fn) && fn.text === 'new' && args.length > 0) {
    return n('NewExpression', {
      callee: b.visit(args[0]),
      arguments: [],
    })
  }

  const visitedArgs: UNode[] = []
  const ellipsis = argList ? b.ellipsisToken(argList) : null
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.type === 'variadic_argument') {
      // go/ast: f(xs...) —— 实参是 xs，Ellipsis 标记在调用上。
      const inner = arg.namedChildren.find((c) => c.type !== 'comment') ?? arg
      const dots = arg.children.find((c) => c.type === '...')
      const spread = b.packPos(n('SpreadElement', { argument: b.visit(inner) }), inner)
      spread.loc = b.locRange(inner.startIndex, dots ? dots.endIndex : arg.endIndex)
      visitedArgs.push(spread)
      continue
    }
    const visited = b.visit(arg)
    if (i === args.length - 1 && ellipsis) {
      const spread = b.packPos(n('SpreadElement', { argument: visited }), arg)
      spread.loc = b.locRange(arg.startIndex, ellipsis.endIndex)
      visitedArgs.push(spread)
    } else {
      visitedArgs.push(visited)
    }
  }

  if (fn && (fn.type === 'index_expression' || fn.type === 'generic_type')) {
    return n('CallExpression', {
      callee: fn.type === 'generic_type' ? b.visitAsType(fn.childForFieldName('type')) : b.visit(fn.childForFieldName('operand')),
      arguments: visitedArgs,
    })
  }
  return n('CallExpression', {
    callee: b.visit(fn),
    arguments: visitedArgs,
  })
}

function visitTypeConversion(b: Builder, node: SyntaxNode): UNode {
  // tree-sitter 把 `X[T](v)`（单实参）也当作 type_conversion_expression，但 go/ast
  // 里 Fun 是 *ast.IndexExpr/*ast.IndexListExpr，VisitCallExpr 会丢掉类型实参、
  // 只 visit(call.X)。所以泛型实例化时 callee 取 base，普通转换才 visit(type)。
  let typeNode = node.childForFieldName('type')
  // 未加括号的前导 * 属于调用结果；括号内的 * 仍属于 callee。
  const dereferences: SyntaxNode[] = []
  while (typeNode?.type === 'pointer_type') {
    dereferences.push(typeNode)
    typeNode = typeNode.namedChildren.find(c => c.type !== 'comment') ?? null
  }
  let callee: UNode
  if (typeNode && (typeNode.type === 'generic_type' || typeNode.type === 'index_expression')) {
    const base = typeNode.type === 'generic_type'
      ? typeNode.childForFieldName('type') : typeNode.childForFieldName('operand')
    callee = base ? b.visitAsType(base) : noop()
  } else {
    callee = b.visitAsType(typeNode)
  }
  let expression = b.packPosRange(n('CallExpression', {
    callee,
    arguments: [b.visit(node.childForFieldName('operand'))],
  }), typeNode?.startIndex ?? node.startIndex, node.endIndex)
  for (const pointer of dereferences.reverse()) {
    expression = b.packPosRange(n('DereferenceExpression', { argument: expression }), pointer.startIndex, node.endIndex)
  }
  return expression
}

function visitUnary(b: Builder, node: SyntaxNode): UNode {
  const op = node.childForFieldName('operator')
  const opText = op ? op.text : ''
  const arg = b.visit(node.childForFieldName('operand'))
  if (opText === '*') return n('DereferenceExpression', { argument: arg })
  if (opText === '&') return n('ReferenceExpression', { argument: arg })
  if (opText === '<-') return n('UnaryExpression', { operator: 'pop', argument: arg, isSuffix: false })
  return n('UnaryExpression', { operator: opText, argument: arg, isSuffix: false })
}

function visitBinary(b: Builder, node: SyntaxNode): UNode {
  const op = node.childForFieldName('operator')
  return n('BinaryExpression', {
    operator: op ? op.text : '',
    left: b.visit(node.childForFieldName('left')),
    right: b.visit(node.childForFieldName('right')),
  })
}

function visitSlice(b: Builder, node: SyntaxNode): UNode {
  return n('MemberAccess', {
    object: b.visit(node.childForFieldName('operand')),
    property: n('SliceExpression', {
      start: b.visit(node.childForFieldName('start')),
      end: b.visit(node.childForFieldName('end')),
      step: null,
    }),
    computed: false,
  })
}

function visitCompositeLit(b: Builder, node: SyntaxNode): UNode {
  const typeNode = node.childForFieldName('type')
  const body = node.childForFieldName('body')
  return buildCompositeLit(b, node, typeNode, body)
}

function visitElidedLiteral(b: Builder, node: SyntaxNode): UNode {
  return buildCompositeLit(b, node, null, node)
}

/** 按声明顺序收集具名结构体字段；跨文件字段使用声明所在文件的位置。 */
function collectCompositeFieldNames(b: Builder, typeNode: SyntaxNode | null): UNode[] {
  const names: UNode[] = []
  if (!typeNode || typeNode.type !== 'type_identifier') return names
  const spec = b.typeDecls.get(typeNode.text)
  const specType = spec ? spec.childForFieldName('type') : null
  if (!specType || specType.type !== 'struct_type') return names
  const fields = specType.childForFieldName('body') ?? b.child(specType, 'field_declaration_list')
  if (!fields) return names

  for (const field of fields.namedChildren) {
    if (field.type !== 'field_declaration') continue
    const fieldNames = field.childrenForFieldName('name')
    let namedType = field.childForFieldName('type')
    if (!namedType) {
      // 嵌入指针字段 `*T` 没有 type 字段，只有匿名 `*` 和类型名。
      namedType = field.namedChildren.find((c) => c.type !== 'comment') ?? null
    }
    const star = field.children.find((c) => c.type === '*') ?? null
    if (fieldNames.length === 0) {
      if (star && namedType) {
        // 不能使用当前文件的 packPosRange：字段可能声明在另一个文件。
        const dereference = n('DereferenceExpression', { argument: b.visitAsType(namedType) })
        names.push(b.packPos(dereference, field))
      } else if (namedType) {
        names.push(b.visitAsType(namedType))
      }
    } else {
      for (const name of fieldNames) names.push(b.visit(name))
    }
  }
  return names
}

/** 把元素的字段路径接到临时对象上，保留成员访问和调用的原有嵌套结构。 */
function compositeAssignmentTarget(receiver: UNode, key: UNode): UNode {
  if (key && key.type === 'MemberAccess') {
    return n('MemberAccess', {
      object: n('MemberAccess', { object: receiver, property: key.object, computed: false }),
      property: key.property,
      computed: false,
    })
  }
  if (key && key.type === 'CallExpression') {
    if (key.callee && key.callee.type === 'MemberAccess') {
      return n('CallExpression', {
        callee: n('MemberAccess', {
          object: n('MemberAccess', { object: receiver, property: key.callee.object, computed: false }),
          property: key.callee.property,
          computed: false,
        }),
        arguments: key.arguments,
      })
    }
    return n('CallExpression', {
      callee: n('MemberAccess', { object: receiver, property: key, computed: false }),
      arguments: key.arguments,
    })
  }
  return n('MemberAccess', { object: receiver, property: key, computed: false })
}

/** 先分配临时对象，再按源码顺序构造各元素赋值，最后返回临时对象引用。 */
function buildCompositeLit(
  b: Builder,
  node: SyntaxNode,
  typeNode: SyntaxNode | null,
  bodyNode: SyntaxNode | null
): UNode {
  const exprs: UNode[] = []
  const tmpVarName = b.getTmpVariableName()
  const lastReturnVarId =
    node.type === 'literal_value' && typeNode
      ? b.packPosRange(identifier(tmpVarName), typeNode.startIndex, node.endIndex)
      : b.packPos(identifier(tmpVarName), node)
  const typ = typeNode ? b.visitAsType(typeNode) : metaNoop()
  lastReturnVarId._meta = { ReceiveCls: '', type: typ }

  if (typeNode) {
    exprs.push(
      n('VariableDeclaration', {
        id: lastReturnVarId,
        init: n('NewExpression', {
          callee: b.visit(typeNode),
          arguments: [],
        }),
        varType: typ,
        cloned: false,
        variableParam: false,
      })
    )
  } else {
    exprs.push(n('ObjectExpression', { properties: null, id: null }))
  }

  const names = collectCompositeFieldNames(b, typeNode)

  const elements = bodyNode
    ? bodyNode.namedChildren.filter((c) => c.type === 'literal_element' || c.type === 'keyed_element')
    : []

  for (let i = 0; i < elements.length; i++) {
    const elt = elements[i]
    let key: UNode = null
    let value: UNode = null

    if (elt.type === 'keyed_element') {
      const keyNodeRaw = elt.childForFieldName('key')
      const valueNodeRaw = elt.childForFieldName('value')
      const keyNode = keyNodeRaw ? b.unwrapElement(keyNodeRaw) : null
      const valueNode = valueNodeRaw ? b.unwrapElement(valueNodeRaw) : null
      // map key 是省略类型的复合字面量时补上 map key 类型
      if (keyNode && keyNode.type === 'literal_value' && typeNode && typeNode.type === 'map_type') {
        const mapKey = typeNode.childForFieldName('key')
        key = buildCompositeLit(b, keyNode, mapKey, keyNode)
        if (mapKey) b.packPosRange(key, mapKey.startIndex, keyNode.endIndex)
      } else {
        key = keyNode ? b.visit(keyNode) : noop()
      }
      value = valueNode ? visitElementAsExpr(b, valueNode) : noop()
    } else {
      // literal_element -> 取内层
      const inner = b.unwrapElement(elt)
      if (typeNode && typeNode.type === 'type_identifier') {
        const ts = b.typeDecls.get(typeNode.text)
        const specType = ts ? ts.childForFieldName('type') : null
        if (specType && specType.type === 'struct_type') {
          const fl = specType.childForFieldName('body') ?? b.child(specType, 'field_declaration_list')
          const fields = fl ? fl.namedChildren.filter((c) => c.type === 'field_declaration') : []
          if (elements.length === names.length) {
            key = names[i]
            value = b.visit(inner)
          } else if (fields.length >= 1 && elements.length === fields[0].childrenForFieldName('name').length) {
            key = b.visit(fields[0].childrenForFieldName('name')[i])
            value = b.visit(inner)
          } else if (i < fields.length && fields[i].childrenForFieldName('name').length === 0) {
            key = b.visitAsType(fields[i].childForFieldName('type'))
            value = b.visit(inner)
          }
        } else if (specType && (specType.type === 'array_type' || specType.type === 'slice_type')) {
          key = identifier(String(i))
          value = b.visit(inner)
        }
      } else if (typeNode && typeNode.type !== 'type_identifier') {
        key = identifier(String(i))
        value = b.visit(inner)
      } else if (!typeNode) {
        key = identifier(String(i))
        value = b.visit(inner)
      }
    }

    const left = compositeAssignmentTarget(lastReturnVarId, key)
    exprs.push(
      n('AssignmentExpression', {
        left,
        right: value,
        operator: '=',
        cloned: true,
      })
    )
  }

  exprs.push(lastReturnVarId)
  return n('Sequence', { expressions: exprs })
}

function visitElementAsExpr(b: Builder, node: SyntaxNode): UNode {
  // literal_value 已在 HANDLERS 里映射为 visitElidedLiteral；走 b.visit 才能
  // 让返回的 Sequence 拿到 literal_value 的 loc（对应 go 的 u.visit(CompositeLit)）。
  return b.visit(node)
}

// ── 语句 ──────────────────────────────────────────────────────────────────

function visitStatements(b: Builder, listNode: SyntaxNode | null): UNode[] {
  const body: UNode[] = []
  if (!listNode) return body
  for (const stmt of listNode.namedChildren) {
    if (stmt.type === 'comment') continue
    const unode = b.visit(stmt)
    if (Array.isArray(unode)) {
      body.push(...unode)
    } else if (unode && unode.type === 'Sequence') {
      body.push(...unode.expressions)
    } else {
      body.push(unode)
    }
  }
  return body
}

/**
 * 不做 Sequence 展平的语句列表（case/comm clause body 语义）。
 *
 * go 的 VisitCaseClause/VisitCommClause 直接 `append(stmts, u.visit(s))`，声明语句
 * 会保留成一个 Sequence；而 VisitBlockStmt 才会把 Sequence 展开。tree-sitter 的
 * 声明 handler 返回数组，这里要重新包成 Sequence 节点。
 */
function visitStatementsNoFlatten(b: Builder, listNode: SyntaxNode | null): UNode[] {
  const body: UNode[] = []
  if (!listNode) return body
  for (const stmt of listNode.namedChildren) {
    if (stmt.type === 'comment') continue
    const unode = b.visit(stmt)
    if (Array.isArray(unode)) {
      body.push(b.packPos(n('Sequence', { expressions: unode }), stmt))
    } else {
      body.push(unode)
    }
  }
  return body
}

function visitBlock(b: Builder, node: SyntaxNode): UNode {
  const pending = b.pendingScopeNames
  b.pendingScopeNames = []
  b.enterNewScope(pending)
  try {
    const listNode = b.child(node, 'statement_list')
    return n('ScopedStatement', { body: visitStatements(b, listNode), id: null })
  } finally {
    b.exitCurrentScope()
  }
}

function visitExprStmt(b: Builder, node: SyntaxNode): UNode {
  const inner = node.namedChildren.find((c) => c.type !== 'comment')
  return inner ? b.visit(inner) : noop()
}

function visitIncDec(op: string): Handler {
  return (bb, node) => {
    const inner = node.namedChildren.find((c) => c.type !== 'comment')
    return n('UnaryExpression', {
      operator: op,
      argument: inner ? bb.visit(inner) : noop(),
      isSuffix: true,
    })
  }
}

function visitReturn(b: Builder, node: SyntaxNode): UNode {
  const listNode = b.child(node, 'expression_list')
  const results = listNode ? listNode.namedChildren.filter((c) => c.type !== 'comment') : []
  const elts = results.map((r) => b.visit(r))
  let arg: UNode
  if (elts.length === 1) arg = elts[0]
  else if (elts.length === 0) arg = noop()
  else arg = n('TupleExpression', { elements: elts, modifiable: false })
  return n('ReturnStatement', { argument: arg, isYield: false })
}

function visitSend(b: Builder, node: SyntaxNode): UNode {
  return n('BinaryExpression', {
    operator: 'push',
    left: b.visit(node.childForFieldName('channel')),
    right: b.visit(node.childForFieldName('value')),
  })
}

function visitGo(b: Builder, node: SyntaxNode): UNode {
  const inner = node.namedChildren.find((c) => c.type !== 'comment')
  const ret = b.visit(inner) as UNode
  ret._meta.async = true
  return ret
}

function visitDefer(b: Builder, node: SyntaxNode): UNode {
  const inner = node.namedChildren.find((c) => c.type !== 'comment')
  const ret = b.visit(inner) as UNode
  ret._meta.defer = true
  return ret
}

function visitIf(b: Builder, node: SyntaxNode): UNode {
  const condNode = node.childForFieldName('condition')
  const initNode = node.childForFieldName('initializer')
  if (!initNode) {
    return n('IfStatement', {
      test: b.visit(condNode),
      consequent: b.visit(node.childForFieldName('consequence')),
      alternative: b.visit(node.childForFieldName('alternative')),
    })
  }
  // `if v := init; cond {}` 的 v 属于 if 语句自己的隐式作用域（含 else 分支）。
  b.enterNewScope()
  try {
    const init = b.visit(initNode)
    const ifstmt = n('IfStatement', {
      test: b.visit(condNode),
      consequent: b.visit(node.childForFieldName('consequence')),
      alternative: b.visit(node.childForFieldName('alternative')),
    })
    return n('ScopedStatement', { body: [init, ifstmt], id: null })
  } finally {
    b.exitCurrentScope()
  }
}

function visitBranch(kind: string): Handler {
  return (b, node) => {
    if (kind === 'goto' || kind === 'fallthrough') return noop()
    const labelNode = node.namedChildren.find((c) => c.type === 'label_name') ?? null
    const id = labelNode ? b.visit(labelNode) : null
    if (kind === 'break') return n('BreakStatement', { label: id })
    return n('ContinueStatement', { label: id })
  }
}

function visitLabeled(b: Builder, node: SyntaxNode): UNode {
  const labelNode = node.childForFieldName('label')
  // 先 visit label，避免它消费掉下面为 LabeledStmt 设置的 pendingLoc。
  const idNode = labelNode ? b.visit(labelNode) : null
  // comment 是 tree-sitter 的 named extra，可能挂在 labeled_statement 下；
  // go/ast 无注释节点，必须排除，否则会被误当作 label 的语句。
  const stmtNode = node.namedChildren.find((c) => c.type !== 'label_name' && c.type !== 'comment')
  let bodyStmt: UNode
  if (stmtNode) {
    bodyStmt = b.visit(stmtNode)
  } else {
    // 无语句的 label：go/parser 会补一个 implicit EmptyStmt，位置是后面的 `}`。
    let scope: SyntaxNode | null = node.parent
    while (scope && scope.type !== 'block' && scope.type !== 'source_file') scope = scope.parent
    const brace = scope ? scope.children.find((c) => c.type === '}') : null
    bodyStmt = brace ? b.packPosRange(noop(), brace.startIndex, brace.startIndex) : noop()
    if (brace) {
      // go/ast LabeledStmt.End() = 补出来的 implicit EmptyStmt.End = `}` 位置
      b.pendingLoc = { startIndex: node.startIndex, endIndex: brace.startIndex }
    }
  }
  return n('ScopedStatement', {
    body: [bodyStmt],
    id: idNode,
  })
}

function visitEmpty(): UNode {
  return noop()
}

function visitFor(b: Builder, node: SyntaxNode): UNode {
  // for 语句本身（init/test/update/range 变量与 body）是一个隐式作用域。
  b.enterNewScope()
  try {
    const rangeClause = b.child(node, 'range_clause')
    const bodyNode = node.childForFieldName('body')
    if (rangeClause) {
      const leftNode = rangeClause.childForFieldName('left')
      const rightNode = rangeClause.childForFieldName('right')
      const lefts = leftNode ? leftNode.namedChildren.filter((c) => c.type !== 'comment') : []
      const key = lefts.length >= 1 ? b.visit(lefts[0]) : noop()
      const value = lefts.length >= 2 ? b.visit(lefts[1]) : noop()
      const right = b.visit(rightNode)
      if (rangeClause.children.some(c => c.type === ':=')) {
        for (const left of lefts) if (isIdentLike(left)) b.registerDecl(left.text, { kind: 'other' })
      }
      return n('RangeStatement', {
        key,
        value,
        right,
        body: b.visit(bodyNode),
      })
    }
    const clause = b.child(node, 'for_clause')
    if (clause) {
      return n('ForStatement', {
        init: b.visit(clause.childForFieldName('initializer')),
        test: b.visit(clause.childForFieldName('condition')),
        update: b.visit(clause.childForFieldName('update')),
        body: b.visit(bodyNode),
      })
    }
    // condition-only / empty
    const cond = node.namedChildren.find((c) => c.type !== 'block' && c.type !== 'comment') ?? null
    return n('ForStatement', {
      init: b.visit(null),
      test: cond ? b.visit(cond) : b.visit(null),
      update: b.visit(null),
      body: b.visit(bodyNode),
    })
  } finally {
    b.exitCurrentScope()
  }
}

function visitCaseClause(
  b: Builder,
  node: SyntaxNode,
  tagid: UNode | null,
  guardNames: string[] = []
): UNode {
  // 每个 case clause 的 body 是独立块作用域；type switch 的 guard 名在所有 case 里可见。
  b.enterNewScope(guardNames)
  try {
    const exprs: UNode[] = []
    let listNode: SyntaxNode | null = null
    if (node.type === 'expression_case') listNode = node.childForFieldName('value')
    else if (node.type === 'type_case') listNode = null
    if (listNode) {
      for (const expr of listNode.namedChildren) {
        if (expr.type === 'comment') continue
        const e = b.visit(expr)
        if (tagid) {
          exprs.push(n('BinaryExpression', { operator: '==', left: tagid, right: e }))
        } else {
          exprs.push(e)
        }
      }
    } else if (node.type === 'type_case') {
      for (const c of node.namedChildren) {
        if (c.type === 'statement_list' || c.type === 'comment') continue
        const e = b.visit(c)
        if (tagid) exprs.push(n('BinaryExpression', { operator: '==', left: tagid, right: e }))
        else exprs.push(e)
      }
    }
    let test: UNode | null = null
    if (exprs.length !== 0) {
      test = exprs[0]
      for (const expr of exprs.slice(1)) {
        test = n('BinaryExpression', { operator: '||', left: test, right: expr })
      }
    }
    const stmts = visitStatementsNoFlatten(b, b.child(node, 'statement_list'))
    return n('CaseClause', {
      test,
      body: n('ScopedStatement', { body: stmts, id: null }),
    })
  } finally {
    b.exitCurrentScope()
  }
}

function visitSwitch(b: Builder, node: SyntaxNode): UNode {
  // switch（含 init）整体是一个隐式作用域，各 case 在其内另有独立作用域。
  b.enterNewScope()
  try {
    const disc: UNode[] = []
    const initNode = node.childForFieldName('initializer')
    if (initNode) disc.push(b.visit(initNode))
    const tagNode = node.childForFieldName('value')
    if (tagNode) disc.push(b.visit(tagNode))
    const cases: UNode[] = []
    for (const c of node.namedChildren) {
      if (c.type === 'expression_case' || c.type === 'default_case') {
        cases.push(visitCaseClause(b, c, null))
      }
    }
    return n('SwitchStatement', {
      discriminant: n('Sequence', { expressions: disc }),
      cases,
    })
  } finally {
    b.exitCurrentScope()
  }
}

function visitTypeSwitch(b: Builder, node: SyntaxNode): UNode {
  // type switch（含 init/guard）整体是一个隐式作用域；guard 名在每个 case 内可见。
  b.enterNewScope()
  try {
    const disc: UNode[] = []
    const initNode = node.childForFieldName('initializer')
    if (initNode) disc.push(b.visit(initNode))
    const aliasNode = node.childForFieldName('alias')
    const valueNode = node.childForFieldName('value')
    const guardNames: string[] = []
    if (aliasNode) {
      for (const c of aliasNode.namedChildren) {
        if (isIdentLike(c) && c.text !== '_') guardNames.push(c.text)
      }
    }
    if (aliasNode) {
      const lhs = aliasNode.namedChildren.filter((c) => c.type !== 'comment')
      // 复刻 go/ast: AssignStmt{ Lhs: alias, Rhs: [TypeAssertExpr{ X: value, Type: nil }] }
      const typeAssert = n('BinaryExpression', {
        operator: 'instanceof',
        left: b.visit(valueNode),
        right: noop(),
      }, { type: metaNoop() })
      const rparen0 = [...node.children].reverse().find((c) => c.type === ')')
      if (valueNode) {
        b.packPosRange(typeAssert, valueNode.startIndex, rparen0 ? rparen0.endIndex : node.endIndex)
      }
      const assign = visitAssignGeneric(b, lhs, [], true, ':=', [typeAssert])
      // AssignStmt 的 go/ast range = Lhs[0].Pos .. Rhs[0].End（即最后的 `)`）
      const rparen = [...node.children].reverse().find((c) => c.type === ')')
      if (assign && aliasNode) {
        b.packPosRange(assign, aliasNode.startIndex, rparen ? rparen.endIndex : node.endIndex)
      }
      disc.push(assign)
      if (lhs.length > 0) disc.push(b.visit(lhs[0]))
    } else if (valueNode) {
      // `switch x.(type)` 无 alias：Assign 是 ExprStmt{X: TypeAssertExpr}
      const rparen = [...node.children].reverse().find((c) => c.type === ')')
      const typeAssert = n('BinaryExpression', {
        operator: 'instanceof',
        left: b.visit(valueNode),
        right: noop(),
      }, { type: metaNoop() })
      b.packPosRange(typeAssert, valueNode.startIndex, rparen ? rparen.endIndex : node.endIndex)
      disc.push(typeAssert)
    }
    const cases: UNode[] = []
    for (const c of node.namedChildren) {
      if (c.type === 'type_case' || c.type === 'default_case') {
        cases.push(visitCaseClause(b, c, null, guardNames))
      }
    }
    return n('SwitchStatement', {
      discriminant: n('Sequence', { expressions: disc }),
      cases,
    })
  } finally {
    b.exitCurrentScope()
  }
}

function visitSelect(b: Builder, node: SyntaxNode): UNode {
  b.enterNewScope()
  try {
    const body: UNode[] = []
    for (const c of node.namedChildren) {
      if (c.type === 'communication_case' || c.type === 'default_case') {
        const clause = visitCommClause(b, c)
        // go/ast CommClause.End() = 最后一个 body 语句的 End；body 为空时用
        // Comm.End()（default 无 Comm 用 Colon+1）。tree-sitter 的 case 节点
        // 会把尾部换行也算进去，所以要单独算。
        const list = b.child(c, 'statement_list')
        const stmts = list ? list.namedChildren.filter((x) => x.type !== 'comment') : []
        // go/ast CommClause.End()：有 body 用最后一个语句的 End，否则 Colon+1
        // （即 tree-sitter case 节点自身的 endIndex）。
        const endIndex = stmts.length > 0 ? stmts[stmts.length - 1].endIndex : c.endIndex
        b.packPosRange(clause, c.startIndex, endIndex)
        body.push(clause)
      }
    }
    return n('ScopedStatement', { body, id: null })
  } finally {
    b.exitCurrentScope()
  }
}

function visitCommClause(b: Builder, node: SyntaxNode): UNode {
  // 每个 comm clause 的 body 是独立块作用域（comm 变量只在该 case 内声明）。
  b.enterNewScope()
  try {
    const body: UNode[] = []
    if (node.type === 'communication_case') {
      const comm = node.childForFieldName('communication')
      if (comm) body.push(visitComm(b, comm))
    } else {
      body.push(noop())
    }
    for (const stmt of visitStatementsNoFlatten(b, b.child(node, 'statement_list'))) body.push(stmt)
    return n('ScopedStatement', { body, id: null })
  } finally {
    b.exitCurrentScope()
  }
}

function visitComm(b: Builder, comm: SyntaxNode): UNode {
  if (comm.type === 'send_statement') return b.visit(comm)
  if (comm.type === 'receive_statement') {
    const leftNode = comm.childForFieldName('left')
    const rightNode = comm.childForFieldName('right')
    if (leftNode) {
      const lhs = leftNode.namedChildren.filter((c) => c.type !== 'comment')
      const op = comm.children.find((c) => c.type === ':=' || c.type === '=')
      const define = op ? op.type === ':=' : false
      const ret = visitAssignGeneric(b, lhs, [], define, define ? ':=' : '=', [b.visit(rightNode)])
      if (rightNode) b.packPosRange(ret, leftNode.startIndex, rightNode.endIndex)
      return ret
    }
    return b.visit(rightNode)
  }
  return b.visit(comm)
}

// ── 赋值 ──────────────────────────────────────────────────────────────────

function visitAssignStmt(b: Builder, node: SyntaxNode): UNode {
  const leftNode = node.childForFieldName('left')
  const rightNode = node.childForFieldName('right')
  const opNode = node.childForFieldName('operator')
  const lhs = leftNode ? leftNode.namedChildren.filter((c) => c.type !== 'comment') : []
  const rhs = rightNode ? rightNode.namedChildren.filter((c) => c.type !== 'comment') : []
  const opText = opNode ? opNode.text : '='
  return visitAssignGeneric(b, lhs, rhs, opText === ':=', opText)
}

/** 只接受可安全表示的十进制整数边界，其他写法保留未知长度。 */
function decimalSliceBound(bound: SyntaxNode | null): number | null {
  if (!bound || bound.type !== 'int_literal' || !/^(0|[1-9][0-9]*)$/.test(bound.text)) return null
  const value = Number(bound.text)
  return Number.isSafeInteger(value) ? value : null
}

/** 从已登记的复合字面量继承切片类型；只有常量边界才能补充长度。 */
function inferSliceAssignmentType(b: Builder, node: SyntaxNode, fallback: UNode): UNode {
  const operand = node.childForFieldName('operand')
  if (!operand || !isIdentLike(operand)) return fallback
  const decl = b.lookupDecl(operand.text)
  if (!decl || decl.kind !== 'assign' || !decl.rhs0 || decl.rhs0.type !== 'composite_literal') return fallback

  const type = b.visitAsType(decl.rhs0.childForFieldName('type'))
  if (type && type.type === 'ArrayType') {
    const high = node.childForFieldName('end')
    const low = node.childForFieldName('start')
    type.size = noop()
    const highValue = decimalSliceBound(high)
    const lowValue = low ? decimalSliceBound(low) : 0
    if (highValue !== null && lowValue !== null && highValue >= lowValue) {
      type.size = n('Literal', { literalType: 'INT', value: String(highValue - lowValue) })
    }
  }
  return type
}

/** 按右值顺序更新类型；未能推断时沿用前一个右值留下的类型。 */
function inferAssignmentType(b: Builder, node: SyntaxNode, type: UNode): UNode {
  if (isIdentLike(node)) {
    const decl = b.lookupDecl(node.text)
    if (decl && decl.kind === 'valueSpec') type = b.visit(decl.typeNode)
    if (decl && decl.kind === 'assign' && decl.rhs0 && isBasicLit(decl.rhs0)) {
      type = identifier(lowerBasicType(decl.rhs0))
    }
  }
  if (node.type === 'func_literal') type = funcTypeOfFuncLit(b, node)
  if (node.type === 'slice_expression') type = inferSliceAssignmentType(b, node, type)
  return type
}

/** 新声明优先采用已转换右值携带的类型，不重新访问源码节点。 */
function inferDeclarationType(value: UNode, fallback: UNode): UNode {
  if (value && value.type === 'CallExpression') {
    if (value.callee && value.callee.type === 'Identifier') {
      if (value.callee.name === 'make' && value.arguments.length > 0) return value.arguments[0]
    } else {
      return value.callee
    }
  } else if (value && value.type === 'Sequence') {
    return value.expressions[0].varType
  } else if (value && value.type === 'Literal') {
    return identifier((value.literalType ?? '').toLowerCase())
  }
  return fallback
}

/** 全部右值转换和类型推断先于新变量登记，保持声明与赋值的原有顺序。 */
function visitAssignGeneric(
  b: Builder,
  lhs: SyntaxNode[],
  rhsNodes: SyntaxNode[],
  define: boolean,
  opText = '=',
  rhsOverride?: UNode[]
): UNode {
  const leftValues: UNode[] = lhs.map((l) => b.visit(l))
  const rightValues: UNode[] = rhsOverride ? [...rhsOverride] : []
  let varType: UNode = dynamicType()

  for (const r of rhsNodes) {
    rightValues.push(b.visit(r))
    varType = inferAssignmentType(b, r, varType)
  }

  const exprs: UNode[] = []
  const leftLen = leftValues.length
  const rightLen = rightValues.length

  if (leftLen === rightLen) {
    for (let i = 0; i < leftLen; i++) {
      if (define) {
        const v = leftValues[i]
        if (v && v.type === 'Identifier' && v.name !== '_' && !b.isDefinedInCurrentScope(v.name)) {
          const rv = rightValues[i]
          varType = inferDeclarationType(rv, varType)
          v._meta = { ReceiveCls: '', type: varType }
          exprs.push(
            n('VariableDeclaration', {
              id: v,
              init: rv,
              cloned: true,
              varType,
              variableParam: false,
            })
          )
          // 声明后登记到当前作用域：同名再次 `:=`（含外层遮蔽）按赋值处理。
          b.setVarInCurrentScope(v.name)
          continue
        }
      }
      exprs.push(
        n('AssignmentExpression', {
          left: leftValues[i],
          right: rightValues[i],
          operator: define ? '=' : opText,
          cloned: true,
        })
      )
    }
  } else if (leftLen > rightLen && rightLen === 1) {
    const leftTuple = n('TupleExpression', { elements: leftValues, modifiable: false })
    if (define) {
      exprs.push(
        n('VariableDeclaration', {
          id: leftTuple,
          init: rightValues[0],
          cloned: true,
          varType: dynamicType(),
          variableParam: false,
        })
      )
      for (const lv of leftValues) {
        if (lv && lv.type === 'Identifier' && lv.name !== '_') b.setVarInCurrentScope(lv.name)
      }
    } else {
      exprs.push(
        n('AssignmentExpression', {
          left: leftTuple,
          right: rightValues[0],
          operator: opText,
          cloned: true,
        })
      )
    }
  }

  if (exprs.length === 0) return noop()
  if (exprs.length === 1) return exprs[0]
  return n('Sequence', { expressions: exprs })
}

// 记录 `:=` / 声明，供对象解析使用（在 visitAssignGeneric 之后由 handler 触发）。
function registerAssignTargets(b: Builder, lhs: SyntaxNode[], rhsNodes: SyntaxNode[], define: boolean): void {
  if (!define) return
  const rhs0 = rhsNodes[0] ?? null
  for (const l of lhs) {
    if (isIdentLike(l)) b.registerDecl(l.text, { kind: 'assign', rhs0 })
  }
}

function visitShortVarWithRegistry(b: Builder, node: SyntaxNode): UNode {
  const leftNode = node.childForFieldName('left')
  const rightNode = node.childForFieldName('right')
  const lhs = leftNode ? leftNode.namedChildren.filter((c) => c.type !== 'comment') : []
  const rhs = rightNode ? rightNode.namedChildren.filter((c) => c.type !== 'comment') : []
  // 在生成节点前区分新声明与当前块已有的名字，保留旧变量的类型来源。
  const newTargets = lhs.filter((l) => isIdentLike(l) && l.text !== '_' && !b.isDefinedInCurrentScope(l.text))
  const ret = visitAssignGeneric(b, lhs, rhs, true)
  registerAssignTargets(b, newTargets, rhs, true)
  return ret
}

// ── HANDLERS ──────────────────────────────────────────────────────────────

export const HANDLERS: Record<string, Handler> = {
  identifier: visitIdent,
  type_identifier: visitIdent,
  field_identifier: visitIdent,
  package_identifier: visitIdent,
  blank_identifier: visitIdent,
  label_name: visitIdent,
  true: (_b, node) => identifier(node.type),
  false: (_b, node) => identifier(node.type),
  nil: (_b, node) => identifier(node.type),
  iota: visitIdent,

  int_literal: visitBasicLit,
  float_literal: visitBasicLit,
  imaginary_literal: visitBasicLit,
  rune_literal: visitBasicLit,
  raw_string_literal: visitBasicLit,
  interpreted_string_literal: visitBasicLit,

  import_declaration: visitGenDecl,
  var_declaration: visitGenDecl,
  const_declaration: visitGenDecl,
  type_declaration: visitGenDecl,
  import_spec: visitImportSpec,
  var_spec: visitValueSpec,
  const_spec: visitValueSpec,
  type_spec: visitTypeSpec,
  type_alias: visitTypeSpec,
  struct_type: visitStructType,
  interface_type: visitInterfaceType,

  array_type: visitArrayType,
  slice_type: visitSliceType,
  implicit_length_array_type: visitImplicitLengthArrayType,
  map_type: visitMapType,
  channel_type: visitChanType,
  pointer_type: visitPointerType,
  function_type: visitFuncType,
  qualified_type: visitQualifiedType,
  generic_type: visitGenericType,
  type_constraint: visitTypeConstraint,
  type_elem: visitTypeElem,
  negated_type: visitNegatedType,
  parenthesized_type: visitParen,
  parenthesized_expression: visitParen,

  selector_expression: visitSelector,
  index_expression: visitIndex,
  type_instantiation_expression: visitInstantiation,
  type_assertion_expression: visitTypeAssert,
  call_expression: visitCall,
  type_conversion_expression: visitTypeConversion,
  variadic_argument: (b, node) => {
    const inner = node.namedChildren.find((c) => c.type !== 'comment')
    return inner ? b.visit(inner) : noop()
  },
  unary_expression: visitUnary,
  binary_expression: visitBinary,
  slice_expression: visitSlice,
  composite_literal: visitCompositeLit,
  func_literal: visitFuncLit,
  literal_value: visitElidedLiteral,

  function_declaration: visitFuncDecl,
  method_declaration: visitFuncDecl,

  block: visitBlock,
  expression_statement: visitExprStmt,
  inc_statement: visitIncDec('++'),
  dec_statement: visitIncDec('--'),
  return_statement: visitReturn,
  send_statement: visitSend,
  go_statement: visitGo,
  defer_statement: visitDefer,
  if_statement: visitIf,
  break_statement: visitBranch('break'),
  continue_statement: visitBranch('continue'),
  goto_statement: visitBranch('goto'),
  fallthrough_statement: visitBranch('fallthrough'),
  labeled_statement: visitLabeled,
  empty_statement: visitEmpty,
  for_statement: visitFor,
  expression_switch_statement: visitSwitch,
  type_switch_statement: visitTypeSwitch,
  select_statement: visitSelect,
  assignment_statement: visitAssignStmt,
  short_var_declaration: visitShortVarWithRegistry,
  expression_list: (b, node) => {
    const items = node.namedChildren.filter((c) => c.type !== 'comment')
    if (items.length === 1) return b.visit(items[0])
    return n('Sequence', { expressions: items.map((it) => b.visit(it)) })
  },
  statement_list: (b, node) => n('Sequence', { expressions: visitStatements(b, node) }),
  communication_case: (b, node) => visitCommClause(b, node),
  default_case: (b, node) => visitCaseClause(b, node, null),
  expression_case: (b, node) => visitCaseClause(b, node, null),
  type_case: (b, node) => visitCaseClause(b, node, null),
}
