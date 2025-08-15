import {
  isCatchClause,isScopable,
  isScopedStatement, isFunctionDefinition,
} from "./generated";
import type * as t from "..";

/**
 * Check if the input `node` is a scope.
 */
export default function isScope(node: t.Node, parent: t.Node): boolean {
  // If a BlockStatement is an immediate descendent of a Function/CatchClause, it must be in the body.
  // Hence we skipped the parentKey === "params" check
  if (isScopedStatement(node) && (isFunctionDefinition(parent) || isCatchClause(parent))) {
    return false;
  }

  // If a Pattern is an immediate descendent of a Function/CatchClause, it must be in the params.
  // Hence we skipped the parentKey === "params" check
  if (isFunctionDefinition(parent) || isCatchClause(parent)) {
    return true;
  }

  return isScopable(node);
}
