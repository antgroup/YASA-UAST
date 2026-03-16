/**
 * UAST 三层继承类型系统
 *
 * 结构: BaseNode → 6大分类 → 55个具体节点
 *
 * 注意: 这是类型层面的重新定义，不影响运行时 AST 结构
 */

import type * as Generated from './ast-types/generated'

// ===== 第1层: BaseNode =====
export interface BaseNode {
  type: string
  loc: Generated.SourceLocation
  _meta: Generated.Meta
}

// ===== 第2层: 6大分类 =====

/** CompileUnit - 翻译单元 */
export interface CompileUnitBase extends BaseNode {
  type: 'CompileUnit'
}

/** Stmt - 控制流语句 (不产生值) */
export interface StmtBase extends BaseNode {
  type:
    | 'Noop'
    | 'IfStatement'
    | 'SwitchStatement'
    | 'CaseClause'
    | 'ForStatement'
    | 'WhileStatement'
    | 'RangeStatement'
    | 'BreakStatement'
    | 'ContinueStatement'
    | 'ReturnStatement'
    | 'ThrowStatement'
    | 'ScopedStatement'
    | 'TryStatement'
    | 'CatchClause'
    | 'LabeledStatement'
    | 'ExpressionStatement'
    | 'ExportStatement'
}

/** Expr - 表达式 (产生值) */
export interface ExprBase extends BaseNode {
  type:
    | 'Literal'
    | 'ThisExpression'
    | 'SuperExpression'
    | 'UnaryExpression'
    | 'BinaryExpression'
    | 'AssignmentExpression'
    | 'ConditionalExpression'
    | 'CallExpression'
    | 'NewExpression'
    | 'MemberAccess'
    | 'SliceExpression'
    | 'CastExpression'
    | 'ImportExpression'
    | 'YieldExpression'
    | 'TupleExpression'
    | 'ObjectExpression'
    | 'ObjectProperty'
    | 'SpreadElement'
    | 'Sequence'
    | 'DereferenceExpression'
    | 'ReferenceExpression'
    | 'FunctionDefinition' // Lambda/匿名函数可作为表达式
}

/** Decl - 声明 */
export interface DeclBase extends BaseNode {
  type:
    | 'FunctionDefinition'
    | 'ClassDefinition'
    | 'VariableDeclaration'
    | 'PackageDeclaration'
}

/** Type - 类型系统 */
export interface TypeBase extends BaseNode {
  type:
    | 'PrimitiveType'
    | 'DynamicType'
    | 'VoidType'
    | 'ArrayType'
    | 'TupleType'
    | 'MapType'
    | 'PointerType'
    | 'ScopedType'
    | 'FuncType'
    | 'ChanType'
}

/** Name - 标识符 */
export interface NameBase extends BaseNode {
  type: 'Identifier'
}

// ===== 第3层: 具体节点 (真正的继承) =====

// ===== CompileUnit =====
export interface CompileUnit extends CompileUnitBase {
  type: 'CompileUnit'
  body: Array<Stmt | Expr | Decl>
  language: 'javascript' | 'typescript' | 'java' | 'golang' | 'python'
  languageVersion: number | string | boolean | null
  uri: string
  version: string
}

// ===== Stmt (17个) =====

export interface Noop extends StmtBase {
  type: 'Noop'
}

export interface IfStatement extends StmtBase {
  type: 'IfStatement'
  test: Expr
  consequent: Stmt | Expr | Decl
  alternative: (Stmt | Expr | Decl) | null
}

export interface SwitchStatement extends StmtBase {
  type: 'SwitchStatement'
  discriminant: Expr
  cases: Array<CaseClause>
}

export interface CaseClause extends StmtBase {
  type: 'CaseClause'
  test: Expr | null
  body: Stmt | Expr | Decl
}

export interface ForStatement extends StmtBase {
  type: 'ForStatement'
  init: Expr | VariableDeclaration | null
  test: Expr | null
  update: Expr | null
  body: Stmt | Expr | Decl
}

