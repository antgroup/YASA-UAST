// Generated from antlr/Java.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
 * This interface defines a complete listener for a parse tree produced by
 * `JavaParser`.
 */
export interface JavaListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `JavaParser.compilationUnit`.
	 * @param ctx the parse tree
	 */
	enterCompilationUnit?: (ctx: CompilationUnitContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.compilationUnit`.
	 * @param ctx the parse tree
	 */
	exitCompilationUnit?: (ctx: CompilationUnitContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.packageDeclaration`.
	 * @param ctx the parse tree
	 */
	enterPackageDeclaration?: (ctx: PackageDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.packageDeclaration`.
	 * @param ctx the parse tree
	 */
	exitPackageDeclaration?: (ctx: PackageDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.importDeclaration`.
	 * @param ctx the parse tree
	 */
	enterImportDeclaration?: (ctx: ImportDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.importDeclaration`.
	 * @param ctx the parse tree
	 */
	exitImportDeclaration?: (ctx: ImportDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.typeDeclaration`.
	 * @param ctx the parse tree
	 */
	enterTypeDeclaration?: (ctx: TypeDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.typeDeclaration`.
	 * @param ctx the parse tree
	 */
	exitTypeDeclaration?: (ctx: TypeDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.modifier`.
	 * @param ctx the parse tree
	 */
	enterModifier?: (ctx: ModifierContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.modifier`.
	 * @param ctx the parse tree
	 */
	exitModifier?: (ctx: ModifierContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.classOrInterfaceModifier`.
	 * @param ctx the parse tree
	 */
	enterClassOrInterfaceModifier?: (ctx: ClassOrInterfaceModifierContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.classOrInterfaceModifier`.
	 * @param ctx the parse tree
	 */
	exitClassOrInterfaceModifier?: (ctx: ClassOrInterfaceModifierContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.variableModifier`.
	 * @param ctx the parse tree
	 */
	enterVariableModifier?: (ctx: VariableModifierContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.variableModifier`.
	 * @param ctx the parse tree
	 */
	exitVariableModifier?: (ctx: VariableModifierContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.classDeclaration`.
	 * @param ctx the parse tree
	 */
	enterClassDeclaration?: (ctx: ClassDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.classDeclaration`.
	 * @param ctx the parse tree
	 */
	exitClassDeclaration?: (ctx: ClassDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.typeParameters`.
	 * @param ctx the parse tree
	 */
	enterTypeParameters?: (ctx: TypeParametersContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.typeParameters`.
	 * @param ctx the parse tree
	 */
	exitTypeParameters?: (ctx: TypeParametersContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.typeParameter`.
	 * @param ctx the parse tree
	 */
	enterTypeParameter?: (ctx: TypeParameterContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.typeParameter`.
	 * @param ctx the parse tree
	 */
	exitTypeParameter?: (ctx: TypeParameterContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.typeBound`.
	 * @param ctx the parse tree
	 */
	enterTypeBound?: (ctx: TypeBoundContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.typeBound`.
	 * @param ctx the parse tree
	 */
	exitTypeBound?: (ctx: TypeBoundContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.enumDeclaration`.
	 * @param ctx the parse tree
	 */
	enterEnumDeclaration?: (ctx: EnumDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.enumDeclaration`.
	 * @param ctx the parse tree
	 */
	exitEnumDeclaration?: (ctx: EnumDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.enumConstants`.
	 * @param ctx the parse tree
	 */
	enterEnumConstants?: (ctx: EnumConstantsContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.enumConstants`.
	 * @param ctx the parse tree
	 */
	exitEnumConstants?: (ctx: EnumConstantsContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.enumConstant`.
	 * @param ctx the parse tree
	 */
	enterEnumConstant?: (ctx: EnumConstantContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.enumConstant`.
	 * @param ctx the parse tree
	 */
	exitEnumConstant?: (ctx: EnumConstantContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.enumBodyDeclarations`.
	 * @param ctx the parse tree
	 */
	enterEnumBodyDeclarations?: (ctx: EnumBodyDeclarationsContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.enumBodyDeclarations`.
	 * @param ctx the parse tree
	 */
	exitEnumBodyDeclarations?: (ctx: EnumBodyDeclarationsContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.interfaceDeclaration`.
	 * @param ctx the parse tree
	 */
	enterInterfaceDeclaration?: (ctx: InterfaceDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.interfaceDeclaration`.
	 * @param ctx the parse tree
	 */
	exitInterfaceDeclaration?: (ctx: InterfaceDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.classBody`.
	 * @param ctx the parse tree
	 */
	enterClassBody?: (ctx: ClassBodyContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.classBody`.
	 * @param ctx the parse tree
	 */
	exitClassBody?: (ctx: ClassBodyContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.interfaceBody`.
	 * @param ctx the parse tree
	 */
	enterInterfaceBody?: (ctx: InterfaceBodyContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.interfaceBody`.
	 * @param ctx the parse tree
	 */
	exitInterfaceBody?: (ctx: InterfaceBodyContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.classBodyDeclaration`.
	 * @param ctx the parse tree
	 */
	enterClassBodyDeclaration?: (ctx: ClassBodyDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.classBodyDeclaration`.
	 * @param ctx the parse tree
	 */
	exitClassBodyDeclaration?: (ctx: ClassBodyDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.memberDeclaration`.
	 * @param ctx the parse tree
	 */
	enterMemberDeclaration?: (ctx: MemberDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.memberDeclaration`.
	 * @param ctx the parse tree
	 */
	exitMemberDeclaration?: (ctx: MemberDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.methodDeclaration`.
	 * @param ctx the parse tree
	 */
	enterMethodDeclaration?: (ctx: MethodDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.methodDeclaration`.
	 * @param ctx the parse tree
	 */
	exitMethodDeclaration?: (ctx: MethodDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.methodBody`.
	 * @param ctx the parse tree
	 */
	enterMethodBody?: (ctx: MethodBodyContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.methodBody`.
	 * @param ctx the parse tree
	 */
	exitMethodBody?: (ctx: MethodBodyContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.typeTypeOrVoid`.
	 * @param ctx the parse tree
	 */
	enterTypeTypeOrVoid?: (ctx: TypeTypeOrVoidContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.typeTypeOrVoid`.
	 * @param ctx the parse tree
	 */
	exitTypeTypeOrVoid?: (ctx: TypeTypeOrVoidContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.genericMethodDeclaration`.
	 * @param ctx the parse tree
	 */
	enterGenericMethodDeclaration?: (ctx: GenericMethodDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.genericMethodDeclaration`.
	 * @param ctx the parse tree
	 */
	exitGenericMethodDeclaration?: (ctx: GenericMethodDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.genericConstructorDeclaration`.
	 * @param ctx the parse tree
	 */
	enterGenericConstructorDeclaration?: (ctx: GenericConstructorDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.genericConstructorDeclaration`.
	 * @param ctx the parse tree
	 */
	exitGenericConstructorDeclaration?: (ctx: GenericConstructorDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.constructorDeclaration`.
	 * @param ctx the parse tree
	 */
	enterConstructorDeclaration?: (ctx: ConstructorDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.constructorDeclaration`.
	 * @param ctx the parse tree
	 */
	exitConstructorDeclaration?: (ctx: ConstructorDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.compactConstructorDeclaration`.
	 * @param ctx the parse tree
	 */
	enterCompactConstructorDeclaration?: (ctx: CompactConstructorDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.compactConstructorDeclaration`.
	 * @param ctx the parse tree
	 */
	exitCompactConstructorDeclaration?: (ctx: CompactConstructorDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.fieldDeclaration`.
	 * @param ctx the parse tree
	 */
	enterFieldDeclaration?: (ctx: FieldDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.fieldDeclaration`.
	 * @param ctx the parse tree
	 */
	exitFieldDeclaration?: (ctx: FieldDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.interfaceBodyDeclaration`.
	 * @param ctx the parse tree
	 */
	enterInterfaceBodyDeclaration?: (ctx: InterfaceBodyDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.interfaceBodyDeclaration`.
	 * @param ctx the parse tree
	 */
	exitInterfaceBodyDeclaration?: (ctx: InterfaceBodyDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.interfaceMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	enterInterfaceMemberDeclaration?: (ctx: InterfaceMemberDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.interfaceMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	exitInterfaceMemberDeclaration?: (ctx: InterfaceMemberDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.constDeclaration`.
	 * @param ctx the parse tree
	 */
	enterConstDeclaration?: (ctx: ConstDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.constDeclaration`.
	 * @param ctx the parse tree
	 */
	exitConstDeclaration?: (ctx: ConstDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.constantDeclarator`.
	 * @param ctx the parse tree
	 */
	enterConstantDeclarator?: (ctx: ConstantDeclaratorContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.constantDeclarator`.
	 * @param ctx the parse tree
	 */
	exitConstantDeclarator?: (ctx: ConstantDeclaratorContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.interfaceMethodDeclaration`.
	 * @param ctx the parse tree
	 */
	enterInterfaceMethodDeclaration?: (ctx: InterfaceMethodDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.interfaceMethodDeclaration`.
	 * @param ctx the parse tree
	 */
	exitInterfaceMethodDeclaration?: (ctx: InterfaceMethodDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.interfaceMethodModifier`.
	 * @param ctx the parse tree
	 */
	enterInterfaceMethodModifier?: (ctx: InterfaceMethodModifierContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.interfaceMethodModifier`.
	 * @param ctx the parse tree
	 */
	exitInterfaceMethodModifier?: (ctx: InterfaceMethodModifierContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.genericInterfaceMethodDeclaration`.
	 * @param ctx the parse tree
	 */
	enterGenericInterfaceMethodDeclaration?: (ctx: GenericInterfaceMethodDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.genericInterfaceMethodDeclaration`.
	 * @param ctx the parse tree
	 */
	exitGenericInterfaceMethodDeclaration?: (ctx: GenericInterfaceMethodDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.interfaceCommonBodyDeclaration`.
	 * @param ctx the parse tree
	 */
	enterInterfaceCommonBodyDeclaration?: (ctx: InterfaceCommonBodyDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.interfaceCommonBodyDeclaration`.
	 * @param ctx the parse tree
	 */
	exitInterfaceCommonBodyDeclaration?: (ctx: InterfaceCommonBodyDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.variableDeclarators`.
	 * @param ctx the parse tree
	 */
	enterVariableDeclarators?: (ctx: VariableDeclaratorsContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.variableDeclarators`.
	 * @param ctx the parse tree
	 */
	exitVariableDeclarators?: (ctx: VariableDeclaratorsContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.variableDeclarator`.
	 * @param ctx the parse tree
	 */
	enterVariableDeclarator?: (ctx: VariableDeclaratorContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.variableDeclarator`.
	 * @param ctx the parse tree
	 */
	exitVariableDeclarator?: (ctx: VariableDeclaratorContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.variableDeclaratorId`.
	 * @param ctx the parse tree
	 */
	enterVariableDeclaratorId?: (ctx: VariableDeclaratorIdContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.variableDeclaratorId`.
	 * @param ctx the parse tree
	 */
	exitVariableDeclaratorId?: (ctx: VariableDeclaratorIdContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.variableInitializer`.
	 * @param ctx the parse tree
	 */
	enterVariableInitializer?: (ctx: VariableInitializerContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.variableInitializer`.
	 * @param ctx the parse tree
	 */
	exitVariableInitializer?: (ctx: VariableInitializerContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.arrayInitializer`.
	 * @param ctx the parse tree
	 */
	enterArrayInitializer?: (ctx: ArrayInitializerContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.arrayInitializer`.
	 * @param ctx the parse tree
	 */
	exitArrayInitializer?: (ctx: ArrayInitializerContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.classOrInterfaceType`.
	 * @param ctx the parse tree
	 */
	enterClassOrInterfaceType?: (ctx: ClassOrInterfaceTypeContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.classOrInterfaceType`.
	 * @param ctx the parse tree
	 */
	exitClassOrInterfaceType?: (ctx: ClassOrInterfaceTypeContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.typeArgument`.
	 * @param ctx the parse tree
	 */
	enterTypeArgument?: (ctx: TypeArgumentContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.typeArgument`.
	 * @param ctx the parse tree
	 */
	exitTypeArgument?: (ctx: TypeArgumentContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.qualifiedNameList`.
	 * @param ctx the parse tree
	 */
	enterQualifiedNameList?: (ctx: QualifiedNameListContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.qualifiedNameList`.
	 * @param ctx the parse tree
	 */
	exitQualifiedNameList?: (ctx: QualifiedNameListContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.formalParameters`.
	 * @param ctx the parse tree
	 */
	enterFormalParameters?: (ctx: FormalParametersContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.formalParameters`.
	 * @param ctx the parse tree
	 */
	exitFormalParameters?: (ctx: FormalParametersContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.receiverParameter`.
	 * @param ctx the parse tree
	 */
	enterReceiverParameter?: (ctx: ReceiverParameterContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.receiverParameter`.
	 * @param ctx the parse tree
	 */
	exitReceiverParameter?: (ctx: ReceiverParameterContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.formalParameterList`.
	 * @param ctx the parse tree
	 */
	enterFormalParameterList?: (ctx: FormalParameterListContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.formalParameterList`.
	 * @param ctx the parse tree
	 */
	exitFormalParameterList?: (ctx: FormalParameterListContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.formalParameter`.
	 * @param ctx the parse tree
	 */
	enterFormalParameter?: (ctx: FormalParameterContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.formalParameter`.
	 * @param ctx the parse tree
	 */
	exitFormalParameter?: (ctx: FormalParameterContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.lastFormalParameter`.
	 * @param ctx the parse tree
	 */
	enterLastFormalParameter?: (ctx: LastFormalParameterContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.lastFormalParameter`.
	 * @param ctx the parse tree
	 */
	exitLastFormalParameter?: (ctx: LastFormalParameterContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.lambdaLVTIList`.
	 * @param ctx the parse tree
	 */
	enterLambdaLVTIList?: (ctx: LambdaLVTIListContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.lambdaLVTIList`.
	 * @param ctx the parse tree
	 */
	exitLambdaLVTIList?: (ctx: LambdaLVTIListContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.lambdaLVTIParameter`.
	 * @param ctx the parse tree
	 */
	enterLambdaLVTIParameter?: (ctx: LambdaLVTIParameterContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.lambdaLVTIParameter`.
	 * @param ctx the parse tree
	 */
	exitLambdaLVTIParameter?: (ctx: LambdaLVTIParameterContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.qualifiedName`.
	 * @param ctx the parse tree
	 */
	enterQualifiedName?: (ctx: QualifiedNameContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.qualifiedName`.
	 * @param ctx the parse tree
	 */
	exitQualifiedName?: (ctx: QualifiedNameContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.literal`.
	 * @param ctx the parse tree
	 */
	enterLiteral?: (ctx: LiteralContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.literal`.
	 * @param ctx the parse tree
	 */
	exitLiteral?: (ctx: LiteralContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.integerLiteral`.
	 * @param ctx the parse tree
	 */
	enterIntegerLiteral?: (ctx: IntegerLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.integerLiteral`.
	 * @param ctx the parse tree
	 */
	exitIntegerLiteral?: (ctx: IntegerLiteralContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.floatLiteral`.
	 * @param ctx the parse tree
	 */
	enterFloatLiteral?: (ctx: FloatLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.floatLiteral`.
	 * @param ctx the parse tree
	 */
	exitFloatLiteral?: (ctx: FloatLiteralContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.altAnnotationQualifiedName`.
	 * @param ctx the parse tree
	 */
	enterAltAnnotationQualifiedName?: (ctx: AltAnnotationQualifiedNameContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.altAnnotationQualifiedName`.
	 * @param ctx the parse tree
	 */
	exitAltAnnotationQualifiedName?: (ctx: AltAnnotationQualifiedNameContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.annotation`.
	 * @param ctx the parse tree
	 */
	enterAnnotation?: (ctx: AnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.annotation`.
	 * @param ctx the parse tree
	 */
	exitAnnotation?: (ctx: AnnotationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.elementValuePairs`.
	 * @param ctx the parse tree
	 */
	enterElementValuePairs?: (ctx: ElementValuePairsContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.elementValuePairs`.
	 * @param ctx the parse tree
	 */
	exitElementValuePairs?: (ctx: ElementValuePairsContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.elementValuePair`.
	 * @param ctx the parse tree
	 */
	enterElementValuePair?: (ctx: ElementValuePairContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.elementValuePair`.
	 * @param ctx the parse tree
	 */
	exitElementValuePair?: (ctx: ElementValuePairContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.elementValue`.
	 * @param ctx the parse tree
	 */
	enterElementValue?: (ctx: ElementValueContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.elementValue`.
	 * @param ctx the parse tree
	 */
	exitElementValue?: (ctx: ElementValueContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.elementValueArrayInitializer`.
	 * @param ctx the parse tree
	 */
	enterElementValueArrayInitializer?: (ctx: ElementValueArrayInitializerContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.elementValueArrayInitializer`.
	 * @param ctx the parse tree
	 */
	exitElementValueArrayInitializer?: (ctx: ElementValueArrayInitializerContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.annotationTypeDeclaration`.
	 * @param ctx the parse tree
	 */
	enterAnnotationTypeDeclaration?: (ctx: AnnotationTypeDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.annotationTypeDeclaration`.
	 * @param ctx the parse tree
	 */
	exitAnnotationTypeDeclaration?: (ctx: AnnotationTypeDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.annotationTypeBody`.
	 * @param ctx the parse tree
	 */
	enterAnnotationTypeBody?: (ctx: AnnotationTypeBodyContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.annotationTypeBody`.
	 * @param ctx the parse tree
	 */
	exitAnnotationTypeBody?: (ctx: AnnotationTypeBodyContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.annotationTypeElementDeclaration`.
	 * @param ctx the parse tree
	 */
	enterAnnotationTypeElementDeclaration?: (ctx: AnnotationTypeElementDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.annotationTypeElementDeclaration`.
	 * @param ctx the parse tree
	 */
	exitAnnotationTypeElementDeclaration?: (ctx: AnnotationTypeElementDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.annotationTypeElementRest`.
	 * @param ctx the parse tree
	 */
	enterAnnotationTypeElementRest?: (ctx: AnnotationTypeElementRestContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.annotationTypeElementRest`.
	 * @param ctx the parse tree
	 */
	exitAnnotationTypeElementRest?: (ctx: AnnotationTypeElementRestContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.annotationMethodOrConstantRest`.
	 * @param ctx the parse tree
	 */
	enterAnnotationMethodOrConstantRest?: (ctx: AnnotationMethodOrConstantRestContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.annotationMethodOrConstantRest`.
	 * @param ctx the parse tree
	 */
	exitAnnotationMethodOrConstantRest?: (ctx: AnnotationMethodOrConstantRestContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.annotationMethodRest`.
	 * @param ctx the parse tree
	 */
	enterAnnotationMethodRest?: (ctx: AnnotationMethodRestContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.annotationMethodRest`.
	 * @param ctx the parse tree
	 */
	exitAnnotationMethodRest?: (ctx: AnnotationMethodRestContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.annotationConstantRest`.
	 * @param ctx the parse tree
	 */
	enterAnnotationConstantRest?: (ctx: AnnotationConstantRestContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.annotationConstantRest`.
	 * @param ctx the parse tree
	 */
	exitAnnotationConstantRest?: (ctx: AnnotationConstantRestContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.defaultValue`.
	 * @param ctx the parse tree
	 */
	enterDefaultValue?: (ctx: DefaultValueContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.defaultValue`.
	 * @param ctx the parse tree
	 */
	exitDefaultValue?: (ctx: DefaultValueContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.moduleDeclaration`.
	 * @param ctx the parse tree
	 */
	enterModuleDeclaration?: (ctx: ModuleDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.moduleDeclaration`.
	 * @param ctx the parse tree
	 */
	exitModuleDeclaration?: (ctx: ModuleDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.moduleBody`.
	 * @param ctx the parse tree
	 */
	enterModuleBody?: (ctx: ModuleBodyContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.moduleBody`.
	 * @param ctx the parse tree
	 */
	exitModuleBody?: (ctx: ModuleBodyContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.moduleDirective`.
	 * @param ctx the parse tree
	 */
	enterModuleDirective?: (ctx: ModuleDirectiveContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.moduleDirective`.
	 * @param ctx the parse tree
	 */
	exitModuleDirective?: (ctx: ModuleDirectiveContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.requiresModifier`.
	 * @param ctx the parse tree
	 */
	enterRequiresModifier?: (ctx: RequiresModifierContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.requiresModifier`.
	 * @param ctx the parse tree
	 */
	exitRequiresModifier?: (ctx: RequiresModifierContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.recordDeclaration`.
	 * @param ctx the parse tree
	 */
	enterRecordDeclaration?: (ctx: RecordDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.recordDeclaration`.
	 * @param ctx the parse tree
	 */
	exitRecordDeclaration?: (ctx: RecordDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.recordHeader`.
	 * @param ctx the parse tree
	 */
	enterRecordHeader?: (ctx: RecordHeaderContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.recordHeader`.
	 * @param ctx the parse tree
	 */
	exitRecordHeader?: (ctx: RecordHeaderContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.recordComponentList`.
	 * @param ctx the parse tree
	 */
	enterRecordComponentList?: (ctx: RecordComponentListContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.recordComponentList`.
	 * @param ctx the parse tree
	 */
	exitRecordComponentList?: (ctx: RecordComponentListContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.recordComponent`.
	 * @param ctx the parse tree
	 */
	enterRecordComponent?: (ctx: RecordComponentContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.recordComponent`.
	 * @param ctx the parse tree
	 */
	exitRecordComponent?: (ctx: RecordComponentContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.recordBody`.
	 * @param ctx the parse tree
	 */
	enterRecordBody?: (ctx: RecordBodyContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.recordBody`.
	 * @param ctx the parse tree
	 */
	exitRecordBody?: (ctx: RecordBodyContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.block`.
	 * @param ctx the parse tree
	 */
	enterBlock?: (ctx: BlockContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.block`.
	 * @param ctx the parse tree
	 */
	exitBlock?: (ctx: BlockContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.blockStatement`.
	 * @param ctx the parse tree
	 */
	enterBlockStatement?: (ctx: BlockStatementContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.blockStatement`.
	 * @param ctx the parse tree
	 */
	exitBlockStatement?: (ctx: BlockStatementContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.localVariableDeclaration`.
	 * @param ctx the parse tree
	 */
	enterLocalVariableDeclaration?: (ctx: LocalVariableDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.localVariableDeclaration`.
	 * @param ctx the parse tree
	 */
	exitLocalVariableDeclaration?: (ctx: LocalVariableDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.identifier`.
	 * @param ctx the parse tree
	 */
	enterIdentifier?: (ctx: IdentifierContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.identifier`.
	 * @param ctx the parse tree
	 */
	exitIdentifier?: (ctx: IdentifierContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.typeIdentifier`.
	 * @param ctx the parse tree
	 */
	enterTypeIdentifier?: (ctx: TypeIdentifierContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.typeIdentifier`.
	 * @param ctx the parse tree
	 */
	exitTypeIdentifier?: (ctx: TypeIdentifierContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.localTypeDeclaration`.
	 * @param ctx the parse tree
	 */
	enterLocalTypeDeclaration?: (ctx: LocalTypeDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.localTypeDeclaration`.
	 * @param ctx the parse tree
	 */
	exitLocalTypeDeclaration?: (ctx: LocalTypeDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.statement`.
	 * @param ctx the parse tree
	 */
	enterStatement?: (ctx: StatementContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.statement`.
	 * @param ctx the parse tree
	 */
	exitStatement?: (ctx: StatementContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.catchClause`.
	 * @param ctx the parse tree
	 */
	enterCatchClause?: (ctx: CatchClauseContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.catchClause`.
	 * @param ctx the parse tree
	 */
	exitCatchClause?: (ctx: CatchClauseContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.catchType`.
	 * @param ctx the parse tree
	 */
	enterCatchType?: (ctx: CatchTypeContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.catchType`.
	 * @param ctx the parse tree
	 */
	exitCatchType?: (ctx: CatchTypeContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.finallyBlock`.
	 * @param ctx the parse tree
	 */
	enterFinallyBlock?: (ctx: FinallyBlockContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.finallyBlock`.
	 * @param ctx the parse tree
	 */
	exitFinallyBlock?: (ctx: FinallyBlockContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.resourceSpecification`.
	 * @param ctx the parse tree
	 */
	enterResourceSpecification?: (ctx: ResourceSpecificationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.resourceSpecification`.
	 * @param ctx the parse tree
	 */
	exitResourceSpecification?: (ctx: ResourceSpecificationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.resources`.
	 * @param ctx the parse tree
	 */
	enterResources?: (ctx: ResourcesContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.resources`.
	 * @param ctx the parse tree
	 */
	exitResources?: (ctx: ResourcesContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.resource`.
	 * @param ctx the parse tree
	 */
	enterResource?: (ctx: ResourceContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.resource`.
	 * @param ctx the parse tree
	 */
	exitResource?: (ctx: ResourceContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.switchBlockStatementGroup`.
	 * @param ctx the parse tree
	 */
	enterSwitchBlockStatementGroup?: (ctx: SwitchBlockStatementGroupContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.switchBlockStatementGroup`.
	 * @param ctx the parse tree
	 */
	exitSwitchBlockStatementGroup?: (ctx: SwitchBlockStatementGroupContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.switchLabel`.
	 * @param ctx the parse tree
	 */
	enterSwitchLabel?: (ctx: SwitchLabelContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.switchLabel`.
	 * @param ctx the parse tree
	 */
	exitSwitchLabel?: (ctx: SwitchLabelContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.forControl`.
	 * @param ctx the parse tree
	 */
	enterForControl?: (ctx: ForControlContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.forControl`.
	 * @param ctx the parse tree
	 */
	exitForControl?: (ctx: ForControlContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.forInit`.
	 * @param ctx the parse tree
	 */
	enterForInit?: (ctx: ForInitContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.forInit`.
	 * @param ctx the parse tree
	 */
	exitForInit?: (ctx: ForInitContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.enhancedForControl`.
	 * @param ctx the parse tree
	 */
	enterEnhancedForControl?: (ctx: EnhancedForControlContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.enhancedForControl`.
	 * @param ctx the parse tree
	 */
	exitEnhancedForControl?: (ctx: EnhancedForControlContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.parExpression`.
	 * @param ctx the parse tree
	 */
	enterParExpression?: (ctx: ParExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.parExpression`.
	 * @param ctx the parse tree
	 */
	exitParExpression?: (ctx: ParExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.expressionList`.
	 * @param ctx the parse tree
	 */
	enterExpressionList?: (ctx: ExpressionListContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.expressionList`.
	 * @param ctx the parse tree
	 */
	exitExpressionList?: (ctx: ExpressionListContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.methodCall`.
	 * @param ctx the parse tree
	 */
	enterMethodCall?: (ctx: MethodCallContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.methodCall`.
	 * @param ctx the parse tree
	 */
	exitMethodCall?: (ctx: MethodCallContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.pattern`.
	 * @param ctx the parse tree
	 */
	enterPattern?: (ctx: PatternContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.pattern`.
	 * @param ctx the parse tree
	 */
	exitPattern?: (ctx: PatternContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.lambdaExpression`.
	 * @param ctx the parse tree
	 */
	enterLambdaExpression?: (ctx: LambdaExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.lambdaExpression`.
	 * @param ctx the parse tree
	 */
	exitLambdaExpression?: (ctx: LambdaExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.lambdaParameters`.
	 * @param ctx the parse tree
	 */
	enterLambdaParameters?: (ctx: LambdaParametersContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.lambdaParameters`.
	 * @param ctx the parse tree
	 */
	exitLambdaParameters?: (ctx: LambdaParametersContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.lambdaBody`.
	 * @param ctx the parse tree
	 */
	enterLambdaBody?: (ctx: LambdaBodyContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.lambdaBody`.
	 * @param ctx the parse tree
	 */
	exitLambdaBody?: (ctx: LambdaBodyContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.primary`.
	 * @param ctx the parse tree
	 */
	enterPrimary?: (ctx: PrimaryContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.primary`.
	 * @param ctx the parse tree
	 */
	exitPrimary?: (ctx: PrimaryContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.switchExpression`.
	 * @param ctx the parse tree
	 */
	enterSwitchExpression?: (ctx: SwitchExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.switchExpression`.
	 * @param ctx the parse tree
	 */
	exitSwitchExpression?: (ctx: SwitchExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.switchLabeledRule`.
	 * @param ctx the parse tree
	 */
	enterSwitchLabeledRule?: (ctx: SwitchLabeledRuleContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.switchLabeledRule`.
	 * @param ctx the parse tree
	 */
	exitSwitchLabeledRule?: (ctx: SwitchLabeledRuleContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.guardedPattern`.
	 * @param ctx the parse tree
	 */
	enterGuardedPattern?: (ctx: GuardedPatternContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.guardedPattern`.
	 * @param ctx the parse tree
	 */
	exitGuardedPattern?: (ctx: GuardedPatternContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.switchRuleOutcome`.
	 * @param ctx the parse tree
	 */
	enterSwitchRuleOutcome?: (ctx: SwitchRuleOutcomeContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.switchRuleOutcome`.
	 * @param ctx the parse tree
	 */
	exitSwitchRuleOutcome?: (ctx: SwitchRuleOutcomeContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.classType`.
	 * @param ctx the parse tree
	 */
	enterClassType?: (ctx: ClassTypeContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.classType`.
	 * @param ctx the parse tree
	 */
	exitClassType?: (ctx: ClassTypeContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.creator`.
	 * @param ctx the parse tree
	 */
	enterCreator?: (ctx: CreatorContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.creator`.
	 * @param ctx the parse tree
	 */
	exitCreator?: (ctx: CreatorContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.createdName`.
	 * @param ctx the parse tree
	 */
	enterCreatedName?: (ctx: CreatedNameContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.createdName`.
	 * @param ctx the parse tree
	 */
	exitCreatedName?: (ctx: CreatedNameContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.innerCreator`.
	 * @param ctx the parse tree
	 */
	enterInnerCreator?: (ctx: InnerCreatorContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.innerCreator`.
	 * @param ctx the parse tree
	 */
	exitInnerCreator?: (ctx: InnerCreatorContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.arrayCreatorRest`.
	 * @param ctx the parse tree
	 */
	enterArrayCreatorRest?: (ctx: ArrayCreatorRestContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.arrayCreatorRest`.
	 * @param ctx the parse tree
	 */
	exitArrayCreatorRest?: (ctx: ArrayCreatorRestContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.classCreatorRest`.
	 * @param ctx the parse tree
	 */
	enterClassCreatorRest?: (ctx: ClassCreatorRestContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.classCreatorRest`.
	 * @param ctx the parse tree
	 */
	exitClassCreatorRest?: (ctx: ClassCreatorRestContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.explicitGenericInvocation`.
	 * @param ctx the parse tree
	 */
	enterExplicitGenericInvocation?: (ctx: ExplicitGenericInvocationContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.explicitGenericInvocation`.
	 * @param ctx the parse tree
	 */
	exitExplicitGenericInvocation?: (ctx: ExplicitGenericInvocationContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.typeArgumentsOrDiamond`.
	 * @param ctx the parse tree
	 */
	enterTypeArgumentsOrDiamond?: (ctx: TypeArgumentsOrDiamondContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.typeArgumentsOrDiamond`.
	 * @param ctx the parse tree
	 */
	exitTypeArgumentsOrDiamond?: (ctx: TypeArgumentsOrDiamondContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.nonWildcardTypeArgumentsOrDiamond`.
	 * @param ctx the parse tree
	 */
	enterNonWildcardTypeArgumentsOrDiamond?: (ctx: NonWildcardTypeArgumentsOrDiamondContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.nonWildcardTypeArgumentsOrDiamond`.
	 * @param ctx the parse tree
	 */
	exitNonWildcardTypeArgumentsOrDiamond?: (ctx: NonWildcardTypeArgumentsOrDiamondContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.nonWildcardTypeArguments`.
	 * @param ctx the parse tree
	 */
	enterNonWildcardTypeArguments?: (ctx: NonWildcardTypeArgumentsContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.nonWildcardTypeArguments`.
	 * @param ctx the parse tree
	 */
	exitNonWildcardTypeArguments?: (ctx: NonWildcardTypeArgumentsContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.typeList`.
	 * @param ctx the parse tree
	 */
	enterTypeList?: (ctx: TypeListContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.typeList`.
	 * @param ctx the parse tree
	 */
	exitTypeList?: (ctx: TypeListContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.typeType`.
	 * @param ctx the parse tree
	 */
	enterTypeType?: (ctx: TypeTypeContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.typeType`.
	 * @param ctx the parse tree
	 */
	exitTypeType?: (ctx: TypeTypeContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.primitiveType`.
	 * @param ctx the parse tree
	 */
	enterPrimitiveType?: (ctx: PrimitiveTypeContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.primitiveType`.
	 * @param ctx the parse tree
	 */
	exitPrimitiveType?: (ctx: PrimitiveTypeContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.typeArguments`.
	 * @param ctx the parse tree
	 */
	enterTypeArguments?: (ctx: TypeArgumentsContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.typeArguments`.
	 * @param ctx the parse tree
	 */
	exitTypeArguments?: (ctx: TypeArgumentsContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.superSuffix`.
	 * @param ctx the parse tree
	 */
	enterSuperSuffix?: (ctx: SuperSuffixContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.superSuffix`.
	 * @param ctx the parse tree
	 */
	exitSuperSuffix?: (ctx: SuperSuffixContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.explicitGenericInvocationSuffix`.
	 * @param ctx the parse tree
	 */
	enterExplicitGenericInvocationSuffix?: (ctx: ExplicitGenericInvocationSuffixContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.explicitGenericInvocationSuffix`.
	 * @param ctx the parse tree
	 */
	exitExplicitGenericInvocationSuffix?: (ctx: ExplicitGenericInvocationSuffixContext) => void;

	/**
	 * Enter a parse tree produced by `JavaParser.arguments`.
	 * @param ctx the parse tree
	 */
	enterArguments?: (ctx: ArgumentsContext) => void;
	/**
	 * Exit a parse tree produced by `JavaParser.arguments`.
	 * @param ctx the parse tree
	 */
	exitArguments?: (ctx: ArgumentsContext) => void;
}

