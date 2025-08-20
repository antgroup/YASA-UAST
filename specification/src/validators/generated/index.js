"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDynamicType = exports.isTupleType = exports.isScopedType = exports.isMapType = exports.isPointerType = exports.isArrayType = exports.isPrimitiveType = exports.isYieldExpression = exports.isSpreadElement = exports.isImportExpression = exports.isReferenceExpression = exports.isDereferenceExpression = exports.isVariableDeclaration = exports.isClassDefinition = exports.isFunctionDefinition = exports.isNewExpression = exports.isCallExpression = exports.isObjectProperty = exports.isObjectExpression = exports.isTupleExpression = exports.isSliceExpression = exports.isMemberAccess = exports.isThisExpression = exports.isSuperExpression = exports.isConditionalExpression = exports.isCastExpression = exports.isSequence = exports.isAssignmentExpression = exports.isUnaryExpression = exports.isBinaryExpression = exports.isScopedStatement = exports.isExpressionStatement = exports.isCatchClause = exports.isTryStatement = exports.isThrowStatement = exports.isContinueStatement = exports.isBreakStatement = exports.isReturnStatement = exports.isLabeledStatement = exports.isRangeStatement = exports.isWhileStatement = exports.isForStatement = exports.isCaseClause = exports.isSwitchStatement = exports.isIfStatement = exports.isExportStatement = exports.isCompileUnit = exports.isIdentifier = exports.isLiteral = exports.isNoop = void 0;
exports.isType = exports.isDeclaration = exports.isScopable = exports.isLoop = exports.isConditional = exports.isLVal = exports.isStatement = exports.isExpression = exports.isInstruction = exports.isStandardized = void 0;
/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'make build'
 */
