import shallowEqual from "../utils/shallowEqual";
import isType from "./isType";
import isPlaceholderType from "./isPlaceholderType";
import { FLIPPED_ALIAS_KEYS } from "../definitions";
import type * as t from "..";

export default function is<T extends t.Node["type"]>(
  type: T,
  node: t.Node | null | undefined,
  opts?: undefined,
): node is Extract<t.Node, { type: T }>;

export default function is<
  T extends t.Node["type"],
  P extends Extract<t.Node, { type: T }>,
>(type: T, n: t.Node | null | undefined, required: Partial<P>): n is P;

export default function is<P extends t.Node>(
  type: string,
  node: t.Node | null | undefined,
  opts: Partial<P>,
): node is P;

export default function is(
  type: string,
  node: t.Node | null | undefined,
  opts?: Partial<t.Node>,
): node is t.Node;
/**
 * Returns whether `node` is of given `type`.
 *
 * For better performance, use this instead of `is[Type]` when `type` is unknown.
 */
export default function is(
  type: string,
  node: t.Node | null | undefined,
  opts?: Partial<t.Node>,
): node is t.Node {
  if (!node) return false;

  const matches = isType(node.type, type);
  if (!matches) {
    return false;
  }

  if (typeof opts === "undefined") {
    return true;
  } else {
    return shallowEqual(node, opts);
  }
}
