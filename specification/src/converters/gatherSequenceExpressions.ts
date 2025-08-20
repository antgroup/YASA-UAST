import getBindingIdentifiers from "../retrievers/getBindingIdentifiers";
import {
  isExpression,
  isExpressionStatement,
  isVariableDeclaration,
  isIfStatement,
  isScopedStatement,
} from "../validators/generated";
import {
  sequence,
  assignmentExpression,
  conditionalExpression,
} from "../builders/generated";
import cloneNode from "../clone/cloneNode";
import type * as t from "..";
import type { Scope } from "./Scope";

export default function gatherSequenceExpressions(
  nodes: ReadonlyArray<t.Node>,
  scope: Scope,
  declars: Array<any>,
): t.Sequence {
  const exprs = [];

  for (const node of nodes) {
    // if we encounter emptyStatement before a non-emptyStatement
    // we want to disregard that
    if (isExpression(node)) {
      exprs.push(node);
    } else if (isExpressionStatement(node)) {
      exprs.push(node.expression);
    }}

  if (exprs.length === 1) {
    return exprs[0];
  } else {
    return sequence(exprs);
  }
}
