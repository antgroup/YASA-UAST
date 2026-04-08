/* eslint-disable @typescript-eslint/no-explicit-any */
const PhpParserEngine = require('php-parser');
import * as UAST from '@ant-yasa/uast-spec';
import { version } from '../package.json';

type PhpNode = {
    kind?: string;
    loc?: {
        source?: string | null;
        start?: { line: number; column: number; offset?: number };
        end?: { line: number; column: number; offset?: number };
    };
    [key: string]: any;
};

export type ParseResult<Result> = Result;

function createEngine() {
    return new PhpParserEngine.Engine({
        parser: {
            php7: true,
            suppressErrors: false,
            extractDoc: true,
        },
        ast: {
            withPositions: true,
        },
    });
}

function toSourceLocation(loc: PhpNode['loc'], sourcefile?: string) {
    if (!loc?.start || !loc?.end) {
        return null;
    }

    return {
        start: {
            line: loc.start.line,
            column: loc.start.column + 1,
        },
        end: {
            line: loc.end.line,
            column: loc.end.column + 1,
        },
        sourcefile,
    };
}

function appendNodeMeta(node: any, origin: PhpNode | null | undefined, sourcefile?: string) {
    if (!node || !UAST.isNode(node)) {
        return node;
    }

    const loc = toSourceLocation(origin?.loc, sourcefile);
    if (loc) {
        node.loc = loc;
        node._meta.loc = loc;
    }

    if (origin) {
        node._meta.origin = origin;
    }

    return node;
}

function visitList(nodes: PhpNode[] | null | undefined, opts: Record<string, any>): Array<any> {
    if (!nodes) {
        return [];
    }
    return nodes
        .map((node) => visit(node, opts))
        .filter((node) => node !== null && node !== undefined);
}

function flattenInstructions(nodes: Array<any>): Array<any> {
    const instructions: Array<any> = [];
    for (const node of nodes) {
        if (!node) continue;
        if (UAST.isSequence(node)) {
            instructions.push(...node.expressions);
            continue;
        }
        instructions.push(node);
    }
    return instructions;
}

function createParameter(parameter: PhpNode, opts: Record<string, any>) {
    const id = visit(parameter.name, opts) as UAST.Identifier;
    const init = visit(parameter.value, opts) as UAST.Expression | null;
    const varDecl = UAST.variableDeclaration(id, init, false, UAST.dynamicType());
    varDecl._meta.byref = Boolean(parameter.byref);
    varDecl._meta.variadic = Boolean(parameter.variadic);
    varDecl._meta.attributes = createAttrGroups(parameter.attrGroups, opts);
    return appendNodeMeta(varDecl, parameter, opts?.sourcefile);
}

function createVariableDeclaration(
    idNode: PhpNode | null | undefined,
    initNode: PhpNode | null | undefined,
    origin: PhpNode,
    opts: Record<string, any>
) {
    const id = (visit(idNode, opts) as UAST.LVal) || UAST.identifier('_');
    const init = visit(initNode, opts) as UAST.Expression | null;
    const varDecl = UAST.variableDeclaration(id, init, false, UAST.dynamicType());
    return appendNodeMeta(varDecl, origin, opts?.sourcefile);
}

function createFunctionLike(node: PhpNode, opts: Record<string, any>, extraModifiers: string[] = []) {
    const id = visit(node.name, opts) as UAST.Identifier | null;
    const parameters = (node.arguments || []).map((arg: PhpNode) => createParameter(arg, opts));
    const body = node.body
        ? (visit(node.body, opts) as UAST.Instruction)
        : appendNodeMeta(UAST.scopedStatement([]), node, opts?.sourcefile);
    const modifiers = [...extraModifiers];

    if (typeof node.visibility === 'string') {
        modifiers.push(node.visibility);
    }
    if (node.isStatic) {
        modifiers.push('static');
    }
    if (node.isAbstract) {
        modifiers.push('abstract');
    }
    if (node.isFinal) {
        modifiers.push('final');
    }

    const fdef = UAST.functionDefinition(id, parameters, UAST.dynamicType(), body, modifiers);
    fdef._meta.attributes = createAttrGroups(node.attrGroups, opts);
    return appendNodeMeta(fdef, node, opts?.sourcefile);
}

