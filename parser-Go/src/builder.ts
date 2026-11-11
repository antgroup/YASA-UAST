/**
 * Builder：把 Go 源码的 tree-sitter CST 构建成 UAST。
 *
 * 以原版 Go parser 的节点表示为参照：
 * - Builder 持有作用域、tmp 变量、类型声明表等状态；
 * - visitor.ts 的 HANDLERS 按 CST 类型分派，并处理两种语法树之间的差异。
 */
import type { Node as SyntaxNode } from 'web-tree-sitter'
import { packPos } from './loc'
import type { Location, SourceMap } from './loc'
import type { ParseError } from './loader'
import { HANDLERS } from './visitor'
import { identifier, n, noop, detachSharedObjects } from './nodes'
import type { UNode } from './nodes'

export const LANGUAGE = 'golang'
export const VERSION = '1.18'

export { n, noop }
export type { UNode }

/** 声明信息，用于近似 go/parser 的 ast.Object 解析（id.Obj.Decl）。 */
export type DeclInfo =
  | { kind: 'valueSpec'; typeNode: SyntaxNode | null }
  | { kind: 'assign'; rhs0: SyntaxNode | null }
  | { kind: 'other' }

// BuildState 位
export const NormalState = 1 << 0
export const TypeState = 1 << 1

export interface PackagePathInfo {
  PathName: string
  files: Record<string, NodeInfo>
  subs: Record<string, PackagePathInfo>
}

export interface NodeInfo {
  node: UNode
  packageName: string
}

/** 一个文件构建所需的输入。 */
export interface FileInput {
  /** packageInfo.files 中的文件 key，同时用于错误诊断。 */
  name: string
  /** 用于 loc.sourcefile 的展示路径（通常等于 name）。 */
  displayPath: string
  rootNode: SyntaxNode
  source: SourceMap
}

/** 同目录、同包名的构建输入；同包多文件共享 Builder 状态。 */
export interface PackageInput {
  /** package 在 packages map 中的 key，决定 packageInfo.subs 的层级。 */
  packageKey: string
  /** go/ast Package.Name（单文件模式为 __single__）。 */
  packageName: string
  files: FileInput[]
}

/** 文件级（可恢复）错误项，形状对齐 wasm 版 uast.ParseError。 */
export interface BuildError extends ParseError {}

/** 依据 package key 计算 packageInfo.subs 的层级（对应 go 版 build()）。 */
export function packagePaths(packageKey: string): string[] {
  if (packageKey === '/') return ['/']
  const parts = packageKey.split('/')
  return ['/'].concat(parts.slice(1))
}

const TOP_LEVEL_DECLARATIONS = new Set([
  'import_declaration',
  'var_declaration',
  'const_declaration',
  'type_declaration',
  'function_declaration',
  'method_declaration',
])

export function isTopLevelDeclaration(node: SyntaxNode): boolean {
  return TOP_LEVEL_DECLARATIONS.has(node.type)
}

/** 路径键可能与 Object.prototype 属性同名，写入自有属性并保持普通 JSON 对象形状。 */
function setPathEntry<T>(entries: Record<string, T>, key: string, value: T): void {
  Object.defineProperty(entries, key, {
    value, enumerable: true, writable: true, configurable: true,
  })
}

export class Builder {
  public typeDecls = new Map<string, SyntaxNode>()
  public type2Class = new Map<number, UNode>()
  public import2Stmt = new Map<number, UNode>()

  public tmpVarIndex = 0
  public currState = NormalState
  public varScope: Array<Map<string, boolean>> = []
  public objScopes: Array<Map<string, DeclInfo>> = []
  /** 待注入下一个块作用域的参数/具名返回值/receiver 名（对应 go 的隐式函数作用域）。 */
  public pendingScopeNames: string[] = []

  public sourceMap!: SourceMap
  public displayPath = ''
  /** 当前正在构建的文件路径（记录 file-level error 用）。 */
  public currentFile = ''
  /** 当前 package 收集到的 file-level 错误。 */
  public errors: BuildError[] = []
  /** handler 可设置一次性 loc 覆盖（用于 go/ast 与 CST 范围不一致的节点）。 */
  public pendingLoc: { startIndex: number; endIndex: number } | null = null

  private root!: SyntaxNode
  private pkg: PackageInput | null = null
  /** 每个文件自己的顶层 var/const 作用域（模拟 go/parser 的 per-file 解析）。 */
  private fileScopes = new Map<number, Map<string, DeclInfo>>()
  /**
   * 每个 tree 对应的文件上下文。跨文件引用（如 composite literal 解析另一个文件里
   * 声明的 struct 字段）时，节点的 loc 必须用它自己文件的 SourceMap，等价于 go 的
   * 全局 token.FileSet。
   */
  private treeContexts = new WeakMap<object, { source: SourceMap; displayPath: string }>()

