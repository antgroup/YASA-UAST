import * as TreeSitter from 'web-tree-sitter';
import * as UAST from '@ant-yasa/uast-spec';
import { version } from '../package.json';

type SyntaxNode = TreeSitter.Node;

export type ParseResult<Result> = Result;

let parserInstance: TreeSitter.Parser | null = null;

/** 初始化 tree-sitter parser，加载 PHP WASM */
export async function init(): Promise<void> {
    await TreeSitter.Parser.init();
    const Lang = await TreeSitter.Language.load(
        require.resolve('tree-sitter-php/tree-sitter-php.wasm')
    );
    parserInstance = new TreeSitter.Parser();
    parserInstance.setLanguage(Lang);
}

function getParser(): TreeSitter.Parser {
    if (!parserInstance) {
        throw new Error('Parser not initialized. Call init() first.');
    }
    return parserInstance;
}

function toSourceLocation(node: SyntaxNode, sourcefile?: string) {
    return {
        start: {
            line: node.startPosition.row + 1,
            column: node.startPosition.column + 1,
        },
        end: {
            line: node.endPosition.row + 1,
            column: node.endPosition.column + 1,
        },
        sourcefile,
    };
}

function appendNodeMeta(uastNode: any, tsNode: SyntaxNode | null | undefined, sourcefile?: string): any {
    if (!uastNode || !UAST.isNode(uastNode)) {
        return uastNode;
    }

    if (tsNode) {
        const loc = toSourceLocation(tsNode, sourcefile);
        uastNode.loc = loc;
        uastNode._meta.loc = loc;
    }

    return uastNode;
}

function visitList(nodes: SyntaxNode[], opts: Record<string, any>): Array<any> {
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

function mapBinaryOperator(operator: string | undefined): string {
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
        '<>': '!=',
    };
    // PHP 关键字大小写不敏感，统一转小写
    const lower = operator.toLowerCase();
    return mapping[lower] || lower;
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

/** 去除字符串两端的引号 */
function stripQuotes(text: string): string {
    if (text.length >= 2) {
        const first = text[0];
        const last = text[text.length - 1];
        if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
            return text.slice(1, -1);
        }
    }
    return text;
}

/** 从 heredoc/nowdoc 中提取内容（去掉标签行和结束标签行） */
function stripHeredoc(text: string): string {
    const lines = text.split('\n');
    // 第一行: <<<TAG 或 <<<'TAG'
    // 最后一行: TAG;
    if (lines.length >= 2) {
        return lines.slice(1, -1).join('\n');
    }
    return text;
}

/** 从节点的匿名子节点中提取 operator 文本 */
function getOperator(node: SyntaxNode): string {
    for (let i = 0; i < node.childCount; i++) {
        const child = node.child(i)!;
        if (!child.isNamed && child.text !== '(' && child.text !== ')' && child.text !== ',' && child.text !== ';') {
            return child.text;
        }
    }
    return '=';
}

/** 处理函数参数（simple_parameter / variadic_parameter / property_promotion_parameter） */
function createParameter(paramNode: SyntaxNode, opts: Record<string, any>): any {
    const sourcefile = opts?.sourcefile as string | undefined;
    const nameNode = paramNode.childForFieldName('name');
    const id = nameNode ? visit(nameNode, opts) as UAST.Identifier : UAST.identifier('_');
    const defaultValueNode = paramNode.childForFieldName('default_value');
    const init = defaultValueNode ? visit(defaultValueNode, opts) as UAST.Expression : null;
    const varDecl = UAST.variableDeclaration(id, init, false, UAST.dynamicType());
    varDecl._meta.variadic = paramNode.type === 'variadic_parameter';
    // property_promotion_parameter 的 visibility 和 readonly
    if (paramNode.type === 'property_promotion_parameter') {
        for (const child of paramNode.namedChildren) {
            if (child.type === 'visibility_modifier') {
                varDecl._meta.visibility = child.text;
            }
            if (child.type === 'readonly_modifier') {
                varDecl._meta.readonly = true;
            }
        }
    }
    return appendNodeMeta(varDecl, paramNode, sourcefile);
}

/** 构建函数定义（function_definition / method_declaration / anonymous_function） */
function createFunctionLike(node: SyntaxNode, opts: Record<string, any>): any {
    const sourcefile = opts?.sourcefile as string | undefined;
    const nameNode = node.childForFieldName('name');
    const id = nameNode ? visit(nameNode, opts) as UAST.Identifier : null;
    const paramsNode = node.childForFieldName('parameters');
    const parameters = paramsNode
        ? paramsNode.namedChildren.map((p) => createParameter(p, opts))
        : [];
    const bodyNode = node.childForFieldName('body');
    const body = bodyNode
        ? visit(bodyNode, opts) as UAST.Instruction
        : appendNodeMeta(UAST.scopedStatement([]), node, sourcefile);
    const modifiers: string[] = [];
    for (const child of node.namedChildren) {
        if (child.type === 'visibility_modifier' || child.type === 'static_modifier'
            || child.type === 'abstract_modifier' || child.type === 'final_modifier'
            || child.type === 'readonly_modifier') {
            modifiers.push(child.text);
        }
    }
    const fdef = UAST.functionDefinition(id, parameters, UAST.dynamicType(), body, modifiers);
    // __construct → 标记为构造函数，引擎 scope.ts / initializer.ts 依赖此标志定位 _CTOR_
    if (id?.name === '__construct') {
        fdef._meta.isConstructor = true;
        // Constructor Promotion: visibility 参数自动生成 $this->param = $param 赋值
        const promotionStmts: Array<any> = [];
        for (const param of parameters) {
            if (param._meta?.visibility) {
                const paramName = UAST.isVariableDeclaration(param)
                    ? (param.id as UAST.Identifier).name
                    : '';
                if (paramName) {
                    // $this->paramName = $paramName
                    const thisExpr = UAST.thisExpression();
                    const fieldId = UAST.identifier(paramName);
                    const memberExpr = UAST.memberAccess(thisExpr, fieldId, false);
                    const valueId = UAST.identifier(paramName);
                    const assign = UAST.assignmentExpression(memberExpr, valueId, '=', false);
                    const exprStmt = UAST.expressionStatement(assign);
                    appendNodeMeta(exprStmt, node, sourcefile);
                    promotionStmts.push(exprStmt);
                    // readonly 标记
                    if (param._meta.readonly) {
                        param._meta.readonly = true;
                    }
                }
            }
        }
        // prepend 到构造函数 body 开头
        if (promotionStmts.length > 0 && UAST.isScopedStatement(body)) {
            body.body.unshift(...promotionStmts);
        }
    }
    return appendNodeMeta(fdef, node, sourcefile);
}