function createClass(node: PhpNode, opts: Record<string, any>) {
    const id = visit(node.name, opts) as UAST.Identifier | null;
    const body = flattenInstructions(visitList(node.body, opts));
    const supers = node.extends ? [visit(node.extends, opts)] : [];
    const cdef = UAST.classDefinition(id, body, supers as Array<UAST.Expression>);
    cdef._meta.implements = visitList(node.implements, opts);
    cdef._meta.isAbstract = Boolean(node.isAbstract);
    cdef._meta.isFinal = Boolean(node.isFinal);
    cdef._meta.isReadonly = Boolean(node.isReadonly);
    cdef._meta.attributes = createAttrGroups(node.attrGroups, opts);
    return appendNodeMeta(cdef, node, opts?.sourcefile);
}

function createStructureLike(node: PhpNode, opts: Record<string, any>, kind: 'class' | 'interface' | 'trait') {
    const id = visit(node.name, opts) as UAST.Identifier | null;
    const body = flattenInstructions(visitList(node.body, opts));
    const supers = visitList(node.extends, opts) as Array<UAST.Expression>;
    const cdef = UAST.classDefinition(id, body, supers);
    cdef._meta.structureKind = kind;
    cdef._meta.attributes = createAttrGroups(node.attrGroups, opts);
    return appendNodeMeta(cdef, node, opts?.sourcefile);
}

function createArrayExpression(node: PhpNode, opts: Record<string, any>) {
    const properties = (node.items || []).map((item: PhpNode) => {
        const key = item.key ? visit(item.key, opts) : UAST.literal(null, 'null');
        const value = visit(item.value, opts) as UAST.Expression;
        const prop = UAST.objectProperty(key, value);
        return appendNodeMeta(prop, item, opts?.sourcefile);
    });
    const expr = UAST.objectExpression(properties);
    expr._meta.isArray = true;
    return appendNodeMeta(expr, node, opts?.sourcefile);
}

function createTupleExpression(node: PhpNode, opts: Record<string, any>) {
    const elements = (node.items || []).map((item: PhpNode) => {
        if (!item) {
            return UAST.noop();
        }
        return visit(item.value || item, opts) as UAST.Expression | UAST.Instruction;
    });
    const tuple = UAST.tupleExpression(elements);
    tuple._meta.shortForm = Boolean(node.shortForm);
    return appendNodeMeta(tuple, node, opts?.sourcefile);
}

function createEncapsed(node: PhpNode, opts: Record<string, any>) {
    const parts = (node.value || []).map((part: PhpNode) => visit(part.expression || part, opts) as UAST.Expression);
    if (parts.length === 0) {
        return appendNodeMeta(UAST.literal('', 'string'), node, opts?.sourcefile);
    }
    let expr = parts[0];
    for (let index = 1; index < parts.length; index += 1) {
        expr = appendNodeMeta(UAST.binaryExpression('+', expr, parts[index]), node, opts?.sourcefile);
    }
    expr._meta.encapsed = true;
    return appendNodeMeta(expr, node, opts?.sourcefile);
}

function createProgram(node: PhpNode, opts: Record<string, any>) {
    const body = flattenInstructions(visitList(node.children, opts));
    const compileUnit = UAST.compileUnit(body, 'php', null, opts?.sourcefile || '', version);
    return appendNodeMeta(compileUnit, node, opts?.sourcefile);
}

function mapBinaryOperator(operator: string | undefined) {
    if (!operator) {
        return '+';
    }
    const mapping: Record<string, string> = {
        '.': '+',
        '??': '||',
        '<=>': '-',
        'or': '||',
        'and': '&&',
        'xor': '^',
    };
    return mapping[operator] || operator;
}

function mapAssignOperator(operator: string): string {
    const mapping: Record<string, string> = {
        '.=': '+=',
        '??=': '=',
        '**=': '*=',
    };
    const validOperators = new Set(['=', '^=', '&=', '<<=', '>>=', '>>>=', '+=', '-=', '*=', '/=', '%=', '|=', '**=']);
    if (validOperators.has(operator)) {
        return operator;
    }
    return mapping[operator] || '=';
}

function createFunctionBody(bodyNode: PhpNode | null | undefined, opts: Record<string, any>) {
    const body = visit(bodyNode, opts);
    if (body && UAST.isNode(body) && !UAST.isExpr(body)) {
        return body as UAST.Instruction;
    }

    const returnStmt = UAST.returnStatement(body as UAST.Expression | null);
    appendNodeMeta(returnStmt, bodyNode, opts?.sourcefile);
    const scoped = UAST.scopedStatement([returnStmt]);
    return appendNodeMeta(scoped, bodyNode, opts?.sourcefile) as UAST.Instruction;
}

