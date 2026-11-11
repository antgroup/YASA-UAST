/**
 * 位置信息工具：把 tree-sitter 的 UTF-16 下标区间映射成与 go/token.Position 等价的
 * 1-based line / byte-column。
 *
 * go/token 的 Column 是从行首开始的字节偏移 + 1，因此这里必须在 UTF-8 字节
 * 序列上计算，而不能直接用 JS 字符串的 UTF-16 下标。
 */

export interface Position {
  line: number
  column: number
}

export interface Location {
  start: Position
  end: Position
  sourcefile: string
}

function utf8Length(codePoint: number): number {
  if (codePoint < 0x80) return 1
  if (codePoint < 0x800) return 2
  if (codePoint < 0x10000) return 3
  return 4
}

/**
 * 位置映射。
 *
 * 关键点：web-tree-sitter 的 node.startIndex/endIndex 是 **UTF-16 code unit**
 * 下标（与 JS 字符串下标一致），而 go/token 的 Column 是 **UTF-8 字节**列号。
 * 因此这里同时维护 utf16 -> byte 的偏移表，以及每行起始字节偏移。
 */
export class SourceMap {
  readonly bytes: Buffer
  private readonly byteOffsets: Uint32Array
  private readonly lineStarts: number[]

  public constructor(source: string) {
    this.bytes = Buffer.from(source, 'utf8')
    const offsets = new Uint32Array(source.length + 1)
    let byte = 0
    for (let i = 0; i < source.length; i++) {
      offsets[i] = byte
      const cp = source.codePointAt(i) as number
      const units = cp > 0xffff ? 2 : 1
      byte += utf8Length(cp)
      if (units === 2) offsets[i + 1] = byte - 2
      i += units - 1
    }
    offsets[source.length] = byte
    this.byteOffsets = offsets

    const starts = [0]
    for (let i = 0; i < this.bytes.length; i++) {
      if (this.bytes[i] === 0x0a) starts.push(i + 1)
    }
    this.lineStarts = starts
  }

  /** index 是 UTF-16 code unit 下标。 */
  public positionAt(index: number): Position {
    const idx = index < 0 ? 0 : index > this.byteOffsets.length - 1 ? this.byteOffsets.length - 1 : index
    const off = this.byteOffsets[idx]
    let lo = 0
    let hi = this.lineStarts.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (this.lineStarts[mid] <= off) lo = mid
      else hi = mid - 1
    }
    return { line: lo + 1, column: off - this.lineStarts[lo] + 1 }
  }

  public location(startIndex: number, endIndex: number, sourcefile: string): Location {
    return {
      start: this.positionAt(startIndex),
      end: this.positionAt(endIndex),
      sourcefile,
    }
  }
}

export interface PositionedNode {
  loc: Location | null
}

// 只有这些节点类型的 `id` 字段是 *Identifier（指针），需要递归补 loc；
// VariableDeclaration/FunctionDefinition 的 `id` 是 Expression 接口，Go
// 反射不会下钻。
const POINTER_ID_TYPES = new Set([
  'ClassDefinition',
  'ScopedStatement',
  'PrimitiveType',
  'ArrayType',
  'PointerType',
  'MapType',
  'ScopedType',
  'TupleType',
  'ChanType',
  'FuncType',
  'DynamicType',
  'VoidType',
])

/** 返回该节点中“指针字段”（Go 反射会递归）的 JSON 名。 */
function pointerFieldsFor(node: Record<string, unknown>): string[] {
  const t = node.type as string
  const fields: string[] = []
  if (POINTER_ID_TYPES.has(t) && 'id' in node) fields.push('id')
  if ('from' in node) fields.push('from') // ImportExpression.From *Literal
  if ('local' in node) fields.push('local') // ImportExpression.Local *Identifier
  if ('alias' in node) fields.push('alias') // ExportStatement.Alias *Identifier
  if ('label' in node) fields.push('label') // Break/Continue.Label *Identifier
  if (t === 'FunctionDefinition' && 'parameters' in node) fields.push('parameters')
  if (t === 'SwitchStatement' && 'cases' in node) fields.push('cases')
  if (t === 'TryStatement' && 'handlers' in node) fields.push('handlers')
  return fields
}

function setLocationIfNil(node: unknown, loc: Location): void {
  if (node === null || typeof node !== 'object') return
  const n = node as { loc?: Location | null }
  if (n.loc === null || n.loc === undefined) n.loc = loc
  for (const field of pointerFieldsFor(node as Record<string, unknown>)) {
    const v = (node as Record<string, unknown>)[field]
    if (Array.isArray(v)) {
      for (const el of v) setLocationIfNil(el, loc)
    } else {
      setLocationIfNil(v, loc)
    }
  }
}

/** 无条件覆盖根节点 loc，再向 Go 中“指针类型字段”的子孙补空位置。 */
export function packPos<T>(node: T, loc: Location): T {
  const obj = node as unknown as PositionedNode
  obj.loc = loc
  for (const field of pointerFieldsFor(node as Record<string, unknown>)) {
    const v = (node as Record<string, unknown>)[field]
    if (Array.isArray(v)) {
      for (const el of v) setLocationIfNil(el, loc)
    } else {
      setLocationIfNil(v, loc)
    }
  }
  return node
}
