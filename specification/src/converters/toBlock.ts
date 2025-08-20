import {
  isFunctionDefinition,
  isStatement, isScopedStatement,
} from "../validators/generated";
import {
  returnStatement,
  expressionStatement,
  scopedStatement,
} from "../builders/generated";
import type * as t from "..";

export default function toScopedStatement(
    node: t.Statement | t.Expression,
    parent?: t.Node,
): t.ScopedStatement {
  if (isScopedStatement(node)) {
    return node;
  }

  let blockNodes = [];

  if (!isStatement(node)) {
    if (isFunctionDefinition(parent)) {
      node = returnStatement(node);
    } else {
      node = expressionStatement(node);
    }
  }

  blockNodes = [node];

  return scopedStatement(blockNodes);
}