function createImportExpression(node: PhpNode, opts: Record<string, any>) {
    const targetNode = visit(node.target, opts);
    let target: UAST.Literal;
    if (UAST.isLiteral(targetNode)) {
        target = targetNode;
    } else {
        // 动态 include（如 include $dir . '/file.php'），用空字符串占位
        target = UAST.literal('', 'string');
        target._meta.dynamicFrom = targetNode;
    }
    const importExpr = UAST.importExpression(target);
    importExpr._meta.require = Boolean(node.require);
    importExpr._meta.once = Boolean(node.once);
    return appendNodeMeta(importExpr, node, opts?.sourcefile);
}

function createUseGroup(node: PhpNode, opts: Record<string, any>) {
    const imports = (node.items || []).map((item: PhpNode) => {
        const from = UAST.literal(item.name, 'string');
        const alias = item.alias ? visit(item.alias, opts) as UAST.Identifier : null;
        const importExpr = UAST.importExpression(from, alias || undefined, undefined);
        return appendNodeMeta(importExpr, item, opts?.sourcefile);
    });

    if (imports.length === 1) {
        return UAST.expressionStatement(imports[0]);
    }

    const seq = UAST.sequence(imports);
    return appendNodeMeta(seq, node, opts?.sourcefile);
}

function createPseudoCall(name: string, args: Array<UAST.Expression>, origin: PhpNode, opts: Record<string, any>) {
    const call = UAST.callExpression(UAST.identifier(name), args);
    call._meta.synthetic = true;
    return appendNodeMeta(call, origin, opts?.sourcefile);
}

function createPseudoCallStatement(name: string, args: Array<UAST.Expression>, origin: PhpNode, opts: Record<string, any>) {
    const call = createPseudoCall(name, args, origin, opts);
    const stmt = UAST.expressionStatement(call);
    return appendNodeMeta(stmt, origin, opts?.sourcefile);
}

function createAttrGroups(groups: PhpNode[] | null | undefined, opts: Record<string, any>) {
    return (groups || []).map((group: PhpNode) => ({
        type: 'AttributeGroup',
        attributes: (group.attrs || []).map((attr: PhpNode) => ({
            name: attr.name,
            args: (attr.args || []).map((arg: PhpNode) => visit(arg, opts)),
        })),
    }));
}

function createPropertyStatement(node: PhpNode, opts: Record<string, any>) {
    const declarations = (node.properties || []).map((property: PhpNode) => {
        const decl = createVariableDeclaration(property.name, property.value, property, opts);
        decl._meta.visibility = node.visibility || null;
        decl._meta.isStatic = Boolean(node.isStatic);
        decl._meta.readonly = Boolean(property.readonly);
        decl._meta.attributes = createAttrGroups(property.attrGroups, opts);
        return decl;
    });

    if (declarations.length === 1) {
        return declarations[0];
    }

    const seq = UAST.sequence(declarations);
    return appendNodeMeta(seq, node, opts?.sourcefile);
}

function createClassConstant(node: PhpNode, opts: Record<string, any>) {
    const declarations = (node.constants || []).map((constant: PhpNode) => {
        const decl = createVariableDeclaration(constant.name, constant.value, constant, opts);
        decl._meta.constant = true;
        decl._meta.visibility = node.visibility || null;
        decl._meta.final = Boolean(node.final);
        decl._meta.attributes = createAttrGroups(node.attrGroups, opts);
        return decl;
    });

    if (declarations.length === 1) {
        return declarations[0];
    }

    const seq = UAST.sequence(declarations);
    return appendNodeMeta(seq, node, opts?.sourcefile);
}

function createConstantStatement(node: PhpNode, opts: Record<string, any>) {
    const declarations = (node.constants || []).map((constant: PhpNode) => {
        const decl = createVariableDeclaration(constant.name, constant.value, constant, opts);
        decl._meta.constant = true;
        return decl;
    });

    if (declarations.length === 1) {
        return declarations[0];
    }

    const seq = UAST.sequence(declarations);
    return appendNodeMeta(seq, node, opts?.sourcefile);
}

function createLoopInit(nodes: PhpNode[] | null | undefined, opts: Record<string, any>) {
    const items = visitList(nodes, opts) as Array<UAST.Expression | UAST.VariableDeclaration>;
    if (items.length === 0) {
        return null;
    }
    if (items.length === 1) {
        return items[0];
    }
    const seq = UAST.sequence(items as Array<UAST.Instruction>);
    return appendNodeMeta(seq, nodes?.[0], opts?.sourcefile);
}