/** 构建类/接口/trait 定义 */
function createClassLike(node: SyntaxNode, opts: Record<string, any>, kind?: string): any {
    const sourcefile = opts?.sourcefile as string | undefined;
    const nameNode = node.childForFieldName('name');
    const id = nameNode ? visit(nameNode, opts) as UAST.Identifier : null;
    const bodyNode = node.childForFieldName('body');
    const body = bodyNode
        ? flattenInstructions(visitList(bodyNode.namedChildren, opts))
        : [];
    // extends — childForFieldName('base_clause') 在 tree-sitter PHP 返回 NULL，改用 namedChildren 查找
    const supers: Array<UAST.Expression> = [];
    const baseClause = node.namedChildren.find((c) => c.type === 'base_clause');
    if (baseClause) {
        for (const child of baseClause.namedChildren) {
            const superExpr = visit(child, opts);
            if (superExpr) supers.push(superExpr);
        }
    }
    // trait use → 将 trait 名加入 supers，引擎 resolveClassInheritance 会自动合并 trait 方法
    if (body) {
        for (const stmt of body) {
            if (UAST.isExpressionStatement(stmt)) {
                const expr = stmt.expression;
                if (UAST.isCallExpression(expr)
                    && UAST.isIdentifier(expr.callee)
                    && expr.callee.name === 'trait_use') {
                    for (const arg of expr.arguments) {
                        supers.push(arg);
                    }
                }
            }
        }
    }
    const cdef = UAST.classDefinition(id, body, supers);
    // implements — childForFieldName 同样返回 NULL，改用 namedChildren 查找
    const implementsClause = node.namedChildren.find((c) => c.type === 'class_interface_clause');
    if (implementsClause) {
        cdef._meta.implements = visitList(implementsClause.namedChildren, opts);
    }
    if (kind) {
        cdef._meta.kind = kind;
    }
    // modifiers
    for (const child of node.namedChildren) {
        if (child.type === 'abstract_modifier') cdef._meta.isAbstract = true;
        if (child.type === 'final_modifier') cdef._meta.isFinal = true;
        if (child.type === 'readonly_modifier') cdef._meta.isReadonly = true;
    }
    return appendNodeMeta(cdef, node, sourcefile);
}