var shallowEqual_1 = require("../../utils/shallowEqual");
function isNoop(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'Noop') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isNoop = isNoop;
function isLiteral(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'Literal') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isLiteral = isLiteral;
function isIdentifier(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'Identifier') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isIdentifier = isIdentifier;
function isCompileUnit(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'CompileUnit') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isCompileUnit = isCompileUnit;
function isExportStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ExportStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isExportStatement = isExportStatement;
function isIfStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'IfStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isIfStatement = isIfStatement;
function isSwitchStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'SwitchStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isSwitchStatement = isSwitchStatement;
function isCaseClause(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'CaseClause') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isCaseClause = isCaseClause;
function isForStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ForStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isForStatement = isForStatement;
function isWhileStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'WhileStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isWhileStatement = isWhileStatement;
function isRangeStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'RangeStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isRangeStatement = isRangeStatement;
function isLabeledStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'LabeledStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isLabeledStatement = isLabeledStatement;
function isReturnStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ReturnStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isReturnStatement = isReturnStatement;
function isBreakStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'BreakStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isBreakStatement = isBreakStatement;
function isContinueStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ContinueStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isContinueStatement = isContinueStatement;
function isThrowStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ThrowStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isThrowStatement = isThrowStatement;
function isTryStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'TryStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isTryStatement = isTryStatement;
function isCatchClause(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'CatchClause') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isCatchClause = isCatchClause;
function isExpressionStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ExpressionStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isExpressionStatement = isExpressionStatement;
function isScopedStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ScopedStatement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isScopedStatement = isScopedStatement;
function isBinaryExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'BinaryExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isBinaryExpression = isBinaryExpression;
function isUnaryExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'UnaryExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isUnaryExpression = isUnaryExpression;
function isAssignmentExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'AssignmentExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isAssignmentExpression = isAssignmentExpression;
function isSequence(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'Sequence') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isSequence = isSequence;
function isCastExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'CastExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isCastExpression = isCastExpression;
function isConditionalExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ConditionalExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isConditionalExpression = isConditionalExpression;
function isSuperExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'SuperExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isSuperExpression = isSuperExpression;
function isThisExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ThisExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isThisExpression = isThisExpression;
function isMemberAccess(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'MemberAccess') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isMemberAccess = isMemberAccess;
function isSliceExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'SliceExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isSliceExpression = isSliceExpression;
function isTupleExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'TupleExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isTupleExpression = isTupleExpression;
function isObjectExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ObjectExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isObjectExpression = isObjectExpression;
function isObjectProperty(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ObjectProperty') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isObjectProperty = isObjectProperty;
function isCallExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'CallExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isCallExpression = isCallExpression;
function isNewExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'NewExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isNewExpression = isNewExpression;
function isFunctionDefinition(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'FunctionDefinition') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isFunctionDefinition = isFunctionDefinition;
function isClassDefinition(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ClassDefinition') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isClassDefinition = isClassDefinition;
function isVariableDeclaration(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'VariableDeclaration') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isVariableDeclaration = isVariableDeclaration;
function isDereferenceExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'DereferenceExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isDereferenceExpression = isDereferenceExpression;
function isReferenceExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ReferenceExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isReferenceExpression = isReferenceExpression;
function isImportExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ImportExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isImportExpression = isImportExpression;
function isSpreadElement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'SpreadElement') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isSpreadElement = isSpreadElement;
function isYieldExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'YieldExpression') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isYieldExpression = isYieldExpression;
function isPrimitiveType(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'PrimitiveType') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isPrimitiveType = isPrimitiveType;
function isArrayType(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ArrayType') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isArrayType = isArrayType;
function isPointerType(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'PointerType') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isPointerType = isPointerType;
function isMapType(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'MapType') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isMapType = isMapType;
function isScopedType(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'ScopedType') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isScopedType = isScopedType;
function isTupleType(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'TupleType') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isTupleType = isTupleType;
function isDynamicType(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if (nodeType === 'DynamicType') {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isDynamicType = isDynamicType;
function isStandardized(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if ('Noop' === nodeType ||
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
        'PrimitiveType' === nodeType ||
        'ArrayType' === nodeType ||
        'PointerType' === nodeType ||
        'MapType' === nodeType ||
        'ScopedType' === nodeType ||
        'TupleType' === nodeType ||
        'DynamicType' === nodeType) {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isStandardized = isStandardized;
function isInstruction(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if ('Noop' === nodeType ||
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
        'YieldExpression' === nodeType) {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isInstruction = isInstruction;
function isExpression(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if ('Noop' === nodeType ||
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
        'YieldExpression' === nodeType) {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isExpression = isExpression;
function isStatement(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if ('Noop' === nodeType ||
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
        'YieldExpression' === nodeType) {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isStatement = isStatement;
function isLVal(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if ('Identifier' === nodeType || 'MemberAccess' === nodeType) {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isLVal = isLVal;
function isConditional(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if ('IfStatement' === nodeType ||
        'SwitchStatement' === nodeType ||
        'ConditionalExpression' === nodeType) {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isConditional = isConditional;
function isLoop(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if ('ForStatement' === nodeType ||
        'WhileStatement' === nodeType ||
        'RangeStatement' === nodeType) {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isLoop = isLoop;
function isScopable(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if ('WhileStatement' === nodeType ||
        'RangeStatement' === nodeType ||
        'CatchClause' === nodeType ||
        'ScopedStatement' === nodeType ||
        'FunctionDefinition' === nodeType ||
        'ClassDefinition' === nodeType) {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isScopable = isScopable;
function isDeclaration(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if ('FunctionDefinition' === nodeType ||
        'ClassDefinition' === nodeType ||
        'VariableDeclaration' === nodeType) {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isDeclaration = isDeclaration;
function isType(node, opts) {
    if (!node)
        return false;
    var nodeType = node.type;
    if ('PrimitiveType' === nodeType ||
        'ArrayType' === nodeType ||
        'PointerType' === nodeType ||
        'MapType' === nodeType ||
        'ScopedType' === nodeType ||
        'TupleType' === nodeType ||
        'DynamicType' === nodeType) {
        if (typeof opts === 'undefined') {
            return true;
        }
        else {
            return (0, shallowEqual_1.default)(node, opts);
        }
    }
    return false;
}
exports.isType = isType;