function createLoopExpr(nodes: PhpNode[] | null | undefined, opts: Record<string, any>) {
    const items = visitList(nodes, opts) as Array<UAST.Expression>;
    if (items.length === 0) {
        return null;
    }
    if (items.length === 1) {
        return items[0];
    }
    const seq = UAST.sequence(items as Array<UAST.Instruction>);
    return appendNodeMeta(seq, nodes?.[0], opts?.sourcefile) as unknown as UAST.Expression;
}

function createCatchClause(node: PhpNode, opts: Record<string, any>) {
    let parameter: UAST.VariableDeclaration;
    if (node.variable) {
        parameter = createVariableDeclaration(node.variable, null, node.variable, opts);
    } else {
        // PHP 8.0 non-capturing catch: catch (Exception) 无变量名
        const placeholderId = UAST.identifier('_');
        parameter = UAST.variableDeclaration(placeholderId, null, false, UAST.dynamicType());
        appendNodeMeta(parameter, node, opts?.sourcefile);
    }
    parameter._meta.catchTypes = visitList(node.what, opts);
    const clause = UAST.catchClause([parameter], visit(node.body, opts) as UAST.Instruction);
    return appendNodeMeta(clause, node, opts?.sourcefile);
}

function createStaticStatement(node: PhpNode, opts: Record<string, any>) {
    const declarations = (node.variables || []).map((item: PhpNode) => {
        const decl = createVariableDeclaration(item.variable, item.defaultValue, item, opts);
        decl._meta.storage = 'static';
        return decl;
    });

    if (declarations.length === 1) {
        return declarations[0];
    }

    const seq = UAST.sequence(declarations);
    return appendNodeMeta(seq, node, opts?.sourcefile);
}

function createGlobalStatement(node: PhpNode, opts: Record<string, any>) {
    const declarations = (node.items || []).map((item: PhpNode) => {
        const decl = createVariableDeclaration(item, null, item, opts);
        decl._meta.storage = 'global';
        return decl;
    });

    if (declarations.length === 1) {
        return declarations[0];
    }

    const seq = UAST.sequence(declarations);
    return appendNodeMeta(seq, node, opts?.sourcefile);
}

function createDeclare(node: PhpNode, opts: Record<string, any>) {
    const children = flattenInstructions(visitList(node.children, opts));
    const stmt =
        children.length === 0
            ? appendNodeMeta(UAST.noop(), node, opts?.sourcefile)
            : children.length === 1
              ? children[0]
              : appendNodeMeta(UAST.sequence(children), node, opts?.sourcefile);
    if (stmt && UAST.isNode(stmt)) {
        stmt._meta.declare = {
            mode: node.mode,
            directives: (node.directives || []).map((directive: PhpNode) => ({
                key: visit(directive.key, opts),
                value: visit(directive.value, opts),
            })),
        };
    }
    return stmt;
}

function createMatchExpression(node: PhpNode, opts: Record<string, any>) {
    const condition = visit(node.cond, opts) as UAST.Expression;
    const arms = (node.arms || []).map((arm: PhpNode) => {
        const conds = (arm.conds || []).map((cond: PhpNode) => visit(cond, opts) as UAST.Expression);
        const armObject = UAST.objectExpression([
            appendNodeMeta(
                UAST.objectProperty(
                    UAST.identifier('conds'),
                    UAST.tupleExpression(conds.length > 0 ? conds : [UAST.literal('default', 'string')])
                ),
                arm,
                opts?.sourcefile
            ),
            appendNodeMeta(
                UAST.objectProperty(UAST.identifier('body'), visit(arm.body, opts) as UAST.Expression),
                arm,
                opts?.sourcefile
            ),
        ]);
        if (!arm.conds) {
            armObject._meta.default = true;
        }
        return appendNodeMeta(armObject, arm, opts?.sourcefile);
    });
    const args = [condition, UAST.tupleExpression(arms)];
    const call = UAST.callExpression(UAST.identifier('match'), args);
    call._meta.synthetic = true;
    return appendNodeMeta(call, node, opts?.sourcefile);
}

function createCast(node: PhpNode, opts: Record<string, any>) {
    const type = UAST.dynamicType(UAST.identifier(String(node.type || 'mixed')));
    const expr = UAST.castExpression(visit(node.expr, opts) as UAST.Expression, type);
    expr._meta.raw = node.raw;
    return appendNodeMeta(expr, node, opts?.sourcefile);
}