  private setCurrentFile(file: FileInput): void {
    this.sourceMap = file.source
    this.displayPath = file.displayPath
    this.root = file.rootNode
    this.currentFile = file.name
  }

  /** 记录一条 file-level 错误（不中断构建）。 */
  public recordError(severity: 'warning' | 'error', kind: string, message: string): void {
    this.errors.push({ file: this.currentFile, message, severity, kind })
  }

  /** 对应 prepareBuildPackage：每个 package 重置状态，然后预处理该 package 全部文件。 */
  public prepareBuildPackage(input: PackageInput): void {
    this.pkg = input
    this.typeDecls = new Map()
    this.type2Class = new Map()
    this.import2Stmt = new Map()
    this.tmpVarIndex = 0
    this.varScope = []
    this.objScopes = []
    this.pendingScopeNames = []
    this.errors = []
    this.fileScopes = new Map()

    // 每个文件的 package/file 作用域（go/parser 对每个文件独立做对象解析）。
    input.files.forEach((f, i) => {
      this.setCurrentFile(f)
      this.treeContexts.set(f.rootNode.tree as unknown as object, {
        source: f.source,
        displayPath: f.displayPath,
      })
      const scope = new Map<string, DeclInfo>()
      for (const decl of this.topLevelDecls(f.rootNode)) {
        if (decl.type !== 'var_declaration' && decl.type !== 'const_declaration') continue
        for (const spec of this.specsOf(decl)) {
          const typeNode = spec.childForFieldName('type')
          for (const name of spec.childrenForFieldName('name')) {
            if (!/^[A-Za-z_\p{L}][\w\p{L}\p{N}]*$/u.test(name.text)) continue
            scope.set(name.text, { kind: 'valueSpec', typeNode })
          }
        }
      }
      this.fileScopes.set(i, scope)
    })
    this.preprocessTypeDecl()
  }

  /** 预处理该 package 所有文件的顶层 type 声明（对应 go 版 preprocessTypeDecl）。 */
  private preprocessTypeDecl(): void {
    if (!this.pkg) return
    for (const f of this.pkg.files) {
      this.setCurrentFile(f)
      for (const decl of this.topLevelDecls(f.rootNode)) {
        if (decl.type !== 'type_declaration') continue
        for (const spec of this.specsOf(decl)) {
          // VisitTypeSpec 内部缓存 type2Class / typeDecls（跨文件共享）。
          this.visit(spec)
        }
      }
    }
  }

  /** source_file 下真正的声明节点（跳过 package_clause / comment）。 */
  public topLevelDecls(root: SyntaxNode = this.root): SyntaxNode[] {
    return root.namedChildren.filter(isTopLevelDeclaration)
  }

  public specsOf(decl: SyntaxNode): SyntaxNode[] {
    const SPEC_TYPES = new Set([
      'var_spec',
      'const_spec',
      'type_spec',
      'type_alias',
      'import_spec',
    ])
    const out: SyntaxNode[] = []
    for (const c of decl.namedChildren) {
      if (SPEC_TYPES.has(c.type)) {
        out.push(c)
      } else if (c.type.endsWith('_spec_list')) {
        // 带括号的声明块，例如 var ( ... ) / const ( ... ) / type ( ... )
        for (const s of c.namedChildren) {
          if (SPEC_TYPES.has(s.type)) out.push(s)
        }
      }
    }
    return out
  }

  /** 节点所属文件上下文（跨文件引用时用节点自己文件的 SourceMap）。 */
  private contextFor(node: SyntaxNode): { source: SourceMap; displayPath: string } {
    const tree = (node as unknown as { tree?: object }).tree
    if (tree) {
      const ctx = this.treeContexts.get(tree)
      if (ctx) return ctx
    }
    return { source: this.sourceMap, displayPath: this.displayPath }
  }

  public locOf(node: SyntaxNode): Location {
    const ctx = this.contextFor(node)
    return ctx.source.location(node.startIndex, node.endIndex, ctx.displayPath)
  }

  /** 输入为当前文件的 UTF-16 下标；输出列号按 UTF-8 字节计算。 */
  public locRange(startIndex: number, endIndex: number): Location {
    return this.sourceMap.location(startIndex, endIndex, this.displayPath)
  }

  public packPos<T extends UNode>(unode: T, node: SyntaxNode): T {
    return packPos(unode, this.locOf(node))
  }

