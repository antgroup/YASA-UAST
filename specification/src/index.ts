import isReactComponent from "./validators/react/isReactComponent";

// asserts
export { default as assertNode } from "./asserts/assertNode";
export * from "./asserts/generated";

// builders
/** @deprecated use createFlowUnionType instead */
export * from "./builders/generated";
// export * from "./builders/generated/uppercase";

// clone
export { default as cloneNode } from "./clone/cloneNode";
export { default as clone } from "./clone/clone";
export { default as cloneDeep } from "./clone/cloneDeep";
export { default as cloneDeepWithoutLoc } from "./clone/cloneDeepWithoutLoc";
export { default as cloneWithoutLoc } from "./clone/cloneWithoutLoc";

// comments
export { default as addComment } from "./comments/addComment";
export { default as addComments } from "./comments/addComments";
export { default as inheritInnerComments } from "./comments/inheritInnerComments";
export { default as inheritLeadingComments } from "./comments/inheritLeadingComments";
export { default as inheritsComments } from "./comments/inheritsComments";
export { default as inheritTrailingComments } from "./comments/inheritTrailingComments";
export { default as removeComments } from "./comments/removeComments";

// constants
export * from "./constants/generated";
export * from "./constants";

// converters
export { default as ensureBlock } from "./converters/ensureBlock";
export { default as toBindingIdentifierName } from "./converters/toBindingIdentifierName";
export { default as toBlock } from "./converters/toBlock";
export { default as toComputedKey } from "./converters/toComputedKey";
export { default as toExpression } from "./converters/toExpression";
export { default as toIdentifier } from "./converters/toIdentifier";
export { default as toKeyAlias } from "./converters/toKeyAlias";
export { default as toSequenceExpression } from "./converters/toSequenceExpression";
export { default as toStatement } from "./converters/toStatement";
export { default as valueToNode } from "./converters/valueToNode";

// definitions
export * from "./definitions";

// modifications
export { default as appendToMemberExpression } from "./modifications/appendToMemberExpression";
export { default as inherits } from "./modifications/inherits";
export { default as prependToMemberExpression } from "./modifications/prependToMemberExpression";
export { default as removeProperties } from "./modifications/removeProperties";
export { default as removePropertiesDeep } from "./modifications/removePropertiesDeep";

// retrievers
export { default as getBindingIdentifiers } from "./retrievers/getBindingIdentifiers";
export { default as getOuterBindingIdentifiers } from "./retrievers/getOuterBindingIdentifiers";

// traverse
export { default as traverse } from "./traverse/traverse";
export * from "./traverse/traverse";
export { default as traverseFast } from "./traverse/traverseFast";

// utils
export { default as shallowEqual } from "./utils/shallowEqual";
export { default as prettyPrint } from "./utils/prettyPrint";

// validators
export { default as is } from "./validators/is";
export { default as isBinding } from "./validators/isBinding";
export { default as isBlockScoped } from "./validators/isBlockScoped";
export { default as isImmutable } from "./validators/isImmutable";
export { default as isNode } from "./validators/isNode";
export { default as isNodesEquivalent } from "./validators/isNodesEquivalent";
export { default as isPlaceholderType } from "./validators/isPlaceholderType";
export { default as isReferenced } from "./validators/isReferenced";
export { default as isScope } from "./validators/isScope";
export { default as isType } from "./validators/isType";
export { default as isValidES3Identifier } from "./validators/isValidES3Identifier";
export { default as isValidIdentifier } from "./validators/isValidIdentifier";
export { default as isVar } from "./validators/isVar";
export { default as matchesPattern } from "./validators/matchesPattern";
export { default as validate } from "./validators/validate";
export { default as buildMatchMemberExpression } from "./validators/buildMatchMemberExpression";
export * from "./validators/generated";

// react
export const react = {
  isReactComponent,
};

export {version}  from '../package.json';

// 原始生成的类型（内部使用，保持向后兼容）
// 注意：这些类型会被下面的新类型系统覆盖
export * from "./ast-types/generated";

// ===== UAST 三层继承类型系统 =====
// BaseNode → 6大分类(StmtBase/ExprBase/...) → 具体节点

// 导出三层类型系统（真正的继承关系）
// 注意：这会覆盖上面 Generated 导出的同名类型
export type {
  BaseNode,
  // 第2层: 6大分类基类
  CompileUnitBase, StmtBase, ExprBase, DeclBase, TypeBase, NameBase,
  // 第2层: 6大分类联合类型
  CompileUnit, Stmt, Expr, Decl, Type, Name, Node,
  // 第3层: Stmt 具体节点 (17个)
  Noop, IfStatement, SwitchStatement, CaseClause, ForStatement, WhileStatement, RangeStatement,
  BreakStatement, ContinueStatement, ReturnStatement, ThrowStatement,
  ScopedStatement, TryStatement, CatchClause,
  LabeledStatement, ExpressionStatement, ExportStatement,
  // 第3层: Expr 具体节点 (21个)
  Literal, ThisExpression, SuperExpression,
  UnaryExpression, BinaryExpression, AssignmentExpression, ConditionalExpression,
  CallExpression, NewExpression, MemberAccess, SliceExpression,
  CastExpression, ImportExpression, YieldExpression,
  TupleExpression, ObjectExpression, ObjectProperty, SpreadElement,
  Sequence, DereferenceExpression, ReferenceExpression,
  // 第3层: Decl 具体节点 (4个)
  FunctionDefinition, ClassDefinition, VariableDeclaration, PackageDeclaration,
  // 第3层: Type 具体节点 (10个)
  PrimitiveType, DynamicType, VoidType,
  ArrayType, TupleType, MapType, PointerType, ScopedType, FuncType, ChanType,
  // 第3层: Name 具体节点 (1个)
  Identifier,
} from './types-hierarchy';

// 类型守卫
export {
  isCompileUnit,
  isStmt,
  isExpr,
  isDecl,
  // isType, // 已在 validators/generated 中导出
  isName,
} from './types-hierarchy';
