import 'mocha'
import { assert } from 'chai'
import * as parser from '../parser'

function parseClass(source: string): any {
    const ast: any = parser.parse(source, { sourcefile: 'Demo.java' })
    assert.equal(ast.type, 'CompileUnit')
    return ast
}

function findNode(node: any, type: string): any {
    if (!node || typeof node !== 'object') return undefined
    if (node.type === type) return node
    for (const value of Object.values(node)) {
        if (Array.isArray(value)) {
            for (const child of value) {
                const found = findNode(child, type)
                if (found) return found
            }
        } else {
            const found = findNode(value, type)
            if (found) return found
        }
    }
    return undefined
}

describe('Java 21 pattern switch', function () {
    it('解析 when guard 和 case null, default', function () {
        const ast = parseClass(`
            class Demo {
                Object demo(Object value) {
                    return switch (value) {
                        case Long number -> number;
                        case String text when !text.isBlank() -> text;
                        case null, default -> "fallback";
                    };
                }
            }
        `)
        const switchNode = findNode(ast, 'SwitchStatement')
        assert.isOk(switchNode)
        assert.lengthOf(switchNode.cases, 3)
    })

    it('保留旧式 && guard', function () {
        parseClass(`
            class Demo {
                Object demo(Object value) {
                    return switch (value) {
                        case String text && !text.isBlank() -> text;
                        default -> "";
                    };
                }
            }
        `)
    })

    it('when 仍可作为普通标识符', function () {
        parseClass(`
            class Demo {
                String when;
                int length() {
                    return when.length();
                }
            }
        `)
    })
})
