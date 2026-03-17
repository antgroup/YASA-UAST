/**
 * UAST 三层继承类型系统
 *
 * 结构: BaseNode → 6大分类 → 55个具体节点
 *
 * 具体节点使用交叉类型 (Generated.X & Base) 实现:
 * - 保持与 builder 函数返回类型的兼容性
 * - 通过 Base 类添加分类语义
 */

import type * as Generated from './ast-types/generated';

// ===== 第1层: BaseNode =====
export interface BaseNode {
  type: string;
  loc: Generated.SourceLocation;
  _meta: Generated.Meta;
}

// ===== 第2层: 6大分类 =====

/** CompileUnit - 翻译单元 */
export interface CompileUnitBase extends BaseNode {
  type: 'CompileUnit';
}

/** Stmt - 控制流语句 (不产生值) */
export interface StmtBase extends BaseNode {
  type: 'Noop' | 'IfStatement' | 'SwitchStatement' | 'CaseClause' | 'ForStatement' | 'WhileStatement' | 'RangeStatement'
     | 'BreakStatement' | 'ContinueStatement' | 'ReturnStatement' | 'ThrowStatement'
     | 'ScopedStatement' | 'TryStatement' | 'CatchClause'
     | 'LabeledStatement' | 'ExpressionStatement' | 'ExportStatement';
}

/** Expr - 表达式 (产生值) */
export interface ExprBase extends BaseNode {
  type: 'Literal' | 'ThisExpression' | 'SuperExpression'
     | 'UnaryExpression' | 'BinaryExpression' | 'AssignmentExpression' | 'ConditionalExpression'
     | 'CallExpression' | 'NewExpression' | 'MemberAccess' | 'SliceExpression'
     | 'CastExpression' | 'ImportExpression' | 'YieldExpression'
     | 'TupleExpression' | 'ObjectExpression' | 'ObjectProperty' | 'SpreadElement'
     | 'Sequence' | 'DereferenceExpression' | 'ReferenceExpression'
     | 'FunctionDefinition';  // Lambda/匿名函数可作为表达式
}

/** Decl - 声明 */
export interface DeclBase extends BaseNode {
  type: 'FunctionDefinition' | 'ClassDefinition' | 'VariableDeclaration' | 'PackageDeclaration';
}

/** Type - 类型系统 */
export interface TypeBase extends BaseNode {
  type: 'PrimitiveType' | 'DynamicType' | 'VoidType'
     | 'ArrayType' | 'TupleType' | 'MapType' | 'PointerType' | 'ScopedType' | 'FuncType' | 'ChanType';
}

/** Name - 标识符 */
export interface NameBase extends BaseNode {
  type: 'Identifier';
}

// ===== 第3层: 具体节点 (交叉类型 = Generated + 分类基类) =====

// ===== CompileUnit =====
export type CompileUnit = Generated.CompileUnit & CompileUnitBase;

// ===== Stmt (17个) =====
export type Noop = Generated.Noop & StmtBase;
export type IfStatement = Generated.IfStatement & StmtBase;
export type SwitchStatement = Generated.SwitchStatement & StmtBase;
export type CaseClause = Generated.CaseClause & StmtBase;
export type ForStatement = Generated.ForStatement & StmtBase;
export type WhileStatement = Generated.WhileStatement & StmtBase;
export type RangeStatement = Generated.RangeStatement & StmtBase;
export type BreakStatement = Generated.BreakStatement & StmtBase;
export type ContinueStatement = Generated.ContinueStatement & StmtBase;
export type ReturnStatement = Generated.ReturnStatement & StmtBase;
export type ThrowStatement = Generated.ThrowStatement & StmtBase;
export type ScopedStatement = Generated.ScopedStatement & StmtBase;
export type TryStatement = Generated.TryStatement & StmtBase;
export type CatchClause = Generated.CatchClause & StmtBase;
export type LabeledStatement = Generated.LabeledStatement & StmtBase;
export type ExpressionStatement = Generated.ExpressionStatement & StmtBase;
export type ExportStatement = Generated.ExportStatement & StmtBase;

// ===== Expr (21个) =====
export type Literal = Generated.Literal & ExprBase;
export type ThisExpression = Generated.ThisExpression & ExprBase;
export type SuperExpression = Generated.SuperExpression & ExprBase;
export type UnaryExpression = Generated.UnaryExpression & ExprBase;
export type BinaryExpression = Generated.BinaryExpression & ExprBase;
export type AssignmentExpression = Generated.AssignmentExpression & ExprBase;
export type ConditionalExpression = Generated.ConditionalExpression & ExprBase;
export type CallExpression = Generated.CallExpression & ExprBase;
export type NewExpression = Generated.NewExpression & ExprBase;
export type MemberAccess = Generated.MemberAccess & ExprBase;
export type SliceExpression = Generated.SliceExpression & ExprBase;
export type CastExpression = Generated.CastExpression & ExprBase;
export type ImportExpression = Generated.ImportExpression & ExprBase;
export type YieldExpression = Generated.YieldExpression & ExprBase;
export type TupleExpression = Generated.TupleExpression & ExprBase;
export type ObjectExpression = Generated.ObjectExpression & ExprBase;
export type ObjectProperty = Generated.ObjectProperty & ExprBase;
export type SpreadElement = Generated.SpreadElement & ExprBase;
export type Sequence = Generated.Sequence & ExprBase;
export type DereferenceExpression = Generated.DereferenceExpression & ExprBase;
export type ReferenceExpression = Generated.ReferenceExpression & ExprBase;