  public packPosRange<T extends UNode>(unode: T, startIndex: number, endIndex: number): T {
    return packPos(unode, this.locRange(startIndex, endIndex))
  }

  /** 对应 go 版 visit(node)：分派 + packPos。 */
  public visit(node: SyntaxNode | null | undefined): UNode | null {
    if (!node) return noop()
    const handler = HANDLERS[node.type]
    if (!handler) {
      // 对齐 wasm 版：未知节点记 warning/unsupported_node 并降级为 Noop（不 panic）。
      this.recordError(
        'warning',
        'unsupported_node',
        `node type not found: ${node.type} (parent ${node.parent ? node.parent.type : '<none>'})`
      )
      return noop()
    }
    const ret = handler(this, node)
    if (ret === null || ret === undefined) return null
    if (this.pendingLoc) {
      const { startIndex, endIndex } = this.pendingLoc
      this.pendingLoc = null
      return this.packPosRange(ret, startIndex, endIndex)
    }
    // 声明列表是容器，位置属于列表内的节点；数组属性无法表达为 UAST JSON。
    return Array.isArray(ret) ? ret : this.packPos(ret, node)
  }

  public visitAsType(node: SyntaxNode | null | undefined): UNode {
    return this.visit(node) as UNode
  }

  /** 与 visit 相同，但显式区分 null（返回 Noop）。 */
  public visitMaybe(node: SyntaxNode | null | undefined): UNode {
    if (!node) return noop()
    return this.visit(node) as UNode
  }

  public handleInBuildState(newState: number, action: () => void): void {
    const old = this.currState
    this.currState |= newState
    try {
      action()
    } finally {
      this.currState = old
    }
  }

  public isInBuildState(state: number): boolean {
    return (state & this.currState) !== 0
  }

  // ── 作用域 ──────────────────────────────────────────────────────────────
  public enterNewScope(names: string[] = []): void {
    const scope = new Map<string, boolean>()
    for (const name of names) {
      if (name && name !== '_') scope.set(name, true)
    }
    this.varScope.push(scope)
    this.objScopes.push(new Map(names.filter(name => name && name !== '_').map(name => [name, { kind: 'other' } as DeclInfo])))
  }

  public exitCurrentScope(): void {
    this.varScope.pop()
    this.objScopes.pop()
  }

  public setVarInCurrentScope(name: string): void {
    if (this.varScope.length === 0) this.enterNewScope()
    this.varScope[this.varScope.length - 1].set(name, true)
  }

  public isDefinedInCurrentScope(name: string): boolean {
    if (this.varScope.length === 0) return false
    return this.varScope[this.varScope.length - 1].has(name)
  }

  public registerDecl(name: string, info: DeclInfo): void {
    if (this.objScopes.length === 0) this.objScopes.push(new Map())
    this.objScopes[this.objScopes.length - 1].set(name, info)
  }

  public lookupDecl(name: string): DeclInfo | null {
    for (let i = this.objScopes.length - 1; i >= 0; i--) {
      const found = this.objScopes[i].get(name)
      if (found) return found
    }
    return null
  }

  // ── 工具 ────────────────────────────────────────────────────────────────
  /**
   * 对应 go 版 build() 里单个 file 的 CompileUnit 构造：
   * package name + 依次 visit 顶层声明，最后 packPos 整个文件。
   */
  public buildCompileUnit(file: FileInput, fileIndex: number): UNode {
    this.setCurrentFile(file)
    this.varScope = []
    this.pendingScopeNames = []
    // 每个文件独立的对象解析作用域（go/parser 行为）。
    this.objScopes = [new Map(this.fileScopes.get(fileIndex) ?? [])]

    const cu = n('CompileUnit', {
      body: [],
      language: LANGUAGE,
      languageVersion: VERSION,
      uri: '',
      version: '',
    })
    const pkgClause = this.child(file.rootNode, 'package_clause')
    const pkgIdent = pkgClause ? this.child(pkgClause, 'package_identifier') : null
    // go 版调用两次 visit(file.Name)，PackageName 用第一次、ASTNode.loc 用第二次。
    const id1 = pkgIdent ? (this.visit(pkgIdent) as UNode) : identifier('')
    const id2 = pkgIdent ? (this.visit(pkgIdent) as UNode) : null
    const pd = n('PackageDeclaration', { packageName: id1 })
    pd.loc = id2 ? id2.loc : null
    cu.body.push(pd)

    const decls = this.topLevelDecls(file.rootNode)
    for (const decl of decls) {
      const r = this.visit(decl)
      if (Array.isArray(r)) cu.body.push(...r)
      else if (r) cu.body.push(r)
    }
    // go/ast File.Pos() = package 关键字；File.End() = 最后一个声明结束
    // （不包含文件尾注释/换行），所以不能用 tree-sitter source_file 的整段 range。
    const startIndex = pkgClause ? pkgClause.startIndex : file.rootNode.startIndex
    let endIndex: number
    if (decls.length > 0) {
      endIndex = decls[decls.length - 1].endIndex
    } else if (pkgIdent) {
      endIndex = pkgIdent.endIndex
    } else {
      endIndex = file.rootNode.endIndex
    }
    this.packPosRange(cu, startIndex, endIndex)
    return cu
  }

