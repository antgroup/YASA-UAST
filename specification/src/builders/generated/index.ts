/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'make build'
 */
import builder from '../builder'
import type * as t from '../..'

/* eslint-disable @typescript-eslint/no-unused-vars */

export function noop(): t.Noop {
  return builder.apply('Noop', arguments)
}
export function literal(
  value: null | number | string | boolean,
  literalType: 'null' | 'number' | 'string' | 'boolean'
): t.Literal {
  return builder.apply('Literal', arguments)
}
export function identifier(name: string): t.Identifier {
  return builder.apply('Identifier', arguments)
}
export function compileUnit(
  body: Array<t.Instruction>,
  language: 'javascript' | 'typescript' | 'java' | 'golang' | 'python',
  languageVersion: number | string | boolean | null | undefined,
  uri: string,
  version: string
): t.CompileUnit {
  return builder.apply('CompileUnit', arguments)
}
export function exportStatement(
  argument: t.Expression,
  alias: t.Identifier
): t.ExportStatement {
  return builder.apply('ExportStatement', arguments)
}
export function ifStatement(
  test: t.Expression,
  consequent: t.Instruction,
  alternative?: t.Instruction | null
): t.IfStatement {
  return builder.apply('IfStatement', arguments)
}
export function switchStatement(
  discriminant: t.Expression,
  cases: Array<t.CaseClause>
): t.SwitchStatement {
  return builder.apply('SwitchStatement', arguments)
}
export function caseClause(
  test: t.Expression | null | undefined,
  body: t.Instruction
): t.CaseClause {
  return builder.apply('CaseClause', arguments)
}
export function forStatement(
  init: t.Expression | t.VariableDeclaration | null | undefined,
  test: t.Expression | null | undefined,
  update: t.Expression | null | undefined,
  body: t.Instruction
): t.ForStatement {
  return builder.apply('ForStatement', arguments)
}
export function whileStatement(
  test: t.Expression,
  body: t.Instruction,
  isPostTest?: boolean | null
): t.WhileStatement {
  return builder.apply('WhileStatement', arguments)
}
export function rangeStatement(
  key: t.VariableDeclaration | t.Expression | null | undefined,
  value: t.VariableDeclaration | t.Expression | null | undefined,
  right: t.Expression,
  body: t.Instruction
): t.RangeStatement {
  return builder.apply('RangeStatement', arguments)
}
export function labeledStatement(
  label: t.Identifier | null | undefined,
  body: t.Instruction
): t.LabeledStatement {
  return builder.apply('LabeledStatement', arguments)
}
export function returnStatement(
  argument?: t.Expression | null,
  isYield?: boolean
): t.ReturnStatement {
  return builder.apply('ReturnStatement', arguments)
}
export function breakStatement(label?: t.Identifier | null): t.BreakStatement {
  return builder.apply('BreakStatement', arguments)
}
export function continueStatement(
  label?: t.Identifier | null
): t.ContinueStatement {
  return builder.apply('ContinueStatement', arguments)
}
export function throwStatement(
  argument?: t.Expression | null
): t.ThrowStatement {
  return builder.apply('ThrowStatement', arguments)
}
export function tryStatement(
  body: t.Statement,
  handlers?: Array<null | t.CatchClause> | null,
  finalizer?: t.Instruction | null
): t.TryStatement {
  return builder.apply('TryStatement', arguments)
}
export function catchClause(
  parameter: Array<null | t.VariableDeclaration | t.Sequence>,
  body: t.Instruction
): t.CatchClause {
  return builder.apply('CatchClause', arguments)
}
export function expressionStatement(
  expression: t.Expression
): t.ExpressionStatement {
  return builder.apply('ExpressionStatement', arguments)
}
export function scopedStatement(
  body: Array<t.Instruction>,
  id?: t.Identifier | null
): t.ScopedStatement {
  return builder.apply('ScopedStatement', arguments)
}
export function binaryExpression(
  operator:
    | '+'
    | '-'
    | '*'
    | '/'
    | '**'
    | '%'
    | '<<'
    | '>>'
    | '>>>'
    | '<<<'
    | '&&'
    | '||'
    | ',,'
    | '&'
    | ','
    | '^'
    | '<'
    | '>'
    | '<='
    | '>='
    | '=='
    | '!='
    | '|'
    | 'instanceof'
    | 'in'
    | 'push'
    | '==='
    | '!=='
    | '??',
  left: t.Expression,
  right: t.Expression
): t.BinaryExpression {
  return builder.apply('BinaryExpression', arguments)
}
export function unaryExpression(
  operator: '-' | '+' | '++' | '--' | '~' | 'delete' | '!' | 'typeof' | 'void',
  argument: t.Expression,
  isSuffix?: boolean
): t.UnaryExpression {
  return builder.apply('UnaryExpression', arguments)
}
export function assignmentExpression(
  left: t.LVal,
  right: t.Expression,
  operator:
    | '='
    | '^='
    | '&='
    | '<<='
    | '>>='
    | '>>>='
    | '+='
    | '-='
    | '*='
    | '/='
    | '%='
    | '|='
    | '**=',
  cloned?: boolean | null
): t.AssignmentExpression {
  return builder.apply('AssignmentExpression', arguments)
}
export function sequence(expressions: Array<t.Instruction>): t.Sequence {
  return builder.apply('Sequence', arguments)
}
export function castExpression(
  expression: t.Expression,
  as: t.Type
): t.CastExpression {
  return builder.apply('CastExpression', arguments)
}
export function conditionalExpression(
  test: t.Expression,
  consequent: t.Expression,
  alternative: t.Expression
): t.ConditionalExpression {
  return builder.apply('ConditionalExpression', arguments)
}
export function superExpression(): t.SuperExpression {
  return builder.apply('SuperExpression', arguments)
}
export function thisExpression(): t.ThisExpression {
  return builder.apply('ThisExpression', arguments)
}
export function memberAccess(
  object: t.Expression,
  property: t.Expression,
  computed?: boolean
): t.MemberAccess {
  return builder.apply('MemberAccess', arguments)
}
export function sliceExpression(
  start?: t.Instruction | null,
  end?: t.Instruction | null,
  step?: t.Instruction | null
): t.SliceExpression {
  return builder.apply('SliceExpression', arguments)
}
export function tupleExpression(
  elements: Array<t.Expression | t.Instruction>
): t.TupleExpression {
  return builder.apply('TupleExpression', arguments)
}
export function objectExpression(
  properties: Array<t.ObjectProperty | t.SpreadElement>,
  id?: t.Identifier | null
): t.ObjectExpression {
  return builder.apply('ObjectExpression', arguments)
}
export function objectProperty(
  key: t.Expression,
  value: null | t.Expression
): t.ObjectProperty {
  return builder.apply('ObjectProperty', arguments)
}
export function callExpression(
  callee: t.Expression,
  _arguments: Array<null | t.Expression>
): t.CallExpression {
  return builder.apply('CallExpression', arguments)
}
export function newExpression(
  callee: t.Expression,
  _arguments: Array<t.Expression>
): t.NewExpression {
  return builder.apply('NewExpression', arguments)
}
export function functionDefinition(
  id: t.Expression | null | undefined,
  parameters: Array<null | t.VariableDeclaration>,
  returnType: t.Type,
  body: t.Instruction,
  modifiers: Array<null | string>
): t.FunctionDefinition {
  return builder.apply('FunctionDefinition', arguments)
}
export function classDefinition(
  id: t.Identifier | null | undefined,
  body: Array<null | t.Instruction>,
  supers: Array<null | t.Expression>
): t.ClassDefinition {
  return builder.apply('ClassDefinition', arguments)
}
export function variableDeclaration(
  id: t.Expression,
  init: t.Expression | null | undefined,
  cloned: boolean | null | undefined,
  varType: t.Type
): t.VariableDeclaration {
  return builder.apply('VariableDeclaration', arguments)
}
export function dereferenceExpression(
  argument: t.Expression
): t.DereferenceExpression {
  return builder.apply('DereferenceExpression', arguments)
}
export function referenceExpression(
  argument: t.Expression
): t.ReferenceExpression {
  return builder.apply('ReferenceExpression', arguments)
}
export function importExpression(
  from: t.Literal,
  local?: t.Identifier | null,
  imported?: t.Identifier | t.Literal | null
): t.ImportExpression {
  return builder.apply('ImportExpression', arguments)
}
export function spreadElement(argument: t.Expression): t.SpreadElement {
  return builder.apply('SpreadElement', arguments)
}
export function yieldExpression(
  argument?: t.Expression | null
): t.YieldExpression {
  return builder.apply('YieldExpression', arguments)
}
export function packageDeclaration(name: t.Expression): t.PackageDeclaration {
  return builder.apply('PackageDeclaration', arguments)
}
export function primitiveType(
  id: t.Identifier,
  typeArguments?: Array<t.Type> | null
): t.PrimitiveType {
  return builder.apply('PrimitiveType', arguments)
}
export function arrayType(
  id: t.Identifier,
  element: t.Type,
  typeArguments?: Array<t.Type> | null,
  size?: t.Expression | null
): t.ArrayType {
  return builder.apply('ArrayType', arguments)
}
export function pointerType(
  id: t.Identifier,
  element: t.Type,
  typeArguments?: Array<t.Type> | null
): t.PointerType {
  return builder.apply('PointerType', arguments)
}
export function mapType(
  id: t.Identifier,
  keyType: t.Type,
  valueType: t.Type,
  typeArguments?: Array<t.Type> | null
): t.MapType {
  return builder.apply('MapType', arguments)
}
export function scopedType(
  id: t.Identifier,
  scope: null | t.Type,
  typeArguments?: Array<t.Type> | null
): t.ScopedType {
  return builder.apply('ScopedType', arguments)
}
export function tupleType(
  id: t.Identifier,
  elements: Array<t.Type>,
  typeArguments?: Array<t.Type> | null
): t.TupleType {
  return builder.apply('TupleType', arguments)
}
export function chanType(
  id: t.Identifier,
  dir: string,
  valueType: t.Type
): t.ChanType {
  return builder.apply('ChanType', arguments)
}
export function funcType(
  id: t.Identifier,
  typeParams: Array<t.Type>,
  params: Array<t.Type>,
  results: Array<t.Type>
): t.FuncType {
  return builder.apply('FuncType', arguments)
}
export function dynamicType(id?: t.Identifier | null): t.DynamicType {
  return builder.apply('DynamicType', arguments)
}
export function voidType(id?: t.Identifier | null): t.VoidType {
  return builder.apply('VoidType', arguments)
}