// ===== Decl (4个) =====
// FunctionDefinition: 双重分类 (Decl + Expr)
export type FunctionDefinition = Generated.FunctionDefinition & DeclBase & ExprBase;
export type ClassDefinition = Generated.ClassDefinition & DeclBase;
export type VariableDeclaration = Generated.VariableDeclaration & DeclBase;
export type PackageDeclaration = Generated.PackageDeclaration & DeclBase;

// ===== Type (10个) =====
export type PrimitiveType = Generated.PrimitiveType & TypeBase;
export type DynamicType = Generated.DynamicType & TypeBase;
export type VoidType = Generated.VoidType & TypeBase;
export type ArrayType = Generated.ArrayType & TypeBase;
export type TupleType = Generated.TupleType & TypeBase;
export type MapType = Generated.MapType & TypeBase;
export type PointerType = Generated.PointerType & TypeBase;
export type ScopedType = Generated.ScopedType & TypeBase;
export type FuncType = Generated.FuncType & TypeBase;
export type ChanType = Generated.ChanType & TypeBase;

// ===== Name (1个) =====
export type Identifier = Generated.Identifier & NameBase;

// ===== 6大分类的联合类型 =====
export type Stmt = Noop | IfStatement | SwitchStatement | CaseClause | ForStatement | WhileStatement | RangeStatement
                 | BreakStatement | ContinueStatement | ReturnStatement | ThrowStatement
                 | ScopedStatement | TryStatement | CatchClause
                 | LabeledStatement | ExpressionStatement | ExportStatement;

export type Expr = Literal | Identifier | ThisExpression | SuperExpression
                 | UnaryExpression | BinaryExpression | AssignmentExpression | ConditionalExpression
                 | CallExpression | NewExpression | MemberAccess | SliceExpression
                 | CastExpression | ImportExpression | YieldExpression
                 | TupleExpression | ObjectExpression | ObjectProperty | SpreadElement
                 | Sequence | DereferenceExpression | ReferenceExpression
                 | FunctionDefinition;  // Lambda/匿名函数

export type Decl = FunctionDefinition | ClassDefinition | VariableDeclaration | PackageDeclaration;

export type Type = PrimitiveType | DynamicType | VoidType
                 | ArrayType | TupleType | MapType | PointerType | ScopedType | FuncType | ChanType;

export type Name = Identifier;

export type Node = CompileUnit | Stmt | Expr | Decl | Type | Name;

// ===== 类型守卫 =====
export function isCompileUnit(node: BaseNode): node is CompileUnit {
  return node.type === 'CompileUnit';
}

export function isStmt(node: BaseNode): node is Stmt {
  const stmtTypes = new Set([
    'Noop', 'IfStatement', 'SwitchStatement', 'CaseClause', 'ForStatement', 'WhileStatement', 'RangeStatement',
    'BreakStatement', 'ContinueStatement', 'ReturnStatement', 'ThrowStatement',
    'ScopedStatement', 'TryStatement', 'CatchClause',
    'LabeledStatement', 'ExpressionStatement', 'ExportStatement'
  ]);
  return stmtTypes.has(node.type);
}

export function isExpr(node: BaseNode): node is Expr {
  const exprTypes = new Set([
    'Literal', 'Identifier', 'ThisExpression', 'SuperExpression',
    'UnaryExpression', 'BinaryExpression', 'AssignmentExpression', 'ConditionalExpression',
    'CallExpression', 'NewExpression', 'MemberAccess', 'SliceExpression',
    'CastExpression', 'ImportExpression', 'YieldExpression',
    'TupleExpression', 'ObjectExpression', 'ObjectProperty', 'SpreadElement',
    'Sequence', 'DereferenceExpression', 'ReferenceExpression',
    'FunctionDefinition'  // Lambda/匿名函数
  ]);
  return exprTypes.has(node.type);
}

export function isDecl(node: BaseNode): node is Decl {
  const declTypes = new Set(['FunctionDefinition', 'ClassDefinition', 'VariableDeclaration', 'PackageDeclaration']);
  return declTypes.has(node.type);
}

export function isType(node: BaseNode): node is Type {
  const typeTypes = new Set([
    'PrimitiveType', 'DynamicType', 'VoidType',
    'ArrayType', 'TupleType', 'MapType', 'PointerType', 'ScopedType', 'FuncType', 'ChanType'
  ]);
  return typeTypes.has(node.type);
}

export function isName(node: BaseNode): node is Name {
  return node.type === 'Identifier';
}
