import { memberAccess } from "../builders/generated";
import type * as t from "..";

/**
 * Prepend a node to a member expression.
 */
export default function prependToMemberAccess<
  T extends Pick<t.MemberAccess, "object" | "property">,
>(member: T, prepend: t.MemberAccess["object"]): T {
  member.object = memberAccess(prepend, member.object);

  return member;
}
