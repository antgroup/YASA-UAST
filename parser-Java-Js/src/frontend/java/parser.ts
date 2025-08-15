import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts'

import { JavaLexer } from './antlr/JavaLexer'
import { JavaParser } from './antlr/JavaParser'
import * as UAST from '@ant-yasa/uast-spec';
import { ASTBuilder } from './ASTBuilder'
import ErrorListener from './ErrorListener'
import { ParseOptions, Token, TokenizeOptions } from './types'
import { TestBuilder } from "./testBuilder";

interface ParserErrorItem {
    message: string
    line: number
    column: number
}

type ParseResult = UAST.CompileUnit & {
    errors?: any[]
    tokens?: Token[]
}

export class ParserError extends Error {
    public errors: ParserErrorItem[]

    constructor(args: { errors: ParserErrorItem[] }) {
        super()
        const { message, line, column } = args.errors[0]
        this.message = `${message} (${line}:${column})`
        this.errors = args.errors

        if (Error.captureStackTrace !== undefined) {
            Error.captureStackTrace(this, this.constructor)
        } else {
            this.stack = new Error().stack
        }
    }
}

export function parse(
    input: string,
    options: ParseOptions = {}
): ParseResult {
    const inputStream = new ANTLRInputStream(input)
    const lexer = new JavaLexer(inputStream)
    const tokenStream = new CommonTokenStream(lexer)
    const parser = new JavaParser(tokenStream)

    const listener = new ErrorListener()
    lexer.removeErrorListeners()
    lexer.addErrorListener(listener)

    parser.removeErrorListeners()
    parser.addErrorListener(listener)
    parser.buildParseTree = true

    const compilationUnit = parser.compilationUnit()

    // const astBuilder = new TestBuilder(options, options.sourcefile);
    const astBuilder = new ASTBuilder(options, options.sourcefile);

    astBuilder.visit(compilationUnit)

    const ast: ParseResult | null = astBuilder.result as any

    if (ast === null) {
        throw new Error('ast should never be null')
    }

    if (options.tolerant !== true && listener.hasErrors()) {
        throw new ParserError({ errors: listener.getErrors() })
    }
    if (options.tolerant === true && listener.hasErrors()) {
        ast.errors = listener.getErrors()
    }
    return ast
}

function _isASTNode(node: unknown): node is UAST.Node {
    if (typeof node !== 'object' || node === null) {
        return false
    }

    const nodeAsAny: any = node

    if (Object.prototype.hasOwnProperty.call(nodeAsAny, 'type') && typeof nodeAsAny.type === "string") {
        //TODO 这里需要判断type是不是在ast type中
        return true;
    }

    return false;
}

export function visit(node: unknown, visitor: any, nodeParent?: UAST.Node): void {
    if (Array.isArray(node)) {
        node.forEach((child) => visit(child, visitor, nodeParent))
    }

    if (!_isASTNode(node)) return

    let cont = true

    if (visitor[node.type] !== undefined) {
        // TODO can we avoid this `as any`
        cont = visitor[node.type]!(node as any, nodeParent)
    }

    if (cont === false) return

    for (const prop in node) {
        if (Object.prototype.hasOwnProperty.call(node, prop)) {
            // TODO can we avoid this `as any`
            visit((node as any)[prop], visitor, node)
        }
    }

    const selector = (node.type + ':exit')
    if (visitor[selector] !== undefined) {
        // TODO can we avoid this `as any`
        visitor[selector]!(node as any, nodeParent)
    }
}