function createTraitUse(node: PhpNode, opts: Record<string, any>) {
    const stmt = createPseudoCallStatement(
        'trait_use',
        (node.traits || []).map((traitNode: PhpNode) => visit(traitNode, opts) as UAST.Expression),
        node,
        opts
    );
    stmt._meta.adaptations = (node.adaptations || []).map((adaptation: PhpNode) => {
        if (adaptation.kind === 'traitprecedence') {
            return {
                kind: adaptation.kind,
                trait: visit(adaptation.trait, opts),
                method: visit(adaptation.method, opts),
                instead: visitList(adaptation.instead, opts),
            };
        }
        if (adaptation.kind === 'traitalias') {
            return {
                kind: adaptation.kind,
                trait: visit(adaptation.trait, opts),
                method: visit(adaptation.method, opts),
                as: visit(adaptation.as, opts),
                visibility: adaptation.visibility || '',
            };
        }
        return adaptation;
    });
    return stmt;
}

function createEnum(node: PhpNode, opts: Record<string, any>) {
    const body = flattenInstructions(visitList(node.body, opts));
    const cdef = UAST.classDefinition(visit(node.name, opts) as UAST.Identifier, body, []);
    cdef._meta.structureKind = 'enum';
    cdef._meta.valueType = visit(node.valueType, opts);
    cdef._meta.implements = visitList(node.implements, opts);
    cdef._meta.attributes = createAttrGroups(node.attrGroups, opts);
    return appendNodeMeta(cdef, node, opts?.sourcefile);
}

function createEnumCase(node: PhpNode, opts: Record<string, any>) {
    const decl = createVariableDeclaration(node.name, node.value, node, opts);
    decl._meta.enumCase = true;
    return appendNodeMeta(decl, node, opts?.sourcefile);
}

function createNamespace(node: PhpNode, opts: Record<string, any>) {
    const instructions: Array<UAST.Instruction> = [];
    if (node.name) {
        const nameStr = Array.isArray(node.name) ? node.name.join('\\') : String(node.name);
        const pkg = UAST.packageDeclaration(UAST.identifier(nameStr));
        instructions.push(appendNodeMeta(pkg, node, opts?.sourcefile));
    }
    instructions.push(...flattenInstructions(visitList(node.children, opts)));

    if (instructions.length === 1) {
        return instructions[0];
    }

    const seq = UAST.sequence(instructions);
    return appendNodeMeta(seq, node, opts?.sourcefile);
}

