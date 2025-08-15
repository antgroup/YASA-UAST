import {
  isStatement,
  isFunctionDefinition,
  isClassDefinition,
  isAssignmentExpression,
} from "../validators/generated";
import { expressionStatement } from "../builders/generated";
import type * as t from "..";

export default toStatement as {
  (node: t.AssignmentExpression, ignore?: boolean): t.ExpressionStatement;

  <T extends t.Statement>(node: T, ignore: false): T;
  <T extends t.Statement>(node: T, ignore?: boolean): T | false;

  (node: t.Node, ignore: false): t.Statement;
  (node: t.Node, ignore?: boolean): t.Statement | false;
};

function toStatement(node: t.Node, ignore?: boolean): t.Statement | false {
  if (isStatement(node)) {
    return node;
  }

  let mustHaveId = false;
  let newType;

  if (isClassDefinition(node) || isAssignmentExpression(node) || isFunctionDefinition(node)) {
    return expressionStatement(node);
  }

  // @ts-expect-error todo(flow->ts): node.id might be missing
  if (mustHaveId && !node.id) {
    newType = false;
  }

  if (!newType) {
    if (ignore) {
      return false;
    } else {
      throw new Error(`cannot turn ${node.type} to a statement`);
    }
  }

  node.type = newType;

  // @ts-expect-error todo(flow->ts) refactor to avoid type unsafe mutations like reassigning node type above
  return node;
}