  /**
   * 构建一个 package：prepareBuildPackage（重置 + 全文件类型预处理），再逐文件
   * 构建 CompileUnit 并挂到 packageInfo 树上。同一 package 内 tmpN 连续编号、
   * type2Class/typeDecls 跨文件共享，对齐 wasm/CLI 的项目模式。
   */
  public buildPackageTree(result: PackagePathInfo, pkg: PackageInput): void {
    try {
      this.prepareBuildPackage(pkg)
      // 后续文件的方法可能追加到前面文件的类；必须完成整包后再隔离。
      const units = pkg.files.map((file, i) => this.buildCompileUnit(file, i))
      // 整包 UAST 在本次遍历中始终存活；临时 Set 避免大图 WeakSet 的处理开销，
      // 且只在本包内使用，不跨请求保留节点。
      const seen = new Set<object>()
      pkg.files.forEach((file, i) => {
        this.nestCompileUnit(result, pkg.packageKey, file.name, detachSharedObjects(units[i], seen), pkg.packageName)
      })
    } finally {
      // 释放 CST 前主动断开声明表及源文件引用；返回的 UAST 不引用这些表。
      this.typeDecls.clear()
      this.type2Class.clear()
      this.import2Stmt.clear()
      this.fileScopes.clear()
      this.objScopes = []
      this.varScope = []
      this.pendingScopeNames = []
      this.treeContexts = new WeakMap()
      this.pkg = null
      this.root = undefined!
      this.sourceMap = undefined!
    }
  }

  /** 把 CompileUnit 挂到 result.subs 的对应层级（对应 go 版 build() 的路径切分）。 */
  public nestCompileUnit(
    result: PackagePathInfo,
    packageKey: string,
    fileName: string,
    cu: UNode,
    packageName: string
  ): void {
    let cur = result.subs
    let leaf: PackagePathInfo = result
    for (const p of packagePaths(packageKey)) {
      if (!Object.prototype.hasOwnProperty.call(cur, p)) {
        setPathEntry(cur, p, { PathName: '', files: {}, subs: {} })
      }
      leaf = cur[p]
      cur = leaf.subs
    }
    setPathEntry(leaf.files, fileName, { node: cu, packageName })
  }

  public getTmpVariableName(): string {
    this.tmpVarIndex += 1
    return `tmp${this.tmpVarIndex}`
  }

  public child(node: SyntaxNode, type: string): SyntaxNode | null {
    for (const c of node.namedChildren) {
      if (c.type === type) return c
    }
    return null
  }

  public field(node: SyntaxNode, name: string): SyntaxNode | null {
    return node.childForFieldName(name)
  }

  public namedNoComments(node: SyntaxNode): SyntaxNode[] {
    return node.namedChildren.filter((c) => c.type !== 'comment')
  }

  /** 解包 literal_element 包裹。 */
  public unwrapElement(node: SyntaxNode): SyntaxNode {
    return node.type === 'literal_element' ? node.namedChildren[0] ?? node : node
  }

  public getDirectName(typ: SyntaxNode | null): string {
    if (!typ) return ''
    switch (typ.type) {
      case 'type_identifier':
      case 'identifier':
      case 'package_identifier':
      case 'field_identifier':
        return typ.text
      case 'qualified_type': {
        const name = typ.childForFieldName('name')
        return name ? name.text : ''
      }
      case 'pointer_type': {
        const el = typ.childForFieldName('type') ?? this.child(typ, 'type_identifier')
        return this.getDirectName(el)
      }
      default:
        return ''
    }
  }

  public hasEllipsis(node: SyntaxNode | null): boolean {
    if (!node) return false
    return node.children.some((c) => c.type === '...')
  }

  /** find first direct child of given anonymous type. */
  private anonChild(node: SyntaxNode, type: string): SyntaxNode | null {
    for (const c of node.children) {
      if (c.type === type) return c
    }
    return null
  }

  public ellipsisToken(node: SyntaxNode): SyntaxNode | null {
    return this.anonChild(node, '...')
  }
}
