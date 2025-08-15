import {
  isExpression,
  isExpressionStatement
} from "../validators/generated";
import type * as t from "..";

export default toExpression as {
  (
    node: t.ExpressionStatement | t.Expression
  ): t.Expression;
};

function toExpression(
  node: t.ExpressionStatement | t.Expression
): t.Expression {
  if (isExpressionStatement(node)) {
    node = node.expression;
  }

  // return unmodified node
  // important for things like ArrowFunctions where
  // type change from ArrowFunction to FunctionExpression
  // produces bugs like -> `()=>a` to `function () a`
  // without generating a BlockStatement for it
  // ref: https://github.com/babel/babili/issues/130
  if (isExpression(node)) {
    return node;
  }

 // @ts-ignore
  throw new Error(`cannot turn ${node.type} to an expression`);
}
