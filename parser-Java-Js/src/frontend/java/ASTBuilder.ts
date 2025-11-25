import { ParserRuleContext, Token } from 'antlr4ts'
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor'
import { ParseOptions } from './types'
import { ParseTree } from 'antlr4ts/tree/ParseTree'
import { TerminalNode } from 'antlr4ts/tree/TerminalNode'
import * as JP from './antlr/JavaParser'

import { JavaVisitor } from './antlr/JavaVisitor'
import * as UAST from '@ant-yasa/uast-spec';
import { version, Expression, Identifier, Statement, SourceLocation, Instruction } from '@ant-yasa/uast-spec';
import { ErrorNode } from 'antlr4ts/tree/ErrorNode'
import { ParExpressionContext } from "./antlr/JavaParser";
import * as _ from 'lodash';
import { createTmpVariableDeclaration } from "../javascript/parser";

const { literal: literalBuild, identifier: identifierBuild } = UAST;


abstract class ParseTreeVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    public sourcefile: string

    protected constructor(public options: ParseOptions, sourcefile: string) {
        super();
        this.sourcefile = sourcefile;
    }

    public visit(tree: ParseTree): Result {
        if (!tree) return null;
        const node = super.visit(tree);
        if (!Array.isArray(node)) {
            // @ts-ignore
            node.loc = {
                // @ts-ignore
                start: { line: tree._start.line, column: tree._start._charPositionInLine + 1 },
                // @ts-ignore
                end: { line: tree._stop?.line, column: tree._stop?._charPositionInLine + 1 },
                sourcefile: this.sourcefile
            };
            this.adJustNodeLoc(node)
        }
        return node;
    }

    private adJustNodeLoc(node: UAST.Node) {
        switch (node.type) {
            case 'VariableDeclaration':
                if (node?.loc?.end?.column && node?.id?.name && !node.init) {
                    node.loc.end.column = node.loc.end.column + node.id.name.length - 1
                }
                break
            default:
                break
        }
    }
}