export interface WhileStatement extends StmtBase {
  type: 'WhileStatement'
  test: Expr
  body: Stmt | Expr | Decl
  isPostTest: boolean | null
}

export interface RangeStatement extends StmtBase {
  type: 'RangeStatement'
  key: VariableDeclaration | Expr | null
  value: VariableDeclaration | Expr | null
  right: Expr
  body: Stmt | Expr | Decl
}

export interface BreakStatement extends StmtBase {
  type: 'BreakStatement'
  label: Identifier | null
}

export interface ContinueStatement extends StmtBase {
  type: 'ContinueStatement'
  label: Identifier | null
}

export interface ReturnStatement extends StmtBase {
  type: 'ReturnStatement'
  argument: Expr | null
  isYield: boolean
}

export interface ThrowStatement extends StmtBase {
  type: 'ThrowStatement'
  argument: Expr | null
}

export interface ScopedStatement extends StmtBase {
  type: 'ScopedStatement'
  body: Array<Stmt | Expr | Decl>
  id: Identifier | null
}

export interface TryStatement extends StmtBase {
  type: 'TryStatement'
  body: Stmt
  handlers: Array<CatchClause> | null
  finalizer: (Stmt | Expr | Decl) | null
}

export interface CatchClause extends StmtBase {
  type: 'CatchClause'
  parameter: Array<VariableDeclaration | Sequence>
  body: Stmt | Expr | Decl
}

export interface LabeledStatement extends StmtBase {
  type: 'LabeledStatement'
  label: Identifier | null
  body: Stmt | Expr | Decl
}

export interface ExpressionStatement extends StmtBase {
  type: 'ExpressionStatement'
  expression: Expr
}

export interface ExportStatement extends StmtBase {
  type: 'ExportStatement'
  argument: Expr
  alias: Identifier
}

// ===== Expr (21个) =====

export interface Literal extends ExprBase {
  type: 'Literal'
  value: null | number | string | boolean
  literalType: 'null' | 'number' | 'string' | 'boolean'
}

export interface ThisExpression extends ExprBase {
  type: 'ThisExpression'
}

export interface SuperExpression extends ExprBase {
  type: 'SuperExpression'
}

export interface UnaryExpression extends ExprBase {
  type: 'UnaryExpression'
  operator: '-' | '+' | '++' | '--' | '~' | 'delete' | '!' | 'typeof' | 'void'
  argument: Expr
  isSuffix: boolean
}

export interface BinaryExpression extends ExprBase {
  type: 'BinaryExpression'
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
    | '??'
  left: Expr
  right: Expr
}

export interface AssignmentExpression extends ExprBase {
  type: 'AssignmentExpression'
  left: Generated.LVal
  right: Expr
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
    | '**='
  cloned: boolean | null
}

export interface ConditionalExpression extends ExprBase {
  type: 'ConditionalExpression'
  test: Expr
  consequent: Expr
  alternative: Expr
}

export interface CallExpression extends ExprBase {
  type: 'CallExpression'
  callee: Expr
  arguments: Array<Expr>
}

export interface NewExpression extends ExprBase {
  type: 'NewExpression'
  callee: Expr
  arguments: Array<Expr>
}

export interface MemberAccess extends ExprBase {
  type: 'MemberAccess'
  object: Expr
  property: Expr
  computed: boolean
}

export interface SliceExpression extends ExprBase {
  type: 'SliceExpression'
  start: (Stmt | Expr | Decl) | null
  end: (Stmt | Expr | Decl) | null
  step: (Stmt | Expr | Decl) | null
}

export interface CastExpression extends ExprBase {
  type: 'CastExpression'
  expression: Expr
  as: Type
}

export interface ImportExpression extends ExprBase {
  type: 'ImportExpression'
  from: Literal
  local: Identifier | null
  imported: Identifier | Literal | null
}

