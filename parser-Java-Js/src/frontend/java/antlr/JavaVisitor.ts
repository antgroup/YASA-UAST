// Generated from antlr/Java.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { CompilationUnitContext } from "./JavaParser";
import { PackageDeclarationContext } from "./JavaParser";
import { ImportDeclarationContext } from "./JavaParser";
import { TypeDeclarationContext } from "./JavaParser";
import { ModifierContext } from "./JavaParser";
import { ClassOrInterfaceModifierContext } from "./JavaParser";
import { VariableModifierContext } from "./JavaParser";
import { ClassDeclarationContext } from "./JavaParser";
import { TypeParametersContext } from "./JavaParser";
import { TypeParameterContext } from "./JavaParser";
import { TypeBoundContext } from "./JavaParser";
import { EnumDeclarationContext } from "./JavaParser";
import { EnumConstantsContext } from "./JavaParser";
import { EnumConstantContext } from "./JavaParser";
import { EnumBodyDeclarationsContext } from "./JavaParser";
import { InterfaceDeclarationContext } from "./JavaParser";
import { ClassBodyContext } from "./JavaParser";
import { InterfaceBodyContext } from "./JavaParser";
import { ClassBodyDeclarationContext } from "./JavaParser";
import { MemberDeclarationContext } from "./JavaParser";
import { MethodDeclarationContext } from "./JavaParser";
import { MethodBodyContext } from "./JavaParser";
import { TypeTypeOrVoidContext } from "./JavaParser";
import { GenericMethodDeclarationContext } from "./JavaParser";
import { GenericConstructorDeclarationContext } from "./JavaParser";
import { ConstructorDeclarationContext } from "./JavaParser";
import { CompactConstructorDeclarationContext } from "./JavaParser";
import { FieldDeclarationContext } from "./JavaParser";
import { InterfaceBodyDeclarationContext } from "./JavaParser";
import { InterfaceMemberDeclarationContext } from "./JavaParser";
import { ConstDeclarationContext } from "./JavaParser";
import { ConstantDeclaratorContext } from "./JavaParser";
import { InterfaceMethodDeclarationContext } from "./JavaParser";
import { InterfaceMethodModifierContext } from "./JavaParser";
import { GenericInterfaceMethodDeclarationContext } from "./JavaParser";
import { InterfaceCommonBodyDeclarationContext } from "./JavaParser";
import { VariableDeclaratorsContext } from "./JavaParser";
import { VariableDeclaratorContext } from "./JavaParser";
import { VariableDeclaratorIdContext } from "./JavaParser";
import { VariableInitializerContext } from "./JavaParser";
import { ArrayInitializerContext } from "./JavaParser";
import { ClassOrInterfaceTypeContext } from "./JavaParser";
import { TypeArgumentContext } from "./JavaParser";
import { QualifiedNameListContext } from "./JavaParser";
import { FormalParametersContext } from "./JavaParser";
import { ReceiverParameterContext } from "./JavaParser";
import { FormalParameterListContext } from "./JavaParser";
import { FormalParameterContext } from "./JavaParser";
import { LastFormalParameterContext } from "./JavaParser";
import { LambdaLVTIListContext } from "./JavaParser";
import { LambdaLVTIParameterContext } from "./JavaParser";
import { QualifiedNameContext } from "./JavaParser";
import { LiteralContext } from "./JavaParser";
import { IntegerLiteralContext } from "./JavaParser";
import { FloatLiteralContext } from "./JavaParser";
import { AltAnnotationQualifiedNameContext } from "./JavaParser";
import { AnnotationContext } from "./JavaParser";
import { ElementValuePairsContext } from "./JavaParser";
import { ElementValuePairContext } from "./JavaParser";
import { ElementValueContext } from "./JavaParser";
import { ElementValueArrayInitializerContext } from "./JavaParser";
import { AnnotationTypeDeclarationContext } from "./JavaParser";
import { AnnotationTypeBodyContext } from "./JavaParser";
import { AnnotationTypeElementDeclarationContext } from "./JavaParser";
import { AnnotationTypeElementRestContext } from "./JavaParser";
import { AnnotationMethodOrConstantRestContext } from "./JavaParser";
import { AnnotationMethodRestContext } from "./JavaParser";
import { AnnotationConstantRestContext } from "./JavaParser";
import { DefaultValueContext } from "./JavaParser";
import { ModuleDeclarationContext } from "./JavaParser";
import { ModuleBodyContext } from "./JavaParser";
import { ModuleDirectiveContext } from "./JavaParser";
import { RequiresModifierContext } from "./JavaParser";
import { RecordDeclarationContext } from "./JavaParser";
import { RecordHeaderContext } from "./JavaParser";
import { RecordComponentListContext } from "./JavaParser";
import { RecordComponentContext } from "./JavaParser";
import { RecordBodyContext } from "./JavaParser";
import { BlockContext } from "./JavaParser";
import { BlockStatementContext } from "./JavaParser";
import { LocalVariableDeclarationContext } from "./JavaParser";
import { IdentifierContext } from "./JavaParser";
import { TypeIdentifierContext } from "./JavaParser";
import { LocalTypeDeclarationContext } from "./JavaParser";
import { StatementContext } from "./JavaParser";
import { CatchClauseContext } from "./JavaParser";
import { CatchTypeContext } from "./JavaParser";
import { FinallyBlockContext } from "./JavaParser";
import { ResourceSpecificationContext } from "./JavaParser";
import { ResourcesContext } from "./JavaParser";
import { ResourceContext } from "./JavaParser";
import { SwitchBlockStatementGroupContext } from "./JavaParser";
import { SwitchLabelContext } from "./JavaParser";
import { ForControlContext } from "./JavaParser";
import { ForInitContext } from "./JavaParser";
import { EnhancedForControlContext } from "./JavaParser";
import { ParExpressionContext } from "./JavaParser";
import { ExpressionListContext } from "./JavaParser";
import { MethodCallContext } from "./JavaParser";
import { ExpressionContext } from "./JavaParser";
import { PatternContext } from "./JavaParser";
import { LambdaExpressionContext } from "./JavaParser";
import { LambdaParametersContext } from "./JavaParser";
import { LambdaBodyContext } from "./JavaParser";
import { PrimaryContext } from "./JavaParser";
import { SwitchExpressionContext } from "./JavaParser";
import { SwitchLabeledRuleContext } from "./JavaParser";
import { GuardedPatternContext } from "./JavaParser";
import { SwitchRuleOutcomeContext } from "./JavaParser";
import { ClassTypeContext } from "./JavaParser";
import { CreatorContext } from "./JavaParser";
import { CreatedNameContext } from "./JavaParser";
import { InnerCreatorContext } from "./JavaParser";
import { ArrayCreatorRestContext } from "./JavaParser";
import { ClassCreatorRestContext } from "./JavaParser";
import { ExplicitGenericInvocationContext } from "./JavaParser";
import { TypeArgumentsOrDiamondContext } from "./JavaParser";
import { NonWildcardTypeArgumentsOrDiamondContext } from "./JavaParser";
import { NonWildcardTypeArgumentsContext } from "./JavaParser";
import { TypeListContext } from "./JavaParser";
import { TypeTypeContext } from "./JavaParser";
import { PrimitiveTypeContext } from "./JavaParser";
import { TypeArgumentsContext } from "./JavaParser";
import { SuperSuffixContext } from "./JavaParser";
import { ExplicitGenericInvocationSuffixContext } from "./JavaParser";
import { ArgumentsContext } from "./JavaParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `JavaParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface JavaVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `JavaParser.compilationUnit`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCompilationUnit?: (ctx: CompilationUnitContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.packageDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPackageDeclaration?: (ctx: PackageDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.importDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportDeclaration?: (ctx: ImportDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.typeDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeDeclaration?: (ctx: TypeDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.modifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitModifier?: (ctx: ModifierContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.classOrInterfaceModifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassOrInterfaceModifier?: (ctx: ClassOrInterfaceModifierContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.variableModifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableModifier?: (ctx: VariableModifierContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.classDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassDeclaration?: (ctx: ClassDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.typeParameters`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeParameters?: (ctx: TypeParametersContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.typeParameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeParameter?: (ctx: TypeParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.typeBound`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeBound?: (ctx: TypeBoundContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.enumDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumDeclaration?: (ctx: EnumDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.enumConstants`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumConstants?: (ctx: EnumConstantsContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.enumConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumConstant?: (ctx: EnumConstantContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.enumBodyDeclarations`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumBodyDeclarations?: (ctx: EnumBodyDeclarationsContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.interfaceDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceDeclaration?: (ctx: InterfaceDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.classBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassBody?: (ctx: ClassBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.interfaceBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceBody?: (ctx: InterfaceBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.classBodyDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassBodyDeclaration?: (ctx: ClassBodyDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.memberDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMemberDeclaration?: (ctx: MemberDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.methodDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMethodDeclaration?: (ctx: MethodDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.methodBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMethodBody?: (ctx: MethodBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.typeTypeOrVoid`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeTypeOrVoid?: (ctx: TypeTypeOrVoidContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.genericMethodDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGenericMethodDeclaration?: (ctx: GenericMethodDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.genericConstructorDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGenericConstructorDeclaration?: (ctx: GenericConstructorDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.constructorDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstructorDeclaration?: (ctx: ConstructorDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.compactConstructorDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCompactConstructorDeclaration?: (ctx: CompactConstructorDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.fieldDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFieldDeclaration?: (ctx: FieldDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.interfaceBodyDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceBodyDeclaration?: (ctx: InterfaceBodyDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.interfaceMemberDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceMemberDeclaration?: (ctx: InterfaceMemberDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.constDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstDeclaration?: (ctx: ConstDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.constantDeclarator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstantDeclarator?: (ctx: ConstantDeclaratorContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.interfaceMethodDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceMethodDeclaration?: (ctx: InterfaceMethodDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.interfaceMethodModifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceMethodModifier?: (ctx: InterfaceMethodModifierContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.genericInterfaceMethodDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGenericInterfaceMethodDeclaration?: (ctx: GenericInterfaceMethodDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.interfaceCommonBodyDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceCommonBodyDeclaration?: (ctx: InterfaceCommonBodyDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.variableDeclarators`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableDeclarators?: (ctx: VariableDeclaratorsContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.variableDeclarator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableDeclarator?: (ctx: VariableDeclaratorContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.variableDeclaratorId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableDeclaratorId?: (ctx: VariableDeclaratorIdContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.variableInitializer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableInitializer?: (ctx: VariableInitializerContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.arrayInitializer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayInitializer?: (ctx: ArrayInitializerContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.classOrInterfaceType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassOrInterfaceType?: (ctx: ClassOrInterfaceTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.typeArgument`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeArgument?: (ctx: TypeArgumentContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.qualifiedNameList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQualifiedNameList?: (ctx: QualifiedNameListContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.formalParameters`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFormalParameters?: (ctx: FormalParametersContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.receiverParameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReceiverParameter?: (ctx: ReceiverParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.formalParameterList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFormalParameterList?: (ctx: FormalParameterListContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.formalParameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFormalParameter?: (ctx: FormalParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.lastFormalParameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLastFormalParameter?: (ctx: LastFormalParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.lambdaLVTIList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLambdaLVTIList?: (ctx: LambdaLVTIListContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.lambdaLVTIParameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLambdaLVTIParameter?: (ctx: LambdaLVTIParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.qualifiedName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQualifiedName?: (ctx: QualifiedNameContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.literal`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLiteral?: (ctx: LiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.integerLiteral`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIntegerLiteral?: (ctx: IntegerLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.floatLiteral`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFloatLiteral?: (ctx: FloatLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.altAnnotationQualifiedName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAltAnnotationQualifiedName?: (ctx: AltAnnotationQualifiedNameContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.annotation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnnotation?: (ctx: AnnotationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.elementValuePairs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElementValuePairs?: (ctx: ElementValuePairsContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.elementValuePair`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElementValuePair?: (ctx: ElementValuePairContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.elementValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElementValue?: (ctx: ElementValueContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.elementValueArrayInitializer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElementValueArrayInitializer?: (ctx: ElementValueArrayInitializerContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.annotationTypeDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnnotationTypeDeclaration?: (ctx: AnnotationTypeDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.annotationTypeBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnnotationTypeBody?: (ctx: AnnotationTypeBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.annotationTypeElementDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnnotationTypeElementDeclaration?: (ctx: AnnotationTypeElementDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.annotationTypeElementRest`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnnotationTypeElementRest?: (ctx: AnnotationTypeElementRestContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.annotationMethodOrConstantRest`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnnotationMethodOrConstantRest?: (ctx: AnnotationMethodOrConstantRestContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.annotationMethodRest`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnnotationMethodRest?: (ctx: AnnotationMethodRestContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.annotationConstantRest`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnnotationConstantRest?: (ctx: AnnotationConstantRestContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.defaultValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDefaultValue?: (ctx: DefaultValueContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.moduleDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitModuleDeclaration?: (ctx: ModuleDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.moduleBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitModuleBody?: (ctx: ModuleBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.moduleDirective`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitModuleDirective?: (ctx: ModuleDirectiveContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.requiresModifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequiresModifier?: (ctx: RequiresModifierContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.recordDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordDeclaration?: (ctx: RecordDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.recordHeader`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordHeader?: (ctx: RecordHeaderContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.recordComponentList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordComponentList?: (ctx: RecordComponentListContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.recordComponent`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordComponent?: (ctx: RecordComponentContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.recordBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordBody?: (ctx: RecordBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.block`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlock?: (ctx: BlockContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.blockStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlockStatement?: (ctx: BlockStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.localVariableDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLocalVariableDeclaration?: (ctx: LocalVariableDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.identifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifier?: (ctx: IdentifierContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.typeIdentifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeIdentifier?: (ctx: TypeIdentifierContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.localTypeDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLocalTypeDeclaration?: (ctx: LocalTypeDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatement?: (ctx: StatementContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.catchClause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCatchClause?: (ctx: CatchClauseContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.catchType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCatchType?: (ctx: CatchTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.finallyBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFinallyBlock?: (ctx: FinallyBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.resourceSpecification`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitResourceSpecification?: (ctx: ResourceSpecificationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.resources`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitResources?: (ctx: ResourcesContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.resource`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitResource?: (ctx: ResourceContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.switchBlockStatementGroup`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSwitchBlockStatementGroup?: (ctx: SwitchBlockStatementGroupContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.switchLabel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSwitchLabel?: (ctx: SwitchLabelContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.forControl`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForControl?: (ctx: ForControlContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.forInit`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForInit?: (ctx: ForInitContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.enhancedForControl`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnhancedForControl?: (ctx: EnhancedForControlContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.parExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParExpression?: (ctx: ParExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.expressionList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpressionList?: (ctx: ExpressionListContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.methodCall`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMethodCall?: (ctx: MethodCallContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPattern?: (ctx: PatternContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.lambdaExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLambdaExpression?: (ctx: LambdaExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.lambdaParameters`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLambdaParameters?: (ctx: LambdaParametersContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.lambdaBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLambdaBody?: (ctx: LambdaBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.primary`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimary?: (ctx: PrimaryContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.switchExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSwitchExpression?: (ctx: SwitchExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.switchLabeledRule`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSwitchLabeledRule?: (ctx: SwitchLabeledRuleContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.guardedPattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGuardedPattern?: (ctx: GuardedPatternContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.switchRuleOutcome`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSwitchRuleOutcome?: (ctx: SwitchRuleOutcomeContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.classType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassType?: (ctx: ClassTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.creator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreator?: (ctx: CreatorContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.createdName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreatedName?: (ctx: CreatedNameContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.innerCreator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInnerCreator?: (ctx: InnerCreatorContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.arrayCreatorRest`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayCreatorRest?: (ctx: ArrayCreatorRestContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.classCreatorRest`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassCreatorRest?: (ctx: ClassCreatorRestContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.explicitGenericInvocation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExplicitGenericInvocation?: (ctx: ExplicitGenericInvocationContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.typeArgumentsOrDiamond`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeArgumentsOrDiamond?: (ctx: TypeArgumentsOrDiamondContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.nonWildcardTypeArgumentsOrDiamond`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNonWildcardTypeArgumentsOrDiamond?: (ctx: NonWildcardTypeArgumentsOrDiamondContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.nonWildcardTypeArguments`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNonWildcardTypeArguments?: (ctx: NonWildcardTypeArgumentsContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.typeList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeList?: (ctx: TypeListContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.typeType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeType?: (ctx: TypeTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.primitiveType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimitiveType?: (ctx: PrimitiveTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.typeArguments`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeArguments?: (ctx: TypeArgumentsContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.superSuffix`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSuperSuffix?: (ctx: SuperSuffixContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.explicitGenericInvocationSuffix`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExplicitGenericInvocationSuffix?: (ctx: ExplicitGenericInvocationSuffixContext) => Result;

	/**
	 * Visit a parse tree produced by `JavaParser.arguments`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArguments?: (ctx: ArgumentsContext) => Result;
}

