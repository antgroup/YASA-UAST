import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor'
import { ParseOptions } from './types'
import { ParseTree } from 'antlr4ts/tree/ParseTree'
import * as JP from './antlr/JavaParser'
import fs from 'fs'

import { JavaVisitor } from './antlr/JavaVisitor'
import * as UAST from '@ant-yasa/uast-spec';

const { literal: literalBuild, identifier: identifierBuild } = UAST;


abstract class ParseTreeVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    public visit(tree: ParseTree): Result {
        if (!tree) return null;
        // 创建一个文件写入流
        const logFileStream = fs.createWriteStream('AllInOne17_java.txt', { flags: 'a' , encoding: 'utf8'}); // 追加模式写入

        // 保存原始的 console.log 方法
        const originalLog = console.log;

        // 重写 console.log 方法
        console.log = function (...args: any[]) {
            // 将内容写入文件
            logFileStream.write(args.map(arg => String(arg)).join(' ') + '\n');


        };
        if (tree.constructor.name.replace('Context', '') !== "CompilationUnit"){

            console.log("Visiting tree:")
            console.log("tree type:",tree.constructor.name.replace('Context', '') )
            console.log("tree text: ", tree.text); // 打印子节点文本
            // @ts-ignore
            console.log("tree start line_charPosition:",tree._start?.line + "__" + tree._start?._charPositionInLine )
            // @ts-ignore
            console.log("tree stop line_charPosition:",tree._stop?.line + "__" + tree._stop?._charPositionInLine )

        }

        // 递归遍历子节点
        const node = super.visit(tree);
        for (let i = 0; i < tree.childCount; i++) {
            const child = tree.getChild(i);
            // 递归访问子节点
            this.visit(child);
        }

        return node;
    }
}

