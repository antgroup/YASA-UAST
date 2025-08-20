import { memberAccess } from "../builders/generated";
import type * as t from "..";

/**
 * Append a node to a member expression.
 */
export default function appendToMemberAccess(
  member: t.MemberAccess,
  append: t.MemberAccess["property"],
  computed: boolean = false,
): t.MemberAccess {
  member.object = memberAccess(
    member.object,
    member.property,
    member.computed,
  );
  member.property = append;
  member.computed = !!computed;

  return member;
}
