import 'mocha'
import { assert } from 'chai'
import * as parser from '../parser'

/**
 * 嵌套注解解析测试
 * 修复：visitElementValue 中嵌套注解返回 ScopedStatement 导致 UAST 校验失败，整个文件解析失败
 */
describe('nested annotation parsing', function () {

    function parseClass(source: string): any {
        const ast: any = parser.parse(source, { sourcefile: '' })
        assert.isOk(ast)
        assert.equal(ast.type, 'CompileUnit')
        return ast
    }

    function getClassAnnotations(ast: any): any[] {
        // class 可能被 ExportStatement 包裹
        const classNode = ast.body.find((n: any) =>
            n.type === 'ClassDefinition' ||
            (n.type === 'ExportStatement' && n.argument?.type === 'ClassDefinition')
        )
        const classDef = classNode?.type === 'ExportStatement' ? classNode.argument : classNode
        return classDef?._meta?.annotations || []
    }

    it('注解数组中嵌套注解 @Intercepts({@Signature(...)})', function () {
        const code = `
            import java.sql.Statement;
            @Intercepts({
                @Signature(type = Statement.class, method = "update"),
                @Signature(type = Statement.class, method = "query")
            })
            class MyInterceptor {}
        `
        const ast = parseClass(code)
        const annotations = getClassAnnotations(ast)
        assert.isAbove(annotations.length, 0, '应有注解')

        // 找到 Intercepts 注解的 elementValue（ObjectExpression）
        const interceptsAnno = annotations[0]
        assert.equal(interceptsAnno.type, 'ScopedStatement')

        // body[1] 应是 ObjectExpression（数组初始化器）
        const arrayExpr = interceptsAnno.body[1]
        assert.equal(arrayExpr.type, 'ObjectExpression', '注解数组应解析为 ObjectExpression')

        // 每个元素的 value 应是 NewExpression（不是 ScopedStatement）
        for (const prop of arrayExpr.properties) {
            assert.equal(prop.type, 'ObjectProperty')
            assert.equal(prop.value.type, 'NewExpression',
                '嵌套注解应被提取为 NewExpression，而非 ScopedStatement')
        }
    })

    it('注解参数值为嵌套注解 @Foo(bar = @Baz(...))', function () {
        const code = `
            @MapperScan(basePackages = "com.example", sqlSessionFactoryRef = @Qualifier("sqlFactory"))
            class AppConfig {}
        `
        const ast = parseClass(code)
        const annotations = getClassAnnotations(ast)
        assert.isAbove(annotations.length, 0, '应有注解')

        // body[0] = varDecl, body[1] = ScopedStatement (from _visitElementValuePairs)
        const pairsScope = annotations[0].body[1]
        assert.equal(pairsScope.type, 'ScopedStatement')
        const assignments = pairsScope.body.filter((n: any) => n.type === 'AssignmentExpression')

        // 找到 sqlSessionFactoryRef = @Qualifier(...) 的赋值
        const qualifierAssign = assignments.find((a: any) =>
            a.left?.property?.name === 'sqlSessionFactoryRef'
        )
        assert.isOk(qualifierAssign, '应有 sqlSessionFactoryRef 赋值')
        assert.equal(qualifierAssign.right.type, 'NewExpression',
            '嵌套注解参数值应为 NewExpression，而非 ScopedStatement')
    })

    it('单值注解中嵌套注解 @Foo(@Bar)', function () {
        const code = `
            @Foo(@Bar)
            class Baz {}
        `
        const ast = parseClass(code)
        const annotations = getClassAnnotations(ast)
        assert.isAbove(annotations.length, 0, '应有注解')

        // @Bar 无参数，visitAnnotation 返回 varDecl（不是 ScopedStatement）
        // visitElementValue 提取 varDecl.init = NewExpression(@Bar)
        // 但无参数注解走 else 分支直接返回 varDecl，不是 ScopedStatement，不触发修复
        // body[1] 是 varDecl（@Bar 的 var Bar = new Bar()）
        const fooAnno = annotations[0]
        assert.equal(fooAnno.type, 'ScopedStatement')
        const nestedValue = fooAnno.body[1]
        // 无参数注解返回 VariableDeclaration，其 init 是 NewExpression
        assert.equal(nestedValue.type, 'VariableDeclaration')
        assert.equal(nestedValue.init.type, 'NewExpression',
            '无参数嵌套注解的 init 应为 NewExpression')
    })

    it('多层嵌套注解数组 @A({@B({@C})})', function () {
        const code = `
            @Intercepts({
                @Signature(type = Handler.class, method = "update", args = {Statement.class, ResultHandler.class})
            })
            class DeepNested {}
        `
        const ast = parseClass(code)
        // 只要不抛异常就算通过
        assert.isOk(ast, '多层嵌套注解应能正常解析')
    })

    it('无嵌套的普通注解不受影响', function () {
        const code = `
            @Override
            @SuppressWarnings("unchecked")
            @RequestMapping(value = "/api", method = "GET")
            class NormalAnnotation {}
        `
        const ast = parseClass(code)
        const annotations = getClassAnnotations(ast)
        assert.isAbove(annotations.length, 0, '应有注解')
    })
})
