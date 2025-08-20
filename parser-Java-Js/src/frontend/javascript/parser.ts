// @ts-ignore
import * as babelCore from '@babel/core';
import * as babelParser from '@babel/parser';
import * as AST from '@babel/types';
import * as UAST from '@ant-yasa/uast-spec';
import { Expression, Identifier, Instruction, Statement, version } from '@ant-yasa/uast-spec';


const visitor = (opts: any) => ({

    EmptyStatement(node: AST.EmptyStatement): ParseResult<UAST.Node> {
        return UAST.noop();
    },

    File(node: AST.File): ParseResult<UAST.Node> {
        return visit(node.program, opts);
    },
    Program(node: AST.Program): ParseResult<UAST.Node> {
        const body = node.body.map((stmt: AST.Statement) => {
            return visit(stmt, opts) as Statement
        })
        // @ts-ignore
        const source = node.loc?.filename || '';
        return UAST.compileUnit(body, 'javascript', null, source, version);
    },
    Identifier(node: AST.Identifier): ParseResult<Identifier> {
        return UAST.identifier(node.name);
    },
    PrivateName(node: AST.PrivateName): ParseResult<UAST.Identifier> {
        return UAST.identifier(node.id.name);
    },
    RegExpLiteral(node: AST.RegExpLiteral): ParseResult<UAST.Literal> {
        return UAST.literal(node.pattern, 'string');
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    NullLiteral(node: AST.NullLiteral): ParseResult<UAST.Literal> {
        return UAST.literal(null, 'null');
    },
    StringLiteral(node: AST.StringLiteral): ParseResult<UAST.Literal> {
        return UAST.literal(node.value, 'string');
    },
    BooleanLiteral(node: AST.BooleanLiteral): ParseResult<UAST.Literal> {
        return UAST.literal(node.value, 'boolean');
    },
    NumericLiteral(node: AST.NumericLiteral): ParseResult<UAST.Literal> {
        return UAST.literal(node.value, 'number');
    },
    BigIntLiteral(node: AST.BigIntLiteral): ParseResult<UAST.Literal> {
        return UAST.literal(node.value, 'number');
    },
    DecimalLiteral(node: AST.DecimalLiteral): ParseResult<UAST.Literal> {
        return UAST.literal(node.value, 'string');
    },
    TemplateLiteral(node: AST.TemplateLiteral): ParseResult<UAST.Expression> {
        if (node.quasis.length === 1) {
            return UAST.literal(node.quasis[0].value.raw, 'string');
        }

        return buildBinaryExpression(node.quasis, node.expressions, false);

        function buildBinaryExpression(quasis: Array<AST.TemplateElement>, expressions: Array<AST.Expression | AST.TSType>, exprProcess: boolean): UAST.Expression {
            if (!exprProcess) {
                const quasi = quasis.shift();
                if (!quasi) {
                    return UAST.literal("", 'string');
                }
                if (quasi.tail) {
                    const quasiLit = UAST.literal(quasi.value.raw, 'string');
                    quasiLit.loc = quasi.loc;
                    return quasiLit;
                }
                const binaryExpression = UAST.binaryExpression('+',
                    UAST.literal(quasi.value.raw, 'string'),
                    buildBinaryExpression(quasis, expressions, true));
                binaryExpression.left.loc = quasi.loc;
                return binaryExpression;
            } else {
                const expr = expressions.shift();
                if (!expr) {
                    throw new Error('expr cannot be empty');
                }

                if (expressions.length == 0 && quasis.length == 0) {
                    return visit(expr as AST.Expression, opts) as Expression;
                }
                return UAST.binaryExpression('+',
                    visit(expr as AST.Expression, opts) as Expression,
                    buildBinaryExpression(quasis, expressions, false));
            }
        }
    },

    ExpressionStatement(node: AST.ExpressionStatement): ParseResult<UAST.ExpressionStatement> {
        return UAST.expressionStatement(visit(node.expression, opts) as Expression);
    },
    BlockStatement(node: AST.BlockStatement): ParseResult<UAST.ScopedStatement> {
        return UAST.scopedStatement(node.body.map((stmt) => {
            return visit(stmt, opts) as Statement;
        }), null)
    },
    // with(x) { //code }
    //  to
    // {
    //    ...x;
    //    //code
    // }
    WithStatement(node: AST.WithStatement): ParseResult<UAST.ScopedStatement> {
        const spreadElement = UAST.spreadElement(visit(node.object, opts) as Expression);
        const body = visit(node.body, opts);

        return UAST.scopedStatement([
            UAST.expressionStatement(spreadElement),
            body as Statement
        ], null)
    },
    ReturnStatement(node: AST.ReturnStatement): ParseResult<UAST.ReturnStatement> {
        return UAST.returnStatement(visit(node.argument, opts) as Expression)
    },
    LabeledStatement(node: AST.LabeledStatement): ParseResult<UAST.ScopedStatement> {
        return UAST.scopedStatement([visit(node.body, opts) as Statement], visit(node.label, opts) as Identifier);
    },
    BreakStatement(node: AST.BreakStatement): ParseResult<UAST.BreakStatement> {
        return UAST.breakStatement(visit(node.label, opts) as Identifier)
    },
    ContinueStatement(node: AST.ContinueStatement): ParseResult<UAST.ContinueStatement> {
        return UAST.continueStatement(visit(node.label, opts) as Identifier)
    },
    IfStatement(node: AST.IfStatement): ParseResult<UAST.IfStatement> {
        return UAST.ifStatement(visit(node.test, opts) as Expression, visit(node.consequent, opts) as Statement, visit(node.alternate, opts) as Statement)
    },
    SwitchStatement(node: AST.SwitchStatement): ParseResult<UAST.SwitchStatement> {
        return UAST.switchStatement(visit(node.discriminant, opts) as Expression, node.cases.map((c) => {
            return visit(c, opts) as UAST.CaseClause
        }))
    },
    SwitchCase(node: AST.SwitchCase): ParseResult<UAST.CaseClause> {
        return UAST.caseClause(visit(node.test, opts) as Expression, UAST.scopedStatement(node.consequent.map((stmt) => {
            return visit(stmt, opts) as Statement
        })));
    },
    ThrowStatement(node: AST.ThrowStatement): ParseResult<UAST.ThrowStatement> {
        return UAST.throwStatement(visit(node.argument, opts) as Expression)
    },
    TryStatement(node: AST.TryStatement): ParseResult<UAST.TryStatement> {
        let handlers;
        if (node.handler) {
            handlers = [visit(node.handler, opts) as UAST.CatchClause];
        }
        return UAST.tryStatement(visit(node.block, opts) as Statement, handlers, visit(node.finalizer, opts) as Statement)
    },
    CatchClause(node: AST.CatchClause): ParseResult<UAST.CatchClause> {
        const body = visit(node.body, opts) as Statement;
        const parameter: UAST.CatchClause['parameter'] = [];
        if (!node.param) {
            return UAST.catchClause(parameter, body)
        } else if (AST.isIdentifier(node.param)) {
            const visited = visit(node.param, opts);
            const decl = UAST.variableDeclaration(visited as Identifier, null, false, UAST.dynamicType());
            decl.loc = visited.loc;
            parameter.push(decl);
            return UAST.catchClause(parameter, body);
        } else { //patternLike
            const varDecl = createTmpVariableDeclaration();
            const seq = _visitPatternLike(node.param, varDecl.id, opts);
            seq.expressions.push(body);
            parameter.push(varDecl);
            return UAST.catchClause(parameter, seq);
        }
    },
    WhileStatement(node: AST.WhileStatement): ParseResult<UAST.WhileStatement> {
        return UAST.whileStatement(visit(node.test, opts) as Expression, visit(node.body, opts) as Statement, false);
    },
    DoWhileStatement(node: AST.DoWhileStatement): ParseResult<UAST.WhileStatement> {
        return UAST.whileStatement(visit(node.test, opts) as Expression, visit(node.body, opts) as Statement, true);
    },
    ForStatement(node: AST.ForStatement): ParseResult<UAST.ForStatement> {
        return UAST.forStatement(visit(node.init, opts) as Expression, visit(node.test, opts) as Expression, visit(node.update, opts) as Expression, visit(node.body, opts) as Statement);
    },
    ForInStatement(node: AST.ForInStatement): ParseResult<UAST.RangeStatement> {
        return _visitRangeStatement(node, opts);
    },
    ForOfStatement(node: AST.ForOfStatement): ParseResult<UAST.RangeStatement> {
        // TODO 对于Map的考虑 e.g. for( const [a, b] of map )
        return _visitRangeStatement(node, opts);
    },
    FunctionDeclaration(node: AST.FunctionDeclaration): ParseResult<UAST.FunctionDefinition> {
        const res = _visitFunctionLike(node, opts);
        if (node.async) {
            res._meta.async = true;
        }
        if (node.generator) {
            res._meta.generator = true;
        }
        return res;
    },

    // VariableDeclaration 在两个场景下使用：
    // 1. 作为Statement
    // 2. 作为init存在于 For-like Statment
    // visit 只处理情况1， 情况2放在For like 里单独处理
    VariableDeclaration(node: AST.VariableDeclaration): ParseResult<UAST.Instruction> {
        const resList: Array<Expression> = [];
        const attachList: Array<Expression | Statement> = [];
        node.declarations.forEach((d) => {
            attachList.push(visit(d, opts) as Expression | Statement);
        });

        const seq = _flatSequence(attachList);
        if (seq.expressions.length === 1) {
            return seq.expressions[0];
        } else {
            return seq;
        }
    },

    VariableDeclarator(node: AST.VariableDeclarator): ParseResult<UAST.Sequence> {
        if (AST.isIdentifier(node.id)) {
            let decl
            // 新增 如果是ArrayExpression 则相应variable的vartype设置为arraytype
            if (node?.init?.type === "ArrayExpression") {
                decl = UAST.variableDeclaration(visit(node.id, opts) as Identifier, visit(node.init, opts) as Expression, false, UAST.arrayType(UAST.identifier(node.id.name), UAST.dynamicType()));
                return UAST.sequence([decl]);
            }
            decl = UAST.variableDeclaration(visit(node.id, opts) as Identifier, visit(node.init, opts) as Expression, false, UAST.dynamicType());
            decl.loc = node.loc;
            return UAST.sequence([decl]);
        }

        if (AST.isObjectPattern(node.id) || AST.isArrayPattern(node.id)) {
            if (!node.init) {
                throw new Error('init is expected when id is pattern');
            }

            const tmpVarDecl = createTmpVariableDeclaration(visit(node.init, opts) as UAST.Expression, false);

            const sequence = _visitPatternLike(node.id, tmpVarDecl.id, opts);
            sequence.expressions.unshift(tmpVarDecl);
            return sequence;
        }
        // impossible
        throw new Error('VariableDeclarator id can not be any thing but id or pattern');
    },

    // Expressions

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Super(node: AST.Super): ParseResult<UAST.SuperExpression> {
        return UAST.superExpression();
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ThisExpression(node: AST.ThisExpression): ParseResult<UAST.ThisExpression> {
        return UAST.thisExpression();
    },
    ArrowFunctionExpression(node: AST.ArrowFunctionExpression): ParseResult<UAST.FunctionDefinition> {
        const res = _visitFunctionLike(node, opts);
        if (node.async) {
            res._meta.async = true;
        }
        if (node.generator) {
            res._meta.generator = true;
        }
        return res;
    },
    YieldExpression(node: AST.YieldExpression): ParseResult<UAST.Expression> {
        return UAST.returnStatement(visit(node.argument, opts) as Expression, true);
    },
    AwaitExpression(node: AST.AwaitExpression): ParseResult<UAST.Expression> {
        return visit(node.argument, opts) as Expression;
    },
    ArrayExpression(node: AST.ArrayExpression): ParseResult<UAST.Expression> {
        const objProperties: Array<UAST.ObjectProperty | UAST.SpreadElement> = [];
        node.elements.forEach((e, index) => {
            if (AST.isSpreadElement(e)) {
                objProperties.push(visit(e, opts) as UAST.SpreadElement);
            } else {
                if (e !== null) {
                    objProperties.push(UAST.objectProperty(UAST.literal(index, 'number'), visit(e, opts) as Expression));
                } else {
                    objProperties.push(UAST.objectProperty(UAST.literal(index, 'number'), UAST.literal(null, 'null')));
                }
            }
        });
        const uastNode = UAST.objectExpression(objProperties);
        uastNode._meta.isArray = true;
        return uastNode
    },
    ObjectExpression(node: AST.ObjectExpression): ParseResult<UAST.ObjectExpression> {
        const objProperties: Array<UAST.ObjectProperty | UAST.SpreadElement> = [];
        node.properties.forEach((p) => {
            objProperties.push(visit(p, opts) as UAST.ObjectProperty | UAST.SpreadElement);
        });
        return UAST.objectExpression(objProperties);
    },
    ObjectProperty(node: AST.ObjectProperty): ParseResult<UAST.ObjectProperty> {
        return UAST.objectProperty(visit(node.key, opts) as UAST.ObjectProperty['key'], visit(node.value, opts) as Expression);
    },
    ObjectMethod(node: AST.ObjectMethod): ParseResult<UAST.ObjectProperty> {
        const key = visit(node.key, opts) as Identifier | UAST.Literal;
        const value = _visitFunctionLike(node, opts);

        return UAST.objectProperty(key, value);
    },
    RecordExpression(node: AST.RecordExpression): ParseResult<UAST.ObjectExpression> {
        const objProperties: Array<UAST.ObjectProperty | UAST.SpreadElement> = [];
        node.properties.forEach((p) => {
            objProperties.push(visit(p, opts) as UAST.ObjectProperty | UAST.SpreadElement);
        });
        return UAST.objectExpression(objProperties);
    },
    TupleExpression(node: AST.TupleExpression): ParseResult<UAST.TupleExpression> {
        return UAST.tupleExpression(node.elements.map((e) => {
            return visit(e, opts) as Expression
        }));
    },
    FunctionExpression(node: AST.FunctionExpression): ParseResult<UAST.FunctionDefinition> {
        return _visitFunctionLike(node, opts);
    },
    UnaryExpression(node: AST.UnaryExpression): ParseResult<UAST.UnaryExpression> {
        return UAST.unaryExpression(node.operator as UAST.UnaryExpression['operator'], visit(node.argument, opts) as Expression, !node.prefix)
    },
    UpdateExpression(node: AST.UpdateExpression): ParseResult<UAST.UnaryExpression> {
        return UAST.unaryExpression(node.operator as UAST.UnaryExpression['operator'], visit(node.argument, opts) as Expression, !node.prefix)
    },
    BinaryExpression(node: AST.BinaryExpression): ParseResult<UAST.BinaryExpression> {
        let operator = node.operator;
        if (operator === '===') {
            operator = '==';
        }
        return UAST.binaryExpression(node.operator as UAST.BinaryExpression['operator'], visit(node.left, opts) as Expression, visit(node.right, opts) as Expression);
    },
    AssignmentExpression(node: AST.AssignmentExpression): ParseResult<UAST.Expression | UAST.Statement> {
        if (AST.isObjectPattern(node.left) || AST.isArrayPattern(node.left)) {
            const varDecl = createTmpVariableDeclaration(visit(node.right, opts) as Expression);
            varDecl.loc = node.right.loc;
            const seq = _visitPatternLike(node.left, varDecl.id, opts);
            seq.expressions.unshift(varDecl);
            return seq;
        }

        return UAST.assignmentExpression(visit(node.left, opts) as UAST.LVal, visit(node.right, opts) as Expression, node.operator as UAST.AssignmentExpression['operator'], false);
    },
    LogicalExpression(node: AST.LogicalExpression): ParseResult<UAST.BinaryExpression> {
        return UAST.binaryExpression(node.operator as UAST.BinaryExpression['operator'], visit(node.left, opts) as Expression, visit(node.right, opts) as Expression);
    },
    SpreadElement(node: AST.SpreadElement): ParseResult<UAST.SpreadElement> {
        return UAST.spreadElement(visit(node.argument, opts) as Expression)
    },
    RestElement(node: AST.RestElement): ParseResult<UAST.SpreadElement> {
        return UAST.spreadElement(visit(node.argument, opts) as Expression)
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ArgumentPlaceholder(node: AST.ArgumentPlaceholder): ParseResult<UAST.Node> {
        return UAST.noop();
    },
    MemberExpression(node: AST.MemberExpression): ParseResult<UAST.MemberAccess> {
        return UAST.memberAccess(visit(node.object, opts) as Expression, visit(node.property, opts) as Expression, node.computed);
    },
    OptionalMemberExpression(node: AST.OptionalMemberExpression): ParseResult<UAST.Expression> {
        return UAST.conditionalExpression(visit(node.object, opts) as Expression, UAST.literal(null, 'null'), UAST.memberAccess(visit(node.object, opts) as Expression, visit(node.property, opts) as Expression, node.computed) as Expression);
    },
    //TODO
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    BindExpression(node: AST.BindExpression): ParseResult<UAST.Node> {
        throw new Error('BindExpression is not been implemented');
    },
    ConditionalExpression(node: AST.ConditionalExpression): ParseResult<UAST.ConditionalExpression> {
        return UAST.conditionalExpression(visit(node.test, opts) as Expression, visit(node.consequent, opts) as Expression, visit(node.alternate, opts) as Expression);
    },
    CallExpression(node: AST.CallExpression): ParseResult<UAST.CallExpression> {
        return UAST.callExpression(visit(node.callee, opts) as Expression, node.arguments.map((arg) => {
            return visit(arg, opts) as Expression;
        }));
    },
    OptionalCallExpression(node: AST.OptionalCallExpression): ParseResult<UAST.ConditionalExpression> {
        return UAST.conditionalExpression(visit(node.callee, opts) as Expression, UAST.literal(null, 'null'),
            UAST.callExpression(visit(node.callee, opts) as Expression, node.arguments.map((arg) => {
                return visit(arg, opts) as Expression;
            })));
    },
    NewExpression(node: AST.NewExpression): ParseResult<UAST.NewExpression> {
        return UAST.newExpression(visit(node.callee, opts) as Expression, node.arguments.map((arg) => {
            return visit(arg, opts) as Expression;
        }));
    },
    SequenceExpression(node: AST.SequenceExpression): ParseResult<UAST.Sequence> {
        return UAST.sequence(node.expressions.map((expr) => {
            return visit(expr, opts) as Expression;
        }));
    },
    ParenthesizedExpression(node: AST.ParenthesizedExpression): ParseResult<UAST.Expression> {
        return visit(node.expression, opts) as Expression;
    },
    DoExpression(node: AST.DoExpression): ParseResult<UAST.Expression> {
        return visit(node.body, opts) as Expression;
    },
    ModuleExpression(node: AST.ModuleExpression): ParseResult<Statement> {
        return UAST.scopedStatement(node.body.body.map((stmt) => {
            return visit(stmt, opts) as Statement;
        }));
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TopicReference(node: AST.TopicReference): ParseResult<UAST.Noop> {
        return UAST.noop();
    },
    // TODO
    //  TemplateLiteral
    // TaggedTemplateExpression
    // TemplateElement
    ClassBody(): ParseResult<UAST.Expression> {
        throw new Error('ClassBody should not be visited');
    },
    ClassMethod(node: AST.ClassMethod): ParseResult<UAST.FunctionDefinition> {
        const res = _visitFunctionLike(node, opts);
        if (node.kind === 'constructor') {
            res._meta.isConstructor = true;
        }
        if (node.async) {
            res._meta.async = true;
        }
        if (node.generator) {
            res._meta.generator = true;
        }
        if (node.static) {
            res._meta.static = true;
        }
        return res;
    },
    ClassPrivateMethod(node: AST.ClassPrivateMethod): ParseResult<UAST.FunctionDefinition> {
        return _visitFunctionLike(node, opts);
    },
    ClassProperty(node: AST.ClassProperty): ParseResult<UAST.VariableDeclaration> {
        if (node.typeAnnotation && node.typeAnnotation != null) {
            if (node.typeAnnotation.type === "TSTypeAnnotation") {
                const tsTypeAnnotation = node.typeAnnotation;
                if (tsTypeAnnotation?.typeAnnotation?.type === "TSTypeReference") {
                    if ("typeName" in node.typeAnnotation.typeAnnotation && node.typeAnnotation.typeAnnotation?.typeName?.type === "Identifier") {
                        const type = node.typeAnnotation.typeAnnotation?.typeName
                        return UAST.variableDeclaration(visit(node.key, opts) as Identifier, visit(node.value, opts) as Expression, false, UAST.scopedType(visit(type, opts) as Identifier, null));
                    }
                }
            }
        }
        return UAST.variableDeclaration(visit(node.key, opts) as Identifier, visit(node.value, opts) as Expression, false, UAST.dynamicType());
    },
    ClassPrivateProperty(node: AST.ClassPrivateProperty): ParseResult<UAST.VariableDeclaration> {
        if (node.typeAnnotation && node.typeAnnotation != null) {
            if (node.typeAnnotation.type === "TSTypeAnnotation") {
                const tsTypeAnnotation = node.typeAnnotation;
                if (tsTypeAnnotation?.typeAnnotation?.type === "TSTypeReference") {
                    if ("typeName" in node.typeAnnotation.typeAnnotation && node.typeAnnotation.typeAnnotation?.typeName?.type === "Identifier") {
                        const type = node.typeAnnotation.typeAnnotation?.typeName
                        return UAST.variableDeclaration(visit(node.key, opts) as Identifier, visit(node.value, opts) as Expression, false, UAST.scopedType(visit(type, opts) as Identifier, null));
                    }
                }
            }
        }
        return UAST.variableDeclaration(visit(node.key, opts) as Identifier, visit(node.value, opts) as Expression, false, UAST.dynamicType());
    },
    StaticBlock(node: AST.StaticBlock): ParseResult<UAST.Statement> {
        return UAST.scopedStatement(node.body.map((stmt) => visit(stmt, opts) as Statement));
    },
    ClassDeclaration(node: AST.ClassDeclaration): ParseResult<UAST.ClassDefinition> {

        return UAST.classDefinition(visit(node.id, opts) as Identifier, node.body.body.map((n) => {
            return visit(n, opts) as UAST.Statement;
        }), [visit(node.superClass, opts) as Expression]);
    },
    ClassExpression(node: AST.ClassExpression): ParseResult<UAST.ClassDefinition> {
        return UAST.classDefinition(visit(node.id, opts) as Identifier, node.body.body.map((n) => {
            return visit(n, opts) as UAST.Statement;
        }), [visit(node.superClass, opts) as Expression]);
    },
    MetaProperty(node: AST.MetaProperty): ParseResult<UAST.ObjectProperty> {
        return UAST.objectProperty(visit(node.meta, opts) as Identifier, visit(node.property, opts) as Identifier);
    },
    ImportDeclaration(node: AST.ImportDeclaration): ParseResult<UAST.Sequence> {
        const importExpression = UAST.importExpression(visit(node.source, opts) as UAST.Literal);
        const exportVal = createTmpVariableDeclaration(importExpression);
        const sequence = node.specifiers.map((n) => {
            const specifierDecl = visit(n, opts) as UAST.VariableDeclaration;
            if (AST.isImportSpecifier(n)) {
                specifierDecl.init = UAST.memberAccess(exportVal.id, visit(n.imported, opts) as Identifier, false);
            } else if (AST.isImportDefaultSpecifier(n)) {
                specifierDecl.init = UAST.memberAccess(exportVal.id, UAST.identifier('default'), false);
            } else { // ImportNamespaceSpecifier
                specifierDecl.init = exportVal.id;
            }

            return specifierDecl;
        });
        sequence.unshift(exportVal);
        return UAST.sequence(sequence as UAST.Sequence['expressions']);
    },
    ImportSpecifier(node: AST.ImportSpecifier): ParseResult<UAST.VariableDeclaration> {
        return UAST.variableDeclaration(visit(node.local, opts) as Identifier, null, false, UAST.dynamicType());
    },
    ImportDefaultSpecifier(node: AST.ImportDefaultSpecifier): ParseResult<UAST.VariableDeclaration> {
        return UAST.variableDeclaration(visit(node.local, opts) as Identifier, null, false, UAST.dynamicType());
    },
    ImportNamespaceSpecifier(node: AST.ImportNamespaceSpecifier): ParseResult<UAST.VariableDeclaration> {
        return UAST.variableDeclaration(visit(node.local, opts) as Identifier, null, false, UAST.dynamicType());
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ImportAttribute(node: AST.ImportAttribute): ParseResult<UAST.Node> {
        throw new Error('ImportAttribute is not implemented yet');
    },
    ExportNamedDeclaration(node: AST.ExportNamedDeclaration): ParseResult<Statement> {
        // case 1: export let x = 1;
        if (node.declaration) {
            if ('id' in node.declaration) {
                return UAST.sequence([visit(node.declaration, opts) as Statement, UAST.exportStatement(visit(node.declaration, opts) as Expression, visit(node.declaration.id, opts) as Identifier)]);
            } else if ('declarations' in node.declaration) {
                return UAST.sequence([visit(node.declaration, opts) as Statement, UAST.exportStatement(visit(node.declaration.declarations[0].id, opts) as Expression, visit(node.declaration.declarations[0].id, opts) as Identifier)]);
            }
            throw new Error('ExportNamedDeclaration: declaration should have id or declarations');
        }

        // export ... from 'xx'
        if (node.source) {
            const importVal = createTmpVariableDeclaration(UAST.importExpression(visit(node.source, opts) as UAST.Literal));

            const sequence = UAST.sequence([]);
            const scopeList = sequence.expressions;
            scopeList.push(importVal);
            node.specifiers.map((specifier) => {
                if (AST.isExportSpecifier(specifier)) {
                    const exportId = visit(specifier.exported, opts) as Identifier
                    scopeList.push(UAST.variableDeclaration(exportId,
                        UAST.memberAccess(importVal.id, visit(specifier.local, opts) as Identifier), false, UAST.dynamicType()));
                    scopeList.push(UAST.exportStatement(exportId, exportId));
                }
            });
            return sequence
        } else {
            const seqList = node.specifiers.map((specifier) => {
                if (AST.isExportSpecifier(specifier)) {
                    return UAST.exportStatement(visit(specifier.local, opts) as Identifier, visit(specifier.exported, opts) as Identifier);
                }
                throw new Error('specifier should only be ExportSpecifier');
            });
            return UAST.sequence(seqList);
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ExportSpecifier(node: AST.ExportSpecifier): ParseResult<UAST.VariableDeclaration> {
        throw new Error('ExportSpecifier should not be visited, since it has processed where it occurs');
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ExportDefaultSpecifier(node: AST.ExportDefaultSpecifier): ParseResult<UAST.VariableDeclaration> {
        throw new Error('ExportDefaultSpecifier should not be visited, since it has processed where it occurs');
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ExportNamespaceSpecifier(node: AST.ExportNamespaceSpecifier): ParseResult<UAST.VariableDeclaration> {
        throw new Error('ExportNamespaceSpecifier should not be visited, since it has processed where it occurs');
    },
    ExportDefaultDeclaration(node: AST.ExportDefaultDeclaration): ParseResult<UAST.Statement> {
        const importVal = createTmpVariableDeclaration(visit(node.declaration, opts) as Expression);

        const scope = UAST.scopedStatement([]);
        const scopeList = scope.body;
        scopeList.push(importVal);
        scopeList.push(UAST.exportStatement(importVal.id, UAST.identifier('default')));

        return scope;
    },
    ExportAllDeclaration(node: AST.ExportAllDeclaration): ParseResult<UAST.Instruction> {
        // const importVal = createTmpVariableDeclaration(UAST.importExpression(visit(node.source) as UAST.Literal));
        // const tmpVar = createTmpVariableDeclaration(null, false, node);
        // const tmpVarId = tmpVar.id;
        // return UAST.rangeStatement(null, tmpVar, importVal, UAST.exportStatement(tmpVarId, tmpVarId));
        return UAST.spreadElement(UAST.importExpression(visit(node.source, opts) as UAST.Literal));
    },
    Decorator(node: AST.Decorator): ParseResult<UAST.Expression> {
        return visit(node.expression, opts) as Expression;
    },

    /** typescript node processing **/
    TSAsExpression(node: AST.TSAsExpression): ParseResult<UAST.Expression> {
        return visit(node.expression, opts) as Expression;
    },

    TSNonNullExpression(node: AST.TSNonNullExpression): ParseResult<UAST.Expression> {
        return visit(node.expression, opts) as Expression;
    },
    TSTypeAssertion(node: AST.TSTypeAssertion): ParseResult<UAST.Expression> {
        return visit(node.expression, opts) as Expression;
    },
    TSEnumDeclaration(node: AST.TSEnumDeclaration): ParseResult<UAST.Instruction> {
        const objectProperties: UAST.ObjectProperty[] = [];
        let lastValue: Expression = UAST.literal(0, 'number');
        for (const prop of node.members) {
            const op = visit(prop, opts) as UAST.ObjectProperty;
            if (!op.value) {
                op.value = UAST.binaryExpression('+', lastValue, UAST.literal(1, 'number'));
                lastValue = op.value;
            }
            objectProperties.push(op);
        }
        return UAST.objectExpression(objectProperties, visit(node.id, opts) as UAST.Identifier)
    },
    TSEnumMember(node: AST.TSEnumMember): ParseResult<UAST.ObjectProperty> {
        return UAST.objectProperty(visit(node.id, opts) as UAST.Identifier, visit(node.initializer, opts) as UAST.Expression);
    },
    // FIXME: 接口内部属性visitor待增加
    TSInterfaceDeclaration(node: AST.TSInterfaceDeclaration): ParseResult<UAST.ClassDefinition> {
        return UAST.classDefinition(visit(node.id, opts) as UAST.Identifier, [], []);
    },
    TSTypeAliasDeclaration(node: AST.TSTypeAliasDeclaration): ParseResult<UAST.Noop> {
        return UAST.noop();
    },
    TSImportEqualsDeclaration(node: AST.TSImportEqualsDeclaration): ParseResult<UAST.VariableDeclaration> {
        const importExpression = UAST.importExpression(visit(node.moduleReference, opts) as UAST.Literal);
        const id = visit(node.id, opts) as UAST.Identifier;
        return UAST.variableDeclaration(id, importExpression, false, UAST.dynamicType());
    },
    TSExternalModuleReference(node: AST.TSExternalModuleReference): ParseResult<UAST.Literal> {
        return visit(node.expression, opts) as UAST.Literal;
    },
    TSModuleDeclaration(node: AST.TSModuleDeclaration): ParseResult<UAST.Instruction> {
        return UAST.noop();
    },
    TSParameterProperty(node: AST.TSParameterProperty): ParseResult<UAST.Node> {
        return visit(node.parameter, opts);
    },
    TSDeclareMethod(node: AST.TSDeclareMethod): ParseResult<UAST.Node> {
        return UAST.noop();
    },

    TSInstantiationExpression(node: AST.TSInstantiationExpression): ParseResult<UAST.Expression> {
        return visit(node.expression, opts) as Expression;
    },
    TSDeclareFunction(node: AST.TSDeclareFunction): ParseResult<UAST.Expression> {
        return UAST.noop();
    },

    //TSX
    JSXElement(node: AST.JSXElement): ParseResult<UAST.Expression> {
        return UAST.noop();
    }
});

function _visitObjectPattern(node: AST.ObjectPattern, initExpr: UAST.Expression, opts): ParseResult<UAST.Sequence> {
    const sequence = UAST.sequence([]);
    const exprList = sequence.expressions;

    const consumedKey: UAST.Identifier[] = [];
    node.properties.forEach((objProperty) => {
        //processObjectProperty
        if (!AST.isRestElement(objProperty)) {
            const { key, value } = objProperty;
            const memberAccess = UAST.memberAccess(initExpr, visit(key, opts) as UAST.Identifier);
            consumedKey.push(visit(key, opts) as UAST.Identifier);
            if (AST.isIdentifier(value)) {
                const varDecl = UAST.variableDeclaration(visit(value, opts) as UAST.Identifier, memberAccess, false, UAST.dynamicType());
                exprList.push(varDecl);
            } else if (AST.isPatternLike(value)) { // process pattern like
                exprList.push(..._visitPatternLike(value, memberAccess, opts).expressions)
            } else {
                throw new Error(`unexpected type ${value.type}`);
            }
        } else { // rest element
            const varDecl = UAST.variableDeclaration(visit(objProperty.argument, opts) as UAST.Identifier, initExpr, true, UAST.dynamicType());
            const varId = varDecl.id;
            exprList.push(varDecl);
            consumedKey.forEach((k) => {
                const ma = UAST.memberAccess(varId, k);
                const deleteExpression: UAST.UnaryExpression = UAST.unaryExpression('delete', ma, true);
                exprList.push(deleteExpression);
            })
            const assignmentExpression = UAST.assignmentExpression(visit(objProperty.argument, opts) as Identifier, varId, '=');
            exprList.push(assignmentExpression);
        }
    });
    return sequence;
}

// const [a,b,c] = [a1, b1, c1];
// transformed to:
// const {1:a, 2:b, 3:c} = [a1, b1, c1];
function _visitArrayPattern(node: AST.ArrayPattern, initExpr: UAST.Expression, opts): ParseResult<UAST.Sequence> {
    const exprList = [];
    const consumed = [];
    for (let i = 0; i < node.elements.length; i++) {
        const ele = node.elements[i];
        if (ele) {
            if (AST.isRestElement(ele)) {
                const varDecl = createTmpVariableDeclaration(initExpr, true);
                exprList.push(varDecl);
                const varId = varDecl.id;
                for (const c of consumed) {
                    const ma = UAST.memberAccess(varId, c);
                    const deleteExpression: UAST.UnaryExpression = UAST.unaryExpression('delete', ma, true);
                    exprList.push(deleteExpression);
                }
                const assignmentExpression = UAST.assignmentExpression(visit(ele.argument, opts) as Identifier, varId, '=');
                exprList.push(assignmentExpression);
            } else {
                const memberAccess = UAST.memberAccess(initExpr, UAST.identifier(String(i)));
                const seq = _visitPatternLike(ele as AST.PatternLike, memberAccess, opts);
                exprList.push(seq);
                consumed.push(UAST.identifier(String(i)));
            }
        }
    }
    return _flatSequence(exprList);
}

function _visitAssignmentPattern(node: AST.AssignmentPattern, initExpr: UAST.Expression, opts): ParseResult<UAST.Sequence> {
    const condExpr = UAST.conditionalExpression(initExpr, initExpr, visit(node.right, opts) as UAST.Expression);
    return _visitPatternLike(node.left as AST.PatternLike, condExpr, opts);
}

function _visitPatternLike(node: AST.PatternLike, initExpr: UAST.Expression, opts): ParseResult<UAST.Sequence> {
    if (AST.isIdentifier(node)) {
        return UAST.sequence([UAST.variableDeclaration(visit(node, opts) as UAST.Identifier, initExpr, false, UAST.dynamicType())]);
    }

    if (AST.isObjectPattern(node)) {
        return _visitObjectPattern(node, initExpr, opts);
    }

    if (AST.isArrayPattern(node)) {
        return _visitArrayPattern(node, initExpr, opts);
    }

    if (AST.isAssignmentPattern(node)) {
        return _visitAssignmentPattern(node, initExpr, opts);
    }

    if (AST.isMemberExpression(node)) {
        return UAST.sequence([UAST.assignmentExpression(visit(node, opts) as UAST.MemberAccess, initExpr, '=')]);
    }

    if (AST.isRestElement(node)) {
        return UAST.sequence([UAST.assignmentExpression(visit(node.argument, opts) as UAST.Identifier, initExpr, '=')]);
    }
}

function _visitFunctionLike(node: AST.Function, opts): ParseResult<UAST.FunctionDefinition> {
    const attachBodyList = [];
    // @ts-ignore
    const id = visit(node.key || node.id) as Identifier | null;
    // for ArrowFunctionExpression
    let body = AST.isExpression(node.body) ? UAST.scopedStatement([UAST.returnStatement(visit(node.body, opts) as Expression)]) :
        visit(node.body, opts) as UAST.ScopedStatement;

    const params = node.params.map((param) => {
        if (AST.isTSParameterProperty(param)) {
            param = param.parameter;
        }
        if (AST.isObjectPattern(param) || AST.isArrayPattern(param) || AST.isAssignmentPattern(param) || AST.isRestElement(param)) {
            const varDecl = createTmpVariableDeclaration();

            if (AST.isRestElement(param)) {
                varDecl._meta.isRestElement = true;
            }
            attachBodyList.push(..._visitPatternLike(param, varDecl.id, opts).expressions);
            varDecl.loc = param.loc;
            return varDecl;
        }

        // type of param is Identifier
        const id = visit(param, opts) as UAST.Identifier;
        const decl = UAST.variableDeclaration(id, null, false, UAST.dynamicType());
        decl.loc = id.loc;
        return decl;
    })
    attachBodyList.push(body);
    if (attachBodyList.length > 0) {
        body = UAST.scopedStatement([...attachBodyList]);
    }
    const res = UAST.functionDefinition(id, params, UAST.dynamicType(), body, []);
    return res;
}

function _visitRangeStatement(node: AST.ForInStatement | AST.ForOfStatement, opts): ParseResult<UAST.RangeStatement> {
    const right = visit(node.right, opts) as Expression;
    //TODO this should be a iterator
    const keyOrValue = createTmpVariableDeclaration(right);
    keyOrValue.loc = node.left.loc;
    let body: UAST.Statement = visit(node.body, opts) as UAST.Statement;
    if (AST.isVariableDeclaration(node.left)) {
        // 有且仅能有一个decl
        const seq = _visitPatternLike(node.left.declarations[0].id as AST.PatternLike, keyOrValue.id, opts);
        const seqExpressions = [seq, body];
        body = UAST.scopedStatement(seqExpressions);
    } else if (AST.isObjectPattern(node.left) || AST.isArrayPattern(node.left) || AST.isAssignmentPattern(node.left)) {
        const seq = _visitPatternLike(node.left, keyOrValue.id, opts);
        const seqExpressions = [seq, body];
        body = UAST.scopedStatement(seqExpressions);
    } else {
        const expr = UAST.sequence([UAST.assignmentExpression(visit(node.left, opts) as UAST.LVal, keyOrValue.id, '=')]);
        const seqExpressions = [expr, body];
        body = UAST.scopedStatement(seqExpressions);
    }
    if (AST.isForInStatement(node)) {
        return UAST.rangeStatement(keyOrValue as Expression, null, right, body as Statement);
    } else {
        return UAST.rangeStatement(null, keyOrValue as Expression, right, body as Statement);
    }
}

//扁平化优化, 减少sequence层次
function _flatSequence(node: UAST.Expression | UAST.Statement | Array<UAST.Expression | UAST.Statement>): UAST.Sequence {
    const sequenceArray: Array<UAST.Instruction> = [];
    const res = UAST.sequence(sequenceArray);
    if (Array.isArray(node)) {
        for (const n of node) {
            const subSequence = _flatSequence(n);
            sequenceArray.push(...subSequence.expressions);
        }
        return res;
    } else if (UAST.isSequence(node)) {
        return node;
    } else {
        sequenceArray.push(node);
        return res;
    }
}

export function createTmpIdentifier(locNode?): Identifier {
    if (!getUid) {
        getUid = (() => {
            let id = 0;
            return () => id++;
        })();
    }
    const id = UAST.identifier(`__tmp${getUid()}__`);
    return id;
}

export function createTmpVariableDeclaration(init?: Expression, cloned = false, locNode?): UAST.VariableDeclaration {
    locNode = locNode ? locNode : init;
    return UAST.variableDeclaration(createTmpIdentifier(locNode), init, cloned, UAST.dynamicType());
}

export function appendLocMeta(dest: UAST.Node, src: AST.Node | UAST.Node | AST.Node[] | UAST.Node[]): UAST.Node {
    if (Array.isArray(src)) {
        if (src.length > 0) {
            dest.loc = src[0].loc;
            dest.loc.start = src[0].loc.start;
            dest.loc.end = src[src.length - 1].loc.end;
            if ('sourcefile' in src[0].loc) {
                dest.loc.sourcefile = src[0].loc.sourcefile;
            } else if ('filename' in src[0].loc) {
                dest.loc.sourcefile = src[0].loc.filename;
            }
        }
    } else {
        // @ts-ignore
        dest.loc = src.loc;
    }
    dest._meta.loc = dest.loc;
    return dest;
}

// export interface ParseError {
//     code: string;
//     reasonCode: string;
// }

// export type ParseResult<Result> = Result & {
//     errors?: ParseError[];
// };
type PatternResult = {
    decl: UAST.VariableDeclaration
    sequence: UAST.Sequence
}

export type ParseResult<Result> = Result

type ASTNodeOrNull = AST.Node | null | undefined

// append loc to node recursively
function appendLocRec(node, parent_node?, sourcefile?): UAST.SourceLocation | null {
    function mergeLocs(locs: UAST.SourceLocation[] | null): UAST.SourceLocation | null {
        if (!locs) return null;
        let minLine = Number.MAX_SAFE_INTEGER, minColumn = Number.MAX_SAFE_INTEGER, maxLine = 0, maxColumn = 0;
        locs.forEach(loc => {
            if (!loc) return;
            minLine = Math.min(minLine, loc.start.line);
            minColumn = Math.min(minColumn, loc.start.column);
            maxLine = Math.max(maxLine, loc.end.line);
            maxColumn = Math.max(maxColumn, loc.end.column);
        });
        return {
            start: { line: minLine, column: minColumn },
            end: { line: maxLine, column: maxColumn },
            sourcefile: sourcefile
        }
    }

    if (!node) return null;
    if (Array.isArray(node)) {
        const locs = node.map(v => {
            return appendLocRec(v, parent_node, sourcefile);
        });
        return mergeLocs(locs);
    }

    if (!node.type)
        return null;

    const locs = [];
    for (const prop in node) {
        if (['type', 'loc', '_meta', 'varType', 'operator'].indexOf(prop) !== -1) {
            continue;
        }
        const loc = appendLocRec(node[prop], node.loc ? node : parent_node, sourcefile);
        if (loc) {
            locs.push(loc);
        }
    }
    if (!node.loc) {
        if (parent_node?.loc) {
            node.loc = parent_node.loc;
            if (!node.loc.sourcefile) {
                node.loc.sourcefile = sourcefile;
            }
        } else {
            node.loc = mergeLocs(locs);
        }
    }
    return node.loc;
}

// function visit(ast: AST.Node & AST.Node[] | {type?:any} = {}): ParseResult<UAST.ASTNode | UAST.ASTNode[] > {
function visit(orig: ASTNodeOrNull, opts): ParseResult<UAST.Node> {
    if (!orig) {
        // @ts-ignore
        return null;
    }

    // @ts-ignore
    const mVisitor = visitor(opts);

    if (typeof mVisitor[orig.type] !== 'function') {
        console.warn(`There is no visitor function associated with '${orig.type}'`)
        const noop = UAST.noop();
        appendLocRec(noop, orig, opts?.sourcefile);
        noop._meta.origin = orig;  // 如果没有找到对应节点的visitor， 将原始ast节点记录到meta.origin中
        return noop;
    }

    // @ts-ignore
    const node: UAST.Node = mVisitor[orig.type](orig);
    appendLocRec(node, orig, opts?.sourcefile);
    if (UAST.isNode(node)) {
        if (node.loc) {
            // @ts-ignore
            delete node.loc.start.index;
            // @ts-ignore
            delete node.loc.end.index;
            Object.keys(node.loc).forEach(key => {
                if (!['start', 'end', 'sourcefile'].includes(key)) {
                    // @ts-ignore
                    delete node.loc[key];
                }
            })
        }
        const metaProperties = ['start', 'end', 'range', 'leadingComments', 'trailingComments', 'innerComments', 'directives', 'interpreter'];
        if (UAST.isNoop(node)) {
            node._meta.origin = orig;
        }
        for (const prop of metaProperties) {
            if (orig && orig[prop]) {
                node._meta._extra = node._meta._extra || {};
                const extra = node._meta._extra;
                extra[prop] = orig[prop];
            }
        }
    }

    // process decorators
    if ("decorators" in orig) {
        const decorators: Expression[] = [];
        orig.decorators.forEach(decorator => {
            decorators.push(visit(decorator, opts) as Expression);
        });
        node._meta.decorators = decorators;
    }

    return node;
}

function fix_column(node: any) {
    if (!node) return;
    if (Array.isArray(node)) {
        node.forEach(function (n) {
            fix_column(n);
        })
    }
    if (!node.loc) return;

    //uast统一 column从1开始，babel从0开始，因此整体+1
    if (node.loc.start?.column >= 0 && node.loc.start.hasFixColumn === undefined) {
        node.loc.start.column = node.loc.start.column + 1
        node.loc.start.hasFixColumn = true
    }
    if (node.loc.end?.column >= 0 && node.loc.end.hasFixColumn === undefined) {
        node.loc.end.column = node.loc.end.column + 1
        node.loc.end.hasFixColumn = true
    }
    Object.keys(node).forEach(key => {
        fix_column(node[key]);
    })
}

function sanitize(node: any) {
    if (!node) return;

    if (Array.isArray(node)) {
        node.forEach(function (n) {
            sanitize(n);
        })
    }

    if (!node.type) return;


    // clean up loc
    if (node.loc) {
        // @ts-ignore
        delete node.loc.start.index;
        delete node.loc.end.index;
        delete node.loc.start.hasFixColumn;
        delete node.loc.end.hasFixColumn;
        Object.keys(node.loc).forEach(key => {
            if (!['start', 'end', 'sourcefile'].includes(key)) {
                // @ts-ignore
                delete node.loc[key];
            }
        })
    }

    Object.keys(node).forEach(key => {
        sanitize(node[key]);
    })
}

let getUid: () => number;

export function parse(content: string, opts?: Record<string, any>): ParseResult<UAST.Node> {
    //init engine state
    getUid = (() => {
        let id = 0;
        return () => id++;
    })();
    let ast: AST.File;
    try {
        ast = tryBabelCore(content, opts);
    } catch (e) {
        ast = tryBabelParse(content, opts);
    }
    const node = visit(ast, opts);
    fix_column(node);
    sanitize(node);
    return node;
}


function tryBabelParse(content, opts?): AST.File {
    return babelParser.parse(content, {
        sourceFilename: opts?.sourcefile,
        sourceType: 'module',
        allowImportExportEverywhere: true,
        allowAwaitOutsideFunction: true,
        allowReturnOutsideFunction: true,
        allowSuperOutsideMethod: true,
        allowUndeclaredExports: true,
        attachComment: true,
        errorRecovery: true,
        createParenthesizedExpressions: false,
        plugins: [
            "asyncDoExpressions"
            , "asyncGenerators"
            , "bigInt"
            , "classPrivateMethods"
            , "classPrivateProperties"
            , "classProperties"
            , "classStaticBlock" // Enabled by default
            , "decimal"
            , "decorators"
            , ["decorators", { decoratorsBeforeExport: true }]
            , "decoratorAutoAccessors"
            , "destructuringPrivate"
            , "doExpressions"
            , "dynamicImport"
            , "exportDefaultFrom"
            , "exportNamespaceFrom" // deprecated
            // , "decorators-legacy"
            // , "flow"
            // , "estree"
            , "flowComments"
            , "functionBind"
            , "functionSent"
            , "importMeta"
            , "jsx"
            , "logicalAssignment"
            , "importAssertions"
            , "moduleBlocks"
            , "moduleStringNames"
            , "nullishCoalescingOperator"
            , "numericSeparator"
            , "objectRestSpread"
            , "optionalCatchBinding"
            , "optionalChaining"
            , "partialApplication"
            // , "pipelineOperator"
            // , ["pipelineOperator", { proposal: "minimal" }]
            , "placeholders"
            , "privateIn" // Enabled by default
            , "recordAndTuple"
            , "regexpUnicodeSets"
            , "throwExpressions"
            , "topLevelAwait"
            , "typescript"
            , ["typescript", { dts: true }]
            // , "v8intrinsic"
        ],
    });
}

function tryBabelCore(content, opts?): AST.File {
    return babelCore.parse(content, {
        filename: opts?.sourcefile,
        sourceType: 'module',
        plugins: [
            "@babel/plugin-proposal-optional-chaining",
            "@babel/plugin-syntax-json-strings",
            "@babel/plugin-syntax-export-default-from",
            "@babel/plugin-syntax-jsx",
            "@babel/plugin-transform-react-jsx",
            ["@babel/plugin-proposal-decorators", {
                decoratorsBeforeExport: true,
                legacy: false
            }],
        ],
        parserOpts: {
            errorRecovery: true,
        },
        presets: [
            ["@babel/preset-typescript", {
                allExtensions: true,
                // isTSX:false,
            }],
            "@babel/preset-react"
        ],
    })
}