export interface YieldExpression extends ExprBase {
  type: 'YieldExpression'
  argument: Expr | null
}

export interface TupleExpression extends ExprBase {
  type: 'TupleExpression'
  elements: Array<Expr | (Stmt | Expr | Decl)>
  modifiable: boolean | null
}

export interface ObjectExpression extends ExprBase {
  type: 'ObjectExpression'
  properties: Array<ObjectProperty | SpreadElement>
  id: Identifier | null
}

export interface ObjectProperty extends ExprBase {
  type: 'ObjectProperty'
  key: Expr
  value: null | Expr
}

export interface SpreadElement extends ExprBase {
  type: 'SpreadElement'
  argument: Expr
}

export interface Sequence extends ExprBase {
  type: 'Sequence'
  expressions: Array<Stmt | Expr | Decl>
}

export interface DereferenceExpression extends ExprBase {
  type: 'DereferenceExpression'
  argument: Expr
}

export interface ReferenceExpression extends ExprBase {
  type: 'ReferenceExpression'
  argument: Expr
}

// ===== Decl (4个) =====

// FunctionDefinition: 双重分类 (Decl + Expr)
// - 作为顶层声明: function foo() {} → Decl
// - 作为表达式/值: array.map(x => x * 2) → Expr (lambda/匿名函数)
export interface FunctionDefinition extends DeclBase, ExprBase {
  type: 'FunctionDefinition'
  id: Expr | null
  parameters: Array<VariableDeclaration>
  returnType: Type
  body: Stmt | Expr | Decl
  modifiers: Array<string>
}

export interface ClassDefinition extends DeclBase {
  type: 'ClassDefinition'
  id: Identifier | null
  body: Array<Stmt | Expr | Decl>
  supers: Array<Expr>
}

export interface VariableDeclaration extends DeclBase {
  type: 'VariableDeclaration'
  id: Generated.LVal // Identifier | MemberAccess | TupleExpression
  init: Expr | null
  cloned: boolean | null
  varType: Type
  variableParam: boolean | null
}

export interface PackageDeclaration extends DeclBase {
  type: 'PackageDeclaration'
  name: Expr
}

// ===== Type (10个) =====

export interface PrimitiveType extends TypeBase {
  type: 'PrimitiveType'
  id: Identifier
  typeArguments: Array<Type> | null
  kind: 'string' | 'number' | 'boolean' | 'null'
}

export interface DynamicType extends TypeBase {
  type: 'DynamicType'
  id: Identifier | null
  typeArguments: Array<Type> | null
}

export interface VoidType extends TypeBase {
  type: 'VoidType'
  id: Identifier | null
  typeArguments: Array<Type> | null
}

export interface ArrayType extends TypeBase {
  type: 'ArrayType'
  id: Identifier
  element: Type
  typeArguments: Array<Type> | null
  size: Expr | null
}

export interface TupleType extends TypeBase {
  type: 'TupleType'
  id: Identifier
  elements: Array<Type>
  typeArguments: Array<Type> | null
}

export interface MapType extends TypeBase {
  type: 'MapType'
  id: Identifier
  keyType: Type
  valueType: Type
  typeArguments: Array<Type> | null
}

export interface PointerType extends TypeBase {
  type: 'PointerType'
  id: Identifier
  element: Type
  typeArguments: Array<Type> | null
  kind: 'pointer' | 'reference'
}

export interface ScopedType extends TypeBase {
  type: 'ScopedType'
  id: Identifier
  scope: null | Type
  typeArguments: Array<Type> | null
}

export interface FuncType extends TypeBase {
  type: 'FuncType'
  id: Identifier
  typeParams: Array<Type>
  params: Array<Type>
  results: Array<Type>
}

export interface ChanType extends TypeBase {
  type: 'ChanType'
  id: Identifier
  dir: string
  valueType: Type
}

// ===== Name (1个) =====

