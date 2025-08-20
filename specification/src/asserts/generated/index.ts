/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'make build'
 */
import is from '../../validators/is'
import type * as t from '../..'

function assert(type: string, node: any, opts?: any): void {
  if (!is(type, node, opts)) {
    throw new Error(
      `Expected type "${type}" with option ${JSON.stringify(opts)}, ` +
        `but instead got "${node.type}".`
    )
  }
}

export function assertNoop(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Noop {
  assert('Noop', node, opts)
}
export function assertLiteral(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Literal {
  assert('Literal', node, opts)
}
export function assertIdentifier(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Identifier {
  assert('Identifier', node, opts)
}
export function assertCompileUnit(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.CompileUnit {
  assert('CompileUnit', node, opts)
}
export function assertExportStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ExportStatement {
  assert('ExportStatement', node, opts)
}
export function assertIfStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.IfStatement {
  assert('IfStatement', node, opts)
}
export function assertSwitchStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.SwitchStatement {
  assert('SwitchStatement', node, opts)
}
export function assertCaseClause(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.CaseClause {
  assert('CaseClause', node, opts)
}
export function assertForStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ForStatement {
  assert('ForStatement', node, opts)
}
export function assertWhileStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.WhileStatement {
  assert('WhileStatement', node, opts)
}
export function assertRangeStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.RangeStatement {
  assert('RangeStatement', node, opts)
}
export function assertLabeledStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.LabeledStatement {
  assert('LabeledStatement', node, opts)
}
export function assertReturnStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ReturnStatement {
  assert('ReturnStatement', node, opts)
}
export function assertBreakStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.BreakStatement {
  assert('BreakStatement', node, opts)
}
export function assertContinueStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ContinueStatement {
  assert('ContinueStatement', node, opts)
}
export function assertThrowStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ThrowStatement {
  assert('ThrowStatement', node, opts)
}
export function assertTryStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.TryStatement {
  assert('TryStatement', node, opts)
}
export function assertCatchClause(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.CatchClause {
  assert('CatchClause', node, opts)
}
export function assertExpressionStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ExpressionStatement {
  assert('ExpressionStatement', node, opts)
}
export function assertScopedStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ScopedStatement {
  assert('ScopedStatement', node, opts)
}
export function assertBinaryExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.BinaryExpression {
  assert('BinaryExpression', node, opts)
}
export function assertUnaryExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.UnaryExpression {
  assert('UnaryExpression', node, opts)
}
export function assertAssignmentExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.AssignmentExpression {
  assert('AssignmentExpression', node, opts)
}
export function assertSequence(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Sequence {
  assert('Sequence', node, opts)
}
export function assertCastExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.CastExpression {
  assert('CastExpression', node, opts)
}
export function assertConditionalExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ConditionalExpression {
  assert('ConditionalExpression', node, opts)
}
export function assertSuperExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.SuperExpression {
  assert('SuperExpression', node, opts)
}
export function assertThisExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ThisExpression {
  assert('ThisExpression', node, opts)
}
export function assertMemberAccess(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.MemberAccess {
  assert('MemberAccess', node, opts)
}
export function assertSliceExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.SliceExpression {
  assert('SliceExpression', node, opts)
}
export function assertTupleExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.TupleExpression {
  assert('TupleExpression', node, opts)
}
export function assertObjectExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ObjectExpression {
  assert('ObjectExpression', node, opts)
}
export function assertObjectProperty(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ObjectProperty {
  assert('ObjectProperty', node, opts)
}
export function assertCallExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.CallExpression {
  assert('CallExpression', node, opts)
}
export function assertNewExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.NewExpression {
  assert('NewExpression', node, opts)
}
export function assertFunctionDefinition(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.FunctionDefinition {
  assert('FunctionDefinition', node, opts)
}
export function assertClassDefinition(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ClassDefinition {
  assert('ClassDefinition', node, opts)
}
export function assertVariableDeclaration(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.VariableDeclaration {
  assert('VariableDeclaration', node, opts)
}
export function assertDereferenceExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.DereferenceExpression {
  assert('DereferenceExpression', node, opts)
}
export function assertReferenceExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ReferenceExpression {
  assert('ReferenceExpression', node, opts)
}
export function assertImportExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ImportExpression {
  assert('ImportExpression', node, opts)
}
export function assertSpreadElement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.SpreadElement {
  assert('SpreadElement', node, opts)
}
export function assertYieldExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.YieldExpression {
  assert('YieldExpression', node, opts)
}
export function assertPackageDeclaration(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.PackageDeclaration {
  assert('PackageDeclaration', node, opts)
}
export function assertPrimitiveType(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.PrimitiveType {
  assert('PrimitiveType', node, opts)
}
export function assertArrayType(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ArrayType {
  assert('ArrayType', node, opts)
}
export function assertPointerType(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.PointerType {
  assert('PointerType', node, opts)
}
export function assertMapType(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.MapType {
  assert('MapType', node, opts)
}
export function assertScopedType(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ScopedType {
  assert('ScopedType', node, opts)
}
export function assertTupleType(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.TupleType {
  assert('TupleType', node, opts)
}
export function assertChanType(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.ChanType {
  assert('ChanType', node, opts)
}
export function assertFuncType(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.FuncType {
  assert('FuncType', node, opts)
}
export function assertDynamicType(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.DynamicType {
  assert('DynamicType', node, opts)
}
export function assertVoidType(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.VoidType {
  assert('VoidType', node, opts)
}
export function assertStandardized(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Standardized {
  assert('Standardized', node, opts)
}
export function assertInstruction(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Instruction {
  assert('Instruction', node, opts)
}
export function assertExpression(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Expression {
  assert('Expression', node, opts)
}
export function assertStatement(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Statement {
  assert('Statement', node, opts)
}
export function assertLVal(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.LVal {
  assert('LVal', node, opts)
}
export function assertType(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Type {
  assert('Type', node, opts)
}
export function assertConditional(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Conditional {
  assert('Conditional', node, opts)
}
export function assertLoop(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Loop {
  assert('Loop', node, opts)
}
export function assertScopable(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Scopable {
  assert('Scopable', node, opts)
}
export function assertDeclaration(
  node: object | null | undefined,
  opts?: object | null
): asserts node is t.Declaration {
  assert('Declaration', node, opts)
}
