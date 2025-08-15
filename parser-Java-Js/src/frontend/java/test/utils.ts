import { assert } from 'chai'

import * as parser from '../parser'
import { ParseOptions } from '../types'
import * as UAST from '@ant-yasa/uast-spec';

export function parse(source: string, options: ParseOptions = {}) {
    return parser.parse(source, options);
}

export function parsePackage(source: string, options: ParseOptions = {}) {
    const ast: any = parser.parse(source, options)
    assert.isOk(ast._meta.qualifiedName)
    return ast._meta.qualifiedName
}

export function parseImport(source: string, options: ParseOptions = {}) {
    const ast: any = parser.parse(source, options)
    assert.isOk(ast.body[0])
    return ast.body[0]
}

export function parseClass(source: string, options: ParseOptions = {}) {
    const ast: any = parser.parse(source, options)
    assert.isOk(ast.body[0])
    return ast.body[0]
}

export function parseClassBody(source: string, options = {}): UAST.Instruction[] {
    const classDefinition: UAST.ClassDefinition = parseClass('class Test { ' + source + ' }', options);
    assert.isOk(classDefinition.body);
    return classDefinition.body;
}

export function parseInstruction(source: string, options: ParseOptions = {}): UAST.Instruction {
    const body = parseClassBody(' public void foo(){' + source + ' }', options) as UAST.FunctionDefinition[];
    const instruction = body[0].body;
    assert.isOk(instruction);
    return instruction;
}