function visit(node: SyntaxNode | null | undefined, opts: Record<string, any>): any {
    if (!node) {
        return null;
    }

    const sourcefile = opts?.sourcefile as string | undefined;

    switch (node.type) {
        case 'program': {
            const children = node.namedChildren.filter((child) => child.type !== 'php_tag');
            const body = flattenInstructions(visitList(children, opts));
            const compileUnit = UAST.compileUnit(body, 'php', null, sourcefile || '', version);
            return appendNodeMeta(compileUnit, node, sourcefile);
        }

        case 'expression_statement': {
            const child = node.namedChildren[0];
            if (!child) {
                return appendNodeMeta(UAST.noop(), node, sourcefile);
            }
            const result = visit(child, opts);
            // throw_expression 等节点返回的是语句而非表达式，直接返回
            if (UAST.isNode(result) && result.type.endsWith('Statement')) {
                return appendNodeMeta(result, node, sourcefile);
            }
            const exprStmt = UAST.expressionStatement(result as UAST.Expression);
            return appendNodeMeta(exprStmt, node, sourcefile);
        }

        case 'variable_name': {
            // $variable -> 'variable'（variable_name 的 namedChild(0) 是 name 节点）
            const nameNode = node.namedChildren[0];
            const name = nameNode ? nameNode.text : node.text.replace(/^\$/, '');
            // $this → ThisExpression，引擎 processThisExpression 返回类实例引用
            if (name === 'this') {
                return appendNodeMeta(UAST.thisExpression(), node, sourcefile);
            }
            return appendNodeMeta(UAST.identifier(name), node, sourcefile);
        }

        case 'dynamic_variable_name': {
            // $$var -> 变量变量，递归访问内部节点
            const inner = node.namedChildren[0];
            if (inner) {
                return visit(inner, opts);
            }
            return appendNodeMeta(UAST.identifier(node.text.replace(/^\$+/, '')), node, sourcefile);
        }

        case 'by_ref': {
            // &$var -> 引用传递，直接访问内部变量
            const inner = node.namedChildren[0];
            if (inner) {
                const result = visit(inner, opts);
                if (UAST.isNode(result)) {
                    result._meta.byref = true;
                }
                return result;
            }
            return appendNodeMeta(UAST.noop(), node, sourcefile);
        }

        case 'name':
            return appendNodeMeta(UAST.identifier(node.text), node, sourcefile);

        case 'qualified_name':
            return appendNodeMeta(UAST.identifier(node.text), node, sourcefile);

        case 'namespace_name':
            return appendNodeMeta(UAST.identifier(node.text), node, sourcefile);

        case 'relative_scope':
            // self / parent / static
            return appendNodeMeta(UAST.identifier(node.text), node, sourcefile);

        case 'integer':
            return appendNodeMeta(UAST.literal(Number(node.text), 'number'), node, sourcefile);

        case 'float':
            return appendNodeMeta(UAST.literal(Number(node.text), 'number'), node, sourcefile);

        case 'string':
            return appendNodeMeta(UAST.literal(stripQuotes(node.text), 'string'), node, sourcefile);

        case 'encapsed_string': {
            // 含变量插值的双引号字符串，拆成 binary concat
            const parts = node.namedChildren.map((child) => {
                if (child.type === 'string_content') {
                    return appendNodeMeta(UAST.literal(child.text, 'string'), child, sourcefile);
                }
                return visit(child, opts);
            });
            if (parts.length === 0) {
                return appendNodeMeta(UAST.literal('', 'string'), node, sourcefile);
            }
            let expr = parts[0];
            for (let i = 1; i < parts.length; i++) {
                expr = appendNodeMeta(UAST.binaryExpression('+' as any, expr, parts[i]), node, sourcefile);
            }
            if (expr && UAST.isNode(expr)) {
                expr._meta.encapsed = true;
            }
            return appendNodeMeta(expr, node, sourcefile);
        }

        case 'heredoc': {
            // heredoc 带变量插值时，heredoc_body 含 string_content 和 variable_name 等节点
            const bodyNode = node.namedChildren.find((c) => c.type === 'heredoc_body');
            const hasInterpolation = bodyNode && bodyNode.namedChildren.some(
                (c) => c.type !== 'string_content'
            );
            if (bodyNode && hasInterpolation) {
                // 与 encapsed_string 相同逻辑：遍历 namedChildren，拆成 binary concat
                const parts = bodyNode.namedChildren.map((child) => {
                    if (child.type === 'string_content') {
                        return appendNodeMeta(UAST.literal(child.text, 'string'), child, sourcefile);
                    }
                    return visit(child, opts);
                });
                if (parts.length === 0) {
                    const literal = UAST.literal('', 'string');
                    literal._meta.heredoc = true;
                    return appendNodeMeta(literal, node, sourcefile);
                }
                let expr = parts[0];
                for (let i = 1; i < parts.length; i++) {
                    expr = appendNodeMeta(UAST.binaryExpression('+' as any, expr, parts[i]), node, sourcefile);
                }
                if (expr && UAST.isNode(expr)) {
                    expr._meta.heredoc = true;
                    expr._meta.encapsed = true;
                }
                return appendNodeMeta(expr, node, sourcefile);
            }
            // 纯文本 heredoc，保持原逻辑
            const content = stripHeredoc(node.text);
            const literal = UAST.literal(content, 'string');
            literal._meta.heredoc = true;
            return appendNodeMeta(literal, node, sourcefile);
        }

        case 'nowdoc': {
            const content = stripHeredoc(node.text);
            const literal = UAST.literal(content, 'string');
            literal._meta.nowdoc = true;
            return appendNodeMeta(literal, node, sourcefile);
        }

        case 'boolean':
            return appendNodeMeta(
                UAST.literal(node.text.toLowerCase() === 'true', 'boolean'),
                node,
                sourcefile
            );

        case 'null':
            return appendNodeMeta(UAST.literal(null, 'null'), node, sourcefile);

        case 'argument': {
            // argument 节点包装了一个表达式 child
            // 命名参数：argument 有 name field（如 cmd: $val）
            const argNameNode = node.childForFieldName('name');
            let child: SyntaxNode | undefined;
            if (argNameNode) {
                // 命名参数：name field 是第一个 namedChild，值表达式是后续的 namedChild
                // 注意：childForFieldName 和 namedChildren 返回的不是同一 JS 对象，
                // 不能用 === 比较，改用 id 判等或取索引 >= 1 的 namedChild
                child = node.namedChildren.find((c) => c.id !== argNameNode.id);
            } else {
                child = node.namedChildren[0];
            }
            const result = child ? visit(child, opts) : appendNodeMeta(UAST.noop(), node, sourcefile);
            if (argNameNode && result && UAST.isNode(result)) {
                result._meta.argumentName = argNameNode.text;
            }
            return result;
        }

        case 'variadic_unpacking': {
            // ...$args → SpreadElement
            const inner = node.namedChildren[0];
            const expr = inner ? visit(inner, opts) as UAST.Expression : UAST.noop() as any;
            return appendNodeMeta(UAST.spreadElement(expr), node, sourcefile);
        }

        case 'parenthesized_expression': {
            const child = node.namedChildren[0];
            return child ? visit(child, opts) : appendNodeMeta(UAST.noop(), node, sourcefile);
        }

        case 'text_interpolation':
            // HTML 文本片段，跳过
            return null;

        // ─── 赋值 ───

        case 'assignment_expression': {
            const left = visit(node.childForFieldName('left'), opts) as UAST.LVal;
            const right = visit(node.childForFieldName('right'), opts) as UAST.Expression;
            const op = mapAssignOperator(getOperator(node));
            const assign = UAST.assignmentExpression(left, right, op as any, false);
            return appendNodeMeta(assign, node, sourcefile);
        }

        case 'augmented_assignment_expression': {
            const left = visit(node.childForFieldName('left'), opts) as UAST.LVal;
            const right = visit(node.childForFieldName('right'), opts) as UAST.Expression;
            const rawOp = getOperator(node);
            const mappedOp = mapAssignOperator(rawOp);
            const assign = UAST.assignmentExpression(left, right, mappedOp as any, false);
            if (rawOp !== mappedOp) {
                assign._meta.rawOperator = rawOp;
            }
            return appendNodeMeta(assign, node, sourcefile);
        }

        case 'reference_assignment_expression': {
            const left = visit(node.childForFieldName('left'), opts) as UAST.LVal;
            const right = visit(node.childForFieldName('right'), opts) as UAST.Expression;
            const assign = UAST.assignmentExpression(left, right, '=', true);
            assign._meta.byref = true;
            return appendNodeMeta(assign, node, sourcefile);
        }

        // ─── 二元 / 条件 / 一元 ───

        case 'binary_expression': {
            const left = visit(node.childForFieldName('left'), opts) as UAST.Expression;
            const right = visit(node.childForFieldName('right'), opts) as UAST.Expression;
            const op = getOperator(node);
            const binary = UAST.binaryExpression(mapBinaryOperator(op) as any, left, right);
            return appendNodeMeta(binary, node, sourcefile);
        }

        case 'conditional_expression': {
            const named = node.namedChildren;
            if (named.length >= 3) {
                // 完整三元：condition ? consequent : alternative
                const cond = visit(named[0], opts) as UAST.Expression;
                const consequent = visit(named[1], opts) as UAST.Expression;
                const alternative = visit(named[2], opts) as UAST.Expression;
                return appendNodeMeta(UAST.conditionalExpression(cond, consequent, alternative), node, sourcefile);
            }
            // PHP Elvis ?:（省略 consequent），只有 2 个 namedChildren
            const cond = visit(named[0], opts) as UAST.Expression;
            const alternative = visit(named[1], opts) as UAST.Expression;
            // 复用 condition 作为 consequent
            const condDup = visit(named[0], opts) as UAST.Expression;
            return appendNodeMeta(UAST.conditionalExpression(cond, condDup, alternative), node, sourcefile);
        }

        case 'unary_op_expression': {
            const op = getOperator(node);
            const operand = visit(node.namedChildren[0], opts) as UAST.Expression;
            const unary = UAST.unaryExpression(op as any, operand, false);
            return appendNodeMeta(unary, node, sourcefile);
        }

        case 'update_expression': {
            // 判断 prefix/postfix：第一个子节点是匿名（operator）则 prefix，否则 postfix
            const firstChild = node.child(0)!;
            const isPostfix = firstChild.isNamed;
            const op = getOperator(node);
            const operand = visit(node.namedChildren[0], opts) as UAST.Expression;
            const unary = UAST.unaryExpression(op as any, operand, isPostfix);
            return appendNodeMeta(unary, node, sourcefile);
        }

        // ─── 调用 ───

        case 'function_call_expression': {
            const callee = visit(node.childForFieldName('function'), opts) as UAST.Expression;
            const argsNode = node.childForFieldName('arguments');
            const args = argsNode ? visitList(argsNode.namedChildren, opts) as Array<UAST.Expression> : [];
            const call = UAST.callExpression(callee, args);
            // 从参数的 _meta.argumentName 收集命名参数名称
            const names: (string | null)[] = args.map((a: any) => a?._meta?.argumentName || null);
            if (names.some((n: string | null) => n !== null)) {
                (call as any).names = names;
            }
            return appendNodeMeta(call, node, sourcefile);
        }

        case 'member_call_expression': {
            const object = visit(node.childForFieldName('object'), opts) as UAST.Expression;
            const name = visit(node.childForFieldName('name'), opts) as UAST.Expression;
            const memberCallee = UAST.memberAccess(object, name, false);
            appendNodeMeta(memberCallee, node, sourcefile);
            const argsNode = node.childForFieldName('arguments');
            const args = argsNode ? visitList(argsNode.namedChildren, opts) as Array<UAST.Expression> : [];
            const call = UAST.callExpression(memberCallee, args);
            const names: (string | null)[] = args.map((a: any) => a?._meta?.argumentName || null);
            if (names.some((n: string | null) => n !== null)) {
                (call as any).names = names;
            }
            return appendNodeMeta(call, node, sourcefile);
        }

        case 'nullsafe_member_call_expression': {
            // $obj?->method() — 与 member_call_expression 相同但包装为 conditionalExpression(object, call, null)
            const object = visit(node.childForFieldName('object'), opts) as UAST.Expression;
            const name = visit(node.childForFieldName('name'), opts) as UAST.Expression;
            const memberCallee = UAST.memberAccess(object, name, false);
            memberCallee._meta.nullsafe = true;
            appendNodeMeta(memberCallee, node, sourcefile);
            const argsNode = node.childForFieldName('arguments');
            const args = argsNode ? visitList(argsNode.namedChildren, opts) as Array<UAST.Expression> : [];
            const call = UAST.callExpression(memberCallee, args);
            const names: (string | null)[] = args.map((a: any) => a?._meta?.argumentName || null);
            if (names.some((n: string | null) => n !== null)) {
                (call as any).names = names;
            }
            appendNodeMeta(call, node, sourcefile);
            const expr = UAST.conditionalExpression(object, call, UAST.literal(null, 'null'));
            return appendNodeMeta(expr, node, sourcefile);
        }

        case 'scoped_call_expression': {
            const scope = visit(node.childForFieldName('scope'), opts) as UAST.Expression;
            const name = visit(node.childForFieldName('name'), opts) as UAST.Expression;
            const memberCallee = UAST.memberAccess(scope, name, false);
            memberCallee._meta.isStatic = true;
            appendNodeMeta(memberCallee, node, sourcefile);
            const argsNode = node.childForFieldName('arguments');
            const args = argsNode ? visitList(argsNode.namedChildren, opts) as Array<UAST.Expression> : [];
            const call = UAST.callExpression(memberCallee, args);
            const names: (string | null)[] = args.map((a: any) => a?._meta?.argumentName || null);
            if (names.some((n: string | null) => n !== null)) {
                (call as any).names = names;
            }
            return appendNodeMeta(call, node, sourcefile);
        }

        // ─── new / cast ───

        case 'object_creation_expression': {
            const className = visit(node.namedChildren[0], opts) as UAST.Expression;
            // tree-sitter PHP 的 arguments 不是 field，而是类型为 'arguments' 的 namedChild
            const argsNode = node.namedChildren.find((c) => c.type === 'arguments');
            const args = argsNode ? visitList(argsNode.namedChildren, opts) as Array<UAST.Expression> : [];
            const expr = UAST.newExpression(className, args);
            return appendNodeMeta(expr, node, sourcefile);
        }

        case 'cast_expression': {
            const typeNode = node.childForFieldName('type');
            const castType = typeNode ? typeNode.text.replace(/[()]/g, '').trim() : 'mixed';
            const value = visit(node.childForFieldName('value'), opts) as UAST.Expression;
            const call = UAST.callExpression(UAST.identifier(castType), [value]);
            call._meta.isCast = true;
            return appendNodeMeta(call, node, sourcefile);
        }

        // ─── 成员访问 ───

        case 'member_access_expression': {
            const object = visit(node.childForFieldName('object'), opts) as UAST.Expression;
            const name = visit(node.childForFieldName('name'), opts) as UAST.Expression;
            const member = UAST.memberAccess(object, name, false);
            return appendNodeMeta(member, node, sourcefile);
        }

        case 'nullsafe_member_access_expression': {
            const object = visit(node.childForFieldName('object'), opts) as UAST.Expression;
            const name = visit(node.childForFieldName('name'), opts) as UAST.Expression;
            const access = UAST.memberAccess(object, name, false);
            appendNodeMeta(access, node, sourcefile);
            access._meta.nullsafe = true;
            const expr = UAST.conditionalExpression(object, access, UAST.literal(null, 'null'));
            return appendNodeMeta(expr, node, sourcefile);
        }

        case 'scoped_property_access_expression': {
            const scope = visit(node.childForFieldName('scope'), opts) as UAST.Expression;
            const name = visit(node.childForFieldName('name'), opts) as UAST.Expression;
            const member = UAST.memberAccess(scope, name, false);
            member._meta.isStatic = true;
            return appendNodeMeta(member, node, sourcefile);
        }

        case 'class_constant_access_expression': {
            // class_constant_access_expression 没有字段名，按位置取 namedChildren
            const scope = visit(node.namedChildren[0], opts) as UAST.Expression;
            const name = visit(node.namedChildren[1], opts) as UAST.Expression;
            const member = UAST.memberAccess(scope, name, false);
            member._meta.isStatic = true;
            return appendNodeMeta(member, node, sourcefile);
        }

        case 'subscript_expression': {
            const named = node.namedChildren;
            const object = visit(named[0], opts) as UAST.Expression;
            // $arr[] 数组追加时 index 为空，用 noop 占位
            const index = named.length > 1 ? visit(named[1], opts) as UAST.Expression : UAST.noop() as any;
            const member = UAST.memberAccess(object, index, true);
            return appendNodeMeta(member, node, sourcefile);
        }

        // ─── 数组 / 列表 / match ───

        case 'array_creation_expression': {
            let autoIndex = 0;
            const properties = node.namedChildren.map((element) => {
                const elementChildren = element.namedChildren;
                if (elementChildren.length >= 2) {
                    // key => value
                    const key = visit(elementChildren[0], opts) as UAST.Expression;
                    const value = visit(elementChildren[1], opts) as UAST.Expression;
                    const prop = UAST.objectProperty(key, value);
                    autoIndex++;
                    return appendNodeMeta(prop, element, sourcefile);
                }
                // value only — 使用自增数字索引，与 PHP 数组行为一致
                const value = visit(elementChildren[0], opts) as UAST.Expression;
                const prop = UAST.objectProperty(UAST.literal(autoIndex, 'number'), value);
                autoIndex++;
                return appendNodeMeta(prop, element, sourcefile);
            });
            const expr = UAST.objectExpression(properties);
            expr._meta.isArray = true;
            return appendNodeMeta(expr, node, sourcefile);
        }

        case 'list_literal': {
            const elements = node.namedChildren.map((child) => visit(child, opts) as UAST.Expression);
            const tuple = UAST.tupleExpression(elements);
            return appendNodeMeta(tuple, node, sourcefile);
        }

        case 'match_expression': {
            const condition = visit(node.childForFieldName('condition_list') || node.childForFieldName('condition'), opts) as UAST.Expression;
            const bodyNode = node.childForFieldName('body');
            const arms = bodyNode ? bodyNode.namedChildren.map((arm) => {
                if (arm.type === 'match_default_expression') {
                    // default arm
                    const body = visit(arm.childForFieldName('return_expression') || arm.namedChildren[0], opts) as UAST.Expression;
                    const armObject = UAST.objectExpression([
                        appendNodeMeta(
                            UAST.objectProperty(UAST.identifier('conds'), UAST.tupleExpression([UAST.literal('default', 'string')])),
                            arm, sourcefile
                        ),
                        appendNodeMeta(UAST.objectProperty(UAST.identifier('body'), body), arm, sourcefile),
                    ]);
                    armObject._meta.default = true;
                    return appendNodeMeta(armObject, arm, sourcefile);
                }
                // match_conditional_expression
                const condListNode = arm.childForFieldName('conditional_expressions');
                const conds = condListNode
                    ? visitList(condListNode.namedChildren, opts) as Array<UAST.Expression>
                    : visitList(arm.namedChildren.slice(0, -1), opts) as Array<UAST.Expression>;
                const returnExpr = arm.childForFieldName('return_expression') || arm.namedChildren[arm.namedChildren.length - 1];
                const body = visit(returnExpr, opts) as UAST.Expression;
                const armObject = UAST.objectExpression([
                    appendNodeMeta(
                        UAST.objectProperty(UAST.identifier('conds'), UAST.tupleExpression(conds.length > 0 ? conds : [UAST.literal('default', 'string')])),
                        arm, sourcefile
                    ),
                    appendNodeMeta(UAST.objectProperty(UAST.identifier('body'), body), arm, sourcefile),
                ]);
                return appendNodeMeta(armObject, arm, sourcefile);
            }) : [];
            const matchArgs = [condition, UAST.tupleExpression(arms)];
            const call = UAST.callExpression(UAST.identifier('match'), matchArgs);
            call._meta.synthetic = true;
            return appendNodeMeta(call, node, sourcefile);
        }

        // ─── import ───

        case 'include_expression':
        case 'include_once_expression':
        case 'require_expression':
        case 'require_once_expression': {
            const targetNode = visit(node.namedChildren[0], opts);
            let target: UAST.Literal;
            if (UAST.isLiteral(targetNode)) {
                target = targetNode;
            } else {
                // 动态 include，用空字符串占位
                target = UAST.literal('', 'string');
                target._meta.dynamicFrom = targetNode;
            }
            const importExpr = UAST.importExpression(target);
            importExpr._meta.require = node.type.startsWith('require');
            importExpr._meta.once = node.type.endsWith('once_expression');
            return appendNodeMeta(importExpr, node, sourcefile);
        }

        // ─── 其他表达式 ───

        case 'echo_statement': {
            const args = visitList(node.namedChildren, opts) as Array<UAST.Expression>;
            const echoCall = UAST.callExpression(UAST.identifier('echo'), args);
            appendNodeMeta(echoCall, node, sourcefile);
            const exprStmt = UAST.expressionStatement(echoCall);
            return appendNodeMeta(exprStmt, node, sourcefile);
        }

        case 'yield_expression': {
            const valueNode = node.namedChildren[0] || null;
            const expr = UAST.yieldExpression(valueNode ? visit(valueNode, opts) as UAST.Expression : null);
            return appendNodeMeta(expr, node, sourcefile);
        }

        case 'error_suppression_expression': {
            const expr = visit(node.namedChildren[0], opts);
            if (expr && UAST.isNode(expr)) {
                expr._meta.silent = true;
            }
            return expr;
        }

        case 'clone_expression': {
            const expr = visit(node.namedChildren[0], opts) as UAST.Expression;
            const call = UAST.callExpression(UAST.identifier('clone'), [expr]);
            return appendNodeMeta(call, node, sourcefile);
        }

        case 'print_intrinsic': {
            const expr = visit(node.namedChildren[0], opts) as UAST.Expression;
            const call = UAST.callExpression(UAST.identifier('print'), [expr]);
            return appendNodeMeta(call, node, sourcefile);
        }

        case 'exit_statement': {
            const args = node.namedChildren.length > 0
                ? [visit(node.namedChildren[0], opts) as UAST.Expression]
                : [];
            const call = UAST.callExpression(UAST.identifier('exit'), args);
            return appendNodeMeta(call, node, sourcefile);
        }

        case 'sequence_expression': {
            const items = visitList(node.namedChildren, opts);
            const seq = UAST.sequence(items);
            return appendNodeMeta(seq, node, sourcefile);
        }

        // ─── 语句 ───

        case 'compound_statement': {
            const body = flattenInstructions(visitList(node.namedChildren, opts));
            const scoped = UAST.scopedStatement(body);
            return appendNodeMeta(scoped, node, sourcefile);
        }

        case 'if_statement': {
            const condNode = node.childForFieldName('condition');
            // parenthesized_expression → 取内层
            const test = condNode && condNode.type === 'parenthesized_expression'
                ? visit(condNode.namedChildren[0], opts) as UAST.Expression
                : visit(condNode, opts) as UAST.Expression;
            const bodyNode = node.childForFieldName('body');
            const consequent = bodyNode
                ? visit(bodyNode, opts) as UAST.Instruction
                : UAST.scopedStatement([]);
            // alternative: else_clause 或 else_if_clause
            const altNode = node.childForFieldName('alternative');
            let alternate: UAST.Instruction | null = null;
            if (altNode) {
                if (altNode.type === 'else_if_clause') {
                    // 递归构建嵌套 if
                    const elseIfCond = altNode.childForFieldName('condition');
                    const elseIfTest = elseIfCond && elseIfCond.type === 'parenthesized_expression'
                        ? visit(elseIfCond.namedChildren[0], opts) as UAST.Expression
                        : visit(elseIfCond, opts) as UAST.Expression;
                    const elseIfBody = altNode.childForFieldName('body');
                    const elseIfConsequent = elseIfBody
                        ? visit(elseIfBody, opts) as UAST.Instruction
                        : UAST.scopedStatement([]);
                    const elseIfAlt = altNode.childForFieldName('alternative');
                    const nestedAlt = elseIfAlt ? visit(elseIfAlt, opts) as UAST.Instruction : null;
                    alternate = UAST.ifStatement(elseIfTest, elseIfConsequent, nestedAlt);
                    appendNodeMeta(alternate, altNode, sourcefile);
                } else if (altNode.type === 'else_clause') {
                    const elseBody = altNode.namedChildren[0];
                    alternate = elseBody ? visit(elseBody, opts) as UAST.Instruction : UAST.scopedStatement([]);
                } else {
                    alternate = visit(altNode, opts) as UAST.Instruction;
                }
            }
            const ifStmt = UAST.ifStatement(test, consequent, alternate);
            return appendNodeMeta(ifStmt, node, sourcefile);
        }

        case 'else_if_clause': {
            const condNode = node.childForFieldName('condition');
            const test = condNode && condNode.type === 'parenthesized_expression'
                ? visit(condNode.namedChildren[0], opts) as UAST.Expression
                : visit(condNode, opts) as UAST.Expression;
            const bodyNode = node.childForFieldName('body');
            const consequent = bodyNode
                ? visit(bodyNode, opts) as UAST.Instruction
                : UAST.scopedStatement([]);
            const altNode = node.childForFieldName('alternative');
            const alternate = altNode ? visit(altNode, opts) as UAST.Instruction : null;
            const ifStmt = UAST.ifStatement(test, consequent, alternate);
            return appendNodeMeta(ifStmt, node, sourcefile);
        }

        case 'else_clause': {
            const child = node.namedChildren[0];
            return child ? visit(child, opts) : appendNodeMeta(UAST.scopedStatement([]), node, sourcefile);
        }

        case 'return_statement': {
            const child = node.namedChildren[0] || null;
            const ret = UAST.returnStatement(child ? visit(child, opts) as UAST.Expression : null);
            return appendNodeMeta(ret, node, sourcefile);
        }

        case 'break_statement': {
            const stmt = UAST.breakStatement();
            const levelNode = node.namedChildren[0];
            if (levelNode && levelNode.type === 'integer') {
                stmt._meta.level = Number(levelNode.text);
            }
            return appendNodeMeta(stmt, node, sourcefile);
        }

        case 'continue_statement': {
            const stmt = UAST.continueStatement();
            const levelNode = node.namedChildren[0];
            if (levelNode && levelNode.type === 'integer') {
                stmt._meta.level = Number(levelNode.text);
            }
            return appendNodeMeta(stmt, node, sourcefile);
        }

        case 'throw_expression': {
            const expr = visit(node.namedChildren[0], opts) as UAST.Expression;
            const stmt = UAST.throwStatement(expr);
            return appendNodeMeta(stmt, node, sourcefile);
        }

        case 'try_statement': {
            const bodyNode = node.childForFieldName('body');
            const body = bodyNode ? visit(bodyNode, opts) as UAST.Statement : UAST.scopedStatement([]) as any;
            const catches: Array<UAST.CatchClause> = [];
            let finalizer: UAST.Instruction | null = null;
            for (const child of node.namedChildren) {
                if (child.type === 'catch_clause') {
                    catches.push(visit(child, opts) as UAST.CatchClause);
                } else if (child.type === 'finally_clause') {
                    const finallyBody = child.namedChildren[0];
                    finalizer = finallyBody ? visit(finallyBody, opts) as UAST.Instruction : UAST.scopedStatement([]);
                }
            }
            const tryStmt = UAST.tryStatement(body, catches.length > 0 ? catches : null, finalizer);
            return appendNodeMeta(tryStmt, node, sourcefile);
        }

        case 'catch_clause': {
            let paramId: UAST.Identifier = UAST.identifier('_');
            const catchTypes: Array<any> = [];
            let catchBody: UAST.Instruction = UAST.scopedStatement([]);
            for (const child of node.namedChildren) {
                if (child.type === 'type_list') {
                    for (const typeChild of child.namedChildren) {
                        catchTypes.push(visit(typeChild, opts));
                    }
                } else if (child.type === 'named_type' || child.type === 'qualified_name' || child.type === 'name') {
                    catchTypes.push(visit(child, opts));
                } else if (child.type === 'variable_name') {
                    paramId = visit(child, opts) as UAST.Identifier;
                } else if (child.type === 'compound_statement') {
                    catchBody = visit(child, opts) as UAST.Instruction;
                }
            }
            const param = UAST.variableDeclaration(paramId, null, false, UAST.dynamicType());
            param._meta.catchTypes = catchTypes;
            appendNodeMeta(param, node, sourcefile);
            const clause = UAST.catchClause([param], catchBody);
            return appendNodeMeta(clause, node, sourcefile);
        }

        case 'switch_statement': {
            const condNode = node.childForFieldName('condition');
            const discriminant = condNode && condNode.type === 'parenthesized_expression'
                ? visit(condNode.namedChildren[0], opts) as UAST.Expression
                : visit(condNode, opts) as UAST.Expression;
            const bodyNode = node.childForFieldName('body');
            // 只取 case_statement / default_statement，过滤 comment 等
            const caseNodes = bodyNode
                ? bodyNode.namedChildren.filter((c) => c.type === 'case_statement' || c.type === 'default_statement')
                : [];
            const cases = visitList(caseNodes, opts) as Array<UAST.CaseClause>;
            const switchStmt = UAST.switchStatement(discriminant, cases);
            return appendNodeMeta(switchStmt, node, sourcefile);
        }

        case 'case_statement': {
            const children = node.namedChildren;
            const test = children.length > 0 ? visit(children[0], opts) as UAST.Expression : null;
            const bodyStatements = children.length > 1
                ? flattenInstructions(visitList(children.slice(1), opts))
                : [];
            const body = UAST.scopedStatement(bodyStatements);
            appendNodeMeta(body, node, sourcefile);
            const clause = UAST.caseClause(test, body);
            return appendNodeMeta(clause, node, sourcefile);
        }

        case 'default_statement': {
            const bodyStatements = flattenInstructions(visitList(node.namedChildren, opts));
            const body = UAST.scopedStatement(bodyStatements);
            appendNodeMeta(body, node, sourcefile);
            const clause = UAST.caseClause(null, body);
            return appendNodeMeta(clause, node, sourcefile);
        }

        case 'for_statement': {
            const children = node.namedChildren;
            let init: UAST.Expression | null = null;
            let test: UAST.Expression | null = null;
            let update: UAST.Expression | null = null;
            let forBody: UAST.Instruction = UAST.scopedStatement([]);
            const bodyIdx = children.findIndex((c) => c.type === 'compound_statement' || c.type === 'colon_block');
            if (bodyIdx >= 0) {
                forBody = visit(children[bodyIdx], opts) as UAST.Instruction;
            }
            const exprs = children.filter((c) => c.type !== 'compound_statement' && c.type !== 'colon_block');
            if (exprs.length >= 1) init = visit(exprs[0], opts) as UAST.Expression;
            if (exprs.length >= 2) test = visit(exprs[1], opts) as UAST.Expression;
            if (exprs.length >= 3) update = visit(exprs[2], opts) as UAST.Expression;
            const forStmt = UAST.forStatement(init, test, update, forBody);
            return appendNodeMeta(forStmt, node, sourcefile);
        }

        case 'foreach_statement': {
            const children = node.namedChildren;
            let source: UAST.Expression = UAST.noop() as any;
            let key: UAST.VariableDeclaration | null = null;
            let value: UAST.VariableDeclaration | null = null;
            let foreachBody: UAST.Instruction = UAST.scopedStatement([]);
            const bodyIdx = children.findIndex((c) => c.type === 'compound_statement' || c.type === 'colon_block');
            if (bodyIdx >= 0) {
                foreachBody = visit(children[bodyIdx], opts) as UAST.Instruction;
            }
            const nonBody = children.filter((c) => c.type !== 'compound_statement' && c.type !== 'colon_block');
            if (nonBody.length >= 1) {
                source = visit(nonBody[0], opts) as UAST.Expression;
            }
            if (nonBody.length >= 2) {
                const second = nonBody[1];
                if (second.type === 'pair') {
                    const pairChildren = second.namedChildren;
                    if (pairChildren.length >= 2) {
                        const keyExpr = visit(pairChildren[0], opts) as UAST.LVal;
                        key = UAST.variableDeclaration(keyExpr, null, false, UAST.dynamicType());
                        appendNodeMeta(key, pairChildren[0], sourcefile);
                        const valExpr = visit(pairChildren[1], opts) as UAST.LVal;
                        value = UAST.variableDeclaration(valExpr, null, false, UAST.dynamicType());
                        appendNodeMeta(value, pairChildren[1], sourcefile);
                    }
                } else {
                    const valExpr = visit(second, opts) as UAST.LVal;
                    value = UAST.variableDeclaration(valExpr, null, false, UAST.dynamicType());
                    appendNodeMeta(value, second, sourcefile);
                }
            }
            const rangeStmt = UAST.rangeStatement(key, value, source, foreachBody);
            return appendNodeMeta(rangeStmt, node, sourcefile);
        }

        case 'while_statement': {
            const condNode = node.childForFieldName('condition');
            const test = condNode && condNode.type === 'parenthesized_expression'
                ? visit(condNode.namedChildren[0], opts) as UAST.Expression
                : visit(condNode, opts) as UAST.Expression;
            const bodyNode = node.childForFieldName('body');
            const whileBody = bodyNode ? visit(bodyNode, opts) as UAST.Instruction : UAST.scopedStatement([]);
            const stmt = UAST.whileStatement(test, whileBody, false);
            return appendNodeMeta(stmt, node, sourcefile);
        }

        case 'do_statement': {
            const bodyNode = node.childForFieldName('body');
            const doBody = bodyNode ? visit(bodyNode, opts) as UAST.Instruction : UAST.scopedStatement([]);
            const condNode = node.childForFieldName('condition');
            const test = condNode && condNode.type === 'parenthesized_expression'
                ? visit(condNode.namedChildren[0], opts) as UAST.Expression
                : visit(condNode, opts) as UAST.Expression;
            const stmt = UAST.whileStatement(test, doBody, true);
            return appendNodeMeta(stmt, node, sourcefile);
        }

        case 'empty_statement':
            return appendNodeMeta(UAST.noop(), node, sourcefile);

        case 'goto_statement': {
            const noop = UAST.noop();
            noop._meta.goto = node.namedChildren[0] ? node.namedChildren[0].text : null;
            return appendNodeMeta(noop, node, sourcefile);
        }

        case 'named_label_statement': {
            const noop = UAST.noop();
            noop._meta.label = node.namedChildren[0] ? node.namedChildren[0].text : null;
            return appendNodeMeta(noop, node, sourcefile);
        }

        case 'unset_statement': {
            const args = visitList(node.namedChildren, opts) as Array<UAST.Expression>;
            const call = UAST.callExpression(UAST.identifier('unset'), args);
            appendNodeMeta(call, node, sourcefile);
            const exprStmt = UAST.expressionStatement(call);
            return appendNodeMeta(exprStmt, node, sourcefile);
        }

        // ─── 声明 ───

        case 'function_definition':
        case 'method_declaration':
            return createFunctionLike(node, opts);

        case 'anonymous_function': {
            const fdef = createFunctionLike(node, opts);
            for (const child of node.namedChildren) {
                if (child.type === 'anonymous_function_use_clause') {
                    fdef._meta.uses = visitList(child.namedChildren, opts);
                    break;
                }
            }
            return fdef;
        }

        case 'arrow_function': {
            const paramsNode = node.childForFieldName('parameters');
            const parameters = paramsNode
                ? paramsNode.namedChildren.map((p) => createParameter(p, opts))
                : [];
            const bodyNode = node.childForFieldName('body');
            let body: UAST.Instruction;
            if (bodyNode) {
                const bodyExpr = visit(bodyNode, opts);
                if (bodyExpr && UAST.isNode(bodyExpr) && !UAST.isExpr(bodyExpr)) {
                    body = bodyExpr as UAST.Instruction;
                } else {
                    const ret = UAST.returnStatement(bodyExpr as UAST.Expression);
                    appendNodeMeta(ret, bodyNode, sourcefile);
                    body = UAST.scopedStatement([ret]);
                    appendNodeMeta(body, bodyNode, sourcefile);
                }
            } else {
                body = UAST.scopedStatement([]);
            }
            const fdef = UAST.functionDefinition(null, parameters, UAST.dynamicType(), body, []);
            return appendNodeMeta(fdef, node, sourcefile);
        }

        case 'simple_parameter':
        case 'variadic_parameter':
        case 'property_promotion_parameter':
            return createParameter(node, opts);

        case 'class_declaration':
            return createClassLike(node, opts);

        case 'interface_declaration':
            return createClassLike(node, opts, 'interface');

        case 'trait_declaration':
            return createClassLike(node, opts, 'trait');

        case 'enum_declaration': {
            const nameNode = node.childForFieldName('name');
            const id = nameNode ? visit(nameNode, opts) as UAST.Identifier : null;
            const bodyNode = node.childForFieldName('body');
            const body = bodyNode
                ? flattenInstructions(visitList(bodyNode.namedChildren, opts))
                : [];
            const cdef = UAST.classDefinition(id, body, []);
            cdef._meta.kind = 'enum';
            return appendNodeMeta(cdef, node, sourcefile);
        }

        case 'enum_case': {
            const nameNode = node.childForFieldName('name');
            const id = nameNode ? visit(nameNode, opts) as UAST.Identifier : UAST.identifier('_');
            let init: UAST.Expression | null = null;
            for (const child of node.namedChildren) {
                if (child !== nameNode && child.type !== 'name') {
                    init = visit(child, opts) as UAST.Expression;
                    break;
                }
            }
            const decl = UAST.variableDeclaration(id, init, false, UAST.dynamicType());
            decl._meta.enumCase = true;
            return appendNodeMeta(decl, node, sourcefile);
        }

        case 'property_declaration': {
            const declarations: Array<any> = [];
            let visibility: string | null = null;
            let isStatic = false;
            let isReadonly = false;
            for (const child of node.namedChildren) {
                if (child.type === 'visibility_modifier') {
                    visibility = child.text;
                } else if (child.type === 'static_modifier') {
                    isStatic = true;
                } else if (child.type === 'readonly_modifier') {
                    isReadonly = true;
                } else if (child.type === 'property_element') {
                    const propName = child.childForFieldName('name') || child.namedChildren[0];
                    const propValue = child.namedChildren.length > 1 ? child.namedChildren[1] : null;
                    const id = propName ? visit(propName, opts) as UAST.LVal : UAST.identifier('_');
                    const init = propValue ? visit(propValue, opts) as UAST.Expression : null;
                    const decl = UAST.variableDeclaration(id, init, false, UAST.dynamicType());
                    decl._meta.visibility = visibility;
                    decl._meta.isStatic = isStatic;
                    decl._meta.readonly = isReadonly;
                    declarations.push(appendNodeMeta(decl, child, sourcefile));
                }
            }
            if (declarations.length === 1) return declarations[0];
            if (declarations.length === 0) return appendNodeMeta(UAST.noop(), node, sourcefile);
            return appendNodeMeta(UAST.sequence(declarations), node, sourcefile);
        }

        case 'const_declaration': {
            const declarations: Array<any> = [];
            for (const child of node.namedChildren) {
                if (child.type === 'const_element') {
                    const nameChild = child.childForFieldName('name') || child.namedChildren[0];
                    const valueChild = child.childForFieldName('value') || child.namedChildren[1];
                    const id = nameChild ? visit(nameChild, opts) as UAST.LVal : UAST.identifier('_');
                    const init = valueChild ? visit(valueChild, opts) as UAST.Expression : null;
                    const decl = UAST.variableDeclaration(id, init, false, UAST.dynamicType());
                    decl._meta.constant = true;
                    declarations.push(appendNodeMeta(decl, child, sourcefile));
                }
            }
            if (declarations.length === 1) return declarations[0];
            if (declarations.length === 0) return appendNodeMeta(UAST.noop(), node, sourcefile);
            return appendNodeMeta(UAST.sequence(declarations), node, sourcefile);
        }

        case 'use_declaration': {
            // trait use 语句
            const traitNames = visitList(node.namedChildren, opts) as Array<UAST.Expression>;
            const call = UAST.callExpression(UAST.identifier('trait_use'), traitNames);
            call._meta.synthetic = true;
            appendNodeMeta(call, node, sourcefile);
            const exprStmt = UAST.expressionStatement(call);
            return appendNodeMeta(exprStmt, node, sourcefile);
        }

        case 'namespace_definition': {
            const nameNode = node.childForFieldName('name');
            const bodyNode = node.childForFieldName('body');
            const instructions: Array<UAST.Instruction> = [];
            if (nameNode) {
                const pkg = UAST.packageDeclaration(UAST.identifier(nameNode.text));
                instructions.push(appendNodeMeta(pkg, nameNode, sourcefile));
            }
            if (bodyNode) {
                instructions.push(...flattenInstructions(visitList(bodyNode.namedChildren, opts)));
            }
            if (instructions.length === 1) return instructions[0];
            if (instructions.length === 0) return appendNodeMeta(UAST.noop(), node, sourcefile);
            return appendNodeMeta(UAST.sequence(instructions), node, sourcefile);
        }

        case 'namespace_use_declaration': {
            const imports: Array<any> = [];
            for (const child of node.namedChildren) {
                if (child.type === 'namespace_use_clause') {
                    const nameChild = child.namedChildren[0];
                    const from = UAST.literal(nameChild ? nameChild.text : '', 'string');
                    const aliasChild = child.namedChildren.length > 1 ? child.namedChildren[1] : null;
                    const alias = aliasChild ? visit(aliasChild, opts) as UAST.Identifier : undefined;
                    const importExpr = UAST.importExpression(from, alias);
                    imports.push(appendNodeMeta(importExpr, child, sourcefile));
                } else if (child.type === 'namespace_use_group') {
                    for (const groupChild of child.namedChildren) {
                        if (groupChild.type === 'namespace_use_group_clause') {
                            const gcName = groupChild.namedChildren[0];
                            const from = UAST.literal(gcName ? gcName.text : '', 'string');
                            const gcAlias = groupChild.namedChildren.length > 1 ? groupChild.namedChildren[1] : null;
                            const alias = gcAlias ? visit(gcAlias, opts) as UAST.Identifier : undefined;
                            const importExpr = UAST.importExpression(from, alias);
                            imports.push(appendNodeMeta(importExpr, groupChild, sourcefile));
                        }
                    }
                }
            }
            if (imports.length === 1) {
                return UAST.expressionStatement(imports[0]);
            }
            if (imports.length === 0) return appendNodeMeta(UAST.noop(), node, sourcefile);
            return appendNodeMeta(UAST.sequence(imports.map((i: any) => UAST.expressionStatement(i))), node, sourcefile);
        }

        case 'global_declaration': {
            const declarations = node.namedChildren.map((child) => {
                const id = visit(child, opts) as UAST.LVal;
                const decl = UAST.variableDeclaration(id, null, false, UAST.dynamicType());
                decl._meta.storage = 'global';
                return appendNodeMeta(decl, child, sourcefile);
            });
            if (declarations.length === 1) return declarations[0];
            if (declarations.length === 0) return appendNodeMeta(UAST.noop(), node, sourcefile);
            return appendNodeMeta(UAST.sequence(declarations), node, sourcefile);
        }

        case 'function_static_declaration': {
            const declarations: Array<any> = [];
            for (const child of node.namedChildren) {
                if (child.type === 'static_variable_declaration') {
                    const varName = child.namedChildren[0];
                    const varInit = child.namedChildren.length > 1 ? child.namedChildren[1] : null;
                    const id = varName ? visit(varName, opts) as UAST.LVal : UAST.identifier('_');
                    const init = varInit ? visit(varInit, opts) as UAST.Expression : null;
                    const decl = UAST.variableDeclaration(id, init, false, UAST.dynamicType());
                    decl._meta.storage = 'static';
                    declarations.push(appendNodeMeta(decl, child, sourcefile));
                }
            }
            if (declarations.length === 1) return declarations[0];
            if (declarations.length === 0) return appendNodeMeta(UAST.noop(), node, sourcefile);
            return appendNodeMeta(UAST.sequence(declarations), node, sourcefile);
        }

        case 'declare_statement': {
            const directives: Array<{ key: any; value: any }> = [];
            let declareBody: UAST.Instruction | null = null;
            for (const child of node.namedChildren) {
                if (child.type === 'declare_directive') {
                    const key = child.namedChildren[0] ? visit(child.namedChildren[0], opts) : null;
                    const value = child.namedChildren[1] ? visit(child.namedChildren[1], opts) : null;
                    directives.push({ key, value });
                } else if (child.type === 'compound_statement' || child.type === 'colon_block') {
                    declareBody = visit(child, opts) as UAST.Instruction;
                }
            }
            const result = declareBody || appendNodeMeta(UAST.noop(), node, sourcefile);
            if (result && UAST.isNode(result)) {
                result._meta.declare = { directives };
            }
            return appendNodeMeta(result, node, sourcefile);
        }

        // ─── 辅助节点类型 ───

        case 'named_type': {
            const child = node.namedChildren[0];
            return child ? visit(child, opts) : appendNodeMeta(UAST.identifier(node.text), node, sourcefile);
        }

        case 'colon_block': {
            const body = flattenInstructions(visitList(node.namedChildren, opts));
            return appendNodeMeta(UAST.scopedStatement(body), node, sourcefile);
        }

        default: {
            const noop = UAST.noop();
            return appendNodeMeta(noop, node, sourcefile);
        }
    }
}

function sanitize(node: any) {
    if (!node) {
        return;
    }

    if (Array.isArray(node)) {
        node.forEach((item: any) => sanitize(item));
        return;
    }

    if (!node.type) {
        return;
    }

    if (node.loc) {
        Object.keys(node.loc).forEach((key: string) => {
            if (!['start', 'end', 'sourcefile'].includes(key)) {
                delete node.loc[key];
            }
        });
    }

    Object.keys(node).forEach((key: string) => sanitize(node[key]));
}

export function parse(content: string, opts: Record<string, any> = {}): ParseResult<UAST.Node> {
    const parser = getParser();
    const tree = parser.parse(content);
    if (!tree) {
        throw new Error('Failed to parse PHP code');
    }
    try {
        const node = visit(tree.rootNode, opts);
        sanitize(node);
        return node;
    } finally {
        tree.delete();
    }
}
