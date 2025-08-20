import { isIdentifier } from "../validators/generated";
import { literal } from "../builders/generated";
import type * as t from "..";

export default function toComputedKey(
  node:
    | t.MemberAccess,
  // @ts-expect-error todo(flow->ts): maybe check the type of node before accessing .key and .property
  key: t.Expression = node.key || node.property,
) {
  if (!node.computed && isIdentifier(key)) key = literal(key.name, "string");

  return key;
}