function visit(node: PhpNode | null | undefined, opts: Record<string, any>): any {
    if (!node) {
        return null;
    }

    switch (node.kind) {
        case 'program':
            return createProgram(node, opts);
        case 'expressionstatement': {
            const exprStmt = UAST.expressionStatement(visit(node.expression, opts) as UAST.Expression);
            return appendNodeMeta(exprStmt, node, opts?.sourcefile);
        }
        case 'assign': {
            const rawOp = node.operator || '=';
            const mappedOp = mapAssignOperator(rawOp);
            const assign = UAST.assignmentExpression(
                visit(node.left, opts) as UAST.LVal,
                visit(node.right, opts) as UAST.Expression,
                mappedOp as any,
                false
            );
            if (rawOp !== mappedOp) {
                assign._meta.rawOperator = rawOp;
            }
            return appendNodeMeta(assign, node, opts?.sourcefile);
        }
        case 'assignref': {
            const assign = UAST.assignmentExpression(
                visit(node.left, opts) as UAST.LVal,
                visit(node.right, opts) as UAST.Expression,
                '=',
                true
            );
            assign._meta.byref = true;
            return appendNodeMeta(assign, node, opts?.sourcefile);
        }
        case 'variable':
        case 'identifier':
            // 动态变量名 $$var: node.name 是对象而非字符串
            if (typeof node.name === 'object' && node.name !== null) {
                return visit(node.name, opts);
            }
            return appendNodeMeta(UAST.identifier(node.name), node, opts?.sourcefile);
        case 'name': {
            const nameStr = Array.isArray(node.name) ? node.name.join('\\') : String(node.name);
            return appendNodeMeta(UAST.identifier(nameStr), node, opts?.sourcefile);
        }
        case 'selfreference':
            return appendNodeMeta(UAST.identifier('self'), node, opts?.sourcefile);
        case 'parentreference':
            return appendNodeMeta(UAST.identifier('parent'), node, opts?.sourcefile);
        case 'staticreference':
            return appendNodeMeta(UAST.identifier('static'), node, opts?.sourcefile);
        case 'number':
            return appendNodeMeta(UAST.literal(Number(node.value), 'number'), node, opts?.sourcefile);
        case 'string':
            return appendNodeMeta(UAST.literal(node.value, 'string'), node, opts?.sourcefile);
        case 'nowdoc': {
            const literal = UAST.literal(node.value, 'string');
            literal._meta.label = node.label;
            literal._meta.nowdoc = true;
            return appendNodeMeta(literal, node, opts?.sourcefile);
        }
        case 'magic': {
            const literal = UAST.literal(node.value, 'string');
            literal._meta.magic = true;
            literal._meta.raw = node.raw;
            return appendNodeMeta(literal, node, opts?.sourcefile);
        }
        case 'boolean':
            return appendNodeMeta(UAST.literal(Boolean(node.value), 'boolean'), node, opts?.sourcefile);
        case 'nullkeyword':
            return appendNodeMeta(UAST.literal(null, 'null'), node, opts?.sourcefile);
        case 'namedargument': {
            const expr = visit(node.value, opts) as UAST.Expression;
            if (expr && UAST.isNode(expr)) {
                expr._meta.argName = node.name;
            }
            return expr;
        }
        case 'encapsed':
            return createEncapsed(node, opts);
        case 'bin': {
            const binary = UAST.binaryExpression(
                mapBinaryOperator(node.type || node.operator) as any,
                visit(node.left, opts) as UAST.Expression,
                visit(node.right, opts) as UAST.Expression
            );
            return appendNodeMeta(binary, node, opts?.sourcefile);
        }
        case 'retif': {
            const testExpr = visit(node.test, opts) as UAST.Expression;
            // PHP Elvis 运算符 $a ?: $b 省略中间表达式，复用 test 作为 consequent
            const consequent = node.trueExpr
                ? visit(node.trueExpr, opts) as UAST.Expression
                : visit(node.test, opts) as UAST.Expression;
            const conditional = UAST.conditionalExpression(
                testExpr,
                consequent,
                visit(node.falseExpr, opts) as UAST.Expression
            );
            return appendNodeMeta(conditional, node, opts?.sourcefile);
        }
        case 'unary': {
            const unary = UAST.unaryExpression(
                (node.type || '!') as any,
                visit(node.what, opts) as UAST.Expression,
                false
            );
            return appendNodeMeta(unary, node, opts?.sourcefile);
        }
        case 'pre': {
            const operator = node.type === '-' ? '--' : '++';
            const unary = UAST.unaryExpression(
                operator as any,
                visit(node.what, opts) as UAST.Expression,
                false
            );
            return appendNodeMeta(unary, node, opts?.sourcefile);
        }
        case 'post': {
            const operator = node.type === '-' ? '--' : '++';
            const unary = UAST.unaryExpression(
                operator as any,
                visit(node.what, opts) as UAST.Expression,
                true
            );
            return appendNodeMeta(unary, node, opts?.sourcefile);
        }
        case 'call': {
            const call = UAST.callExpression(
                visit(node.what, opts) as UAST.Expression,
                (node.arguments || []).map((arg: PhpNode) => visit(arg, opts) as UAST.Expression)
            );
            return appendNodeMeta(call, node, opts?.sourcefile);
        }
        case 'new': {
            const expr = UAST.newExpression(
                visit(node.what, opts) as UAST.Expression,
                (node.arguments || []).map((arg: PhpNode) => visit(arg, opts) as UAST.Expression)
            );
            return appendNodeMeta(expr, node, opts?.sourcefile);
        }
        case 'cast':
            return createCast(node, opts);
        case 'propertylookup': {
            const member = UAST.memberAccess(
                visit(node.what, opts) as UAST.Expression,
                visit(node.offset, opts) as UAST.Expression,
                false
            );
            return appendNodeMeta(member, node, opts?.sourcefile);
        }
        case 'nullsafepropertylookup': {
            const object = visit(node.what, opts) as UAST.Expression;
            const access = UAST.memberAccess(object, visit(node.offset, opts) as UAST.Expression, false);
            appendNodeMeta(access, node, opts?.sourcefile);
            access._meta.nullsafe = true;
            const expr = UAST.conditionalExpression(object, access, UAST.literal(null, 'null'));
            return appendNodeMeta(expr, node, opts?.sourcefile);
        }
        case 'staticlookup': {
            const member = UAST.memberAccess(
                visit(node.what, opts) as UAST.Expression,
                visit(node.offset, opts) as UAST.Expression,
                false
            );
            member._meta.isStatic = true;
            return appendNodeMeta(member, node, opts?.sourcefile);
        }
        case 'offsetlookup': {
            // $arr[] 数组追加时 node.offset 为 null，用 noop 占位
            const offsetProperty = node.offset ? visit(node.offset, opts) as UAST.Expression : UAST.noop() as any;
            const member = UAST.memberAccess(
                visit(node.what, opts) as UAST.Expression,
                offsetProperty,
                true
            );
            return appendNodeMeta(member, node, opts?.sourcefile);
        }
        case 'array':
            return createArrayExpression(node, opts);
        case 'list':
            return createTupleExpression(node, opts);
        case 'match':
            return createMatchExpression(node, opts);
        case 'include':
            return createImportExpression(node, opts);
        case 'isset':
            return createPseudoCall(
                'isset',
                (node.variables || []).map((variable: PhpNode) => visit(variable, opts) as UAST.Expression),
                node,
                opts
            );
        case 'empty':
            return createPseudoCall('empty', [visit(node.expression, opts) as UAST.Expression], node, opts);
        case 'clone':
            return createPseudoCall('clone', [visit(node.what, opts) as UAST.Expression], node, opts);
        case 'unset':
            return createPseudoCall(
                'unset',
                (node.variables || []).map((variable: PhpNode) => visit(variable, opts) as UAST.Expression),
                node,
                opts
            );
        case 'block': {
            const block = UAST.scopedStatement(flattenInstructions(visitList(node.children, opts)));
            return appendNodeMeta(block, node, opts?.sourcefile);
        }
        case 'if': {
            const ifBody = node.body ? visit(node.body, opts) as UAST.Instruction : UAST.scopedStatement([]);
            const ifStmt = UAST.ifStatement(
                visit(node.test, opts) as UAST.Expression,
                ifBody,
                visit(node.alternate, opts) as UAST.Instruction | null
            );
            return appendNodeMeta(ifStmt, node, opts?.sourcefile);
        }
        case 'return': {
            const ret = UAST.returnStatement(visit(node.expr, opts) as UAST.Expression | null);
            return appendNodeMeta(ret, node, opts?.sourcefile);
        }
        case 'break': {
            const stmt = UAST.breakStatement();
            stmt._meta.level = node.level;
            return appendNodeMeta(stmt, node, opts?.sourcefile);
        }
        case 'continue': {
            const stmt = UAST.continueStatement();
            stmt._meta.level = node.level;
            return appendNodeMeta(stmt, node, opts?.sourcefile);
        }
        case 'throw': {
            const stmt = UAST.throwStatement(visit(node.what, opts) as UAST.Expression);
            return appendNodeMeta(stmt, node, opts?.sourcefile);
        }
        case 'try': {
            const stmt = UAST.tryStatement(
                visit(node.body, opts) as UAST.Statement,
                (node.catches || []).map((catchNode: PhpNode) => createCatchClause(catchNode, opts)),
                visit(node.always, opts) as UAST.Instruction | null
            );
            return appendNodeMeta(stmt, node, opts?.sourcefile);
        }
        case 'switch': {
            const stmt = UAST.switchStatement(
                visit(node.test, opts) as UAST.Expression,
                flattenInstructions(visitList(node.body?.children, opts)) as Array<UAST.CaseClause>
            );
            return appendNodeMeta(stmt, node, opts?.sourcefile);
        }
        case 'case': {
            const clause = UAST.caseClause(
                visit(node.test, opts) as UAST.Expression | null,
                visit(node.body, opts) as UAST.Instruction
            );
            return appendNodeMeta(clause, node, opts?.sourcefile);
        }
        case 'for': {
            const forBody = node.body ? visit(node.body, opts) as UAST.Instruction : UAST.scopedStatement([]);
            const stmt = UAST.forStatement(
                createLoopInit(node.init, opts) as UAST.Expression | UAST.VariableDeclaration | null,
                createLoopExpr(node.test, opts) as UAST.Expression | null,
                createLoopExpr(node.increment, opts) as UAST.Expression | null,
                forBody
            );
            return appendNodeMeta(stmt, node, opts?.sourcefile);
        }
        case 'foreach': {
            const key = node.key ? createVariableDeclaration(node.key, null, node.key, opts) : null;
            const value = node.value ? createVariableDeclaration(node.value, null, node.value, opts) : null;
            const foreachBody = node.body ? visit(node.body, opts) as UAST.Instruction : UAST.scopedStatement([]);
            const stmt = UAST.rangeStatement(
                key,
                value,
                visit(node.source, opts) as UAST.Expression,
                foreachBody
            );
            return appendNodeMeta(stmt, node, opts?.sourcefile);
        }
        case 'while': {
            const whileBody = node.body ? visit(node.body, opts) as UAST.Instruction : UAST.scopedStatement([]);
            const stmt = UAST.whileStatement(
                visit(node.test, opts) as UAST.Expression,
                whileBody,
                false
            );
            return appendNodeMeta(stmt, node, opts?.sourcefile);
        }
        case 'do': {
            const doBody = node.body ? visit(node.body, opts) as UAST.Instruction : UAST.scopedStatement([]);
            const stmt = UAST.whileStatement(
                visit(node.test, opts) as UAST.Expression,
                doBody,
                true
            );
            return appendNodeMeta(stmt, node, opts?.sourcefile);
        }
        case 'echo': {
            const echoCall = UAST.callExpression(
                UAST.identifier('echo'),
                (node.expressions || []).map((expr: PhpNode) => visit(expr, opts) as UAST.Expression)
            );
            appendNodeMeta(echoCall, node, opts?.sourcefile);
            const exprStmt = UAST.expressionStatement(echoCall);
            return appendNodeMeta(exprStmt, node, opts?.sourcefile);
        }
        case 'print':
            return createPseudoCall('print', [visit(node.expression, opts) as UAST.Expression], node, opts);
        case 'exit': {
            const args = node.expression ? [visit(node.expression, opts) as UAST.Expression] : [];
            const call = createPseudoCall('exit', args, node, opts);
            call._meta.useDie = Boolean(node.useDie);
            return call;
        }
        case 'eval':
            return createPseudoCall('eval', [visit(node.source, opts) as UAST.Expression], node, opts);
        case 'silent': {
            const expr = visit(node.expr, opts) as UAST.Expression;
            if (expr && UAST.isNode(expr)) {
                expr._meta.silent = true;
            }
            return expr;
        }
        case 'yield': {
            const expr = UAST.yieldExpression(visit(node.value, opts) as UAST.Expression | null);
            expr._meta.key = visit(node.key, opts);
            return appendNodeMeta(expr, node, opts?.sourcefile);
        }
        case 'yieldfrom': {
            const expr = UAST.yieldExpression(visit(node.value, opts) as UAST.Expression | null);
            expr._meta.isYieldFrom = true;
            return appendNodeMeta(expr, node, opts?.sourcefile);
        }
        case 'function':
            return createFunctionLike(node, opts);
        case 'method':
            return createFunctionLike(node, opts);
        case 'closure': {
            const fdef = createFunctionLike(node, opts, node.isStatic ? ['static'] : []);
            fdef._meta.uses = (node.uses || []).map((item: PhpNode) => {
                const value = visit(item, opts);
                if (value && UAST.isNode(value)) {
                    value._meta.byref = Boolean(item.byref);
                }
                return value;
            });
            fdef._meta.byref = Boolean(node.byref);
            return fdef;
        }
        case 'arrowfunc': {
            const id = null;
            const parameters = (node.arguments || []).map((arg: PhpNode) => createParameter(arg, opts));
            const body = createFunctionBody(node.body, opts);
            const fdef = UAST.functionDefinition(id, parameters, UAST.dynamicType(), body, []);
            return appendNodeMeta(fdef, node, opts?.sourcefile);
        }
        case 'class':
            return createClass(node, opts);
        case 'constantstatement':
            return createConstantStatement(node, opts);
        case 'interface':
            return createStructureLike(node, opts, 'interface');
        case 'trait':
            return createStructureLike(node, opts, 'trait');
        case 'traituse':
            return createTraitUse(node, opts);
        case 'enum':
            return createEnum(node, opts);
        case 'enumcase':
            return createEnumCase(node, opts);
        case 'propertystatement':
            return createPropertyStatement(node, opts);
        case 'classconstant':
            return createClassConstant(node, opts);
        case 'global':
            return createGlobalStatement(node, opts);
        case 'static':
            return createStaticStatement(node, opts);
        case 'declare':
            return createDeclare(node, opts);
        case 'namespace':
            return createNamespace(node, opts);
        case 'usegroup':
            return createUseGroup(node, opts);
        default: {
            const noop = UAST.noop();
            return appendNodeMeta(noop, node, opts?.sourcefile);
        }
    }
}

function sanitize(node: any) {
    if (!node) {
        return;
    }

    if (Array.isArray(node)) {
        node.forEach((item) => sanitize(item));
        return;
    }

    if (!node.type) {
        return;
    }

    if (node.loc) {
        Object.keys(node.loc).forEach((key) => {
            if (!['start', 'end', 'sourcefile'].includes(key)) {
                delete node.loc[key];
            }
        });
    }

    Object.keys(node).forEach((key) => sanitize(node[key]));
}

export function parse(content: string, opts: Record<string, any> = {}): ParseResult<UAST.Node> {
    const engine = createEngine();
    const ast = engine.parseCode(content, opts?.sourcefile);
    const node = visit(ast, opts);
    sanitize(node);
    return node;
}
