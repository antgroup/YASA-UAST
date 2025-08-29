import fs from 'fs'
import { assert } from 'chai'
import path from 'path'
import * as parser from '../parser'
import { parse, parseImport, parsePackage, parseClass, parseClassBody, parseInstruction } from './utils'
import * as UAST from '@ant-yasa/uast-spec';
import testCases from './benchmark/benchmark.json';

describe('#parse', function () {
    it('parses test file correctly', function () {
        const testSolPath = path.resolve(__dirname, 'benchmark', 'test.java')
        const content = fs.readFileSync(testSolPath)
        const ast = parser.parse(content.toString(), { sourcefile: testSolPath });
        console.log(JSON.stringify(ast, null, 2));
    })
})

describe('#AST', function () {
    for (const caseName in testCases) {
        if (caseName.startsWith('_test')) {
            const testCase = testCases[caseName];
            it(caseName.substring(5), function () {
                const ast: any = testCase.parse(testCase.test, { sourcefile: '' });
                if (testCase.debug) {
                    console.log(JSON.stringify(stripMeta(ast), null, 2));
                }
                console.log(`===== ${caseName.substring(5)} ========`)
                console.log(UAST.prettyPrint(ast));
                console.log('================================\n');
                assertNodeEqual(ast, testCase.expected);
            })
        }

    }
})



function assertNodeEqual(node, expected) {
    node = stripMeta(node);
    expected = stripMeta(expected);
    assert.deepEqual(node, expected);
}

function stripMeta(node) {
    if (!node) {
        return;
    }
    if (Array.isArray(node)) {
        return node.map(n => stripMeta(n));
    }
    if (node instanceof Object) {
        if (node._meta && Object.keys(node._meta).length === 0) {
            delete node._meta;
        }
        delete node.loc;
        for (const prop in node) {
            stripMeta(node[prop]);
        }
        return node;
    }

    return node;
}

