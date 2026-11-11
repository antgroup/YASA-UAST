/**
 * UAST 节点构造工具。
 *
 * 所有字段严格对齐 uast/asttype.go 的 JSON tag：
 * - 没有 `omitempty` 的字段即使是零值也会出现在 JSON 里（nil 指针/slice → null，
 *   Go 里 `make(..., 0)` 的 slice → []）；
 * - `_meta`（嵌入的 Meta）永远存在，且 `ReceiveCls` 没有 omitempty，所以恒为
 *   `{ ReceiveCls: '' }` 起步。
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UNode = any

/** 构造一个带 loc/_meta 的 UAST 节点。 */
export function n(type: string, fields: Record<string, unknown> = {}, meta: Record<string, unknown> = {}): UNode {
  return { type, ...fields, loc: null, _meta: { ReceiveCls: '', ...meta } }
}

export function noop(): UNode {
  return n('Noop')
}

/**
 * 放进 `_meta.type` 的 Noop。
 *
 * go 版的 defaults.Set 不会递归进嵌入的 Meta 结构，所以作为 Meta.Type 的
 * `*Noop{}` 的 Type 字段保持空字符串（而不是默认的 "Noop"）。
 */
export function metaNoop(): UNode {
  return n('')
}

export function dynamicType(): UNode {
  return n('DynamicType', { id: null, typeArguments: null })
}

export function identifier(name: string): UNode {
  return n('Identifier', { name })
}

/**
 * 返回树具有 JSON 边界的值语义。首次出现的对象保留，后续引用局部复制；
 * 不生成项目级 JSON 字符串，也不保留复制图中的别名。
 */
export function detachSharedObjects<T>(value: T, seen: WeakSet<object> | Set<object> = new WeakSet<object>()): T {
  if (!value || typeof value !== 'object') return value
  let result: any = value
  if (seen.has(value)) result = Array.isArray(value) ? [...value] : { ...value }
  seen.add(result)
  for (const key of Object.keys(result)) result[key] = detachSharedObjects(result[key], seen)
  return result
}