export class ASTBuilder
    extends ParseTreeVisitor<UAST.Node | UAST.Node[]>
    implements JavaVisitor<UAST.Node | UAST.Node[]> {
    public result: UAST.CompileUnit | null = null
    private typesState: UAST.Type[] = []
    private qualifiedNamespaceState: string[] = [];

    constructor(public options: ParseOptions, sourcefile: string) {
        super(options, sourcefile);
    }

    defaultResult(): UAST.Node {
        // throw new Error('Unknown node')
        return UAST.noop();
    }

    aggregateResult() {
        return UAST.noop();
    }

    //compilationUnit
    //     : packageDeclaration? importDeclaration* typeDeclaration*
    //     | moduleDeclaration EOF
    public visitCompilationUnit(ctx: JP.CompilationUnitContext): UAST.CompileUnit {
        const children = (ctx.children ?? []).filter(
            (x) => !(x instanceof ErrorNode) && !(x instanceof TerminalNode)
        )

        const body = children.map((child) => this.visit(child)) as UAST.Instruction[];
        const node: UAST.CompileUnit = UAST.compileUnit(body, 'java', '17', this.sourcefile, version);
        // visit package decl
        const packageDeclarationContext = (ctx.children ?? []).find(x => x instanceof JP.PackageDeclarationContext) as JP.PackageDeclarationContext | null;
        if (packageDeclarationContext) {
            const qualifiedName = packageDeclarationContext.qualifiedName();
            node._meta.qualifiedName = toText(qualifiedName);
            this.qualifiedNamespaceState.push(node._meta.qualifiedName as string);
        } else {
            this.qualifiedNamespaceState.push('');
        }
        this.result = node;
        this.completeLocInfo(node);
        return node;
    }


    // packageDeclaration
    //     : annotation* PACKAGE qualifiedName ';'
    // ;
    public visitPackageDeclaration(ctx: JP.PackageDeclarationContext): UAST.PackageDeclaration {
        const qualifiedName = ctx.qualifiedName();
        const identifiers = ctx.qualifiedName().identifier();
        let node;
        if (identifiers.length > 1) {
            let memberAccess = UAST.memberAccess(UAST.identifier(toText(identifiers[identifiers.length - 2])), UAST.identifier(toText(identifiers[identifiers.length - 1])), false);
            for (let i = identifiers.length - 3; i >= 0; i--) {
                const obj = UAST.identifier(toText(identifiers[i]));
                memberAccess = UAST.memberAccess(obj, memberAccess);
            }
            node = UAST.packageDeclaration(memberAccess);
        } else {
            node = UAST.packageDeclaration(UAST.identifier(toText(qualifiedName)));
        }

        return node;
    }


    // modifier
    //     : classOrInterfaceModifier
    //     | NATIVE
    //     | SYNCHRONIZED
    //     | TRANSIENT
    //     | VOLATILE
    // ;
    public visitModifier(ctx: JP.ModifierContext): UAST.Node {
        return UAST.noop();
    }

    // classOrInterfaceModifier
    //     : annotation
    //     | PUBLIC
    //     | PROTECTED
    //     | PRIVATE
    //     | STATIC
    //     | ABSTRACT
    //     | FINAL    // FINAL for class only -- does not apply to interfaces
    //     | STRICTFP
    //     | SEALED // Java17
    //     | NON_SEALED // Java17
    // ;
    public visitClassOrInterfaceModifier(ctx: JP.ClassOrInterfaceModifierContext): UAST.Node {
        return UAST.noop();
    }

    // variableModifier java7
    //     : FINAL
    //     | annotation
    //     ;
    //unused variableModifier
    public visitVariableModifier(ctx: JP.VariableModifierContext): UAST.Node {
        return UAST.noop();
    }

    //typeParameters java7
    //     : '<' typeParameter (',' typeParameter)* '>'
    //     ;
    //unused typeParameters
    public visitTypeParameters(ctx: JP.TypeParametersContext): UAST.Node {
        return UAST.noop();
    }

    // typeParameter java7
    //     : annotation* identifier (EXTENDS annotation* typeBound)?
    //     ;
    //unused typeParameter
    public visitTypeParameter(ctx: JP.TypeParameterContext): UAST.Node {
        return UAST.noop();
    }

    // typeBound java7
    //     : typeType ('&' typeType)*
    //     ;
    //unused typeBound
    public visitTypeBound(ctx: JP.TypeBoundContext): UAST.Node {
        return UAST.noop();
    }

    //importDeclaration
    //     : IMPORT STATIC? qualifiedName ('.' '*')? ';'
    //     | ';'
    // TODO static import
    public visitImportDeclaration(ctx: JP.ImportDeclarationContext): UAST.Instruction {
        if (!ctx.IMPORT()) {
            return UAST.noop();
        }
        const qualifiedName = toText(ctx.qualifiedName());
        const qualifiedNameList = qualifiedName.split('.');
        const tailName = qualifiedNameList.pop();
        if (ctx.MUL()) {
            // for import all case
            // TODO avoid import sub package
            const importExpr = UAST.importExpression(literalBuild(qualifiedName, 'string'));
            return UAST.spreadElement(importExpr);
        } else {
            // single import case
            const classNameId = identifierBuild(tailName);
            const qualifiedClassNameId = identifierBuild(qualifiedName);
            const importExpr = UAST.importExpression(literalBuild(qualifiedName, 'string'), null, null);
            return UAST.variableDeclaration(classNameId, importExpr, false, UAST.scopedType(qualifiedClassNameId, null))
        }
    }

    //typeDeclaration
    //     : classOrInterfaceModifier*
    //       (classDeclaration | enumDeclaration | interfaceDeclaration | annotationTypeDeclaration | recordDeclaration)
    //     | ';'
    public visitTypeDeclaration(ctx: JP.TypeDeclarationContext): UAST.Instruction {
        const children = ctx.children;
        const typeDecl = children.pop();

        if (typeDecl instanceof TerminalNode) {
            return UAST.noop();
        }

        const classDefinition = this.visit(typeDecl) as UAST.ClassDefinition;
        ctx.classOrInterfaceModifier().forEach(m => {
            const annotationCtx = m.annotation();
            if (annotationCtx) {
                const meta = classDefinition._meta;
                meta.annotations = meta.annotations || [];
                const annotations: UAST.Instruction[] = meta.annotations as UAST.Instruction[];
                annotations.push(this.visit(annotationCtx) as UAST.Instruction);
            } else {
                const meta = classDefinition._meta;
                meta.modifiers = meta.modifiers ?? [];
                const modifiers = meta.modifiers as string[];
                const modifierName = toText(m);
                meta['is' + getUpperCase(modifierName)] = true;
                modifiers.push(modifierName);
            }
        });
        const isPublic = children.find(child => toText(child) === 'public');
        if (isPublic) {
            return UAST.exportStatement(classDefinition, classDefinition.id);
        } else {
            return classDefinition;
        }
    }

    //classDeclaration
    //     : CLASS identifier typeParameters?
    //       (EXTENDS typeType)?
    //       (IMPLEMENTS typeList)?
    //       (PERMITS typeList)? // Java17
    //       classBody
    public visitClassDeclaration(ctx: JP.ClassDeclarationContext): UAST.ClassDefinition {
        const idCtx = ctx.identifier();
        this.qualifiedNamespaceState.push(toText(idCtx));
        const body = this.visit(ctx.classBody()) as UAST.Instruction[];
        let supers = [];
        if (ctx.EXTENDS()) {
            const typeTypeCtx = ctx.typeType();
            const type = this.visit(typeTypeCtx) as UAST.Type;
            supers.push(typeToIdentifier(type));
        }
        if (ctx.IMPLEMENTS()) {
            const typeListCtx = ctx.typeList();
            const s = this.visit(typeListCtx[0]) as UAST.Instruction[];
            supers = supers.concat(...s);
        }

        const node = UAST.classDefinition(this.visit(ctx.identifier()) as UAST.Identifier, body, supers);
        this.qualifiedNamespaceState.pop();
        return node;
    }

    //classBody
    //     : '{' classBodyDeclaration* '}'
    public visitClassBody(ctx: JP.ClassBodyContext): UAST.Instruction[] {
        const body: UAST.Instruction[] = [];
        ctx.classBodyDeclaration().forEach(node => {
            const decls = this.visit(node) as UAST.Instruction | UAST.Instruction[];
            if (Array.isArray(decls)) {
                body.push(...decls);
            } else {
                body.push(decls);
            }
        });
        return body;
    }

    //classBodyDeclaration
    //     : ';'
    //     | STATIC? block
    //     | modifier* memberDeclaration
    public visitClassBodyDeclaration(ctx: JP.ClassBodyDeclarationContext): UAST.Instruction | UAST.Instruction[] {
        const md = ctx.memberDeclaration();
        if (md) {
            const res = this.visit(md) as UAST.Instruction | UAST.Instruction[];
            const modifiersCtx = ctx.modifier();
            if (Array.isArray(modifiersCtx)) {
                modifiersCtx.forEach(modifier => {
                    const modifierText = toText(modifier);
                    if (Array.isArray(res)) {
                        res.forEach(r => {
                            r._meta.modifiers = r._meta.modifiers ?? [];
                            (r._meta.modifiers as string[]).push(modifierText);
                            r._meta['is' + getUpperCase(modifierText)] = true;
                        })
                    } else {
                        const meta = res._meta;
                        meta.modifiers = meta.modifiers || [];
                        (meta.modifiers as string[]).push(modifierText);
                        res._meta['is' + getUpperCase(modifierText)] = true;
                    }
                });
            }
            return res;
        }
        const block = ctx.block();
        if (block) {
            return this.visit(block) as UAST.Instruction | UAST.Instruction[];
        }
        return UAST.noop();
    }

    //memberDeclaration
    public visitMemberDeclaration(ctx: JP.MemberDeclarationContext): UAST.Instruction | UAST.Instruction[] {
        const childCtx = ctx.children[0];
        return this.visit(childCtx) as UAST.Instruction | UAST.Instruction[];
    }

    //fieldDeclaration
    //     : typeType variableDeclarators ';'
    public visitFieldDeclaration(ctx: JP.FieldDeclarationContext): UAST.Instruction | UAST.Instruction[] {
        this.typesState.push(this.visit(ctx.typeType()) as UAST.Type);
        const decls = this.visit(ctx.variableDeclarators());
        this.typesState.pop();
        return decls as UAST.Instruction | UAST.Instruction[];
    }

    //constructorDeclaration
    //     : identifier formalParameters (THROWS qualifiedNameList)? constructorBody=block
    public visitConstructorDeclaration(ctx: JP.ConstructorDeclarationContext): UAST.FunctionDefinition {
        const params = this.visit(ctx.formalParameters()) as UAST.VariableDeclaration[];
        const qualifiedName = this.qualifiedNamespaceState.join('.');
        const returnType = UAST.scopedType(UAST.identifier(qualifiedName), null);
        const body = this.visit(ctx.block()) as UAST.Instruction;
        const res = UAST.functionDefinition(UAST.identifier('_CTOR_'), params, returnType, body, []);
        res._meta.isConstructor = true;
        return res;
    }

    // compactConstructorDeclaration
    //     : modifier* identifier constructorBody=block
    //     ;
    public visitCompactConstructorDeclaration(ctx: JP.CompactConstructorDeclarationContext): UAST.Node {
        return UAST.noop();
    }


    // methodDeclaration
    //     : typeTypeOrVoid identifier formalParameters ('[' ']')*
    //       (THROWS qualifiedNameList)?
    //       methodBody
    public visitMethodDeclaration(ctx: JP.MethodDeclarationContext): UAST.FunctionDefinition {
        const typeOrVoidCtx = ctx.typeTypeOrVoid();
        const typeCtx = typeOrVoidCtx.typeType();
        let type;
        if (typeCtx) {
            type = this.visit(typeCtx) as UAST.Type;
        } else {
            type = UAST.primitiveType(UAST.identifier('void'));
        }
        const id = this.visit(ctx.identifier()) as UAST.Identifier;
        const params = this.visit(ctx.formalParameters()) as UAST.VariableDeclaration[]
        const blockCtx = ctx.methodBody().block();
        let body;
        const modifiers = [];
        if (blockCtx) {
            body = this.visit(blockCtx) as UAST.Instruction;
        } else {
            body = UAST.noop();
            modifiers.push('abstract');
        }
        return UAST.functionDefinition(id, params, type, body, modifiers);
    }

    // methodBody
    //     : block
    //     | ';'
    //     ;
    public visitMethodBody(ctx: JP.MethodBodyContext): UAST.Node {
        return UAST.noop();
    }


    // interfaceDeclaration
    //    : INTERFACE identifier typeParameters? (EXTENDS typeList)? (PERMITS typeList)? interfaceBody
    public visitInterfaceDeclaration(ctx: JP.InterfaceDeclarationContext): UAST.ClassDefinition {
        const id = this.visit(ctx.identifier()) as UAST.Identifier;
        let supers = [];
        if (ctx.EXTENDS()) {
            const typeListCtx = ctx.typeList()[0];
            supers = this.visit(typeListCtx) as UAST.Identifier[];
        }

        const body = this.visitInterfaceBody(ctx.interfaceBody());
        const scope = UAST.scopedStatement(body);

        return UAST.classDefinition(id, [scope], supers);
    }

    // interfaceBody
    //     : '{' interfaceBodyDeclaration* '}'
    //     ;
    public visitInterfaceBody(ctx: JP.InterfaceBodyContext): UAST.Instruction[] {
        return ctx.interfaceBodyDeclaration().flatMap(d => {
            const result = this.visit(d.interfaceMemberDeclaration());
            if (result === null){
                return [];
            }
            return Array.isArray(result) ? result : [result];
        }) as UAST.Instruction[];
    }


    // interfaceBodyDeclaration
    //     : modifier* interfaceMemberDeclaration
    //     | ';'
    //     ;
    public visitInterfaceBodyDeclaration(ctx: JP.InterfaceBodyDeclarationContext): UAST.Node {
        return UAST.noop();
    }


    // genericMethodDeclaration
    public visitGenericMethodDeclaration(ctx: JP.GenericMethodDeclarationContext): UAST.Instruction {
        return this.visit(ctx.methodDeclaration()) as UAST.Instruction;
    }

    // genericConstructorDeclaration
    public visitGenericConstructorDeclaration(ctx: JP.GenericConstructorDeclarationContext): UAST.Instruction {
        return this.visit(ctx.constructorDeclaration()) as UAST.Instruction;
    }

    // recordDeclaration //Java17
    //   : RECORD identifier typeParameters? recordHeader
    //       (IMPLEMENTS typeList)?
    //       recordBody
    public visitRecordDeclaration(ctx: JP.RecordDeclarationContext): UAST.Instruction {
        const id = this.visit(ctx.identifier()) as UAST.Identifier;
        const supers = this.safeVisit(ctx.typeList()) || [];
        const body = this.visit(ctx.recordBody()) as UAST.Instruction[];
        const defaultBody = this.visitRecordHeader(ctx.recordHeader());
        body.push(...defaultBody);
        return UAST.classDefinition(id, body, supers);
    }

    //recordHeader
    //     : '(' recordComponentList? ')'
    // recordComponentList
    //     : recordComponent (',' recordComponent)*
    // recordComponent
    //     : typeType identifier
    public visitRecordHeader(ctx: JP.RecordHeaderContext): UAST.Instruction[] {
        const params = [];
        const body: UAST.Instruction[] = ctx.recordComponentList()?.recordComponent().map(c => {
            const type = this.visit(c.typeType()) as UAST.Type;
            const id = this.visit(c.identifier()) as UAST.Identifier;
            params.push(UAST.variableDeclaration(id, null, false, type));
            const lhs = UAST.memberAccess(UAST.thisExpression(), id);
            return UAST.assignmentExpression(lhs, id, '=');
        }) || [];
        const fdef = UAST.functionDefinition(UAST.identifier('__CTOR__'), params, UAST.primitiveType(UAST.identifier('void')), UAST.scopedStatement(body), []);
        fdef._meta.isConstructor = true;
        return [fdef];
    }

    // recordComponentList
    //     : recordComponent (',' recordComponent)*
    //     ;
    public visitRecordComponentList(ctx: JP.RecordComponentListContext): UAST.Node {
        return UAST.noop();
    }

    // recordComponent
    //     : typeType identifier
    //     ;
    public visitRecordComponent(ctx: JP.RecordComponentContext): UAST.Node {
        return UAST.noop();
    }

    //recordBody
    //     : '{' (classBodyDeclaration | compactConstructorDeclaration)*  '}'
    public visitRecordBody(ctx: JP.RecordBodyContext): UAST.Instruction[] {
        const body = [];
        ctx.classBodyDeclaration().forEach(d => {
            const subBody = this.visit(d) as UAST.Instruction | UAST.Instruction[];
            if (Array.isArray(subBody)) {
                body.push(...subBody);
            } else {
                body.push(subBody);
            }
        })
        //compactConstructorDeclaration
        //     : modifier* identifier constructorBody=block
        ctx.compactConstructorDeclaration().forEach(d => {
            //TODO
        })
        return body;
    }

    // annotationTypeDeclaration
    //   : '@' INTERFACE identifier annotationTypeBody
    public visitAnnotationTypeDeclaration(ctx: JP.AnnotationTypeDeclarationContext): UAST.Instruction {
        const id = this.visit(ctx.identifier()) as UAST.Identifier;
        let body = ctx.annotationTypeBody().annotationTypeElementDeclaration().map(d => {
            return this.visit(d) as UAST.Instruction;
        })
        body = _.flatten(body);
        return UAST.classDefinition(id, body, []);
    }

    //annotationTypeElementDeclaration
    //     : modifier* annotationTypeElementRest
    public visitAnnotationTypeElementDeclaration(ctx: JP.AnnotationTypeElementDeclarationContext): UAST.Instruction {
        return this.visit(ctx.annotationTypeElementRest()) as UAST.Instruction;
    }

    //annotationTypeElementRest
    //     : typeType annotationMethodOrConstantRest ';'
    //     | classDeclaration ';'?
    //     | interfaceDeclaration ';'?
    //     | enumDeclaration ';'?
    //     | annotationTypeDeclaration ';'?
    //     | recordDeclaration ';'? // Java17
    public visitAnnotationTypeElementRest(ctx: JP.AnnotationTypeElementRestContext): UAST.Instruction {
        const typeCtx = ctx.typeType();
        if (typeCtx) {
            const leftType = this.visit(typeCtx) as UAST.Type;
            this.typesState.push(leftType);
            //annotationMethodOrConstantRest
            //   : annotationMethodRest
            //     | annotationConstantRest
            const res = this.visit(ctx.annotationMethodOrConstantRest().children[0]) as UAST.Instruction;
            this.typesState.pop();
            return res;
        } else {
            return this.visit(ctx.children[0]) as UAST.Instruction;
        }
    }

    // annotationTypeBody
    //     : '{' (annotationTypeElementDeclaration)* '}'
    //     ;
    public visitAnnotationTypeBody(ctx: JP.AnnotationTypeBodyContext): UAST.Node {
        return UAST.noop();
    }

    // annotationMethodOrConstantRest
    //     : annotationMethodRest
    //     | annotationConstantRest
    //     ;
    public visitAnnotationMethodOrConstantRest(ctx: JP.AnnotationMethodOrConstantRestContext): UAST.Node {
        return UAST.noop();
    }


    //annotationMethodRest
    //     : identifier '(' ')' defaultValue?
    public visitAnnotationMethodRest(ctx: JP.AnnotationMethodRestContext): UAST.Instruction {
        const type = this.typesState[this.typesState.length - 1];
        return UAST.variableDeclaration(this.visit(ctx.identifier()) as UAST.Identifier, this.visit(ctx.defaultValue()?.elementValue()) as UAST.Expression, false, type);
    }

    //annotationConstantRest
    //     : variableDeclarators
    public visitAnnotationConstantRest(ctx: JP.AnnotationConstantRestContext): UAST.Instruction {
        return this.visit(ctx.variableDeclarators()) as UAST.Instruction;
    }

    // defaultValue
    //     : DEFAULT elementValue
    //     ;
    public visitDefaultValue(ctx: JP.DefaultValueContext): UAST.Node {
        return UAST.noop();
    }


    //elementValue
    //     : expression
    //     | annotation
    //     | elementValueArrayInitializer
    public visitElementValue(ctx: JP.ElementValueContext): UAST.Instruction {
        return this.visit(ctx.children[0]) as UAST.Instruction;
    }

    //annotation
    //     : ('@' qualifiedName | altAnnotationQualifiedName) ('(' ( elementValuePairs | elementValue )? ')')?
    // will convert to
    // (var annotationVarId  = new qualifiedName(),annotationVar.a = expr1,annotationVar.b = expr2, annotationVar.id)
    public visitAnnotation(ctx: JP.AnnotationContext): UAST.Instruction {
        const qualifiedName = ctx.qualifiedName();
        let qualifiedNameStr;
        if (qualifiedName) {
            qualifiedNameStr = toText(qualifiedName);
        } else {
            qualifiedNameStr = ctx.altAnnotationQualifiedName().identifier().map(n => toText(n)).join('.');
        }
        const annotationVarName = (function getLast(list) {
            return list[list.length - 1];
        }(qualifiedNameStr.split('.')))
        const annotationVarId = UAST.identifier(annotationVarName);
        const qualifiedExpr = convertToMemberAccess(qualifiedNameStr);
        //var annotationVarId  = new qualifiedName()
        const varDecl = UAST.variableDeclaration(annotationVarId, UAST.newExpression(qualifiedExpr, []), false, UAST.scopedType(UAST.identifier(qualifiedNameStr), null))
        if (ctx.elementValue() || ctx.elementValuePairs()) {
            const expr = this.safeVisit(ctx.elementValue()) || this._visitElementValuePairs(ctx.elementValuePairs(), annotationVarId);
            return UAST.sequence([varDecl, expr, varDecl.id]);
        } else {
            return varDecl;
        }
    }

    @addLoc
    private _visitElementValuePairs(ctx: JP.ElementValuePairsContext, varId: UAST.Identifier): UAST.Instruction {
        const body = ctx.elementValuePair().map(e => {
            const rhs = this.visit(e.elementValue()) as UAST.Expression;
            const lhs = UAST.memberAccess(varId, this.visit(e.identifier()) as UAST.Identifier);
            return UAST.assignmentExpression(lhs, rhs, '=');
        })
        return UAST.scopedStatement(body);
    }


    // altAnnotationQualifiedName
    //     : (identifier DOT)* '@' identifier
    //     ;
    public visitAltAnnotationQualifiedName(ctx: JP.AltAnnotationQualifiedNameContext): UAST.Node {
        return UAST.noop();
    }

    // elementValuePairs
    //     : elementValuePair (',' elementValuePair)*
    //     ;
    public visitElementValuePairs(ctx: JP.ElementValuePairsContext): UAST.Node {
        return UAST.noop();
    }

    // elementValuePair
    //     : identifier '=' elementValue
    //     ;
    public visitElementValuePair(ctx: JP.ElementValuePairContext): UAST.Node {
        return UAST.noop();
    }


    //enumDeclaration
    //     : ENUM identifier (IMPLEMENTS typeList)? '{' enumConstants? ','? enumBodyDeclarations? '}'
    public visitEnumDeclaration(ctx: JP.EnumDeclarationContext): UAST.Instruction {
        const typeListCtx = ctx.typeList();
        const supers = this.safeVisit(ctx.typeList()) || [];
        const id = this.visit(ctx.identifier()) as UAST.Identifier;
        // important! enumBodyDeclarations should be processed before enumConstants
        const body = [];
        const bodyDeclarations = ctx.enumBodyDeclarations();
        if (bodyDeclarations) {
            bodyDeclarations.classBodyDeclaration().forEach(d => {
                const member = this.visit(d) as UAST.Instruction | UAST.Instruction[];
                if (Array.isArray(member)) {
                    body.push(...member);
                } else {
                    body.push(member);
                }
            })
        }
        //enumConstants
        const enumConstantsCtx = ctx.enumConstants();
        if (enumConstantsCtx) {
            const constBody = this._visitEnumConstants(enumConstantsCtx, id);
            body.push(...constBody);
        }
        return UAST.classDefinition(id, body, supers);
    }

    // enumConstants
    //     : enumConstant (',' enumConstant)*
    //     ;
    public visitEnumConstants(ctx: JP.EnumConstantsContext): UAST.Node {
        return UAST.noop();
    }

    // enumConstant
    //     : annotation* identifier arguments? classBody?
    //     ;
    public visitEnumConstant(ctx: JP.EnumConstantContext): UAST.Node {
        return UAST.noop();
    }

    //enumConstants
    //     : enumConstant (',' enumConstant)*
    //enumConstant
    //: annotation* identifier arguments? classBody?
    // will convert to
    // public static enumType id = new (class <anonymous> extends superId { classBody })(arguments)
    @addLoc
    private _visitEnumConstants(ctx: JP.EnumConstantsContext, superId: UAST.Identifier): UAST.Instruction[] {
        return ctx.enumConstant().map(e => {
            const id = this.visit(e.identifier()) as UAST.Identifier;
            const body = this.visit(e.classBody()) as UAST.Instruction[] || [];
            const cdef = UAST.classDefinition(id, body, [superId]);
            const args = this.visit(e.arguments()?.expressionList()) as UAST.Expression[] || [];
            const varInit = UAST.newExpression(cdef, args);
            varInit._meta.isEnumImpl = true;
            return varInit;
        });
    }

    // enumBodyDeclarations
    //     : ';' classBodyDeclaration*
    //     ;
    public visitEnumBodyDeclarations(ctx: JP.EnumBodyDeclarationsContext): UAST.Node {
        return UAST.noop();
    }


    //typeList
    //     : typeType (',' typeType)*
    public visitTypeList(ctx: JP.TypeListContext): UAST.Instruction[] {
        return ctx.typeType().map(t => {
            const type = this.visit(t) as UAST.Type;
            return typeToIdentifier(type);
        });
    }

    //     : '{' blockStatement* '}'
    public visitBlock(ctx: JP.BlockContext): UAST.Instruction {
        const body: UAST.Instruction[] = [];
        const node = UAST.scopedStatement(body);
        ctx.blockStatement().forEach(b => {
            const node = this.visit(b) as UAST.Instruction | UAST.Instruction[];
            if (Array.isArray(node)) {
                body.push(...node);
            } else {
                body.push(node);
            }
        });
        return node;
    }

    //blockStatement
    //     : localVariableDeclaration ';'
    //     | localTypeDeclaration
    //     | statement
    public visitBlockStatement(ctx: JP.BlockStatementContext): UAST.Instruction | UAST.Instruction[] {
        return this.visit(ctx.children[0]) as UAST.Instruction;
    }

    //localVariableDeclaration
    //     : variableModifier* (VAR identifier '=' expression | typeType variableDeclarators)
    //TODO variableModifier
    public visitLocalVariableDeclaration(ctx: JP.LocalVariableDeclarationContext): UAST.Instruction | UAST.Instruction[] {
        const idCtx = ctx.identifier();
        if (idCtx) {
            // var case, e.g. var a = expr;
            const expr = this.visit(ctx.expression()) as UAST.Expression;
            const id = this.visit(idCtx) as UAST.Identifier;
            return UAST.variableDeclaration(id, expr, false, UAST.dynamicType());
        } else {
            // typeType case
            const leftType = this.visit(ctx.typeType()) as UAST.Type;
            this.typesState.push(leftType);
            const node = this.visit(ctx.variableDeclarators()) as UAST.Instruction | UAST.Instruction[];
            this.typesState.pop();
            return node;
        }
    }

    //statement
    //     : blockLabel=block
    //     | ASSERT expression (':' expression)? ';'
    //     | IF parExpression statement (ELSE statement)?
    //     | FOR '(' forControl ')' statement
    //     | WHILE parExpression statement
    //     | DO statement WHILE parExpression ';'
    //     | TRY block (catchClause+ finallyBlock? | finallyBlock)
    //     | TRY resourceSpecification block catchClause* finallyBlock?
    //     | SWITCH parExpression '{' switchBlockStatementGroup* switchLabel* '}'
    //     | SYNCHRONIZED parExpression block
    //     | RETURN expression? ';'
    //     | THROW expression ';'
    //     | BREAK identifier? ';'
    //     | CONTINUE identifier? ';'
    //     | YIELD expression ';' // Java17
    //     | SEMI
    //     | statementExpression=expression ';'
    //     | switchExpression ';'? // Java17
    //     | identifierLabel=identifier ':' statement
    @addLoc
    public visitStatement(ctx: JP.StatementContext): UAST.Instruction {
        if (ctx._blockLabel) {
            return this.visit(ctx._blockLabel) as UAST.Instruction;
        }
        if (ctx.ASSERT()) {
            return this._visitAssertStatement(ctx.expression());
        }
        // | IF parExpression statement (ELSE statement)?
        if (ctx.IF()) {
            return this._visitIfStatement(ctx.parExpression(), ctx.statement());
        }
        if (ctx.FOR()) {
            return this._visitForStatement(ctx.forControl(), ctx.statement());
        }
        // | WHILE parExpression statement
        if (ctx.WHILE()) {
            return this._visitWhileStatement(ctx.parExpression(), ctx.statement());
        }
        // | DO statement WHILE parExpression ';'
        if (ctx.DO()) {
            return this._visitDoStatement(ctx.statement(), ctx.parExpression());
        }
        // TRY block (catchClause+ finallyBlock? | finallyBlock)
        // TRY resourceSpecification block catchClause* finallyBlock?
        if (ctx.TRY()) {
            const res: UAST.TryStatement = this._visitTryStatement(ctx.block(), ctx.catchClause(), ctx.finallyBlock()) as UAST.TryStatement;
            const resourceSpecificationCtx = ctx.resourceSpecification();
            if (resourceSpecificationCtx) {
                const seq = this.visit(resourceSpecificationCtx.resources()) as UAST.Sequence;
                if (res.body.type === 'ScopedStatement') {
                    res.body.body.unshift(seq);
                } else {
                    const blockStmt = UAST.scopedStatement([seq, res.body]);
                    res.body = blockStmt;
                }
                res.body._meta.hasResources = true;
            }
            return res;
        }
        // SWITCH parExpression '{' switchBlockStatementGroup* switchLabel* '}'
        if (ctx.SWITCH()) {
            return this._visitSwitchStatement(ctx.parExpression(), ctx.switchBlockStatementGroup(), ctx.switchLabel());
        }
        //     | SYNCHRONIZED parExpression block
        if (ctx.SYNCHRONIZED()) {
            return this.visitSynchronizedStatement(ctx.parExpression(), ctx.block());
        }
        //     | RETURN expression? ';'
        if (ctx.RETURN()) {
            return this._visitReturnStatement(ctx.expression());
        }
        //     | THROW expression ';'
        if (ctx.THROW()) {
            return this._visitThrowStatement(ctx.expression());
        }
        //     | BREAK identifier? ';'
        if (ctx.BREAK()) {
            return this._visitBreakStatement(ctx.identifier());
        }
        //     | CONTINUE identifier? ';'
        if (ctx.CONTINUE()) {
            return this._visitContinueStatement(ctx.identifier());
        }
        //     | YIELD expression ';' // Java17
        if (ctx.YIELD()) {
            return this._visitYieldStatement(ctx.expression());
        }

        //     | statementExpression=expression ';'
        if (ctx._statementExpression) {
            return this._visitStatementExpression(ctx._statementExpression);
        }
        //     | switchExpression ';'? // Java17
        if (ctx.switchExpression()) {
            return this.visit(ctx.switchExpression()) as UAST.Instruction;
        }
        //     | identifierLabel=identifier ':' statement
        if (ctx._identifierLabel) {
            const stmt = this.visit(ctx.statement()[0]) as UAST.Instruction;
            const id = this.visit(ctx._identifierLabel) as UAST.Identifier;
            return UAST.scopedStatement([stmt], id);
        }

        //     | SEMI
        if (ctx.SEMI()) {
            return UAST.noop();
        }
    }

    //    | ASSERT expression (':' expression)? ';'
    @addLoc
    private _visitAssertStatement(expressionContexts: JP.ExpressionContext[]): UAST.Instruction {
        const args = expressionContexts.map(e => this.visit(e) as UAST.Expression);
        return UAST.callExpression(UAST.identifier('assert'), args);
    }

    @addLoc
    private _visitIfStatement(parExpressionContext: JP.ParExpressionContext, statementContexts: JP.StatementContext[]): UAST.Instruction {
        const test = this.visit(parExpressionContext) as UAST.Expression;
        const consequent = this.visit(statementContexts[0]) as UAST.Instruction;
        let alternative;
        if (statementContexts.length > 1) {
            alternative = this.visit(statementContexts[1]) as UAST.Instruction;
        }
        return UAST.ifStatement(test, consequent, alternative);
    }

    @addLoc
    private _visitForStatement(forControlContext: JP.ForControlContext, statementContexts: JP.StatementContext[]): UAST.Instruction {
        //forControl
        //     : enhancedForControl
        //     | forInit? ';' expression? ';' forUpdate=expressionList?
        if (!forControlContext.enhancedForControl()) {
            let init;
            let test;
            let update;
            const initCtx = forControlContext.forInit();
            if (initCtx) {
                init = this.visit(initCtx) as UAST.Instruction;
            }
            const testCtx = forControlContext.expression();
            if (testCtx) {
                test = this.visit(testCtx) as UAST.Instruction;
            }
            const updateCtx = forControlContext._forUpdate;
            if (updateCtx) {
                const updateList = this.visit(updateCtx) as UAST.Instruction[];
                if (updateList.length === 1) {
                    update = updateList[0];
                } else {
                    update = UAST.sequence(updateList);
                }
            }
            const body = this.visit(statementContexts[0]) as UAST.Instruction;
            return UAST.forStatement(init, test, update, body);
        } else {
            // range statement
            //enhancedForControl
            //     : variableModifier* (typeType | VAR) variableDeclaratorId ':' expression
            const enhancedForControl = forControlContext.enhancedForControl();
            let type;
            if (enhancedForControl.VAR()) {
                type = UAST.dynamicType();
            } else {
                type = this.visit(enhancedForControl.typeType()) as UAST.Type;
            }
            this.typesState.push(type);
            const value = this.visit(enhancedForControl.variableDeclaratorId()) as UAST.Expression;
            this.typesState.pop(); // for variableDeclaratorId
            this.typesState.pop();
            const right = this.visit(enhancedForControl.expression()) as UAST.Expression;
            const body = this.visit(statementContexts[0]) as UAST.Instruction;
            return UAST.rangeStatement(null, value, right, body);
        }
    }

    // forControl
    //     : enhancedForControl
    //     | forInit? ';' expression? ';' forUpdate=expressionList?
    //     ;
    public visitForControl(ctx: JP.ForControlContext): UAST.Node {
        return UAST.noop();
    }

    // enhancedForControl
    //     : variableModifier* (typeType | VAR) variableDeclaratorId ':' expression
    //     ;
    visitEnhancedForControl(ctx: JP.EnhancedForControlContext): UAST.Node {
        return UAST.noop();
    }

    // forInit
    //     : localVariableDeclaration
    //     | expressionList
    //     ;
    public visitForInit(ctx: JP.ForInitContext): UAST.Instruction {
        const localVariableDeclaration = ctx.localVariableDeclaration();
        if (localVariableDeclaration) {
            const varList = this.visit(localVariableDeclaration) as UAST.Instruction | UAST.Instruction[];
            if (Array.isArray(varList)) {
                return UAST.sequence(varList);
            } else {
                return varList;
            }
        } else {
            const seq = this.visit(ctx.expressionList()) as UAST.Expression[];
            if (seq.length > 1) {
                return UAST.sequence(this.visit(ctx.expressionList()) as UAST.Expression[]);
            } else if (seq.length === 1) {
                return seq[0];
            } else {
                return UAST.noop();
            }
        }
    }


    private _visitWhileStatement(parExpressionContext: JP.ParExpressionContext, statementContexts: JP.StatementContext[]): UAST.Instruction {
        return this._visitWhileStatementInner(parExpressionContext, statementContexts, false);
    }

    private _visitDoStatement(statementContexts: JP.StatementContext[], parExpressionContext: JP.ParExpressionContext): UAST.Instruction {
        return this._visitWhileStatementInner(parExpressionContext, statementContexts, true);
    }

    @addLoc
    private _visitWhileStatementInner(parExpressionContext: JP.ParExpressionContext, statementContexts: JP.StatementContext[], isPost: boolean): UAST.Instruction {
        const test = this.visit(parExpressionContext) as UAST.Expression;
        const body = this.visit(statementContexts[0]) as UAST.Instruction;
        return UAST.whileStatement(test, body, isPost);
    }

    //resources
    //     : resource (';' resource)*
    //     ;
    //
    public visitResources(resourcesCtx: JP.ResourcesContext): UAST.Sequence {
        const seqBody = [];
        const seq = UAST.sequence(seqBody);

        resourcesCtx.resource().map(resource => {
            const qualifiedName = resource.qualifiedName();

            if (qualifiedName) {
                seqBody.push(convertToMemberAccess(toText(qualifiedName)));
            } else {
                const identifier: UAST.Identifier = (this.visit(resource.identifier()) || this.visit(resource.variableDeclaratorId())) as UAST.Identifier;
                const varDecl = UAST.variableDeclaration(identifier, this.visit(resource.expression()) as UAST.Expression, false, UAST.dynamicType());
                seqBody.push(varDecl);
            }
        })
        return seq;
    }

    // resource
    //     : variableModifier* ( classOrInterfaceType variableDeclaratorId | VAR identifier ) '=' expression
    //     | qualifiedName
    // ;
    public visitResource(ctx: JP.ResourceContext): UAST.Node {
        return UAST.noop();
    }


    //TRY block (catchClause+ finallyBlock? | finallyBlock)
    @addLoc
    private _visitTryStatement(blockContext: JP.BlockContext, catchClauseContexts: JP.CatchClauseContext[], finallyBlockContext: JP.FinallyBlockContext): UAST.Instruction {
        const body = this.visit(blockContext) as UAST.Statement;
        let handlers;
        if (catchClauseContexts) {
            handlers = catchClauseContexts?.map(c => this.visit(c) as UAST.CatchClause);
        }
        let _finally;
        if (finallyBlockContext) {
            _finally = this.visit(finallyBlockContext) as UAST.Instruction;
        }
        return UAST.tryStatement(body, handlers, _finally);
    }

    //catchClause
    //     : CATCH '(' variableModifier* catchType identifier ')' block
    public visitCatchClause(ctx: JP.CatchClauseContext): UAST.CatchClause {
        const qualifiedName = toText(ctx.catchType());
        const type = UAST.scopedType(UAST.identifier(qualifiedName), null) as UAST.Type;
        const varId = this.visit(ctx.identifier()) as UAST.Identifier;

        const varDecl = UAST.variableDeclaration(varId, null, false, type);
        const body = this.visit(ctx.block()) as UAST.Instruction;
        return UAST.catchClause([varDecl], body);
    }

    // catchType
    //     : qualifiedName ('|' qualifiedName)*
    //     ;
    public visitCatchType(ctx: JP.CatchTypeContext): UAST.Node {
        return UAST.noop();
    }


    //finallyBlock
    //     : FINALLY block
    public visitFinallyBlock(ctx: JP.FinallyBlockContext): UAST.Instruction {
        return this.visit(ctx.block()) as UAST.Instruction;
    }

    // resourceSpecification
    //     : '(' resources ';'? ')'
    //     ;
    public visitResourceSpecification(ctx: JP.ResourceSpecificationContext): UAST.Node {
        return UAST.noop();
    }


    //SWITCH parExpression '{' switchBlockStatementGroup* switchLabel* '}'
    @addLoc
    private _visitSwitchStatement(parExpressionContext: JP.ParExpressionContext, switchBlockStatementGroupContexts: JP.SwitchBlockStatementGroupContext[], switchLabelContexts: JP.SwitchLabelContext[]): UAST.Instruction {
        const discriminant = this.visit(parExpressionContext) as UAST.Expression;
        const cases = switchBlockStatementGroupContexts.map(s => this.visit(s) as UAST.CaseClause);
        return UAST.switchStatement(discriminant, cases);
    }

    //switchBlockStatementGroup
    //     : switchLabel+ blockStatement+
    // TODO
    public visitSwitchBlockStatementGroup(ctx: JP.SwitchBlockStatementGroupContext): UAST.CaseClause {
        const switchLabels = ctx.switchLabel();
        const blocks = ctx.blockStatement();
        const stmts = _.flatten(blocks.map(b => this.visit(b) as UAST.Instruction));
        const body = UAST.scopedStatement(stmts);
        const cases = switchLabels.map(s => {
            return this.visit(s) as UAST.Expression;
        })
        let test;
        cases.forEach(c => {
            if (!test) {
                test = c;
            } else {
                test = UAST.binaryExpression('|', test, c);
            }
        })
        return UAST.caseClause(test, body);
    }

    //switchLabel
    //     : CASE (constantExpression=expression | enumConstantName=IDENTIFIER | typeType varName=identifier) ':'
    //     | DEFAULT ':'
    public visitSwitchLabel(ctx: JP.SwitchLabelContext): UAST.Expression {
        if (ctx.DEFAULT()) {
            return UAST.noop();
        } else if (ctx.typeType()) {
            const type = this.visit(ctx.typeType()) as UAST.Type;
            const varId = this.visit(ctx._varName) as UAST.Identifier;
            return UAST.variableDeclaration(varId, null, false, type);
        } else if (ctx._constantExpression) {
            return this.visit(ctx._constantExpression) as UAST.Expression;
        } else {
            //TODO
            return UAST.identifier('TODO')
        }
    }

    @addLoc
    private visitSynchronizedStatement(parExpressionContext: JP.ParExpressionContext, blockContext: JP.BlockContext): UAST.Instruction {
        const block = this.visit(blockContext) as UAST.ScopedStatement;
        const callExpr = UAST.callExpression(UAST.identifier('synchronized'), [this.visit(parExpressionContext) as UAST.Expression]);
        block.body.unshift(callExpr);
        block._meta.isSynchronized = true;
        return block;
    }

    @addLoc
    private _visitReturnStatement(expressionContexts: JP.ExpressionContext[]): UAST.Instruction {
        let expr;
        if (expressionContexts) {
            expr = this.safeVisit(expressionContexts[0]) as UAST.Expression;
        }
        return UAST.returnStatement(expr);
    }

    @addLoc
    private _visitThrowStatement(expressionContexts: JP.ExpressionContext[]): UAST.Instruction {
        const expr = this.visit(expressionContexts[0]) as UAST.Expression;
        return UAST.throwStatement(expr);
    }

    @addLoc
    private _visitBreakStatement(identifierContext: JP.IdentifierContext): UAST.Instruction {
        let id;
        if (identifierContext) {
            id = this.visit(identifierContext) as UAST.Identifier;
        }
        return UAST.breakStatement(id);
    }

    @addLoc
    private _visitContinueStatement(identifierContext: JP.IdentifierContext): UAST.Instruction {
        let id;
        if (identifierContext) {
            id = this.visit(identifierContext) as UAST.Identifier;
        }
        return UAST.continueStatement(id);
    }

    //     | YIELD expression ';' // Java17
    @addLoc
    private _visitYieldStatement(expressionContexts: JP.ExpressionContext[]): UAST.Instruction {
        const expr = this.visit(expressionContexts[0]) as UAST.Expression;
        return UAST.returnStatement(expr, true);
    }

    @addLoc
    private _visitStatementExpression(_statementExpression: JP.ExpressionContext): UAST.Instruction {
        const expr = this.visit(_statementExpression) as UAST.Expression;
        return expr;
    }

    //formalParameters
    //     : '(' ( receiverParameter?
    //           | receiverParameter (',' formalParameterList)?
    //           | formalParameterList?
    //           ) ')'
    public visitFormalParameters(ctx: JP.FormalParametersContext): UAST.Instruction | UAST.Instruction[] {
        return this.safeVisit(ctx.formalParameterList()) || [];
    }

    //formalParameterList
    //     : formalParameter (',' formalParameter)* (',' lastFormalParameter)?
    //     | lastFormalParameter
    public visitFormalParameterList(ctx: JP.FormalParameterListContext): UAST.Instruction[] {
        const params = ctx.formalParameter().map(p => {
            return this.visit(p) as UAST.Instruction;
        });
        const lastFormalParameter = ctx.lastFormalParameter();
        if (lastFormalParameter) {
            params.push(this.visit(ctx.lastFormalParameter()) as UAST.Instruction);
        }
        return params;
    }

    //lastFormalParameter
    //     : variableModifier* typeType annotation* '...' variableDeclaratorId
    public visitLastFormalParameter(ctx: JP.LastFormalParameterContext): UAST.Instruction {
        const leftType = this.visit(ctx.typeType()) as UAST.Type;
        this.typesState.push(leftType);
        const varId = this.visit(ctx.variableDeclaratorId()) as UAST.Identifier;
        const type = this.typesState.pop();
        const node = UAST.variableDeclaration(varId, null, false, type);
        this.typesState.pop();
        if (ctx.ELLIPSIS()) {
            node._meta.rest = true;
        }
        return node;
    }

    //formalParameter
    //     : variableModifier* typeType variableDeclaratorId
    // TODO variableModifier
    public visitFormalParameter(ctx: JP.FormalParameterContext): UAST.Instruction {
        const leftType = this.visit(ctx.typeType()) as UAST.Type;
        this.typesState.push(leftType);
        const varId = this.visit(ctx.variableDeclaratorId()) as UAST.Identifier;
        const type = this.typesState.pop();
        const node = UAST.variableDeclaration(varId, null, false, type);
        this.typesState.pop();
        return node;
    }

    //variableDeclarators
    //     : variableDeclarator (',' variableDeclarator)*
    public visitVariableDeclarators(ctx: JP.VariableDeclaratorsContext): UAST.Instruction[] {
        const decls = ctx.variableDeclarator();
        return decls.map(d => this.visit(d)) as UAST.Instruction[];
    }

    //variableDeclarator
    //     : variableDeclaratorId ('=' variableInitializer)?
    public visitVariableDeclarator(ctx: JP.VariableDeclaratorContext): UAST.Instruction {
        const varidCtx = ctx.variableDeclaratorId()
        const varid = this.visit(varidCtx) as UAST.Identifier;
        const initCtx = ctx.variableInitializer();
        let init: UAST.Expression;
        if (initCtx) {
            init = this.visit(initCtx) as UAST.Expression;
        }
        const type = this.typesState.pop();
        return UAST.variableDeclaration(varid, init, false, type);
    }

    //variableDeclaratorId
    //     : identifier ('[' ']')*
    // !important always remember pop typesState after visitVariableDeclaratorId!
    public visitVariableDeclaratorId(ctx: JP.VariableDeclaratorIdContext): UAST.Identifier {
        const type = this.typesState[this.typesState.length - 1];
        const arrayDimension = ctx.LBRACK()?.length;
        //TODO Array type
        this.typesState.push(type);
        return this.visit(ctx.identifier()) as UAST.Identifier;
    }

    // EXPRESSIONS

    public visitExpression(ctx: JP.ExpressionContext): UAST.Expression {
        const primary = ctx.primary();
        if (primary) {
            return this.visit(primary) as UAST.Expression;
        }

        // | expression ('<' '<' | '>' '>' '>' | '>' '>') expression
        function tryGetShiftString(ctx: JP.ExpressionContext): string {
            if (ctx.GT().length === 2) return '>>';
            else if (ctx.GT().length === 3) return '>>>';
            else if (ctx.LT().length === 2) return '<<';
            else return undefined;
        }

        const bopText = tryGetShiftString(ctx);
        if (bopText) {
            const left = this.visit(ctx.expression()[0]) as UAST.Expression;
            const right = this.visit(ctx.expression()[1]) as UAST.Expression;
            // @ts-ignore
            return UAST.binaryExpression(bopText, left, right);
        }

        const bop = ctx._bop;
        if (bop) {
            const bopText = toText(bop);
            if (bopText === '.') {
                // e.g. a.b
                // member access
                const object = this.visit(ctx.expression()[0]) as UAST.Expression;
                const identifier = ctx.identifier();
                const methodCall = ctx.methodCall();
                const explicitGenericInvocationCtx = ctx.explicitGenericInvocation();
                if (identifier) {
                    const property = this.visit(identifier) as UAST.Expression;
                    return UAST.memberAccess(object, property, false);
                } else if (methodCall) {
                    const call = this.visit(methodCall) as UAST.CallExpression;
                    const callee = call.callee;
                    call.callee = UAST.memberAccess(object, callee, false);
                    return call;
                } else if (explicitGenericInvocationCtx) {
                    //explicitGenericInvocation
                    const {
                        object: prop,
                        expression,
                        args
                    } = this._visitExplicitGenericInvocationSuffix(explicitGenericInvocationCtx.explicitGenericInvocationSuffix());
                    const callee = prop ? UAST.memberAccess(UAST.memberAccess(object, prop), expression) : UAST.memberAccess(object, expression);
                    return UAST.callExpression(callee, args);
                } else if (ctx.SUPER()) {
                    //SUPER superSuffix
                    const { expression, args } = this._visitSuperSuffix(ctx.superSuffix());
                    if (expression) {
                        return UAST.callExpression(UAST.memberAccess(UAST.superExpression(), expression), args);
                    } else {
                        return UAST.callExpression(UAST.superExpression(), args);
                    }
                } else if (ctx.THIS()) {
                    return UAST.memberAccess(object, UAST.thisExpression());
                } else if (ctx.NEW()) {
                    // expression .  NEW nonWildcardTypeArguments? innerCreator
                    const prop = ctx.innerCreator().identifier();
                    const argumentsCtx = ctx.innerCreator().classCreatorRest().arguments();
                    const classBodyCtx = ctx.innerCreator().classCreatorRest().classBody();
                    let args = [];
                    const exprListCtx = argumentsCtx.expressionList();
                    if (exprListCtx) {
                        args = this.visit(exprListCtx) as UAST.Expression[]
                    }
                    if (!classBodyCtx) {
                        return UAST.newExpression(UAST.memberAccess(object, this.visit(prop) as UAST.Identifier), args);
                    } else {
                        // TODO  new Foo.new Bar(){ //... }
                        return UAST.newExpression(UAST.memberAccess(object, this.visit(prop) as UAST.Identifier), args);
                    }
                } else {
                    throw new Error(`type ${toText(ctx)} is not supported`);
                }
            }
                // binary
                //     | expression bop=('*'|'/'|'%') expression
                //     | expression bop=('+'|'-') expression
                //     | expression ('<' '<' | '>' '>' '>' | '>' '>') expression
                //     | expression bop=('<=' | '>=' | '>' | '<') expression
                //     | expression bop=INSTANCEOF (typeType | pattern)
                //     | expression bop=('==' | '!=') expression
                //     | expression bop='&' expression
                //     | expression bop='^' expression
                //     | expression bop='|' expression
                //     | expression bop='&&' expression
                //     | expression bop='||' expression
                //     | <assoc=right> expression
                //       bop=('=' | '+=' | '-=' | '*=' | '/=' | '&=' | '|=' | '^=' | '>>=' | '>>>=' | '<<=' | '%=')
            //       expression
            else if (['*', '/', '%', '+', '-', '<=', '>=', '>', '<', '>>', '<<', '==', '!=', '&', '|', '^', '&&', '||'].indexOf(bopText) !== -1) {
                // e.g. a*b
                const left = this.visit(ctx.expression()[0]) as UAST.Expression;
                const right = this.visit(ctx.expression()[1]) as UAST.Expression;
                // @ts-ignore
                return UAST.binaryExpression(bopText, left, right);
            } else if (['=', '^=', '&=', '<<=', '>>=', '>>>=', '+=', '-=', '*=', '/=', '%=', ',=', '**=', '|='].indexOf(bopText) !== -1) {
                // e.g. a=b
                const left = this.visit(ctx.expression()[0]) as UAST.Expression;
                const right = this.visit(ctx.expression()[1]) as UAST.Expression;
                // @ts-ignore
                return UAST.assignmentExpression(left, right, bopText);
            } else if (bopText === 'instanceof') {
                const left = this.visit(ctx.expression()[0]) as UAST.Expression;
                if (!ctx.pattern()) {
                    const right = this.visit(ctx.typeType()[0]) as UAST.Type;
                    return UAST.binaryExpression('instanceof', left, ('id' in right && right.id) || ('name' in right && right));
                } else {
                    const patternCtx = ctx.pattern();
                    const type = this.visit(patternCtx.typeType()) as UAST.Type;
                    const id = this.visit(patternCtx.identifier()) as UAST.Identifier;
                    const varDecl = UAST.variableDeclaration(id, left, false, type);
                    const seqBody = [varDecl, UAST.binaryExpression('instanceof', left, id)];
                    return UAST.sequence(seqBody);
                }
            } else if (bopText === '?') {
                //ternary e.g. a? b: c
                //     | <assoc=right> expression bop='?' expression ':' expression
                const test = this.visit(ctx.expression()[0]) as UAST.Expression;
                const cons = this.visit(ctx.expression()[1]) as UAST.Expression;
                const alt = this.visit(ctx.expression()[2]) as UAST.Expression;
                return UAST.conditionalExpression(test, cons, alt);
            }
        }

        // a[b]
        if (ctx.children[1] && toText(ctx.children[1]) === '[') {
            const object = this.visit(ctx.children[0]) as UAST.Expression;
            const property = this.visit(ctx.children[2]) as UAST.Expression;
            return UAST.memberAccess(object, property, true);
        }

        // methodCall
        const methodCall = ctx.methodCall();
        if (methodCall) {
            return this.visit(methodCall) as UAST.Expression;
        }

        // new creator
        const creator = ctx.creator();
        if (creator) {
            return this.visit(creator) as UAST.Expression;
        }

        // cast
        //     | '(' annotation* typeType ('&' typeType)* ')' expression
        if (toText(ctx.children[0]) === '(') {
            //TODO handle multi typeType
            const typeTypeCtx = ctx.typeType();
            const type = this.visit(typeTypeCtx[0]) as UAST.Type;
            const expr = this.visit(ctx.expression()[0]) as UAST.Expression;
            return UAST.castExpression(expr, type);
        }

        // unary
        //     | expression postfix=('++' | '--')
        //     | prefix=('+'|'-'|'++'|'--') expression
        //     | prefix=('~'|'!') expression
        if (ctx._postfix) {
            return UAST.unaryExpression(toText(ctx._postfix) as '++' | '--', this.visit(ctx.expression()[0]) as UAST.Expression, true);
        }
        if (ctx._prefix) {
            const text = toText(ctx._prefix)
            if (text === '-') {
              const argExpr = this.visit(ctx.expression()[0]) as UAST.Expression;
              if (argExpr.type === 'Literal') {
                argExpr.value = String(-Number(argExpr.value))
                return argExpr;
              } else {
                return UAST.unaryExpression(toText(ctx._prefix) as '--', argExpr, false);
              }
            } else if (text === '+') {
              return this.visit(ctx.expression()[0]) as UAST.Expression
            } else {
              return UAST.unaryExpression(toText(ctx._prefix) as '--', this.visit(ctx.expression()[0]) as UAST.Expression, false);
            }
        }


        //     | lambdaExpression // Java8
        const lambdaExpressionCtx = ctx.lambdaExpression();
        if (lambdaExpressionCtx) {
            return this.visit(lambdaExpressionCtx) as UAST.Expression;
        }
        //     | switchExpression // Java17
        const switchExpressionCtx = ctx.switchExpression();
        if (switchExpressionCtx) {
            return this.visit(switchExpressionCtx) as UAST.Expression;
        }
        //
        //     // Java 8 methodReference
        //     | expression '::' typeArguments? identifier
        //     | typeType '::' (typeArguments? identifier | NEW)
        //     | classType '::' typeArguments? NEW
        const methodReference = ctx.children[1] ? toText(ctx.children[1]) : null;
        if (methodReference === '::') {
            const expressionCtx = ctx.expression();
            const typeCtx = ctx.typeType() ? ctx.typeType()[0] : null;
            const classTypeCtx = ctx.classType();
            if (typeCtx) {
                // typeType '::' (typeArguments? identifier | NEW)
                const type = this.visit(typeCtx) as UAST.Type;
                const object = convertToMemberAccess(('id' in type && type.id.name) || ('name' in type && type.name));
                let prop;
                if (ctx.NEW()) {
                    prop = UAST.identifier('_CTOR_');
                } else {
                    prop = this.visit(ctx.identifier()) as UAST.Expression;
                }
                return UAST.memberAccess(object, prop);
            } else if (classTypeCtx) {
                // classType '::' typeArguments? NEW
                const type = this.visit(classTypeCtx) as UAST.Type;
                return UAST.memberAccess(convertToMemberAccess(('id' in type && type.id.name) || ('name' in type && type.name)), UAST.identifier('_CTOR_'));
            } else {
                // expression '::' typeArguments? identifier
                const object = this.visit(expressionCtx[0]) as UAST.Expression;
                const prop = this.visit(ctx.identifier()) as UAST.Expression;
                return UAST.memberAccess(object, prop);
            }
        }
    }


    //// Java8
    // lambdaExpression
    //     : lambdaParameters '->' lambdaBody
    public visitLambdaExpression(ctx: JP.LambdaExpressionContext): UAST.FunctionDefinition {
        // lambdaParameters
        //     : identifier
        //     | '(' formalParameterList? ')'
        //     | '(' identifier (',' identifier)* ')'
        //     | '(' lambdaLVTIList? ')'
        let params: UAST.VariableDeclaration[];
        const lambdaParametersCtx = ctx.lambdaParameters()
        const idsCtx = lambdaParametersCtx.identifier();
        const formalParameterListCtx = lambdaParametersCtx.formalParameterList();
        if (idsCtx.length !== 0) {
            params = idsCtx.map(idCtx => {
                const id = this.visit(idCtx) as UAST.Identifier;
                return UAST.variableDeclaration(id, null, false, UAST.dynamicType());
            });
        } else if (formalParameterListCtx) {
            params = this.visit(formalParameterListCtx) as UAST.VariableDeclaration[];
        } else {
            const lambdaLVTIListCtx = lambdaParametersCtx.lambdaLVTIList();
            if (lambdaLVTIListCtx) {
                params = lambdaLVTIListCtx.lambdaLVTIParameter().map(pCtx => {
                    const id = this.visit(pCtx.identifier()) as UAST.Identifier;
                    return UAST.variableDeclaration(id, null, false, UAST.dynamicType());
                })
            } else {
                params = [];
            }
        }

        //lambdaBody
        //     : expression
        //     | block
        const lambdaBodyCtx = ctx.lambdaBody();
        const exprCtx = lambdaBodyCtx.expression();
        if (exprCtx) {
            return UAST.functionDefinition(null, params, UAST.dynamicType(), UAST.scopedStatement([this.visit(exprCtx) as UAST.Expression], null), []);
        } else {
            return UAST.functionDefinition(null, params, UAST.dynamicType(), this.visit(lambdaBodyCtx.block()) as UAST.ScopedStatement, []);
        }
    }

    // lambdaLVTIList
    //     : lambdaLVTIParameter (',' lambdaLVTIParameter)*
    //     ;
    public visitLambdaLVTIList(ctx: JP.LambdaLVTIListContext): UAST.Node {
        return UAST.noop();
    }

    // lambdaLVTIParameter
    //     : variableModifier* VAR identifier
    //     ;
    public visitLambdaLVTIParameter(ctx: JP.LambdaLVTIParameterContext): UAST.Node {
        return UAST.noop();
    }

    // lambdaParameters
    //     : identifier
    //     | '(' formalParameterList? ')'
    //     | '(' identifier (',' identifier)* ')'
    //     | '(' lambdaLVTIList? ')'
    //     ;
    public visitLambdaParameters(ctx: JP.LambdaParametersContext): UAST.Node {
        return UAST.noop();
    }

    // lambdaBody
    //     : expression
    //     | block
    //     ;
    public visitLambdaBody(ctx: JP.LambdaBodyContext): UAST.Node {
        return UAST.noop();
    }

    // qualifiedName
    //     : identifier ('.' identifier)*
    //     ;
    public visitQualifiedName(ctx: JP.QualifiedNameContext): UAST.Node {
        return UAST.noop();
    }

    // pattern
    //     : variableModifier* typeType annotation* identifier
    //     ;
    public visitPattern(ctx: JP.PatternContext): UAST.Node {
        return UAST.noop();
    }

    //classType
    //     : (classOrInterfaceType '.')? annotation* identifier typeArguments?
    public visitClassType(ctx: JP.ClassTypeContext): UAST.Type {
        const classOrInterfaceTypeCtx = ctx.classOrInterfaceType();
        let scopeType: UAST.ScopedType;
        if (classOrInterfaceTypeCtx) {
            scopeType = this.visit(classOrInterfaceTypeCtx) as UAST.ScopedType;
        }
        return UAST.scopedType(this.visit(ctx.identifier()) as UAST.Identifier, scopeType);
    }

    //creator
    //     : nonWildcardTypeArguments createdName classCreatorRest
    //     | createdName (arrayCreatorRest | classCreatorRest)
    public visitCreator(ctx: JP.CreatorContext): UAST.Expression {
        let ids;
        const primitiveTypeCtx = ctx.createdName().primitiveType();
        if (primitiveTypeCtx) {
            ids = (this.visit(primitiveTypeCtx) as UAST.PrimitiveType).id.name;
        } else {
            ids = ctx.createdName().identifier().map(id => toText(id));
            ids = ids.join('.');
        }
        const callee = convertToMemberAccess(ids);

        const arrayCreatorRest = ctx.arrayCreatorRest();
        const classCreatorRestCtx = ctx.classCreatorRest();
        if (classCreatorRestCtx) {
            const argumentsCtx = classCreatorRestCtx.arguments();
            const classBodyCtx = classCreatorRestCtx.classBody();
            let args = [];
            const exprListCtx = argumentsCtx.expressionList();
            if (exprListCtx) {
                args = this.visit(exprListCtx) as UAST.Expression[]
            }
            if (!classBodyCtx) {
                return UAST.newExpression(callee, args);
            } else {
                //new anonymous interface implementation
                // e.g. new Runnable() {...}
                const seq = UAST.sequence([]);
                const seqList = seq.expressions;
                const tmpVarDecl = createTmpVariableDeclaration(UAST.newExpression(callee, args));
                seqList.push(tmpVarDecl);
                const body = this.visit(classBodyCtx) as UAST.Instruction[];
                for (const decl of body) {
                    // TODO block?
                    if (decl.type === 'FunctionDefinition' || decl.type === 'VariableDeclaration') {
                        seqList.push(UAST.assignmentExpression(UAST.memberAccess(tmpVarDecl.id, decl.id), decl, '='));
                    }
                }
                seqList.push(tmpVarDecl.id);
                // const cdef = UAST.classDefinition(UAST.identifier(ids), body, []);
                // return UAST.newExpression(cdef, args);
                return seq;
            }
        } else {
            // array init
            // e.g. int[] a = new int(){1,2,3,4,5}
            const init = arrayCreatorRest.arrayInitializer()
            if (init) {
                return this.visit(init) as UAST.Expression;
            } else {
                return UAST.newExpression(callee, [])
            }
        }
    }

    // createdName
    //     : identifier typeArgumentsOrDiamond? ('.' identifier typeArgumentsOrDiamond?)*
    //     | primitiveType
    //     ;
    public visitCreatedName(ctx: JP.CreatedNameContext): UAST.Node {
        return UAST.noop();
    }

    // innerCreator
    //     : identifier nonWildcardTypeArgumentsOrDiamond? classCreatorRest
    //     ;
    public visitInnerCreator(ctx: JP.InnerCreatorContext): UAST.Node {
        return UAST.noop();
    }

    // arrayCreatorRest
    //     : '[' (']' ('[' ']')* arrayInitializer | expression ']' ('[' expression ']')* ('[' ']')*)
    //     ;
    public visitArrayCreatorRest(ctx: JP.ArrayCreatorRestContext): UAST.Node {
        return UAST.noop();
    }

    // classCreatorRest
    //     : arguments classBody?
    //     ;
    public visitClassCreatorRest(ctx: JP.ClassCreatorRestContext): UAST.Node {
        return UAST.noop();
    }

    // explicitGenericInvocation
    //     : nonWildcardTypeArguments explicitGenericInvocationSuffix
    //     ;
    public visitExplicitGenericInvocation(ctx: JP.ExplicitGenericInvocationContext): UAST.Node {
        return UAST.noop();
    }

    // typeArgumentsOrDiamond java7
    //     : '<' '>'
    //     | typeArguments
    //     ;
    //unused typeArgumentsOrDiamond
    public visitTypeArgumentsOrDiamond(ctx: JP.TypeArgumentsOrDiamondContext): UAST.Node {
        return UAST.noop();
    }

    // nonWildcardTypeArgumentsOrDiamond java17
    //     : '<' '>'
    //     | nonWildcardTypeArguments
    //     ;
    //unused nonWildcardTypeArgumentsOrDiamond
    public visitNonWildcardTypeArgumentsOrDiamond(ctx: JP.NonWildcardTypeArgumentsOrDiamondContext): UAST.Node {
        return UAST.noop();
    }

    // nonWildcardTypeArguments java8
    //     : '<' typeList '>'
    //     ;
    //unused nonWildcardTypeArguments
    public visitNonWildcardTypeArguments(ctx: JP.NonWildcardTypeArgumentsContext): UAST.Node {
        return UAST.noop();
    }

    // typeArguments java7
    //     : '<' typeArgument (',' typeArgument)* '>'
    // ;
    //unused typeArguments
    public visitTypeArguments(ctx: JP.TypeArgumentsContext): UAST.Node {
        return UAST.noop();
    }

    // typeArgument java7
    //     : typeType
    //     | annotation* '?' ((EXTENDS | SUPER) typeType)?
    //     ;
    //unused typeArgument
    public visitTypeArgument(ctx: JP.TypeArgumentContext): UAST.Node {
        return UAST.noop();
    }

    //arrayInitializer
    //     : '{' (variableInitializer (',' variableInitializer)* (',')? )? '}'
    public visitArrayInitializer(ctx: JP.ArrayInitializerContext): UAST.Instruction {
        const exprs = ctx.variableInitializer().map(v => this.visit(v) as UAST.Expression);
        const props = exprs.map((e, i) => {
            return UAST.objectProperty(UAST.literal(i, 'number'), e);
        })

        return UAST.objectExpression(props, null);
    }

    //variableInitializer
    //     : arrayInitializer
    //     | expression
    public visitVariableInitializer(ctx: JP.VariableInitializerContext): UAST.Expression {
        return this.visit(ctx.children[0]) as UAST.Expression;
    }

    //methodCall
    //     : identifier '(' expressionList? ')'
    //     | THIS '(' expressionList? ')'
    //     | SUPER '(' expressionList? ')'
    public visitMethodCall(ctx: JP.MethodCallContext): UAST.Expression {
        let callee;
        let args: UAST.Expression[] = [];
        const expressionList = ctx.expressionList();
        if (expressionList) {
            args = this.visit(expressionList) as UAST.Expression[];
        }
        const identifier = ctx.identifier();
        if (identifier) {
            callee = this.visit(identifier) as UAST.Expression;
        } else if (ctx.THIS()) {
            callee = UAST.thisExpression();
        } else {
            callee = UAST.superExpression();
        }
        return UAST.callExpression(callee, args);
    }

    //expressionList
    //     : expression (',' expression)*
    public visitExpressionList(ctx: JP.ExpressionListContext): UAST.Expression[] {
        return ctx.expression().map(e => this.visit(e) as UAST.Expression);
    }

    // Java17
    // switchExpression
    //     : SWITCH parExpression '{' switchLabeledRule* '}'
    public visitSwitchExpression(ctx: JP.SwitchExpressionContext): UAST.Instruction {
        const discriminant = this.visit(ctx.parExpression()) as UAST.Expression;
        const cases = ctx.switchLabeledRule().map(switchLabeledRuleCtx => {
            // switchLabeledRule
            //     : CASE (expressionList | NULL_LITERAL | guardedPattern) (ARROW | COLON) switchRuleOutcome
            //     | DEFAULT (ARROW | COLON) switchRuleOutcome
            const body = this.visit(switchLabeledRuleCtx.switchRuleOutcome()) as UAST.Instruction;
            if (switchLabeledRuleCtx.DEFAULT()) {
                return UAST.caseClause(null, buildIIFE([], UAST.functionDefinition(null, [], UAST.dynamicType(), body, [])));
            } else {
                const exprListCtx = switchLabeledRuleCtx.expressionList();
                if (exprListCtx) {
                    let test;
                    const exprList = this.visit(exprListCtx) as UAST.Expression[];
                    if (exprList.length === 1) {
                        test = exprList[0];
                    } else {
                        test = UAST.sequence(exprList);
                    }
                    return UAST.caseClause(test, body);
                }
                const guardedPatternCtx = switchLabeledRuleCtx.guardedPattern();
                if (guardedPatternCtx) {
                    const res = this._visitGuardedPatternContext(guardedPatternCtx, discriminant);
                    return UAST.caseClause(res.test, buildIIFE(res.callParams, UAST.functionDefinition(null, res.params, UAST.dynamicType(), body, [])));
                }
                // NULL CASE
                return UAST.caseClause(UAST.literal(null, 'null'), body);
            }
        });

        return UAST.switchStatement(discriminant, cases);
    }

    // switchLabeledRule
    //     : CASE (expressionList | NULL_LITERAL | guardedPattern) (ARROW | COLON) switchRuleOutcome
    //     | DEFAULT (ARROW | COLON) switchRuleOutcome
    //     ;
    public visitSwitchLabeledRule(ctx: JP.SwitchLabeledRuleContext): UAST.Node {
        return UAST.noop();
    }


    //explicitGenericInvocationSuffix
    //     : SUPER superSuffix
    //     | identifier arguments
    //     ;
    @addLoc
    private _visitExplicitGenericInvocationSuffix(ctx: JP.ExplicitGenericInvocationSuffixContext): {
        object,
        expression,
        args
    } {
        if (ctx.SUPER()) {
            const { expression, args } = this._visitSuperSuffix(ctx.superSuffix());
            return {
                object: UAST.superExpression(),
                expression,
                args
            }
        } else {
            return {
                object: null,
                expression: this.visit(ctx.identifier()) as UAST.Identifier,
                args: this.visit(ctx.arguments().expressionList()) || [],
            }
        }
    }

    // explicitGenericInvocationSuffix
    //     : SUPER superSuffix
    //     | identifier arguments
    //     ;
    public visitExplicitGenericInvocationSuffix(ctx: JP.ExplicitGenericInvocationSuffixContext): UAST.Node {
        return UAST.noop();
    }

    // arguments
    //     : '(' expressionList? ')'
    //     ;
    public visitArguments(ctx: JP.ArgumentsContext): UAST.Node {
        return UAST.noop();
    }


    //superSuffix
    //     : arguments
    //     | '.' typeArguments? identifier arguments?
    //     ;
    @addLoc
    private _visitSuperSuffix(ctx: JP.SuperSuffixContext): { expression, args } {
        const idCtx = ctx.identifier();
        if (idCtx) {
            return {
                expression: this.visit(idCtx) as UAST.Identifier,
                args: this.visit(ctx.arguments()?.expressionList()) || [],
            }
        }

        return {
            expression: null,
            args: this.visit(ctx.arguments()?.expressionList()) || [],
        }
    }

    // superSuffix
    //     : arguments
    //     | '.' typeArguments? identifier arguments?
    //     ;
    public visitSuperSuffix(ctx: JP.SuperSuffixContext): UAST.Node {
        return UAST.noop();
    }


    //guardedPattern
    //     : '(' guardedPattern ')'
    //     | variableModifier* typeType annotation* identifier ('&&' expression)*
    //     | guardedPattern '&&' expression
    //TODO  _?
    @addLoc
    private _visitGuardedPatternContext(ctx: JP.GuardedPatternContext, discriminant: UAST.Expression): {
        test: UAST.Expression,
        callParams: UAST.Expression[],
        params: UAST.VariableDeclaration[]
    } {
        const typeCtx = ctx.typeType();
        const exprCtx = ctx.expression();
        if (typeCtx) {
            // switch discriminant
            //    case Type c && (c == test) -> expr
            // caseClause will convert to
            // test: (var c, (typeof discriminant === Type)&& c == test)) body: (func(c){return expr})(dicscriminant))
            const type = this.visit(typeCtx) as UAST.Type;
            const id = this.visit(ctx.identifier()) as UAST.Identifier;
            const seqBody: UAST.Instruction[] = [];
            const seq = UAST.sequence(seqBody);
            const varDecl = UAST.variableDeclaration(id, null, false, UAST.dynamicType());
            seqBody.push(varDecl);
            // typeof discriminant === Type
            let test = UAST.binaryExpression('==', UAST.unaryExpression('typeof', discriminant), typeToIdentifier(type));
            // subTest && subTest ...
            const exprCtx = ctx.expression();
            exprCtx.forEach(e => {
                const subTest = this.visit(e) as UAST.Expression;
                test = UAST.binaryExpression('&&', test, subTest);
            });
            seqBody.push(test);
            const params = [varDecl];
            const callParams = [id];
            return {
                test: seq,
                callParams,
                params
            }
        } else if (exprCtx && exprCtx.length > 0) {
            const res = this._visitGuardedPatternContext(ctx.guardedPattern(), discriminant);
            let test = res.test;
            const exprCtx = ctx.expression();
            exprCtx.forEach(e => {
                const subTest = this.visit(e) as UAST.Expression;
                test = UAST.binaryExpression('&&', test, subTest);
            });
            res.test = test;
            return res;
        } else {
            return this._visitGuardedPatternContext(ctx.guardedPattern(), discriminant);
        }
    }

    // guardedPattern
    //     : '(' guardedPattern ')'
    //     | variableModifier* typeType annotation* identifier ('&&' expression)*
    //     | guardedPattern '&&' expression
    //     ;
    public visitGuardedPattern(ctx: JP.GuardedPatternContext): UAST.Node {
        return UAST.noop();
    }


    //switchRuleOutcome
    //     : block
    //     | blockStatement*
    public visitSwitchRuleOutcome(ctx: JP.SwitchRuleOutcomeContext): UAST.Instruction {
        const blockCtx = ctx.block();
        if (blockCtx) return this.visit(blockCtx) as UAST.Instruction;
        const blockStatementCtx = ctx.blockStatement();
        const body = blockStatementCtx.map(b => this.visit(b) as UAST.Instruction);
        return UAST.scopedStatement(body, null);
    }

    //typeTypeOrVoid
    //     : typeType
    //     | VOID
    public visitTypeTypeOrVoid(ctx: JP.TypeTypeOrVoidContext): UAST.Type {
        if (ctx.VOID()) {
            return UAST.primitiveType(UAST.identifier('Void'));
        }
        return this.visit(ctx.typeType()) as UAST.Type;
    }

    //    primary
    //     : '(' expression ')'
    //     | THIS
    //     | SUPER
    //     | literal
    //     | identifier
    //     | typeTypeOrVoid '.' CLASS
    //     | nonWildcardTypeArguments (explicitGenericInvocationSuffix | THIS arguments)
    public visitPrimary(ctx: JP.PrimaryContext): UAST.Expression {
        const expr = ctx.expression();
        if (expr) {
            return this.visit(expr) as UAST.Expression;
        }
        if (ctx.THIS()) {
            return UAST.thisExpression();
        }
        if (ctx.SUPER()) {
            return UAST.superExpression();
        }
        const lit = ctx.literal();
        if (lit) return this.visit(lit) as UAST.Expression;
        const identifier = ctx.identifier();
        if (identifier) return this.visit(identifier) as UAST.Expression;
        const typeTypeCtx = ctx.typeTypeOrVoid();
        if (typeTypeCtx) {
            const typeType = this.visit(typeTypeCtx) as UAST.Type;
            return UAST.memberAccess(convertToMemberAccess(('id' in typeType && typeType.id.name) || ('name' in typeType && typeType.name)), UAST.identifier('class'), false);
        }
        throw new Error(`Primary type: ${toText(ctx)} not supported`);
    }

    //literal
    //     : integerLiteral
    //     | floatLiteral
    //     | CHAR_LITERAL
    //     | STRING_LITERAL
    //     | BOOL_LITERAL
    //     | NULL_LITERAL
    //     | TEXT_BLOCK // Java17
    public visitLiteral(ctx: JP.LiteralContext): UAST.Literal {
        let lit = toText(ctx.children[0]);
        let litType;
        if (ctx.integerLiteral() || ctx.floatLiteral()) {
            litType = 'number';
        } else if (ctx.CHAR_LITERAL() || ctx.STRING_LITERAL() || ctx.TEXT_BLOCK()) {
            litType = 'string';
            lit = lit.slice(1, -1);
        } else if (ctx.BOOL_LITERAL()) {
            litType = 'boolean';
        } else { // NULL_LITERAL
            litType = 'null';
        }
        return UAST.literal(lit, litType);
    }

    // floatLiteral
    //     : FLOAT_LITERAL
    //     | HEX_FLOAT_LITERAL
    // ;
    public visitFloatLiteral(ctx: JP.FloatLiteralContext): UAST.Node {
        return UAST.literal(toText(ctx), 'number');
    }

    // integerLiteral
    //     : DECIMAL_LITERAL
    //     | HEX_LITERAL
    //     | OCT_LITERAL
    //     | BINARY_LITERAL
    // ;
    public visitIntegerLiteral(ctx: JP.IntegerLiteralContext): UAST.Node {
        return UAST.literal(toText(ctx), 'number');
    }

    //parExpression
    //     : '(' expression ')'
    public visitParExpression(ctx: ParExpressionContext): UAST.Instruction {
        return this.visit(ctx.expression()) as UAST.Instruction;
    }

    //typeType
    //     : annotation* (classOrInterfaceType | primitiveType) (annotation* '[' ']')*
    //     ;
    public visitTypeType(ctx: JP.TypeTypeContext): UAST.Type {
        let typeResult;
        const primitiveType = ctx.primitiveType();
        if (primitiveType) {
            typeResult = this.visit(primitiveType) as UAST.Type;
        }
        const classOrInterfaceType = ctx.classOrInterfaceType();
        if (classOrInterfaceType) {
            typeResult = this.visit(classOrInterfaceType) as UAST.Type;
        }

        if (!typeResult) {
          throw new Error('Unexpected TypeType');
        }

        if (ctx.children?.length === 3 && ctx.children[1].text === '[' && ctx.children[2].text === ']') {
            typeResult = UAST.arrayType(typeResult.id, typeResult)
        }
        return typeResult
    }

    //primitiveType
    //     : BOOLEAN
    //     | CHAR
    //     | BYTE
    //     | SHORT
    //     | INT
    //     | LONG
    //     | FLOAT
    //     | DOUBLE
    //     ;
    visitPrimitiveType(ctx: JP.PrimitiveTypeContext): UAST.Type {
        return UAST.primitiveType(UAST.identifier(toText(ctx)));
    }

    //classOrInterfaceType
    //     : (identifier typeArguments? '.')* typeIdentifier typeArguments?
    //     ;
    visitClassOrInterfaceType(ctx: JP.ClassOrInterfaceTypeContext): UAST.Type {
        const packageList = ctx.identifier();
        let qualifiedName = '';
        packageList.forEach(n => qualifiedName += toText(n) + '.');
        const typeNameId = toText(ctx.typeIdentifier());
        qualifiedName += typeNameId;
        return UAST.scopedType(UAST.identifier(qualifiedName), null);
    }


    // typeIdentifier  // Identifiers that are not restricted for type declarations java7
    //     : IDENTIFIER
    //     | MODULE
    //     | OPEN
    //     | REQUIRES
    //     | EXPORTS
    //     | OPENS
    //     | TO
    //     | USES
    //     | PROVIDES
    //     | WITH
    //     | TRANSITIVE
    //     | SEALED
    //     | PERMITS
    //     | RECORD
    //     ;
    public visitTypeIdentifier(ctx: JP.TypeIdentifierContext): UAST.Node {
        return UAST.noop();
    }

    // identifier java7
    //     : IDENTIFIER
    //     | MODULE
    //     | OPEN
    //     | REQUIRES
    //     | EXPORTS
    //     | OPENS
    //     | TO
    //     | USES
    //     | PROVIDES
    //     | WITH
    //     | TRANSITIVE
    //     | YIELD
    //     | SEALED
    //     | PERMITS
    //     | RECORD
    //     | VAR
    //     ;
    public visitIdentifier(ctx: JP.IdentifierContext): UAST.Identifier {
        return UAST.identifier(toText(ctx));
    }

    // constDeclaration java7
    //     : typeType constantDeclarator (',' constantDeclarator)* ';'
    //     ;
    public visitConstDeclaration(ctx: JP.ConstDeclarationContext): UAST.VariableDeclaration | UAST.VariableDeclaration[] {
        const results: UAST.VariableDeclaration[] = [];
        const type = this.visit(ctx.typeType()) as UAST.Type;
        ctx.constantDeclarator().forEach(c => {
            const initCtx = c.variableInitializer();
            let init: UAST.Expression;
            if (initCtx) {
                init = this.visit(initCtx) as UAST.Expression;
            }
            const id = this.visitIdentifier(c.identifier());
            results.push(UAST.variableDeclaration(id, init, null, type));
        });

        return results;
    }

    // constantDeclarator java7
    //     : identifier ('[' ']')* '=' variableInitializer
    //     ;
    public visitConstantDeclarator(ctx: JP.ConstantDeclaratorContext): UAST.Node {
        return UAST.noop();
    }

    // interfaceMethodDeclaration java7
    //     : interfaceMethodModifier* interfaceCommonBodyDeclaration
    //     ;
    public visitInterfaceMethodDeclaration(ctx: JP.InterfaceMethodDeclarationContext): UAST.FunctionDefinition {
        const commonBody = ctx.interfaceCommonBodyDeclaration();
        return this.visit(commonBody) as UAST.FunctionDefinition;
    }


    // interfaceMethodModifier java8
    //     : annotation
    //     | PUBLIC
    //     | ABSTRACT
    //     | DEFAULT
    //     | STATIC
    //     | STRICTFP
    //     ;
    //unused interfaceMethodModifier
    public visitInterfaceMethodModifier(ctx: JP.InterfaceMethodModifierContext): UAST.Node {
        return UAST.noop();
    }

    // genericInterfaceMethodDeclaration java8
    //     : interfaceMethodModifier* typeParameters interfaceCommonBodyDeclaration
    //     ;
    public visitGenericInterfaceMethodDeclaration(ctx: JP.GenericInterfaceMethodDeclarationContext): UAST.FunctionDefinition {
        const commonBody = ctx.interfaceCommonBodyDeclaration();
        return this.visit(commonBody) as UAST.FunctionDefinition;
    }

    // interfaceCommonBodyDeclaration java7
    //     : annotation* typeTypeOrVoid identifier formalParameters ('[' ']')* (THROWS qualifiedNameList)? methodBody
    //     ;
    public visitInterfaceCommonBodyDeclaration(ctx: JP.InterfaceCommonBodyDeclarationContext): UAST.FunctionDefinition {
        const typeOrVoidCtx = ctx.typeTypeOrVoid();
        const typeCtx = typeOrVoidCtx.typeType();
        let type;
        if (typeCtx) {
            type = this.visit(typeCtx) as UAST.Type;
        } else {
            type = UAST.primitiveType(UAST.identifier('void'));
        }
        const id = this.visit(ctx.identifier()) as UAST.Identifier;
        const params = this.visit(ctx.formalParameters()) as UAST.VariableDeclaration[]
        const blockCtx = ctx.methodBody().block();
        let body;
        const modifiers = [];
        if (blockCtx) {
            body = this.visit(blockCtx) as UAST.Instruction;
        } else {
            body = UAST.noop();
            modifiers.push('abstract');
        }
        return UAST.functionDefinition(id, params, type, body, modifiers);
    }

    //receiverParameter java8
    //     : typeType (identifier '.')* THIS
    //     ;
    //unused receiverParameter
    public visitReceiverParameter(ctx: JP.ReceiverParameterContext): UAST.Node {
        return UAST.noop();
    }

    // elementValueArrayInitializer java8
    //     : '{' (elementValue (',' elementValue)*)? (',')? '}'
    //     ;
    public visitElementValueArrayInitializer(ctx: JP.ElementValueArrayInitializerContext): UAST.Node {
        const exprs = ctx.elementValue();
        const props = exprs.map((e, i) => {
            return UAST.objectProperty(UAST.literal(i, 'number'), this.visit(e) as UAST.Expression);
        })

        return UAST.objectExpression(props, null);
    }

    // interfaceMemberDeclaration java7
    //     : constDeclaration
    //     | interfaceMethodDeclaration
    //     | genericInterfaceMethodDeclaration
    //     | interfaceDeclaration
    //     | annotationTypeDeclaration
    //     | classDeclaration
    //     | enumDeclaration
    //     | recordDeclaration // Java17
    // ;
    public visitInterfaceMemberDeclaration(ctx: JP.InterfaceMemberDeclarationContext): UAST.Instruction | UAST.Instruction[] {
        return this.visit(ctx.children[0]) as UAST.Instruction;
    }

    // localTypeDeclaration java7
    //     : classOrInterfaceModifier*
    //         (classDeclaration | interfaceDeclaration | recordDeclaration)
    //     ;
    public visitLocalTypeDeclaration(ctx: JP.LocalTypeDeclarationContext): UAST.Instruction {
        const children = ctx.children;
        const typeDecl = children.pop();

        if (typeDecl instanceof TerminalNode) {
            return UAST.noop();
        }

        const classDefinition = this.visit(typeDecl) as UAST.ClassDefinition;
        ctx.classOrInterfaceModifier().forEach(m => {
            const annotationCtx = m.annotation();
            if (annotationCtx) {
                const meta = classDefinition._meta;
                meta.annotations = meta.annotations || [];
                const annotations: UAST.Instruction[] = meta.annotations as UAST.Instruction[];
                annotations.push(this.visit(annotationCtx) as UAST.Instruction);
            } else {
                const meta = classDefinition._meta;
                meta.modifiers = meta.modifiers ?? [];
                const modifiers = meta.modifiers as string[];
                const modifierName = toText(m);
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                meta['is' + getUpperCase(modifierName)] = true;
                modifiers.push(modifierName);
            }
        });
        const isPublic = children.find(child => toText(child) === 'public');
        if (isPublic) {
            return UAST.exportStatement(classDefinition, classDefinition.id);
        } else {
            return classDefinition;
        }
    }

    //moduleDeclaration java9
    //     : OPEN? MODULE qualifiedName moduleBody
    //     ;
    //unused moduleDeclaration
    public visitModuleDeclaration(ctx: JP.ModuleDeclarationContext): UAST.Instruction {
        return UAST.noop();
    }

    //moduleBody java9
    //     : '{' moduleDirective* '}'
    //     ;
    //unused moduleBody
    public visitModuleBody(ctx: JP.ModuleBodyContext): UAST.Node {
        return UAST.noop();
    }

    // moduleDirective java9
    //     : REQUIRES requiresModifier* qualifiedName ';'
    //     | EXPORTS qualifiedName (TO qualifiedName)? ';'
    //     | OPENS qualifiedName (TO qualifiedName)? ';'
    //     | USES qualifiedName ';'
    //     | PROVIDES qualifiedName WITH qualifiedName ';'
    //     ;
    //unused moduleDirective
    public visitModuleDirective(ctx: JP.ModuleDirectiveContext): UAST.Node {
        return UAST.noop();
    }

    // requiresModifier java9
    //     : TRANSITIVE
    //     | STATIC
    //     ;
    //unused requiresModifier
    public visitRequiresModifier(ctx: JP.RequiresModifierContext): UAST.Node {
        return UAST.noop();
    }

    // qualifiedNameList java7
    //     : qualifiedName (',' qualifiedName)*
    //     ;
    //unused qualifiedNameList
    public visitQualifiedNameList(ctx: JP.QualifiedNameListContext): UAST.Node {
        return UAST.noop();
    }

    private safeVisit(ctx: ParserRuleContext): any {
        if (!ctx) return undefined;
        return this.visit(ctx)
    }

    private completeLocInfo(node: any, upperLoc?) {
        if (!node) return;

        if (Array.isArray(node)) {
            return node.map(n => this.completeLocInfo(n, upperLoc));
        }

        if (!node.type) return;
        const hasLoc = node.loc && node.loc.start && node.loc.end && node.loc.sourcefile;
        const loc = { start: { line: 1, column: 1 }, end: { line: 1, column: 1 }, sourcefile: this.sourcefile };
        let startLine = Number.MAX_SAFE_INTEGER;
        let startColumn = Number.MAX_SAFE_INTEGER;
        let endLine = 1;
        let endColumn = 1;
        for (const prop in node) {
            const locs = this.completeLocInfo(node[prop], hasLoc ? node.loc : upperLoc);
            if (!hasLoc) {

                if (!locs) continue;
                if (Array.isArray(locs)) {
                    locs.forEach(loc => {
                        if (loc) {
                            startLine = Math.min(startLine, loc.start.line);
                            startColumn = Math.min(startColumn, loc.start.column);
                            endLine = Math.max(endLine, loc.end.line);
                            endColumn = Math.max(endColumn, loc.end.column);
                        }
                    });
                } else {
                    const loc = locs;
                    startLine = Math.min(startLine, loc.start.line);
                    startColumn = Math.min(startColumn, loc.start.column);
                    endLine = Math.max(endLine, loc.end.line);
                    endColumn = Math.max(endColumn, loc.end.column);
                }

            }
        }
        if (startLine === Number.MAX_SAFE_INTEGER && startColumn === Number.MAX_SAFE_INTEGER
            && endLine === 1 && endColumn === 1) {
            startLine = upperLoc?.start?.line ?? 1;
            startColumn = upperLoc?.start?.column ?? 1;
            endLine = upperLoc?.end?.line ?? 1;
            endColumn = upperLoc?.end?.column ?? 1;
        }
        loc.start.line = startLine;
        loc.start.column = startColumn;
        loc.end.line = endLine;
        loc.end.column = endColumn;
        if (!hasLoc) node.loc = loc;
        return node.loc;
    }
}