export interface Identifier extends NameBase {
  type: 'Identifier'
  name: string
}

// ===== 6大分类的联合类型 =====
export type Stmt =
  | Noop
  | IfStatement
  | SwitchStatement
  | CaseClause
  | ForStatement
  | WhileStatement
  | RangeStatement
  | BreakStatement
  | ContinueStatement
  | ReturnStatement
  | ThrowStatement
  | ScopedStatement
  | TryStatement
  | CatchClause
  | LabeledStatement
  | ExpressionStatement
  | ExportStatement

export type Expr =
  | Literal
  | Identifier
  | ThisExpression
  | SuperExpression
  | UnaryExpression
  | BinaryExpression
  | AssignmentExpression
  | ConditionalExpression
  | CallExpression
  | NewExpression
  | MemberAccess
  | SliceExpression
  | CastExpression
  | ImportExpression
  | YieldExpression
  | TupleExpression
  | ObjectExpression
  | ObjectProperty
  | SpreadElement
  | Sequence
  | DereferenceExpression
  | ReferenceExpression
  | FunctionDefinition // Lambda/匿名函数

export type Decl =
  | FunctionDefinition
  | ClassDefinition
  | VariableDeclaration
  | PackageDeclaration

export type Type =
  | PrimitiveType
  | DynamicType
  | VoidType
  | ArrayType
  | TupleType
  | MapType
  | PointerType
  | ScopedType
  | FuncType
  | ChanType
  | Identifier

export type Name = Identifier

export type Node = CompileUnit | Stmt | Expr | Decl | Type | Name

// ===== 类型守卫 =====

const stmtTypes = new Set([
  'Noop',
  'IfStatement',
  'SwitchStatement',
  'CaseClause',
  'ForStatement',
  'WhileStatement',
  'RangeStatement',
  'BreakStatement',
  'ContinueStatement',
  'ReturnStatement',
  'ThrowStatement',
  'ScopedStatement',
  'TryStatement',
  'CatchClause',
  'LabeledStatement',
  'ExpressionStatement',
  'ExportStatement',
])

const exprTypes = new Set([
  'Literal',
  'Identifier',
  'ThisExpression',
  'SuperExpression',
  'UnaryExpression',
  'BinaryExpression',
  'AssignmentExpression',
  'ConditionalExpression',
  'CallExpression',
  'NewExpression',
  'MemberAccess',
  'SliceExpression',
  'CastExpression',
  'ImportExpression',
  'YieldExpression',
  'TupleExpression',
  'ObjectExpression',
  'ObjectProperty',
  'SpreadElement',
  'Sequence',
  'DereferenceExpression',
  'ReferenceExpression',
  'FunctionDefinition',
])

const declTypes = new Set([
  'FunctionDefinition',
  'ClassDefinition',
  'VariableDeclaration',
  'PackageDeclaration',
])

const typeTypes = new Set([
  'PrimitiveType',
  'DynamicType',
  'VoidType',
  'ArrayType',
  'TupleType',
  'MapType',
  'PointerType',
  'ScopedType',
  'FuncType',
  'ChanType',
  'Identifier',
])

export function isCompileUnit(
  node: BaseNode | null | undefined,
): node is CompileUnit {
  if (!node) return false
  return node.type === 'CompileUnit'
}

export function isStmt(node: BaseNode | null | undefined): node is Stmt {
  if (!node) return false
  return stmtTypes.has(node.type)
}

export function isExpr(node: BaseNode | null | undefined): node is Expr {
  if (!node) return false
  return exprTypes.has(node.type)
}

export function isDecl(node: BaseNode | null | undefined): node is Decl {
  if (!node) return false
  return declTypes.has(node.type)
}

export function isType(node: BaseNode | null | undefined): node is Type {
  if (!node) return false
  return typeTypes.has(node.type)
}

export function isName(node: BaseNode | null | undefined): node is Name {
  if (!node) return false
  return node.type === 'Identifier'
}