export class TestBuilder
    extends ParseTreeVisitor<UAST.Node | UAST.Node[]>
    implements JavaVisitor<UAST.Node | UAST.Node[]> {
    public result: UAST.CompileUnit | null = null
    private sourcefile: string
    private typesState: UAST.Type[] = []
    private qualifiedNamespaceState: string[] = [];

    constructor(public options: ParseOptions, sourcefile: string) {
        super();
        this.sourcefile = sourcefile;
    }

    defaultResult() {
        // throw new Error('Unknown node')
        return UAST.noop();
    }

    aggregateResult() {
        return UAST.noop();
    }

    visitAltAnnotationQualifiedName(ctx:JP.AltAnnotationQualifiedNameContext) {
        return UAST.noop();
    }

    visitAnnotation(ctx:JP.AnnotationContext) {
        return UAST.noop();
    }

    visitAnnotationConstantRest(ctx:JP.AnnotationConstantRestContext) {
        return UAST.noop();
    }

    visitAnnotationMethodOrConstantRest(ctx:JP.AnnotationMethodOrConstantRestContext) {
        return UAST.noop();
    }

    visitAnnotationMethodRest(ctx:JP.AnnotationMethodRestContext) {
        return UAST.noop();
    }

    visitAnnotationTypeBody(ctx:JP.AnnotationTypeBodyContext) {
        return UAST.noop();
    }

    visitAnnotationTypeDeclaration(ctx:JP.AnnotationTypeDeclarationContext) {
        return UAST.noop();
    }

    visitAnnotationTypeElementDeclaration(ctx:JP.AnnotationTypeElementDeclarationContext) {
        return UAST.noop();
    }

    visitAnnotationTypeElementRest(ctx:JP.AnnotationTypeElementRestContext) {
        return UAST.noop();
    }

    visitArguments(ctx:JP.ArgumentsContext) {
        return UAST.noop();
    }

    visitArrayCreatorRest(ctx:JP.ArrayCreatorRestContext) {
        return UAST.noop();
    }

    visitArrayInitializer(ctx:JP.ArrayInitializerContext) {
        return UAST.noop();
    }

    visitBlock(ctx:JP.BlockContext) {
        return UAST.noop();
    }

    visitBlockStatement(ctx:JP.BlockStatementContext) {
        return UAST.noop();
    }

    visitCatchClause(ctx:JP.CatchClauseContext) {
        return UAST.noop();
    }

    visitCatchType(ctx:JP.CatchTypeContext) {
        return UAST.noop();
    }

    visitClassBody(ctx:JP.ClassBodyContext) {
        return UAST.noop();
    }

    visitClassBodyDeclaration(ctx:JP.ClassBodyDeclarationContext) {
        return UAST.noop();
    }

    visitClassCreatorRest(ctx:JP.ClassCreatorRestContext) {
        return UAST.noop();
    }

    visitClassDeclaration(ctx:JP.ClassDeclarationContext) {
        return UAST.noop();
    }

    visitClassOrInterfaceModifier(ctx:JP.ClassOrInterfaceModifierContext) {
        return UAST.noop();
    }

    visitClassOrInterfaceType(ctx:JP.ClassOrInterfaceTypeContext) {
        return UAST.noop();
    }

    visitClassType(ctx:JP.ClassTypeContext) {
        return UAST.noop();
    }

    visitCompactConstructorDeclaration(ctx:JP.CompactConstructorDeclarationContext) {
        return UAST.noop();
    }

    visitCompilationUnit(ctx:JP.CompilationUnitContext) {
        return UAST.noop();
    }

    visitConstDeclaration(ctx:JP.ConstDeclarationContext) {
        return UAST.noop();
    }

    visitConstantDeclarator(ctx:JP.ConstantDeclaratorContext) {
        return UAST.noop();
    }

    visitConstructorDeclaration(ctx:JP.ConstructorDeclarationContext) {
        return UAST.noop();
    }

    visitCreatedName(ctx:JP.CreatedNameContext) {
        return UAST.noop();
    }

    visitCreator(ctx:JP.CreatorContext) {
        return UAST.noop();
    }

    visitDefaultValue(ctx:JP.DefaultValueContext) {
        return UAST.noop();
    }

    visitElementValue(ctx:JP.ElementValueContext) {
        return UAST.noop();
    }

    visitElementValueArrayInitializer(ctx:JP.ElementValueArrayInitializerContext) {
        return UAST.noop();
    }

    visitElementValuePair(ctx:JP.ElementValuePairContext) {
        return UAST.noop();
    }

    visitElementValuePairs(ctx:JP.ElementValuePairsContext) {
        return UAST.noop();
    }

    visitEnhancedForControl(ctx:JP.EnhancedForControlContext) {
        return UAST.noop();
    }

    visitEnumBodyDeclarations(ctx:JP.EnumBodyDeclarationsContext) {
        return UAST.noop();
    }

    visitEnumConstant(ctx:JP.EnumConstantContext) {
        return UAST.noop();
    }

    visitEnumConstants(ctx:JP.EnumConstantsContext) {
        return UAST.noop();
    }

    visitEnumDeclaration(ctx:JP.EnumDeclarationContext) {
        return UAST.noop();
    }

    visitExplicitGenericInvocation(ctx:JP.ExplicitGenericInvocationContext) {
        return UAST.noop();
    }

    visitExplicitGenericInvocationSuffix(ctx:JP.ExplicitGenericInvocationSuffixContext) {
        return UAST.noop();
    }

    visitExpression(ctx:JP.ExpressionContext) {
        return UAST.noop();
    }

    visitExpressionList(ctx:JP.ExpressionListContext) {
        return UAST.noop();
    }

    visitFieldDeclaration(ctx:JP.FieldDeclarationContext) {
        return UAST.noop();
    }

    visitFinallyBlock(ctx:JP.FinallyBlockContext) {
        return UAST.noop();
    }

    visitFloatLiteral(ctx:JP.FloatLiteralContext) {
        return UAST.noop();
    }

    visitForControl(ctx:JP.ForControlContext) {
        return UAST.noop();
    }

    visitForInit(ctx:JP.ForInitContext) {
        return UAST.noop();
    }

    visitFormalParameter(ctx:JP.FormalParameterContext) {
        return UAST.noop();
    }

    visitFormalParameterList(ctx:JP.FormalParameterListContext) {
        return UAST.noop();
    }

    visitFormalParameters(ctx:JP.FormalParametersContext) {
        return UAST.noop();
    }

    visitGenericConstructorDeclaration(ctx:JP.GenericConstructorDeclarationContext) {
        return UAST.noop();
    }

    visitGenericInterfaceMethodDeclaration(ctx:JP.GenericInterfaceMethodDeclarationContext) {
        return UAST.noop();
    }

    visitGenericMethodDeclaration(ctx:JP.GenericMethodDeclarationContext) {
        return UAST.noop();
    }

    visitGuardedPattern(ctx:JP.GuardedPatternContext) {
        return UAST.noop();
    }

    visitIdentifier(ctx:JP.IdentifierContext) {
        return UAST.noop();
    }

    visitImportDeclaration(ctx:JP.ImportDeclarationContext) {
        return UAST.noop();
    }

    visitInnerCreator(ctx:JP.InnerCreatorContext) {
        return UAST.noop();
    }

    visitIntegerLiteral(ctx:JP.IntegerLiteralContext) {
        return UAST.noop();
    }

    visitInterfaceBody(ctx:JP.InterfaceBodyContext) {
        return UAST.noop();
    }

    visitInterfaceBodyDeclaration(ctx:JP.InterfaceBodyDeclarationContext) {
        return UAST.noop();
    }

    visitInterfaceCommonBodyDeclaration(ctx:JP.InterfaceCommonBodyDeclarationContext) {
        return UAST.noop();
    }

    visitInterfaceDeclaration(ctx:JP.InterfaceDeclarationContext) {
        return UAST.noop();
    }

    visitInterfaceMemberDeclaration(ctx:JP.InterfaceMemberDeclarationContext) {
        return UAST.noop();
    }

    visitInterfaceMethodDeclaration(ctx:JP.InterfaceMethodDeclarationContext) {
        return UAST.noop();
    }

    visitInterfaceMethodModifier(ctx:JP.InterfaceMethodModifierContext) {
        return UAST.noop();
    }

    visitLambdaBody(ctx:JP.LambdaBodyContext) {
        return UAST.noop();
    }

    visitLambdaExpression(ctx:JP.LambdaExpressionContext) {
        return UAST.noop();
    }

    visitLambdaLVTIList(ctx:JP.LambdaLVTIListContext) {
        return UAST.noop();
    }

    visitLambdaLVTIParameter(ctx:JP.LambdaLVTIParameterContext) {
        return UAST.noop();
    }

    visitLambdaParameters(ctx:JP.LambdaParametersContext) {
        return UAST.noop();
    }

    visitLastFormalParameter(ctx:JP.LastFormalParameterContext) {
        return UAST.noop();
    }

    visitLiteral(ctx:JP.LiteralContext) {
        return UAST.noop();
    }

    visitLocalTypeDeclaration(ctx:JP.LocalTypeDeclarationContext) {
        return UAST.noop();
    }

    visitLocalVariableDeclaration(ctx:JP.LocalVariableDeclarationContext) {
        return UAST.noop();
    }

    visitMemberDeclaration(ctx:JP.MemberDeclarationContext) {
        return UAST.noop();
    }

    visitMethodBody(ctx:JP.MethodBodyContext) {
        return UAST.noop();
    }

    visitMethodCall(ctx:JP.MethodCallContext) {
        return UAST.noop();
    }

    visitMethodDeclaration(ctx:JP.MethodDeclarationContext) {
        return UAST.noop();
    }

    visitModifier(ctx:JP.ModifierContext) {
        return UAST.noop();
    }

    visitModuleBody(ctx:JP.ModuleBodyContext) {
        return UAST.noop();
    }

    visitModuleDeclaration(ctx:JP.ModuleDeclarationContext) {
        return UAST.noop();
    }

    visitModuleDirective(ctx:JP.ModuleDirectiveContext) {
        return UAST.noop();
    }

    visitNonWildcardTypeArguments(ctx:JP.NonWildcardTypeArgumentsContext) {
        return UAST.noop();
    }

    visitNonWildcardTypeArgumentsOrDiamond(ctx:JP.NonWildcardTypeArgumentsOrDiamondContext) {
        return UAST.noop();
    }

    visitPackageDeclaration(ctx:JP.PackageDeclarationContext) {
        return UAST.noop();
    }

    visitParExpression(ctx:JP.ParExpressionContext) {
        return UAST.noop();
    }

    visitPattern(ctx:JP.PatternContext) {
        return UAST.noop();
    }

    visitPrimary(ctx:JP.PrimaryContext) {
        return UAST.noop();
    }

    visitPrimitiveType(ctx:JP.PrimitiveTypeContext) {
        return UAST.noop();
    }

    visitQualifiedName(ctx:JP.QualifiedNameContext) {
        return UAST.noop();
    }

    visitQualifiedNameList(ctx:JP.QualifiedNameListContext) {
        return UAST.noop();
    }

    visitReceiverParameter(ctx:JP.ReceiverParameterContext) {
        return UAST.noop();
    }

    visitRecordBody(ctx:JP.RecordBodyContext) {
        return UAST.noop();
    }

    visitRecordComponent(ctx:JP.RecordComponentContext) {
        return UAST.noop();
    }

    visitRecordComponentList(ctx:JP.RecordComponentListContext) {
        return UAST.noop();
    }

    visitRecordDeclaration(ctx:JP.RecordDeclarationContext) {
        return UAST.noop();
    }

    visitRecordHeader(ctx:JP.RecordHeaderContext) {
        return UAST.noop();
    }

    visitRequiresModifier(ctx:JP.RequiresModifierContext) {
        return UAST.noop();
    }

    visitResource(ctx:JP.ResourceContext) {
        return UAST.noop();
    }

    visitResourceSpecification(ctx:JP.ResourceSpecificationContext) {
        return UAST.noop();
    }

    visitResources(ctx:JP.ResourcesContext) {
        return UAST.noop();
    }

    visitStatement(ctx:JP.StatementContext) {
        return UAST.noop();
    }

    visitSuperSuffix(ctx:JP.SuperSuffixContext) {
        return UAST.noop();
    }

    visitSwitchBlockStatementGroup(ctx:JP.SwitchBlockStatementGroupContext) {
        return UAST.noop();
    }

    visitSwitchExpression(ctx:JP.SwitchExpressionContext) {
        return UAST.noop();
    }

    visitSwitchLabel(ctx:JP.SwitchLabelContext) {
        return UAST.noop();
    }

    visitSwitchLabeledRule(ctx:JP.SwitchLabeledRuleContext) {
        return UAST.noop();
    }

    visitSwitchRuleOutcome(ctx:JP.SwitchRuleOutcomeContext) {
        return UAST.noop();
    }

    visitTypeArgument(ctx:JP.TypeArgumentContext) {
        return UAST.noop();
    }

    visitTypeArguments(ctx:JP.TypeArgumentsContext) {
        return UAST.noop();
    }

    visitTypeArgumentsOrDiamond(ctx:JP.TypeArgumentsOrDiamondContext) {
        return UAST.noop();
    }

    visitTypeBound(ctx:JP.TypeBoundContext) {
        return UAST.noop();
    }

    visitTypeDeclaration(ctx:JP.TypeDeclarationContext) {
        return UAST.noop();
    }

    visitTypeIdentifier(ctx:JP.TypeIdentifierContext) {
        return UAST.noop();
    }

    visitTypeList(ctx:JP.TypeListContext) {
        return UAST.noop();
    }

    visitTypeParameter(ctx:JP.TypeParameterContext) {
        return UAST.noop();
    }

    visitTypeParameters(ctx:JP.TypeParametersContext) {
        return UAST.noop();
    }

    visitTypeType(ctx:JP.TypeTypeContext) {
        return UAST.noop();
    }

    visitTypeTypeOrVoid(ctx:JP.TypeTypeOrVoidContext) {
        return UAST.noop();
    }

    visitVariableDeclarator(ctx:JP.VariableDeclaratorContext) {
        return UAST.noop();
    }

    visitVariableDeclaratorId(ctx:JP.VariableDeclaratorIdContext) {
        return UAST.noop();
    }

    visitVariableDeclarators(ctx:JP.VariableDeclaratorsContext) {
        return UAST.noop();
    }

    visitVariableInitializer(ctx:JP.VariableInitializerContext) {
        return UAST.noop();
    }

    visitVariableModifier(ctx:JP.VariableModifierContext) {
        return UAST.noop();
    }

}