// convert qualified name to MemberAccess
// e.g. 'com.java.A' will be converted to MemberAccess{object: 'com.java', property: 'A'}
function convertToMemberAccess(qualifiedName: string): UAST.Expression {
    const ids = qualifiedName.split('.');
    const packageName = ids.filter(id => id.charAt(0) === id.charAt(0).toLowerCase()).join('.')
    const classNames = ids.filter(id => id.charAt(0) === id.charAt(0).toUpperCase());
    if (packageName !== '') {
        classNames.unshift(packageName);
    }
    let node: UAST.Expression;
    classNames.forEach(id => {
        if (!node) {
            node = UAST.identifier(id);
        } else {
            node = UAST.memberAccess(node, UAST.identifier(id), false);
        }
    });
    return node;
}

//Immediately Invoked Function Expression
function buildIIFE(params, fdef) {
    return UAST.callExpression(fdef, params);
}

function toTypeof(type: UAST.Type): UAST.UnaryExpression {
    return UAST.unaryExpression('typeof', typeToIdentifier(type));
}

function typeToIdentifier(type: UAST.Type): UAST.Identifier {
    if (type.type === "ScopedType") {
        if (type.scope) {
            return UAST.identifier(typeToIdentifier(type.scope).name + type.id.name);
        }
    }
    return UAST.identifier(('id' in type && type.id.name) || ('name' in type && type.name));
}

function toText(ctx: ParserRuleContext | ParseTree | Token): string {
    const text = ctx.text
    if (text === undefined) {
        throw new Error('Assertion error: text should never be undefiend')
    }

    return text
}

function addLoc(target, name, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = function (...args) {
        const node = oldValue.apply(this, args);
        const ctx = args[0];
        if (ctx instanceof ParserRuleContext && node && !Array.isArray(node) && !node.loc) {
            // @ts-ignore
            node.loc = {
                // @ts-ignore
                start: { line: ctx._start.line, column: ctx._start._charPositionInLine + 1 },
                // @ts-ignore
                end: { line: ctx._stop.line, column: ctx._stop._charPositionInLine + 1 },
                sourcefile: this.sourcefile
            };
        }
        return node;
    }
    return descriptor;
}


function getUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
