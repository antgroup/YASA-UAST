/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'make build'
 */
import shallowEqual from '../../utils/shallowEqual'
import type * as t from '../..'

export function isNoop(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Noop {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'Noop') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isLiteral(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Literal {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'Literal') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isIdentifier(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Identifier {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'Identifier') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isCompileUnit(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.CompileUnit {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'CompileUnit') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isExportStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ExportStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ExportStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isIfStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.IfStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'IfStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isSwitchStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.SwitchStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'SwitchStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isCaseClause(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.CaseClause {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'CaseClause') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isForStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ForStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ForStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isWhileStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.WhileStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'WhileStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isRangeStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.RangeStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'RangeStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isLabeledStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.LabeledStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'LabeledStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isReturnStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ReturnStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ReturnStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isBreakStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.BreakStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'BreakStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isContinueStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ContinueStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ContinueStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isThrowStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ThrowStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ThrowStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isTryStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.TryStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'TryStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isCatchClause(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.CatchClause {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'CatchClause') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isExpressionStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ExpressionStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ExpressionStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isScopedStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ScopedStatement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ScopedStatement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isBinaryExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.BinaryExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'BinaryExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isUnaryExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.UnaryExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'UnaryExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isAssignmentExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.AssignmentExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'AssignmentExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isSequence(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Sequence {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'Sequence') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isCastExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.CastExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'CastExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isConditionalExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ConditionalExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ConditionalExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isSuperExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.SuperExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'SuperExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isThisExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ThisExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ThisExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isMemberAccess(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.MemberAccess {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'MemberAccess') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isSliceExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.SliceExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'SliceExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isTupleExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.TupleExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'TupleExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isObjectExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ObjectExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ObjectExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isObjectProperty(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ObjectProperty {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ObjectProperty') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isCallExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.CallExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'CallExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isNewExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.NewExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'NewExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isFunctionDefinition(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.FunctionDefinition {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'FunctionDefinition') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isClassDefinition(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ClassDefinition {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ClassDefinition') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isVariableDeclaration(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.VariableDeclaration {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'VariableDeclaration') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isDereferenceExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.DereferenceExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'DereferenceExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isReferenceExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ReferenceExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ReferenceExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isImportExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ImportExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ImportExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isSpreadElement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.SpreadElement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'SpreadElement') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isYieldExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.YieldExpression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'YieldExpression') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isPackageDeclaration(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.PackageDeclaration {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'PackageDeclaration') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isPrimitiveType(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.PrimitiveType {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'PrimitiveType') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isArrayType(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ArrayType {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ArrayType') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isPointerType(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.PointerType {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'PointerType') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isMapType(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.MapType {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'MapType') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isScopedType(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ScopedType {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ScopedType') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isTupleType(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.TupleType {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'TupleType') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isChanType(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.ChanType {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'ChanType') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isFuncType(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.FuncType {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'FuncType') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isDynamicType(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.DynamicType {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'DynamicType') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isVoidType(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.VoidType {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (nodeType === 'VoidType') {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isStandardized(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Standardized {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (
    'Noop' === nodeType ||
    'Literal' === nodeType ||
    'Identifier' === nodeType ||
    'CompileUnit' === nodeType ||
    'ExportStatement' === nodeType ||
    'IfStatement' === nodeType ||
    'SwitchStatement' === nodeType ||
    'CaseClause' === nodeType ||
    'ForStatement' === nodeType ||
    'WhileStatement' === nodeType ||
    'RangeStatement' === nodeType ||
    'LabeledStatement' === nodeType ||
    'ReturnStatement' === nodeType ||
    'BreakStatement' === nodeType ||
    'ContinueStatement' === nodeType ||
    'ThrowStatement' === nodeType ||
    'TryStatement' === nodeType ||
    'CatchClause' === nodeType ||
    'ExpressionStatement' === nodeType ||
    'ScopedStatement' === nodeType ||
    'BinaryExpression' === nodeType ||
    'UnaryExpression' === nodeType ||
    'AssignmentExpression' === nodeType ||
    'Sequence' === nodeType ||
    'CastExpression' === nodeType ||
    'ConditionalExpression' === nodeType ||
    'SuperExpression' === nodeType ||
    'ThisExpression' === nodeType ||
    'MemberAccess' === nodeType ||
    'SliceExpression' === nodeType ||
    'TupleExpression' === nodeType ||
    'ObjectExpression' === nodeType ||
    'ObjectProperty' === nodeType ||
    'CallExpression' === nodeType ||
    'NewExpression' === nodeType ||
    'FunctionDefinition' === nodeType ||
    'ClassDefinition' === nodeType ||
    'VariableDeclaration' === nodeType ||
    'DereferenceExpression' === nodeType ||
    'ReferenceExpression' === nodeType ||
    'ImportExpression' === nodeType ||
    'SpreadElement' === nodeType ||
    'YieldExpression' === nodeType ||
    'PackageDeclaration' === nodeType ||
    'PrimitiveType' === nodeType ||
    'ArrayType' === nodeType ||
    'PointerType' === nodeType ||
    'MapType' === nodeType ||
    'ScopedType' === nodeType ||
    'TupleType' === nodeType ||
    'ChanType' === nodeType ||
    'FuncType' === nodeType ||
    'DynamicType' === nodeType ||
    'VoidType' === nodeType
  ) {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isInstruction(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Instruction {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (
    'Noop' === nodeType ||
    'Literal' === nodeType ||
    'Identifier' === nodeType ||
    'ExportStatement' === nodeType ||
    'IfStatement' === nodeType ||
    'SwitchStatement' === nodeType ||
    'ForStatement' === nodeType ||
    'WhileStatement' === nodeType ||
    'RangeStatement' === nodeType ||
    'LabeledStatement' === nodeType ||
    'ReturnStatement' === nodeType ||
    'BreakStatement' === nodeType ||
    'ContinueStatement' === nodeType ||
    'ThrowStatement' === nodeType ||
    'TryStatement' === nodeType ||
    'CatchClause' === nodeType ||
    'ExpressionStatement' === nodeType ||
    'ScopedStatement' === nodeType ||
    'BinaryExpression' === nodeType ||
    'UnaryExpression' === nodeType ||
    'AssignmentExpression' === nodeType ||
    'Sequence' === nodeType ||
    'CastExpression' === nodeType ||
    'ConditionalExpression' === nodeType ||
    'SuperExpression' === nodeType ||
    'ThisExpression' === nodeType ||
    'MemberAccess' === nodeType ||
    'SliceExpression' === nodeType ||
    'TupleExpression' === nodeType ||
    'ObjectExpression' === nodeType ||
    'ObjectProperty' === nodeType ||
    'CallExpression' === nodeType ||
    'NewExpression' === nodeType ||
    'FunctionDefinition' === nodeType ||
    'ClassDefinition' === nodeType ||
    'VariableDeclaration' === nodeType ||
    'DereferenceExpression' === nodeType ||
    'ReferenceExpression' === nodeType ||
    'ImportExpression' === nodeType ||
    'SpreadElement' === nodeType ||
    'YieldExpression' === nodeType ||
    'PackageDeclaration' === nodeType
  ) {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isExpression(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Expression {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (
    'Noop' === nodeType ||
    'Literal' === nodeType ||
    'Identifier' === nodeType ||
    'SwitchStatement' === nodeType ||
    'ReturnStatement' === nodeType ||
    'BinaryExpression' === nodeType ||
    'UnaryExpression' === nodeType ||
    'AssignmentExpression' === nodeType ||
    'Sequence' === nodeType ||
    'CastExpression' === nodeType ||
    'ConditionalExpression' === nodeType ||
    'SuperExpression' === nodeType ||
    'ThisExpression' === nodeType ||
    'MemberAccess' === nodeType ||
    'SliceExpression' === nodeType ||
    'TupleExpression' === nodeType ||
    'ObjectExpression' === nodeType ||
    'ObjectProperty' === nodeType ||
    'CallExpression' === nodeType ||
    'NewExpression' === nodeType ||
    'FunctionDefinition' === nodeType ||
    'ClassDefinition' === nodeType ||
    'VariableDeclaration' === nodeType ||
    'DereferenceExpression' === nodeType ||
    'ReferenceExpression' === nodeType ||
    'ImportExpression' === nodeType ||
    'SpreadElement' === nodeType ||
    'YieldExpression' === nodeType ||
    'PackageDeclaration' === nodeType
  ) {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isStatement(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Statement {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (
    'Noop' === nodeType ||
    'ExportStatement' === nodeType ||
    'IfStatement' === nodeType ||
    'SwitchStatement' === nodeType ||
    'ForStatement' === nodeType ||
    'WhileStatement' === nodeType ||
    'RangeStatement' === nodeType ||
    'LabeledStatement' === nodeType ||
    'ReturnStatement' === nodeType ||
    'BreakStatement' === nodeType ||
    'ContinueStatement' === nodeType ||
    'ThrowStatement' === nodeType ||
    'TryStatement' === nodeType ||
    'ExpressionStatement' === nodeType ||
    'ScopedStatement' === nodeType ||
    'Sequence' === nodeType ||
    'FunctionDefinition' === nodeType ||
    'ClassDefinition' === nodeType ||
    'VariableDeclaration' === nodeType ||
    'YieldExpression' === nodeType ||
    'PackageDeclaration' === nodeType
  ) {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isLVal(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.LVal {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (
    'Identifier' === nodeType ||
    'MemberAccess' === nodeType ||
    'TupleExpression' === nodeType
  ) {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isType(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Type {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (
    'Identifier' === nodeType ||
    'PrimitiveType' === nodeType ||
    'ArrayType' === nodeType ||
    'PointerType' === nodeType ||
    'MapType' === nodeType ||
    'ScopedType' === nodeType ||
    'TupleType' === nodeType ||
    'ChanType' === nodeType ||
    'FuncType' === nodeType ||
    'DynamicType' === nodeType ||
    'VoidType' === nodeType
  ) {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isConditional(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Conditional {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (
    'IfStatement' === nodeType ||
    'SwitchStatement' === nodeType ||
    'ConditionalExpression' === nodeType
  ) {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isLoop(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Loop {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (
    'ForStatement' === nodeType ||
    'WhileStatement' === nodeType ||
    'RangeStatement' === nodeType
  ) {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isScopable(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Scopable {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (
    'WhileStatement' === nodeType ||
    'RangeStatement' === nodeType ||
    'CatchClause' === nodeType ||
    'ScopedStatement' === nodeType ||
    'FunctionDefinition' === nodeType ||
    'ClassDefinition' === nodeType
  ) {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
export function isDeclaration(
  node: t.BaseNode | null | undefined,
  opts?: object | null
): node is t.Declaration {
  if (!node) return false

  const nodeType = (node as t.Node).type
  if (
    'FunctionDefinition' === nodeType ||
    'ClassDefinition' === nodeType ||
    'VariableDeclaration' === nodeType ||
    'PackageDeclaration' === nodeType
  ) {
    if (typeof opts === 'undefined') {
      return true
    } else {
      return shallowEqual(node, opts)
    }
  }

  return false
}
