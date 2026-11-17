// Generated from antlr/Java.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { JavaListener } from "./JavaListener";
import { JavaVisitor } from "./JavaVisitor";


export class JavaParser extends Parser {
	public static readonly ABSTRACT = 1;
	public static readonly ASSERT = 2;
	public static readonly BOOLEAN = 3;
	public static readonly BREAK = 4;
	public static readonly BYTE = 5;
	public static readonly CASE = 6;
	public static readonly CATCH = 7;
	public static readonly CHAR = 8;
	public static readonly CLASS = 9;
	public static readonly CONST = 10;
	public static readonly CONTINUE = 11;
	public static readonly DEFAULT = 12;
	public static readonly DO = 13;
	public static readonly DOUBLE = 14;
	public static readonly ELSE = 15;
	public static readonly ENUM = 16;
	public static readonly EXTENDS = 17;
	public static readonly FINAL = 18;
	public static readonly FINALLY = 19;
	public static readonly FLOAT = 20;
	public static readonly FOR = 21;
	public static readonly IF = 22;
	public static readonly GOTO = 23;
	public static readonly IMPLEMENTS = 24;
	public static readonly IMPORT = 25;
	public static readonly INSTANCEOF = 26;
	public static readonly INT = 27;
	public static readonly INTERFACE = 28;
	public static readonly LONG = 29;
	public static readonly NATIVE = 30;
	public static readonly NEW = 31;
	public static readonly PACKAGE = 32;
	public static readonly PRIVATE = 33;
	public static readonly PROTECTED = 34;
	public static readonly PUBLIC = 35;
	public static readonly RETURN = 36;
	public static readonly SHORT = 37;
	public static readonly STATIC = 38;
	public static readonly STRICTFP = 39;
	public static readonly SUPER = 40;
	public static readonly SWITCH = 41;
	public static readonly SYNCHRONIZED = 42;
	public static readonly THIS = 43;
	public static readonly THROW = 44;
	public static readonly THROWS = 45;
	public static readonly TRANSIENT = 46;
	public static readonly TRY = 47;
	public static readonly VOID = 48;
	public static readonly VOLATILE = 49;
	public static readonly WHILE = 50;
	public static readonly MODULE = 51;
	public static readonly OPEN = 52;
	public static readonly REQUIRES = 53;
	public static readonly EXPORTS = 54;
	public static readonly OPENS = 55;
	public static readonly TO = 56;
	public static readonly USES = 57;
	public static readonly PROVIDES = 58;
	public static readonly WITH = 59;
	public static readonly TRANSITIVE = 60;
	public static readonly VAR = 61;
	public static readonly YIELD = 62;
	public static readonly RECORD = 63;
	public static readonly SEALED = 64;
	public static readonly PERMITS = 65;
	public static readonly NON_SEALED = 66;
	public static readonly DECIMAL_LITERAL = 67;
	public static readonly HEX_LITERAL = 68;
	public static readonly OCT_LITERAL = 69;
	public static readonly BINARY_LITERAL = 70;
	public static readonly FLOAT_LITERAL = 71;
	public static readonly HEX_FLOAT_LITERAL = 72;
	public static readonly BOOL_LITERAL = 73;
	public static readonly CHAR_LITERAL = 74;
	public static readonly STRING_LITERAL = 75;
	public static readonly TEXT_BLOCK = 76;
	public static readonly NULL_LITERAL = 77;
	public static readonly LPAREN = 78;
	public static readonly RPAREN = 79;
	public static readonly LBRACE = 80;
	public static readonly RBRACE = 81;
	public static readonly LBRACK = 82;
	public static readonly RBRACK = 83;
	public static readonly SEMI = 84;
	public static readonly COMMA = 85;
	public static readonly DOT = 86;
	public static readonly ASSIGN = 87;
	public static readonly GT = 88;
	public static readonly LT = 89;
	public static readonly BANG = 90;
	public static readonly TILDE = 91;
	public static readonly QUESTION = 92;
	public static readonly COLON = 93;
	public static readonly EQUAL = 94;
	public static readonly LE = 95;
	public static readonly GE = 96;
	public static readonly NOTEQUAL = 97;
	public static readonly AND = 98;
	public static readonly OR = 99;
	public static readonly INC = 100;
	public static readonly DEC = 101;
	public static readonly ADD = 102;
	public static readonly SUB = 103;
	public static readonly MUL = 104;
	public static readonly DIV = 105;
	public static readonly BITAND = 106;
	public static readonly BITOR = 107;
	public static readonly CARET = 108;
	public static readonly MOD = 109;
	public static readonly ADD_ASSIGN = 110;
	public static readonly SUB_ASSIGN = 111;
	public static readonly MUL_ASSIGN = 112;
	public static readonly DIV_ASSIGN = 113;
	public static readonly AND_ASSIGN = 114;
	public static readonly OR_ASSIGN = 115;
	public static readonly XOR_ASSIGN = 116;
	public static readonly MOD_ASSIGN = 117;
	public static readonly LSHIFT_ASSIGN = 118;
	public static readonly RSHIFT_ASSIGN = 119;
	public static readonly URSHIFT_ASSIGN = 120;
	public static readonly ARROW = 121;
	public static readonly COLONCOLON = 122;
	public static readonly AT = 123;
	public static readonly ELLIPSIS = 124;
	public static readonly WS = 125;
	public static readonly COMMENT = 126;
	public static readonly LINE_COMMENT = 127;
	public static readonly IDENTIFIER = 128;
	public static readonly RULE_compilationUnit = 0;
	public static readonly RULE_packageDeclaration = 1;
	public static readonly RULE_importDeclaration = 2;
	public static readonly RULE_typeDeclaration = 3;
	public static readonly RULE_modifier = 4;
	public static readonly RULE_classOrInterfaceModifier = 5;
	public static readonly RULE_variableModifier = 6;
	public static readonly RULE_classDeclaration = 7;
	public static readonly RULE_typeParameters = 8;
	public static readonly RULE_typeParameter = 9;
	public static readonly RULE_typeBound = 10;
	public static readonly RULE_enumDeclaration = 11;
	public static readonly RULE_enumConstants = 12;
	public static readonly RULE_enumConstant = 13;
	public static readonly RULE_enumBodyDeclarations = 14;
	public static readonly RULE_interfaceDeclaration = 15;
	public static readonly RULE_classBody = 16;
	public static readonly RULE_interfaceBody = 17;
	public static readonly RULE_classBodyDeclaration = 18;
	public static readonly RULE_memberDeclaration = 19;
	public static readonly RULE_methodDeclaration = 20;
	public static readonly RULE_methodBody = 21;
	public static readonly RULE_typeTypeOrVoid = 22;
	public static readonly RULE_genericMethodDeclaration = 23;
	public static readonly RULE_genericConstructorDeclaration = 24;
	public static readonly RULE_constructorDeclaration = 25;
	public static readonly RULE_compactConstructorDeclaration = 26;
	public static readonly RULE_fieldDeclaration = 27;
	public static readonly RULE_interfaceBodyDeclaration = 28;
	public static readonly RULE_interfaceMemberDeclaration = 29;
	public static readonly RULE_constDeclaration = 30;
	public static readonly RULE_constantDeclarator = 31;
	public static readonly RULE_interfaceMethodDeclaration = 32;
	public static readonly RULE_interfaceMethodModifier = 33;
	public static readonly RULE_genericInterfaceMethodDeclaration = 34;
	public static readonly RULE_interfaceCommonBodyDeclaration = 35;
	public static readonly RULE_variableDeclarators = 36;
	public static readonly RULE_variableDeclarator = 37;
	public static readonly RULE_variableDeclaratorId = 38;
	public static readonly RULE_variableInitializer = 39;
	public static readonly RULE_arrayInitializer = 40;
	public static readonly RULE_classOrInterfaceType = 41;
	public static readonly RULE_typeArgument = 42;
	public static readonly RULE_qualifiedNameList = 43;
	public static readonly RULE_formalParameters = 44;
	public static readonly RULE_receiverParameter = 45;
	public static readonly RULE_formalParameterList = 46;
	public static readonly RULE_formalParameter = 47;
	public static readonly RULE_lastFormalParameter = 48;
	public static readonly RULE_lambdaLVTIList = 49;
	public static readonly RULE_lambdaLVTIParameter = 50;
	public static readonly RULE_qualifiedName = 51;
	public static readonly RULE_literal = 52;
	public static readonly RULE_integerLiteral = 53;
	public static readonly RULE_floatLiteral = 54;
	public static readonly RULE_altAnnotationQualifiedName = 55;
	public static readonly RULE_annotation = 56;
	public static readonly RULE_elementValuePairs = 57;
	public static readonly RULE_elementValuePair = 58;
	public static readonly RULE_elementValue = 59;
	public static readonly RULE_elementValueArrayInitializer = 60;
	public static readonly RULE_annotationTypeDeclaration = 61;
	public static readonly RULE_annotationTypeBody = 62;
	public static readonly RULE_annotationTypeElementDeclaration = 63;
	public static readonly RULE_annotationTypeElementRest = 64;
	public static readonly RULE_annotationMethodOrConstantRest = 65;
	public static readonly RULE_annotationMethodRest = 66;
	public static readonly RULE_annotationConstantRest = 67;
	public static readonly RULE_defaultValue = 68;
	public static readonly RULE_moduleDeclaration = 69;
	public static readonly RULE_moduleBody = 70;
	public static readonly RULE_moduleDirective = 71;
	public static readonly RULE_requiresModifier = 72;
	public static readonly RULE_recordDeclaration = 73;
	public static readonly RULE_recordHeader = 74;
	public static readonly RULE_recordComponentList = 75;
	public static readonly RULE_recordComponent = 76;
	public static readonly RULE_recordBody = 77;
	public static readonly RULE_block = 78;
	public static readonly RULE_blockStatement = 79;
	public static readonly RULE_localVariableDeclaration = 80;
	public static readonly RULE_identifier = 81;
	public static readonly RULE_typeIdentifier = 82;
	public static readonly RULE_localTypeDeclaration = 83;
	public static readonly RULE_statement = 84;
	public static readonly RULE_catchClause = 85;
	public static readonly RULE_catchType = 86;
	public static readonly RULE_finallyBlock = 87;
	public static readonly RULE_resourceSpecification = 88;
	public static readonly RULE_resources = 89;
	public static readonly RULE_resource = 90;
	public static readonly RULE_switchBlockStatementGroup = 91;
	public static readonly RULE_switchLabel = 92;
	public static readonly RULE_forControl = 93;
	public static readonly RULE_forInit = 94;
	public static readonly RULE_enhancedForControl = 95;
	public static readonly RULE_parExpression = 96;
	public static readonly RULE_expressionList = 97;
	public static readonly RULE_methodCall = 98;
	public static readonly RULE_expression = 99;
	public static readonly RULE_pattern = 100;
	public static readonly RULE_lambdaExpression = 101;
	public static readonly RULE_lambdaParameters = 102;
	public static readonly RULE_lambdaBody = 103;
	public static readonly RULE_primary = 104;
	public static readonly RULE_switchExpression = 105;
	public static readonly RULE_switchLabeledRule = 106;
	public static readonly RULE_guardedPattern = 107;
	public static readonly RULE_guard = 108;
	public static readonly RULE_switchRuleOutcome = 109;
	public static readonly RULE_classType = 110;
	public static readonly RULE_creator = 111;
	public static readonly RULE_createdName = 112;
	public static readonly RULE_innerCreator = 113;
	public static readonly RULE_arrayCreatorRest = 114;
	public static readonly RULE_classCreatorRest = 115;
	public static readonly RULE_explicitGenericInvocation = 116;
	public static readonly RULE_typeArgumentsOrDiamond = 117;
	public static readonly RULE_nonWildcardTypeArgumentsOrDiamond = 118;
	public static readonly RULE_nonWildcardTypeArguments = 119;
	public static readonly RULE_typeList = 120;
	public static readonly RULE_typeType = 121;
	public static readonly RULE_primitiveType = 122;
	public static readonly RULE_typeArguments = 123;
	public static readonly RULE_superSuffix = 124;
	public static readonly RULE_explicitGenericInvocationSuffix = 125;
	public static readonly RULE_arguments = 126;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"compilationUnit", "packageDeclaration", "importDeclaration", "typeDeclaration", 
		"modifier", "classOrInterfaceModifier", "variableModifier", "classDeclaration", 
		"typeParameters", "typeParameter", "typeBound", "enumDeclaration", "enumConstants", 
		"enumConstant", "enumBodyDeclarations", "interfaceDeclaration", "classBody", 
		"interfaceBody", "classBodyDeclaration", "memberDeclaration", "methodDeclaration", 
		"methodBody", "typeTypeOrVoid", "genericMethodDeclaration", "genericConstructorDeclaration", 
		"constructorDeclaration", "compactConstructorDeclaration", "fieldDeclaration", 
		"interfaceBodyDeclaration", "interfaceMemberDeclaration", "constDeclaration", 
		"constantDeclarator", "interfaceMethodDeclaration", "interfaceMethodModifier", 
		"genericInterfaceMethodDeclaration", "interfaceCommonBodyDeclaration", 
		"variableDeclarators", "variableDeclarator", "variableDeclaratorId", "variableInitializer", 
		"arrayInitializer", "classOrInterfaceType", "typeArgument", "qualifiedNameList", 
		"formalParameters", "receiverParameter", "formalParameterList", "formalParameter", 
		"lastFormalParameter", "lambdaLVTIList", "lambdaLVTIParameter", "qualifiedName", 
		"literal", "integerLiteral", "floatLiteral", "altAnnotationQualifiedName", 
		"annotation", "elementValuePairs", "elementValuePair", "elementValue", 
		"elementValueArrayInitializer", "annotationTypeDeclaration", "annotationTypeBody", 
		"annotationTypeElementDeclaration", "annotationTypeElementRest", "annotationMethodOrConstantRest", 
		"annotationMethodRest", "annotationConstantRest", "defaultValue", "moduleDeclaration", 
		"moduleBody", "moduleDirective", "requiresModifier", "recordDeclaration", 
		"recordHeader", "recordComponentList", "recordComponent", "recordBody", 
		"block", "blockStatement", "localVariableDeclaration", "identifier", "typeIdentifier", 
		"localTypeDeclaration", "statement", "catchClause", "catchType", "finallyBlock", 
		"resourceSpecification", "resources", "resource", "switchBlockStatementGroup", 
		"switchLabel", "forControl", "forInit", "enhancedForControl", "parExpression", 
		"expressionList", "methodCall", "expression", "pattern", "lambdaExpression", 
		"lambdaParameters", "lambdaBody", "primary", "switchExpression", "switchLabeledRule", 
		"guardedPattern", "guard", "switchRuleOutcome", "classType", "creator",
		"createdName", "innerCreator", "arrayCreatorRest", "classCreatorRest",
		"explicitGenericInvocation", "typeArgumentsOrDiamond", "nonWildcardTypeArgumentsOrDiamond",
		"nonWildcardTypeArguments", "typeList", "typeType", "primitiveType", "typeArguments",
		"superSuffix", "explicitGenericInvocationSuffix", "arguments",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'abstract'", "'assert'", "'boolean'", "'break'", "'byte'", 
		"'case'", "'catch'", "'char'", "'class'", "'const'", "'continue'", "'default'", 
		"'do'", "'double'", "'else'", "'enum'", "'extends'", "'final'", "'finally'", 
		"'float'", "'for'", "'if'", "'goto'", "'implements'", "'import'", "'instanceof'", 
		"'int'", "'interface'", "'long'", "'native'", "'new'", "'package'", "'private'", 
		"'protected'", "'public'", "'return'", "'short'", "'static'", "'strictfp'", 
		"'super'", "'switch'", "'synchronized'", "'this'", "'throw'", "'throws'", 
		"'transient'", "'try'", "'void'", "'volatile'", "'while'", "'module'", 
		"'open'", "'requires'", "'exports'", "'opens'", "'to'", "'uses'", "'provides'", 
		"'with'", "'transitive'", "'var'", "'yield'", "'record'", "'sealed'", 
		"'permits'", "'non-sealed'", undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, "'null'", 
		"'('", "')'", "'{'", "'}'", "'['", "']'", "';'", "','", "'.'", "'='", 
		"'>'", "'<'", "'!'", "'~'", "'?'", "':'", "'=='", "'<='", "'>='", "'!='", 
		"'&&'", "'||'", "'++'", "'--'", "'+'", "'-'", "'*'", "'/'", "'&'", "'|'", 
		"'^'", "'%'", "'+='", "'-='", "'*='", "'/='", "'&='", "'|='", "'^='", 
		"'%='", "'<<='", "'>>='", "'>>>='", "'->'", "'::'", "'@'", "'...'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "ABSTRACT", "ASSERT", "BOOLEAN", "BREAK", "BYTE", "CASE", "CATCH", 
		"CHAR", "CLASS", "CONST", "CONTINUE", "DEFAULT", "DO", "DOUBLE", "ELSE", 
		"ENUM", "EXTENDS", "FINAL", "FINALLY", "FLOAT", "FOR", "IF", "GOTO", "IMPLEMENTS", 
		"IMPORT", "INSTANCEOF", "INT", "INTERFACE", "LONG", "NATIVE", "NEW", "PACKAGE", 
		"PRIVATE", "PROTECTED", "PUBLIC", "RETURN", "SHORT", "STATIC", "STRICTFP", 
		"SUPER", "SWITCH", "SYNCHRONIZED", "THIS", "THROW", "THROWS", "TRANSIENT", 
		"TRY", "VOID", "VOLATILE", "WHILE", "MODULE", "OPEN", "REQUIRES", "EXPORTS", 
		"OPENS", "TO", "USES", "PROVIDES", "WITH", "TRANSITIVE", "VAR", "YIELD", 
		"RECORD", "SEALED", "PERMITS", "NON_SEALED", "DECIMAL_LITERAL", "HEX_LITERAL", 
		"OCT_LITERAL", "BINARY_LITERAL", "FLOAT_LITERAL", "HEX_FLOAT_LITERAL", 
		"BOOL_LITERAL", "CHAR_LITERAL", "STRING_LITERAL", "TEXT_BLOCK", "NULL_LITERAL", 
		"LPAREN", "RPAREN", "LBRACE", "RBRACE", "LBRACK", "RBRACK", "SEMI", "COMMA", 
		"DOT", "ASSIGN", "GT", "LT", "BANG", "TILDE", "QUESTION", "COLON", "EQUAL", 
		"LE", "GE", "NOTEQUAL", "AND", "OR", "INC", "DEC", "ADD", "SUB", "MUL", 
		"DIV", "BITAND", "BITOR", "CARET", "MOD", "ADD_ASSIGN", "SUB_ASSIGN", 
		"MUL_ASSIGN", "DIV_ASSIGN", "AND_ASSIGN", "OR_ASSIGN", "XOR_ASSIGN", "MOD_ASSIGN", 
		"LSHIFT_ASSIGN", "RSHIFT_ASSIGN", "URSHIFT_ASSIGN", "ARROW", "COLONCOLON", 
		"AT", "ELLIPSIS", "WS", "COMMENT", "LINE_COMMENT", "IDENTIFIER",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(JavaParser._LITERAL_NAMES, JavaParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return JavaParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Java.g4"; }

	// @Override
	public get ruleNames(): string[] { return JavaParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return JavaParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(JavaParser._ATN, this);
	}
	// @RuleVersion(0)
	public compilationUnit(): CompilationUnitContext {
		let _localctx: CompilationUnitContext = new CompilationUnitContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, JavaParser.RULE_compilationUnit);
		let _la: number;
		try {
			let _alt: number;
			this.state = 274;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 5, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 255;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 0, this._ctx) ) {
				case 1:
					{
					this.state = 254;
					this.packageDeclaration();
					}
					break;
				}
				this.state = 261;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 2, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						this.state = 259;
						this._errHandler.sync(this);
						switch ( this.interpreter.adaptivePredict(this._input, 1, this._ctx) ) {
						case 1:
							{
							this.state = 257;
							this.importDeclaration();
							}
							break;

						case 2:
							{
							this.state = 258;
							this.match(JavaParser.SEMI);
							}
							break;
						}
						}
					}
					this.state = 263;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 2, this._ctx);
				}
				this.state = 268;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.ABSTRACT) | (1 << JavaParser.CLASS) | (1 << JavaParser.ENUM) | (1 << JavaParser.FINAL) | (1 << JavaParser.INTERFACE))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (JavaParser.PRIVATE - 33)) | (1 << (JavaParser.PROTECTED - 33)) | (1 << (JavaParser.PUBLIC - 33)) | (1 << (JavaParser.STATIC - 33)) | (1 << (JavaParser.STRICTFP - 33)) | (1 << (JavaParser.MODULE - 33)) | (1 << (JavaParser.OPEN - 33)) | (1 << (JavaParser.REQUIRES - 33)) | (1 << (JavaParser.EXPORTS - 33)) | (1 << (JavaParser.OPENS - 33)) | (1 << (JavaParser.TO - 33)) | (1 << (JavaParser.USES - 33)) | (1 << (JavaParser.PROVIDES - 33)) | (1 << (JavaParser.WITH - 33)) | (1 << (JavaParser.TRANSITIVE - 33)) | (1 << (JavaParser.VAR - 33)) | (1 << (JavaParser.YIELD - 33)) | (1 << (JavaParser.RECORD - 33)) | (1 << (JavaParser.SEALED - 33)))) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & ((1 << (JavaParser.PERMITS - 65)) | (1 << (JavaParser.NON_SEALED - 65)) | (1 << (JavaParser.SEMI - 65)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
					{
					this.state = 266;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case JavaParser.ABSTRACT:
					case JavaParser.CLASS:
					case JavaParser.ENUM:
					case JavaParser.FINAL:
					case JavaParser.INTERFACE:
					case JavaParser.PRIVATE:
					case JavaParser.PROTECTED:
					case JavaParser.PUBLIC:
					case JavaParser.STATIC:
					case JavaParser.STRICTFP:
					case JavaParser.MODULE:
					case JavaParser.OPEN:
					case JavaParser.REQUIRES:
					case JavaParser.EXPORTS:
					case JavaParser.OPENS:
					case JavaParser.TO:
					case JavaParser.USES:
					case JavaParser.PROVIDES:
					case JavaParser.WITH:
					case JavaParser.TRANSITIVE:
					case JavaParser.VAR:
					case JavaParser.YIELD:
					case JavaParser.RECORD:
					case JavaParser.SEALED:
					case JavaParser.PERMITS:
					case JavaParser.NON_SEALED:
					case JavaParser.AT:
					case JavaParser.IDENTIFIER:
						{
						this.state = 264;
						this.typeDeclaration();
						}
						break;
					case JavaParser.SEMI:
						{
						this.state = 265;
						this.match(JavaParser.SEMI);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
					this.state = 270;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 271;
				this.moduleDeclaration();
				this.state = 272;
				this.match(JavaParser.EOF);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public packageDeclaration(): PackageDeclarationContext {
		let _localctx: PackageDeclarationContext = new PackageDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, JavaParser.RULE_packageDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 279;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & ((1 << (JavaParser.MODULE - 51)) | (1 << (JavaParser.OPEN - 51)) | (1 << (JavaParser.REQUIRES - 51)) | (1 << (JavaParser.EXPORTS - 51)) | (1 << (JavaParser.OPENS - 51)) | (1 << (JavaParser.TO - 51)) | (1 << (JavaParser.USES - 51)) | (1 << (JavaParser.PROVIDES - 51)) | (1 << (JavaParser.WITH - 51)) | (1 << (JavaParser.TRANSITIVE - 51)) | (1 << (JavaParser.VAR - 51)) | (1 << (JavaParser.YIELD - 51)) | (1 << (JavaParser.RECORD - 51)) | (1 << (JavaParser.SEALED - 51)) | (1 << (JavaParser.PERMITS - 51)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
				{
				{
				this.state = 276;
				this.annotation();
				}
				}
				this.state = 281;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 282;
			this.match(JavaParser.PACKAGE);
			this.state = 283;
			this.qualifiedName();
			this.state = 284;
			this.match(JavaParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public importDeclaration(): ImportDeclarationContext {
		let _localctx: ImportDeclarationContext = new ImportDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, JavaParser.RULE_importDeclaration);
		let _la: number;
		try {
			this.state = 298;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.IMPORT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 286;
				this.match(JavaParser.IMPORT);
				this.state = 288;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.STATIC) {
					{
					this.state = 287;
					this.match(JavaParser.STATIC);
					}
				}

				this.state = 290;
				this.qualifiedName();
				this.state = 293;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.DOT) {
					{
					this.state = 291;
					this.match(JavaParser.DOT);
					this.state = 292;
					this.match(JavaParser.MUL);
					}
				}

				this.state = 295;
				this.match(JavaParser.SEMI);
				}
				break;
			case JavaParser.SEMI:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 297;
				this.match(JavaParser.SEMI);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeDeclaration(): TypeDeclarationContext {
		let _localctx: TypeDeclarationContext = new TypeDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, JavaParser.RULE_typeDeclaration);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 303;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 10, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 300;
					this.classOrInterfaceModifier();
					}
					}
				}
				this.state = 305;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 10, this._ctx);
			}
			this.state = 311;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.CLASS:
				{
				this.state = 306;
				this.classDeclaration();
				}
				break;
			case JavaParser.ENUM:
				{
				this.state = 307;
				this.enumDeclaration();
				}
				break;
			case JavaParser.INTERFACE:
				{
				this.state = 308;
				this.interfaceDeclaration();
				}
				break;
			case JavaParser.AT:
				{
				this.state = 309;
				this.annotationTypeDeclaration();
				}
				break;
			case JavaParser.RECORD:
				{
				this.state = 310;
				this.recordDeclaration();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public modifier(): ModifierContext {
		let _localctx: ModifierContext = new ModifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, JavaParser.RULE_modifier);
		try {
			this.state = 318;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.ABSTRACT:
			case JavaParser.FINAL:
			case JavaParser.PRIVATE:
			case JavaParser.PROTECTED:
			case JavaParser.PUBLIC:
			case JavaParser.STATIC:
			case JavaParser.STRICTFP:
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.NON_SEALED:
			case JavaParser.AT:
			case JavaParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 313;
				this.classOrInterfaceModifier();
				}
				break;
			case JavaParser.NATIVE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 314;
				this.match(JavaParser.NATIVE);
				}
				break;
			case JavaParser.SYNCHRONIZED:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 315;
				this.match(JavaParser.SYNCHRONIZED);
				}
				break;
			case JavaParser.TRANSIENT:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 316;
				this.match(JavaParser.TRANSIENT);
				}
				break;
			case JavaParser.VOLATILE:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 317;
				this.match(JavaParser.VOLATILE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public classOrInterfaceModifier(): ClassOrInterfaceModifierContext {
		let _localctx: ClassOrInterfaceModifierContext = new ClassOrInterfaceModifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, JavaParser.RULE_classOrInterfaceModifier);
		try {
			this.state = 330;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 13, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 320;
				this.annotation();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 321;
				this.match(JavaParser.PUBLIC);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 322;
				this.match(JavaParser.PROTECTED);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 323;
				this.match(JavaParser.PRIVATE);
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 324;
				this.match(JavaParser.STATIC);
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 325;
				this.match(JavaParser.ABSTRACT);
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 326;
				this.match(JavaParser.FINAL);
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 327;
				this.match(JavaParser.STRICTFP);
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 328;
				this.match(JavaParser.SEALED);
				}
				break;

			case 10:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 329;
				this.match(JavaParser.NON_SEALED);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public variableModifier(): VariableModifierContext {
		let _localctx: VariableModifierContext = new VariableModifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, JavaParser.RULE_variableModifier);
		try {
			this.state = 334;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.FINAL:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 332;
				this.match(JavaParser.FINAL);
				}
				break;
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.AT:
			case JavaParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 333;
				this.annotation();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public classDeclaration(): ClassDeclarationContext {
		let _localctx: ClassDeclarationContext = new ClassDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, JavaParser.RULE_classDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 336;
			this.match(JavaParser.CLASS);
			this.state = 337;
			this.identifier();
			this.state = 339;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.LT) {
				{
				this.state = 338;
				this.typeParameters();
				}
			}

			this.state = 343;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.EXTENDS) {
				{
				this.state = 341;
				this.match(JavaParser.EXTENDS);
				this.state = 342;
				this.typeType();
				}
			}

			this.state = 347;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.IMPLEMENTS) {
				{
				this.state = 345;
				this.match(JavaParser.IMPLEMENTS);
				this.state = 346;
				this.typeList();
				}
			}

			this.state = 351;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.PERMITS) {
				{
				this.state = 349;
				this.match(JavaParser.PERMITS);
				this.state = 350;
				this.typeList();
				}
			}

			this.state = 353;
			this.classBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeParameters(): TypeParametersContext {
		let _localctx: TypeParametersContext = new TypeParametersContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, JavaParser.RULE_typeParameters);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 355;
			this.match(JavaParser.LT);
			this.state = 356;
			this.typeParameter();
			this.state = 361;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.COMMA) {
				{
				{
				this.state = 357;
				this.match(JavaParser.COMMA);
				this.state = 358;
				this.typeParameter();
				}
				}
				this.state = 363;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 364;
			this.match(JavaParser.GT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeParameter(): TypeParameterContext {
		let _localctx: TypeParameterContext = new TypeParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, JavaParser.RULE_typeParameter);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 369;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 20, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 366;
					this.annotation();
					}
					}
				}
				this.state = 371;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 20, this._ctx);
			}
			this.state = 372;
			this.identifier();
			this.state = 381;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.EXTENDS) {
				{
				this.state = 373;
				this.match(JavaParser.EXTENDS);
				this.state = 377;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 21, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 374;
						this.annotation();
						}
						}
					}
					this.state = 379;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 21, this._ctx);
				}
				this.state = 380;
				this.typeBound();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeBound(): TypeBoundContext {
		let _localctx: TypeBoundContext = new TypeBoundContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, JavaParser.RULE_typeBound);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 383;
			this.typeType();
			this.state = 388;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.BITAND) {
				{
				{
				this.state = 384;
				this.match(JavaParser.BITAND);
				this.state = 385;
				this.typeType();
				}
				}
				this.state = 390;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public enumDeclaration(): EnumDeclarationContext {
		let _localctx: EnumDeclarationContext = new EnumDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, JavaParser.RULE_enumDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 391;
			this.match(JavaParser.ENUM);
			this.state = 392;
			this.identifier();
			this.state = 395;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.IMPLEMENTS) {
				{
				this.state = 393;
				this.match(JavaParser.IMPLEMENTS);
				this.state = 394;
				this.typeList();
				}
			}

			this.state = 397;
			this.match(JavaParser.LBRACE);
			this.state = 399;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & ((1 << (JavaParser.MODULE - 51)) | (1 << (JavaParser.OPEN - 51)) | (1 << (JavaParser.REQUIRES - 51)) | (1 << (JavaParser.EXPORTS - 51)) | (1 << (JavaParser.OPENS - 51)) | (1 << (JavaParser.TO - 51)) | (1 << (JavaParser.USES - 51)) | (1 << (JavaParser.PROVIDES - 51)) | (1 << (JavaParser.WITH - 51)) | (1 << (JavaParser.TRANSITIVE - 51)) | (1 << (JavaParser.VAR - 51)) | (1 << (JavaParser.YIELD - 51)) | (1 << (JavaParser.RECORD - 51)) | (1 << (JavaParser.SEALED - 51)) | (1 << (JavaParser.PERMITS - 51)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
				{
				this.state = 398;
				this.enumConstants();
				}
			}

			this.state = 402;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.COMMA) {
				{
				this.state = 401;
				this.match(JavaParser.COMMA);
				}
			}

			this.state = 405;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.SEMI) {
				{
				this.state = 404;
				this.enumBodyDeclarations();
				}
			}

			this.state = 407;
			this.match(JavaParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public enumConstants(): EnumConstantsContext {
		let _localctx: EnumConstantsContext = new EnumConstantsContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, JavaParser.RULE_enumConstants);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 409;
			this.enumConstant();
			this.state = 414;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 28, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 410;
					this.match(JavaParser.COMMA);
					this.state = 411;
					this.enumConstant();
					}
					}
				}
				this.state = 416;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 28, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public enumConstant(): EnumConstantContext {
		let _localctx: EnumConstantContext = new EnumConstantContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, JavaParser.RULE_enumConstant);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 420;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 29, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 417;
					this.annotation();
					}
					}
				}
				this.state = 422;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 29, this._ctx);
			}
			this.state = 423;
			this.identifier();
			this.state = 425;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.LPAREN) {
				{
				this.state = 424;
				this.arguments();
				}
			}

			this.state = 428;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.LBRACE) {
				{
				this.state = 427;
				this.classBody();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public enumBodyDeclarations(): EnumBodyDeclarationsContext {
		let _localctx: EnumBodyDeclarationsContext = new EnumBodyDeclarationsContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, JavaParser.RULE_enumBodyDeclarations);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 430;
			this.match(JavaParser.SEMI);
			this.state = 434;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.ABSTRACT) | (1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.CLASS) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.ENUM) | (1 << JavaParser.FINAL) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.INTERFACE) | (1 << JavaParser.LONG) | (1 << JavaParser.NATIVE))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (JavaParser.PRIVATE - 33)) | (1 << (JavaParser.PROTECTED - 33)) | (1 << (JavaParser.PUBLIC - 33)) | (1 << (JavaParser.SHORT - 33)) | (1 << (JavaParser.STATIC - 33)) | (1 << (JavaParser.STRICTFP - 33)) | (1 << (JavaParser.SYNCHRONIZED - 33)) | (1 << (JavaParser.TRANSIENT - 33)) | (1 << (JavaParser.VOID - 33)) | (1 << (JavaParser.VOLATILE - 33)) | (1 << (JavaParser.MODULE - 33)) | (1 << (JavaParser.OPEN - 33)) | (1 << (JavaParser.REQUIRES - 33)) | (1 << (JavaParser.EXPORTS - 33)) | (1 << (JavaParser.OPENS - 33)) | (1 << (JavaParser.TO - 33)) | (1 << (JavaParser.USES - 33)) | (1 << (JavaParser.PROVIDES - 33)) | (1 << (JavaParser.WITH - 33)) | (1 << (JavaParser.TRANSITIVE - 33)) | (1 << (JavaParser.VAR - 33)) | (1 << (JavaParser.YIELD - 33)) | (1 << (JavaParser.RECORD - 33)) | (1 << (JavaParser.SEALED - 33)))) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & ((1 << (JavaParser.PERMITS - 65)) | (1 << (JavaParser.NON_SEALED - 65)) | (1 << (JavaParser.LBRACE - 65)) | (1 << (JavaParser.SEMI - 65)) | (1 << (JavaParser.LT - 65)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
				{
				{
				this.state = 431;
				this.classBodyDeclaration();
				}
				}
				this.state = 436;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public interfaceDeclaration(): InterfaceDeclarationContext {
		let _localctx: InterfaceDeclarationContext = new InterfaceDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, JavaParser.RULE_interfaceDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 437;
			this.match(JavaParser.INTERFACE);
			this.state = 438;
			this.identifier();
			this.state = 440;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.LT) {
				{
				this.state = 439;
				this.typeParameters();
				}
			}

			this.state = 444;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.EXTENDS) {
				{
				this.state = 442;
				this.match(JavaParser.EXTENDS);
				this.state = 443;
				this.typeList();
				}
			}

			this.state = 448;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.PERMITS) {
				{
				this.state = 446;
				this.match(JavaParser.PERMITS);
				this.state = 447;
				this.typeList();
				}
			}

			this.state = 450;
			this.interfaceBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public classBody(): ClassBodyContext {
		let _localctx: ClassBodyContext = new ClassBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, JavaParser.RULE_classBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 452;
			this.match(JavaParser.LBRACE);
			this.state = 456;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.ABSTRACT) | (1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.CLASS) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.ENUM) | (1 << JavaParser.FINAL) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.INTERFACE) | (1 << JavaParser.LONG) | (1 << JavaParser.NATIVE))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (JavaParser.PRIVATE - 33)) | (1 << (JavaParser.PROTECTED - 33)) | (1 << (JavaParser.PUBLIC - 33)) | (1 << (JavaParser.SHORT - 33)) | (1 << (JavaParser.STATIC - 33)) | (1 << (JavaParser.STRICTFP - 33)) | (1 << (JavaParser.SYNCHRONIZED - 33)) | (1 << (JavaParser.TRANSIENT - 33)) | (1 << (JavaParser.VOID - 33)) | (1 << (JavaParser.VOLATILE - 33)) | (1 << (JavaParser.MODULE - 33)) | (1 << (JavaParser.OPEN - 33)) | (1 << (JavaParser.REQUIRES - 33)) | (1 << (JavaParser.EXPORTS - 33)) | (1 << (JavaParser.OPENS - 33)) | (1 << (JavaParser.TO - 33)) | (1 << (JavaParser.USES - 33)) | (1 << (JavaParser.PROVIDES - 33)) | (1 << (JavaParser.WITH - 33)) | (1 << (JavaParser.TRANSITIVE - 33)) | (1 << (JavaParser.VAR - 33)) | (1 << (JavaParser.YIELD - 33)) | (1 << (JavaParser.RECORD - 33)) | (1 << (JavaParser.SEALED - 33)))) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & ((1 << (JavaParser.PERMITS - 65)) | (1 << (JavaParser.NON_SEALED - 65)) | (1 << (JavaParser.LBRACE - 65)) | (1 << (JavaParser.SEMI - 65)) | (1 << (JavaParser.LT - 65)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
				{
				{
				this.state = 453;
				this.classBodyDeclaration();
				}
				}
				this.state = 458;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 459;
			this.match(JavaParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public interfaceBody(): InterfaceBodyContext {
		let _localctx: InterfaceBodyContext = new InterfaceBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, JavaParser.RULE_interfaceBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 461;
			this.match(JavaParser.LBRACE);
			this.state = 465;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.ABSTRACT) | (1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.CLASS) | (1 << JavaParser.DEFAULT) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.ENUM) | (1 << JavaParser.FINAL) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.INTERFACE) | (1 << JavaParser.LONG) | (1 << JavaParser.NATIVE))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (JavaParser.PRIVATE - 33)) | (1 << (JavaParser.PROTECTED - 33)) | (1 << (JavaParser.PUBLIC - 33)) | (1 << (JavaParser.SHORT - 33)) | (1 << (JavaParser.STATIC - 33)) | (1 << (JavaParser.STRICTFP - 33)) | (1 << (JavaParser.SYNCHRONIZED - 33)) | (1 << (JavaParser.TRANSIENT - 33)) | (1 << (JavaParser.VOID - 33)) | (1 << (JavaParser.VOLATILE - 33)) | (1 << (JavaParser.MODULE - 33)) | (1 << (JavaParser.OPEN - 33)) | (1 << (JavaParser.REQUIRES - 33)) | (1 << (JavaParser.EXPORTS - 33)) | (1 << (JavaParser.OPENS - 33)) | (1 << (JavaParser.TO - 33)) | (1 << (JavaParser.USES - 33)) | (1 << (JavaParser.PROVIDES - 33)) | (1 << (JavaParser.WITH - 33)) | (1 << (JavaParser.TRANSITIVE - 33)) | (1 << (JavaParser.VAR - 33)) | (1 << (JavaParser.YIELD - 33)) | (1 << (JavaParser.RECORD - 33)) | (1 << (JavaParser.SEALED - 33)))) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & ((1 << (JavaParser.PERMITS - 65)) | (1 << (JavaParser.NON_SEALED - 65)) | (1 << (JavaParser.SEMI - 65)) | (1 << (JavaParser.LT - 65)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
				{
				{
				this.state = 462;
				this.interfaceBodyDeclaration();
				}
				}
				this.state = 467;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 468;
			this.match(JavaParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public classBodyDeclaration(): ClassBodyDeclarationContext {
		let _localctx: ClassBodyDeclarationContext = new ClassBodyDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, JavaParser.RULE_classBodyDeclaration);
		let _la: number;
		try {
			let _alt: number;
			this.state = 482;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 40, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 470;
				this.match(JavaParser.SEMI);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 472;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.STATIC) {
					{
					this.state = 471;
					this.match(JavaParser.STATIC);
					}
				}

				this.state = 474;
				this.block();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 478;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 39, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 475;
						this.modifier();
						}
						}
					}
					this.state = 480;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 39, this._ctx);
				}
				this.state = 481;
				this.memberDeclaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public memberDeclaration(): MemberDeclarationContext {
		let _localctx: MemberDeclarationContext = new MemberDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, JavaParser.RULE_memberDeclaration);
		try {
			this.state = 494;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 41, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 484;
				this.recordDeclaration();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 485;
				this.methodDeclaration();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 486;
				this.genericMethodDeclaration();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 487;
				this.fieldDeclaration();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 488;
				this.constructorDeclaration();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 489;
				this.genericConstructorDeclaration();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 490;
				this.interfaceDeclaration();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 491;
				this.annotationTypeDeclaration();
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 492;
				this.classDeclaration();
				}
				break;

			case 10:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 493;
				this.enumDeclaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public methodDeclaration(): MethodDeclarationContext {
		let _localctx: MethodDeclarationContext = new MethodDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, JavaParser.RULE_methodDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 496;
			this.typeTypeOrVoid();
			this.state = 497;
			this.identifier();
			this.state = 498;
			this.formalParameters();
			this.state = 503;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.LBRACK) {
				{
				{
				this.state = 499;
				this.match(JavaParser.LBRACK);
				this.state = 500;
				this.match(JavaParser.RBRACK);
				}
				}
				this.state = 505;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 508;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.THROWS) {
				{
				this.state = 506;
				this.match(JavaParser.THROWS);
				this.state = 507;
				this.qualifiedNameList();
				}
			}

			this.state = 510;
			this.methodBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public methodBody(): MethodBodyContext {
		let _localctx: MethodBodyContext = new MethodBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, JavaParser.RULE_methodBody);
		try {
			this.state = 514;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.LBRACE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 512;
				this.block();
				}
				break;
			case JavaParser.SEMI:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 513;
				this.match(JavaParser.SEMI);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeTypeOrVoid(): TypeTypeOrVoidContext {
		let _localctx: TypeTypeOrVoidContext = new TypeTypeOrVoidContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, JavaParser.RULE_typeTypeOrVoid);
		try {
			this.state = 518;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.BOOLEAN:
			case JavaParser.BYTE:
			case JavaParser.CHAR:
			case JavaParser.DOUBLE:
			case JavaParser.FLOAT:
			case JavaParser.INT:
			case JavaParser.LONG:
			case JavaParser.SHORT:
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.AT:
			case JavaParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 516;
				this.typeType();
				}
				break;
			case JavaParser.VOID:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 517;
				this.match(JavaParser.VOID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public genericMethodDeclaration(): GenericMethodDeclarationContext {
		let _localctx: GenericMethodDeclarationContext = new GenericMethodDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, JavaParser.RULE_genericMethodDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 520;
			this.typeParameters();
			this.state = 521;
			this.methodDeclaration();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public genericConstructorDeclaration(): GenericConstructorDeclarationContext {
		let _localctx: GenericConstructorDeclarationContext = new GenericConstructorDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, JavaParser.RULE_genericConstructorDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 523;
			this.typeParameters();
			this.state = 524;
			this.constructorDeclaration();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public constructorDeclaration(): ConstructorDeclarationContext {
		let _localctx: ConstructorDeclarationContext = new ConstructorDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, JavaParser.RULE_constructorDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 526;
			this.identifier();
			this.state = 527;
			this.formalParameters();
			this.state = 530;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.THROWS) {
				{
				this.state = 528;
				this.match(JavaParser.THROWS);
				this.state = 529;
				this.qualifiedNameList();
				}
			}

			this.state = 532;
			_localctx._constructorBody = this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public compactConstructorDeclaration(): CompactConstructorDeclarationContext {
		let _localctx: CompactConstructorDeclarationContext = new CompactConstructorDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, JavaParser.RULE_compactConstructorDeclaration);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 537;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 47, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 534;
					this.modifier();
					}
					}
				}
				this.state = 539;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 47, this._ctx);
			}
			this.state = 540;
			this.identifier();
			this.state = 541;
			_localctx._constructorBody = this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public fieldDeclaration(): FieldDeclarationContext {
		let _localctx: FieldDeclarationContext = new FieldDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, JavaParser.RULE_fieldDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 543;
			this.typeType();
			this.state = 544;
			this.variableDeclarators();
			this.state = 545;
			this.match(JavaParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public interfaceBodyDeclaration(): InterfaceBodyDeclarationContext {
		let _localctx: InterfaceBodyDeclarationContext = new InterfaceBodyDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, JavaParser.RULE_interfaceBodyDeclaration);
		try {
			let _alt: number;
			this.state = 555;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.ABSTRACT:
			case JavaParser.BOOLEAN:
			case JavaParser.BYTE:
			case JavaParser.CHAR:
			case JavaParser.CLASS:
			case JavaParser.DEFAULT:
			case JavaParser.DOUBLE:
			case JavaParser.ENUM:
			case JavaParser.FINAL:
			case JavaParser.FLOAT:
			case JavaParser.INT:
			case JavaParser.INTERFACE:
			case JavaParser.LONG:
			case JavaParser.NATIVE:
			case JavaParser.PRIVATE:
			case JavaParser.PROTECTED:
			case JavaParser.PUBLIC:
			case JavaParser.SHORT:
			case JavaParser.STATIC:
			case JavaParser.STRICTFP:
			case JavaParser.SYNCHRONIZED:
			case JavaParser.TRANSIENT:
			case JavaParser.VOID:
			case JavaParser.VOLATILE:
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.NON_SEALED:
			case JavaParser.LT:
			case JavaParser.AT:
			case JavaParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 550;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 48, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 547;
						this.modifier();
						}
						}
					}
					this.state = 552;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 48, this._ctx);
				}
				this.state = 553;
				this.interfaceMemberDeclaration();
				}
				break;
			case JavaParser.SEMI:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 554;
				this.match(JavaParser.SEMI);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public interfaceMemberDeclaration(): InterfaceMemberDeclarationContext {
		let _localctx: InterfaceMemberDeclarationContext = new InterfaceMemberDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, JavaParser.RULE_interfaceMemberDeclaration);
		try {
			this.state = 565;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 50, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 557;
				this.constDeclaration();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 558;
				this.interfaceMethodDeclaration();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 559;
				this.genericInterfaceMethodDeclaration();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 560;
				this.interfaceDeclaration();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 561;
				this.annotationTypeDeclaration();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 562;
				this.classDeclaration();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 563;
				this.enumDeclaration();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 564;
				this.recordDeclaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public constDeclaration(): ConstDeclarationContext {
		let _localctx: ConstDeclarationContext = new ConstDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, JavaParser.RULE_constDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 567;
			this.typeType();
			this.state = 568;
			this.constantDeclarator();
			this.state = 573;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.COMMA) {
				{
				{
				this.state = 569;
				this.match(JavaParser.COMMA);
				this.state = 570;
				this.constantDeclarator();
				}
				}
				this.state = 575;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 576;
			this.match(JavaParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public constantDeclarator(): ConstantDeclaratorContext {
		let _localctx: ConstantDeclaratorContext = new ConstantDeclaratorContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, JavaParser.RULE_constantDeclarator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 578;
			this.identifier();
			this.state = 583;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.LBRACK) {
				{
				{
				this.state = 579;
				this.match(JavaParser.LBRACK);
				this.state = 580;
				this.match(JavaParser.RBRACK);
				}
				}
				this.state = 585;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 586;
			this.match(JavaParser.ASSIGN);
			this.state = 587;
			this.variableInitializer();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public interfaceMethodDeclaration(): InterfaceMethodDeclarationContext {
		let _localctx: InterfaceMethodDeclarationContext = new InterfaceMethodDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, JavaParser.RULE_interfaceMethodDeclaration);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 592;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 53, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 589;
					this.interfaceMethodModifier();
					}
					}
				}
				this.state = 594;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 53, this._ctx);
			}
			this.state = 595;
			this.interfaceCommonBodyDeclaration();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public interfaceMethodModifier(): InterfaceMethodModifierContext {
		let _localctx: InterfaceMethodModifierContext = new InterfaceMethodModifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, JavaParser.RULE_interfaceMethodModifier);
		try {
			this.state = 603;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.AT:
			case JavaParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 597;
				this.annotation();
				}
				break;
			case JavaParser.PUBLIC:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 598;
				this.match(JavaParser.PUBLIC);
				}
				break;
			case JavaParser.ABSTRACT:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 599;
				this.match(JavaParser.ABSTRACT);
				}
				break;
			case JavaParser.DEFAULT:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 600;
				this.match(JavaParser.DEFAULT);
				}
				break;
			case JavaParser.STATIC:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 601;
				this.match(JavaParser.STATIC);
				}
				break;
			case JavaParser.STRICTFP:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 602;
				this.match(JavaParser.STRICTFP);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public genericInterfaceMethodDeclaration(): GenericInterfaceMethodDeclarationContext {
		let _localctx: GenericInterfaceMethodDeclarationContext = new GenericInterfaceMethodDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, JavaParser.RULE_genericInterfaceMethodDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 608;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.ABSTRACT || _la === JavaParser.DEFAULT || ((((_la - 35)) & ~0x1F) === 0 && ((1 << (_la - 35)) & ((1 << (JavaParser.PUBLIC - 35)) | (1 << (JavaParser.STATIC - 35)) | (1 << (JavaParser.STRICTFP - 35)) | (1 << (JavaParser.MODULE - 35)) | (1 << (JavaParser.OPEN - 35)) | (1 << (JavaParser.REQUIRES - 35)) | (1 << (JavaParser.EXPORTS - 35)) | (1 << (JavaParser.OPENS - 35)) | (1 << (JavaParser.TO - 35)) | (1 << (JavaParser.USES - 35)) | (1 << (JavaParser.PROVIDES - 35)) | (1 << (JavaParser.WITH - 35)) | (1 << (JavaParser.TRANSITIVE - 35)) | (1 << (JavaParser.VAR - 35)) | (1 << (JavaParser.YIELD - 35)) | (1 << (JavaParser.RECORD - 35)) | (1 << (JavaParser.SEALED - 35)) | (1 << (JavaParser.PERMITS - 35)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
				{
				{
				this.state = 605;
				this.interfaceMethodModifier();
				}
				}
				this.state = 610;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 611;
			this.typeParameters();
			this.state = 612;
			this.interfaceCommonBodyDeclaration();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public interfaceCommonBodyDeclaration(): InterfaceCommonBodyDeclarationContext {
		let _localctx: InterfaceCommonBodyDeclarationContext = new InterfaceCommonBodyDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, JavaParser.RULE_interfaceCommonBodyDeclaration);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 617;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 56, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 614;
					this.annotation();
					}
					}
				}
				this.state = 619;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 56, this._ctx);
			}
			this.state = 620;
			this.typeTypeOrVoid();
			this.state = 621;
			this.identifier();
			this.state = 622;
			this.formalParameters();
			this.state = 627;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.LBRACK) {
				{
				{
				this.state = 623;
				this.match(JavaParser.LBRACK);
				this.state = 624;
				this.match(JavaParser.RBRACK);
				}
				}
				this.state = 629;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 632;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.THROWS) {
				{
				this.state = 630;
				this.match(JavaParser.THROWS);
				this.state = 631;
				this.qualifiedNameList();
				}
			}

			this.state = 634;
			this.methodBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public variableDeclarators(): VariableDeclaratorsContext {
		let _localctx: VariableDeclaratorsContext = new VariableDeclaratorsContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, JavaParser.RULE_variableDeclarators);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 636;
			this.variableDeclarator();
			this.state = 641;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.COMMA) {
				{
				{
				this.state = 637;
				this.match(JavaParser.COMMA);
				this.state = 638;
				this.variableDeclarator();
				}
				}
				this.state = 643;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public variableDeclarator(): VariableDeclaratorContext {
		let _localctx: VariableDeclaratorContext = new VariableDeclaratorContext(this._ctx, this.state);
		this.enterRule(_localctx, 74, JavaParser.RULE_variableDeclarator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 644;
			this.variableDeclaratorId();
			this.state = 647;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.ASSIGN) {
				{
				this.state = 645;
				this.match(JavaParser.ASSIGN);
				this.state = 646;
				this.variableInitializer();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public variableDeclaratorId(): VariableDeclaratorIdContext {
		let _localctx: VariableDeclaratorIdContext = new VariableDeclaratorIdContext(this._ctx, this.state);
		this.enterRule(_localctx, 76, JavaParser.RULE_variableDeclaratorId);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 649;
			this.identifier();
			this.state = 654;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.LBRACK) {
				{
				{
				this.state = 650;
				this.match(JavaParser.LBRACK);
				this.state = 651;
				this.match(JavaParser.RBRACK);
				}
				}
				this.state = 656;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public variableInitializer(): VariableInitializerContext {
		let _localctx: VariableInitializerContext = new VariableInitializerContext(this._ctx, this.state);
		this.enterRule(_localctx, 78, JavaParser.RULE_variableInitializer);
		try {
			this.state = 659;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.LBRACE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 657;
				this.arrayInitializer();
				}
				break;
			case JavaParser.BOOLEAN:
			case JavaParser.BYTE:
			case JavaParser.CHAR:
			case JavaParser.DOUBLE:
			case JavaParser.FLOAT:
			case JavaParser.INT:
			case JavaParser.LONG:
			case JavaParser.NEW:
			case JavaParser.SHORT:
			case JavaParser.SUPER:
			case JavaParser.SWITCH:
			case JavaParser.THIS:
			case JavaParser.VOID:
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.DECIMAL_LITERAL:
			case JavaParser.HEX_LITERAL:
			case JavaParser.OCT_LITERAL:
			case JavaParser.BINARY_LITERAL:
			case JavaParser.FLOAT_LITERAL:
			case JavaParser.HEX_FLOAT_LITERAL:
			case JavaParser.BOOL_LITERAL:
			case JavaParser.CHAR_LITERAL:
			case JavaParser.STRING_LITERAL:
			case JavaParser.TEXT_BLOCK:
			case JavaParser.NULL_LITERAL:
			case JavaParser.LPAREN:
			case JavaParser.LT:
			case JavaParser.BANG:
			case JavaParser.TILDE:
			case JavaParser.INC:
			case JavaParser.DEC:
			case JavaParser.ADD:
			case JavaParser.SUB:
			case JavaParser.AT:
			case JavaParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 658;
				this.expression(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public arrayInitializer(): ArrayInitializerContext {
		let _localctx: ArrayInitializerContext = new ArrayInitializerContext(this._ctx, this.state);
		this.enterRule(_localctx, 80, JavaParser.RULE_arrayInitializer);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 661;
			this.match(JavaParser.LBRACE);
			this.state = 673;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.SUPER - 37)) | (1 << (JavaParser.SWITCH - 37)) | (1 << (JavaParser.THIS - 37)) | (1 << (JavaParser.VOID - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)) | (1 << (JavaParser.DECIMAL_LITERAL - 37)) | (1 << (JavaParser.HEX_LITERAL - 37)))) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (JavaParser.OCT_LITERAL - 69)) | (1 << (JavaParser.BINARY_LITERAL - 69)) | (1 << (JavaParser.FLOAT_LITERAL - 69)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 69)) | (1 << (JavaParser.BOOL_LITERAL - 69)) | (1 << (JavaParser.CHAR_LITERAL - 69)) | (1 << (JavaParser.STRING_LITERAL - 69)) | (1 << (JavaParser.TEXT_BLOCK - 69)) | (1 << (JavaParser.NULL_LITERAL - 69)) | (1 << (JavaParser.LPAREN - 69)) | (1 << (JavaParser.LBRACE - 69)) | (1 << (JavaParser.LT - 69)) | (1 << (JavaParser.BANG - 69)) | (1 << (JavaParser.TILDE - 69)) | (1 << (JavaParser.INC - 69)))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (JavaParser.DEC - 101)) | (1 << (JavaParser.ADD - 101)) | (1 << (JavaParser.SUB - 101)) | (1 << (JavaParser.AT - 101)) | (1 << (JavaParser.IDENTIFIER - 101)))) !== 0)) {
				{
				this.state = 662;
				this.variableInitializer();
				this.state = 667;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 63, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 663;
						this.match(JavaParser.COMMA);
						this.state = 664;
						this.variableInitializer();
						}
						}
					}
					this.state = 669;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 63, this._ctx);
				}
				this.state = 671;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.COMMA) {
					{
					this.state = 670;
					this.match(JavaParser.COMMA);
					}
				}

				}
			}

			this.state = 675;
			this.match(JavaParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public classOrInterfaceType(): ClassOrInterfaceTypeContext {
		let _localctx: ClassOrInterfaceTypeContext = new ClassOrInterfaceTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 82, JavaParser.RULE_classOrInterfaceType);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 685;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 67, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 677;
					this.identifier();
					this.state = 679;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === JavaParser.LT) {
						{
						this.state = 678;
						this.typeArguments();
						}
					}

					this.state = 681;
					this.match(JavaParser.DOT);
					}
					}
				}
				this.state = 687;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 67, this._ctx);
			}
			this.state = 688;
			this.typeIdentifier();
			this.state = 690;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 68, this._ctx) ) {
			case 1:
				{
				this.state = 689;
				this.typeArguments();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeArgument(): TypeArgumentContext {
		let _localctx: TypeArgumentContext = new TypeArgumentContext(this._ctx, this.state);
		this.enterRule(_localctx, 84, JavaParser.RULE_typeArgument);
		let _la: number;
		try {
			this.state = 704;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 71, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 692;
				this.typeType();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 696;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & ((1 << (JavaParser.MODULE - 51)) | (1 << (JavaParser.OPEN - 51)) | (1 << (JavaParser.REQUIRES - 51)) | (1 << (JavaParser.EXPORTS - 51)) | (1 << (JavaParser.OPENS - 51)) | (1 << (JavaParser.TO - 51)) | (1 << (JavaParser.USES - 51)) | (1 << (JavaParser.PROVIDES - 51)) | (1 << (JavaParser.WITH - 51)) | (1 << (JavaParser.TRANSITIVE - 51)) | (1 << (JavaParser.VAR - 51)) | (1 << (JavaParser.YIELD - 51)) | (1 << (JavaParser.RECORD - 51)) | (1 << (JavaParser.SEALED - 51)) | (1 << (JavaParser.PERMITS - 51)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
					{
					{
					this.state = 693;
					this.annotation();
					}
					}
					this.state = 698;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 699;
				this.match(JavaParser.QUESTION);
				this.state = 702;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.EXTENDS || _la === JavaParser.SUPER) {
					{
					this.state = 700;
					_la = this._input.LA(1);
					if (!(_la === JavaParser.EXTENDS || _la === JavaParser.SUPER)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					this.state = 701;
					this.typeType();
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public qualifiedNameList(): QualifiedNameListContext {
		let _localctx: QualifiedNameListContext = new QualifiedNameListContext(this._ctx, this.state);
		this.enterRule(_localctx, 86, JavaParser.RULE_qualifiedNameList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 706;
			this.qualifiedName();
			this.state = 711;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.COMMA) {
				{
				{
				this.state = 707;
				this.match(JavaParser.COMMA);
				this.state = 708;
				this.qualifiedName();
				}
				}
				this.state = 713;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public formalParameters(): FormalParametersContext {
		let _localctx: FormalParametersContext = new FormalParametersContext(this._ctx, this.state);
		this.enterRule(_localctx, 88, JavaParser.RULE_formalParameters);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 714;
			this.match(JavaParser.LPAREN);
			this.state = 726;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 76, this._ctx) ) {
			case 1:
				{
				this.state = 716;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
					{
					this.state = 715;
					this.receiverParameter();
					}
				}

				}
				break;

			case 2:
				{
				this.state = 718;
				this.receiverParameter();
				this.state = 721;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.COMMA) {
					{
					this.state = 719;
					this.match(JavaParser.COMMA);
					this.state = 720;
					this.formalParameterList();
					}
				}

				}
				break;

			case 3:
				{
				this.state = 724;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FINAL) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
					{
					this.state = 723;
					this.formalParameterList();
					}
				}

				}
				break;
			}
			this.state = 728;
			this.match(JavaParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public receiverParameter(): ReceiverParameterContext {
		let _localctx: ReceiverParameterContext = new ReceiverParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 90, JavaParser.RULE_receiverParameter);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 730;
			this.typeType();
			this.state = 736;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & ((1 << (JavaParser.MODULE - 51)) | (1 << (JavaParser.OPEN - 51)) | (1 << (JavaParser.REQUIRES - 51)) | (1 << (JavaParser.EXPORTS - 51)) | (1 << (JavaParser.OPENS - 51)) | (1 << (JavaParser.TO - 51)) | (1 << (JavaParser.USES - 51)) | (1 << (JavaParser.PROVIDES - 51)) | (1 << (JavaParser.WITH - 51)) | (1 << (JavaParser.TRANSITIVE - 51)) | (1 << (JavaParser.VAR - 51)) | (1 << (JavaParser.YIELD - 51)) | (1 << (JavaParser.RECORD - 51)) | (1 << (JavaParser.SEALED - 51)) | (1 << (JavaParser.PERMITS - 51)))) !== 0) || _la === JavaParser.IDENTIFIER) {
				{
				{
				this.state = 731;
				this.identifier();
				this.state = 732;
				this.match(JavaParser.DOT);
				}
				}
				this.state = 738;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 739;
			this.match(JavaParser.THIS);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public formalParameterList(): FormalParameterListContext {
		let _localctx: FormalParameterListContext = new FormalParameterListContext(this._ctx, this.state);
		this.enterRule(_localctx, 92, JavaParser.RULE_formalParameterList);
		let _la: number;
		try {
			let _alt: number;
			this.state = 754;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 80, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 741;
				this.formalParameter();
				this.state = 746;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 78, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 742;
						this.match(JavaParser.COMMA);
						this.state = 743;
						this.formalParameter();
						}
						}
					}
					this.state = 748;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 78, this._ctx);
				}
				this.state = 751;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.COMMA) {
					{
					this.state = 749;
					this.match(JavaParser.COMMA);
					this.state = 750;
					this.lastFormalParameter();
					}
				}

				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 753;
				this.lastFormalParameter();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public formalParameter(): FormalParameterContext {
		let _localctx: FormalParameterContext = new FormalParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 94, JavaParser.RULE_formalParameter);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 759;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 81, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 756;
					this.variableModifier();
					}
					}
				}
				this.state = 761;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 81, this._ctx);
			}
			this.state = 762;
			this.typeType();
			this.state = 763;
			this.variableDeclaratorId();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public lastFormalParameter(): LastFormalParameterContext {
		let _localctx: LastFormalParameterContext = new LastFormalParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 96, JavaParser.RULE_lastFormalParameter);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 768;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 82, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 765;
					this.variableModifier();
					}
					}
				}
				this.state = 770;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 82, this._ctx);
			}
			this.state = 771;
			this.typeType();
			this.state = 775;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & ((1 << (JavaParser.MODULE - 51)) | (1 << (JavaParser.OPEN - 51)) | (1 << (JavaParser.REQUIRES - 51)) | (1 << (JavaParser.EXPORTS - 51)) | (1 << (JavaParser.OPENS - 51)) | (1 << (JavaParser.TO - 51)) | (1 << (JavaParser.USES - 51)) | (1 << (JavaParser.PROVIDES - 51)) | (1 << (JavaParser.WITH - 51)) | (1 << (JavaParser.TRANSITIVE - 51)) | (1 << (JavaParser.VAR - 51)) | (1 << (JavaParser.YIELD - 51)) | (1 << (JavaParser.RECORD - 51)) | (1 << (JavaParser.SEALED - 51)) | (1 << (JavaParser.PERMITS - 51)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
				{
				{
				this.state = 772;
				this.annotation();
				}
				}
				this.state = 777;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 778;
			this.match(JavaParser.ELLIPSIS);
			this.state = 779;
			this.variableDeclaratorId();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public lambdaLVTIList(): LambdaLVTIListContext {
		let _localctx: LambdaLVTIListContext = new LambdaLVTIListContext(this._ctx, this.state);
		this.enterRule(_localctx, 98, JavaParser.RULE_lambdaLVTIList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 781;
			this.lambdaLVTIParameter();
			this.state = 786;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.COMMA) {
				{
				{
				this.state = 782;
				this.match(JavaParser.COMMA);
				this.state = 783;
				this.lambdaLVTIParameter();
				}
				}
				this.state = 788;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public lambdaLVTIParameter(): LambdaLVTIParameterContext {
		let _localctx: LambdaLVTIParameterContext = new LambdaLVTIParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 100, JavaParser.RULE_lambdaLVTIParameter);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 792;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 85, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 789;
					this.variableModifier();
					}
					}
				}
				this.state = 794;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 85, this._ctx);
			}
			this.state = 795;
			this.match(JavaParser.VAR);
			this.state = 796;
			this.identifier();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public qualifiedName(): QualifiedNameContext {
		let _localctx: QualifiedNameContext = new QualifiedNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 102, JavaParser.RULE_qualifiedName);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 798;
			this.identifier();
			this.state = 803;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 86, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 799;
					this.match(JavaParser.DOT);
					this.state = 800;
					this.identifier();
					}
					}
				}
				this.state = 805;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 86, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public literal(): LiteralContext {
		let _localctx: LiteralContext = new LiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 104, JavaParser.RULE_literal);
		try {
			this.state = 813;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.DECIMAL_LITERAL:
			case JavaParser.HEX_LITERAL:
			case JavaParser.OCT_LITERAL:
			case JavaParser.BINARY_LITERAL:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 806;
				this.integerLiteral();
				}
				break;
			case JavaParser.FLOAT_LITERAL:
			case JavaParser.HEX_FLOAT_LITERAL:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 807;
				this.floatLiteral();
				}
				break;
			case JavaParser.CHAR_LITERAL:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 808;
				this.match(JavaParser.CHAR_LITERAL);
				}
				break;
			case JavaParser.STRING_LITERAL:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 809;
				this.match(JavaParser.STRING_LITERAL);
				}
				break;
			case JavaParser.BOOL_LITERAL:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 810;
				this.match(JavaParser.BOOL_LITERAL);
				}
				break;
			case JavaParser.NULL_LITERAL:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 811;
				this.match(JavaParser.NULL_LITERAL);
				}
				break;
			case JavaParser.TEXT_BLOCK:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 812;
				this.match(JavaParser.TEXT_BLOCK);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public integerLiteral(): IntegerLiteralContext {
		let _localctx: IntegerLiteralContext = new IntegerLiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 106, JavaParser.RULE_integerLiteral);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 815;
			_la = this._input.LA(1);
			if (!(((((_la - 67)) & ~0x1F) === 0 && ((1 << (_la - 67)) & ((1 << (JavaParser.DECIMAL_LITERAL - 67)) | (1 << (JavaParser.HEX_LITERAL - 67)) | (1 << (JavaParser.OCT_LITERAL - 67)) | (1 << (JavaParser.BINARY_LITERAL - 67)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public floatLiteral(): FloatLiteralContext {
		let _localctx: FloatLiteralContext = new FloatLiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 108, JavaParser.RULE_floatLiteral);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 817;
			_la = this._input.LA(1);
			if (!(_la === JavaParser.FLOAT_LITERAL || _la === JavaParser.HEX_FLOAT_LITERAL)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public altAnnotationQualifiedName(): AltAnnotationQualifiedNameContext {
		let _localctx: AltAnnotationQualifiedNameContext = new AltAnnotationQualifiedNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 110, JavaParser.RULE_altAnnotationQualifiedName);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 824;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & ((1 << (JavaParser.MODULE - 51)) | (1 << (JavaParser.OPEN - 51)) | (1 << (JavaParser.REQUIRES - 51)) | (1 << (JavaParser.EXPORTS - 51)) | (1 << (JavaParser.OPENS - 51)) | (1 << (JavaParser.TO - 51)) | (1 << (JavaParser.USES - 51)) | (1 << (JavaParser.PROVIDES - 51)) | (1 << (JavaParser.WITH - 51)) | (1 << (JavaParser.TRANSITIVE - 51)) | (1 << (JavaParser.VAR - 51)) | (1 << (JavaParser.YIELD - 51)) | (1 << (JavaParser.RECORD - 51)) | (1 << (JavaParser.SEALED - 51)) | (1 << (JavaParser.PERMITS - 51)))) !== 0) || _la === JavaParser.IDENTIFIER) {
				{
				{
				this.state = 819;
				this.identifier();
				this.state = 820;
				this.match(JavaParser.DOT);
				}
				}
				this.state = 826;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 827;
			this.match(JavaParser.AT);
			this.state = 828;
			this.identifier();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public annotation(): AnnotationContext {
		let _localctx: AnnotationContext = new AnnotationContext(this._ctx, this.state);
		this.enterRule(_localctx, 112, JavaParser.RULE_annotation);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 833;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 89, this._ctx) ) {
			case 1:
				{
				this.state = 830;
				this.match(JavaParser.AT);
				this.state = 831;
				this.qualifiedName();
				}
				break;

			case 2:
				{
				this.state = 832;
				this.altAnnotationQualifiedName();
				}
				break;
			}
			this.state = 841;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.LPAREN) {
				{
				this.state = 835;
				this.match(JavaParser.LPAREN);
				this.state = 838;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 90, this._ctx) ) {
				case 1:
					{
					this.state = 836;
					this.elementValuePairs();
					}
					break;

				case 2:
					{
					this.state = 837;
					this.elementValue();
					}
					break;
				}
				this.state = 840;
				this.match(JavaParser.RPAREN);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public elementValuePairs(): ElementValuePairsContext {
		let _localctx: ElementValuePairsContext = new ElementValuePairsContext(this._ctx, this.state);
		this.enterRule(_localctx, 114, JavaParser.RULE_elementValuePairs);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 843;
			this.elementValuePair();
			this.state = 848;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.COMMA) {
				{
				{
				this.state = 844;
				this.match(JavaParser.COMMA);
				this.state = 845;
				this.elementValuePair();
				}
				}
				this.state = 850;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public elementValuePair(): ElementValuePairContext {
		let _localctx: ElementValuePairContext = new ElementValuePairContext(this._ctx, this.state);
		this.enterRule(_localctx, 116, JavaParser.RULE_elementValuePair);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 851;
			this.identifier();
			this.state = 852;
			this.match(JavaParser.ASSIGN);
			this.state = 853;
			this.elementValue();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public elementValue(): ElementValueContext {
		let _localctx: ElementValueContext = new ElementValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 118, JavaParser.RULE_elementValue);
		try {
			this.state = 858;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 93, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 855;
				this.expression(0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 856;
				this.annotation();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 857;
				this.elementValueArrayInitializer();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public elementValueArrayInitializer(): ElementValueArrayInitializerContext {
		let _localctx: ElementValueArrayInitializerContext = new ElementValueArrayInitializerContext(this._ctx, this.state);
		this.enterRule(_localctx, 120, JavaParser.RULE_elementValueArrayInitializer);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 860;
			this.match(JavaParser.LBRACE);
			this.state = 869;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.SUPER - 37)) | (1 << (JavaParser.SWITCH - 37)) | (1 << (JavaParser.THIS - 37)) | (1 << (JavaParser.VOID - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)) | (1 << (JavaParser.DECIMAL_LITERAL - 37)) | (1 << (JavaParser.HEX_LITERAL - 37)))) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (JavaParser.OCT_LITERAL - 69)) | (1 << (JavaParser.BINARY_LITERAL - 69)) | (1 << (JavaParser.FLOAT_LITERAL - 69)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 69)) | (1 << (JavaParser.BOOL_LITERAL - 69)) | (1 << (JavaParser.CHAR_LITERAL - 69)) | (1 << (JavaParser.STRING_LITERAL - 69)) | (1 << (JavaParser.TEXT_BLOCK - 69)) | (1 << (JavaParser.NULL_LITERAL - 69)) | (1 << (JavaParser.LPAREN - 69)) | (1 << (JavaParser.LBRACE - 69)) | (1 << (JavaParser.LT - 69)) | (1 << (JavaParser.BANG - 69)) | (1 << (JavaParser.TILDE - 69)) | (1 << (JavaParser.INC - 69)))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (JavaParser.DEC - 101)) | (1 << (JavaParser.ADD - 101)) | (1 << (JavaParser.SUB - 101)) | (1 << (JavaParser.AT - 101)) | (1 << (JavaParser.IDENTIFIER - 101)))) !== 0)) {
				{
				this.state = 861;
				this.elementValue();
				this.state = 866;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 94, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 862;
						this.match(JavaParser.COMMA);
						this.state = 863;
						this.elementValue();
						}
						}
					}
					this.state = 868;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 94, this._ctx);
				}
				}
			}

			this.state = 872;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.COMMA) {
				{
				this.state = 871;
				this.match(JavaParser.COMMA);
				}
			}

			this.state = 874;
			this.match(JavaParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public annotationTypeDeclaration(): AnnotationTypeDeclarationContext {
		let _localctx: AnnotationTypeDeclarationContext = new AnnotationTypeDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 122, JavaParser.RULE_annotationTypeDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 876;
			this.match(JavaParser.AT);
			this.state = 877;
			this.match(JavaParser.INTERFACE);
			this.state = 878;
			this.identifier();
			this.state = 879;
			this.annotationTypeBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public annotationTypeBody(): AnnotationTypeBodyContext {
		let _localctx: AnnotationTypeBodyContext = new AnnotationTypeBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 124, JavaParser.RULE_annotationTypeBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 881;
			this.match(JavaParser.LBRACE);
			this.state = 885;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.ABSTRACT) | (1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.CLASS) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.ENUM) | (1 << JavaParser.FINAL) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.INTERFACE) | (1 << JavaParser.LONG) | (1 << JavaParser.NATIVE))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (JavaParser.PRIVATE - 33)) | (1 << (JavaParser.PROTECTED - 33)) | (1 << (JavaParser.PUBLIC - 33)) | (1 << (JavaParser.SHORT - 33)) | (1 << (JavaParser.STATIC - 33)) | (1 << (JavaParser.STRICTFP - 33)) | (1 << (JavaParser.SYNCHRONIZED - 33)) | (1 << (JavaParser.TRANSIENT - 33)) | (1 << (JavaParser.VOLATILE - 33)) | (1 << (JavaParser.MODULE - 33)) | (1 << (JavaParser.OPEN - 33)) | (1 << (JavaParser.REQUIRES - 33)) | (1 << (JavaParser.EXPORTS - 33)) | (1 << (JavaParser.OPENS - 33)) | (1 << (JavaParser.TO - 33)) | (1 << (JavaParser.USES - 33)) | (1 << (JavaParser.PROVIDES - 33)) | (1 << (JavaParser.WITH - 33)) | (1 << (JavaParser.TRANSITIVE - 33)) | (1 << (JavaParser.VAR - 33)) | (1 << (JavaParser.YIELD - 33)) | (1 << (JavaParser.RECORD - 33)) | (1 << (JavaParser.SEALED - 33)))) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & ((1 << (JavaParser.PERMITS - 65)) | (1 << (JavaParser.NON_SEALED - 65)) | (1 << (JavaParser.SEMI - 65)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
				{
				{
				this.state = 882;
				this.annotationTypeElementDeclaration();
				}
				}
				this.state = 887;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 888;
			this.match(JavaParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public annotationTypeElementDeclaration(): AnnotationTypeElementDeclarationContext {
		let _localctx: AnnotationTypeElementDeclarationContext = new AnnotationTypeElementDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 126, JavaParser.RULE_annotationTypeElementDeclaration);
		try {
			let _alt: number;
			this.state = 898;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.ABSTRACT:
			case JavaParser.BOOLEAN:
			case JavaParser.BYTE:
			case JavaParser.CHAR:
			case JavaParser.CLASS:
			case JavaParser.DOUBLE:
			case JavaParser.ENUM:
			case JavaParser.FINAL:
			case JavaParser.FLOAT:
			case JavaParser.INT:
			case JavaParser.INTERFACE:
			case JavaParser.LONG:
			case JavaParser.NATIVE:
			case JavaParser.PRIVATE:
			case JavaParser.PROTECTED:
			case JavaParser.PUBLIC:
			case JavaParser.SHORT:
			case JavaParser.STATIC:
			case JavaParser.STRICTFP:
			case JavaParser.SYNCHRONIZED:
			case JavaParser.TRANSIENT:
			case JavaParser.VOLATILE:
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.NON_SEALED:
			case JavaParser.AT:
			case JavaParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 893;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 98, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 890;
						this.modifier();
						}
						}
					}
					this.state = 895;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 98, this._ctx);
				}
				this.state = 896;
				this.annotationTypeElementRest();
				}
				break;
			case JavaParser.SEMI:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 897;
				this.match(JavaParser.SEMI);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public annotationTypeElementRest(): AnnotationTypeElementRestContext {
		let _localctx: AnnotationTypeElementRestContext = new AnnotationTypeElementRestContext(this._ctx, this.state);
		this.enterRule(_localctx, 128, JavaParser.RULE_annotationTypeElementRest);
		try {
			this.state = 924;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 105, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 900;
				this.typeType();
				this.state = 901;
				this.annotationMethodOrConstantRest();
				this.state = 902;
				this.match(JavaParser.SEMI);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 904;
				this.classDeclaration();
				this.state = 906;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 100, this._ctx) ) {
				case 1:
					{
					this.state = 905;
					this.match(JavaParser.SEMI);
					}
					break;
				}
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 908;
				this.interfaceDeclaration();
				this.state = 910;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 101, this._ctx) ) {
				case 1:
					{
					this.state = 909;
					this.match(JavaParser.SEMI);
					}
					break;
				}
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 912;
				this.enumDeclaration();
				this.state = 914;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 102, this._ctx) ) {
				case 1:
					{
					this.state = 913;
					this.match(JavaParser.SEMI);
					}
					break;
				}
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 916;
				this.annotationTypeDeclaration();
				this.state = 918;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 103, this._ctx) ) {
				case 1:
					{
					this.state = 917;
					this.match(JavaParser.SEMI);
					}
					break;
				}
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 920;
				this.recordDeclaration();
				this.state = 922;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 104, this._ctx) ) {
				case 1:
					{
					this.state = 921;
					this.match(JavaParser.SEMI);
					}
					break;
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public annotationMethodOrConstantRest(): AnnotationMethodOrConstantRestContext {
		let _localctx: AnnotationMethodOrConstantRestContext = new AnnotationMethodOrConstantRestContext(this._ctx, this.state);
		this.enterRule(_localctx, 130, JavaParser.RULE_annotationMethodOrConstantRest);
		try {
			this.state = 928;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 106, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 926;
				this.annotationMethodRest();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 927;
				this.annotationConstantRest();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public annotationMethodRest(): AnnotationMethodRestContext {
		let _localctx: AnnotationMethodRestContext = new AnnotationMethodRestContext(this._ctx, this.state);
		this.enterRule(_localctx, 132, JavaParser.RULE_annotationMethodRest);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 930;
			this.identifier();
			this.state = 931;
			this.match(JavaParser.LPAREN);
			this.state = 932;
			this.match(JavaParser.RPAREN);
			this.state = 934;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.DEFAULT) {
				{
				this.state = 933;
				this.defaultValue();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public annotationConstantRest(): AnnotationConstantRestContext {
		let _localctx: AnnotationConstantRestContext = new AnnotationConstantRestContext(this._ctx, this.state);
		this.enterRule(_localctx, 134, JavaParser.RULE_annotationConstantRest);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 936;
			this.variableDeclarators();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public defaultValue(): DefaultValueContext {
		let _localctx: DefaultValueContext = new DefaultValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 136, JavaParser.RULE_defaultValue);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 938;
			this.match(JavaParser.DEFAULT);
			this.state = 939;
			this.elementValue();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public moduleDeclaration(): ModuleDeclarationContext {
		let _localctx: ModuleDeclarationContext = new ModuleDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 138, JavaParser.RULE_moduleDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 942;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.OPEN) {
				{
				this.state = 941;
				this.match(JavaParser.OPEN);
				}
			}

			this.state = 944;
			this.match(JavaParser.MODULE);
			this.state = 945;
			this.qualifiedName();
			this.state = 946;
			this.moduleBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public moduleBody(): ModuleBodyContext {
		let _localctx: ModuleBodyContext = new ModuleBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 140, JavaParser.RULE_moduleBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 948;
			this.match(JavaParser.LBRACE);
			this.state = 952;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & ((1 << (JavaParser.REQUIRES - 53)) | (1 << (JavaParser.EXPORTS - 53)) | (1 << (JavaParser.OPENS - 53)) | (1 << (JavaParser.USES - 53)) | (1 << (JavaParser.PROVIDES - 53)))) !== 0)) {
				{
				{
				this.state = 949;
				this.moduleDirective();
				}
				}
				this.state = 954;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 955;
			this.match(JavaParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public moduleDirective(): ModuleDirectiveContext {
		let _localctx: ModuleDirectiveContext = new ModuleDirectiveContext(this._ctx, this.state);
		this.enterRule(_localctx, 142, JavaParser.RULE_moduleDirective);
		let _la: number;
		try {
			let _alt: number;
			this.state = 993;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.REQUIRES:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 957;
				this.match(JavaParser.REQUIRES);
				this.state = 961;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 110, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 958;
						this.requiresModifier();
						}
						}
					}
					this.state = 963;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 110, this._ctx);
				}
				this.state = 964;
				this.qualifiedName();
				this.state = 965;
				this.match(JavaParser.SEMI);
				}
				break;
			case JavaParser.EXPORTS:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 967;
				this.match(JavaParser.EXPORTS);
				this.state = 968;
				this.qualifiedName();
				this.state = 971;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.TO) {
					{
					this.state = 969;
					this.match(JavaParser.TO);
					this.state = 970;
					this.qualifiedName();
					}
				}

				this.state = 973;
				this.match(JavaParser.SEMI);
				}
				break;
			case JavaParser.OPENS:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 975;
				this.match(JavaParser.OPENS);
				this.state = 976;
				this.qualifiedName();
				this.state = 979;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.TO) {
					{
					this.state = 977;
					this.match(JavaParser.TO);
					this.state = 978;
					this.qualifiedName();
					}
				}

				this.state = 981;
				this.match(JavaParser.SEMI);
				}
				break;
			case JavaParser.USES:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 983;
				this.match(JavaParser.USES);
				this.state = 984;
				this.qualifiedName();
				this.state = 985;
				this.match(JavaParser.SEMI);
				}
				break;
			case JavaParser.PROVIDES:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 987;
				this.match(JavaParser.PROVIDES);
				this.state = 988;
				this.qualifiedName();
				this.state = 989;
				this.match(JavaParser.WITH);
				this.state = 990;
				this.qualifiedName();
				this.state = 991;
				this.match(JavaParser.SEMI);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public requiresModifier(): RequiresModifierContext {
		let _localctx: RequiresModifierContext = new RequiresModifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 144, JavaParser.RULE_requiresModifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 995;
			_la = this._input.LA(1);
			if (!(_la === JavaParser.STATIC || _la === JavaParser.TRANSITIVE)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recordDeclaration(): RecordDeclarationContext {
		let _localctx: RecordDeclarationContext = new RecordDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 146, JavaParser.RULE_recordDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 997;
			this.match(JavaParser.RECORD);
			this.state = 998;
			this.identifier();
			this.state = 1000;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.LT) {
				{
				this.state = 999;
				this.typeParameters();
				}
			}

			this.state = 1002;
			this.recordHeader();
			this.state = 1005;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.IMPLEMENTS) {
				{
				this.state = 1003;
				this.match(JavaParser.IMPLEMENTS);
				this.state = 1004;
				this.typeList();
				}
			}

			this.state = 1007;
			this.recordBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recordHeader(): RecordHeaderContext {
		let _localctx: RecordHeaderContext = new RecordHeaderContext(this._ctx, this.state);
		this.enterRule(_localctx, 148, JavaParser.RULE_recordHeader);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1009;
			this.match(JavaParser.LPAREN);
			this.state = 1011;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
				{
				this.state = 1010;
				this.recordComponentList();
				}
			}

			this.state = 1013;
			this.match(JavaParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recordComponentList(): RecordComponentListContext {
		let _localctx: RecordComponentListContext = new RecordComponentListContext(this._ctx, this.state);
		this.enterRule(_localctx, 150, JavaParser.RULE_recordComponentList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1015;
			this.recordComponent();
			this.state = 1020;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.COMMA) {
				{
				{
				this.state = 1016;
				this.match(JavaParser.COMMA);
				this.state = 1017;
				this.recordComponent();
				}
				}
				this.state = 1022;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recordComponent(): RecordComponentContext {
		let _localctx: RecordComponentContext = new RecordComponentContext(this._ctx, this.state);
		this.enterRule(_localctx, 152, JavaParser.RULE_recordComponent);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1023;
			this.typeType();
			this.state = 1024;
			this.identifier();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recordBody(): RecordBodyContext {
		let _localctx: RecordBodyContext = new RecordBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 154, JavaParser.RULE_recordBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1026;
			this.match(JavaParser.LBRACE);
			this.state = 1031;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.ABSTRACT) | (1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.CLASS) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.ENUM) | (1 << JavaParser.FINAL) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.INTERFACE) | (1 << JavaParser.LONG) | (1 << JavaParser.NATIVE))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (JavaParser.PRIVATE - 33)) | (1 << (JavaParser.PROTECTED - 33)) | (1 << (JavaParser.PUBLIC - 33)) | (1 << (JavaParser.SHORT - 33)) | (1 << (JavaParser.STATIC - 33)) | (1 << (JavaParser.STRICTFP - 33)) | (1 << (JavaParser.SYNCHRONIZED - 33)) | (1 << (JavaParser.TRANSIENT - 33)) | (1 << (JavaParser.VOID - 33)) | (1 << (JavaParser.VOLATILE - 33)) | (1 << (JavaParser.MODULE - 33)) | (1 << (JavaParser.OPEN - 33)) | (1 << (JavaParser.REQUIRES - 33)) | (1 << (JavaParser.EXPORTS - 33)) | (1 << (JavaParser.OPENS - 33)) | (1 << (JavaParser.TO - 33)) | (1 << (JavaParser.USES - 33)) | (1 << (JavaParser.PROVIDES - 33)) | (1 << (JavaParser.WITH - 33)) | (1 << (JavaParser.TRANSITIVE - 33)) | (1 << (JavaParser.VAR - 33)) | (1 << (JavaParser.YIELD - 33)) | (1 << (JavaParser.RECORD - 33)) | (1 << (JavaParser.SEALED - 33)))) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & ((1 << (JavaParser.PERMITS - 65)) | (1 << (JavaParser.NON_SEALED - 65)) | (1 << (JavaParser.LBRACE - 65)) | (1 << (JavaParser.SEMI - 65)) | (1 << (JavaParser.LT - 65)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
				{
				this.state = 1029;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 118, this._ctx) ) {
				case 1:
					{
					this.state = 1027;
					this.classBodyDeclaration();
					}
					break;

				case 2:
					{
					this.state = 1028;
					this.compactConstructorDeclaration();
					}
					break;
				}
				}
				this.state = 1033;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1034;
			this.match(JavaParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public block(): BlockContext {
		let _localctx: BlockContext = new BlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 156, JavaParser.RULE_block);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1036;
			this.match(JavaParser.LBRACE);
			this.state = 1040;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.ABSTRACT) | (1 << JavaParser.ASSERT) | (1 << JavaParser.BOOLEAN) | (1 << JavaParser.BREAK) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.CLASS) | (1 << JavaParser.CONTINUE) | (1 << JavaParser.DO) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FINAL) | (1 << JavaParser.FLOAT) | (1 << JavaParser.FOR) | (1 << JavaParser.IF) | (1 << JavaParser.INT) | (1 << JavaParser.INTERFACE) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (JavaParser.PRIVATE - 33)) | (1 << (JavaParser.PROTECTED - 33)) | (1 << (JavaParser.PUBLIC - 33)) | (1 << (JavaParser.RETURN - 33)) | (1 << (JavaParser.SHORT - 33)) | (1 << (JavaParser.STATIC - 33)) | (1 << (JavaParser.STRICTFP - 33)) | (1 << (JavaParser.SUPER - 33)) | (1 << (JavaParser.SWITCH - 33)) | (1 << (JavaParser.SYNCHRONIZED - 33)) | (1 << (JavaParser.THIS - 33)) | (1 << (JavaParser.THROW - 33)) | (1 << (JavaParser.TRY - 33)) | (1 << (JavaParser.VOID - 33)) | (1 << (JavaParser.WHILE - 33)) | (1 << (JavaParser.MODULE - 33)) | (1 << (JavaParser.OPEN - 33)) | (1 << (JavaParser.REQUIRES - 33)) | (1 << (JavaParser.EXPORTS - 33)) | (1 << (JavaParser.OPENS - 33)) | (1 << (JavaParser.TO - 33)) | (1 << (JavaParser.USES - 33)) | (1 << (JavaParser.PROVIDES - 33)) | (1 << (JavaParser.WITH - 33)) | (1 << (JavaParser.TRANSITIVE - 33)) | (1 << (JavaParser.VAR - 33)) | (1 << (JavaParser.YIELD - 33)) | (1 << (JavaParser.RECORD - 33)) | (1 << (JavaParser.SEALED - 33)))) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & ((1 << (JavaParser.PERMITS - 65)) | (1 << (JavaParser.NON_SEALED - 65)) | (1 << (JavaParser.DECIMAL_LITERAL - 65)) | (1 << (JavaParser.HEX_LITERAL - 65)) | (1 << (JavaParser.OCT_LITERAL - 65)) | (1 << (JavaParser.BINARY_LITERAL - 65)) | (1 << (JavaParser.FLOAT_LITERAL - 65)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 65)) | (1 << (JavaParser.BOOL_LITERAL - 65)) | (1 << (JavaParser.CHAR_LITERAL - 65)) | (1 << (JavaParser.STRING_LITERAL - 65)) | (1 << (JavaParser.TEXT_BLOCK - 65)) | (1 << (JavaParser.NULL_LITERAL - 65)) | (1 << (JavaParser.LPAREN - 65)) | (1 << (JavaParser.LBRACE - 65)) | (1 << (JavaParser.SEMI - 65)) | (1 << (JavaParser.LT - 65)) | (1 << (JavaParser.BANG - 65)) | (1 << (JavaParser.TILDE - 65)))) !== 0) || ((((_la - 100)) & ~0x1F) === 0 && ((1 << (_la - 100)) & ((1 << (JavaParser.INC - 100)) | (1 << (JavaParser.DEC - 100)) | (1 << (JavaParser.ADD - 100)) | (1 << (JavaParser.SUB - 100)) | (1 << (JavaParser.AT - 100)) | (1 << (JavaParser.IDENTIFIER - 100)))) !== 0)) {
				{
				{
				this.state = 1037;
				this.blockStatement();
				}
				}
				this.state = 1042;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1043;
			this.match(JavaParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public blockStatement(): BlockStatementContext {
		let _localctx: BlockStatementContext = new BlockStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 158, JavaParser.RULE_blockStatement);
		try {
			this.state = 1050;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 121, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1045;
				this.localVariableDeclaration();
				this.state = 1046;
				this.match(JavaParser.SEMI);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1048;
				this.localTypeDeclaration();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1049;
				this.statement();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public localVariableDeclaration(): LocalVariableDeclarationContext {
		let _localctx: LocalVariableDeclarationContext = new LocalVariableDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 160, JavaParser.RULE_localVariableDeclaration);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1055;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 122, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1052;
					this.variableModifier();
					}
					}
				}
				this.state = 1057;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 122, this._ctx);
			}
			this.state = 1066;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 123, this._ctx) ) {
			case 1:
				{
				this.state = 1058;
				this.match(JavaParser.VAR);
				this.state = 1059;
				this.identifier();
				this.state = 1060;
				this.match(JavaParser.ASSIGN);
				this.state = 1061;
				this.expression(0);
				}
				break;

			case 2:
				{
				this.state = 1063;
				this.typeType();
				this.state = 1064;
				this.variableDeclarators();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public identifier(): IdentifierContext {
		let _localctx: IdentifierContext = new IdentifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 162, JavaParser.RULE_identifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1068;
			_la = this._input.LA(1);
			if (!(((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & ((1 << (JavaParser.MODULE - 51)) | (1 << (JavaParser.OPEN - 51)) | (1 << (JavaParser.REQUIRES - 51)) | (1 << (JavaParser.EXPORTS - 51)) | (1 << (JavaParser.OPENS - 51)) | (1 << (JavaParser.TO - 51)) | (1 << (JavaParser.USES - 51)) | (1 << (JavaParser.PROVIDES - 51)) | (1 << (JavaParser.WITH - 51)) | (1 << (JavaParser.TRANSITIVE - 51)) | (1 << (JavaParser.VAR - 51)) | (1 << (JavaParser.YIELD - 51)) | (1 << (JavaParser.RECORD - 51)) | (1 << (JavaParser.SEALED - 51)) | (1 << (JavaParser.PERMITS - 51)))) !== 0) || _la === JavaParser.IDENTIFIER)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeIdentifier(): TypeIdentifierContext {
		let _localctx: TypeIdentifierContext = new TypeIdentifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 164, JavaParser.RULE_typeIdentifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1070;
			_la = this._input.LA(1);
			if (!(((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & ((1 << (JavaParser.MODULE - 51)) | (1 << (JavaParser.OPEN - 51)) | (1 << (JavaParser.REQUIRES - 51)) | (1 << (JavaParser.EXPORTS - 51)) | (1 << (JavaParser.OPENS - 51)) | (1 << (JavaParser.TO - 51)) | (1 << (JavaParser.USES - 51)) | (1 << (JavaParser.PROVIDES - 51)) | (1 << (JavaParser.WITH - 51)) | (1 << (JavaParser.TRANSITIVE - 51)) | (1 << (JavaParser.RECORD - 51)) | (1 << (JavaParser.SEALED - 51)) | (1 << (JavaParser.PERMITS - 51)))) !== 0) || _la === JavaParser.IDENTIFIER)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public localTypeDeclaration(): LocalTypeDeclarationContext {
		let _localctx: LocalTypeDeclarationContext = new LocalTypeDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 166, JavaParser.RULE_localTypeDeclaration);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1075;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 124, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1072;
					this.classOrInterfaceModifier();
					}
					}
				}
				this.state = 1077;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 124, this._ctx);
			}
			this.state = 1081;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.CLASS:
				{
				this.state = 1078;
				this.classDeclaration();
				}
				break;
			case JavaParser.INTERFACE:
				{
				this.state = 1079;
				this.interfaceDeclaration();
				}
				break;
			case JavaParser.RECORD:
				{
				this.state = 1080;
				this.recordDeclaration();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public statement(): StatementContext {
		let _localctx: StatementContext = new StatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 168, JavaParser.RULE_statement);
		let _la: number;
		try {
			let _alt: number;
			this.state = 1196;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 139, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1083;
				_localctx._blockLabel = this.block();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1084;
				this.match(JavaParser.ASSERT);
				this.state = 1085;
				this.expression(0);
				this.state = 1088;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.COLON) {
					{
					this.state = 1086;
					this.match(JavaParser.COLON);
					this.state = 1087;
					this.expression(0);
					}
				}

				this.state = 1090;
				this.match(JavaParser.SEMI);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1092;
				this.match(JavaParser.IF);
				this.state = 1093;
				this.parExpression();
				this.state = 1094;
				this.statement();
				this.state = 1097;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 127, this._ctx) ) {
				case 1:
					{
					this.state = 1095;
					this.match(JavaParser.ELSE);
					this.state = 1096;
					this.statement();
					}
					break;
				}
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1099;
				this.match(JavaParser.FOR);
				this.state = 1100;
				this.match(JavaParser.LPAREN);
				this.state = 1101;
				this.forControl();
				this.state = 1102;
				this.match(JavaParser.RPAREN);
				this.state = 1103;
				this.statement();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 1105;
				this.match(JavaParser.WHILE);
				this.state = 1106;
				this.parExpression();
				this.state = 1107;
				this.statement();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 1109;
				this.match(JavaParser.DO);
				this.state = 1110;
				this.statement();
				this.state = 1111;
				this.match(JavaParser.WHILE);
				this.state = 1112;
				this.parExpression();
				this.state = 1113;
				this.match(JavaParser.SEMI);
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 1115;
				this.match(JavaParser.TRY);
				this.state = 1116;
				this.block();
				this.state = 1126;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case JavaParser.CATCH:
					{
					this.state = 1118;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					do {
						{
						{
						this.state = 1117;
						this.catchClause();
						}
						}
						this.state = 1120;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					} while (_la === JavaParser.CATCH);
					this.state = 1123;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === JavaParser.FINALLY) {
						{
						this.state = 1122;
						this.finallyBlock();
						}
					}

					}
					break;
				case JavaParser.FINALLY:
					{
					this.state = 1125;
					this.finallyBlock();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 1128;
				this.match(JavaParser.TRY);
				this.state = 1129;
				this.resourceSpecification();
				this.state = 1130;
				this.block();
				this.state = 1134;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === JavaParser.CATCH) {
					{
					{
					this.state = 1131;
					this.catchClause();
					}
					}
					this.state = 1136;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1138;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.FINALLY) {
					{
					this.state = 1137;
					this.finallyBlock();
					}
				}

				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 1140;
				this.match(JavaParser.SWITCH);
				this.state = 1141;
				this.parExpression();
				this.state = 1142;
				this.match(JavaParser.LBRACE);
				this.state = 1146;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 133, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1143;
						this.switchBlockStatementGroup();
						}
						}
					}
					this.state = 1148;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 133, this._ctx);
				}
				this.state = 1152;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === JavaParser.CASE || _la === JavaParser.DEFAULT) {
					{
					{
					this.state = 1149;
					this.switchLabel();
					}
					}
					this.state = 1154;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1155;
				this.match(JavaParser.RBRACE);
				}
				break;

			case 10:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 1157;
				this.match(JavaParser.SYNCHRONIZED);
				this.state = 1158;
				this.parExpression();
				this.state = 1159;
				this.block();
				}
				break;

			case 11:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 1161;
				this.match(JavaParser.RETURN);
				this.state = 1163;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.SUPER - 37)) | (1 << (JavaParser.SWITCH - 37)) | (1 << (JavaParser.THIS - 37)) | (1 << (JavaParser.VOID - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)) | (1 << (JavaParser.DECIMAL_LITERAL - 37)) | (1 << (JavaParser.HEX_LITERAL - 37)))) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (JavaParser.OCT_LITERAL - 69)) | (1 << (JavaParser.BINARY_LITERAL - 69)) | (1 << (JavaParser.FLOAT_LITERAL - 69)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 69)) | (1 << (JavaParser.BOOL_LITERAL - 69)) | (1 << (JavaParser.CHAR_LITERAL - 69)) | (1 << (JavaParser.STRING_LITERAL - 69)) | (1 << (JavaParser.TEXT_BLOCK - 69)) | (1 << (JavaParser.NULL_LITERAL - 69)) | (1 << (JavaParser.LPAREN - 69)) | (1 << (JavaParser.LT - 69)) | (1 << (JavaParser.BANG - 69)) | (1 << (JavaParser.TILDE - 69)) | (1 << (JavaParser.INC - 69)))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (JavaParser.DEC - 101)) | (1 << (JavaParser.ADD - 101)) | (1 << (JavaParser.SUB - 101)) | (1 << (JavaParser.AT - 101)) | (1 << (JavaParser.IDENTIFIER - 101)))) !== 0)) {
					{
					this.state = 1162;
					this.expression(0);
					}
				}

				this.state = 1165;
				this.match(JavaParser.SEMI);
				}
				break;

			case 12:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 1166;
				this.match(JavaParser.THROW);
				this.state = 1167;
				this.expression(0);
				this.state = 1168;
				this.match(JavaParser.SEMI);
				}
				break;

			case 13:
				this.enterOuterAlt(_localctx, 13);
				{
				this.state = 1170;
				this.match(JavaParser.BREAK);
				this.state = 1172;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & ((1 << (JavaParser.MODULE - 51)) | (1 << (JavaParser.OPEN - 51)) | (1 << (JavaParser.REQUIRES - 51)) | (1 << (JavaParser.EXPORTS - 51)) | (1 << (JavaParser.OPENS - 51)) | (1 << (JavaParser.TO - 51)) | (1 << (JavaParser.USES - 51)) | (1 << (JavaParser.PROVIDES - 51)) | (1 << (JavaParser.WITH - 51)) | (1 << (JavaParser.TRANSITIVE - 51)) | (1 << (JavaParser.VAR - 51)) | (1 << (JavaParser.YIELD - 51)) | (1 << (JavaParser.RECORD - 51)) | (1 << (JavaParser.SEALED - 51)) | (1 << (JavaParser.PERMITS - 51)))) !== 0) || _la === JavaParser.IDENTIFIER) {
					{
					this.state = 1171;
					this.identifier();
					}
				}

				this.state = 1174;
				this.match(JavaParser.SEMI);
				}
				break;

			case 14:
				this.enterOuterAlt(_localctx, 14);
				{
				this.state = 1175;
				this.match(JavaParser.CONTINUE);
				this.state = 1177;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & ((1 << (JavaParser.MODULE - 51)) | (1 << (JavaParser.OPEN - 51)) | (1 << (JavaParser.REQUIRES - 51)) | (1 << (JavaParser.EXPORTS - 51)) | (1 << (JavaParser.OPENS - 51)) | (1 << (JavaParser.TO - 51)) | (1 << (JavaParser.USES - 51)) | (1 << (JavaParser.PROVIDES - 51)) | (1 << (JavaParser.WITH - 51)) | (1 << (JavaParser.TRANSITIVE - 51)) | (1 << (JavaParser.VAR - 51)) | (1 << (JavaParser.YIELD - 51)) | (1 << (JavaParser.RECORD - 51)) | (1 << (JavaParser.SEALED - 51)) | (1 << (JavaParser.PERMITS - 51)))) !== 0) || _la === JavaParser.IDENTIFIER) {
					{
					this.state = 1176;
					this.identifier();
					}
				}

				this.state = 1179;
				this.match(JavaParser.SEMI);
				}
				break;

			case 15:
				this.enterOuterAlt(_localctx, 15);
				{
				this.state = 1180;
				this.match(JavaParser.YIELD);
				this.state = 1181;
				this.expression(0);
				this.state = 1182;
				this.match(JavaParser.SEMI);
				}
				break;

			case 16:
				this.enterOuterAlt(_localctx, 16);
				{
				this.state = 1184;
				this.match(JavaParser.SEMI);
				}
				break;

			case 17:
				this.enterOuterAlt(_localctx, 17);
				{
				this.state = 1185;
				_localctx._statementExpression = this.expression(0);
				this.state = 1186;
				this.match(JavaParser.SEMI);
				}
				break;

			case 18:
				this.enterOuterAlt(_localctx, 18);
				{
				this.state = 1188;
				this.switchExpression();
				this.state = 1190;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 138, this._ctx) ) {
				case 1:
					{
					this.state = 1189;
					this.match(JavaParser.SEMI);
					}
					break;
				}
				}
				break;

			case 19:
				this.enterOuterAlt(_localctx, 19);
				{
				this.state = 1192;
				_localctx._identifierLabel = this.identifier();
				this.state = 1193;
				this.match(JavaParser.COLON);
				this.state = 1194;
				this.statement();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public catchClause(): CatchClauseContext {
		let _localctx: CatchClauseContext = new CatchClauseContext(this._ctx, this.state);
		this.enterRule(_localctx, 170, JavaParser.RULE_catchClause);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1198;
			this.match(JavaParser.CATCH);
			this.state = 1199;
			this.match(JavaParser.LPAREN);
			this.state = 1203;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 140, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1200;
					this.variableModifier();
					}
					}
				}
				this.state = 1205;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 140, this._ctx);
			}
			this.state = 1206;
			this.catchType();
			this.state = 1207;
			this.identifier();
			this.state = 1208;
			this.match(JavaParser.RPAREN);
			this.state = 1209;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public catchType(): CatchTypeContext {
		let _localctx: CatchTypeContext = new CatchTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 172, JavaParser.RULE_catchType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1211;
			this.qualifiedName();
			this.state = 1216;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.BITOR) {
				{
				{
				this.state = 1212;
				this.match(JavaParser.BITOR);
				this.state = 1213;
				this.qualifiedName();
				}
				}
				this.state = 1218;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public finallyBlock(): FinallyBlockContext {
		let _localctx: FinallyBlockContext = new FinallyBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 174, JavaParser.RULE_finallyBlock);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1219;
			this.match(JavaParser.FINALLY);
			this.state = 1220;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public resourceSpecification(): ResourceSpecificationContext {
		let _localctx: ResourceSpecificationContext = new ResourceSpecificationContext(this._ctx, this.state);
		this.enterRule(_localctx, 176, JavaParser.RULE_resourceSpecification);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1222;
			this.match(JavaParser.LPAREN);
			this.state = 1223;
			this.resources();
			this.state = 1225;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.SEMI) {
				{
				this.state = 1224;
				this.match(JavaParser.SEMI);
				}
			}

			this.state = 1227;
			this.match(JavaParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public resources(): ResourcesContext {
		let _localctx: ResourcesContext = new ResourcesContext(this._ctx, this.state);
		this.enterRule(_localctx, 178, JavaParser.RULE_resources);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1229;
			this.resource();
			this.state = 1234;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 143, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1230;
					this.match(JavaParser.SEMI);
					this.state = 1231;
					this.resource();
					}
					}
				}
				this.state = 1236;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 143, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public resource(): ResourceContext {
		let _localctx: ResourceContext = new ResourceContext(this._ctx, this.state);
		this.enterRule(_localctx, 180, JavaParser.RULE_resource);
		try {
			let _alt: number;
			this.state = 1254;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 146, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1240;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 144, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1237;
						this.variableModifier();
						}
						}
					}
					this.state = 1242;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 144, this._ctx);
				}
				this.state = 1248;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 145, this._ctx) ) {
				case 1:
					{
					this.state = 1243;
					this.classOrInterfaceType();
					this.state = 1244;
					this.variableDeclaratorId();
					}
					break;

				case 2:
					{
					this.state = 1246;
					this.match(JavaParser.VAR);
					this.state = 1247;
					this.identifier();
					}
					break;
				}
				this.state = 1250;
				this.match(JavaParser.ASSIGN);
				this.state = 1251;
				this.expression(0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1253;
				this.qualifiedName();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public switchBlockStatementGroup(): SwitchBlockStatementGroupContext {
		let _localctx: SwitchBlockStatementGroupContext = new SwitchBlockStatementGroupContext(this._ctx, this.state);
		this.enterRule(_localctx, 182, JavaParser.RULE_switchBlockStatementGroup);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1257;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 1256;
				this.switchLabel();
				}
				}
				this.state = 1259;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === JavaParser.CASE || _la === JavaParser.DEFAULT);
			this.state = 1262;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 1261;
				this.blockStatement();
				}
				}
				this.state = 1264;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.ABSTRACT) | (1 << JavaParser.ASSERT) | (1 << JavaParser.BOOLEAN) | (1 << JavaParser.BREAK) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.CLASS) | (1 << JavaParser.CONTINUE) | (1 << JavaParser.DO) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FINAL) | (1 << JavaParser.FLOAT) | (1 << JavaParser.FOR) | (1 << JavaParser.IF) | (1 << JavaParser.INT) | (1 << JavaParser.INTERFACE) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (JavaParser.PRIVATE - 33)) | (1 << (JavaParser.PROTECTED - 33)) | (1 << (JavaParser.PUBLIC - 33)) | (1 << (JavaParser.RETURN - 33)) | (1 << (JavaParser.SHORT - 33)) | (1 << (JavaParser.STATIC - 33)) | (1 << (JavaParser.STRICTFP - 33)) | (1 << (JavaParser.SUPER - 33)) | (1 << (JavaParser.SWITCH - 33)) | (1 << (JavaParser.SYNCHRONIZED - 33)) | (1 << (JavaParser.THIS - 33)) | (1 << (JavaParser.THROW - 33)) | (1 << (JavaParser.TRY - 33)) | (1 << (JavaParser.VOID - 33)) | (1 << (JavaParser.WHILE - 33)) | (1 << (JavaParser.MODULE - 33)) | (1 << (JavaParser.OPEN - 33)) | (1 << (JavaParser.REQUIRES - 33)) | (1 << (JavaParser.EXPORTS - 33)) | (1 << (JavaParser.OPENS - 33)) | (1 << (JavaParser.TO - 33)) | (1 << (JavaParser.USES - 33)) | (1 << (JavaParser.PROVIDES - 33)) | (1 << (JavaParser.WITH - 33)) | (1 << (JavaParser.TRANSITIVE - 33)) | (1 << (JavaParser.VAR - 33)) | (1 << (JavaParser.YIELD - 33)) | (1 << (JavaParser.RECORD - 33)) | (1 << (JavaParser.SEALED - 33)))) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & ((1 << (JavaParser.PERMITS - 65)) | (1 << (JavaParser.NON_SEALED - 65)) | (1 << (JavaParser.DECIMAL_LITERAL - 65)) | (1 << (JavaParser.HEX_LITERAL - 65)) | (1 << (JavaParser.OCT_LITERAL - 65)) | (1 << (JavaParser.BINARY_LITERAL - 65)) | (1 << (JavaParser.FLOAT_LITERAL - 65)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 65)) | (1 << (JavaParser.BOOL_LITERAL - 65)) | (1 << (JavaParser.CHAR_LITERAL - 65)) | (1 << (JavaParser.STRING_LITERAL - 65)) | (1 << (JavaParser.TEXT_BLOCK - 65)) | (1 << (JavaParser.NULL_LITERAL - 65)) | (1 << (JavaParser.LPAREN - 65)) | (1 << (JavaParser.LBRACE - 65)) | (1 << (JavaParser.SEMI - 65)) | (1 << (JavaParser.LT - 65)) | (1 << (JavaParser.BANG - 65)) | (1 << (JavaParser.TILDE - 65)))) !== 0) || ((((_la - 100)) & ~0x1F) === 0 && ((1 << (_la - 100)) & ((1 << (JavaParser.INC - 100)) | (1 << (JavaParser.DEC - 100)) | (1 << (JavaParser.ADD - 100)) | (1 << (JavaParser.SUB - 100)) | (1 << (JavaParser.AT - 100)) | (1 << (JavaParser.IDENTIFIER - 100)))) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public switchLabel(): SwitchLabelContext {
		let _localctx: SwitchLabelContext = new SwitchLabelContext(this._ctx, this.state);
		this.enterRule(_localctx, 184, JavaParser.RULE_switchLabel);
		let _la: number;
		try {
			this.state = 1282;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.CASE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1266;
				this.match(JavaParser.CASE);
				this.state = 1277;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 150, this._ctx) ) {
				case 1:
					{
					this.state = 1267;
					_localctx._constantExpression = this.expression(0);
					}
					break;

				case 2:
					{
					this.state = 1268;
					_localctx._enumConstantName = this.match(JavaParser.IDENTIFIER);
					}
					break;

				case 3:
					{
					this.state = 1269;
					this.typeType();
					this.state = 1270;
					_localctx._varName = this.identifier();
					}
					break;

				case 4:
					{
					this.state = 1272;
					this.match(JavaParser.NULL_LITERAL);
					this.state = 1275;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === JavaParser.COMMA) {
						{
						this.state = 1273;
						this.match(JavaParser.COMMA);
						this.state = 1274;
						this.match(JavaParser.DEFAULT);
						}
					}

					}
					break;
				}
				this.state = 1279;
				this.match(JavaParser.COLON);
				}
				break;
			case JavaParser.DEFAULT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1280;
				this.match(JavaParser.DEFAULT);
				this.state = 1281;
				this.match(JavaParser.COLON);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public forControl(): ForControlContext {
		let _localctx: ForControlContext = new ForControlContext(this._ctx, this.state);
		this.enterRule(_localctx, 186, JavaParser.RULE_forControl);
		let _la: number;
		try {
			this.state = 1296;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 155, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1284;
				this.enhancedForControl();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1286;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FINAL) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.SUPER - 37)) | (1 << (JavaParser.SWITCH - 37)) | (1 << (JavaParser.THIS - 37)) | (1 << (JavaParser.VOID - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)) | (1 << (JavaParser.DECIMAL_LITERAL - 37)) | (1 << (JavaParser.HEX_LITERAL - 37)))) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (JavaParser.OCT_LITERAL - 69)) | (1 << (JavaParser.BINARY_LITERAL - 69)) | (1 << (JavaParser.FLOAT_LITERAL - 69)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 69)) | (1 << (JavaParser.BOOL_LITERAL - 69)) | (1 << (JavaParser.CHAR_LITERAL - 69)) | (1 << (JavaParser.STRING_LITERAL - 69)) | (1 << (JavaParser.TEXT_BLOCK - 69)) | (1 << (JavaParser.NULL_LITERAL - 69)) | (1 << (JavaParser.LPAREN - 69)) | (1 << (JavaParser.LT - 69)) | (1 << (JavaParser.BANG - 69)) | (1 << (JavaParser.TILDE - 69)) | (1 << (JavaParser.INC - 69)))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (JavaParser.DEC - 101)) | (1 << (JavaParser.ADD - 101)) | (1 << (JavaParser.SUB - 101)) | (1 << (JavaParser.AT - 101)) | (1 << (JavaParser.IDENTIFIER - 101)))) !== 0)) {
					{
					this.state = 1285;
					this.forInit();
					}
				}

				this.state = 1288;
				this.match(JavaParser.SEMI);
				this.state = 1290;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.SUPER - 37)) | (1 << (JavaParser.SWITCH - 37)) | (1 << (JavaParser.THIS - 37)) | (1 << (JavaParser.VOID - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)) | (1 << (JavaParser.DECIMAL_LITERAL - 37)) | (1 << (JavaParser.HEX_LITERAL - 37)))) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (JavaParser.OCT_LITERAL - 69)) | (1 << (JavaParser.BINARY_LITERAL - 69)) | (1 << (JavaParser.FLOAT_LITERAL - 69)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 69)) | (1 << (JavaParser.BOOL_LITERAL - 69)) | (1 << (JavaParser.CHAR_LITERAL - 69)) | (1 << (JavaParser.STRING_LITERAL - 69)) | (1 << (JavaParser.TEXT_BLOCK - 69)) | (1 << (JavaParser.NULL_LITERAL - 69)) | (1 << (JavaParser.LPAREN - 69)) | (1 << (JavaParser.LT - 69)) | (1 << (JavaParser.BANG - 69)) | (1 << (JavaParser.TILDE - 69)) | (1 << (JavaParser.INC - 69)))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (JavaParser.DEC - 101)) | (1 << (JavaParser.ADD - 101)) | (1 << (JavaParser.SUB - 101)) | (1 << (JavaParser.AT - 101)) | (1 << (JavaParser.IDENTIFIER - 101)))) !== 0)) {
					{
					this.state = 1289;
					this.expression(0);
					}
				}

				this.state = 1292;
				this.match(JavaParser.SEMI);
				this.state = 1294;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.SUPER - 37)) | (1 << (JavaParser.SWITCH - 37)) | (1 << (JavaParser.THIS - 37)) | (1 << (JavaParser.VOID - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)) | (1 << (JavaParser.DECIMAL_LITERAL - 37)) | (1 << (JavaParser.HEX_LITERAL - 37)))) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (JavaParser.OCT_LITERAL - 69)) | (1 << (JavaParser.BINARY_LITERAL - 69)) | (1 << (JavaParser.FLOAT_LITERAL - 69)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 69)) | (1 << (JavaParser.BOOL_LITERAL - 69)) | (1 << (JavaParser.CHAR_LITERAL - 69)) | (1 << (JavaParser.STRING_LITERAL - 69)) | (1 << (JavaParser.TEXT_BLOCK - 69)) | (1 << (JavaParser.NULL_LITERAL - 69)) | (1 << (JavaParser.LPAREN - 69)) | (1 << (JavaParser.LT - 69)) | (1 << (JavaParser.BANG - 69)) | (1 << (JavaParser.TILDE - 69)) | (1 << (JavaParser.INC - 69)))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (JavaParser.DEC - 101)) | (1 << (JavaParser.ADD - 101)) | (1 << (JavaParser.SUB - 101)) | (1 << (JavaParser.AT - 101)) | (1 << (JavaParser.IDENTIFIER - 101)))) !== 0)) {
					{
					this.state = 1293;
					_localctx._forUpdate = this.expressionList();
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public forInit(): ForInitContext {
		let _localctx: ForInitContext = new ForInitContext(this._ctx, this.state);
		this.enterRule(_localctx, 188, JavaParser.RULE_forInit);
		try {
			this.state = 1300;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 156, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1298;
				this.localVariableDeclaration();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1299;
				this.expressionList();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public enhancedForControl(): EnhancedForControlContext {
		let _localctx: EnhancedForControlContext = new EnhancedForControlContext(this._ctx, this.state);
		this.enterRule(_localctx, 190, JavaParser.RULE_enhancedForControl);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1305;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 157, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1302;
					this.variableModifier();
					}
					}
				}
				this.state = 1307;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 157, this._ctx);
			}
			this.state = 1310;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 158, this._ctx) ) {
			case 1:
				{
				this.state = 1308;
				this.typeType();
				}
				break;

			case 2:
				{
				this.state = 1309;
				this.match(JavaParser.VAR);
				}
				break;
			}
			this.state = 1312;
			this.variableDeclaratorId();
			this.state = 1313;
			this.match(JavaParser.COLON);
			this.state = 1314;
			this.expression(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parExpression(): ParExpressionContext {
		let _localctx: ParExpressionContext = new ParExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 192, JavaParser.RULE_parExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1316;
			this.match(JavaParser.LPAREN);
			this.state = 1317;
			this.expression(0);
			this.state = 1318;
			this.match(JavaParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expressionList(): ExpressionListContext {
		let _localctx: ExpressionListContext = new ExpressionListContext(this._ctx, this.state);
		this.enterRule(_localctx, 194, JavaParser.RULE_expressionList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1320;
			this.expression(0);
			this.state = 1325;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.COMMA) {
				{
				{
				this.state = 1321;
				this.match(JavaParser.COMMA);
				this.state = 1322;
				this.expression(0);
				}
				}
				this.state = 1327;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public methodCall(): MethodCallContext {
		let _localctx: MethodCallContext = new MethodCallContext(this._ctx, this.state);
		this.enterRule(_localctx, 196, JavaParser.RULE_methodCall);
		let _la: number;
		try {
			this.state = 1347;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1328;
				this.identifier();
				this.state = 1329;
				this.match(JavaParser.LPAREN);
				this.state = 1331;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.SUPER - 37)) | (1 << (JavaParser.SWITCH - 37)) | (1 << (JavaParser.THIS - 37)) | (1 << (JavaParser.VOID - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)) | (1 << (JavaParser.DECIMAL_LITERAL - 37)) | (1 << (JavaParser.HEX_LITERAL - 37)))) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (JavaParser.OCT_LITERAL - 69)) | (1 << (JavaParser.BINARY_LITERAL - 69)) | (1 << (JavaParser.FLOAT_LITERAL - 69)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 69)) | (1 << (JavaParser.BOOL_LITERAL - 69)) | (1 << (JavaParser.CHAR_LITERAL - 69)) | (1 << (JavaParser.STRING_LITERAL - 69)) | (1 << (JavaParser.TEXT_BLOCK - 69)) | (1 << (JavaParser.NULL_LITERAL - 69)) | (1 << (JavaParser.LPAREN - 69)) | (1 << (JavaParser.LT - 69)) | (1 << (JavaParser.BANG - 69)) | (1 << (JavaParser.TILDE - 69)) | (1 << (JavaParser.INC - 69)))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (JavaParser.DEC - 101)) | (1 << (JavaParser.ADD - 101)) | (1 << (JavaParser.SUB - 101)) | (1 << (JavaParser.AT - 101)) | (1 << (JavaParser.IDENTIFIER - 101)))) !== 0)) {
					{
					this.state = 1330;
					this.expressionList();
					}
				}

				this.state = 1333;
				this.match(JavaParser.RPAREN);
				}
				break;
			case JavaParser.THIS:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1335;
				this.match(JavaParser.THIS);
				this.state = 1336;
				this.match(JavaParser.LPAREN);
				this.state = 1338;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.SUPER - 37)) | (1 << (JavaParser.SWITCH - 37)) | (1 << (JavaParser.THIS - 37)) | (1 << (JavaParser.VOID - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)) | (1 << (JavaParser.DECIMAL_LITERAL - 37)) | (1 << (JavaParser.HEX_LITERAL - 37)))) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (JavaParser.OCT_LITERAL - 69)) | (1 << (JavaParser.BINARY_LITERAL - 69)) | (1 << (JavaParser.FLOAT_LITERAL - 69)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 69)) | (1 << (JavaParser.BOOL_LITERAL - 69)) | (1 << (JavaParser.CHAR_LITERAL - 69)) | (1 << (JavaParser.STRING_LITERAL - 69)) | (1 << (JavaParser.TEXT_BLOCK - 69)) | (1 << (JavaParser.NULL_LITERAL - 69)) | (1 << (JavaParser.LPAREN - 69)) | (1 << (JavaParser.LT - 69)) | (1 << (JavaParser.BANG - 69)) | (1 << (JavaParser.TILDE - 69)) | (1 << (JavaParser.INC - 69)))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (JavaParser.DEC - 101)) | (1 << (JavaParser.ADD - 101)) | (1 << (JavaParser.SUB - 101)) | (1 << (JavaParser.AT - 101)) | (1 << (JavaParser.IDENTIFIER - 101)))) !== 0)) {
					{
					this.state = 1337;
					this.expressionList();
					}
				}

				this.state = 1340;
				this.match(JavaParser.RPAREN);
				}
				break;
			case JavaParser.SUPER:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1341;
				this.match(JavaParser.SUPER);
				this.state = 1342;
				this.match(JavaParser.LPAREN);
				this.state = 1344;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.SUPER - 37)) | (1 << (JavaParser.SWITCH - 37)) | (1 << (JavaParser.THIS - 37)) | (1 << (JavaParser.VOID - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)) | (1 << (JavaParser.DECIMAL_LITERAL - 37)) | (1 << (JavaParser.HEX_LITERAL - 37)))) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (JavaParser.OCT_LITERAL - 69)) | (1 << (JavaParser.BINARY_LITERAL - 69)) | (1 << (JavaParser.FLOAT_LITERAL - 69)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 69)) | (1 << (JavaParser.BOOL_LITERAL - 69)) | (1 << (JavaParser.CHAR_LITERAL - 69)) | (1 << (JavaParser.STRING_LITERAL - 69)) | (1 << (JavaParser.TEXT_BLOCK - 69)) | (1 << (JavaParser.NULL_LITERAL - 69)) | (1 << (JavaParser.LPAREN - 69)) | (1 << (JavaParser.LT - 69)) | (1 << (JavaParser.BANG - 69)) | (1 << (JavaParser.TILDE - 69)) | (1 << (JavaParser.INC - 69)))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (JavaParser.DEC - 101)) | (1 << (JavaParser.ADD - 101)) | (1 << (JavaParser.SUB - 101)) | (1 << (JavaParser.AT - 101)) | (1 << (JavaParser.IDENTIFIER - 101)))) !== 0)) {
					{
					this.state = 1343;
					this.expressionList();
					}
				}

				this.state = 1346;
				this.match(JavaParser.RPAREN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public expression(): ExpressionContext;
	public expression(_p: number): ExpressionContext;
	// @RuleVersion(0)
	public expression(_p?: number): ExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, _parentState);
		let _prevctx: ExpressionContext = _localctx;
		let _startState: number = 198;
		this.enterRecursionRule(_localctx, 198, JavaParser.RULE_expression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1394;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 169, this._ctx) ) {
			case 1:
				{
				this.state = 1350;
				this.primary();
				}
				break;

			case 2:
				{
				this.state = 1351;
				this.methodCall();
				}
				break;

			case 3:
				{
				this.state = 1352;
				this.match(JavaParser.NEW);
				this.state = 1353;
				this.creator();
				}
				break;

			case 4:
				{
				this.state = 1354;
				this.match(JavaParser.LPAREN);
				this.state = 1358;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 164, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1355;
						this.annotation();
						}
						}
					}
					this.state = 1360;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 164, this._ctx);
				}
				this.state = 1361;
				this.typeType();
				this.state = 1366;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === JavaParser.BITAND) {
					{
					{
					this.state = 1362;
					this.match(JavaParser.BITAND);
					this.state = 1363;
					this.typeType();
					}
					}
					this.state = 1368;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1369;
				this.match(JavaParser.RPAREN);
				this.state = 1370;
				this.expression(22);
				}
				break;

			case 5:
				{
				this.state = 1372;
				_localctx._prefix = this._input.LT(1);
				_la = this._input.LA(1);
				if (!(((((_la - 100)) & ~0x1F) === 0 && ((1 << (_la - 100)) & ((1 << (JavaParser.INC - 100)) | (1 << (JavaParser.DEC - 100)) | (1 << (JavaParser.ADD - 100)) | (1 << (JavaParser.SUB - 100)))) !== 0))) {
					_localctx._prefix = this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 1373;
				this.expression(20);
				}
				break;

			case 6:
				{
				this.state = 1374;
				_localctx._prefix = this._input.LT(1);
				_la = this._input.LA(1);
				if (!(_la === JavaParser.BANG || _la === JavaParser.TILDE)) {
					_localctx._prefix = this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 1375;
				this.expression(19);
				}
				break;

			case 7:
				{
				this.state = 1376;
				this.lambdaExpression();
				}
				break;

			case 8:
				{
				this.state = 1377;
				this.switchExpression();
				}
				break;

			case 9:
				{
				this.state = 1378;
				this.typeType();
				this.state = 1379;
				this.match(JavaParser.COLONCOLON);
				this.state = 1385;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case JavaParser.MODULE:
				case JavaParser.OPEN:
				case JavaParser.REQUIRES:
				case JavaParser.EXPORTS:
				case JavaParser.OPENS:
				case JavaParser.TO:
				case JavaParser.USES:
				case JavaParser.PROVIDES:
				case JavaParser.WITH:
				case JavaParser.TRANSITIVE:
				case JavaParser.VAR:
				case JavaParser.YIELD:
				case JavaParser.RECORD:
				case JavaParser.SEALED:
				case JavaParser.PERMITS:
				case JavaParser.LT:
				case JavaParser.IDENTIFIER:
					{
					this.state = 1381;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === JavaParser.LT) {
						{
						this.state = 1380;
						this.typeArguments();
						}
					}

					this.state = 1383;
					this.identifier();
					}
					break;
				case JavaParser.NEW:
					{
					this.state = 1384;
					this.match(JavaParser.NEW);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;

			case 10:
				{
				this.state = 1387;
				this.classType();
				this.state = 1388;
				this.match(JavaParser.COLONCOLON);
				this.state = 1390;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.LT) {
					{
					this.state = 1389;
					this.typeArguments();
					}
				}

				this.state = 1392;
				this.match(JavaParser.NEW);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 1479;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 176, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 1477;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 175, this._ctx) ) {
					case 1:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1396;
						if (!(this.precpred(this._ctx, 18))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 18)");
						}
						this.state = 1397;
						_localctx._bop = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(((((_la - 104)) & ~0x1F) === 0 && ((1 << (_la - 104)) & ((1 << (JavaParser.MUL - 104)) | (1 << (JavaParser.DIV - 104)) | (1 << (JavaParser.MOD - 104)))) !== 0))) {
							_localctx._bop = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 1398;
						this.expression(19);
						}
						break;

					case 2:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1399;
						if (!(this.precpred(this._ctx, 17))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 17)");
						}
						this.state = 1400;
						_localctx._bop = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(_la === JavaParser.ADD || _la === JavaParser.SUB)) {
							_localctx._bop = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 1401;
						this.expression(18);
						}
						break;

					case 3:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1402;
						if (!(this.precpred(this._ctx, 16))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 16)");
						}
						this.state = 1410;
						this._errHandler.sync(this);
						switch ( this.interpreter.adaptivePredict(this._input, 170, this._ctx) ) {
						case 1:
							{
							this.state = 1403;
							this.match(JavaParser.LT);
							this.state = 1404;
							this.match(JavaParser.LT);
							}
							break;

						case 2:
							{
							this.state = 1405;
							this.match(JavaParser.GT);
							this.state = 1406;
							this.match(JavaParser.GT);
							this.state = 1407;
							this.match(JavaParser.GT);
							}
							break;

						case 3:
							{
							this.state = 1408;
							this.match(JavaParser.GT);
							this.state = 1409;
							this.match(JavaParser.GT);
							}
							break;
						}
						this.state = 1412;
						this.expression(17);
						}
						break;

					case 4:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1413;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 1414;
						_localctx._bop = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(((((_la - 88)) & ~0x1F) === 0 && ((1 << (_la - 88)) & ((1 << (JavaParser.GT - 88)) | (1 << (JavaParser.LT - 88)) | (1 << (JavaParser.LE - 88)) | (1 << (JavaParser.GE - 88)))) !== 0))) {
							_localctx._bop = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 1415;
						this.expression(16);
						}
						break;

					case 5:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1416;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 1417;
						_localctx._bop = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(_la === JavaParser.EQUAL || _la === JavaParser.NOTEQUAL)) {
							_localctx._bop = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 1418;
						this.expression(14);
						}
						break;

					case 6:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1419;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 1420;
						_localctx._bop = this.match(JavaParser.BITAND);
						this.state = 1421;
						this.expression(13);
						}
						break;

					case 7:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1422;
						if (!(this.precpred(this._ctx, 11))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 11)");
						}
						this.state = 1423;
						_localctx._bop = this.match(JavaParser.CARET);
						this.state = 1424;
						this.expression(12);
						}
						break;

					case 8:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1425;
						if (!(this.precpred(this._ctx, 10))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
						}
						this.state = 1426;
						_localctx._bop = this.match(JavaParser.BITOR);
						this.state = 1427;
						this.expression(11);
						}
						break;

					case 9:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1428;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 1429;
						_localctx._bop = this.match(JavaParser.AND);
						this.state = 1430;
						this.expression(10);
						}
						break;

					case 10:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1431;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 1432;
						_localctx._bop = this.match(JavaParser.OR);
						this.state = 1433;
						this.expression(9);
						}
						break;

					case 11:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1434;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 1435;
						_localctx._bop = this.match(JavaParser.QUESTION);
						this.state = 1436;
						this.expression(0);
						this.state = 1437;
						this.match(JavaParser.COLON);
						this.state = 1438;
						this.expression(7);
						}
						break;

					case 12:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1440;
						if (!(this.precpred(this._ctx, 6))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
						}
						this.state = 1441;
						_localctx._bop = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & ((1 << (JavaParser.ASSIGN - 87)) | (1 << (JavaParser.ADD_ASSIGN - 87)) | (1 << (JavaParser.SUB_ASSIGN - 87)) | (1 << (JavaParser.MUL_ASSIGN - 87)) | (1 << (JavaParser.DIV_ASSIGN - 87)) | (1 << (JavaParser.AND_ASSIGN - 87)) | (1 << (JavaParser.OR_ASSIGN - 87)) | (1 << (JavaParser.XOR_ASSIGN - 87)) | (1 << (JavaParser.MOD_ASSIGN - 87)) | (1 << (JavaParser.LSHIFT_ASSIGN - 87)))) !== 0) || _la === JavaParser.RSHIFT_ASSIGN || _la === JavaParser.URSHIFT_ASSIGN)) {
							_localctx._bop = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 1442;
						this.expression(6);
						}
						break;

					case 13:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1443;
						if (!(this.precpred(this._ctx, 26))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 26)");
						}
						this.state = 1444;
						_localctx._bop = this.match(JavaParser.DOT);
						this.state = 1456;
						this._errHandler.sync(this);
						switch ( this.interpreter.adaptivePredict(this._input, 172, this._ctx) ) {
						case 1:
							{
							this.state = 1445;
							this.identifier();
							}
							break;

						case 2:
							{
							this.state = 1446;
							this.methodCall();
							}
							break;

						case 3:
							{
							this.state = 1447;
							this.match(JavaParser.THIS);
							}
							break;

						case 4:
							{
							this.state = 1448;
							this.match(JavaParser.NEW);
							this.state = 1450;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
							if (_la === JavaParser.LT) {
								{
								this.state = 1449;
								this.nonWildcardTypeArguments();
								}
							}

							this.state = 1452;
							this.innerCreator();
							}
							break;

						case 5:
							{
							this.state = 1453;
							this.match(JavaParser.SUPER);
							this.state = 1454;
							this.superSuffix();
							}
							break;

						case 6:
							{
							this.state = 1455;
							this.explicitGenericInvocation();
							}
							break;
						}
						}
						break;

					case 14:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1458;
						if (!(this.precpred(this._ctx, 25))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 25)");
						}
						this.state = 1459;
						this.match(JavaParser.LBRACK);
						this.state = 1460;
						this.expression(0);
						this.state = 1461;
						this.match(JavaParser.RBRACK);
						}
						break;

					case 15:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1463;
						if (!(this.precpred(this._ctx, 21))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 21)");
						}
						this.state = 1464;
						_localctx._postfix = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(_la === JavaParser.INC || _la === JavaParser.DEC)) {
							_localctx._postfix = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						}
						break;

					case 16:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1465;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 1466;
						_localctx._bop = this.match(JavaParser.INSTANCEOF);
						this.state = 1469;
						this._errHandler.sync(this);
						switch ( this.interpreter.adaptivePredict(this._input, 173, this._ctx) ) {
						case 1:
							{
							this.state = 1467;
							this.typeType();
							}
							break;

						case 2:
							{
							this.state = 1468;
							this.pattern();
							}
							break;
						}
						}
						break;

					case 17:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_expression);
						this.state = 1471;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 1472;
						this.match(JavaParser.COLONCOLON);
						this.state = 1474;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === JavaParser.LT) {
							{
							this.state = 1473;
							this.typeArguments();
							}
						}

						this.state = 1476;
						this.identifier();
						}
						break;
					}
					}
				}
				this.state = 1481;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 176, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pattern(): PatternContext {
		let _localctx: PatternContext = new PatternContext(this._ctx, this.state);
		this.enterRule(_localctx, 200, JavaParser.RULE_pattern);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1485;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 177, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1482;
					this.variableModifier();
					}
					}
				}
				this.state = 1487;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 177, this._ctx);
			}
			this.state = 1488;
			this.typeType();
			this.state = 1492;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 178, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1489;
					this.annotation();
					}
					}
				}
				this.state = 1494;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 178, this._ctx);
			}
			this.state = 1495;
			this.identifier();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public lambdaExpression(): LambdaExpressionContext {
		let _localctx: LambdaExpressionContext = new LambdaExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 202, JavaParser.RULE_lambdaExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1497;
			this.lambdaParameters();
			this.state = 1498;
			this.match(JavaParser.ARROW);
			this.state = 1499;
			this.lambdaBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public lambdaParameters(): LambdaParametersContext {
		let _localctx: LambdaParametersContext = new LambdaParametersContext(this._ctx, this.state);
		this.enterRule(_localctx, 204, JavaParser.RULE_lambdaParameters);
		let _la: number;
		try {
			this.state = 1523;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 182, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1501;
				this.identifier();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1502;
				this.match(JavaParser.LPAREN);
				this.state = 1504;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FINAL) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
					{
					this.state = 1503;
					this.formalParameterList();
					}
				}

				this.state = 1506;
				this.match(JavaParser.RPAREN);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1507;
				this.match(JavaParser.LPAREN);
				this.state = 1508;
				this.identifier();
				this.state = 1513;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === JavaParser.COMMA) {
					{
					{
					this.state = 1509;
					this.match(JavaParser.COMMA);
					this.state = 1510;
					this.identifier();
					}
					}
					this.state = 1515;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1516;
				this.match(JavaParser.RPAREN);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1518;
				this.match(JavaParser.LPAREN);
				this.state = 1520;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.FINAL || ((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & ((1 << (JavaParser.MODULE - 51)) | (1 << (JavaParser.OPEN - 51)) | (1 << (JavaParser.REQUIRES - 51)) | (1 << (JavaParser.EXPORTS - 51)) | (1 << (JavaParser.OPENS - 51)) | (1 << (JavaParser.TO - 51)) | (1 << (JavaParser.USES - 51)) | (1 << (JavaParser.PROVIDES - 51)) | (1 << (JavaParser.WITH - 51)) | (1 << (JavaParser.TRANSITIVE - 51)) | (1 << (JavaParser.VAR - 51)) | (1 << (JavaParser.YIELD - 51)) | (1 << (JavaParser.RECORD - 51)) | (1 << (JavaParser.SEALED - 51)) | (1 << (JavaParser.PERMITS - 51)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
					{
					this.state = 1519;
					this.lambdaLVTIList();
					}
				}

				this.state = 1522;
				this.match(JavaParser.RPAREN);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public lambdaBody(): LambdaBodyContext {
		let _localctx: LambdaBodyContext = new LambdaBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 206, JavaParser.RULE_lambdaBody);
		try {
			this.state = 1527;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.BOOLEAN:
			case JavaParser.BYTE:
			case JavaParser.CHAR:
			case JavaParser.DOUBLE:
			case JavaParser.FLOAT:
			case JavaParser.INT:
			case JavaParser.LONG:
			case JavaParser.NEW:
			case JavaParser.SHORT:
			case JavaParser.SUPER:
			case JavaParser.SWITCH:
			case JavaParser.THIS:
			case JavaParser.VOID:
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.DECIMAL_LITERAL:
			case JavaParser.HEX_LITERAL:
			case JavaParser.OCT_LITERAL:
			case JavaParser.BINARY_LITERAL:
			case JavaParser.FLOAT_LITERAL:
			case JavaParser.HEX_FLOAT_LITERAL:
			case JavaParser.BOOL_LITERAL:
			case JavaParser.CHAR_LITERAL:
			case JavaParser.STRING_LITERAL:
			case JavaParser.TEXT_BLOCK:
			case JavaParser.NULL_LITERAL:
			case JavaParser.LPAREN:
			case JavaParser.LT:
			case JavaParser.BANG:
			case JavaParser.TILDE:
			case JavaParser.INC:
			case JavaParser.DEC:
			case JavaParser.ADD:
			case JavaParser.SUB:
			case JavaParser.AT:
			case JavaParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1525;
				this.expression(0);
				}
				break;
			case JavaParser.LBRACE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1526;
				this.block();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public primary(): PrimaryContext {
		let _localctx: PrimaryContext = new PrimaryContext(this._ctx, this.state);
		this.enterRule(_localctx, 208, JavaParser.RULE_primary);
		try {
			this.state = 1547;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 185, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1529;
				this.match(JavaParser.LPAREN);
				this.state = 1530;
				this.expression(0);
				this.state = 1531;
				this.match(JavaParser.RPAREN);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1533;
				this.match(JavaParser.THIS);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1534;
				this.match(JavaParser.SUPER);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1535;
				this.literal();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 1536;
				this.identifier();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 1537;
				this.typeTypeOrVoid();
				this.state = 1538;
				this.match(JavaParser.DOT);
				this.state = 1539;
				this.match(JavaParser.CLASS);
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 1541;
				this.nonWildcardTypeArguments();
				this.state = 1545;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case JavaParser.SUPER:
				case JavaParser.MODULE:
				case JavaParser.OPEN:
				case JavaParser.REQUIRES:
				case JavaParser.EXPORTS:
				case JavaParser.OPENS:
				case JavaParser.TO:
				case JavaParser.USES:
				case JavaParser.PROVIDES:
				case JavaParser.WITH:
				case JavaParser.TRANSITIVE:
				case JavaParser.VAR:
				case JavaParser.YIELD:
				case JavaParser.RECORD:
				case JavaParser.SEALED:
				case JavaParser.PERMITS:
				case JavaParser.IDENTIFIER:
					{
					this.state = 1542;
					this.explicitGenericInvocationSuffix();
					}
					break;
				case JavaParser.THIS:
					{
					this.state = 1543;
					this.match(JavaParser.THIS);
					this.state = 1544;
					this.arguments();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public switchExpression(): SwitchExpressionContext {
		let _localctx: SwitchExpressionContext = new SwitchExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 210, JavaParser.RULE_switchExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1549;
			this.match(JavaParser.SWITCH);
			this.state = 1550;
			this.parExpression();
			this.state = 1551;
			this.match(JavaParser.LBRACE);
			this.state = 1555;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.CASE || _la === JavaParser.DEFAULT) {
				{
				{
				this.state = 1552;
				this.switchLabeledRule();
				}
				}
				this.state = 1557;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1558;
			this.match(JavaParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public switchLabeledRule(): SwitchLabeledRuleContext {
		let _localctx: SwitchLabeledRuleContext = new SwitchLabeledRuleContext(this._ctx, this.state);
		this.enterRule(_localctx, 212, JavaParser.RULE_switchLabeledRule);
		let _la: number;
		try {
			this.state = 1575;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.CASE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1560;
				this.match(JavaParser.CASE);
				this.state = 1568;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 188, this._ctx) ) {
				case 1:
					{
					this.state = 1561;
					this.expressionList();
					}
					break;

				case 2:
					{
					this.state = 1562;
					this.match(JavaParser.NULL_LITERAL);
					this.state = 1565;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === JavaParser.COMMA) {
						{
						this.state = 1563;
						this.match(JavaParser.COMMA);
						this.state = 1564;
						this.match(JavaParser.DEFAULT);
						}
					}

					}
					break;

				case 3:
					{
					this.state = 1567;
					this.guardedPattern(0);
					}
					break;
				}
				this.state = 1570;
				_la = this._input.LA(1);
				if (!(_la === JavaParser.COLON || _la === JavaParser.ARROW)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 1571;
				this.switchRuleOutcome();
				}
				break;
			case JavaParser.DEFAULT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1572;
				this.match(JavaParser.DEFAULT);
				this.state = 1573;
				_la = this._input.LA(1);
				if (!(_la === JavaParser.COLON || _la === JavaParser.ARROW)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 1574;
				this.switchRuleOutcome();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public guardedPattern(): GuardedPatternContext;
	public guardedPattern(_p: number): GuardedPatternContext;
	// @RuleVersion(0)
	public guardedPattern(_p?: number): GuardedPatternContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: GuardedPatternContext = new GuardedPatternContext(this._ctx, _parentState);
		let _prevctx: GuardedPatternContext = _localctx;
		let _startState: number = 214;
		this.enterRecursionRule(_localctx, 214, JavaParser.RULE_guardedPattern, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1604;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.LPAREN:
				{
				this.state = 1578;
				this.match(JavaParser.LPAREN);
				this.state = 1579;
				this.guardedPattern(0);
				this.state = 1580;
				this.match(JavaParser.RPAREN);
				}
				break;
			case JavaParser.BOOLEAN:
			case JavaParser.BYTE:
			case JavaParser.CHAR:
			case JavaParser.DOUBLE:
			case JavaParser.FINAL:
			case JavaParser.FLOAT:
			case JavaParser.INT:
			case JavaParser.LONG:
			case JavaParser.SHORT:
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.AT:
			case JavaParser.IDENTIFIER:
				{
				this.state = 1585;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 190, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1582;
						this.variableModifier();
						}
						}
					}
					this.state = 1587;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 190, this._ctx);
				}
				this.state = 1588;
				this.typeType();
				this.state = 1592;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 191, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1589;
						this.annotation();
						}
						}
					}
					this.state = 1594;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 191, this._ctx);
				}
				this.state = 1595;
				this.identifier();
				this.state = 1601;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 192, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1596;
						this.guard();
						this.state = 1597;
						this.expression(0);
						}
						}
					}
					this.state = 1603;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 192, this._ctx);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 1612;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 194, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					{
					_localctx = new GuardedPatternContext(_parentctx, _parentState);
					this.pushNewRecursionContext(_localctx, _startState, JavaParser.RULE_guardedPattern);
					this.state = 1606;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1607;
					this.guard();
					this.state = 1608;
					this.expression(0);
					}
					}
				}
				this.state = 1614;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 194, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public guard(): GuardContext {
		let _localctx: GuardContext = new GuardContext(this._ctx, this.state);
		this.enterRule(_localctx, 216, JavaParser.RULE_guard);
		try {
			this.state = 1618;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 195, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1615;
				this.match(JavaParser.AND);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1616;
				if (!(this._input.LT(1).text === 'when')) {
					throw this.createFailedPredicateException("this._input.LT(1).text === 'when'");
				}
				this.state = 1617;
				this.identifier();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public switchRuleOutcome(): SwitchRuleOutcomeContext {
		let _localctx: SwitchRuleOutcomeContext = new SwitchRuleOutcomeContext(this._ctx, this.state);
		this.enterRule(_localctx, 218, JavaParser.RULE_switchRuleOutcome);
		let _la: number;
		try {
			this.state = 1627;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 197, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1620;
				this.block();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1624;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.ABSTRACT) | (1 << JavaParser.ASSERT) | (1 << JavaParser.BOOLEAN) | (1 << JavaParser.BREAK) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.CLASS) | (1 << JavaParser.CONTINUE) | (1 << JavaParser.DO) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FINAL) | (1 << JavaParser.FLOAT) | (1 << JavaParser.FOR) | (1 << JavaParser.IF) | (1 << JavaParser.INT) | (1 << JavaParser.INTERFACE) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (JavaParser.PRIVATE - 33)) | (1 << (JavaParser.PROTECTED - 33)) | (1 << (JavaParser.PUBLIC - 33)) | (1 << (JavaParser.RETURN - 33)) | (1 << (JavaParser.SHORT - 33)) | (1 << (JavaParser.STATIC - 33)) | (1 << (JavaParser.STRICTFP - 33)) | (1 << (JavaParser.SUPER - 33)) | (1 << (JavaParser.SWITCH - 33)) | (1 << (JavaParser.SYNCHRONIZED - 33)) | (1 << (JavaParser.THIS - 33)) | (1 << (JavaParser.THROW - 33)) | (1 << (JavaParser.TRY - 33)) | (1 << (JavaParser.VOID - 33)) | (1 << (JavaParser.WHILE - 33)) | (1 << (JavaParser.MODULE - 33)) | (1 << (JavaParser.OPEN - 33)) | (1 << (JavaParser.REQUIRES - 33)) | (1 << (JavaParser.EXPORTS - 33)) | (1 << (JavaParser.OPENS - 33)) | (1 << (JavaParser.TO - 33)) | (1 << (JavaParser.USES - 33)) | (1 << (JavaParser.PROVIDES - 33)) | (1 << (JavaParser.WITH - 33)) | (1 << (JavaParser.TRANSITIVE - 33)) | (1 << (JavaParser.VAR - 33)) | (1 << (JavaParser.YIELD - 33)) | (1 << (JavaParser.RECORD - 33)) | (1 << (JavaParser.SEALED - 33)))) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & ((1 << (JavaParser.PERMITS - 65)) | (1 << (JavaParser.NON_SEALED - 65)) | (1 << (JavaParser.DECIMAL_LITERAL - 65)) | (1 << (JavaParser.HEX_LITERAL - 65)) | (1 << (JavaParser.OCT_LITERAL - 65)) | (1 << (JavaParser.BINARY_LITERAL - 65)) | (1 << (JavaParser.FLOAT_LITERAL - 65)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 65)) | (1 << (JavaParser.BOOL_LITERAL - 65)) | (1 << (JavaParser.CHAR_LITERAL - 65)) | (1 << (JavaParser.STRING_LITERAL - 65)) | (1 << (JavaParser.TEXT_BLOCK - 65)) | (1 << (JavaParser.NULL_LITERAL - 65)) | (1 << (JavaParser.LPAREN - 65)) | (1 << (JavaParser.LBRACE - 65)) | (1 << (JavaParser.SEMI - 65)) | (1 << (JavaParser.LT - 65)) | (1 << (JavaParser.BANG - 65)) | (1 << (JavaParser.TILDE - 65)))) !== 0) || ((((_la - 100)) & ~0x1F) === 0 && ((1 << (_la - 100)) & ((1 << (JavaParser.INC - 100)) | (1 << (JavaParser.DEC - 100)) | (1 << (JavaParser.ADD - 100)) | (1 << (JavaParser.SUB - 100)) | (1 << (JavaParser.AT - 100)) | (1 << (JavaParser.IDENTIFIER - 100)))) !== 0)) {
					{
					{
					this.state = 1621;
					this.blockStatement();
					}
					}
					this.state = 1626;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public classType(): ClassTypeContext {
		let _localctx: ClassTypeContext = new ClassTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 220, JavaParser.RULE_classType);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1632;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 198, this._ctx) ) {
			case 1:
				{
				this.state = 1629;
				this.classOrInterfaceType();
				this.state = 1630;
				this.match(JavaParser.DOT);
				}
				break;
			}
			this.state = 1637;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 199, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1634;
					this.annotation();
					}
					}
				}
				this.state = 1639;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 199, this._ctx);
			}
			this.state = 1640;
			this.identifier();
			this.state = 1642;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.LT) {
				{
				this.state = 1641;
				this.typeArguments();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public creator(): CreatorContext {
		let _localctx: CreatorContext = new CreatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 222, JavaParser.RULE_creator);
		try {
			this.state = 1653;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.LT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1644;
				this.nonWildcardTypeArguments();
				this.state = 1645;
				this.createdName();
				this.state = 1646;
				this.classCreatorRest();
				}
				break;
			case JavaParser.BOOLEAN:
			case JavaParser.BYTE:
			case JavaParser.CHAR:
			case JavaParser.DOUBLE:
			case JavaParser.FLOAT:
			case JavaParser.INT:
			case JavaParser.LONG:
			case JavaParser.SHORT:
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1648;
				this.createdName();
				this.state = 1651;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case JavaParser.LBRACK:
					{
					this.state = 1649;
					this.arrayCreatorRest();
					}
					break;
				case JavaParser.LPAREN:
					{
					this.state = 1650;
					this.classCreatorRest();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public createdName(): CreatedNameContext {
		let _localctx: CreatedNameContext = new CreatedNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 224, JavaParser.RULE_createdName);
		let _la: number;
		try {
			this.state = 1670;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1655;
				this.identifier();
				this.state = 1657;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.LT) {
					{
					this.state = 1656;
					this.typeArgumentsOrDiamond();
					}
				}

				this.state = 1666;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === JavaParser.DOT) {
					{
					{
					this.state = 1659;
					this.match(JavaParser.DOT);
					this.state = 1660;
					this.identifier();
					this.state = 1662;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === JavaParser.LT) {
						{
						this.state = 1661;
						this.typeArgumentsOrDiamond();
						}
					}

					}
					}
					this.state = 1668;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case JavaParser.BOOLEAN:
			case JavaParser.BYTE:
			case JavaParser.CHAR:
			case JavaParser.DOUBLE:
			case JavaParser.FLOAT:
			case JavaParser.INT:
			case JavaParser.LONG:
			case JavaParser.SHORT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1669;
				this.primitiveType();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public innerCreator(): InnerCreatorContext {
		let _localctx: InnerCreatorContext = new InnerCreatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 226, JavaParser.RULE_innerCreator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1672;
			this.identifier();
			this.state = 1674;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === JavaParser.LT) {
				{
				this.state = 1673;
				this.nonWildcardTypeArgumentsOrDiamond();
				}
			}

			this.state = 1676;
			this.classCreatorRest();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public arrayCreatorRest(): ArrayCreatorRestContext {
		let _localctx: ArrayCreatorRestContext = new ArrayCreatorRestContext(this._ctx, this.state);
		this.enterRule(_localctx, 228, JavaParser.RULE_arrayCreatorRest);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1678;
			this.match(JavaParser.LBRACK);
			this.state = 1706;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.RBRACK:
				{
				this.state = 1679;
				this.match(JavaParser.RBRACK);
				this.state = 1684;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === JavaParser.LBRACK) {
					{
					{
					this.state = 1680;
					this.match(JavaParser.LBRACK);
					this.state = 1681;
					this.match(JavaParser.RBRACK);
					}
					}
					this.state = 1686;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1687;
				this.arrayInitializer();
				}
				break;
			case JavaParser.BOOLEAN:
			case JavaParser.BYTE:
			case JavaParser.CHAR:
			case JavaParser.DOUBLE:
			case JavaParser.FLOAT:
			case JavaParser.INT:
			case JavaParser.LONG:
			case JavaParser.NEW:
			case JavaParser.SHORT:
			case JavaParser.SUPER:
			case JavaParser.SWITCH:
			case JavaParser.THIS:
			case JavaParser.VOID:
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.DECIMAL_LITERAL:
			case JavaParser.HEX_LITERAL:
			case JavaParser.OCT_LITERAL:
			case JavaParser.BINARY_LITERAL:
			case JavaParser.FLOAT_LITERAL:
			case JavaParser.HEX_FLOAT_LITERAL:
			case JavaParser.BOOL_LITERAL:
			case JavaParser.CHAR_LITERAL:
			case JavaParser.STRING_LITERAL:
			case JavaParser.TEXT_BLOCK:
			case JavaParser.NULL_LITERAL:
			case JavaParser.LPAREN:
			case JavaParser.LT:
			case JavaParser.BANG:
			case JavaParser.TILDE:
			case JavaParser.INC:
			case JavaParser.DEC:
			case JavaParser.ADD:
			case JavaParser.SUB:
			case JavaParser.AT:
			case JavaParser.IDENTIFIER:
				{
				this.state = 1688;
				this.expression(0);
				this.state = 1689;
				this.match(JavaParser.RBRACK);
				this.state = 1696;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 209, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1690;
						this.match(JavaParser.LBRACK);
						this.state = 1691;
						this.expression(0);
						this.state = 1692;
						this.match(JavaParser.RBRACK);
						}
						}
					}
					this.state = 1698;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 209, this._ctx);
				}
				this.state = 1703;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 210, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1699;
						this.match(JavaParser.LBRACK);
						this.state = 1700;
						this.match(JavaParser.RBRACK);
						}
						}
					}
					this.state = 1705;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 210, this._ctx);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public classCreatorRest(): ClassCreatorRestContext {
		let _localctx: ClassCreatorRestContext = new ClassCreatorRestContext(this._ctx, this.state);
		this.enterRule(_localctx, 230, JavaParser.RULE_classCreatorRest);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1708;
			this.arguments();
			this.state = 1710;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 212, this._ctx) ) {
			case 1:
				{
				this.state = 1709;
				this.classBody();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public explicitGenericInvocation(): ExplicitGenericInvocationContext {
		let _localctx: ExplicitGenericInvocationContext = new ExplicitGenericInvocationContext(this._ctx, this.state);
		this.enterRule(_localctx, 232, JavaParser.RULE_explicitGenericInvocation);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1712;
			this.nonWildcardTypeArguments();
			this.state = 1713;
			this.explicitGenericInvocationSuffix();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeArgumentsOrDiamond(): TypeArgumentsOrDiamondContext {
		let _localctx: TypeArgumentsOrDiamondContext = new TypeArgumentsOrDiamondContext(this._ctx, this.state);
		this.enterRule(_localctx, 234, JavaParser.RULE_typeArgumentsOrDiamond);
		try {
			this.state = 1718;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 213, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1715;
				this.match(JavaParser.LT);
				this.state = 1716;
				this.match(JavaParser.GT);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1717;
				this.typeArguments();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public nonWildcardTypeArgumentsOrDiamond(): NonWildcardTypeArgumentsOrDiamondContext {
		let _localctx: NonWildcardTypeArgumentsOrDiamondContext = new NonWildcardTypeArgumentsOrDiamondContext(this._ctx, this.state);
		this.enterRule(_localctx, 236, JavaParser.RULE_nonWildcardTypeArgumentsOrDiamond);
		try {
			this.state = 1723;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 214, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1720;
				this.match(JavaParser.LT);
				this.state = 1721;
				this.match(JavaParser.GT);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1722;
				this.nonWildcardTypeArguments();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext {
		let _localctx: NonWildcardTypeArgumentsContext = new NonWildcardTypeArgumentsContext(this._ctx, this.state);
		this.enterRule(_localctx, 238, JavaParser.RULE_nonWildcardTypeArguments);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1725;
			this.match(JavaParser.LT);
			this.state = 1726;
			this.typeList();
			this.state = 1727;
			this.match(JavaParser.GT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeList(): TypeListContext {
		let _localctx: TypeListContext = new TypeListContext(this._ctx, this.state);
		this.enterRule(_localctx, 240, JavaParser.RULE_typeList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1729;
			this.typeType();
			this.state = 1734;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.COMMA) {
				{
				{
				this.state = 1730;
				this.match(JavaParser.COMMA);
				this.state = 1731;
				this.typeType();
				}
				}
				this.state = 1736;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeType(): TypeTypeContext {
		let _localctx: TypeTypeContext = new TypeTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 242, JavaParser.RULE_typeType);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1740;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 216, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1737;
					this.annotation();
					}
					}
				}
				this.state = 1742;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 216, this._ctx);
			}
			this.state = 1745;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.IDENTIFIER:
				{
				this.state = 1743;
				this.classOrInterfaceType();
				}
				break;
			case JavaParser.BOOLEAN:
			case JavaParser.BYTE:
			case JavaParser.CHAR:
			case JavaParser.DOUBLE:
			case JavaParser.FLOAT:
			case JavaParser.INT:
			case JavaParser.LONG:
			case JavaParser.SHORT:
				{
				this.state = 1744;
				this.primitiveType();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 1757;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 219, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1750;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & ((1 << (JavaParser.MODULE - 51)) | (1 << (JavaParser.OPEN - 51)) | (1 << (JavaParser.REQUIRES - 51)) | (1 << (JavaParser.EXPORTS - 51)) | (1 << (JavaParser.OPENS - 51)) | (1 << (JavaParser.TO - 51)) | (1 << (JavaParser.USES - 51)) | (1 << (JavaParser.PROVIDES - 51)) | (1 << (JavaParser.WITH - 51)) | (1 << (JavaParser.TRANSITIVE - 51)) | (1 << (JavaParser.VAR - 51)) | (1 << (JavaParser.YIELD - 51)) | (1 << (JavaParser.RECORD - 51)) | (1 << (JavaParser.SEALED - 51)) | (1 << (JavaParser.PERMITS - 51)))) !== 0) || _la === JavaParser.AT || _la === JavaParser.IDENTIFIER) {
						{
						{
						this.state = 1747;
						this.annotation();
						}
						}
						this.state = 1752;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1753;
					this.match(JavaParser.LBRACK);
					this.state = 1754;
					this.match(JavaParser.RBRACK);
					}
					}
				}
				this.state = 1759;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 219, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public primitiveType(): PrimitiveTypeContext {
		let _localctx: PrimitiveTypeContext = new PrimitiveTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 244, JavaParser.RULE_primitiveType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1760;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG))) !== 0) || _la === JavaParser.SHORT)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeArguments(): TypeArgumentsContext {
		let _localctx: TypeArgumentsContext = new TypeArgumentsContext(this._ctx, this.state);
		this.enterRule(_localctx, 246, JavaParser.RULE_typeArguments);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1762;
			this.match(JavaParser.LT);
			this.state = 1763;
			this.typeArgument();
			this.state = 1768;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === JavaParser.COMMA) {
				{
				{
				this.state = 1764;
				this.match(JavaParser.COMMA);
				this.state = 1765;
				this.typeArgument();
				}
				}
				this.state = 1770;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1771;
			this.match(JavaParser.GT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public superSuffix(): SuperSuffixContext {
		let _localctx: SuperSuffixContext = new SuperSuffixContext(this._ctx, this.state);
		this.enterRule(_localctx, 248, JavaParser.RULE_superSuffix);
		let _la: number;
		try {
			this.state = 1782;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.LPAREN:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1773;
				this.arguments();
				}
				break;
			case JavaParser.DOT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1774;
				this.match(JavaParser.DOT);
				this.state = 1776;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JavaParser.LT) {
					{
					this.state = 1775;
					this.typeArguments();
					}
				}

				this.state = 1778;
				this.identifier();
				this.state = 1780;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 222, this._ctx) ) {
				case 1:
					{
					this.state = 1779;
					this.arguments();
					}
					break;
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public explicitGenericInvocationSuffix(): ExplicitGenericInvocationSuffixContext {
		let _localctx: ExplicitGenericInvocationSuffixContext = new ExplicitGenericInvocationSuffixContext(this._ctx, this.state);
		this.enterRule(_localctx, 250, JavaParser.RULE_explicitGenericInvocationSuffix);
		try {
			this.state = 1789;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case JavaParser.SUPER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1784;
				this.match(JavaParser.SUPER);
				this.state = 1785;
				this.superSuffix();
				}
				break;
			case JavaParser.MODULE:
			case JavaParser.OPEN:
			case JavaParser.REQUIRES:
			case JavaParser.EXPORTS:
			case JavaParser.OPENS:
			case JavaParser.TO:
			case JavaParser.USES:
			case JavaParser.PROVIDES:
			case JavaParser.WITH:
			case JavaParser.TRANSITIVE:
			case JavaParser.VAR:
			case JavaParser.YIELD:
			case JavaParser.RECORD:
			case JavaParser.SEALED:
			case JavaParser.PERMITS:
			case JavaParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1786;
				this.identifier();
				this.state = 1787;
				this.arguments();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public arguments(): ArgumentsContext {
		let _localctx: ArgumentsContext = new ArgumentsContext(this._ctx, this.state);
		this.enterRule(_localctx, 252, JavaParser.RULE_arguments);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1791;
			this.match(JavaParser.LPAREN);
			this.state = 1793;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << JavaParser.BOOLEAN) | (1 << JavaParser.BYTE) | (1 << JavaParser.CHAR) | (1 << JavaParser.DOUBLE) | (1 << JavaParser.FLOAT) | (1 << JavaParser.INT) | (1 << JavaParser.LONG) | (1 << JavaParser.NEW))) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (JavaParser.SHORT - 37)) | (1 << (JavaParser.SUPER - 37)) | (1 << (JavaParser.SWITCH - 37)) | (1 << (JavaParser.THIS - 37)) | (1 << (JavaParser.VOID - 37)) | (1 << (JavaParser.MODULE - 37)) | (1 << (JavaParser.OPEN - 37)) | (1 << (JavaParser.REQUIRES - 37)) | (1 << (JavaParser.EXPORTS - 37)) | (1 << (JavaParser.OPENS - 37)) | (1 << (JavaParser.TO - 37)) | (1 << (JavaParser.USES - 37)) | (1 << (JavaParser.PROVIDES - 37)) | (1 << (JavaParser.WITH - 37)) | (1 << (JavaParser.TRANSITIVE - 37)) | (1 << (JavaParser.VAR - 37)) | (1 << (JavaParser.YIELD - 37)) | (1 << (JavaParser.RECORD - 37)) | (1 << (JavaParser.SEALED - 37)) | (1 << (JavaParser.PERMITS - 37)) | (1 << (JavaParser.DECIMAL_LITERAL - 37)) | (1 << (JavaParser.HEX_LITERAL - 37)))) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & ((1 << (JavaParser.OCT_LITERAL - 69)) | (1 << (JavaParser.BINARY_LITERAL - 69)) | (1 << (JavaParser.FLOAT_LITERAL - 69)) | (1 << (JavaParser.HEX_FLOAT_LITERAL - 69)) | (1 << (JavaParser.BOOL_LITERAL - 69)) | (1 << (JavaParser.CHAR_LITERAL - 69)) | (1 << (JavaParser.STRING_LITERAL - 69)) | (1 << (JavaParser.TEXT_BLOCK - 69)) | (1 << (JavaParser.NULL_LITERAL - 69)) | (1 << (JavaParser.LPAREN - 69)) | (1 << (JavaParser.LT - 69)) | (1 << (JavaParser.BANG - 69)) | (1 << (JavaParser.TILDE - 69)) | (1 << (JavaParser.INC - 69)))) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & ((1 << (JavaParser.DEC - 101)) | (1 << (JavaParser.ADD - 101)) | (1 << (JavaParser.SUB - 101)) | (1 << (JavaParser.AT - 101)) | (1 << (JavaParser.IDENTIFIER - 101)))) !== 0)) {
				{
				this.state = 1792;
				this.expressionList();
				}
			}

			this.state = 1795;
			this.match(JavaParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 99:
			return this.expression_sempred(_localctx as ExpressionContext, predIndex);

		case 107:
			return this.guardedPattern_sempred(_localctx as GuardedPatternContext, predIndex);

		case 108:
			return this.guard_sempred(_localctx as GuardContext, predIndex);
		}
		return true;
	}
	private expression_sempred(_localctx: ExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 18);

		case 1:
			return this.precpred(this._ctx, 17);

		case 2:
			return this.precpred(this._ctx, 16);

		case 3:
			return this.precpred(this._ctx, 15);

		case 4:
			return this.precpred(this._ctx, 13);

		case 5:
			return this.precpred(this._ctx, 12);

		case 6:
			return this.precpred(this._ctx, 11);

		case 7:
			return this.precpred(this._ctx, 10);

		case 8:
			return this.precpred(this._ctx, 9);

		case 9:
			return this.precpred(this._ctx, 8);

		case 10:
			return this.precpred(this._ctx, 7);

		case 11:
			return this.precpred(this._ctx, 6);

		case 12:
			return this.precpred(this._ctx, 26);

		case 13:
			return this.precpred(this._ctx, 25);

		case 14:
			return this.precpred(this._ctx, 21);

		case 15:
			return this.precpred(this._ctx, 14);

		case 16:
			return this.precpred(this._ctx, 3);
		}
		return true;
	}
	private guardedPattern_sempred(_localctx: GuardedPatternContext, predIndex: number): boolean {
		switch (predIndex) {
		case 17:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private guard_sempred(_localctx: GuardContext, predIndex: number): boolean {
		switch (predIndex) {
		case 18:
			return this._input.LT(1).text === 'when';
		}
		return true;
	}

	private static readonly _serializedATNSegments: number = 4;
	private static readonly _serializedATNSegment0: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x82\u0708\x04" +
		"\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04" +
		"\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r" +
		"\x04\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12" +
		"\x04\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17" +
		"\x04\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C" +
		"\x04\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04" +
		"#\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04+\t" +
		"+\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x040\t0\x041\t1\x042\t2\x043\t3\x04" +
		"4\t4\x045\t5\x046\t6\x047\t7\x048\t8\x049\t9\x04:\t:\x04;\t;\x04<\t<\x04" +
		"=\t=\x04>\t>\x04?\t?\x04@\t@\x04A\tA\x04B\tB\x04C\tC\x04D\tD\x04E\tE\x04" +
		"F\tF\x04G\tG\x04H\tH\x04I\tI\x04J\tJ\x04K\tK\x04L\tL\x04M\tM\x04N\tN\x04" +
		"O\tO\x04P\tP\x04Q\tQ\x04R\tR\x04S\tS\x04T\tT\x04U\tU\x04V\tV\x04W\tW\x04" +
		"X\tX\x04Y\tY\x04Z\tZ\x04[\t[\x04\\\t\\\x04]\t]\x04^\t^\x04_\t_\x04`\t" +
		"`\x04a\ta\x04b\tb\x04c\tc\x04d\td\x04e\te\x04f\tf\x04g\tg\x04h\th\x04" +
		"i\ti\x04j\tj\x04k\tk\x04l\tl\x04m\tm\x04n\tn\x04o\to\x04p\tp\x04q\tq\x04" +
		"r\tr\x04s\ts\x04t\tt\x04u\tu\x04v\tv\x04w\tw\x04x\tx\x04y\ty\x04z\tz\x04" +
		"{\t{\x04|\t|\x04}\t}\x04~\t~\x04\x7F\t\x7F\x04\x80\t\x80\x03\x02\x05\x02" +
		"\u0102\n\x02\x03\x02\x03\x02\x07\x02\u0106\n\x02\f\x02\x0E\x02\u0109\v" +
		"\x02\x03\x02\x03\x02\x07\x02\u010D\n\x02\f\x02\x0E\x02\u0110\v\x02\x03" +
		"\x02\x03\x02\x03\x02\x05\x02\u0115\n\x02\x03\x03\x07\x03\u0118\n\x03\f" +
		"\x03\x0E\x03\u011B\v\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x04\x03\x04" +
		"\x05\x04\u0123\n\x04\x03\x04\x03\x04\x03\x04\x05\x04\u0128\n\x04\x03\x04" +
		"\x03\x04\x03\x04\x05\x04\u012D\n\x04\x03\x05\x07\x05\u0130\n\x05\f\x05" +
		"\x0E\x05\u0133\v\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x05\x05\u013A" +
		"\n\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x05\x06\u0141\n\x06\x03" +
		"\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03" +
		"\x07\x05\x07\u014D\n\x07\x03\b\x03\b\x05\b\u0151\n\b\x03\t\x03\t\x03\t" +
		"\x05\t\u0156\n\t\x03\t\x03\t\x05\t\u015A\n\t\x03\t\x03\t\x05\t\u015E\n" +
		"\t\x03\t\x03\t\x05\t\u0162\n\t\x03\t\x03\t\x03\n\x03\n\x03\n\x03\n\x07" +
		"\n\u016A\n\n\f\n\x0E\n\u016D\v\n\x03\n\x03\n\x03\v\x07\v\u0172\n\v\f\v" +
		"\x0E\v\u0175\v\v\x03\v\x03\v\x03\v\x07\v\u017A\n\v\f\v\x0E\v\u017D\v\v" +
		"\x03\v\x05\v\u0180\n\v\x03\f\x03\f\x03\f\x07\f\u0185\n\f\f\f\x0E\f\u0188" +
		"\v\f\x03\r\x03\r\x03\r\x03\r\x05\r\u018E\n\r\x03\r\x03\r\x05\r\u0192\n" +
		"\r\x03\r\x05\r\u0195\n\r\x03\r\x05\r\u0198\n\r\x03\r\x03\r\x03\x0E\x03" +
		"\x0E\x03\x0E\x07\x0E\u019F\n\x0E\f\x0E\x0E\x0E\u01A2\v\x0E\x03\x0F\x07" +
		"\x0F\u01A5\n\x0F\f\x0F\x0E\x0F\u01A8\v\x0F\x03\x0F\x03\x0F\x05\x0F\u01AC" +
		"\n\x0F\x03\x0F\x05\x0F\u01AF\n\x0F\x03\x10\x03\x10\x07\x10\u01B3\n\x10" +
		"\f\x10\x0E\x10\u01B6\v\x10\x03\x11\x03\x11\x03\x11\x05\x11\u01BB\n\x11" +
		"\x03\x11\x03\x11\x05\x11\u01BF\n\x11\x03\x11\x03\x11\x05\x11\u01C3\n\x11" +
		"\x03\x11\x03\x11\x03\x12\x03\x12\x07\x12\u01C9\n\x12\f\x12\x0E\x12\u01CC" +
		"\v\x12\x03\x12\x03\x12\x03\x13\x03\x13\x07\x13\u01D2\n\x13\f\x13\x0E\x13" +
		"\u01D5\v\x13\x03\x13\x03\x13\x03\x14\x03\x14\x05\x14\u01DB\n\x14\x03\x14" +
		"\x03\x14\x07\x14\u01DF\n\x14\f\x14\x0E\x14\u01E2\v\x14\x03\x14\x05\x14" +
		"\u01E5\n\x14\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03" +
		"\x15\x03\x15\x03\x15\x05\x15\u01F1\n\x15\x03\x16\x03\x16\x03\x16\x03\x16" +
		"\x03\x16\x07\x16\u01F8\n\x16\f\x16\x0E\x16\u01FB\v\x16\x03\x16\x03\x16" +
		"\x05\x16\u01FF\n\x16\x03\x16\x03\x16\x03\x17\x03\x17\x05\x17\u0205\n\x17" +
		"\x03\x18\x03\x18\x05\x18\u0209\n\x18\x03\x19\x03\x19\x03\x19\x03\x1A\x03" +
		"\x1A\x03\x1A\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x05\x1B\u0215\n\x1B\x03\x1B" +
		"\x03\x1B\x03\x1C\x07\x1C\u021A\n\x1C\f\x1C\x0E\x1C\u021D\v\x1C\x03\x1C" +
		"\x03\x1C\x03\x1C\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1E\x07\x1E\u0227" +
		"\n\x1E\f\x1E\x0E\x1E\u022A\v\x1E\x03\x1E\x03\x1E\x05\x1E\u022E\n\x1E\x03" +
		"\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x05\x1F\u0238" +
		"\n\x1F\x03 \x03 \x03 \x03 \x07 \u023E\n \f \x0E \u0241\v \x03 \x03 \x03" +
		"!\x03!\x03!\x07!\u0248\n!\f!\x0E!\u024B\v!\x03!\x03!\x03!\x03\"\x07\"" +
		"\u0251\n\"\f\"\x0E\"\u0254\v\"\x03\"\x03\"\x03#\x03#\x03#\x03#\x03#\x03" +
		"#\x05#\u025E\n#\x03$\x07$\u0261\n$\f$\x0E$\u0264\v$\x03$\x03$\x03$\x03" +
		"%\x07%\u026A\n%\f%\x0E%\u026D\v%\x03%\x03%\x03%\x03%\x03%\x07%\u0274\n" +
		"%\f%\x0E%\u0277\v%\x03%\x03%\x05%\u027B\n%\x03%\x03%\x03&\x03&\x03&\x07" +
		"&\u0282\n&\f&\x0E&\u0285\v&\x03\'\x03\'\x03\'\x05\'\u028A\n\'\x03(\x03" +
		"(\x03(\x07(\u028F\n(\f(\x0E(\u0292\v(\x03)\x03)\x05)\u0296\n)\x03*\x03" +
		"*\x03*\x03*\x07*\u029C\n*\f*\x0E*\u029F\v*\x03*\x05*\u02A2\n*\x05*\u02A4" +
		"\n*\x03*\x03*\x03+\x03+\x05+\u02AA\n+\x03+\x03+\x07+\u02AE\n+\f+\x0E+" +
		"\u02B1\v+\x03+\x03+\x05+\u02B5\n+\x03,\x03,\x07,\u02B9\n,\f,\x0E,\u02BC" +
		"\v,\x03,\x03,\x03,\x05,\u02C1\n,\x05,\u02C3\n,\x03-\x03-\x03-\x07-\u02C8" +
		"\n-\f-\x0E-\u02CB\v-\x03.\x03.\x05.\u02CF\n.\x03.\x03.\x03.\x05.\u02D4" +
		"\n.\x03.\x05.\u02D7\n.\x05.\u02D9\n.\x03.\x03.\x03/\x03/\x03/\x03/\x07" +
		"/\u02E1\n/\f/\x0E/\u02E4\v/\x03/\x03/\x030\x030\x030\x070\u02EB\n0\f0" +
		"\x0E0\u02EE\v0\x030\x030\x050\u02F2\n0\x030\x050\u02F5\n0\x031\x071\u02F8" +
		"\n1\f1\x0E1\u02FB\v1\x031\x031\x031\x032\x072\u0301\n2\f2\x0E2\u0304\v" +
		"2\x032\x032\x072\u0308\n2\f2\x0E2\u030B\v2\x032\x032\x032\x033\x033\x03" +
		"3\x073\u0313\n3\f3\x0E3\u0316\v3\x034\x074\u0319\n4\f4\x0E4\u031C\v4\x03" +
		"4\x034\x034\x035\x035\x035\x075\u0324\n5\f5\x0E5\u0327\v5\x036\x036\x03" +
		"6\x036\x036\x036\x036\x056\u0330\n6\x037\x037\x038\x038\x039\x039\x03" +
		"9\x079\u0339\n9\f9\x0E9\u033C\v9\x039\x039\x039\x03:\x03:\x03:\x05:\u0344" +
		"\n:\x03:\x03:\x03:\x05:\u0349\n:\x03:\x05:\u034C\n:\x03;\x03;\x03;\x07" +
		";\u0351\n;\f;\x0E;\u0354\v;\x03<\x03<\x03<\x03<\x03=\x03=\x03=\x05=\u035D" +
		"\n=\x03>\x03>\x03>\x03>\x07>\u0363\n>\f>\x0E>\u0366\v>\x05>\u0368\n>\x03" +
		">\x05>\u036B\n>\x03>\x03>\x03?\x03?\x03?\x03?\x03?\x03@\x03@\x07@\u0376" +
		"\n@\f@\x0E@\u0379\v@\x03@\x03@\x03A\x07A\u037E\nA\fA\x0EA\u0381\vA\x03" +
		"A\x03A\x05A\u0385\nA\x03B\x03B\x03B\x03B\x03B\x03B\x05B\u038D\nB\x03B" +
		"\x03B\x05B\u0391\nB\x03B\x03B\x05B\u0395\nB\x03B\x03B\x05B\u0399\nB\x03" +
		"B\x03B\x05B\u039D\nB\x05B\u039F\nB\x03C\x03C\x05C\u03A3\nC\x03D\x03D\x03" +
		"D\x03D\x05D\u03A9\nD\x03E\x03E\x03F\x03F\x03F\x03G\x05G\u03B1\nG\x03G" +
		"\x03G\x03G\x03G\x03H\x03H\x07H\u03B9\nH\fH\x0EH\u03BC\vH\x03H\x03H\x03" +
		"I\x03I\x07I\u03C2\nI\fI\x0EI\u03C5\vI\x03I\x03I\x03I\x03I\x03I\x03I\x03" +
		"I\x05I\u03CE\nI\x03I\x03I\x03I\x03I\x03I\x03I\x05I\u03D6\nI\x03I\x03I" +
		"\x03I\x03I\x03I\x03I\x03I\x03I\x03I\x03I\x03I\x03I\x05I\u03E4\nI\x03J" +
		"\x03J\x03K\x03K\x03K\x05K\u03EB\nK\x03K\x03K\x03K\x05K\u03F0\nK\x03K\x03" +
		"K\x03L\x03L\x05L\u03F6\nL\x03L\x03L\x03M\x03M\x03M\x07M\u03FD\nM\fM\x0E" +
		"M\u0400\vM\x03N\x03N\x03N\x03O\x03O\x03O\x07O\u0408\nO\fO\x0EO\u040B\v" +
		"O\x03O\x03O\x03P\x03P\x07P\u0411\nP\fP\x0EP\u0414\vP\x03P\x03P\x03Q\x03" +
		"Q\x03Q\x03Q\x03Q\x05Q\u041D\nQ\x03R\x07R\u0420\nR\fR\x0ER\u0423\vR\x03" +
		"R\x03R\x03R\x03R\x03R\x03R\x03R\x03R\x05R\u042D\nR\x03S\x03S\x03T\x03" +
		"T\x03U\x07U\u0434\nU\fU\x0EU\u0437\vU\x03U\x03U\x03U\x05U\u043C\nU\x03" +
		"V\x03V\x03V\x03V\x03V\x05V\u0443\nV\x03V\x03V\x03V\x03V\x03V\x03V\x03" +
		"V\x05V\u044C\nV\x03V\x03V\x03V\x03V\x03V\x03V\x03V\x03V\x03V\x03V\x03" +
		"V\x03V\x03V\x03V\x03V\x03V\x03V\x03V\x03V\x06V\u0461\nV\rV\x0EV\u0462" +
		"\x03V\x05V\u0466\nV\x03V\x05V\u0469\nV\x03V\x03V\x03V\x03V\x07V\u046F" +
		"\nV\fV\x0EV\u0472\vV\x03V\x05V\u0475\nV\x03V\x03V\x03V\x03V\x07V\u047B" +
		"\nV\fV\x0EV\u047E\vV\x03V\x07V\u0481\nV\fV\x0EV\u0484\vV\x03V\x03V\x03" +
		"V\x03V\x03V\x03V\x03V\x03V\x05V\u048E\nV\x03V\x03V\x03V\x03V\x03V\x03" +
		"V\x03V\x05V\u0497\nV\x03V\x03V\x03V\x05V\u049C\nV\x03V\x03V\x03V\x03V" +
		"\x03V\x03V\x03V\x03V\x03V\x03V\x03V\x05V\u04A9\nV\x03V\x03V\x03V\x03V" +
		"\x05V\u04AF\nV\x03W\x03W\x03W\x07W\u04B4\nW\fW\x0EW\u04B7\vW\x03W\x03" +
		"W\x03W\x03W\x03W\x03X\x03X\x03X\x07X\u04C1\nX\fX\x0EX\u04C4\vX\x03Y\x03" +
		"Y\x03Y\x03Z\x03Z\x03Z\x05Z\u04CC\nZ\x03Z\x03Z\x03[\x03[\x03[\x07[\u04D3" +
		"\n[\f[\x0E[\u04D6\v[\x03\\\x07\\\u04D9\n\\\f\\\x0E\\\u04DC\v\\\x03\\\x03" +
		"\\\x03\\\x03\\\x03\\\x05\\\u04E3\n\\\x03\\\x03\\\x03\\\x03\\\x05\\\u04E9" +
		"\n\\\x03]\x06]\u04EC\n]\r]\x0E]\u04ED\x03]\x06]\u04F1\n]\r]\x0E]\u04F2" +
		"\x03^\x03^\x03^\x03^\x03^\x03^\x03^\x03^\x03^\x05^\u04FE\n^\x05^\u0500" +
		"\n^\x03^\x03^\x03^\x05^\u0505\n^\x03_\x03_\x05_\u0509\n_\x03_\x03_\x05" +
		"_\u050D\n_\x03_\x03_\x05_\u0511\n_\x05_\u0513\n_\x03`\x03`\x05`\u0517" +
		"\n`\x03a\x07a\u051A\na\fa\x0Ea\u051D\va\x03a\x03a\x05a\u0521\na\x03a\x03" +
		"a\x03a\x03a\x03b\x03b\x03b\x03b\x03c\x03c\x03c\x07c\u052E\nc\fc\x0Ec\u0531" +
		"\vc\x03d\x03d\x03d\x05d\u0536\nd\x03d\x03d\x03d\x03d\x03d\x05d\u053D\n" +
		"d\x03d\x03d\x03d\x03d\x05d\u0543\nd\x03d\x05d\u0546\nd\x03e\x03e\x03e" +
		"\x03e\x03e\x03e\x03e\x07e\u054F\ne\fe\x0Ee\u0552\ve\x03e\x03e\x03e\x07" +
		"e\u0557\ne\fe\x0Ee\u055A\ve\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03" +
		"e\x03e\x03e\x03e\x05e\u0568\ne\x03e\x03e\x05e\u056C\ne\x03e\x03e\x03e" +
		"\x05e\u0571\ne\x03e\x03e\x05e\u0575\ne\x03e\x03e\x03e\x03e\x03e\x03e\x03" +
		"e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x05e\u0585\ne\x03e\x03e\x03e\x03" +
		"e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03" +
		"e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03" +
		"e\x03e\x03e\x03e\x03e\x03e\x03e\x05e\u05AD\ne\x03e\x03e\x03e\x03e\x05" +
		"e\u05B3\ne\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x03e\x05" +
		"e\u05C0\ne\x03e\x03e\x03e\x05e\u05C5\ne\x03e\x07e\u05C8\ne\fe\x0Ee\u05CB" +
		"\ve\x03f\x07f\u05CE\nf\ff\x0Ef\u05D1\vf\x03f\x03f\x07f\u05D5\nf\ff\x0E" +
		"f\u05D8\vf\x03f\x03f\x03g\x03g\x03g\x03g\x03h\x03h\x03h\x05h\u05E3\nh" +
		"\x03h\x03h\x03h\x03h\x03h\x07h\u05EA\nh\fh\x0Eh\u05ED\vh\x03h\x03h\x03" +
		"h\x03h\x05h\u05F3\nh\x03h\x05h\u05F6\nh\x03i\x03i\x05i\u05FA\ni\x03j\x03" +
		"j\x03j\x03j\x03j\x03j\x03j\x03j\x03j\x03j\x03j\x03j\x03j\x03j\x03j\x03" +
		"j\x05j\u060C\nj\x05j\u060E\nj\x03k\x03k\x03k\x03k\x07k\u0614\nk\fk\x0E" +
		"k\u0617\vk\x03k\x03k\x03l\x03l\x03l\x03l\x03l\x05l\u0620\nl\x03l\x05l" +
		"\u0623\nl\x03l\x03l\x03l\x03l\x03l\x05l\u062A\nl\x03m\x03m\x03m\x03m\x03" +
		"m\x03m\x07m\u0632\nm\fm\x0Em\u0635\vm\x03m\x03m\x07m\u0639\nm\fm\x0Em" +
		"\u063C\vm\x03m\x03m\x03m\x03m\x07m\u0642\nm\fm\x0Em\u0645\vm\x05m\u0647" +
		"\nm\x03m\x03m\x03m\x03m\x07m\u064D\nm\fm\x0Em\u0650\vm\x03n\x03n\x03n" +
		"\x05n\u0655\nn\x03o\x03o\x07o\u0659\no\fo\x0Eo\u065C\vo\x05o\u065E\no" +
		"\x03p\x03p\x03p\x05p\u0663\np\x03p\x07p\u0666\np\fp\x0Ep\u0669\vp\x03" +
		"p\x03p\x05p\u066D\np\x03q\x03q\x03q\x03q\x03q\x03q\x03q\x05q\u0676\nq" +
		"\x05q\u0678\nq\x03r\x03r\x05r\u067C\nr\x03r\x03r\x03r\x05r\u0681\nr\x07" +
		"r\u0683\nr\fr\x0Er\u0686\vr\x03r\x05r\u0689\nr\x03s\x03s\x05s\u068D\n" +
		"s\x03s\x03s\x03t\x03t\x03t\x03t\x07t\u0695\nt\ft\x0Et\u0698\vt\x03t\x03" +
		"t\x03t\x03t\x03t\x03t\x03t\x07t\u06A1\nt\ft\x0Et\u06A4\vt\x03t\x03t\x07" +
		"t\u06A8\nt\ft\x0Et\u06AB\vt\x05t\u06AD\nt\x03u\x03u\x05u\u06B1\nu\x03" +
		"v\x03v\x03v\x03w\x03w\x03w\x05w\u06B9\nw\x03x\x03x\x03x\x05x\u06BE\nx" +
		"\x03y\x03y\x03y\x03y\x03z\x03z\x03z\x07z\u06C7\nz\fz\x0Ez\u06CA\vz\x03" +
		"{\x07{\u06CD\n{\f{\x0E{\u06D0\v{\x03{\x03{\x05{\u06D4\n{\x03{\x07{\u06D7" +
		"\n{\f{\x0E{\u06DA\v{\x03{\x03{\x07{\u06DE\n{\f{\x0E{\u06E1\v{\x03|\x03" +
		"|\x03}\x03}\x03}\x03}\x07}\u06E9\n}\f}\x0E}\u06EC\v}\x03}\x03}\x03~\x03" +
		"~\x03~\x05~\u06F3\n~\x03~\x03~\x05~\u06F7\n~\x05~\u06F9\n~\x03\x7F\x03" +
		"\x7F\x03\x7F\x03\x7F\x03\x7F\x05\x7F\u0700\n\x7F\x03\x80\x03\x80\x05\x80" +
		"\u0704\n\x80\x03\x80\x03\x80\x03\x80\x02\x02\x04\xC8\xD8\x81\x02\x02\x04" +
		"\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02" +
		"\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02&\x02(\x02*\x02,\x02." +
		"\x020\x022\x024\x026\x028\x02:\x02<\x02>\x02@\x02B\x02D\x02F\x02H\x02" +
		"J\x02L\x02N\x02P\x02R\x02T\x02V\x02X\x02Z\x02\\\x02^\x02`\x02b\x02d\x02" +
		"f\x02h\x02j\x02l\x02n\x02p\x02r\x02t\x02v\x02x\x02z\x02|\x02~\x02\x80" +
		"\x02\x82\x02\x84\x02\x86\x02\x88\x02\x8A\x02\x8C\x02\x8E\x02\x90\x02\x92" +
		"\x02\x94\x02\x96\x02\x98\x02\x9A\x02\x9C\x02\x9E\x02\xA0\x02\xA2\x02\xA4" +
		"\x02\xA6\x02\xA8\x02\xAA\x02\xAC\x02\xAE\x02\xB0\x02\xB2\x02\xB4\x02\xB6" +
		"\x02\xB8\x02\xBA\x02\xBC\x02\xBE\x02\xC0\x02\xC2\x02\xC4\x02\xC6\x02\xC8" +
		"\x02\xCA\x02\xCC\x02\xCE\x02\xD0\x02\xD2\x02\xD4\x02\xD6\x02\xD8\x02\xDA" +
		"\x02\xDC\x02\xDE\x02\xE0\x02\xE2\x02\xE4\x02\xE6\x02\xE8\x02\xEA\x02\xEC" +
		"\x02\xEE\x02\xF0\x02\xF2\x02\xF4\x02\xF6\x02\xF8\x02\xFA\x02\xFC\x02\xFE" +
		"\x02\x02\x12\x04\x02\x13\x13**\x03\x02EH\x03\x02IJ\x04\x02((>>\x04\x02" +
		"5C\x82\x82\x05\x025>AC\x82\x82\x03\x02fi\x03\x02\\]\x04\x02jkoo\x03\x02" +
		"hi\x04\x02Z[ab\x04\x02``cc\x04\x02YYpz\x03\x02fg\x04\x02__{{\n\x02\x05" +
		"\x05\x07\x07\n\n\x10\x10\x16\x16\x1D\x1D\x1F\x1F\'\'\x02\u07D4\x02\u0114" +
		"\x03\x02\x02\x02\x04\u0119\x03\x02\x02\x02\x06\u012C\x03\x02\x02\x02\b" +
		"\u0131\x03\x02\x02\x02\n\u0140\x03\x02\x02\x02\f\u014C\x03\x02\x02\x02" +
		"\x0E\u0150\x03\x02\x02\x02\x10\u0152\x03\x02\x02\x02\x12\u0165\x03\x02" +
		"\x02\x02\x14\u0173\x03\x02\x02\x02\x16\u0181\x03\x02\x02\x02\x18\u0189" +
		"\x03\x02\x02\x02\x1A\u019B\x03\x02\x02\x02\x1C\u01A6\x03\x02\x02\x02\x1E" +
		"\u01B0\x03\x02\x02\x02 \u01B7\x03\x02\x02\x02\"\u01C6\x03\x02\x02\x02" +
		"$\u01CF\x03\x02\x02\x02&\u01E4\x03\x02\x02\x02(\u01F0\x03\x02\x02\x02" +
		"*\u01F2\x03\x02\x02\x02,\u0204\x03\x02\x02\x02.\u0208\x03\x02\x02\x02" +
		"0\u020A\x03\x02\x02\x022\u020D\x03\x02\x02\x024\u0210\x03\x02\x02\x02" +
		"6\u021B\x03\x02\x02\x028\u0221\x03\x02\x02\x02:\u022D\x03\x02\x02\x02" +
		"<\u0237\x03\x02\x02\x02>\u0239\x03\x02\x02\x02@\u0244\x03\x02\x02\x02" +
		"B\u0252\x03\x02\x02\x02D\u025D\x03\x02\x02\x02F\u0262\x03\x02\x02\x02" +
		"H\u026B\x03\x02\x02\x02J\u027E\x03\x02\x02\x02L\u0286\x03\x02\x02\x02" +
		"N\u028B\x03\x02\x02\x02P\u0295\x03\x02\x02\x02R\u0297\x03\x02\x02\x02" +
		"T\u02AF\x03\x02\x02\x02V\u02C2\x03\x02\x02\x02X\u02C4\x03\x02\x02\x02" +
		"Z\u02CC\x03\x02\x02\x02\\\u02DC\x03\x02\x02\x02^\u02F4\x03\x02\x02\x02" +
		"`\u02F9\x03\x02\x02\x02b\u0302\x03\x02\x02\x02d\u030F\x03\x02\x02\x02" +
		"f\u031A\x03\x02\x02\x02h\u0320\x03\x02\x02\x02j\u032F\x03\x02\x02\x02" +
		"l\u0331\x03\x02\x02\x02n\u0333\x03\x02\x02\x02p\u033A\x03\x02\x02\x02" +
		"r\u0343\x03\x02\x02\x02t\u034D\x03\x02\x02\x02v\u0355\x03\x02\x02\x02" +
		"x\u035C\x03\x02\x02\x02z\u035E\x03\x02\x02\x02|\u036E\x03\x02\x02\x02" +
		"~\u0373\x03\x02\x02\x02\x80\u0384\x03\x02\x02\x02\x82\u039E\x03\x02\x02" +
		"\x02\x84\u03A2\x03\x02\x02\x02\x86\u03A4\x03\x02\x02\x02\x88\u03AA\x03" +
		"\x02\x02\x02\x8A\u03AC\x03\x02\x02\x02\x8C\u03B0\x03\x02\x02\x02\x8E\u03B6" +
		"\x03\x02\x02\x02\x90\u03E3\x03\x02\x02\x02\x92\u03E5\x03\x02\x02\x02\x94" +
		"\u03E7\x03\x02\x02\x02\x96\u03F3\x03\x02\x02\x02\x98\u03F9\x03\x02\x02" +
		"\x02\x9A\u0401\x03\x02\x02\x02\x9C\u0404\x03\x02\x02\x02\x9E\u040E\x03" +
		"\x02\x02\x02\xA0\u041C\x03\x02\x02\x02\xA2\u0421\x03\x02\x02\x02\xA4\u042E" +
		"\x03\x02\x02\x02\xA6\u0430\x03\x02\x02\x02\xA8\u0435\x03\x02\x02\x02\xAA" +
		"\u04AE\x03\x02\x02\x02\xAC\u04B0\x03\x02\x02\x02\xAE\u04BD\x03\x02\x02" +
		"\x02\xB0\u04C5\x03\x02\x02\x02\xB2\u04C8\x03\x02\x02\x02\xB4\u04CF\x03" +
		"\x02\x02\x02\xB6\u04E8\x03\x02\x02\x02\xB8\u04EB\x03\x02\x02\x02\xBA\u0504" +
		"\x03\x02\x02\x02\xBC\u0512\x03\x02\x02\x02\xBE\u0516\x03\x02\x02\x02\xC0" +
		"\u051B\x03\x02\x02\x02\xC2\u0526\x03\x02\x02\x02\xC4\u052A\x03\x02\x02" +
		"\x02\xC6\u0545\x03\x02\x02\x02\xC8\u0574\x03\x02\x02\x02\xCA\u05CF\x03" +
		"\x02\x02\x02\xCC\u05DB\x03\x02\x02\x02\xCE\u05F5\x03\x02\x02\x02\xD0\u05F9" +
		"\x03\x02\x02\x02\xD2\u060D\x03\x02\x02\x02\xD4\u060F\x03\x02\x02\x02\xD6" +
		"\u0629\x03\x02\x02\x02\xD8\u0646\x03\x02\x02\x02\xDA\u0654\x03\x02\x02" +
		"\x02\xDC\u065D\x03\x02\x02\x02\xDE\u0662\x03\x02\x02\x02\xE0\u0677\x03" +
		"\x02\x02\x02\xE2\u0688\x03\x02\x02\x02\xE4\u068A\x03\x02\x02\x02\xE6\u0690" +
		"\x03\x02\x02\x02\xE8\u06AE\x03\x02\x02\x02\xEA\u06B2\x03\x02\x02\x02\xEC" +
		"\u06B8\x03\x02\x02\x02\xEE\u06BD\x03\x02\x02\x02\xF0\u06BF\x03\x02\x02" +
		"\x02\xF2\u06C3\x03\x02\x02";
	private static readonly _serializedATNSegment1: string =
		"\x02\xF4\u06CE\x03\x02\x02\x02\xF6\u06E2\x03\x02\x02\x02\xF8\u06E4\x03" +
		"\x02\x02\x02\xFA\u06F8\x03\x02\x02\x02\xFC\u06FF\x03\x02\x02\x02\xFE\u0701" +
		"\x03\x02\x02\x02\u0100\u0102\x05\x04\x03\x02\u0101\u0100\x03\x02\x02\x02" +
		"\u0101\u0102\x03\x02\x02\x02\u0102\u0107\x03\x02\x02\x02\u0103\u0106\x05" +
		"\x06\x04\x02\u0104\u0106\x07V\x02\x02\u0105\u0103\x03\x02\x02\x02\u0105" +
		"\u0104\x03\x02\x02\x02\u0106\u0109\x03\x02\x02\x02\u0107\u0105\x03\x02" +
		"\x02\x02\u0107\u0108\x03\x02\x02\x02\u0108\u010E\x03\x02\x02\x02\u0109" +
		"\u0107\x03\x02\x02\x02\u010A\u010D\x05\b\x05\x02\u010B\u010D\x07V\x02" +
		"\x02\u010C\u010A\x03\x02\x02\x02\u010C\u010B\x03\x02\x02\x02\u010D\u0110" +
		"\x03\x02\x02\x02\u010E\u010C\x03\x02\x02\x02\u010E\u010F\x03\x02\x02\x02" +
		"\u010F\u0115\x03\x02\x02\x02\u0110\u010E\x03\x02\x02\x02\u0111\u0112\x05" +
		"\x8CG\x02\u0112\u0113\x07\x02\x02\x03\u0113\u0115\x03\x02\x02\x02\u0114" +
		"\u0101\x03\x02\x02\x02\u0114\u0111\x03\x02\x02\x02\u0115\x03\x03\x02\x02" +
		"\x02\u0116\u0118\x05r:\x02\u0117\u0116\x03\x02\x02\x02\u0118\u011B\x03" +
		"\x02\x02\x02\u0119\u0117\x03\x02\x02\x02\u0119\u011A\x03\x02\x02\x02\u011A" +
		"\u011C\x03\x02\x02\x02\u011B\u0119\x03\x02\x02\x02\u011C\u011D\x07\"\x02" +
		"\x02\u011D\u011E\x05h5\x02\u011E\u011F\x07V\x02\x02\u011F\x05\x03\x02" +
		"\x02\x02\u0120\u0122\x07\x1B\x02\x02\u0121\u0123\x07(\x02\x02\u0122\u0121" +
		"\x03\x02\x02\x02\u0122\u0123\x03\x02\x02\x02\u0123\u0124\x03\x02\x02\x02" +
		"\u0124\u0127\x05h5\x02\u0125\u0126\x07X\x02\x02\u0126\u0128\x07j\x02\x02" +
		"\u0127\u0125\x03\x02\x02\x02\u0127\u0128\x03\x02\x02\x02\u0128\u0129\x03" +
		"\x02\x02\x02\u0129\u012A\x07V\x02\x02\u012A\u012D\x03\x02\x02\x02\u012B" +
		"\u012D\x07V\x02\x02\u012C\u0120\x03\x02\x02\x02\u012C\u012B\x03\x02\x02" +
		"\x02\u012D\x07\x03\x02\x02\x02\u012E\u0130\x05\f\x07\x02\u012F\u012E\x03" +
		"\x02\x02\x02\u0130\u0133\x03\x02\x02\x02\u0131\u012F\x03\x02\x02\x02\u0131" +
		"\u0132\x03\x02\x02\x02\u0132\u0139\x03\x02\x02\x02\u0133\u0131\x03\x02" +
		"\x02\x02\u0134\u013A\x05\x10\t\x02\u0135\u013A\x05\x18\r\x02\u0136\u013A" +
		"\x05 \x11\x02\u0137\u013A\x05|?\x02\u0138\u013A\x05\x94K\x02\u0139\u0134" +
		"\x03\x02\x02\x02\u0139\u0135\x03\x02\x02\x02\u0139\u0136\x03\x02\x02\x02" +
		"\u0139\u0137\x03\x02\x02\x02\u0139\u0138\x03\x02\x02\x02\u013A\t\x03\x02" +
		"\x02\x02\u013B\u0141\x05\f\x07\x02\u013C\u0141\x07 \x02\x02\u013D\u0141" +
		"\x07,\x02\x02\u013E\u0141\x070\x02\x02\u013F\u0141\x073\x02\x02\u0140" +
		"\u013B\x03\x02\x02\x02\u0140\u013C\x03\x02\x02\x02\u0140\u013D\x03\x02" +
		"\x02\x02\u0140\u013E\x03\x02\x02\x02\u0140\u013F\x03\x02\x02\x02\u0141" +
		"\v\x03\x02\x02\x02\u0142\u014D\x05r:\x02\u0143\u014D\x07%\x02\x02\u0144" +
		"\u014D\x07$\x02\x02\u0145\u014D\x07#\x02\x02\u0146\u014D\x07(\x02\x02" +
		"\u0147\u014D\x07\x03\x02\x02\u0148\u014D\x07\x14\x02\x02\u0149\u014D\x07" +
		")\x02\x02\u014A\u014D\x07B\x02\x02\u014B\u014D\x07D\x02\x02\u014C\u0142" +
		"\x03\x02\x02\x02\u014C\u0143\x03\x02\x02\x02\u014C\u0144\x03\x02\x02\x02" +
		"\u014C\u0145\x03\x02\x02\x02\u014C\u0146\x03\x02\x02\x02\u014C\u0147\x03" +
		"\x02\x02\x02\u014C\u0148\x03\x02\x02\x02\u014C\u0149\x03\x02\x02\x02\u014C" +
		"\u014A\x03\x02\x02\x02\u014C\u014B\x03\x02\x02\x02\u014D\r\x03\x02\x02" +
		"\x02\u014E\u0151\x07\x14\x02\x02\u014F\u0151\x05r:\x02\u0150\u014E\x03" +
		"\x02\x02\x02\u0150\u014F\x03\x02\x02\x02\u0151\x0F\x03\x02\x02\x02\u0152" +
		"\u0153\x07\v\x02\x02\u0153\u0155\x05\xA4S\x02\u0154\u0156\x05\x12\n\x02" +
		"\u0155\u0154\x03\x02\x02\x02\u0155\u0156\x03\x02\x02\x02\u0156\u0159\x03" +
		"\x02\x02\x02\u0157\u0158\x07\x13\x02\x02\u0158\u015A\x05\xF4{\x02\u0159" +
		"\u0157\x03\x02\x02\x02\u0159\u015A\x03\x02\x02\x02\u015A\u015D\x03\x02" +
		"\x02\x02\u015B\u015C\x07\x1A\x02\x02\u015C\u015E\x05\xF2z\x02\u015D\u015B" +
		"\x03\x02\x02\x02\u015D\u015E\x03\x02\x02\x02\u015E\u0161\x03\x02\x02\x02" +
		"\u015F\u0160\x07C\x02\x02\u0160\u0162\x05\xF2z\x02\u0161\u015F\x03\x02" +
		"\x02\x02\u0161\u0162\x03\x02\x02\x02\u0162\u0163\x03\x02\x02\x02\u0163" +
		"\u0164\x05\"\x12\x02\u0164\x11\x03\x02\x02\x02\u0165\u0166\x07[\x02\x02" +
		"\u0166\u016B\x05\x14\v\x02\u0167\u0168\x07W\x02\x02\u0168\u016A\x05\x14" +
		"\v\x02\u0169\u0167\x03\x02\x02\x02\u016A\u016D\x03\x02\x02\x02\u016B\u0169" +
		"\x03\x02\x02\x02\u016B\u016C\x03\x02\x02\x02\u016C\u016E\x03\x02\x02\x02" +
		"\u016D\u016B\x03\x02\x02\x02\u016E\u016F\x07Z\x02\x02\u016F\x13\x03\x02" +
		"\x02\x02\u0170\u0172\x05r:\x02\u0171\u0170\x03\x02\x02\x02\u0172\u0175" +
		"\x03\x02\x02\x02\u0173\u0171\x03\x02\x02\x02\u0173\u0174\x03\x02\x02\x02" +
		"\u0174\u0176\x03\x02\x02\x02\u0175\u0173\x03\x02\x02\x02\u0176\u017F\x05" +
		"\xA4S\x02\u0177\u017B\x07\x13\x02\x02\u0178\u017A\x05r:\x02\u0179\u0178" +
		"\x03\x02\x02\x02\u017A\u017D\x03\x02\x02\x02\u017B\u0179\x03\x02\x02\x02" +
		"\u017B\u017C\x03\x02\x02\x02\u017C\u017E\x03\x02\x02\x02\u017D\u017B\x03" +
		"\x02\x02\x02\u017E\u0180\x05\x16\f\x02\u017F\u0177\x03\x02\x02\x02\u017F" +
		"\u0180\x03\x02\x02\x02\u0180\x15\x03\x02\x02\x02\u0181\u0186\x05\xF4{" +
		"\x02\u0182\u0183\x07l\x02\x02\u0183\u0185\x05\xF4{\x02\u0184\u0182\x03" +
		"\x02\x02\x02\u0185\u0188\x03\x02\x02\x02\u0186\u0184\x03\x02\x02\x02\u0186" +
		"\u0187\x03\x02\x02\x02\u0187\x17\x03\x02\x02\x02\u0188\u0186\x03\x02\x02" +
		"\x02\u0189\u018A\x07\x12\x02\x02\u018A\u018D\x05\xA4S\x02\u018B\u018C" +
		"\x07\x1A\x02\x02\u018C\u018E\x05\xF2z\x02\u018D\u018B\x03\x02\x02\x02" +
		"\u018D\u018E\x03\x02\x02\x02\u018E\u018F\x03\x02\x02\x02\u018F\u0191\x07" +
		"R\x02\x02\u0190\u0192\x05\x1A\x0E\x02\u0191\u0190\x03\x02\x02\x02\u0191" +
		"\u0192\x03\x02\x02\x02\u0192\u0194\x03\x02\x02\x02\u0193\u0195\x07W\x02" +
		"\x02\u0194\u0193\x03\x02\x02\x02\u0194\u0195\x03\x02\x02\x02\u0195\u0197" +
		"\x03\x02\x02\x02\u0196\u0198\x05\x1E\x10\x02\u0197\u0196\x03\x02\x02\x02" +
		"\u0197\u0198\x03\x02\x02\x02\u0198\u0199\x03\x02\x02\x02\u0199\u019A\x07" +
		"S\x02\x02\u019A\x19\x03\x02\x02\x02\u019B\u01A0\x05\x1C\x0F\x02\u019C" +
		"\u019D\x07W\x02\x02\u019D\u019F\x05\x1C\x0F\x02\u019E\u019C\x03\x02\x02" +
		"\x02\u019F\u01A2\x03\x02\x02\x02\u01A0\u019E\x03\x02\x02\x02\u01A0\u01A1" +
		"\x03\x02\x02\x02\u01A1\x1B\x03\x02\x02\x02\u01A2\u01A0\x03\x02\x02\x02" +
		"\u01A3\u01A5\x05r:\x02\u01A4\u01A3\x03\x02\x02\x02\u01A5\u01A8\x03\x02" +
		"\x02\x02\u01A6\u01A4\x03\x02\x02\x02\u01A6\u01A7\x03\x02\x02\x02\u01A7" +
		"\u01A9\x03\x02\x02\x02\u01A8\u01A6\x03\x02\x02\x02\u01A9\u01AB\x05\xA4" +
		"S\x02\u01AA\u01AC\x05\xFE\x80\x02\u01AB\u01AA\x03\x02\x02\x02\u01AB\u01AC" +
		"\x03\x02\x02\x02\u01AC\u01AE\x03\x02\x02\x02\u01AD\u01AF\x05\"\x12\x02" +
		"\u01AE\u01AD\x03\x02\x02\x02\u01AE\u01AF\x03\x02\x02\x02\u01AF\x1D\x03" +
		"\x02\x02\x02\u01B0\u01B4\x07V\x02\x02\u01B1\u01B3\x05&\x14\x02\u01B2\u01B1" +
		"\x03\x02\x02\x02\u01B3\u01B6\x03\x02\x02\x02\u01B4\u01B2\x03\x02\x02\x02" +
		"\u01B4\u01B5\x03\x02\x02\x02\u01B5\x1F\x03\x02\x02\x02\u01B6\u01B4\x03" +
		"\x02\x02\x02\u01B7\u01B8\x07\x1E\x02\x02\u01B8\u01BA\x05\xA4S\x02\u01B9" +
		"\u01BB\x05\x12\n\x02\u01BA\u01B9\x03\x02\x02\x02\u01BA\u01BB\x03\x02\x02" +
		"\x02\u01BB\u01BE\x03\x02\x02\x02\u01BC\u01BD\x07\x13\x02\x02\u01BD\u01BF" +
		"\x05\xF2z\x02\u01BE\u01BC\x03\x02\x02\x02\u01BE\u01BF\x03\x02\x02\x02" +
		"\u01BF\u01C2\x03\x02\x02\x02\u01C0\u01C1\x07C\x02\x02\u01C1\u01C3\x05" +
		"\xF2z\x02\u01C2\u01C0\x03\x02\x02\x02\u01C2\u01C3\x03\x02\x02\x02\u01C3" +
		"\u01C4\x03\x02\x02\x02\u01C4\u01C5\x05$\x13\x02\u01C5!\x03\x02\x02\x02" +
		"\u01C6\u01CA\x07R\x02\x02\u01C7\u01C9\x05&\x14\x02\u01C8\u01C7\x03\x02" +
		"\x02\x02\u01C9\u01CC\x03\x02\x02\x02\u01CA\u01C8\x03\x02\x02\x02\u01CA" +
		"\u01CB\x03\x02\x02\x02\u01CB\u01CD\x03\x02\x02\x02\u01CC\u01CA\x03\x02" +
		"\x02\x02\u01CD\u01CE\x07S\x02\x02\u01CE#\x03\x02\x02\x02\u01CF\u01D3\x07" +
		"R\x02\x02\u01D0\u01D2\x05:\x1E\x02\u01D1\u01D0\x03\x02\x02\x02\u01D2\u01D5" +
		"\x03\x02\x02\x02\u01D3\u01D1\x03\x02\x02\x02\u01D3\u01D4\x03\x02\x02\x02" +
		"\u01D4\u01D6\x03\x02\x02\x02\u01D5\u01D3\x03\x02\x02\x02\u01D6\u01D7\x07" +
		"S\x02\x02\u01D7%\x03\x02\x02\x02\u01D8\u01E5\x07V\x02\x02\u01D9\u01DB" +
		"\x07(\x02\x02\u01DA\u01D9\x03\x02\x02\x02\u01DA\u01DB\x03\x02\x02\x02" +
		"\u01DB\u01DC\x03\x02\x02\x02\u01DC\u01E5\x05\x9EP\x02\u01DD\u01DF\x05" +
		"\n\x06\x02\u01DE\u01DD\x03\x02\x02\x02\u01DF\u01E2\x03\x02\x02\x02\u01E0" +
		"\u01DE\x03\x02\x02\x02\u01E0\u01E1\x03\x02\x02\x02\u01E1\u01E3\x03\x02" +
		"\x02\x02\u01E2\u01E0\x03\x02\x02\x02\u01E3\u01E5\x05(\x15\x02\u01E4\u01D8" +
		"\x03\x02\x02\x02\u01E4\u01DA\x03\x02\x02\x02\u01E4\u01E0\x03\x02\x02\x02" +
		"\u01E5\'\x03\x02\x02\x02\u01E6\u01F1\x05\x94K\x02\u01E7\u01F1\x05*\x16" +
		"\x02\u01E8\u01F1\x050\x19\x02\u01E9\u01F1\x058\x1D\x02\u01EA\u01F1\x05" +
		"4\x1B\x02\u01EB\u01F1\x052\x1A\x02\u01EC\u01F1\x05 \x11\x02\u01ED\u01F1" +
		"\x05|?\x02\u01EE\u01F1\x05\x10\t\x02\u01EF\u01F1\x05\x18\r\x02\u01F0\u01E6" +
		"\x03\x02\x02\x02\u01F0\u01E7\x03\x02\x02\x02\u01F0\u01E8\x03\x02\x02\x02" +
		"\u01F0\u01E9\x03\x02\x02\x02\u01F0\u01EA\x03\x02\x02\x02\u01F0\u01EB\x03" +
		"\x02\x02\x02\u01F0\u01EC\x03\x02\x02\x02\u01F0\u01ED\x03\x02\x02\x02\u01F0" +
		"\u01EE\x03\x02\x02\x02\u01F0\u01EF\x03\x02\x02\x02\u01F1)\x03\x02\x02" +
		"\x02\u01F2\u01F3\x05.\x18\x02\u01F3\u01F4\x05\xA4S\x02\u01F4\u01F9\x05" +
		"Z.\x02\u01F5\u01F6\x07T\x02\x02\u01F6\u01F8\x07U\x02\x02\u01F7\u01F5\x03" +
		"\x02\x02\x02\u01F8\u01FB\x03\x02\x02\x02\u01F9\u01F7\x03\x02\x02\x02\u01F9" +
		"\u01FA\x03\x02\x02\x02\u01FA\u01FE\x03\x02\x02\x02\u01FB\u01F9\x03\x02" +
		"\x02\x02\u01FC\u01FD\x07/\x02\x02\u01FD\u01FF\x05X-\x02\u01FE\u01FC\x03" +
		"\x02\x02\x02\u01FE\u01FF\x03\x02\x02\x02\u01FF\u0200\x03\x02\x02\x02\u0200" +
		"\u0201\x05,\x17\x02\u0201+\x03\x02\x02\x02\u0202\u0205\x05\x9EP\x02\u0203" +
		"\u0205\x07V\x02\x02\u0204\u0202\x03\x02\x02\x02\u0204\u0203\x03\x02\x02" +
		"\x02\u0205-\x03\x02\x02\x02\u0206\u0209\x05\xF4{\x02\u0207\u0209\x072" +
		"\x02\x02\u0208\u0206\x03\x02\x02\x02\u0208\u0207\x03\x02\x02\x02\u0209" +
		"/\x03\x02\x02\x02\u020A\u020B\x05\x12\n\x02\u020B\u020C\x05*\x16\x02\u020C" +
		"1\x03\x02\x02\x02\u020D\u020E\x05\x12\n\x02\u020E\u020F\x054\x1B\x02\u020F" +
		"3\x03\x02\x02\x02\u0210\u0211\x05\xA4S\x02\u0211\u0214\x05Z.\x02\u0212" +
		"\u0213\x07/\x02\x02\u0213\u0215\x05X-\x02\u0214\u0212\x03\x02\x02\x02" +
		"\u0214\u0215\x03\x02\x02\x02\u0215\u0216\x03\x02\x02\x02\u0216\u0217\x05" +
		"\x9EP\x02\u02175\x03\x02\x02\x02\u0218\u021A\x05\n\x06\x02\u0219\u0218" +
		"\x03\x02\x02\x02\u021A\u021D\x03\x02\x02\x02\u021B\u0219\x03\x02\x02\x02" +
		"\u021B\u021C\x03\x02\x02\x02\u021C\u021E\x03\x02\x02\x02\u021D\u021B\x03" +
		"\x02\x02\x02\u021E\u021F\x05\xA4S\x02\u021F\u0220\x05\x9EP\x02\u02207" +
		"\x03\x02\x02\x02\u0221\u0222\x05\xF4{\x02\u0222\u0223\x05J&\x02\u0223" +
		"\u0224\x07V\x02\x02\u02249\x03\x02\x02\x02\u0225\u0227\x05\n\x06\x02\u0226" +
		"\u0225\x03\x02\x02\x02\u0227\u022A\x03\x02\x02\x02\u0228\u0226\x03\x02" +
		"\x02\x02\u0228\u0229\x03\x02\x02\x02\u0229\u022B\x03\x02\x02\x02\u022A" +
		"\u0228\x03\x02\x02\x02\u022B\u022E\x05<\x1F\x02\u022C\u022E\x07V\x02\x02" +
		"\u022D\u0228\x03\x02\x02\x02\u022D\u022C\x03\x02\x02\x02\u022E;\x03\x02" +
		"\x02\x02\u022F\u0238\x05> \x02\u0230\u0238\x05B\"\x02\u0231\u0238\x05" +
		"F$\x02\u0232\u0238\x05 \x11\x02\u0233\u0238\x05|?\x02\u0234\u0238\x05" +
		"\x10\t\x02\u0235\u0238\x05\x18\r\x02\u0236\u0238\x05\x94K\x02\u0237\u022F" +
		"\x03\x02\x02\x02\u0237\u0230\x03\x02\x02\x02\u0237\u0231\x03\x02\x02\x02" +
		"\u0237\u0232\x03\x02\x02\x02\u0237\u0233\x03\x02\x02\x02\u0237\u0234\x03" +
		"\x02\x02\x02\u0237\u0235\x03\x02\x02\x02\u0237\u0236\x03\x02\x02\x02\u0238" +
		"=\x03\x02\x02\x02\u0239\u023A\x05\xF4{\x02\u023A\u023F\x05@!\x02\u023B" +
		"\u023C\x07W\x02\x02\u023C\u023E\x05@!\x02\u023D\u023B\x03\x02\x02\x02" +
		"\u023E\u0241\x03\x02\x02\x02\u023F\u023D\x03\x02\x02\x02\u023F\u0240\x03" +
		"\x02\x02\x02\u0240\u0242\x03\x02\x02\x02\u0241\u023F\x03\x02\x02\x02\u0242" +
		"\u0243\x07V\x02\x02\u0243?\x03\x02\x02\x02\u0244\u0249\x05\xA4S\x02\u0245" +
		"\u0246\x07T\x02\x02\u0246\u0248\x07U\x02\x02\u0247\u0245\x03\x02\x02\x02" +
		"\u0248\u024B\x03\x02\x02\x02\u0249\u0247\x03\x02\x02\x02\u0249\u024A\x03" +
		"\x02\x02\x02\u024A\u024C\x03\x02\x02\x02\u024B\u0249\x03\x02\x02\x02\u024C" +
		"\u024D\x07Y\x02\x02\u024D\u024E\x05P)\x02\u024EA\x03\x02\x02\x02\u024F" +
		"\u0251\x05D#\x02\u0250\u024F\x03\x02\x02\x02\u0251\u0254\x03\x02\x02\x02" +
		"\u0252\u0250\x03\x02\x02\x02\u0252\u0253\x03\x02\x02\x02\u0253\u0255\x03" +
		"\x02\x02\x02\u0254\u0252\x03\x02\x02\x02\u0255\u0256\x05H%\x02\u0256C" +
		"\x03\x02\x02\x02\u0257\u025E\x05r:\x02\u0258\u025E\x07%\x02\x02\u0259" +
		"\u025E\x07\x03\x02\x02\u025A\u025E\x07\x0E\x02\x02\u025B\u025E\x07(\x02" +
		"\x02\u025C\u025E\x07)\x02\x02\u025D\u0257\x03\x02\x02\x02\u025D\u0258" +
		"\x03\x02\x02\x02\u025D\u0259\x03\x02\x02\x02\u025D\u025A\x03\x02\x02\x02" +
		"\u025D\u025B\x03\x02\x02\x02\u025D\u025C\x03\x02\x02\x02\u025EE\x03\x02" +
		"\x02\x02\u025F\u0261\x05D#\x02\u0260\u025F\x03\x02\x02\x02\u0261\u0264" +
		"\x03\x02\x02\x02\u0262\u0260\x03\x02\x02\x02\u0262\u0263\x03\x02\x02\x02" +
		"\u0263\u0265\x03\x02\x02\x02\u0264\u0262\x03\x02\x02\x02\u0265\u0266\x05" +
		"\x12\n\x02\u0266\u0267\x05H%\x02\u0267G\x03\x02\x02\x02\u0268\u026A\x05" +
		"r:\x02\u0269\u0268\x03\x02\x02\x02\u026A\u026D\x03\x02\x02\x02\u026B\u0269" +
		"\x03\x02\x02\x02\u026B\u026C\x03\x02\x02\x02\u026C\u026E\x03\x02\x02\x02" +
		"\u026D\u026B\x03\x02\x02\x02\u026E\u026F\x05.\x18\x02\u026F\u0270\x05" +
		"\xA4S\x02\u0270\u0275\x05Z.\x02\u0271\u0272\x07T\x02\x02\u0272\u0274\x07" +
		"U\x02\x02\u0273\u0271\x03\x02\x02\x02\u0274\u0277\x03\x02\x02\x02\u0275" +
		"\u0273\x03\x02\x02\x02\u0275\u0276\x03\x02\x02\x02\u0276\u027A\x03\x02" +
		"\x02\x02\u0277\u0275\x03\x02\x02\x02\u0278\u0279\x07/\x02\x02\u0279\u027B" +
		"\x05X-\x02\u027A\u0278\x03\x02\x02\x02\u027A\u027B\x03\x02\x02\x02\u027B" +
		"\u027C\x03\x02\x02\x02\u027C\u027D\x05,\x17\x02\u027DI\x03\x02\x02\x02" +
		"\u027E\u0283\x05L\'\x02\u027F\u0280\x07W\x02\x02\u0280\u0282\x05L\'\x02" +
		"\u0281\u027F\x03\x02\x02\x02\u0282\u0285\x03\x02\x02\x02\u0283\u0281\x03" +
		"\x02\x02\x02\u0283\u0284\x03\x02\x02\x02\u0284K\x03\x02\x02\x02\u0285" +
		"\u0283\x03\x02\x02\x02\u0286\u0289\x05N(\x02\u0287\u0288\x07Y\x02\x02" +
		"\u0288\u028A\x05P)\x02\u0289\u0287\x03\x02\x02\x02\u0289\u028A\x03\x02" +
		"\x02\x02\u028AM\x03\x02\x02\x02\u028B\u0290\x05\xA4S\x02\u028C\u028D\x07" +
		"T\x02\x02\u028D\u028F\x07U\x02\x02\u028E\u028C\x03\x02\x02\x02\u028F\u0292" +
		"\x03\x02\x02\x02\u0290\u028E\x03\x02\x02\x02\u0290\u0291\x03\x02\x02\x02" +
		"\u0291O\x03\x02\x02\x02\u0292\u0290\x03\x02\x02\x02\u0293\u0296\x05R*" +
		"\x02\u0294\u0296\x05\xC8e\x02\u0295\u0293\x03\x02\x02\x02\u0295\u0294" +
		"\x03\x02\x02\x02\u0296Q\x03\x02\x02\x02\u0297\u02A3\x07R\x02\x02\u0298" +
		"\u029D\x05P)\x02\u0299\u029A\x07W\x02\x02\u029A\u029C\x05P)\x02\u029B" +
		"\u0299\x03\x02\x02\x02\u029C\u029F\x03\x02\x02\x02\u029D\u029B\x03\x02" +
		"\x02\x02\u029D\u029E\x03\x02\x02\x02\u029E\u02A1\x03\x02\x02\x02\u029F" +
		"\u029D\x03\x02\x02\x02\u02A0\u02A2\x07W\x02\x02\u02A1\u02A0\x03\x02\x02" +
		"\x02\u02A1\u02A2\x03\x02\x02\x02\u02A2\u02A4\x03\x02\x02\x02\u02A3\u0298" +
		"\x03\x02\x02\x02\u02A3\u02A4\x03\x02\x02\x02\u02A4\u02A5\x03\x02\x02\x02" +
		"\u02A5\u02A6\x07S\x02\x02\u02A6S\x03\x02\x02\x02\u02A7\u02A9\x05\xA4S" +
		"\x02\u02A8\u02AA\x05\xF8}\x02\u02A9\u02A8\x03\x02\x02\x02\u02A9\u02AA" +
		"\x03\x02\x02\x02\u02AA\u02AB\x03\x02\x02\x02\u02AB\u02AC\x07X\x02\x02" +
		"\u02AC\u02AE\x03\x02\x02\x02\u02AD\u02A7\x03\x02\x02\x02\u02AE\u02B1\x03" +
		"\x02\x02\x02\u02AF\u02AD\x03\x02\x02\x02\u02AF\u02B0\x03\x02\x02\x02\u02B0" +
		"\u02B2\x03\x02\x02\x02\u02B1\u02AF\x03\x02\x02\x02\u02B2\u02B4\x05\xA6" +
		"T\x02\u02B3\u02B5\x05\xF8}\x02\u02B4\u02B3\x03\x02\x02\x02\u02B4\u02B5" +
		"\x03\x02\x02\x02\u02B5U\x03\x02\x02\x02\u02B6\u02C3\x05\xF4{\x02\u02B7" +
		"\u02B9\x05r:\x02\u02B8\u02B7\x03\x02\x02\x02\u02B9\u02BC\x03\x02\x02\x02" +
		"\u02BA\u02B8\x03\x02\x02\x02\u02BA\u02BB\x03\x02\x02\x02\u02BB\u02BD\x03" +
		"\x02\x02\x02\u02BC\u02BA\x03\x02\x02\x02\u02BD\u02C0\x07^\x02\x02\u02BE" +
		"\u02BF\t\x02\x02\x02\u02BF\u02C1\x05\xF4{\x02\u02C0\u02BE\x03\x02\x02" +
		"\x02\u02C0\u02C1\x03\x02\x02\x02\u02C1\u02C3\x03\x02\x02\x02\u02C2\u02B6" +
		"\x03\x02\x02\x02\u02C2\u02BA\x03\x02\x02\x02\u02C3W\x03\x02\x02\x02\u02C4" +
		"\u02C9\x05h5\x02\u02C5\u02C6\x07W\x02\x02\u02C6\u02C8\x05h5\x02\u02C7" +
		"\u02C5\x03\x02\x02\x02\u02C8\u02CB\x03\x02\x02\x02\u02C9\u02C7\x03\x02" +
		"\x02\x02\u02C9\u02CA\x03\x02\x02\x02\u02CAY\x03\x02\x02\x02\u02CB\u02C9" +
		"\x03\x02\x02\x02\u02CC\u02D8\x07P\x02\x02\u02CD\u02CF\x05\\/\x02\u02CE" +
		"\u02CD\x03\x02\x02\x02\u02CE\u02CF\x03\x02\x02\x02\u02CF\u02D9\x03\x02" +
		"\x02\x02\u02D0\u02D3\x05\\/\x02\u02D1\u02D2\x07W\x02\x02\u02D2\u02D4\x05" +
		"^0\x02\u02D3\u02D1\x03\x02\x02\x02\u02D3\u02D4\x03\x02\x02\x02\u02D4\u02D9" +
		"\x03\x02\x02\x02\u02D5\u02D7\x05^0\x02\u02D6\u02D5\x03\x02\x02\x02\u02D6" +
		"\u02D7\x03\x02\x02\x02\u02D7\u02D9\x03\x02\x02\x02\u02D8\u02CE\x03\x02" +
		"\x02\x02\u02D8\u02D0\x03\x02\x02\x02\u02D8\u02D6\x03\x02\x02\x02\u02D9" +
		"\u02DA\x03\x02\x02\x02\u02DA\u02DB\x07Q\x02\x02\u02DB[\x03\x02\x02\x02" +
		"\u02DC\u02E2\x05\xF4{\x02\u02DD\u02DE\x05\xA4S\x02\u02DE\u02DF\x07X\x02" +
		"\x02\u02DF\u02E1\x03\x02\x02\x02\u02E0\u02DD\x03\x02\x02\x02\u02E1\u02E4" +
		"\x03\x02\x02\x02\u02E2\u02E0\x03\x02\x02\x02\u02E2\u02E3\x03\x02\x02\x02" +
		"\u02E3\u02E5\x03\x02\x02\x02\u02E4\u02E2\x03\x02\x02\x02\u02E5\u02E6\x07" +
		"-\x02\x02\u02E6]\x03\x02\x02\x02\u02E7\u02EC\x05`1\x02\u02E8\u02E9\x07" +
		"W\x02\x02\u02E9\u02EB\x05`1\x02\u02EA\u02E8\x03\x02\x02\x02\u02EB\u02EE" +
		"\x03\x02\x02\x02\u02EC\u02EA\x03\x02\x02\x02\u02EC\u02ED\x03\x02\x02\x02" +
		"\u02ED\u02F1\x03\x02\x02\x02\u02EE\u02EC\x03\x02\x02\x02\u02EF\u02F0\x07" +
		"W\x02\x02\u02F0\u02F2\x05b2\x02\u02F1\u02EF\x03\x02\x02\x02\u02F1\u02F2" +
		"\x03\x02\x02\x02\u02F2\u02F5\x03\x02\x02\x02\u02F3\u02F5\x05b2\x02\u02F4" +
		"\u02E7\x03\x02\x02\x02\u02F4\u02F3\x03\x02\x02\x02\u02F5_\x03\x02\x02" +
		"\x02\u02F6\u02F8\x05\x0E\b\x02\u02F7\u02F6\x03\x02\x02\x02\u02F8\u02FB" +
		"\x03\x02\x02\x02\u02F9\u02F7\x03\x02\x02\x02\u02F9\u02FA\x03\x02\x02\x02" +
		"\u02FA\u02FC\x03\x02\x02\x02\u02FB\u02F9\x03\x02\x02\x02\u02FC\u02FD\x05" +
		"\xF4{\x02\u02FD\u02FE\x05N(\x02\u02FEa\x03\x02\x02\x02\u02FF\u0301\x05" +
		"\x0E\b\x02\u0300\u02FF\x03\x02\x02\x02\u0301\u0304\x03\x02\x02\x02\u0302" +
		"\u0300\x03\x02\x02\x02\u0302\u0303\x03\x02\x02\x02\u0303\u0305\x03\x02" +
		"\x02\x02\u0304\u0302\x03\x02\x02\x02\u0305\u0309\x05\xF4{\x02\u0306\u0308" +
		"\x05r:\x02\u0307\u0306\x03\x02\x02\x02\u0308\u030B\x03\x02\x02\x02\u0309" +
		"\u0307\x03\x02\x02\x02\u0309\u030A\x03\x02\x02\x02\u030A\u030C\x03\x02" +
		"\x02\x02\u030B\u0309\x03\x02\x02\x02\u030C\u030D\x07~\x02\x02\u030D\u030E" +
		"\x05N(\x02\u030Ec\x03\x02\x02\x02\u030F\u0314\x05f4\x02\u0310\u0311\x07" +
		"W\x02\x02\u0311\u0313\x05f4\x02\u0312\u0310\x03\x02\x02\x02\u0313\u0316" +
		"\x03\x02\x02\x02\u0314\u0312\x03\x02\x02\x02\u0314\u0315\x03\x02\x02\x02" +
		"\u0315e\x03\x02\x02\x02\u0316\u0314\x03\x02\x02\x02\u0317\u0319\x05\x0E" +
		"\b\x02\u0318\u0317\x03\x02\x02\x02\u0319\u031C\x03\x02\x02\x02\u031A\u0318" +
		"\x03\x02\x02\x02\u031A\u031B\x03\x02\x02\x02\u031B\u031D\x03\x02\x02\x02" +
		"\u031C\u031A\x03\x02\x02\x02\u031D\u031E\x07?\x02\x02\u031E\u031F\x05" +
		"\xA4S\x02\u031Fg\x03\x02\x02\x02\u0320\u0325\x05\xA4S\x02\u0321\u0322" +
		"\x07X\x02\x02\u0322\u0324\x05\xA4S\x02\u0323\u0321\x03\x02\x02\x02\u0324" +
		"\u0327\x03\x02\x02\x02\u0325\u0323\x03\x02\x02\x02\u0325\u0326\x03\x02" +
		"\x02\x02\u0326i\x03\x02\x02\x02\u0327\u0325\x03\x02\x02\x02\u0328\u0330" +
		"\x05l7\x02\u0329\u0330\x05n8\x02\u032A\u0330\x07L\x02\x02\u032B\u0330" +
		"\x07M\x02\x02\u032C\u0330\x07K\x02\x02\u032D\u0330\x07O\x02\x02\u032E" +
		"\u0330\x07N\x02\x02\u032F\u0328\x03\x02\x02\x02\u032F\u0329\x03\x02\x02" +
		"\x02\u032F\u032A\x03\x02\x02\x02\u032F\u032B\x03\x02\x02\x02\u032F\u032C" +
		"\x03\x02\x02\x02\u032F\u032D\x03\x02\x02\x02\u032F\u032E\x03\x02\x02\x02" +
		"\u0330k\x03\x02\x02\x02\u0331\u0332\t\x03\x02\x02\u0332m\x03\x02\x02\x02" +
		"\u0333\u0334\t\x04\x02\x02\u0334o\x03\x02\x02\x02\u0335\u0336\x05\xA4" +
		"S\x02\u0336\u0337\x07X\x02\x02\u0337\u0339\x03\x02\x02\x02\u0338\u0335" +
		"\x03\x02\x02\x02\u0339\u033C\x03\x02\x02\x02\u033A\u0338\x03\x02\x02\x02" +
		"\u033A\u033B\x03\x02\x02\x02\u033B\u033D\x03\x02\x02\x02\u033C\u033A\x03" +
		"\x02\x02\x02\u033D\u033E\x07}\x02\x02\u033E\u033F\x05\xA4S\x02\u033Fq" +
		"\x03\x02\x02\x02\u0340\u0341\x07}\x02\x02\u0341\u0344\x05h5\x02\u0342" +
		"\u0344\x05p9\x02\u0343\u0340\x03\x02\x02\x02\u0343\u0342\x03\x02\x02\x02" +
		"\u0344\u034B\x03\x02\x02\x02\u0345\u0348\x07P\x02\x02\u0346\u0349\x05" +
		"t;\x02\u0347\u0349\x05x=\x02\u0348\u0346\x03\x02\x02\x02\u0348\u0347\x03" +
		"\x02\x02\x02\u0348\u0349\x03\x02\x02\x02\u0349\u034A\x03\x02\x02\x02\u034A" +
		"\u034C\x07Q\x02\x02\u034B\u0345\x03\x02\x02\x02\u034B\u034C\x03\x02\x02" +
		"\x02\u034Cs\x03\x02\x02\x02\u034D\u0352\x05v<\x02\u034E\u034F\x07W\x02" +
		"\x02\u034F\u0351\x05v<\x02\u0350\u034E\x03\x02\x02\x02\u0351\u0354\x03" +
		"\x02\x02\x02\u0352\u0350\x03\x02\x02\x02\u0352\u0353\x03\x02\x02\x02\u0353" +
		"u\x03\x02\x02\x02\u0354\u0352\x03\x02\x02\x02\u0355\u0356\x05\xA4S\x02" +
		"\u0356\u0357\x07Y\x02\x02\u0357\u0358\x05x=\x02\u0358w\x03\x02\x02\x02" +
		"\u0359\u035D\x05\xC8e\x02\u035A\u035D\x05r:\x02\u035B\u035D\x05z>\x02" +
		"\u035C\u0359\x03\x02\x02\x02\u035C\u035A\x03\x02\x02\x02\u035C\u035B\x03" +
		"\x02\x02\x02\u035Dy\x03\x02\x02\x02\u035E\u0367\x07R\x02\x02\u035F\u0364" +
		"\x05x=\x02\u0360\u0361\x07W\x02\x02\u0361\u0363\x05x=\x02\u0362\u0360" +
		"\x03\x02\x02\x02\u0363\u0366\x03\x02\x02\x02\u0364\u0362\x03\x02\x02\x02" +
		"\u0364\u0365\x03\x02\x02\x02\u0365\u0368\x03\x02\x02\x02\u0366\u0364\x03" +
		"\x02\x02\x02\u0367\u035F\x03\x02\x02\x02\u0367\u0368\x03\x02\x02\x02\u0368" +
		"\u036A\x03\x02\x02\x02\u0369\u036B\x07W\x02\x02\u036A\u0369\x03\x02\x02" +
		"\x02\u036A\u036B\x03\x02\x02\x02\u036B\u036C\x03\x02\x02\x02\u036C\u036D" +
		"\x07S\x02\x02\u036D{\x03\x02\x02\x02\u036E\u036F\x07}\x02\x02\u036F\u0370" +
		"\x07\x1E\x02\x02\u0370\u0371\x05\xA4S\x02\u0371\u0372\x05~@\x02\u0372" +
		"}\x03\x02\x02\x02\u0373\u0377\x07R\x02\x02\u0374\u0376\x05\x80A\x02\u0375" +
		"\u0374\x03\x02\x02\x02\u0376\u0379\x03\x02\x02\x02\u0377\u0375\x03\x02" +
		"\x02\x02\u0377\u0378\x03\x02\x02\x02\u0378\u037A\x03\x02\x02\x02\u0379" +
		"\u0377\x03\x02\x02\x02\u037A\u037B\x07S\x02\x02\u037B\x7F\x03\x02\x02" +
		"\x02\u037C\u037E\x05\n\x06\x02\u037D\u037C\x03\x02\x02\x02\u037E\u0381" +
		"\x03\x02\x02\x02\u037F\u037D\x03\x02\x02\x02\u037F\u0380\x03\x02\x02\x02" +
		"\u0380\u0382\x03\x02\x02\x02\u0381\u037F\x03\x02\x02\x02\u0382\u0385\x05" +
		"\x82B\x02\u0383\u0385\x07V\x02\x02\u0384\u037F\x03\x02\x02\x02\u0384\u0383" +
		"\x03\x02\x02\x02\u0385\x81\x03\x02\x02\x02\u0386\u0387\x05\xF4{\x02\u0387" +
		"\u0388\x05\x84C\x02\u0388\u0389\x07V\x02\x02\u0389\u039F\x03\x02\x02\x02" +
		"\u038A\u038C\x05\x10\t\x02\u038B\u038D\x07V\x02\x02\u038C\u038B\x03\x02" +
		"\x02\x02\u038C\u038D\x03\x02\x02\x02\u038D\u039F\x03\x02\x02\x02\u038E" +
		"\u0390\x05 \x11\x02\u038F\u0391\x07V\x02\x02\u0390\u038F\x03\x02\x02\x02" +
		"\u0390\u0391\x03\x02\x02\x02\u0391\u039F\x03\x02\x02\x02\u0392\u0394\x05" +
		"\x18\r\x02\u0393\u0395\x07V\x02\x02\u0394\u0393\x03\x02\x02\x02\u0394" +
		"\u0395\x03\x02\x02\x02\u0395\u039F\x03\x02\x02\x02\u0396\u0398\x05|?\x02" +
		"\u0397\u0399\x07V\x02\x02\u0398\u0397\x03\x02\x02\x02\u0398\u0399\x03" +
		"\x02\x02\x02\u0399\u039F\x03\x02\x02\x02\u039A\u039C\x05\x94K\x02\u039B" +
		"\u039D\x07V\x02\x02\u039C\u039B\x03\x02\x02\x02\u039C\u039D\x03\x02\x02" +
		"\x02\u039D\u039F\x03\x02\x02\x02\u039E\u0386\x03\x02\x02\x02\u039E\u038A" +
		"\x03\x02\x02\x02\u039E\u038E\x03\x02\x02\x02\u039E\u0392\x03\x02\x02\x02" +
		"\u039E\u0396\x03\x02\x02\x02\u039E\u039A\x03\x02\x02\x02\u039F\x83\x03" +
		"\x02\x02\x02\u03A0\u03A3\x05\x86D\x02\u03A1\u03A3\x05\x88E\x02\u03A2\u03A0" +
		"\x03\x02\x02\x02\u03A2\u03A1\x03\x02\x02\x02\u03A3";
	private static readonly _serializedATNSegment2: string =
		"\x85\x03\x02\x02\x02\u03A4\u03A5\x05\xA4S\x02\u03A5\u03A6\x07P\x02\x02" +
		"\u03A6\u03A8\x07Q\x02\x02\u03A7\u03A9\x05\x8AF\x02\u03A8\u03A7\x03\x02" +
		"\x02\x02\u03A8\u03A9\x03\x02\x02\x02\u03A9\x87\x03\x02\x02\x02\u03AA\u03AB" +
		"\x05J&\x02\u03AB\x89\x03\x02\x02\x02\u03AC\u03AD\x07\x0E\x02\x02\u03AD" +
		"\u03AE\x05x=\x02\u03AE\x8B\x03\x02\x02\x02\u03AF\u03B1\x076\x02\x02\u03B0" +
		"\u03AF\x03\x02\x02\x02\u03B0\u03B1\x03\x02\x02\x02\u03B1\u03B2\x03\x02" +
		"\x02\x02\u03B2\u03B3\x075\x02\x02\u03B3\u03B4\x05h5\x02\u03B4\u03B5\x05" +
		"\x8EH\x02\u03B5\x8D\x03\x02\x02\x02\u03B6\u03BA\x07R\x02\x02\u03B7\u03B9" +
		"\x05\x90I\x02\u03B8\u03B7\x03\x02\x02\x02\u03B9\u03BC\x03\x02\x02\x02" +
		"\u03BA\u03B8\x03\x02\x02\x02\u03BA\u03BB\x03\x02\x02\x02\u03BB\u03BD\x03" +
		"\x02\x02\x02\u03BC\u03BA\x03\x02\x02\x02\u03BD\u03BE\x07S\x02\x02\u03BE" +
		"\x8F\x03\x02\x02\x02\u03BF\u03C3\x077\x02\x02\u03C0\u03C2\x05\x92J\x02" +
		"\u03C1\u03C0\x03\x02\x02\x02\u03C2\u03C5\x03\x02\x02\x02\u03C3\u03C1\x03" +
		"\x02\x02\x02\u03C3\u03C4\x03\x02\x02\x02\u03C4\u03C6\x03\x02\x02\x02\u03C5" +
		"\u03C3\x03\x02\x02\x02\u03C6\u03C7\x05h5\x02\u03C7\u03C8\x07V\x02\x02" +
		"\u03C8\u03E4\x03\x02\x02\x02\u03C9\u03CA\x078\x02\x02\u03CA\u03CD\x05" +
		"h5\x02\u03CB\u03CC\x07:\x02\x02\u03CC\u03CE\x05h5\x02\u03CD\u03CB\x03" +
		"\x02\x02\x02\u03CD\u03CE\x03\x02\x02\x02\u03CE\u03CF\x03\x02\x02\x02\u03CF" +
		"\u03D0\x07V\x02\x02\u03D0\u03E4\x03\x02\x02\x02\u03D1\u03D2\x079\x02\x02" +
		"\u03D2\u03D5\x05h5\x02\u03D3\u03D4\x07:\x02\x02\u03D4\u03D6\x05h5\x02" +
		"\u03D5\u03D3\x03\x02\x02\x02\u03D5\u03D6\x03\x02\x02\x02\u03D6\u03D7\x03" +
		"\x02\x02\x02\u03D7\u03D8\x07V\x02\x02\u03D8\u03E4\x03\x02\x02\x02\u03D9" +
		"\u03DA\x07;\x02\x02\u03DA\u03DB\x05h5\x02\u03DB\u03DC\x07V\x02\x02\u03DC" +
		"\u03E4\x03\x02\x02\x02\u03DD\u03DE\x07<\x02\x02\u03DE\u03DF\x05h5\x02" +
		"\u03DF\u03E0\x07=\x02\x02\u03E0\u03E1\x05h5\x02\u03E1\u03E2\x07V\x02\x02" +
		"\u03E2\u03E4\x03\x02\x02\x02\u03E3\u03BF\x03\x02\x02\x02\u03E3\u03C9\x03" +
		"\x02\x02\x02\u03E3\u03D1\x03\x02\x02\x02\u03E3\u03D9\x03\x02\x02\x02\u03E3" +
		"\u03DD\x03\x02\x02\x02\u03E4\x91\x03\x02\x02\x02\u03E5\u03E6\t\x05\x02" +
		"\x02\u03E6\x93\x03\x02\x02\x02\u03E7\u03E8\x07A\x02\x02\u03E8\u03EA\x05" +
		"\xA4S\x02\u03E9\u03EB\x05\x12\n\x02\u03EA\u03E9\x03\x02\x02\x02\u03EA" +
		"\u03EB\x03\x02\x02\x02\u03EB\u03EC\x03\x02\x02\x02\u03EC\u03EF\x05\x96" +
		"L\x02\u03ED\u03EE\x07\x1A\x02\x02\u03EE\u03F0\x05\xF2z\x02\u03EF\u03ED" +
		"\x03\x02\x02\x02\u03EF\u03F0\x03\x02\x02\x02\u03F0\u03F1\x03\x02\x02\x02" +
		"\u03F1\u03F2\x05\x9CO\x02\u03F2\x95\x03\x02\x02\x02\u03F3\u03F5\x07P\x02" +
		"\x02\u03F4\u03F6\x05\x98M\x02\u03F5\u03F4\x03\x02\x02\x02\u03F5\u03F6" +
		"\x03\x02\x02\x02\u03F6\u03F7\x03\x02\x02\x02\u03F7\u03F8\x07Q\x02\x02" +
		"\u03F8\x97\x03\x02\x02\x02\u03F9\u03FE\x05\x9AN\x02\u03FA\u03FB\x07W\x02" +
		"\x02\u03FB\u03FD\x05\x9AN\x02\u03FC\u03FA\x03\x02\x02\x02\u03FD\u0400" +
		"\x03\x02\x02\x02\u03FE\u03FC\x03\x02\x02\x02\u03FE\u03FF\x03\x02\x02\x02" +
		"\u03FF\x99\x03\x02\x02\x02\u0400\u03FE\x03\x02\x02\x02\u0401\u0402\x05" +
		"\xF4{\x02\u0402\u0403\x05\xA4S\x02\u0403\x9B\x03\x02\x02\x02\u0404\u0409" +
		"\x07R\x02\x02\u0405\u0408\x05&\x14\x02\u0406\u0408\x056\x1C\x02\u0407" +
		"\u0405\x03\x02\x02\x02\u0407\u0406\x03\x02\x02\x02\u0408\u040B\x03\x02" +
		"\x02\x02\u0409\u0407\x03\x02\x02\x02\u0409\u040A\x03\x02\x02\x02\u040A" +
		"\u040C\x03\x02\x02\x02\u040B\u0409\x03\x02\x02\x02\u040C\u040D\x07S\x02" +
		"\x02\u040D\x9D\x03\x02\x02\x02\u040E\u0412\x07R\x02\x02\u040F\u0411\x05" +
		"\xA0Q\x02\u0410\u040F\x03\x02\x02\x02\u0411\u0414\x03\x02\x02\x02\u0412" +
		"\u0410\x03\x02\x02\x02\u0412\u0413\x03\x02\x02\x02\u0413\u0415\x03\x02" +
		"\x02\x02\u0414\u0412\x03\x02\x02\x02\u0415\u0416\x07S\x02\x02\u0416\x9F" +
		"\x03\x02\x02\x02\u0417\u0418\x05\xA2R\x02\u0418\u0419\x07V\x02\x02\u0419" +
		"\u041D\x03\x02\x02\x02\u041A\u041D\x05\xA8U\x02\u041B\u041D\x05\xAAV\x02" +
		"\u041C\u0417\x03\x02\x02\x02\u041C\u041A\x03\x02\x02\x02\u041C\u041B\x03" +
		"\x02\x02\x02\u041D\xA1\x03\x02\x02\x02\u041E\u0420\x05\x0E\b\x02\u041F" +
		"\u041E\x03\x02\x02\x02\u0420\u0423\x03\x02\x02\x02\u0421\u041F\x03\x02" +
		"\x02\x02\u0421\u0422\x03\x02\x02\x02\u0422\u042C\x03\x02\x02\x02\u0423" +
		"\u0421\x03\x02\x02\x02\u0424\u0425\x07?\x02\x02\u0425\u0426\x05\xA4S\x02" +
		"\u0426\u0427\x07Y\x02\x02\u0427\u0428\x05\xC8e\x02\u0428\u042D\x03\x02" +
		"\x02\x02\u0429\u042A\x05\xF4{\x02\u042A\u042B\x05J&\x02\u042B\u042D\x03" +
		"\x02\x02\x02\u042C\u0424\x03\x02\x02\x02\u042C\u0429\x03\x02\x02\x02\u042D" +
		"\xA3\x03\x02\x02\x02\u042E\u042F\t\x06\x02\x02\u042F\xA5\x03\x02\x02\x02" +
		"\u0430\u0431\t\x07\x02\x02\u0431\xA7\x03\x02\x02\x02\u0432\u0434\x05\f" +
		"\x07\x02\u0433\u0432\x03\x02\x02\x02\u0434\u0437\x03\x02\x02\x02\u0435" +
		"\u0433\x03\x02\x02\x02\u0435\u0436\x03\x02\x02\x02\u0436\u043B\x03\x02" +
		"\x02\x02\u0437\u0435\x03\x02\x02\x02\u0438\u043C\x05\x10\t\x02\u0439\u043C" +
		"\x05 \x11\x02\u043A\u043C\x05\x94K\x02\u043B\u0438\x03\x02\x02\x02\u043B" +
		"\u0439\x03\x02\x02\x02\u043B\u043A\x03\x02\x02\x02\u043C\xA9\x03\x02\x02" +
		"\x02\u043D\u04AF\x05\x9EP\x02\u043E\u043F\x07\x04\x02\x02\u043F\u0442" +
		"\x05\xC8e\x02\u0440\u0441\x07_\x02\x02\u0441\u0443\x05\xC8e\x02\u0442" +
		"\u0440\x03\x02\x02\x02\u0442\u0443\x03\x02\x02\x02\u0443\u0444\x03\x02" +
		"\x02\x02\u0444\u0445\x07V\x02\x02\u0445\u04AF\x03\x02\x02\x02\u0446\u0447" +
		"\x07\x18\x02\x02\u0447\u0448\x05\xC2b\x02\u0448\u044B\x05\xAAV\x02\u0449" +
		"\u044A\x07\x11\x02\x02\u044A\u044C\x05\xAAV\x02\u044B\u0449\x03\x02\x02" +
		"\x02\u044B\u044C\x03\x02\x02\x02\u044C\u04AF\x03\x02\x02\x02\u044D\u044E" +
		"\x07\x17\x02\x02\u044E\u044F\x07P\x02\x02\u044F\u0450\x05\xBC_\x02\u0450" +
		"\u0451\x07Q\x02\x02\u0451\u0452\x05\xAAV\x02\u0452\u04AF\x03\x02\x02\x02" +
		"\u0453\u0454\x074\x02\x02\u0454\u0455\x05\xC2b\x02\u0455\u0456\x05\xAA" +
		"V\x02\u0456\u04AF\x03\x02\x02\x02\u0457\u0458\x07\x0F\x02\x02\u0458\u0459" +
		"\x05\xAAV\x02\u0459\u045A\x074\x02\x02\u045A\u045B\x05\xC2b\x02\u045B" +
		"\u045C\x07V\x02\x02\u045C\u04AF\x03\x02\x02\x02\u045D\u045E\x071\x02\x02" +
		"\u045E\u0468\x05\x9EP\x02\u045F\u0461\x05\xACW\x02\u0460\u045F\x03\x02" +
		"\x02\x02\u0461\u0462\x03\x02\x02\x02\u0462\u0460\x03\x02\x02\x02\u0462" +
		"\u0463\x03\x02\x02\x02\u0463\u0465\x03\x02\x02\x02\u0464\u0466\x05\xB0" +
		"Y\x02\u0465\u0464\x03\x02\x02\x02\u0465\u0466\x03\x02\x02\x02\u0466\u0469" +
		"\x03\x02\x02\x02\u0467\u0469\x05\xB0Y\x02\u0468\u0460\x03\x02\x02\x02" +
		"\u0468\u0467\x03\x02\x02\x02\u0469\u04AF\x03\x02\x02\x02\u046A\u046B\x07" +
		"1\x02\x02\u046B\u046C\x05\xB2Z\x02\u046C\u0470\x05\x9EP\x02\u046D\u046F" +
		"\x05\xACW\x02\u046E\u046D\x03\x02\x02\x02\u046F\u0472\x03\x02\x02\x02" +
		"\u0470\u046E\x03\x02\x02\x02\u0470\u0471\x03\x02\x02\x02\u0471\u0474\x03" +
		"\x02\x02\x02\u0472\u0470\x03\x02\x02\x02\u0473\u0475\x05\xB0Y\x02\u0474" +
		"\u0473\x03\x02\x02\x02\u0474\u0475\x03\x02\x02\x02\u0475\u04AF\x03\x02" +
		"\x02\x02\u0476\u0477\x07+\x02\x02\u0477\u0478\x05\xC2b\x02\u0478\u047C" +
		"\x07R\x02\x02\u0479\u047B\x05\xB8]\x02\u047A\u0479\x03\x02\x02\x02\u047B" +
		"\u047E\x03\x02\x02\x02\u047C\u047A\x03\x02\x02\x02\u047C\u047D\x03\x02" +
		"\x02\x02\u047D\u0482\x03\x02\x02\x02\u047E\u047C\x03\x02\x02\x02\u047F" +
		"\u0481\x05\xBA^\x02\u0480\u047F\x03\x02\x02\x02\u0481\u0484\x03\x02\x02" +
		"\x02\u0482\u0480\x03\x02\x02\x02\u0482\u0483\x03\x02\x02\x02\u0483\u0485" +
		"\x03\x02\x02\x02\u0484\u0482\x03\x02\x02\x02\u0485\u0486\x07S\x02\x02" +
		"\u0486\u04AF\x03\x02\x02\x02\u0487\u0488\x07,\x02\x02\u0488\u0489\x05" +
		"\xC2b\x02\u0489\u048A\x05\x9EP\x02\u048A\u04AF\x03\x02\x02\x02\u048B\u048D" +
		"\x07&\x02\x02\u048C\u048E\x05\xC8e\x02\u048D\u048C\x03\x02\x02\x02\u048D" +
		"\u048E\x03\x02\x02\x02\u048E\u048F\x03\x02\x02\x02\u048F\u04AF\x07V\x02" +
		"\x02\u0490\u0491\x07.\x02\x02\u0491\u0492\x05\xC8e\x02\u0492\u0493\x07" +
		"V\x02\x02\u0493\u04AF\x03\x02\x02\x02\u0494\u0496\x07\x06\x02\x02\u0495" +
		"\u0497\x05\xA4S\x02\u0496\u0495\x03\x02\x02\x02\u0496\u0497\x03\x02\x02" +
		"\x02\u0497\u0498\x03\x02\x02\x02\u0498\u04AF\x07V\x02\x02\u0499\u049B" +
		"\x07\r\x02\x02\u049A\u049C\x05\xA4S\x02\u049B\u049A\x03\x02\x02\x02\u049B" +
		"\u049C\x03\x02\x02\x02\u049C\u049D\x03\x02\x02\x02\u049D\u04AF\x07V\x02" +
		"\x02\u049E\u049F\x07@\x02\x02\u049F\u04A0\x05\xC8e\x02\u04A0\u04A1\x07" +
		"V\x02\x02\u04A1\u04AF\x03\x02\x02\x02\u04A2\u04AF\x07V\x02\x02\u04A3\u04A4" +
		"\x05\xC8e\x02\u04A4\u04A5\x07V\x02\x02\u04A5\u04AF\x03\x02\x02\x02\u04A6" +
		"\u04A8\x05\xD4k\x02\u04A7\u04A9\x07V\x02\x02\u04A8\u04A7\x03\x02\x02\x02" +
		"\u04A8\u04A9\x03\x02\x02\x02\u04A9\u04AF\x03\x02\x02\x02\u04AA\u04AB\x05" +
		"\xA4S\x02\u04AB\u04AC\x07_\x02\x02\u04AC\u04AD\x05\xAAV\x02\u04AD\u04AF" +
		"\x03\x02\x02\x02\u04AE\u043D\x03\x02\x02\x02\u04AE\u043E\x03\x02\x02\x02" +
		"\u04AE\u0446\x03\x02\x02\x02\u04AE\u044D\x03\x02\x02\x02\u04AE\u0453\x03" +
		"\x02\x02\x02\u04AE\u0457\x03\x02\x02\x02\u04AE\u045D\x03\x02\x02\x02\u04AE" +
		"\u046A\x03\x02\x02\x02\u04AE\u0476\x03\x02\x02\x02\u04AE\u0487\x03\x02" +
		"\x02\x02\u04AE\u048B\x03\x02\x02\x02\u04AE\u0490\x03\x02\x02\x02\u04AE" +
		"\u0494\x03\x02\x02\x02\u04AE\u0499\x03\x02\x02\x02\u04AE\u049E\x03\x02" +
		"\x02\x02\u04AE\u04A2\x03\x02\x02\x02\u04AE\u04A3\x03\x02\x02\x02\u04AE" +
		"\u04A6\x03\x02\x02\x02\u04AE\u04AA\x03\x02\x02\x02\u04AF\xAB\x03\x02\x02" +
		"\x02\u04B0\u04B1\x07\t\x02\x02\u04B1\u04B5\x07P\x02\x02\u04B2\u04B4\x05" +
		"\x0E\b\x02\u04B3\u04B2\x03\x02\x02\x02\u04B4\u04B7\x03\x02\x02\x02\u04B5" +
		"\u04B3\x03\x02\x02\x02\u04B5\u04B6\x03\x02\x02\x02\u04B6\u04B8\x03\x02" +
		"\x02\x02\u04B7\u04B5\x03\x02\x02\x02\u04B8\u04B9\x05\xAEX\x02\u04B9\u04BA" +
		"\x05\xA4S\x02\u04BA\u04BB\x07Q\x02\x02\u04BB\u04BC\x05\x9EP\x02\u04BC" +
		"\xAD\x03\x02\x02\x02\u04BD\u04C2\x05h5\x02\u04BE\u04BF\x07m\x02\x02\u04BF" +
		"\u04C1\x05h5\x02\u04C0\u04BE\x03\x02\x02\x02\u04C1\u04C4\x03\x02\x02\x02" +
		"\u04C2\u04C0\x03\x02\x02\x02\u04C2\u04C3\x03\x02\x02\x02\u04C3\xAF\x03" +
		"\x02\x02\x02\u04C4\u04C2\x03\x02\x02\x02\u04C5\u04C6\x07\x15\x02\x02\u04C6" +
		"\u04C7\x05\x9EP\x02\u04C7\xB1\x03\x02\x02\x02\u04C8\u04C9\x07P\x02\x02" +
		"\u04C9\u04CB\x05\xB4[\x02\u04CA\u04CC\x07V\x02\x02\u04CB\u04CA\x03\x02" +
		"\x02\x02\u04CB\u04CC\x03\x02\x02\x02\u04CC\u04CD\x03\x02\x02\x02\u04CD" +
		"\u04CE\x07Q\x02\x02\u04CE\xB3\x03\x02\x02\x02\u04CF\u04D4\x05\xB6\\\x02" +
		"\u04D0\u04D1\x07V\x02\x02\u04D1\u04D3\x05\xB6\\\x02\u04D2\u04D0\x03\x02" +
		"\x02\x02\u04D3\u04D6\x03\x02\x02\x02\u04D4\u04D2\x03\x02\x02\x02\u04D4" +
		"\u04D5\x03\x02\x02\x02\u04D5\xB5\x03\x02\x02\x02\u04D6\u04D4\x03\x02\x02" +
		"\x02\u04D7\u04D9\x05\x0E\b\x02\u04D8\u04D7\x03\x02\x02\x02\u04D9\u04DC" +
		"\x03\x02\x02\x02\u04DA\u04D8\x03\x02\x02\x02\u04DA\u04DB\x03\x02\x02\x02" +
		"\u04DB\u04E2\x03\x02\x02\x02\u04DC\u04DA\x03\x02\x02\x02\u04DD\u04DE\x05" +
		"T+\x02\u04DE\u04DF\x05N(\x02\u04DF\u04E3\x03\x02\x02\x02\u04E0\u04E1\x07" +
		"?\x02\x02\u04E1\u04E3\x05\xA4S\x02\u04E2\u04DD\x03\x02\x02\x02\u04E2\u04E0" +
		"\x03\x02\x02\x02\u04E3\u04E4\x03\x02\x02\x02\u04E4\u04E5\x07Y\x02\x02" +
		"\u04E5\u04E6\x05\xC8e\x02\u04E6\u04E9\x03\x02\x02\x02\u04E7\u04E9\x05" +
		"h5\x02\u04E8\u04DA\x03\x02\x02\x02\u04E8\u04E7\x03\x02\x02\x02\u04E9\xB7" +
		"\x03\x02\x02\x02\u04EA\u04EC\x05\xBA^\x02\u04EB\u04EA\x03\x02\x02\x02" +
		"\u04EC\u04ED\x03\x02\x02\x02\u04ED\u04EB\x03\x02\x02\x02\u04ED\u04EE\x03" +
		"\x02\x02\x02\u04EE\u04F0\x03\x02\x02\x02\u04EF\u04F1\x05\xA0Q\x02\u04F0" +
		"\u04EF\x03\x02\x02\x02\u04F1\u04F2\x03\x02\x02\x02\u04F2\u04F0\x03\x02" +
		"\x02\x02\u04F2\u04F3\x03\x02\x02\x02\u04F3\xB9\x03\x02\x02\x02\u04F4\u04FF" +
		"\x07\b\x02\x02\u04F5\u0500\x05\xC8e\x02\u04F6\u0500\x07\x82\x02\x02\u04F7" +
		"\u04F8\x05\xF4{\x02\u04F8\u04F9\x05\xA4S\x02\u04F9\u0500\x03\x02\x02\x02" +
		"\u04FA\u04FD\x07O\x02\x02\u04FB\u04FC\x07W\x02\x02\u04FC\u04FE\x07\x0E" +
		"\x02\x02\u04FD\u04FB\x03\x02\x02\x02\u04FD\u04FE\x03\x02\x02\x02\u04FE" +
		"\u0500\x03\x02\x02\x02\u04FF\u04F5\x03\x02\x02\x02\u04FF\u04F6\x03\x02" +
		"\x02\x02\u04FF\u04F7\x03\x02\x02\x02\u04FF\u04FA\x03\x02\x02\x02\u0500" +
		"\u0501\x03\x02\x02\x02\u0501\u0505\x07_\x02\x02\u0502\u0503\x07\x0E\x02" +
		"\x02\u0503\u0505\x07_\x02\x02\u0504\u04F4\x03\x02\x02\x02\u0504\u0502" +
		"\x03\x02\x02\x02\u0505\xBB\x03\x02\x02\x02\u0506\u0513\x05\xC0a\x02\u0507" +
		"\u0509\x05\xBE`\x02\u0508\u0507\x03\x02\x02\x02\u0508\u0509\x03\x02\x02" +
		"\x02\u0509\u050A\x03\x02\x02\x02\u050A\u050C\x07V\x02\x02\u050B\u050D" +
		"\x05\xC8e\x02\u050C\u050B\x03\x02\x02\x02\u050C\u050D\x03\x02\x02\x02" +
		"\u050D\u050E\x03\x02\x02\x02\u050E\u0510\x07V\x02\x02\u050F\u0511\x05" +
		"\xC4c\x02\u0510\u050F\x03\x02\x02\x02\u0510\u0511\x03\x02\x02\x02\u0511" +
		"\u0513\x03\x02\x02\x02\u0512\u0506\x03\x02\x02\x02\u0512\u0508\x03\x02" +
		"\x02\x02\u0513\xBD\x03\x02\x02\x02\u0514\u0517\x05\xA2R\x02\u0515\u0517" +
		"\x05\xC4c\x02\u0516\u0514\x03\x02\x02\x02\u0516\u0515\x03\x02\x02\x02" +
		"\u0517\xBF\x03\x02\x02\x02\u0518\u051A\x05\x0E\b\x02\u0519\u0518\x03\x02" +
		"\x02\x02\u051A\u051D\x03\x02\x02\x02\u051B\u0519\x03\x02\x02\x02\u051B" +
		"\u051C\x03\x02\x02\x02\u051C\u0520\x03\x02\x02\x02\u051D\u051B\x03\x02" +
		"\x02\x02\u051E\u0521\x05\xF4{\x02\u051F\u0521\x07?\x02\x02\u0520\u051E" +
		"\x03\x02\x02\x02\u0520\u051F\x03\x02\x02\x02\u0521\u0522\x03\x02\x02\x02" +
		"\u0522\u0523\x05N(\x02\u0523\u0524\x07_\x02\x02\u0524\u0525\x05\xC8e\x02" +
		"\u0525\xC1\x03\x02\x02\x02\u0526\u0527\x07P\x02\x02\u0527\u0528\x05\xC8" +
		"e\x02\u0528\u0529\x07Q\x02\x02\u0529\xC3\x03\x02\x02\x02\u052A\u052F\x05" +
		"\xC8e\x02\u052B\u052C\x07W\x02\x02\u052C\u052E\x05\xC8e\x02\u052D\u052B" +
		"\x03\x02\x02\x02\u052E\u0531\x03\x02\x02\x02\u052F\u052D\x03\x02\x02\x02" +
		"\u052F\u0530\x03\x02\x02\x02\u0530\xC5\x03\x02\x02\x02\u0531\u052F\x03" +
		"\x02\x02\x02\u0532\u0533\x05\xA4S\x02\u0533\u0535\x07P\x02\x02\u0534\u0536" +
		"\x05\xC4c\x02\u0535\u0534\x03\x02\x02\x02\u0535\u0536\x03\x02\x02\x02" +
		"\u0536\u0537\x03\x02\x02\x02\u0537\u0538\x07Q\x02\x02\u0538\u0546\x03" +
		"\x02\x02\x02\u0539\u053A\x07-\x02\x02\u053A\u053C\x07P\x02\x02\u053B\u053D" +
		"\x05\xC4c\x02\u053C\u053B\x03\x02\x02\x02\u053C\u053D\x03\x02\x02\x02" +
		"\u053D\u053E\x03\x02\x02\x02\u053E\u0546\x07Q\x02\x02\u053F\u0540\x07" +
		"*\x02\x02\u0540\u0542\x07P\x02\x02\u0541\u0543\x05\xC4c\x02\u0542\u0541" +
		"\x03\x02\x02\x02\u0542\u0543\x03\x02\x02\x02\u0543\u0544\x03\x02\x02\x02" +
		"\u0544\u0546\x07Q\x02\x02\u0545\u0532\x03\x02\x02\x02\u0545\u0539\x03" +
		"\x02\x02\x02\u0545\u053F\x03\x02\x02\x02\u0546\xC7\x03\x02\x02\x02\u0547" +
		"\u0548\be\x01\x02\u0548\u0575\x05\xD2j\x02\u0549\u0575\x05\xC6d\x02\u054A" +
		"\u054B\x07!\x02\x02\u054B\u0575\x05\xE0q\x02\u054C\u0550\x07P\x02\x02" +
		"\u054D\u054F\x05r:\x02\u054E\u054D\x03\x02\x02\x02\u054F\u0552\x03\x02" +
		"\x02\x02\u0550\u054E\x03\x02\x02\x02\u0550\u0551\x03\x02\x02\x02\u0551" +
		"\u0553\x03\x02\x02\x02\u0552\u0550\x03\x02\x02\x02\u0553\u0558\x05\xF4" +
		"{\x02\u0554\u0555\x07l\x02\x02\u0555\u0557\x05\xF4{\x02\u0556\u0554\x03" +
		"\x02\x02\x02\u0557\u055A\x03\x02\x02\x02\u0558\u0556\x03\x02\x02\x02\u0558" +
		"\u0559\x03\x02\x02\x02\u0559\u055B\x03\x02\x02\x02\u055A\u0558\x03\x02" +
		"\x02\x02\u055B\u055C\x07Q\x02\x02\u055C\u055D\x05\xC8e\x18\u055D\u0575" +
		"\x03\x02\x02\x02\u055E\u055F\t\b\x02\x02\u055F\u0575\x05\xC8e\x16\u0560" +
		"\u0561\t\t\x02\x02\u0561\u0575\x05\xC8e\x15\u0562\u0575\x05\xCCg\x02\u0563" +
		"\u0575\x05\xD4k\x02\u0564\u0565\x05\xF4{\x02\u0565\u056B\x07|\x02\x02" +
		"\u0566\u0568\x05\xF8}\x02\u0567\u0566\x03\x02\x02\x02\u0567\u0568\x03" +
		"\x02\x02\x02\u0568\u0569\x03\x02\x02\x02\u0569\u056C\x05\xA4S\x02\u056A" +
		"\u056C\x07!\x02\x02\u056B\u0567\x03\x02\x02\x02\u056B\u056A\x03\x02\x02" +
		"\x02\u056C\u0575\x03\x02\x02\x02\u056D\u056E\x05\xDEp\x02\u056E\u0570" +
		"\x07|\x02\x02\u056F\u0571\x05\xF8}\x02\u0570\u056F\x03\x02\x02\x02\u0570" +
		"\u0571\x03\x02\x02\x02\u0571\u0572\x03\x02\x02\x02\u0572\u0573\x07!\x02" +
		"\x02\u0573\u0575\x03\x02\x02\x02\u0574\u0547\x03\x02\x02\x02\u0574\u0549" +
		"\x03\x02\x02\x02\u0574\u054A\x03\x02\x02\x02\u0574\u054C\x03\x02\x02\x02" +
		"\u0574\u055E\x03\x02\x02\x02\u0574\u0560\x03\x02\x02\x02\u0574\u0562\x03" +
		"\x02\x02\x02\u0574\u0563\x03\x02\x02\x02\u0574\u0564\x03\x02\x02\x02\u0574" +
		"\u056D\x03\x02\x02\x02\u0575\u05C9\x03\x02\x02\x02\u0576\u0577\f\x14\x02" +
		"\x02\u0577\u0578\t\n\x02\x02\u0578\u05C8\x05\xC8e\x15\u0579\u057A\f\x13" +
		"\x02\x02\u057A\u057B\t\v\x02\x02\u057B\u05C8\x05\xC8e\x14\u057C\u0584" +
		"\f\x12\x02\x02\u057D\u057E\x07[\x02\x02\u057E\u0585\x07[\x02\x02\u057F" +
		"\u0580\x07Z\x02\x02\u0580\u0581\x07Z\x02\x02\u0581\u0585\x07Z\x02\x02" +
		"\u0582\u0583\x07Z\x02\x02\u0583\u0585\x07Z\x02\x02\u0584\u057D\x03\x02" +
		"\x02\x02\u0584\u057F\x03\x02\x02\x02\u0584\u0582\x03\x02\x02\x02\u0585" +
		"\u0586\x03\x02\x02\x02\u0586\u05C8\x05\xC8e\x13\u0587\u0588\f\x11\x02" +
		"\x02\u0588\u0589\t\f\x02\x02\u0589\u05C8\x05\xC8e\x12\u058A\u058B\f\x0F" +
		"\x02\x02\u058B\u058C\t\r\x02\x02\u058C\u05C8\x05\xC8e\x10\u058D\u058E" +
		"\f\x0E\x02\x02\u058E\u058F\x07l\x02\x02\u058F\u05C8\x05\xC8e\x0F\u0590" +
		"\u0591\f\r\x02\x02\u0591\u0592\x07n\x02\x02\u0592\u05C8\x05\xC8e\x0E\u0593" +
		"\u0594\f\f\x02\x02\u0594\u0595\x07m\x02\x02\u0595\u05C8\x05\xC8e\r\u0596" +
		"\u0597\f\v\x02\x02\u0597\u0598\x07d\x02\x02\u0598\u05C8\x05\xC8e\f\u0599" +
		"\u059A\f\n\x02\x02\u059A\u059B\x07e\x02\x02\u059B\u05C8\x05\xC8e\v\u059C" +
		"\u059D\f\t\x02\x02\u059D\u059E\x07^\x02\x02\u059E\u059F\x05\xC8e\x02\u059F" +
		"\u05A0\x07_\x02\x02\u05A0\u05A1\x05\xC8e\t\u05A1\u05C8\x03\x02\x02\x02" +
		"\u05A2\u05A3\f\b\x02\x02\u05A3\u05A4\t\x0E\x02\x02\u05A4\u05C8\x05\xC8" +
		"e\b\u05A5\u05A6\f\x1C\x02\x02\u05A6\u05B2\x07X\x02\x02\u05A7\u05B3\x05" +
		"\xA4S\x02\u05A8\u05B3\x05\xC6d\x02\u05A9\u05B3\x07-\x02\x02\u05AA\u05AC" +
		"\x07!\x02\x02\u05AB\u05AD\x05\xF0y\x02\u05AC\u05AB\x03\x02\x02\x02\u05AC" +
		"\u05AD\x03\x02\x02\x02\u05AD\u05AE\x03\x02\x02\x02\u05AE\u05B3\x05\xE4" +
		"s\x02\u05AF\u05B0\x07*\x02\x02\u05B0\u05B3\x05\xFA~\x02\u05B1\u05B3\x05" +
		"\xEAv\x02\u05B2\u05A7\x03\x02\x02\x02\u05B2\u05A8\x03\x02\x02\x02\u05B2" +
		"\u05A9\x03\x02\x02\x02\u05B2\u05AA\x03\x02\x02\x02\u05B2\u05AF\x03\x02" +
		"\x02\x02\u05B2\u05B1\x03\x02\x02\x02\u05B3\u05C8\x03\x02\x02\x02\u05B4" +
		"\u05B5\f\x1B\x02\x02\u05B5\u05B6\x07T\x02\x02\u05B6\u05B7\x05\xC8e\x02" +
		"\u05B7\u05B8\x07U\x02\x02\u05B8\u05C8\x03\x02\x02\x02\u05B9\u05BA\f\x17" +
		"\x02\x02\u05BA\u05C8\t\x0F\x02\x02\u05BB\u05BC\f\x10\x02\x02\u05BC\u05BF" +
		"\x07\x1C\x02\x02\u05BD\u05C0\x05\xF4{\x02\u05BE\u05C0\x05\xCAf\x02\u05BF" +
		"\u05BD\x03\x02\x02\x02\u05BF\u05BE\x03\x02\x02\x02\u05C0\u05C8\x03\x02" +
		"\x02\x02\u05C1\u05C2\f\x05\x02\x02\u05C2\u05C4\x07|\x02\x02\u05C3\u05C5" +
		"\x05\xF8}\x02\u05C4\u05C3\x03\x02\x02\x02\u05C4\u05C5\x03\x02\x02\x02" +
		"\u05C5\u05C6\x03\x02\x02\x02\u05C6\u05C8\x05\xA4S\x02\u05C7\u0576\x03" +
		"\x02\x02\x02\u05C7\u0579\x03\x02\x02\x02\u05C7\u057C\x03\x02\x02\x02\u05C7" +
		"\u0587\x03\x02\x02\x02\u05C7\u058A\x03\x02\x02\x02\u05C7\u058D\x03\x02" +
		"\x02\x02\u05C7\u0590\x03\x02\x02\x02\u05C7\u0593\x03\x02\x02\x02\u05C7" +
		"\u0596\x03\x02\x02\x02\u05C7\u0599\x03\x02\x02\x02\u05C7\u059C\x03\x02" +
		"\x02\x02\u05C7\u05A2\x03\x02\x02\x02\u05C7\u05A5\x03\x02\x02\x02\u05C7" +
		"\u05B4\x03\x02\x02\x02\u05C7\u05B9\x03\x02\x02\x02\u05C7\u05BB\x03\x02" +
		"\x02\x02\u05C7\u05C1\x03\x02\x02\x02\u05C8\u05CB\x03\x02\x02\x02\u05C9" +
		"\u05C7\x03\x02\x02\x02\u05C9\u05CA\x03\x02\x02\x02\u05CA\xC9\x03\x02\x02" +
		"\x02\u05CB\u05C9\x03\x02\x02\x02\u05CC\u05CE\x05\x0E\b\x02\u05CD\u05CC" +
		"\x03\x02\x02\x02\u05CE\u05D1\x03\x02\x02\x02\u05CF\u05CD\x03\x02\x02\x02" +
		"\u05CF\u05D0\x03\x02\x02\x02\u05D0\u05D2\x03\x02\x02\x02\u05D1\u05CF\x03" +
		"\x02\x02\x02\u05D2\u05D6\x05\xF4{\x02\u05D3\u05D5\x05r:\x02\u05D4\u05D3" +
		"\x03\x02\x02\x02\u05D5\u05D8\x03\x02\x02\x02\u05D6\u05D4\x03\x02\x02\x02" +
		"\u05D6\u05D7\x03\x02\x02\x02\u05D7\u05D9\x03\x02\x02\x02\u05D8\u05D6\x03" +
		"\x02\x02\x02\u05D9\u05DA\x05\xA4S\x02\u05DA\xCB\x03\x02\x02\x02\u05DB" +
		"\u05DC\x05\xCEh\x02\u05DC\u05DD\x07{\x02\x02\u05DD\u05DE\x05\xD0i\x02" +
		"\u05DE\xCD\x03\x02\x02\x02\u05DF\u05F6\x05\xA4S\x02\u05E0\u05E2\x07P\x02" +
		"\x02\u05E1\u05E3\x05^0\x02\u05E2\u05E1\x03\x02\x02\x02\u05E2\u05E3\x03" +
		"\x02\x02\x02\u05E3\u05E4\x03\x02\x02\x02\u05E4\u05F6\x07Q\x02\x02\u05E5" +
		"\u05E6\x07P\x02\x02\u05E6\u05EB\x05\xA4S\x02\u05E7\u05E8\x07W\x02\x02" +
		"\u05E8\u05EA\x05\xA4S\x02\u05E9\u05E7\x03\x02\x02\x02\u05EA\u05ED\x03" +
		"\x02\x02\x02\u05EB\u05E9\x03\x02\x02\x02\u05EB\u05EC\x03\x02\x02\x02\u05EC" +
		"\u05EE\x03\x02\x02\x02\u05ED\u05EB\x03\x02\x02\x02\u05EE\u05EF\x07Q\x02" +
		"\x02\u05EF\u05F6\x03\x02\x02\x02\u05F0\u05F2\x07P\x02\x02\u05F1\u05F3" +
		"\x05d3\x02\u05F2\u05F1\x03\x02\x02\x02\u05F2\u05F3\x03\x02\x02\x02\u05F3" +
		"\u05F4\x03\x02\x02\x02\u05F4\u05F6\x07Q\x02\x02\u05F5\u05DF\x03\x02\x02" +
		"\x02\u05F5\u05E0\x03\x02\x02\x02\u05F5\u05E5\x03\x02\x02\x02\u05F5\u05F0" +
		"\x03\x02\x02\x02\u05F6\xCF\x03\x02\x02\x02\u05F7\u05FA\x05\xC8e\x02\u05F8" +
		"\u05FA\x05\x9EP\x02\u05F9\u05F7\x03\x02\x02\x02\u05F9\u05F8\x03\x02\x02" +
		"\x02\u05FA\xD1\x03\x02\x02\x02\u05FB\u05FC\x07P\x02\x02\u05FC\u05FD\x05" +
		"\xC8e\x02\u05FD\u05FE\x07Q\x02\x02\u05FE\u060E\x03\x02\x02\x02\u05FF\u060E" +
		"\x07-\x02\x02\u0600\u060E\x07*\x02\x02\u0601\u060E\x05j6\x02\u0602\u060E" +
		"\x05\xA4S\x02\u0603\u0604\x05.\x18\x02\u0604\u0605\x07X\x02\x02\u0605" +
		"\u0606\x07\v\x02\x02\u0606\u060E\x03\x02\x02\x02\u0607\u060B\x05\xF0y" +
		"\x02\u0608\u060C\x05\xFC\x7F\x02\u0609\u060A\x07-\x02\x02\u060A\u060C" +
		"\x05\xFE\x80\x02\u060B\u0608\x03\x02\x02\x02\u060B\u0609\x03\x02\x02\x02" +
		"\u060C\u060E\x03\x02\x02\x02\u060D\u05FB\x03\x02\x02\x02\u060D\u05FF\x03" +
		"\x02\x02\x02\u060D\u0600\x03\x02\x02\x02\u060D\u0601\x03\x02\x02\x02\u060D" +
		"\u0602\x03\x02\x02\x02\u060D\u0603\x03\x02\x02\x02\u060D\u0607\x03\x02" +
		"\x02\x02\u060E\xD3\x03\x02\x02\x02\u060F\u0610\x07+\x02\x02\u0610\u0611" +
		"\x05\xC2b\x02\u0611\u0615\x07R\x02\x02\u0612\u0614\x05\xD6l\x02\u0613" +
		"\u0612\x03\x02\x02\x02\u0614\u0617\x03\x02\x02\x02\u0615\u0613\x03\x02" +
		"\x02\x02\u0615\u0616\x03\x02\x02\x02\u0616\u0618\x03\x02\x02\x02\u0617" +
		"\u0615\x03\x02\x02\x02\u0618\u0619\x07S\x02\x02\u0619\xD5\x03\x02\x02" +
		"\x02\u061A\u0622\x07\b\x02\x02\u061B\u0623\x05\xC4c\x02\u061C\u061F\x07" +
		"O\x02\x02\u061D\u061E\x07W\x02\x02\u061E\u0620\x07\x0E\x02\x02\u061F\u061D" +
		"\x03\x02\x02\x02\u061F\u0620\x03\x02\x02\x02\u0620\u0623\x03\x02\x02\x02" +
		"\u0621\u0623\x05\xD8m\x02\u0622\u061B\x03\x02\x02\x02\u0622\u061C\x03" +
		"\x02\x02\x02\u0622\u0621\x03\x02\x02\x02\u0623\u0624\x03\x02\x02\x02\u0624" +
		"\u0625\t\x10\x02\x02\u0625\u062A\x05\xDCo\x02\u0626\u0627\x07\x0E\x02" +
		"\x02\u0627\u0628\t\x10\x02\x02\u0628\u062A\x05\xDCo\x02\u0629\u061A\x03" +
		"\x02\x02\x02\u0629\u0626\x03\x02\x02\x02\u062A\xD7\x03\x02\x02\x02\u062B" +
		"\u062C\bm\x01\x02\u062C\u062D\x07P\x02\x02\u062D\u062E\x05\xD8m\x02\u062E" +
		"\u062F\x07Q\x02\x02\u062F\u0647\x03\x02\x02\x02\u0630\u0632\x05\x0E\b" +
		"\x02\u0631\u0630\x03\x02\x02\x02\u0632\u0635\x03\x02\x02\x02\u0633\u0631" +
		"\x03\x02\x02\x02\u0633\u0634\x03\x02\x02\x02\u0634\u0636\x03\x02\x02\x02" +
		"\u0635\u0633\x03\x02\x02\x02\u0636\u063A\x05\xF4{\x02\u0637\u0639\x05" +
		"r:\x02\u0638\u0637\x03\x02\x02\x02\u0639\u063C\x03\x02\x02\x02\u063A\u0638" +
		"\x03\x02\x02\x02\u063A\u063B\x03\x02\x02\x02\u063B\u063D\x03\x02\x02\x02" +
		"\u063C\u063A\x03\x02\x02\x02\u063D\u0643\x05\xA4S\x02\u063E\u063F\x05" +
		"\xDAn\x02\u063F\u0640\x05\xC8e\x02\u0640\u0642\x03\x02\x02\x02\u0641\u063E" +
		"\x03\x02\x02\x02\u0642\u0645\x03\x02\x02\x02\u0643\u0641\x03\x02\x02\x02" +
		"\u0643\u0644\x03\x02\x02\x02\u0644\u0647\x03\x02\x02\x02\u0645\u0643\x03" +
		"\x02\x02\x02\u0646\u062B\x03\x02\x02\x02\u0646\u0633\x03\x02\x02\x02\u0647" +
		"\u064E\x03\x02\x02\x02\u0648\u0649\f\x03\x02\x02\u0649\u064A\x05\xDAn" +
		"\x02\u064A\u064B\x05\xC8e\x02\u064B\u064D\x03\x02\x02\x02\u064C\u0648" +
		"\x03\x02\x02\x02\u064D\u0650\x03\x02\x02\x02\u064E\u064C\x03\x02\x02\x02" +
		"\u064E\u064F\x03\x02\x02\x02\u064F\xD9\x03";
	private static readonly _serializedATNSegment3: string =
		"\x02\x02\x02\u0650\u064E\x03\x02\x02\x02\u0651\u0655\x07d\x02\x02\u0652" +
		"\u0653\x06n\x14\x02\u0653\u0655\x05\xA4S\x02\u0654\u0651\x03\x02\x02\x02" +
		"\u0654\u0652\x03\x02\x02\x02\u0655\xDB\x03\x02\x02\x02\u0656\u065E\x05" +
		"\x9EP\x02\u0657\u0659\x05\xA0Q\x02\u0658\u0657\x03\x02\x02\x02\u0659\u065C" +
		"\x03\x02\x02\x02\u065A\u0658\x03\x02\x02\x02\u065A\u065B\x03\x02\x02\x02" +
		"\u065B\u065E\x03\x02\x02\x02\u065C\u065A\x03\x02\x02\x02\u065D\u0656\x03" +
		"\x02\x02\x02\u065D\u065A\x03\x02\x02\x02\u065E\xDD\x03\x02\x02\x02\u065F" +
		"\u0660\x05T+\x02\u0660\u0661\x07X\x02\x02\u0661\u0663\x03\x02\x02\x02" +
		"\u0662\u065F\x03\x02\x02\x02\u0662\u0663\x03\x02\x02\x02\u0663\u0667\x03" +
		"\x02\x02\x02\u0664\u0666\x05r:\x02\u0665\u0664\x03\x02\x02\x02\u0666\u0669" +
		"\x03\x02\x02\x02\u0667\u0665\x03\x02\x02\x02\u0667\u0668\x03\x02\x02\x02" +
		"\u0668\u066A\x03\x02\x02\x02\u0669\u0667\x03\x02\x02\x02\u066A\u066C\x05" +
		"\xA4S\x02\u066B\u066D\x05\xF8}\x02\u066C\u066B\x03\x02\x02\x02\u066C\u066D" +
		"\x03\x02\x02\x02\u066D\xDF\x03\x02\x02\x02\u066E\u066F\x05\xF0y\x02\u066F" +
		"\u0670\x05\xE2r\x02\u0670\u0671\x05\xE8u\x02\u0671\u0678\x03\x02\x02\x02" +
		"\u0672\u0675\x05\xE2r\x02\u0673\u0676\x05\xE6t\x02\u0674\u0676\x05\xE8" +
		"u\x02\u0675\u0673\x03\x02\x02\x02\u0675\u0674\x03\x02\x02\x02\u0676\u0678" +
		"\x03\x02\x02\x02\u0677\u066E\x03\x02\x02\x02\u0677\u0672\x03\x02\x02\x02" +
		"\u0678\xE1\x03\x02\x02\x02\u0679\u067B\x05\xA4S\x02\u067A\u067C\x05\xEC" +
		"w\x02\u067B\u067A\x03\x02\x02\x02\u067B\u067C\x03\x02\x02\x02\u067C\u0684" +
		"\x03\x02\x02\x02\u067D\u067E\x07X\x02\x02\u067E\u0680\x05\xA4S\x02\u067F" +
		"\u0681\x05\xECw\x02\u0680\u067F\x03\x02\x02\x02\u0680\u0681\x03\x02\x02" +
		"\x02\u0681\u0683\x03\x02\x02\x02\u0682\u067D\x03\x02\x02\x02\u0683\u0686" +
		"\x03\x02\x02\x02\u0684\u0682\x03\x02\x02\x02\u0684\u0685\x03\x02\x02\x02" +
		"\u0685\u0689\x03\x02\x02\x02\u0686\u0684\x03\x02\x02\x02\u0687\u0689\x05" +
		"\xF6|\x02\u0688\u0679\x03\x02\x02\x02\u0688\u0687\x03\x02\x02\x02\u0689" +
		"\xE3\x03\x02\x02\x02\u068A\u068C\x05\xA4S\x02\u068B\u068D\x05\xEEx\x02" +
		"\u068C\u068B\x03\x02\x02\x02\u068C\u068D\x03\x02\x02\x02\u068D\u068E\x03" +
		"\x02\x02\x02\u068E\u068F\x05\xE8u\x02\u068F\xE5\x03\x02\x02\x02\u0690" +
		"\u06AC\x07T\x02\x02\u0691\u0696\x07U\x02\x02\u0692\u0693\x07T\x02\x02" +
		"\u0693\u0695\x07U\x02\x02\u0694\u0692\x03\x02\x02\x02\u0695\u0698\x03" +
		"\x02\x02\x02\u0696\u0694\x03\x02\x02\x02\u0696\u0697\x03\x02\x02\x02\u0697" +
		"\u0699\x03\x02\x02\x02\u0698\u0696\x03\x02\x02\x02\u0699\u06AD\x05R*\x02" +
		"\u069A\u069B\x05\xC8e\x02\u069B\u06A2\x07U\x02\x02\u069C\u069D\x07T\x02" +
		"\x02\u069D\u069E\x05\xC8e\x02\u069E\u069F\x07U\x02\x02\u069F\u06A1\x03" +
		"\x02\x02\x02\u06A0\u069C\x03\x02\x02\x02\u06A1\u06A4\x03\x02\x02\x02\u06A2" +
		"\u06A0\x03\x02\x02\x02\u06A2\u06A3\x03\x02\x02\x02\u06A3\u06A9\x03\x02" +
		"\x02\x02\u06A4\u06A2\x03\x02\x02\x02\u06A5\u06A6\x07T\x02\x02\u06A6\u06A8" +
		"\x07U\x02\x02\u06A7\u06A5\x03\x02\x02\x02\u06A8\u06AB\x03\x02\x02\x02" +
		"\u06A9\u06A7\x03\x02\x02\x02\u06A9\u06AA\x03\x02\x02\x02\u06AA\u06AD\x03" +
		"\x02\x02\x02\u06AB\u06A9\x03\x02\x02\x02\u06AC\u0691\x03\x02\x02\x02\u06AC" +
		"\u069A\x03\x02\x02\x02\u06AD\xE7\x03\x02\x02\x02\u06AE\u06B0\x05\xFE\x80" +
		"\x02\u06AF\u06B1\x05\"\x12\x02\u06B0\u06AF\x03\x02\x02\x02\u06B0\u06B1" +
		"\x03\x02\x02\x02\u06B1\xE9\x03\x02\x02\x02\u06B2\u06B3\x05\xF0y\x02\u06B3" +
		"\u06B4\x05\xFC\x7F\x02\u06B4\xEB\x03\x02\x02\x02\u06B5\u06B6\x07[\x02" +
		"\x02\u06B6\u06B9\x07Z\x02\x02\u06B7\u06B9\x05\xF8}\x02\u06B8\u06B5\x03" +
		"\x02\x02\x02\u06B8\u06B7\x03\x02\x02\x02\u06B9\xED\x03\x02\x02\x02\u06BA" +
		"\u06BB\x07[\x02\x02\u06BB\u06BE\x07Z\x02\x02\u06BC\u06BE\x05\xF0y\x02" +
		"\u06BD\u06BA\x03\x02\x02\x02\u06BD\u06BC\x03\x02\x02\x02\u06BE\xEF\x03" +
		"\x02\x02\x02\u06BF\u06C0\x07[\x02\x02\u06C0\u06C1\x05\xF2z\x02\u06C1\u06C2" +
		"\x07Z\x02\x02\u06C2\xF1\x03\x02\x02\x02\u06C3\u06C8\x05\xF4{\x02\u06C4" +
		"\u06C5\x07W\x02\x02\u06C5\u06C7\x05\xF4{\x02\u06C6\u06C4\x03\x02\x02\x02" +
		"\u06C7\u06CA\x03\x02\x02\x02\u06C8\u06C6\x03\x02\x02\x02\u06C8\u06C9\x03" +
		"\x02\x02\x02\u06C9\xF3\x03\x02\x02\x02\u06CA\u06C8\x03\x02\x02\x02\u06CB" +
		"\u06CD\x05r:\x02\u06CC\u06CB\x03\x02\x02\x02\u06CD\u06D0\x03\x02\x02\x02" +
		"\u06CE\u06CC\x03\x02\x02\x02\u06CE\u06CF\x03\x02\x02\x02\u06CF\u06D3\x03" +
		"\x02\x02\x02\u06D0\u06CE\x03\x02\x02\x02\u06D1\u06D4\x05T+\x02\u06D2\u06D4" +
		"\x05\xF6|\x02\u06D3\u06D1\x03\x02\x02\x02\u06D3\u06D2\x03\x02\x02\x02" +
		"\u06D4\u06DF\x03\x02\x02\x02\u06D5\u06D7\x05r:\x02\u06D6\u06D5\x03\x02" +
		"\x02\x02\u06D7\u06DA\x03\x02\x02\x02\u06D8\u06D6\x03\x02\x02\x02\u06D8" +
		"\u06D9\x03\x02\x02\x02\u06D9\u06DB\x03\x02\x02\x02\u06DA\u06D8\x03\x02" +
		"\x02\x02\u06DB\u06DC\x07T\x02\x02\u06DC\u06DE\x07U\x02\x02\u06DD\u06D8" +
		"\x03\x02\x02\x02\u06DE\u06E1\x03\x02\x02\x02\u06DF\u06DD\x03\x02\x02\x02" +
		"\u06DF\u06E0\x03\x02\x02\x02\u06E0\xF5\x03\x02\x02\x02\u06E1\u06DF\x03" +
		"\x02\x02\x02\u06E2\u06E3\t\x11\x02\x02\u06E3\xF7\x03\x02\x02\x02\u06E4" +
		"\u06E5\x07[\x02\x02\u06E5\u06EA\x05V,\x02\u06E6\u06E7\x07W\x02\x02\u06E7" +
		"\u06E9\x05V,\x02\u06E8\u06E6\x03\x02\x02\x02\u06E9\u06EC\x03\x02\x02\x02" +
		"\u06EA\u06E8\x03\x02\x02\x02\u06EA\u06EB\x03\x02\x02\x02\u06EB\u06ED\x03" +
		"\x02\x02\x02\u06EC\u06EA\x03\x02\x02\x02\u06ED\u06EE\x07Z\x02\x02\u06EE" +
		"\xF9\x03\x02\x02\x02\u06EF\u06F9\x05\xFE\x80\x02\u06F0\u06F2\x07X\x02" +
		"\x02\u06F1\u06F3\x05\xF8}\x02\u06F2\u06F1\x03\x02\x02\x02\u06F2\u06F3" +
		"\x03\x02\x02\x02\u06F3\u06F4\x03\x02\x02\x02\u06F4\u06F6\x05\xA4S\x02" +
		"\u06F5\u06F7\x05\xFE\x80\x02\u06F6\u06F5\x03\x02\x02\x02\u06F6\u06F7\x03" +
		"\x02\x02\x02\u06F7\u06F9\x03\x02\x02\x02\u06F8\u06EF\x03\x02\x02\x02\u06F8" +
		"\u06F0\x03\x02\x02\x02\u06F9\xFB\x03\x02\x02\x02\u06FA\u06FB\x07*\x02" +
		"\x02\u06FB\u0700\x05\xFA~\x02\u06FC\u06FD\x05\xA4S\x02\u06FD\u06FE\x05" +
		"\xFE\x80\x02\u06FE\u0700\x03\x02\x02\x02\u06FF\u06FA\x03\x02\x02\x02\u06FF" +
		"\u06FC\x03\x02\x02\x02\u0700\xFD\x03\x02\x02\x02\u0701\u0703\x07P\x02" +
		"\x02\u0702\u0704\x05\xC4c\x02\u0703\u0702\x03\x02\x02\x02\u0703\u0704" +
		"\x03\x02\x02\x02\u0704\u0705\x03\x02\x02\x02\u0705\u0706\x07Q\x02\x02" +
		"\u0706\xFF\x03\x02\x02\x02\xE4\u0101\u0105\u0107\u010C\u010E\u0114\u0119" +
		"\u0122\u0127\u012C\u0131\u0139\u0140\u014C\u0150\u0155\u0159\u015D\u0161" +
		"\u016B\u0173\u017B\u017F\u0186\u018D\u0191\u0194\u0197\u01A0\u01A6\u01AB" +
		"\u01AE\u01B4\u01BA\u01BE\u01C2\u01CA\u01D3\u01DA\u01E0\u01E4\u01F0\u01F9" +
		"\u01FE\u0204\u0208\u0214\u021B\u0228\u022D\u0237\u023F\u0249\u0252\u025D" +
		"\u0262\u026B\u0275\u027A\u0283\u0289\u0290\u0295\u029D\u02A1\u02A3\u02A9" +
		"\u02AF\u02B4\u02BA\u02C0\u02C2\u02C9\u02CE\u02D3\u02D6\u02D8\u02E2\u02EC" +
		"\u02F1\u02F4\u02F9\u0302\u0309\u0314\u031A\u0325\u032F\u033A\u0343\u0348" +
		"\u034B\u0352\u035C\u0364\u0367\u036A\u0377\u037F\u0384\u038C\u0390\u0394" +
		"\u0398\u039C\u039E\u03A2\u03A8\u03B0\u03BA\u03C3\u03CD\u03D5\u03E3\u03EA" +
		"\u03EF\u03F5\u03FE\u0407\u0409\u0412\u041C\u0421\u042C\u0435\u043B\u0442" +
		"\u044B\u0462\u0465\u0468\u0470\u0474\u047C\u0482\u048D\u0496\u049B\u04A8" +
		"\u04AE\u04B5\u04C2\u04CB\u04D4\u04DA\u04E2\u04E8\u04ED\u04F2\u04FD\u04FF" +
		"\u0504\u0508\u050C\u0510\u0512\u0516\u051B\u0520\u052F\u0535\u053C\u0542" +
		"\u0545\u0550\u0558\u0567\u056B\u0570\u0574\u0584\u05AC\u05B2\u05BF\u05C4" +
		"\u05C7\u05C9\u05CF\u05D6\u05E2\u05EB\u05F2\u05F5\u05F9\u060B\u060D\u0615" +
		"\u061F\u0622\u0629\u0633\u063A\u0643\u0646\u064E\u0654\u065A\u065D\u0662" +
		"\u0667\u066C\u0675\u0677\u067B\u0680\u0684\u0688\u068C\u0696\u06A2\u06A9" +
		"\u06AC\u06B0\u06B8\u06BD\u06C8\u06CE\u06D3\u06D8\u06DF\u06EA\u06F2\u06F6" +
		"\u06F8\u06FF\u0703";
	public static readonly _serializedATN: string = Utils.join(
		[
			JavaParser._serializedATNSegment0,
			JavaParser._serializedATNSegment1,
			JavaParser._serializedATNSegment2,
			JavaParser._serializedATNSegment3,
		],
		"",
	);
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!JavaParser.__ATN) {
			JavaParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(JavaParser._serializedATN));
		}

		return JavaParser.__ATN;
	}

}

export class CompilationUnitContext extends ParserRuleContext {
	public packageDeclaration(): PackageDeclarationContext | undefined {
		return this.tryGetRuleContext(0, PackageDeclarationContext);
	}
	public importDeclaration(): ImportDeclarationContext[];
	public importDeclaration(i: number): ImportDeclarationContext;
	public importDeclaration(i?: number): ImportDeclarationContext | ImportDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ImportDeclarationContext);
		} else {
			return this.getRuleContext(i, ImportDeclarationContext);
		}
	}
	public SEMI(): TerminalNode[];
	public SEMI(i: number): TerminalNode;
	public SEMI(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.SEMI);
		} else {
			return this.getToken(JavaParser.SEMI, i);
		}
	}
	public typeDeclaration(): TypeDeclarationContext[];
	public typeDeclaration(i: number): TypeDeclarationContext;
	public typeDeclaration(i?: number): TypeDeclarationContext | TypeDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeDeclarationContext);
		} else {
			return this.getRuleContext(i, TypeDeclarationContext);
		}
	}
	public moduleDeclaration(): ModuleDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ModuleDeclarationContext);
	}
	public EOF(): TerminalNode | undefined { return this.tryGetToken(JavaParser.EOF, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_compilationUnit; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterCompilationUnit) {
			listener.enterCompilationUnit(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitCompilationUnit) {
			listener.exitCompilationUnit(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitCompilationUnit) {
			return visitor.visitCompilationUnit(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PackageDeclarationContext extends ParserRuleContext {
	public PACKAGE(): TerminalNode { return this.getToken(JavaParser.PACKAGE, 0); }
	public qualifiedName(): QualifiedNameContext {
		return this.getRuleContext(0, QualifiedNameContext);
	}
	public SEMI(): TerminalNode { return this.getToken(JavaParser.SEMI, 0); }
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_packageDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterPackageDeclaration) {
			listener.enterPackageDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitPackageDeclaration) {
			listener.exitPackageDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitPackageDeclaration) {
			return visitor.visitPackageDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImportDeclarationContext extends ParserRuleContext {
	public IMPORT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.IMPORT, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public SEMI(): TerminalNode { return this.getToken(JavaParser.SEMI, 0); }
	public STATIC(): TerminalNode | undefined { return this.tryGetToken(JavaParser.STATIC, 0); }
	public DOT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DOT, 0); }
	public MUL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.MUL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_importDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterImportDeclaration) {
			listener.enterImportDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitImportDeclaration) {
			listener.exitImportDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitImportDeclaration) {
			return visitor.visitImportDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeDeclarationContext extends ParserRuleContext {
	public classDeclaration(): ClassDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ClassDeclarationContext);
	}
	public enumDeclaration(): EnumDeclarationContext | undefined {
		return this.tryGetRuleContext(0, EnumDeclarationContext);
	}
	public interfaceDeclaration(): InterfaceDeclarationContext | undefined {
		return this.tryGetRuleContext(0, InterfaceDeclarationContext);
	}
	public annotationTypeDeclaration(): AnnotationTypeDeclarationContext | undefined {
		return this.tryGetRuleContext(0, AnnotationTypeDeclarationContext);
	}
	public recordDeclaration(): RecordDeclarationContext | undefined {
		return this.tryGetRuleContext(0, RecordDeclarationContext);
	}
	public classOrInterfaceModifier(): ClassOrInterfaceModifierContext[];
	public classOrInterfaceModifier(i: number): ClassOrInterfaceModifierContext;
	public classOrInterfaceModifier(i?: number): ClassOrInterfaceModifierContext | ClassOrInterfaceModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassOrInterfaceModifierContext);
		} else {
			return this.getRuleContext(i, ClassOrInterfaceModifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_typeDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterTypeDeclaration) {
			listener.enterTypeDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitTypeDeclaration) {
			listener.exitTypeDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitTypeDeclaration) {
			return visitor.visitTypeDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ModifierContext extends ParserRuleContext {
	public classOrInterfaceModifier(): ClassOrInterfaceModifierContext | undefined {
		return this.tryGetRuleContext(0, ClassOrInterfaceModifierContext);
	}
	public NATIVE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.NATIVE, 0); }
	public SYNCHRONIZED(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SYNCHRONIZED, 0); }
	public TRANSIENT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.TRANSIENT, 0); }
	public VOLATILE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.VOLATILE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_modifier; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterModifier) {
			listener.enterModifier(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitModifier) {
			listener.exitModifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitModifier) {
			return visitor.visitModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassOrInterfaceModifierContext extends ParserRuleContext {
	public annotation(): AnnotationContext | undefined {
		return this.tryGetRuleContext(0, AnnotationContext);
	}
	public PUBLIC(): TerminalNode | undefined { return this.tryGetToken(JavaParser.PUBLIC, 0); }
	public PROTECTED(): TerminalNode | undefined { return this.tryGetToken(JavaParser.PROTECTED, 0); }
	public PRIVATE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.PRIVATE, 0); }
	public STATIC(): TerminalNode | undefined { return this.tryGetToken(JavaParser.STATIC, 0); }
	public ABSTRACT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.ABSTRACT, 0); }
	public FINAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.FINAL, 0); }
	public STRICTFP(): TerminalNode | undefined { return this.tryGetToken(JavaParser.STRICTFP, 0); }
	public SEALED(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SEALED, 0); }
	public NON_SEALED(): TerminalNode | undefined { return this.tryGetToken(JavaParser.NON_SEALED, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_classOrInterfaceModifier; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterClassOrInterfaceModifier) {
			listener.enterClassOrInterfaceModifier(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitClassOrInterfaceModifier) {
			listener.exitClassOrInterfaceModifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitClassOrInterfaceModifier) {
			return visitor.visitClassOrInterfaceModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableModifierContext extends ParserRuleContext {
	public FINAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.FINAL, 0); }
	public annotation(): AnnotationContext | undefined {
		return this.tryGetRuleContext(0, AnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_variableModifier; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterVariableModifier) {
			listener.enterVariableModifier(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitVariableModifier) {
			listener.exitVariableModifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitVariableModifier) {
			return visitor.visitVariableModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassDeclarationContext extends ParserRuleContext {
	public CLASS(): TerminalNode { return this.getToken(JavaParser.CLASS, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public classBody(): ClassBodyContext {
		return this.getRuleContext(0, ClassBodyContext);
	}
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	public EXTENDS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.EXTENDS, 0); }
	public typeType(): TypeTypeContext | undefined {
		return this.tryGetRuleContext(0, TypeTypeContext);
	}
	public IMPLEMENTS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.IMPLEMENTS, 0); }
	public typeList(): TypeListContext[];
	public typeList(i: number): TypeListContext;
	public typeList(i?: number): TypeListContext | TypeListContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeListContext);
		} else {
			return this.getRuleContext(i, TypeListContext);
		}
	}
	public PERMITS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.PERMITS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_classDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterClassDeclaration) {
			listener.enterClassDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitClassDeclaration) {
			listener.exitClassDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitClassDeclaration) {
			return visitor.visitClassDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeParametersContext extends ParserRuleContext {
	public LT(): TerminalNode { return this.getToken(JavaParser.LT, 0); }
	public typeParameter(): TypeParameterContext[];
	public typeParameter(i: number): TypeParameterContext;
	public typeParameter(i?: number): TypeParameterContext | TypeParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeParameterContext);
		} else {
			return this.getRuleContext(i, TypeParameterContext);
		}
	}
	public GT(): TerminalNode { return this.getToken(JavaParser.GT, 0); }
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_typeParameters; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterTypeParameters) {
			listener.enterTypeParameters(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitTypeParameters) {
			listener.exitTypeParameters(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitTypeParameters) {
			return visitor.visitTypeParameters(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeParameterContext extends ParserRuleContext {
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	public EXTENDS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.EXTENDS, 0); }
	public typeBound(): TypeBoundContext | undefined {
		return this.tryGetRuleContext(0, TypeBoundContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_typeParameter; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterTypeParameter) {
			listener.enterTypeParameter(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitTypeParameter) {
			listener.exitTypeParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitTypeParameter) {
			return visitor.visitTypeParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeBoundContext extends ParserRuleContext {
	public typeType(): TypeTypeContext[];
	public typeType(i: number): TypeTypeContext;
	public typeType(i?: number): TypeTypeContext | TypeTypeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeTypeContext);
		} else {
			return this.getRuleContext(i, TypeTypeContext);
		}
	}
	public BITAND(): TerminalNode[];
	public BITAND(i: number): TerminalNode;
	public BITAND(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.BITAND);
		} else {
			return this.getToken(JavaParser.BITAND, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_typeBound; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterTypeBound) {
			listener.enterTypeBound(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitTypeBound) {
			listener.exitTypeBound(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitTypeBound) {
			return visitor.visitTypeBound(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumDeclarationContext extends ParserRuleContext {
	public ENUM(): TerminalNode { return this.getToken(JavaParser.ENUM, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public LBRACE(): TerminalNode { return this.getToken(JavaParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(JavaParser.RBRACE, 0); }
	public IMPLEMENTS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.IMPLEMENTS, 0); }
	public typeList(): TypeListContext | undefined {
		return this.tryGetRuleContext(0, TypeListContext);
	}
	public enumConstants(): EnumConstantsContext | undefined {
		return this.tryGetRuleContext(0, EnumConstantsContext);
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(JavaParser.COMMA, 0); }
	public enumBodyDeclarations(): EnumBodyDeclarationsContext | undefined {
		return this.tryGetRuleContext(0, EnumBodyDeclarationsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_enumDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterEnumDeclaration) {
			listener.enterEnumDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitEnumDeclaration) {
			listener.exitEnumDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitEnumDeclaration) {
			return visitor.visitEnumDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumConstantsContext extends ParserRuleContext {
	public enumConstant(): EnumConstantContext[];
	public enumConstant(i: number): EnumConstantContext;
	public enumConstant(i?: number): EnumConstantContext | EnumConstantContext[] {
		if (i === undefined) {
			return this.getRuleContexts(EnumConstantContext);
		} else {
			return this.getRuleContext(i, EnumConstantContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_enumConstants; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterEnumConstants) {
			listener.enterEnumConstants(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitEnumConstants) {
			listener.exitEnumConstants(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitEnumConstants) {
			return visitor.visitEnumConstants(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumConstantContext extends ParserRuleContext {
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	public arguments(): ArgumentsContext | undefined {
		return this.tryGetRuleContext(0, ArgumentsContext);
	}
	public classBody(): ClassBodyContext | undefined {
		return this.tryGetRuleContext(0, ClassBodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_enumConstant; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterEnumConstant) {
			listener.enterEnumConstant(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitEnumConstant) {
			listener.exitEnumConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitEnumConstant) {
			return visitor.visitEnumConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumBodyDeclarationsContext extends ParserRuleContext {
	public SEMI(): TerminalNode { return this.getToken(JavaParser.SEMI, 0); }
	public classBodyDeclaration(): ClassBodyDeclarationContext[];
	public classBodyDeclaration(i: number): ClassBodyDeclarationContext;
	public classBodyDeclaration(i?: number): ClassBodyDeclarationContext | ClassBodyDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassBodyDeclarationContext);
		} else {
			return this.getRuleContext(i, ClassBodyDeclarationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_enumBodyDeclarations; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterEnumBodyDeclarations) {
			listener.enterEnumBodyDeclarations(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitEnumBodyDeclarations) {
			listener.exitEnumBodyDeclarations(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitEnumBodyDeclarations) {
			return visitor.visitEnumBodyDeclarations(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceDeclarationContext extends ParserRuleContext {
	public INTERFACE(): TerminalNode { return this.getToken(JavaParser.INTERFACE, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public interfaceBody(): InterfaceBodyContext {
		return this.getRuleContext(0, InterfaceBodyContext);
	}
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	public EXTENDS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.EXTENDS, 0); }
	public typeList(): TypeListContext[];
	public typeList(i: number): TypeListContext;
	public typeList(i?: number): TypeListContext | TypeListContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeListContext);
		} else {
			return this.getRuleContext(i, TypeListContext);
		}
	}
	public PERMITS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.PERMITS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_interfaceDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterInterfaceDeclaration) {
			listener.enterInterfaceDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitInterfaceDeclaration) {
			listener.exitInterfaceDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitInterfaceDeclaration) {
			return visitor.visitInterfaceDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassBodyContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(JavaParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(JavaParser.RBRACE, 0); }
	public classBodyDeclaration(): ClassBodyDeclarationContext[];
	public classBodyDeclaration(i: number): ClassBodyDeclarationContext;
	public classBodyDeclaration(i?: number): ClassBodyDeclarationContext | ClassBodyDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassBodyDeclarationContext);
		} else {
			return this.getRuleContext(i, ClassBodyDeclarationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_classBody; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterClassBody) {
			listener.enterClassBody(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitClassBody) {
			listener.exitClassBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitClassBody) {
			return visitor.visitClassBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceBodyContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(JavaParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(JavaParser.RBRACE, 0); }
	public interfaceBodyDeclaration(): InterfaceBodyDeclarationContext[];
	public interfaceBodyDeclaration(i: number): InterfaceBodyDeclarationContext;
	public interfaceBodyDeclaration(i?: number): InterfaceBodyDeclarationContext | InterfaceBodyDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(InterfaceBodyDeclarationContext);
		} else {
			return this.getRuleContext(i, InterfaceBodyDeclarationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_interfaceBody; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterInterfaceBody) {
			listener.enterInterfaceBody(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitInterfaceBody) {
			listener.exitInterfaceBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitInterfaceBody) {
			return visitor.visitInterfaceBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassBodyDeclarationContext extends ParserRuleContext {
	public SEMI(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SEMI, 0); }
	public block(): BlockContext | undefined {
		return this.tryGetRuleContext(0, BlockContext);
	}
	public STATIC(): TerminalNode | undefined { return this.tryGetToken(JavaParser.STATIC, 0); }
	public memberDeclaration(): MemberDeclarationContext | undefined {
		return this.tryGetRuleContext(0, MemberDeclarationContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_classBodyDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterClassBodyDeclaration) {
			listener.enterClassBodyDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitClassBodyDeclaration) {
			listener.exitClassBodyDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitClassBodyDeclaration) {
			return visitor.visitClassBodyDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MemberDeclarationContext extends ParserRuleContext {
	public recordDeclaration(): RecordDeclarationContext | undefined {
		return this.tryGetRuleContext(0, RecordDeclarationContext);
	}
	public methodDeclaration(): MethodDeclarationContext | undefined {
		return this.tryGetRuleContext(0, MethodDeclarationContext);
	}
	public genericMethodDeclaration(): GenericMethodDeclarationContext | undefined {
		return this.tryGetRuleContext(0, GenericMethodDeclarationContext);
	}
	public fieldDeclaration(): FieldDeclarationContext | undefined {
		return this.tryGetRuleContext(0, FieldDeclarationContext);
	}
	public constructorDeclaration(): ConstructorDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ConstructorDeclarationContext);
	}
	public genericConstructorDeclaration(): GenericConstructorDeclarationContext | undefined {
		return this.tryGetRuleContext(0, GenericConstructorDeclarationContext);
	}
	public interfaceDeclaration(): InterfaceDeclarationContext | undefined {
		return this.tryGetRuleContext(0, InterfaceDeclarationContext);
	}
	public annotationTypeDeclaration(): AnnotationTypeDeclarationContext | undefined {
		return this.tryGetRuleContext(0, AnnotationTypeDeclarationContext);
	}
	public classDeclaration(): ClassDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ClassDeclarationContext);
	}
	public enumDeclaration(): EnumDeclarationContext | undefined {
		return this.tryGetRuleContext(0, EnumDeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_memberDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterMemberDeclaration) {
			listener.enterMemberDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitMemberDeclaration) {
			listener.exitMemberDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitMemberDeclaration) {
			return visitor.visitMemberDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MethodDeclarationContext extends ParserRuleContext {
	public typeTypeOrVoid(): TypeTypeOrVoidContext {
		return this.getRuleContext(0, TypeTypeOrVoidContext);
	}
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public formalParameters(): FormalParametersContext {
		return this.getRuleContext(0, FormalParametersContext);
	}
	public methodBody(): MethodBodyContext {
		return this.getRuleContext(0, MethodBodyContext);
	}
	public LBRACK(): TerminalNode[];
	public LBRACK(i: number): TerminalNode;
	public LBRACK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.LBRACK);
		} else {
			return this.getToken(JavaParser.LBRACK, i);
		}
	}
	public RBRACK(): TerminalNode[];
	public RBRACK(i: number): TerminalNode;
	public RBRACK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.RBRACK);
		} else {
			return this.getToken(JavaParser.RBRACK, i);
		}
	}
	public THROWS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.THROWS, 0); }
	public qualifiedNameList(): QualifiedNameListContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_methodDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterMethodDeclaration) {
			listener.enterMethodDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitMethodDeclaration) {
			listener.exitMethodDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitMethodDeclaration) {
			return visitor.visitMethodDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MethodBodyContext extends ParserRuleContext {
	public block(): BlockContext | undefined {
		return this.tryGetRuleContext(0, BlockContext);
	}
	public SEMI(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_methodBody; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterMethodBody) {
			listener.enterMethodBody(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitMethodBody) {
			listener.exitMethodBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitMethodBody) {
			return visitor.visitMethodBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeTypeOrVoidContext extends ParserRuleContext {
	public typeType(): TypeTypeContext | undefined {
		return this.tryGetRuleContext(0, TypeTypeContext);
	}
	public VOID(): TerminalNode | undefined { return this.tryGetToken(JavaParser.VOID, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_typeTypeOrVoid; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterTypeTypeOrVoid) {
			listener.enterTypeTypeOrVoid(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitTypeTypeOrVoid) {
			listener.exitTypeTypeOrVoid(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitTypeTypeOrVoid) {
			return visitor.visitTypeTypeOrVoid(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenericMethodDeclarationContext extends ParserRuleContext {
	public typeParameters(): TypeParametersContext {
		return this.getRuleContext(0, TypeParametersContext);
	}
	public methodDeclaration(): MethodDeclarationContext {
		return this.getRuleContext(0, MethodDeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_genericMethodDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterGenericMethodDeclaration) {
			listener.enterGenericMethodDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitGenericMethodDeclaration) {
			listener.exitGenericMethodDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitGenericMethodDeclaration) {
			return visitor.visitGenericMethodDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenericConstructorDeclarationContext extends ParserRuleContext {
	public typeParameters(): TypeParametersContext {
		return this.getRuleContext(0, TypeParametersContext);
	}
	public constructorDeclaration(): ConstructorDeclarationContext {
		return this.getRuleContext(0, ConstructorDeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_genericConstructorDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterGenericConstructorDeclaration) {
			listener.enterGenericConstructorDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitGenericConstructorDeclaration) {
			listener.exitGenericConstructorDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitGenericConstructorDeclaration) {
			return visitor.visitGenericConstructorDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstructorDeclarationContext extends ParserRuleContext {
	public _constructorBody!: BlockContext;
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public formalParameters(): FormalParametersContext {
		return this.getRuleContext(0, FormalParametersContext);
	}
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public THROWS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.THROWS, 0); }
	public qualifiedNameList(): QualifiedNameListContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_constructorDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterConstructorDeclaration) {
			listener.enterConstructorDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitConstructorDeclaration) {
			listener.exitConstructorDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitConstructorDeclaration) {
			return visitor.visitConstructorDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CompactConstructorDeclarationContext extends ParserRuleContext {
	public _constructorBody!: BlockContext;
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_compactConstructorDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterCompactConstructorDeclaration) {
			listener.enterCompactConstructorDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitCompactConstructorDeclaration) {
			listener.exitCompactConstructorDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitCompactConstructorDeclaration) {
			return visitor.visitCompactConstructorDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FieldDeclarationContext extends ParserRuleContext {
	public typeType(): TypeTypeContext {
		return this.getRuleContext(0, TypeTypeContext);
	}
	public variableDeclarators(): VariableDeclaratorsContext {
		return this.getRuleContext(0, VariableDeclaratorsContext);
	}
	public SEMI(): TerminalNode { return this.getToken(JavaParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_fieldDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterFieldDeclaration) {
			listener.enterFieldDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitFieldDeclaration) {
			listener.exitFieldDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitFieldDeclaration) {
			return visitor.visitFieldDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceBodyDeclarationContext extends ParserRuleContext {
	public interfaceMemberDeclaration(): InterfaceMemberDeclarationContext | undefined {
		return this.tryGetRuleContext(0, InterfaceMemberDeclarationContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public SEMI(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_interfaceBodyDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterInterfaceBodyDeclaration) {
			listener.enterInterfaceBodyDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitInterfaceBodyDeclaration) {
			listener.exitInterfaceBodyDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitInterfaceBodyDeclaration) {
			return visitor.visitInterfaceBodyDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceMemberDeclarationContext extends ParserRuleContext {
	public constDeclaration(): ConstDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ConstDeclarationContext);
	}
	public interfaceMethodDeclaration(): InterfaceMethodDeclarationContext | undefined {
		return this.tryGetRuleContext(0, InterfaceMethodDeclarationContext);
	}
	public genericInterfaceMethodDeclaration(): GenericInterfaceMethodDeclarationContext | undefined {
		return this.tryGetRuleContext(0, GenericInterfaceMethodDeclarationContext);
	}
	public interfaceDeclaration(): InterfaceDeclarationContext | undefined {
		return this.tryGetRuleContext(0, InterfaceDeclarationContext);
	}
	public annotationTypeDeclaration(): AnnotationTypeDeclarationContext | undefined {
		return this.tryGetRuleContext(0, AnnotationTypeDeclarationContext);
	}
	public classDeclaration(): ClassDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ClassDeclarationContext);
	}
	public enumDeclaration(): EnumDeclarationContext | undefined {
		return this.tryGetRuleContext(0, EnumDeclarationContext);
	}
	public recordDeclaration(): RecordDeclarationContext | undefined {
		return this.tryGetRuleContext(0, RecordDeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_interfaceMemberDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterInterfaceMemberDeclaration) {
			listener.enterInterfaceMemberDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitInterfaceMemberDeclaration) {
			listener.exitInterfaceMemberDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitInterfaceMemberDeclaration) {
			return visitor.visitInterfaceMemberDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstDeclarationContext extends ParserRuleContext {
	public typeType(): TypeTypeContext {
		return this.getRuleContext(0, TypeTypeContext);
	}
	public constantDeclarator(): ConstantDeclaratorContext[];
	public constantDeclarator(i: number): ConstantDeclaratorContext;
	public constantDeclarator(i?: number): ConstantDeclaratorContext | ConstantDeclaratorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ConstantDeclaratorContext);
		} else {
			return this.getRuleContext(i, ConstantDeclaratorContext);
		}
	}
	public SEMI(): TerminalNode { return this.getToken(JavaParser.SEMI, 0); }
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_constDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterConstDeclaration) {
			listener.enterConstDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitConstDeclaration) {
			listener.exitConstDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitConstDeclaration) {
			return visitor.visitConstDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstantDeclaratorContext extends ParserRuleContext {
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public ASSIGN(): TerminalNode { return this.getToken(JavaParser.ASSIGN, 0); }
	public variableInitializer(): VariableInitializerContext {
		return this.getRuleContext(0, VariableInitializerContext);
	}
	public LBRACK(): TerminalNode[];
	public LBRACK(i: number): TerminalNode;
	public LBRACK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.LBRACK);
		} else {
			return this.getToken(JavaParser.LBRACK, i);
		}
	}
	public RBRACK(): TerminalNode[];
	public RBRACK(i: number): TerminalNode;
	public RBRACK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.RBRACK);
		} else {
			return this.getToken(JavaParser.RBRACK, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_constantDeclarator; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterConstantDeclarator) {
			listener.enterConstantDeclarator(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitConstantDeclarator) {
			listener.exitConstantDeclarator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitConstantDeclarator) {
			return visitor.visitConstantDeclarator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceMethodDeclarationContext extends ParserRuleContext {
	public interfaceCommonBodyDeclaration(): InterfaceCommonBodyDeclarationContext {
		return this.getRuleContext(0, InterfaceCommonBodyDeclarationContext);
	}
	public interfaceMethodModifier(): InterfaceMethodModifierContext[];
	public interfaceMethodModifier(i: number): InterfaceMethodModifierContext;
	public interfaceMethodModifier(i?: number): InterfaceMethodModifierContext | InterfaceMethodModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(InterfaceMethodModifierContext);
		} else {
			return this.getRuleContext(i, InterfaceMethodModifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_interfaceMethodDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterInterfaceMethodDeclaration) {
			listener.enterInterfaceMethodDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitInterfaceMethodDeclaration) {
			listener.exitInterfaceMethodDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitInterfaceMethodDeclaration) {
			return visitor.visitInterfaceMethodDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceMethodModifierContext extends ParserRuleContext {
	public annotation(): AnnotationContext | undefined {
		return this.tryGetRuleContext(0, AnnotationContext);
	}
	public PUBLIC(): TerminalNode | undefined { return this.tryGetToken(JavaParser.PUBLIC, 0); }
	public ABSTRACT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.ABSTRACT, 0); }
	public DEFAULT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DEFAULT, 0); }
	public STATIC(): TerminalNode | undefined { return this.tryGetToken(JavaParser.STATIC, 0); }
	public STRICTFP(): TerminalNode | undefined { return this.tryGetToken(JavaParser.STRICTFP, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_interfaceMethodModifier; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterInterfaceMethodModifier) {
			listener.enterInterfaceMethodModifier(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitInterfaceMethodModifier) {
			listener.exitInterfaceMethodModifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitInterfaceMethodModifier) {
			return visitor.visitInterfaceMethodModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenericInterfaceMethodDeclarationContext extends ParserRuleContext {
	public typeParameters(): TypeParametersContext {
		return this.getRuleContext(0, TypeParametersContext);
	}
	public interfaceCommonBodyDeclaration(): InterfaceCommonBodyDeclarationContext {
		return this.getRuleContext(0, InterfaceCommonBodyDeclarationContext);
	}
	public interfaceMethodModifier(): InterfaceMethodModifierContext[];
	public interfaceMethodModifier(i: number): InterfaceMethodModifierContext;
	public interfaceMethodModifier(i?: number): InterfaceMethodModifierContext | InterfaceMethodModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(InterfaceMethodModifierContext);
		} else {
			return this.getRuleContext(i, InterfaceMethodModifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_genericInterfaceMethodDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterGenericInterfaceMethodDeclaration) {
			listener.enterGenericInterfaceMethodDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitGenericInterfaceMethodDeclaration) {
			listener.exitGenericInterfaceMethodDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitGenericInterfaceMethodDeclaration) {
			return visitor.visitGenericInterfaceMethodDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceCommonBodyDeclarationContext extends ParserRuleContext {
	public typeTypeOrVoid(): TypeTypeOrVoidContext {
		return this.getRuleContext(0, TypeTypeOrVoidContext);
	}
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public formalParameters(): FormalParametersContext {
		return this.getRuleContext(0, FormalParametersContext);
	}
	public methodBody(): MethodBodyContext {
		return this.getRuleContext(0, MethodBodyContext);
	}
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	public LBRACK(): TerminalNode[];
	public LBRACK(i: number): TerminalNode;
	public LBRACK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.LBRACK);
		} else {
			return this.getToken(JavaParser.LBRACK, i);
		}
	}
	public RBRACK(): TerminalNode[];
	public RBRACK(i: number): TerminalNode;
	public RBRACK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.RBRACK);
		} else {
			return this.getToken(JavaParser.RBRACK, i);
		}
	}
	public THROWS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.THROWS, 0); }
	public qualifiedNameList(): QualifiedNameListContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_interfaceCommonBodyDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterInterfaceCommonBodyDeclaration) {
			listener.enterInterfaceCommonBodyDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitInterfaceCommonBodyDeclaration) {
			listener.exitInterfaceCommonBodyDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitInterfaceCommonBodyDeclaration) {
			return visitor.visitInterfaceCommonBodyDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableDeclaratorsContext extends ParserRuleContext {
	public variableDeclarator(): VariableDeclaratorContext[];
	public variableDeclarator(i: number): VariableDeclaratorContext;
	public variableDeclarator(i?: number): VariableDeclaratorContext | VariableDeclaratorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableDeclaratorContext);
		} else {
			return this.getRuleContext(i, VariableDeclaratorContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_variableDeclarators; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterVariableDeclarators) {
			listener.enterVariableDeclarators(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitVariableDeclarators) {
			listener.exitVariableDeclarators(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitVariableDeclarators) {
			return visitor.visitVariableDeclarators(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableDeclaratorContext extends ParserRuleContext {
	public variableDeclaratorId(): VariableDeclaratorIdContext {
		return this.getRuleContext(0, VariableDeclaratorIdContext);
	}
	public ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.ASSIGN, 0); }
	public variableInitializer(): VariableInitializerContext | undefined {
		return this.tryGetRuleContext(0, VariableInitializerContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_variableDeclarator; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterVariableDeclarator) {
			listener.enterVariableDeclarator(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitVariableDeclarator) {
			listener.exitVariableDeclarator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitVariableDeclarator) {
			return visitor.visitVariableDeclarator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableDeclaratorIdContext extends ParserRuleContext {
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public LBRACK(): TerminalNode[];
	public LBRACK(i: number): TerminalNode;
	public LBRACK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.LBRACK);
		} else {
			return this.getToken(JavaParser.LBRACK, i);
		}
	}
	public RBRACK(): TerminalNode[];
	public RBRACK(i: number): TerminalNode;
	public RBRACK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.RBRACK);
		} else {
			return this.getToken(JavaParser.RBRACK, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_variableDeclaratorId; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterVariableDeclaratorId) {
			listener.enterVariableDeclaratorId(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitVariableDeclaratorId) {
			listener.exitVariableDeclaratorId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitVariableDeclaratorId) {
			return visitor.visitVariableDeclaratorId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableInitializerContext extends ParserRuleContext {
	public arrayInitializer(): ArrayInitializerContext | undefined {
		return this.tryGetRuleContext(0, ArrayInitializerContext);
	}
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_variableInitializer; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterVariableInitializer) {
			listener.enterVariableInitializer(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitVariableInitializer) {
			listener.exitVariableInitializer(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitVariableInitializer) {
			return visitor.visitVariableInitializer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrayInitializerContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(JavaParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(JavaParser.RBRACE, 0); }
	public variableInitializer(): VariableInitializerContext[];
	public variableInitializer(i: number): VariableInitializerContext;
	public variableInitializer(i?: number): VariableInitializerContext | VariableInitializerContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableInitializerContext);
		} else {
			return this.getRuleContext(i, VariableInitializerContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_arrayInitializer; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterArrayInitializer) {
			listener.enterArrayInitializer(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitArrayInitializer) {
			listener.exitArrayInitializer(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitArrayInitializer) {
			return visitor.visitArrayInitializer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassOrInterfaceTypeContext extends ParserRuleContext {
	public typeIdentifier(): TypeIdentifierContext {
		return this.getRuleContext(0, TypeIdentifierContext);
	}
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
		}
	}
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.DOT);
		} else {
			return this.getToken(JavaParser.DOT, i);
		}
	}
	public typeArguments(): TypeArgumentsContext[];
	public typeArguments(i: number): TypeArgumentsContext;
	public typeArguments(i?: number): TypeArgumentsContext | TypeArgumentsContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeArgumentsContext);
		} else {
			return this.getRuleContext(i, TypeArgumentsContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_classOrInterfaceType; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterClassOrInterfaceType) {
			listener.enterClassOrInterfaceType(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitClassOrInterfaceType) {
			listener.exitClassOrInterfaceType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitClassOrInterfaceType) {
			return visitor.visitClassOrInterfaceType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeArgumentContext extends ParserRuleContext {
	public typeType(): TypeTypeContext | undefined {
		return this.tryGetRuleContext(0, TypeTypeContext);
	}
	public QUESTION(): TerminalNode | undefined { return this.tryGetToken(JavaParser.QUESTION, 0); }
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	public EXTENDS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.EXTENDS, 0); }
	public SUPER(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SUPER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_typeArgument; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterTypeArgument) {
			listener.enterTypeArgument(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitTypeArgument) {
			listener.exitTypeArgument(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitTypeArgument) {
			return visitor.visitTypeArgument(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class QualifiedNameListContext extends ParserRuleContext {
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_qualifiedNameList; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterQualifiedNameList) {
			listener.enterQualifiedNameList(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitQualifiedNameList) {
			listener.exitQualifiedNameList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitQualifiedNameList) {
			return visitor.visitQualifiedNameList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FormalParametersContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(JavaParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(JavaParser.RPAREN, 0); }
	public receiverParameter(): ReceiverParameterContext | undefined {
		return this.tryGetRuleContext(0, ReceiverParameterContext);
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(JavaParser.COMMA, 0); }
	public formalParameterList(): FormalParameterListContext | undefined {
		return this.tryGetRuleContext(0, FormalParameterListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_formalParameters; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterFormalParameters) {
			listener.enterFormalParameters(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitFormalParameters) {
			listener.exitFormalParameters(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitFormalParameters) {
			return visitor.visitFormalParameters(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReceiverParameterContext extends ParserRuleContext {
	public typeType(): TypeTypeContext {
		return this.getRuleContext(0, TypeTypeContext);
	}
	public THIS(): TerminalNode { return this.getToken(JavaParser.THIS, 0); }
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
		}
	}
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.DOT);
		} else {
			return this.getToken(JavaParser.DOT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_receiverParameter; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterReceiverParameter) {
			listener.enterReceiverParameter(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitReceiverParameter) {
			listener.exitReceiverParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitReceiverParameter) {
			return visitor.visitReceiverParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FormalParameterListContext extends ParserRuleContext {
	public formalParameter(): FormalParameterContext[];
	public formalParameter(i: number): FormalParameterContext;
	public formalParameter(i?: number): FormalParameterContext | FormalParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(FormalParameterContext);
		} else {
			return this.getRuleContext(i, FormalParameterContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	public lastFormalParameter(): LastFormalParameterContext | undefined {
		return this.tryGetRuleContext(0, LastFormalParameterContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_formalParameterList; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterFormalParameterList) {
			listener.enterFormalParameterList(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitFormalParameterList) {
			listener.exitFormalParameterList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitFormalParameterList) {
			return visitor.visitFormalParameterList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FormalParameterContext extends ParserRuleContext {
	public typeType(): TypeTypeContext {
		return this.getRuleContext(0, TypeTypeContext);
	}
	public variableDeclaratorId(): VariableDeclaratorIdContext {
		return this.getRuleContext(0, VariableDeclaratorIdContext);
	}
	public variableModifier(): VariableModifierContext[];
	public variableModifier(i: number): VariableModifierContext;
	public variableModifier(i?: number): VariableModifierContext | VariableModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableModifierContext);
		} else {
			return this.getRuleContext(i, VariableModifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_formalParameter; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterFormalParameter) {
			listener.enterFormalParameter(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitFormalParameter) {
			listener.exitFormalParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitFormalParameter) {
			return visitor.visitFormalParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LastFormalParameterContext extends ParserRuleContext {
	public typeType(): TypeTypeContext {
		return this.getRuleContext(0, TypeTypeContext);
	}
	public ELLIPSIS(): TerminalNode { return this.getToken(JavaParser.ELLIPSIS, 0); }
	public variableDeclaratorId(): VariableDeclaratorIdContext {
		return this.getRuleContext(0, VariableDeclaratorIdContext);
	}
	public variableModifier(): VariableModifierContext[];
	public variableModifier(i: number): VariableModifierContext;
	public variableModifier(i?: number): VariableModifierContext | VariableModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableModifierContext);
		} else {
			return this.getRuleContext(i, VariableModifierContext);
		}
	}
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_lastFormalParameter; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterLastFormalParameter) {
			listener.enterLastFormalParameter(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitLastFormalParameter) {
			listener.exitLastFormalParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitLastFormalParameter) {
			return visitor.visitLastFormalParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LambdaLVTIListContext extends ParserRuleContext {
	public lambdaLVTIParameter(): LambdaLVTIParameterContext[];
	public lambdaLVTIParameter(i: number): LambdaLVTIParameterContext;
	public lambdaLVTIParameter(i?: number): LambdaLVTIParameterContext | LambdaLVTIParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LambdaLVTIParameterContext);
		} else {
			return this.getRuleContext(i, LambdaLVTIParameterContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_lambdaLVTIList; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterLambdaLVTIList) {
			listener.enterLambdaLVTIList(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitLambdaLVTIList) {
			listener.exitLambdaLVTIList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitLambdaLVTIList) {
			return visitor.visitLambdaLVTIList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LambdaLVTIParameterContext extends ParserRuleContext {
	public VAR(): TerminalNode { return this.getToken(JavaParser.VAR, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public variableModifier(): VariableModifierContext[];
	public variableModifier(i: number): VariableModifierContext;
	public variableModifier(i?: number): VariableModifierContext | VariableModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableModifierContext);
		} else {
			return this.getRuleContext(i, VariableModifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_lambdaLVTIParameter; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterLambdaLVTIParameter) {
			listener.enterLambdaLVTIParameter(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitLambdaLVTIParameter) {
			listener.exitLambdaLVTIParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitLambdaLVTIParameter) {
			return visitor.visitLambdaLVTIParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class QualifiedNameContext extends ParserRuleContext {
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
		}
	}
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.DOT);
		} else {
			return this.getToken(JavaParser.DOT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_qualifiedName; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterQualifiedName) {
			listener.enterQualifiedName(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitQualifiedName) {
			listener.exitQualifiedName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitQualifiedName) {
			return visitor.visitQualifiedName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LiteralContext extends ParserRuleContext {
	public integerLiteral(): IntegerLiteralContext | undefined {
		return this.tryGetRuleContext(0, IntegerLiteralContext);
	}
	public floatLiteral(): FloatLiteralContext | undefined {
		return this.tryGetRuleContext(0, FloatLiteralContext);
	}
	public CHAR_LITERAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.CHAR_LITERAL, 0); }
	public STRING_LITERAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.STRING_LITERAL, 0); }
	public BOOL_LITERAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.BOOL_LITERAL, 0); }
	public NULL_LITERAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.NULL_LITERAL, 0); }
	public TEXT_BLOCK(): TerminalNode | undefined { return this.tryGetToken(JavaParser.TEXT_BLOCK, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_literal; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterLiteral) {
			listener.enterLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitLiteral) {
			listener.exitLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitLiteral) {
			return visitor.visitLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IntegerLiteralContext extends ParserRuleContext {
	public DECIMAL_LITERAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DECIMAL_LITERAL, 0); }
	public HEX_LITERAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.HEX_LITERAL, 0); }
	public OCT_LITERAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.OCT_LITERAL, 0); }
	public BINARY_LITERAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.BINARY_LITERAL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_integerLiteral; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterIntegerLiteral) {
			listener.enterIntegerLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitIntegerLiteral) {
			listener.exitIntegerLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitIntegerLiteral) {
			return visitor.visitIntegerLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FloatLiteralContext extends ParserRuleContext {
	public FLOAT_LITERAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.FLOAT_LITERAL, 0); }
	public HEX_FLOAT_LITERAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.HEX_FLOAT_LITERAL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_floatLiteral; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterFloatLiteral) {
			listener.enterFloatLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitFloatLiteral) {
			listener.exitFloatLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitFloatLiteral) {
			return visitor.visitFloatLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AltAnnotationQualifiedNameContext extends ParserRuleContext {
	public AT(): TerminalNode { return this.getToken(JavaParser.AT, 0); }
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
		}
	}
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.DOT);
		} else {
			return this.getToken(JavaParser.DOT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_altAnnotationQualifiedName; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterAltAnnotationQualifiedName) {
			listener.enterAltAnnotationQualifiedName(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitAltAnnotationQualifiedName) {
			listener.exitAltAnnotationQualifiedName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitAltAnnotationQualifiedName) {
			return visitor.visitAltAnnotationQualifiedName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationContext extends ParserRuleContext {
	public AT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.AT, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public altAnnotationQualifiedName(): AltAnnotationQualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, AltAnnotationQualifiedNameContext);
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.RPAREN, 0); }
	public elementValuePairs(): ElementValuePairsContext | undefined {
		return this.tryGetRuleContext(0, ElementValuePairsContext);
	}
	public elementValue(): ElementValueContext | undefined {
		return this.tryGetRuleContext(0, ElementValueContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_annotation; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterAnnotation) {
			listener.enterAnnotation(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitAnnotation) {
			listener.exitAnnotation(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitAnnotation) {
			return visitor.visitAnnotation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementValuePairsContext extends ParserRuleContext {
	public elementValuePair(): ElementValuePairContext[];
	public elementValuePair(i: number): ElementValuePairContext;
	public elementValuePair(i?: number): ElementValuePairContext | ElementValuePairContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ElementValuePairContext);
		} else {
			return this.getRuleContext(i, ElementValuePairContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_elementValuePairs; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterElementValuePairs) {
			listener.enterElementValuePairs(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitElementValuePairs) {
			listener.exitElementValuePairs(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitElementValuePairs) {
			return visitor.visitElementValuePairs(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementValuePairContext extends ParserRuleContext {
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public ASSIGN(): TerminalNode { return this.getToken(JavaParser.ASSIGN, 0); }
	public elementValue(): ElementValueContext {
		return this.getRuleContext(0, ElementValueContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_elementValuePair; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterElementValuePair) {
			listener.enterElementValuePair(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitElementValuePair) {
			listener.exitElementValuePair(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitElementValuePair) {
			return visitor.visitElementValuePair(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementValueContext extends ParserRuleContext {
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public annotation(): AnnotationContext | undefined {
		return this.tryGetRuleContext(0, AnnotationContext);
	}
	public elementValueArrayInitializer(): ElementValueArrayInitializerContext | undefined {
		return this.tryGetRuleContext(0, ElementValueArrayInitializerContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_elementValue; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterElementValue) {
			listener.enterElementValue(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitElementValue) {
			listener.exitElementValue(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitElementValue) {
			return visitor.visitElementValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementValueArrayInitializerContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(JavaParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(JavaParser.RBRACE, 0); }
	public elementValue(): ElementValueContext[];
	public elementValue(i: number): ElementValueContext;
	public elementValue(i?: number): ElementValueContext | ElementValueContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ElementValueContext);
		} else {
			return this.getRuleContext(i, ElementValueContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_elementValueArrayInitializer; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterElementValueArrayInitializer) {
			listener.enterElementValueArrayInitializer(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitElementValueArrayInitializer) {
			listener.exitElementValueArrayInitializer(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitElementValueArrayInitializer) {
			return visitor.visitElementValueArrayInitializer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationTypeDeclarationContext extends ParserRuleContext {
	public AT(): TerminalNode { return this.getToken(JavaParser.AT, 0); }
	public INTERFACE(): TerminalNode { return this.getToken(JavaParser.INTERFACE, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public annotationTypeBody(): AnnotationTypeBodyContext {
		return this.getRuleContext(0, AnnotationTypeBodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_annotationTypeDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterAnnotationTypeDeclaration) {
			listener.enterAnnotationTypeDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitAnnotationTypeDeclaration) {
			listener.exitAnnotationTypeDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitAnnotationTypeDeclaration) {
			return visitor.visitAnnotationTypeDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationTypeBodyContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(JavaParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(JavaParser.RBRACE, 0); }
	public annotationTypeElementDeclaration(): AnnotationTypeElementDeclarationContext[];
	public annotationTypeElementDeclaration(i: number): AnnotationTypeElementDeclarationContext;
	public annotationTypeElementDeclaration(i?: number): AnnotationTypeElementDeclarationContext | AnnotationTypeElementDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationTypeElementDeclarationContext);
		} else {
			return this.getRuleContext(i, AnnotationTypeElementDeclarationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_annotationTypeBody; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterAnnotationTypeBody) {
			listener.enterAnnotationTypeBody(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitAnnotationTypeBody) {
			listener.exitAnnotationTypeBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitAnnotationTypeBody) {
			return visitor.visitAnnotationTypeBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationTypeElementDeclarationContext extends ParserRuleContext {
	public annotationTypeElementRest(): AnnotationTypeElementRestContext | undefined {
		return this.tryGetRuleContext(0, AnnotationTypeElementRestContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public SEMI(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_annotationTypeElementDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterAnnotationTypeElementDeclaration) {
			listener.enterAnnotationTypeElementDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitAnnotationTypeElementDeclaration) {
			listener.exitAnnotationTypeElementDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitAnnotationTypeElementDeclaration) {
			return visitor.visitAnnotationTypeElementDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationTypeElementRestContext extends ParserRuleContext {
	public typeType(): TypeTypeContext | undefined {
		return this.tryGetRuleContext(0, TypeTypeContext);
	}
	public annotationMethodOrConstantRest(): AnnotationMethodOrConstantRestContext | undefined {
		return this.tryGetRuleContext(0, AnnotationMethodOrConstantRestContext);
	}
	public SEMI(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SEMI, 0); }
	public classDeclaration(): ClassDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ClassDeclarationContext);
	}
	public interfaceDeclaration(): InterfaceDeclarationContext | undefined {
		return this.tryGetRuleContext(0, InterfaceDeclarationContext);
	}
	public enumDeclaration(): EnumDeclarationContext | undefined {
		return this.tryGetRuleContext(0, EnumDeclarationContext);
	}
	public annotationTypeDeclaration(): AnnotationTypeDeclarationContext | undefined {
		return this.tryGetRuleContext(0, AnnotationTypeDeclarationContext);
	}
	public recordDeclaration(): RecordDeclarationContext | undefined {
		return this.tryGetRuleContext(0, RecordDeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_annotationTypeElementRest; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterAnnotationTypeElementRest) {
			listener.enterAnnotationTypeElementRest(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitAnnotationTypeElementRest) {
			listener.exitAnnotationTypeElementRest(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitAnnotationTypeElementRest) {
			return visitor.visitAnnotationTypeElementRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationMethodOrConstantRestContext extends ParserRuleContext {
	public annotationMethodRest(): AnnotationMethodRestContext | undefined {
		return this.tryGetRuleContext(0, AnnotationMethodRestContext);
	}
	public annotationConstantRest(): AnnotationConstantRestContext | undefined {
		return this.tryGetRuleContext(0, AnnotationConstantRestContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_annotationMethodOrConstantRest; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterAnnotationMethodOrConstantRest) {
			listener.enterAnnotationMethodOrConstantRest(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitAnnotationMethodOrConstantRest) {
			listener.exitAnnotationMethodOrConstantRest(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitAnnotationMethodOrConstantRest) {
			return visitor.visitAnnotationMethodOrConstantRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationMethodRestContext extends ParserRuleContext {
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public LPAREN(): TerminalNode { return this.getToken(JavaParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(JavaParser.RPAREN, 0); }
	public defaultValue(): DefaultValueContext | undefined {
		return this.tryGetRuleContext(0, DefaultValueContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_annotationMethodRest; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterAnnotationMethodRest) {
			listener.enterAnnotationMethodRest(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitAnnotationMethodRest) {
			listener.exitAnnotationMethodRest(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitAnnotationMethodRest) {
			return visitor.visitAnnotationMethodRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationConstantRestContext extends ParserRuleContext {
	public variableDeclarators(): VariableDeclaratorsContext {
		return this.getRuleContext(0, VariableDeclaratorsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_annotationConstantRest; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterAnnotationConstantRest) {
			listener.enterAnnotationConstantRest(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitAnnotationConstantRest) {
			listener.exitAnnotationConstantRest(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitAnnotationConstantRest) {
			return visitor.visitAnnotationConstantRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DefaultValueContext extends ParserRuleContext {
	public DEFAULT(): TerminalNode { return this.getToken(JavaParser.DEFAULT, 0); }
	public elementValue(): ElementValueContext {
		return this.getRuleContext(0, ElementValueContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_defaultValue; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterDefaultValue) {
			listener.enterDefaultValue(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitDefaultValue) {
			listener.exitDefaultValue(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitDefaultValue) {
			return visitor.visitDefaultValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ModuleDeclarationContext extends ParserRuleContext {
	public MODULE(): TerminalNode { return this.getToken(JavaParser.MODULE, 0); }
	public qualifiedName(): QualifiedNameContext {
		return this.getRuleContext(0, QualifiedNameContext);
	}
	public moduleBody(): ModuleBodyContext {
		return this.getRuleContext(0, ModuleBodyContext);
	}
	public OPEN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.OPEN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_moduleDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterModuleDeclaration) {
			listener.enterModuleDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitModuleDeclaration) {
			listener.exitModuleDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitModuleDeclaration) {
			return visitor.visitModuleDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ModuleBodyContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(JavaParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(JavaParser.RBRACE, 0); }
	public moduleDirective(): ModuleDirectiveContext[];
	public moduleDirective(i: number): ModuleDirectiveContext;
	public moduleDirective(i?: number): ModuleDirectiveContext | ModuleDirectiveContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModuleDirectiveContext);
		} else {
			return this.getRuleContext(i, ModuleDirectiveContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_moduleBody; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterModuleBody) {
			listener.enterModuleBody(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitModuleBody) {
			listener.exitModuleBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitModuleBody) {
			return visitor.visitModuleBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ModuleDirectiveContext extends ParserRuleContext {
	public REQUIRES(): TerminalNode | undefined { return this.tryGetToken(JavaParser.REQUIRES, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public SEMI(): TerminalNode { return this.getToken(JavaParser.SEMI, 0); }
	public requiresModifier(): RequiresModifierContext[];
	public requiresModifier(i: number): RequiresModifierContext;
	public requiresModifier(i?: number): RequiresModifierContext | RequiresModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RequiresModifierContext);
		} else {
			return this.getRuleContext(i, RequiresModifierContext);
		}
	}
	public EXPORTS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.EXPORTS, 0); }
	public TO(): TerminalNode | undefined { return this.tryGetToken(JavaParser.TO, 0); }
	public OPENS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.OPENS, 0); }
	public USES(): TerminalNode | undefined { return this.tryGetToken(JavaParser.USES, 0); }
	public PROVIDES(): TerminalNode | undefined { return this.tryGetToken(JavaParser.PROVIDES, 0); }
	public WITH(): TerminalNode | undefined { return this.tryGetToken(JavaParser.WITH, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_moduleDirective; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterModuleDirective) {
			listener.enterModuleDirective(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitModuleDirective) {
			listener.exitModuleDirective(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitModuleDirective) {
			return visitor.visitModuleDirective(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequiresModifierContext extends ParserRuleContext {
	public TRANSITIVE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.TRANSITIVE, 0); }
	public STATIC(): TerminalNode | undefined { return this.tryGetToken(JavaParser.STATIC, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_requiresModifier; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterRequiresModifier) {
			listener.enterRequiresModifier(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitRequiresModifier) {
			listener.exitRequiresModifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitRequiresModifier) {
			return visitor.visitRequiresModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RecordDeclarationContext extends ParserRuleContext {
	public RECORD(): TerminalNode { return this.getToken(JavaParser.RECORD, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public recordHeader(): RecordHeaderContext {
		return this.getRuleContext(0, RecordHeaderContext);
	}
	public recordBody(): RecordBodyContext {
		return this.getRuleContext(0, RecordBodyContext);
	}
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	public IMPLEMENTS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.IMPLEMENTS, 0); }
	public typeList(): TypeListContext | undefined {
		return this.tryGetRuleContext(0, TypeListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_recordDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterRecordDeclaration) {
			listener.enterRecordDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitRecordDeclaration) {
			listener.exitRecordDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitRecordDeclaration) {
			return visitor.visitRecordDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RecordHeaderContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(JavaParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(JavaParser.RPAREN, 0); }
	public recordComponentList(): RecordComponentListContext | undefined {
		return this.tryGetRuleContext(0, RecordComponentListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_recordHeader; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterRecordHeader) {
			listener.enterRecordHeader(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitRecordHeader) {
			listener.exitRecordHeader(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitRecordHeader) {
			return visitor.visitRecordHeader(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RecordComponentListContext extends ParserRuleContext {
	public recordComponent(): RecordComponentContext[];
	public recordComponent(i: number): RecordComponentContext;
	public recordComponent(i?: number): RecordComponentContext | RecordComponentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RecordComponentContext);
		} else {
			return this.getRuleContext(i, RecordComponentContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_recordComponentList; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterRecordComponentList) {
			listener.enterRecordComponentList(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitRecordComponentList) {
			listener.exitRecordComponentList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitRecordComponentList) {
			return visitor.visitRecordComponentList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RecordComponentContext extends ParserRuleContext {
	public typeType(): TypeTypeContext {
		return this.getRuleContext(0, TypeTypeContext);
	}
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_recordComponent; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterRecordComponent) {
			listener.enterRecordComponent(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitRecordComponent) {
			listener.exitRecordComponent(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitRecordComponent) {
			return visitor.visitRecordComponent(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RecordBodyContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(JavaParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(JavaParser.RBRACE, 0); }
	public classBodyDeclaration(): ClassBodyDeclarationContext[];
	public classBodyDeclaration(i: number): ClassBodyDeclarationContext;
	public classBodyDeclaration(i?: number): ClassBodyDeclarationContext | ClassBodyDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassBodyDeclarationContext);
		} else {
			return this.getRuleContext(i, ClassBodyDeclarationContext);
		}
	}
	public compactConstructorDeclaration(): CompactConstructorDeclarationContext[];
	public compactConstructorDeclaration(i: number): CompactConstructorDeclarationContext;
	public compactConstructorDeclaration(i?: number): CompactConstructorDeclarationContext | CompactConstructorDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(CompactConstructorDeclarationContext);
		} else {
			return this.getRuleContext(i, CompactConstructorDeclarationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_recordBody; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterRecordBody) {
			listener.enterRecordBody(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitRecordBody) {
			listener.exitRecordBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitRecordBody) {
			return visitor.visitRecordBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(JavaParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(JavaParser.RBRACE, 0); }
	public blockStatement(): BlockStatementContext[];
	public blockStatement(i: number): BlockStatementContext;
	public blockStatement(i?: number): BlockStatementContext | BlockStatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BlockStatementContext);
		} else {
			return this.getRuleContext(i, BlockStatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_block; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterBlock) {
			listener.enterBlock(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitBlock) {
			listener.exitBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitBlock) {
			return visitor.visitBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockStatementContext extends ParserRuleContext {
	public localVariableDeclaration(): LocalVariableDeclarationContext | undefined {
		return this.tryGetRuleContext(0, LocalVariableDeclarationContext);
	}
	public SEMI(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SEMI, 0); }
	public localTypeDeclaration(): LocalTypeDeclarationContext | undefined {
		return this.tryGetRuleContext(0, LocalTypeDeclarationContext);
	}
	public statement(): StatementContext | undefined {
		return this.tryGetRuleContext(0, StatementContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_blockStatement; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterBlockStatement) {
			listener.enterBlockStatement(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitBlockStatement) {
			listener.exitBlockStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitBlockStatement) {
			return visitor.visitBlockStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LocalVariableDeclarationContext extends ParserRuleContext {
	public VAR(): TerminalNode | undefined { return this.tryGetToken(JavaParser.VAR, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.ASSIGN, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public typeType(): TypeTypeContext | undefined {
		return this.tryGetRuleContext(0, TypeTypeContext);
	}
	public variableDeclarators(): VariableDeclaratorsContext | undefined {
		return this.tryGetRuleContext(0, VariableDeclaratorsContext);
	}
	public variableModifier(): VariableModifierContext[];
	public variableModifier(i: number): VariableModifierContext;
	public variableModifier(i?: number): VariableModifierContext | VariableModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableModifierContext);
		} else {
			return this.getRuleContext(i, VariableModifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_localVariableDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterLocalVariableDeclaration) {
			listener.enterLocalVariableDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitLocalVariableDeclaration) {
			listener.exitLocalVariableDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitLocalVariableDeclaration) {
			return visitor.visitLocalVariableDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(JavaParser.IDENTIFIER, 0); }
	public MODULE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.MODULE, 0); }
	public OPEN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.OPEN, 0); }
	public REQUIRES(): TerminalNode | undefined { return this.tryGetToken(JavaParser.REQUIRES, 0); }
	public EXPORTS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.EXPORTS, 0); }
	public OPENS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.OPENS, 0); }
	public TO(): TerminalNode | undefined { return this.tryGetToken(JavaParser.TO, 0); }
	public USES(): TerminalNode | undefined { return this.tryGetToken(JavaParser.USES, 0); }
	public PROVIDES(): TerminalNode | undefined { return this.tryGetToken(JavaParser.PROVIDES, 0); }
	public WITH(): TerminalNode | undefined { return this.tryGetToken(JavaParser.WITH, 0); }
	public TRANSITIVE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.TRANSITIVE, 0); }
	public YIELD(): TerminalNode | undefined { return this.tryGetToken(JavaParser.YIELD, 0); }
	public SEALED(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SEALED, 0); }
	public PERMITS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.PERMITS, 0); }
	public RECORD(): TerminalNode | undefined { return this.tryGetToken(JavaParser.RECORD, 0); }
	public VAR(): TerminalNode | undefined { return this.tryGetToken(JavaParser.VAR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_identifier; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterIdentifier) {
			listener.enterIdentifier(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitIdentifier) {
			listener.exitIdentifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitIdentifier) {
			return visitor.visitIdentifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeIdentifierContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(JavaParser.IDENTIFIER, 0); }
	public MODULE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.MODULE, 0); }
	public OPEN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.OPEN, 0); }
	public REQUIRES(): TerminalNode | undefined { return this.tryGetToken(JavaParser.REQUIRES, 0); }
	public EXPORTS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.EXPORTS, 0); }
	public OPENS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.OPENS, 0); }
	public TO(): TerminalNode | undefined { return this.tryGetToken(JavaParser.TO, 0); }
	public USES(): TerminalNode | undefined { return this.tryGetToken(JavaParser.USES, 0); }
	public PROVIDES(): TerminalNode | undefined { return this.tryGetToken(JavaParser.PROVIDES, 0); }
	public WITH(): TerminalNode | undefined { return this.tryGetToken(JavaParser.WITH, 0); }
	public TRANSITIVE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.TRANSITIVE, 0); }
	public SEALED(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SEALED, 0); }
	public PERMITS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.PERMITS, 0); }
	public RECORD(): TerminalNode | undefined { return this.tryGetToken(JavaParser.RECORD, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_typeIdentifier; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterTypeIdentifier) {
			listener.enterTypeIdentifier(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitTypeIdentifier) {
			listener.exitTypeIdentifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitTypeIdentifier) {
			return visitor.visitTypeIdentifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LocalTypeDeclarationContext extends ParserRuleContext {
	public classDeclaration(): ClassDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ClassDeclarationContext);
	}
	public interfaceDeclaration(): InterfaceDeclarationContext | undefined {
		return this.tryGetRuleContext(0, InterfaceDeclarationContext);
	}
	public recordDeclaration(): RecordDeclarationContext | undefined {
		return this.tryGetRuleContext(0, RecordDeclarationContext);
	}
	public classOrInterfaceModifier(): ClassOrInterfaceModifierContext[];
	public classOrInterfaceModifier(i: number): ClassOrInterfaceModifierContext;
	public classOrInterfaceModifier(i?: number): ClassOrInterfaceModifierContext | ClassOrInterfaceModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassOrInterfaceModifierContext);
		} else {
			return this.getRuleContext(i, ClassOrInterfaceModifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_localTypeDeclaration; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterLocalTypeDeclaration) {
			listener.enterLocalTypeDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitLocalTypeDeclaration) {
			listener.exitLocalTypeDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitLocalTypeDeclaration) {
			return visitor.visitLocalTypeDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementContext extends ParserRuleContext {
	public _blockLabel!: BlockContext;
	public _statementExpression!: ExpressionContext;
	public _identifierLabel!: IdentifierContext;
	public block(): BlockContext | undefined {
		return this.tryGetRuleContext(0, BlockContext);
	}
	public ASSERT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.ASSERT, 0); }
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public SEMI(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SEMI, 0); }
	public COLON(): TerminalNode | undefined { return this.tryGetToken(JavaParser.COLON, 0); }
	public IF(): TerminalNode | undefined { return this.tryGetToken(JavaParser.IF, 0); }
	public parExpression(): ParExpressionContext | undefined {
		return this.tryGetRuleContext(0, ParExpressionContext);
	}
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	public ELSE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.ELSE, 0); }
	public FOR(): TerminalNode | undefined { return this.tryGetToken(JavaParser.FOR, 0); }
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LPAREN, 0); }
	public forControl(): ForControlContext | undefined {
		return this.tryGetRuleContext(0, ForControlContext);
	}
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.RPAREN, 0); }
	public WHILE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.WHILE, 0); }
	public DO(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DO, 0); }
	public TRY(): TerminalNode | undefined { return this.tryGetToken(JavaParser.TRY, 0); }
	public finallyBlock(): FinallyBlockContext | undefined {
		return this.tryGetRuleContext(0, FinallyBlockContext);
	}
	public catchClause(): CatchClauseContext[];
	public catchClause(i: number): CatchClauseContext;
	public catchClause(i?: number): CatchClauseContext | CatchClauseContext[] {
		if (i === undefined) {
			return this.getRuleContexts(CatchClauseContext);
		} else {
			return this.getRuleContext(i, CatchClauseContext);
		}
	}
	public resourceSpecification(): ResourceSpecificationContext | undefined {
		return this.tryGetRuleContext(0, ResourceSpecificationContext);
	}
	public SWITCH(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SWITCH, 0); }
	public LBRACE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LBRACE, 0); }
	public RBRACE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.RBRACE, 0); }
	public switchBlockStatementGroup(): SwitchBlockStatementGroupContext[];
	public switchBlockStatementGroup(i: number): SwitchBlockStatementGroupContext;
	public switchBlockStatementGroup(i?: number): SwitchBlockStatementGroupContext | SwitchBlockStatementGroupContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SwitchBlockStatementGroupContext);
		} else {
			return this.getRuleContext(i, SwitchBlockStatementGroupContext);
		}
	}
	public switchLabel(): SwitchLabelContext[];
	public switchLabel(i: number): SwitchLabelContext;
	public switchLabel(i?: number): SwitchLabelContext | SwitchLabelContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SwitchLabelContext);
		} else {
			return this.getRuleContext(i, SwitchLabelContext);
		}
	}
	public SYNCHRONIZED(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SYNCHRONIZED, 0); }
	public RETURN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.RETURN, 0); }
	public THROW(): TerminalNode | undefined { return this.tryGetToken(JavaParser.THROW, 0); }
	public BREAK(): TerminalNode | undefined { return this.tryGetToken(JavaParser.BREAK, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public CONTINUE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.CONTINUE, 0); }
	public YIELD(): TerminalNode | undefined { return this.tryGetToken(JavaParser.YIELD, 0); }
	public switchExpression(): SwitchExpressionContext | undefined {
		return this.tryGetRuleContext(0, SwitchExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_statement; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterStatement) {
			listener.enterStatement(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitStatement) {
			listener.exitStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitStatement) {
			return visitor.visitStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CatchClauseContext extends ParserRuleContext {
	public CATCH(): TerminalNode { return this.getToken(JavaParser.CATCH, 0); }
	public LPAREN(): TerminalNode { return this.getToken(JavaParser.LPAREN, 0); }
	public catchType(): CatchTypeContext {
		return this.getRuleContext(0, CatchTypeContext);
	}
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(JavaParser.RPAREN, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public variableModifier(): VariableModifierContext[];
	public variableModifier(i: number): VariableModifierContext;
	public variableModifier(i?: number): VariableModifierContext | VariableModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableModifierContext);
		} else {
			return this.getRuleContext(i, VariableModifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_catchClause; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterCatchClause) {
			listener.enterCatchClause(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitCatchClause) {
			listener.exitCatchClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitCatchClause) {
			return visitor.visitCatchClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CatchTypeContext extends ParserRuleContext {
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public BITOR(): TerminalNode[];
	public BITOR(i: number): TerminalNode;
	public BITOR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.BITOR);
		} else {
			return this.getToken(JavaParser.BITOR, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_catchType; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterCatchType) {
			listener.enterCatchType(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitCatchType) {
			listener.exitCatchType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitCatchType) {
			return visitor.visitCatchType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FinallyBlockContext extends ParserRuleContext {
	public FINALLY(): TerminalNode { return this.getToken(JavaParser.FINALLY, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_finallyBlock; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterFinallyBlock) {
			listener.enterFinallyBlock(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitFinallyBlock) {
			listener.exitFinallyBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitFinallyBlock) {
			return visitor.visitFinallyBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ResourceSpecificationContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(JavaParser.LPAREN, 0); }
	public resources(): ResourcesContext {
		return this.getRuleContext(0, ResourcesContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(JavaParser.RPAREN, 0); }
	public SEMI(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_resourceSpecification; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterResourceSpecification) {
			listener.enterResourceSpecification(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitResourceSpecification) {
			listener.exitResourceSpecification(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitResourceSpecification) {
			return visitor.visitResourceSpecification(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ResourcesContext extends ParserRuleContext {
	public resource(): ResourceContext[];
	public resource(i: number): ResourceContext;
	public resource(i?: number): ResourceContext | ResourceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ResourceContext);
		} else {
			return this.getRuleContext(i, ResourceContext);
		}
	}
	public SEMI(): TerminalNode[];
	public SEMI(i: number): TerminalNode;
	public SEMI(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.SEMI);
		} else {
			return this.getToken(JavaParser.SEMI, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_resources; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterResources) {
			listener.enterResources(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitResources) {
			listener.exitResources(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitResources) {
			return visitor.visitResources(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ResourceContext extends ParserRuleContext {
	public ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.ASSIGN, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public classOrInterfaceType(): ClassOrInterfaceTypeContext | undefined {
		return this.tryGetRuleContext(0, ClassOrInterfaceTypeContext);
	}
	public variableDeclaratorId(): VariableDeclaratorIdContext | undefined {
		return this.tryGetRuleContext(0, VariableDeclaratorIdContext);
	}
	public VAR(): TerminalNode | undefined { return this.tryGetToken(JavaParser.VAR, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public variableModifier(): VariableModifierContext[];
	public variableModifier(i: number): VariableModifierContext;
	public variableModifier(i?: number): VariableModifierContext | VariableModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableModifierContext);
		} else {
			return this.getRuleContext(i, VariableModifierContext);
		}
	}
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_resource; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterResource) {
			listener.enterResource(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitResource) {
			listener.exitResource(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitResource) {
			return visitor.visitResource(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SwitchBlockStatementGroupContext extends ParserRuleContext {
	public switchLabel(): SwitchLabelContext[];
	public switchLabel(i: number): SwitchLabelContext;
	public switchLabel(i?: number): SwitchLabelContext | SwitchLabelContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SwitchLabelContext);
		} else {
			return this.getRuleContext(i, SwitchLabelContext);
		}
	}
	public blockStatement(): BlockStatementContext[];
	public blockStatement(i: number): BlockStatementContext;
	public blockStatement(i?: number): BlockStatementContext | BlockStatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BlockStatementContext);
		} else {
			return this.getRuleContext(i, BlockStatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_switchBlockStatementGroup; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterSwitchBlockStatementGroup) {
			listener.enterSwitchBlockStatementGroup(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitSwitchBlockStatementGroup) {
			listener.exitSwitchBlockStatementGroup(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitSwitchBlockStatementGroup) {
			return visitor.visitSwitchBlockStatementGroup(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SwitchLabelContext extends ParserRuleContext {
	public _constantExpression!: ExpressionContext;
	public _enumConstantName!: Token;
	public _varName!: IdentifierContext;
	public CASE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.CASE, 0); }
	public COLON(): TerminalNode { return this.getToken(JavaParser.COLON, 0); }
	public typeType(): TypeTypeContext | undefined {
		return this.tryGetRuleContext(0, TypeTypeContext);
	}
	public NULL_LITERAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.NULL_LITERAL, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(JavaParser.IDENTIFIER, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(JavaParser.COMMA, 0); }
	public DEFAULT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DEFAULT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_switchLabel; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterSwitchLabel) {
			listener.enterSwitchLabel(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitSwitchLabel) {
			listener.exitSwitchLabel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitSwitchLabel) {
			return visitor.visitSwitchLabel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForControlContext extends ParserRuleContext {
	public _forUpdate!: ExpressionListContext;
	public enhancedForControl(): EnhancedForControlContext | undefined {
		return this.tryGetRuleContext(0, EnhancedForControlContext);
	}
	public SEMI(): TerminalNode[];
	public SEMI(i: number): TerminalNode;
	public SEMI(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.SEMI);
		} else {
			return this.getToken(JavaParser.SEMI, i);
		}
	}
	public forInit(): ForInitContext | undefined {
		return this.tryGetRuleContext(0, ForInitContext);
	}
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public expressionList(): ExpressionListContext | undefined {
		return this.tryGetRuleContext(0, ExpressionListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_forControl; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterForControl) {
			listener.enterForControl(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitForControl) {
			listener.exitForControl(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitForControl) {
			return visitor.visitForControl(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForInitContext extends ParserRuleContext {
	public localVariableDeclaration(): LocalVariableDeclarationContext | undefined {
		return this.tryGetRuleContext(0, LocalVariableDeclarationContext);
	}
	public expressionList(): ExpressionListContext | undefined {
		return this.tryGetRuleContext(0, ExpressionListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_forInit; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterForInit) {
			listener.enterForInit(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitForInit) {
			listener.exitForInit(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitForInit) {
			return visitor.visitForInit(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnhancedForControlContext extends ParserRuleContext {
	public variableDeclaratorId(): VariableDeclaratorIdContext {
		return this.getRuleContext(0, VariableDeclaratorIdContext);
	}
	public COLON(): TerminalNode { return this.getToken(JavaParser.COLON, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public typeType(): TypeTypeContext | undefined {
		return this.tryGetRuleContext(0, TypeTypeContext);
	}
	public VAR(): TerminalNode | undefined { return this.tryGetToken(JavaParser.VAR, 0); }
	public variableModifier(): VariableModifierContext[];
	public variableModifier(i: number): VariableModifierContext;
	public variableModifier(i?: number): VariableModifierContext | VariableModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableModifierContext);
		} else {
			return this.getRuleContext(i, VariableModifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_enhancedForControl; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterEnhancedForControl) {
			listener.enterEnhancedForControl(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitEnhancedForControl) {
			listener.exitEnhancedForControl(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitEnhancedForControl) {
			return visitor.visitEnhancedForControl(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParExpressionContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(JavaParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(JavaParser.RPAREN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_parExpression; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterParExpression) {
			listener.enterParExpression(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitParExpression) {
			listener.exitParExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitParExpression) {
			return visitor.visitParExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionListContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_expressionList; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterExpressionList) {
			listener.enterExpressionList(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitExpressionList) {
			listener.exitExpressionList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitExpressionList) {
			return visitor.visitExpressionList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MethodCallContext extends ParserRuleContext {
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public LPAREN(): TerminalNode { return this.getToken(JavaParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(JavaParser.RPAREN, 0); }
	public expressionList(): ExpressionListContext | undefined {
		return this.tryGetRuleContext(0, ExpressionListContext);
	}
	public THIS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.THIS, 0); }
	public SUPER(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SUPER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_methodCall; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterMethodCall) {
			listener.enterMethodCall(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitMethodCall) {
			listener.exitMethodCall(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitMethodCall) {
			return visitor.visitMethodCall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	public _prefix!: Token;
	public _bop!: Token;
	public _postfix!: Token;
	public primary(): PrimaryContext | undefined {
		return this.tryGetRuleContext(0, PrimaryContext);
	}
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public DOT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DOT, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public methodCall(): MethodCallContext | undefined {
		return this.tryGetRuleContext(0, MethodCallContext);
	}
	public THIS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.THIS, 0); }
	public NEW(): TerminalNode | undefined { return this.tryGetToken(JavaParser.NEW, 0); }
	public innerCreator(): InnerCreatorContext | undefined {
		return this.tryGetRuleContext(0, InnerCreatorContext);
	}
	public SUPER(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SUPER, 0); }
	public superSuffix(): SuperSuffixContext | undefined {
		return this.tryGetRuleContext(0, SuperSuffixContext);
	}
	public explicitGenericInvocation(): ExplicitGenericInvocationContext | undefined {
		return this.tryGetRuleContext(0, ExplicitGenericInvocationContext);
	}
	public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext | undefined {
		return this.tryGetRuleContext(0, NonWildcardTypeArgumentsContext);
	}
	public LBRACK(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LBRACK, 0); }
	public RBRACK(): TerminalNode | undefined { return this.tryGetToken(JavaParser.RBRACK, 0); }
	public creator(): CreatorContext | undefined {
		return this.tryGetRuleContext(0, CreatorContext);
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LPAREN, 0); }
	public typeType(): TypeTypeContext[];
	public typeType(i: number): TypeTypeContext;
	public typeType(i?: number): TypeTypeContext | TypeTypeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeTypeContext);
		} else {
			return this.getRuleContext(i, TypeTypeContext);
		}
	}
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.RPAREN, 0); }
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	public BITAND(): TerminalNode[];
	public BITAND(i: number): TerminalNode;
	public BITAND(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.BITAND);
		} else {
			return this.getToken(JavaParser.BITAND, i);
		}
	}
	public INC(): TerminalNode | undefined { return this.tryGetToken(JavaParser.INC, 0); }
	public DEC(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DEC, 0); }
	public ADD(): TerminalNode | undefined { return this.tryGetToken(JavaParser.ADD, 0); }
	public SUB(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SUB, 0); }
	public TILDE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.TILDE, 0); }
	public BANG(): TerminalNode | undefined { return this.tryGetToken(JavaParser.BANG, 0); }
	public MUL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.MUL, 0); }
	public DIV(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DIV, 0); }
	public MOD(): TerminalNode | undefined { return this.tryGetToken(JavaParser.MOD, 0); }
	public LT(): TerminalNode[];
	public LT(i: number): TerminalNode;
	public LT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.LT);
		} else {
			return this.getToken(JavaParser.LT, i);
		}
	}
	public GT(): TerminalNode[];
	public GT(i: number): TerminalNode;
	public GT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.GT);
		} else {
			return this.getToken(JavaParser.GT, i);
		}
	}
	public LE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LE, 0); }
	public GE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.GE, 0); }
	public INSTANCEOF(): TerminalNode | undefined { return this.tryGetToken(JavaParser.INSTANCEOF, 0); }
	public pattern(): PatternContext | undefined {
		return this.tryGetRuleContext(0, PatternContext);
	}
	public EQUAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.EQUAL, 0); }
	public NOTEQUAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.NOTEQUAL, 0); }
	public CARET(): TerminalNode | undefined { return this.tryGetToken(JavaParser.CARET, 0); }
	public BITOR(): TerminalNode | undefined { return this.tryGetToken(JavaParser.BITOR, 0); }
	public AND(): TerminalNode | undefined { return this.tryGetToken(JavaParser.AND, 0); }
	public OR(): TerminalNode | undefined { return this.tryGetToken(JavaParser.OR, 0); }
	public COLON(): TerminalNode | undefined { return this.tryGetToken(JavaParser.COLON, 0); }
	public QUESTION(): TerminalNode | undefined { return this.tryGetToken(JavaParser.QUESTION, 0); }
	public ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.ASSIGN, 0); }
	public ADD_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.ADD_ASSIGN, 0); }
	public SUB_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SUB_ASSIGN, 0); }
	public MUL_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.MUL_ASSIGN, 0); }
	public DIV_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DIV_ASSIGN, 0); }
	public AND_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.AND_ASSIGN, 0); }
	public OR_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.OR_ASSIGN, 0); }
	public XOR_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.XOR_ASSIGN, 0); }
	public RSHIFT_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.RSHIFT_ASSIGN, 0); }
	public URSHIFT_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.URSHIFT_ASSIGN, 0); }
	public LSHIFT_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LSHIFT_ASSIGN, 0); }
	public MOD_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.MOD_ASSIGN, 0); }
	public lambdaExpression(): LambdaExpressionContext | undefined {
		return this.tryGetRuleContext(0, LambdaExpressionContext);
	}
	public switchExpression(): SwitchExpressionContext | undefined {
		return this.tryGetRuleContext(0, SwitchExpressionContext);
	}
	public COLONCOLON(): TerminalNode | undefined { return this.tryGetToken(JavaParser.COLONCOLON, 0); }
	public typeArguments(): TypeArgumentsContext | undefined {
		return this.tryGetRuleContext(0, TypeArgumentsContext);
	}
	public classType(): ClassTypeContext | undefined {
		return this.tryGetRuleContext(0, ClassTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_expression; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterExpression) {
			listener.enterExpression(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitExpression) {
			listener.exitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PatternContext extends ParserRuleContext {
	public typeType(): TypeTypeContext {
		return this.getRuleContext(0, TypeTypeContext);
	}
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public variableModifier(): VariableModifierContext[];
	public variableModifier(i: number): VariableModifierContext;
	public variableModifier(i?: number): VariableModifierContext | VariableModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableModifierContext);
		} else {
			return this.getRuleContext(i, VariableModifierContext);
		}
	}
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_pattern; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterPattern) {
			listener.enterPattern(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitPattern) {
			listener.exitPattern(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitPattern) {
			return visitor.visitPattern(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LambdaExpressionContext extends ParserRuleContext {
	public lambdaParameters(): LambdaParametersContext {
		return this.getRuleContext(0, LambdaParametersContext);
	}
	public ARROW(): TerminalNode { return this.getToken(JavaParser.ARROW, 0); }
	public lambdaBody(): LambdaBodyContext {
		return this.getRuleContext(0, LambdaBodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_lambdaExpression; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterLambdaExpression) {
			listener.enterLambdaExpression(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitLambdaExpression) {
			listener.exitLambdaExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitLambdaExpression) {
			return visitor.visitLambdaExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LambdaParametersContext extends ParserRuleContext {
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
		}
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.RPAREN, 0); }
	public formalParameterList(): FormalParameterListContext | undefined {
		return this.tryGetRuleContext(0, FormalParameterListContext);
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	public lambdaLVTIList(): LambdaLVTIListContext | undefined {
		return this.tryGetRuleContext(0, LambdaLVTIListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_lambdaParameters; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterLambdaParameters) {
			listener.enterLambdaParameters(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitLambdaParameters) {
			listener.exitLambdaParameters(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitLambdaParameters) {
			return visitor.visitLambdaParameters(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LambdaBodyContext extends ParserRuleContext {
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public block(): BlockContext | undefined {
		return this.tryGetRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_lambdaBody; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterLambdaBody) {
			listener.enterLambdaBody(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitLambdaBody) {
			listener.exitLambdaBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitLambdaBody) {
			return visitor.visitLambdaBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrimaryContext extends ParserRuleContext {
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LPAREN, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.RPAREN, 0); }
	public THIS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.THIS, 0); }
	public SUPER(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SUPER, 0); }
	public literal(): LiteralContext | undefined {
		return this.tryGetRuleContext(0, LiteralContext);
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public typeTypeOrVoid(): TypeTypeOrVoidContext | undefined {
		return this.tryGetRuleContext(0, TypeTypeOrVoidContext);
	}
	public DOT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DOT, 0); }
	public CLASS(): TerminalNode | undefined { return this.tryGetToken(JavaParser.CLASS, 0); }
	public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext | undefined {
		return this.tryGetRuleContext(0, NonWildcardTypeArgumentsContext);
	}
	public explicitGenericInvocationSuffix(): ExplicitGenericInvocationSuffixContext | undefined {
		return this.tryGetRuleContext(0, ExplicitGenericInvocationSuffixContext);
	}
	public arguments(): ArgumentsContext | undefined {
		return this.tryGetRuleContext(0, ArgumentsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_primary; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterPrimary) {
			listener.enterPrimary(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitPrimary) {
			listener.exitPrimary(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitPrimary) {
			return visitor.visitPrimary(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SwitchExpressionContext extends ParserRuleContext {
	public SWITCH(): TerminalNode { return this.getToken(JavaParser.SWITCH, 0); }
	public parExpression(): ParExpressionContext {
		return this.getRuleContext(0, ParExpressionContext);
	}
	public LBRACE(): TerminalNode { return this.getToken(JavaParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(JavaParser.RBRACE, 0); }
	public switchLabeledRule(): SwitchLabeledRuleContext[];
	public switchLabeledRule(i: number): SwitchLabeledRuleContext;
	public switchLabeledRule(i?: number): SwitchLabeledRuleContext | SwitchLabeledRuleContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SwitchLabeledRuleContext);
		} else {
			return this.getRuleContext(i, SwitchLabeledRuleContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_switchExpression; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterSwitchExpression) {
			listener.enterSwitchExpression(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitSwitchExpression) {
			listener.exitSwitchExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitSwitchExpression) {
			return visitor.visitSwitchExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SwitchLabeledRuleContext extends ParserRuleContext {
	public CASE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.CASE, 0); }
	public switchRuleOutcome(): SwitchRuleOutcomeContext {
		return this.getRuleContext(0, SwitchRuleOutcomeContext);
	}
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(JavaParser.ARROW, 0); }
	public COLON(): TerminalNode | undefined { return this.tryGetToken(JavaParser.COLON, 0); }
	public expressionList(): ExpressionListContext | undefined {
		return this.tryGetRuleContext(0, ExpressionListContext);
	}
	public NULL_LITERAL(): TerminalNode | undefined { return this.tryGetToken(JavaParser.NULL_LITERAL, 0); }
	public guardedPattern(): GuardedPatternContext | undefined {
		return this.tryGetRuleContext(0, GuardedPatternContext);
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(JavaParser.COMMA, 0); }
	public DEFAULT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DEFAULT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_switchLabeledRule; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterSwitchLabeledRule) {
			listener.enterSwitchLabeledRule(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitSwitchLabeledRule) {
			listener.exitSwitchLabeledRule(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitSwitchLabeledRule) {
			return visitor.visitSwitchLabeledRule(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GuardedPatternContext extends ParserRuleContext {
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LPAREN, 0); }
	public guardedPattern(): GuardedPatternContext | undefined {
		return this.tryGetRuleContext(0, GuardedPatternContext);
	}
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.RPAREN, 0); }
	public typeType(): TypeTypeContext | undefined {
		return this.tryGetRuleContext(0, TypeTypeContext);
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public variableModifier(): VariableModifierContext[];
	public variableModifier(i: number): VariableModifierContext;
	public variableModifier(i?: number): VariableModifierContext | VariableModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableModifierContext);
		} else {
			return this.getRuleContext(i, VariableModifierContext);
		}
	}
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	public guard(): GuardContext[];
	public guard(i: number): GuardContext;
	public guard(i?: number): GuardContext | GuardContext[] {
		if (i === undefined) {
			return this.getRuleContexts(GuardContext);
		} else {
			return this.getRuleContext(i, GuardContext);
		}
	}
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_guardedPattern; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterGuardedPattern) {
			listener.enterGuardedPattern(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitGuardedPattern) {
			listener.exitGuardedPattern(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitGuardedPattern) {
			return visitor.visitGuardedPattern(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GuardContext extends ParserRuleContext {
	public AND(): TerminalNode | undefined { return this.tryGetToken(JavaParser.AND, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_guard; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterGuard) {
			listener.enterGuard(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitGuard) {
			listener.exitGuard(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitGuard) {
			return visitor.visitGuard(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SwitchRuleOutcomeContext extends ParserRuleContext {
	public block(): BlockContext | undefined {
		return this.tryGetRuleContext(0, BlockContext);
	}
	public blockStatement(): BlockStatementContext[];
	public blockStatement(i: number): BlockStatementContext;
	public blockStatement(i?: number): BlockStatementContext | BlockStatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BlockStatementContext);
		} else {
			return this.getRuleContext(i, BlockStatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_switchRuleOutcome; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterSwitchRuleOutcome) {
			listener.enterSwitchRuleOutcome(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitSwitchRuleOutcome) {
			listener.exitSwitchRuleOutcome(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitSwitchRuleOutcome) {
			return visitor.visitSwitchRuleOutcome(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassTypeContext extends ParserRuleContext {
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public classOrInterfaceType(): ClassOrInterfaceTypeContext | undefined {
		return this.tryGetRuleContext(0, ClassOrInterfaceTypeContext);
	}
	public DOT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DOT, 0); }
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	public typeArguments(): TypeArgumentsContext | undefined {
		return this.tryGetRuleContext(0, TypeArgumentsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_classType; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterClassType) {
			listener.enterClassType(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitClassType) {
			listener.exitClassType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitClassType) {
			return visitor.visitClassType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CreatorContext extends ParserRuleContext {
	public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext | undefined {
		return this.tryGetRuleContext(0, NonWildcardTypeArgumentsContext);
	}
	public createdName(): CreatedNameContext {
		return this.getRuleContext(0, CreatedNameContext);
	}
	public classCreatorRest(): ClassCreatorRestContext | undefined {
		return this.tryGetRuleContext(0, ClassCreatorRestContext);
	}
	public arrayCreatorRest(): ArrayCreatorRestContext | undefined {
		return this.tryGetRuleContext(0, ArrayCreatorRestContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_creator; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterCreator) {
			listener.enterCreator(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitCreator) {
			listener.exitCreator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitCreator) {
			return visitor.visitCreator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CreatedNameContext extends ParserRuleContext {
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
		}
	}
	public typeArgumentsOrDiamond(): TypeArgumentsOrDiamondContext[];
	public typeArgumentsOrDiamond(i: number): TypeArgumentsOrDiamondContext;
	public typeArgumentsOrDiamond(i?: number): TypeArgumentsOrDiamondContext | TypeArgumentsOrDiamondContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeArgumentsOrDiamondContext);
		} else {
			return this.getRuleContext(i, TypeArgumentsOrDiamondContext);
		}
	}
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.DOT);
		} else {
			return this.getToken(JavaParser.DOT, i);
		}
	}
	public primitiveType(): PrimitiveTypeContext | undefined {
		return this.tryGetRuleContext(0, PrimitiveTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_createdName; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterCreatedName) {
			listener.enterCreatedName(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitCreatedName) {
			listener.exitCreatedName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitCreatedName) {
			return visitor.visitCreatedName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InnerCreatorContext extends ParserRuleContext {
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public classCreatorRest(): ClassCreatorRestContext {
		return this.getRuleContext(0, ClassCreatorRestContext);
	}
	public nonWildcardTypeArgumentsOrDiamond(): NonWildcardTypeArgumentsOrDiamondContext | undefined {
		return this.tryGetRuleContext(0, NonWildcardTypeArgumentsOrDiamondContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_innerCreator; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterInnerCreator) {
			listener.enterInnerCreator(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitInnerCreator) {
			listener.exitInnerCreator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitInnerCreator) {
			return visitor.visitInnerCreator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrayCreatorRestContext extends ParserRuleContext {
	public LBRACK(): TerminalNode[];
	public LBRACK(i: number): TerminalNode;
	public LBRACK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.LBRACK);
		} else {
			return this.getToken(JavaParser.LBRACK, i);
		}
	}
	public RBRACK(): TerminalNode[];
	public RBRACK(i: number): TerminalNode;
	public RBRACK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.RBRACK);
		} else {
			return this.getToken(JavaParser.RBRACK, i);
		}
	}
	public arrayInitializer(): ArrayInitializerContext | undefined {
		return this.tryGetRuleContext(0, ArrayInitializerContext);
	}
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_arrayCreatorRest; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterArrayCreatorRest) {
			listener.enterArrayCreatorRest(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitArrayCreatorRest) {
			listener.exitArrayCreatorRest(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitArrayCreatorRest) {
			return visitor.visitArrayCreatorRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassCreatorRestContext extends ParserRuleContext {
	public arguments(): ArgumentsContext {
		return this.getRuleContext(0, ArgumentsContext);
	}
	public classBody(): ClassBodyContext | undefined {
		return this.tryGetRuleContext(0, ClassBodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_classCreatorRest; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterClassCreatorRest) {
			listener.enterClassCreatorRest(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitClassCreatorRest) {
			listener.exitClassCreatorRest(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitClassCreatorRest) {
			return visitor.visitClassCreatorRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExplicitGenericInvocationContext extends ParserRuleContext {
	public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext {
		return this.getRuleContext(0, NonWildcardTypeArgumentsContext);
	}
	public explicitGenericInvocationSuffix(): ExplicitGenericInvocationSuffixContext {
		return this.getRuleContext(0, ExplicitGenericInvocationSuffixContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_explicitGenericInvocation; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterExplicitGenericInvocation) {
			listener.enterExplicitGenericInvocation(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitExplicitGenericInvocation) {
			listener.exitExplicitGenericInvocation(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitExplicitGenericInvocation) {
			return visitor.visitExplicitGenericInvocation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeArgumentsOrDiamondContext extends ParserRuleContext {
	public LT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LT, 0); }
	public GT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.GT, 0); }
	public typeArguments(): TypeArgumentsContext | undefined {
		return this.tryGetRuleContext(0, TypeArgumentsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_typeArgumentsOrDiamond; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterTypeArgumentsOrDiamond) {
			listener.enterTypeArgumentsOrDiamond(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitTypeArgumentsOrDiamond) {
			listener.exitTypeArgumentsOrDiamond(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitTypeArgumentsOrDiamond) {
			return visitor.visitTypeArgumentsOrDiamond(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NonWildcardTypeArgumentsOrDiamondContext extends ParserRuleContext {
	public LT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LT, 0); }
	public GT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.GT, 0); }
	public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext | undefined {
		return this.tryGetRuleContext(0, NonWildcardTypeArgumentsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_nonWildcardTypeArgumentsOrDiamond; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterNonWildcardTypeArgumentsOrDiamond) {
			listener.enterNonWildcardTypeArgumentsOrDiamond(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitNonWildcardTypeArgumentsOrDiamond) {
			listener.exitNonWildcardTypeArgumentsOrDiamond(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitNonWildcardTypeArgumentsOrDiamond) {
			return visitor.visitNonWildcardTypeArgumentsOrDiamond(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NonWildcardTypeArgumentsContext extends ParserRuleContext {
	public LT(): TerminalNode { return this.getToken(JavaParser.LT, 0); }
	public typeList(): TypeListContext {
		return this.getRuleContext(0, TypeListContext);
	}
	public GT(): TerminalNode { return this.getToken(JavaParser.GT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_nonWildcardTypeArguments; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterNonWildcardTypeArguments) {
			listener.enterNonWildcardTypeArguments(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitNonWildcardTypeArguments) {
			listener.exitNonWildcardTypeArguments(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitNonWildcardTypeArguments) {
			return visitor.visitNonWildcardTypeArguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeListContext extends ParserRuleContext {
	public typeType(): TypeTypeContext[];
	public typeType(i: number): TypeTypeContext;
	public typeType(i?: number): TypeTypeContext | TypeTypeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeTypeContext);
		} else {
			return this.getRuleContext(i, TypeTypeContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_typeList; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterTypeList) {
			listener.enterTypeList(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitTypeList) {
			listener.exitTypeList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitTypeList) {
			return visitor.visitTypeList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeTypeContext extends ParserRuleContext {
	public classOrInterfaceType(): ClassOrInterfaceTypeContext | undefined {
		return this.tryGetRuleContext(0, ClassOrInterfaceTypeContext);
	}
	public primitiveType(): PrimitiveTypeContext | undefined {
		return this.tryGetRuleContext(0, PrimitiveTypeContext);
	}
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	public LBRACK(): TerminalNode[];
	public LBRACK(i: number): TerminalNode;
	public LBRACK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.LBRACK);
		} else {
			return this.getToken(JavaParser.LBRACK, i);
		}
	}
	public RBRACK(): TerminalNode[];
	public RBRACK(i: number): TerminalNode;
	public RBRACK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.RBRACK);
		} else {
			return this.getToken(JavaParser.RBRACK, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_typeType; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterTypeType) {
			listener.enterTypeType(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitTypeType) {
			listener.exitTypeType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitTypeType) {
			return visitor.visitTypeType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrimitiveTypeContext extends ParserRuleContext {
	public BOOLEAN(): TerminalNode | undefined { return this.tryGetToken(JavaParser.BOOLEAN, 0); }
	public CHAR(): TerminalNode | undefined { return this.tryGetToken(JavaParser.CHAR, 0); }
	public BYTE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.BYTE, 0); }
	public SHORT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SHORT, 0); }
	public INT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.INT, 0); }
	public LONG(): TerminalNode | undefined { return this.tryGetToken(JavaParser.LONG, 0); }
	public FLOAT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.FLOAT, 0); }
	public DOUBLE(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DOUBLE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_primitiveType; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterPrimitiveType) {
			listener.enterPrimitiveType(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitPrimitiveType) {
			listener.exitPrimitiveType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitPrimitiveType) {
			return visitor.visitPrimitiveType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeArgumentsContext extends ParserRuleContext {
	public LT(): TerminalNode { return this.getToken(JavaParser.LT, 0); }
	public typeArgument(): TypeArgumentContext[];
	public typeArgument(i: number): TypeArgumentContext;
	public typeArgument(i?: number): TypeArgumentContext | TypeArgumentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeArgumentContext);
		} else {
			return this.getRuleContext(i, TypeArgumentContext);
		}
	}
	public GT(): TerminalNode { return this.getToken(JavaParser.GT, 0); }
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JavaParser.COMMA);
		} else {
			return this.getToken(JavaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_typeArguments; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterTypeArguments) {
			listener.enterTypeArguments(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitTypeArguments) {
			listener.exitTypeArguments(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitTypeArguments) {
			return visitor.visitTypeArguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SuperSuffixContext extends ParserRuleContext {
	public arguments(): ArgumentsContext | undefined {
		return this.tryGetRuleContext(0, ArgumentsContext);
	}
	public DOT(): TerminalNode | undefined { return this.tryGetToken(JavaParser.DOT, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public typeArguments(): TypeArgumentsContext | undefined {
		return this.tryGetRuleContext(0, TypeArgumentsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_superSuffix; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterSuperSuffix) {
			listener.enterSuperSuffix(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitSuperSuffix) {
			listener.exitSuperSuffix(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitSuperSuffix) {
			return visitor.visitSuperSuffix(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExplicitGenericInvocationSuffixContext extends ParserRuleContext {
	public SUPER(): TerminalNode | undefined { return this.tryGetToken(JavaParser.SUPER, 0); }
	public superSuffix(): SuperSuffixContext | undefined {
		return this.tryGetRuleContext(0, SuperSuffixContext);
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public arguments(): ArgumentsContext | undefined {
		return this.tryGetRuleContext(0, ArgumentsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_explicitGenericInvocationSuffix; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterExplicitGenericInvocationSuffix) {
			listener.enterExplicitGenericInvocationSuffix(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitExplicitGenericInvocationSuffix) {
			listener.exitExplicitGenericInvocationSuffix(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitExplicitGenericInvocationSuffix) {
			return visitor.visitExplicitGenericInvocationSuffix(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentsContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(JavaParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(JavaParser.RPAREN, 0); }
	public expressionList(): ExpressionListContext | undefined {
		return this.tryGetRuleContext(0, ExpressionListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return JavaParser.RULE_arguments; }
	// @Override
	public enterRule(listener: JavaListener): void {
		if (listener.enterArguments) {
			listener.enterArguments(this);
		}
	}
	// @Override
	public exitRule(listener: JavaListener): void {
		if (listener.exitArguments) {
			listener.exitArguments(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JavaVisitor<Result>): Result {
		if (visitor.visitArguments) {
			return visitor.visitArguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


