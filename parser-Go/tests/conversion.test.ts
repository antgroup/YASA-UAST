import test from 'node:test'
import assert from 'node:assert/strict'
const { Parser } = require('../dist/index.js')

function nodes(value: any, pred: (n: any) => boolean, result: any[] = []): any[] {
  if (!value || typeof value !== 'object') return result
  if (pred(value)) result.push(value)
  for (const [key, child] of Object.entries(value)) {
    if (key !== '_meta' && key !== 'loc') nodes(child, pred, result)
  }
  return result
}
async function project(source: string): Promise<{ parser: any; output: any }> {
  const parser = new Parser()
  await parser.init()
  const output = parser.parseProject([
    { name: '/p/go.mod', content: 'module p\n' },
    { name: '/p/main.go', content: source },
  ], { root: '/p' })
  return { parser, output }
}

test('nested selector indices preserve reads and writes, and generic values', async () => {
  const { parser, output } = await project(`package p
var p struct { m map[string]map[string]int }
var l struct { Name, Value string }
func G[T, U any]() {}
func f() { p.m[l.Name][l.Value] = 1; x := p.m[l.Name][l.Value]; _ = x; _ = G[int,string] }
`)
  assert.deepEqual(parser.lastErrors, [])
  const write = nodes(output, n => n.type === 'AssignmentExpression' && n.right?.value === '1')[0]
  assert.equal(write.left.type, 'MemberAccess')
  assert.equal(write.left.computed, true)
  const read = nodes(output, n => n.type === 'VariableDeclaration' && n.id?.name === 'x')[0]
  assert.equal(read.init.type, 'MemberAccess')
  assert.equal(nodes(read.init, n => n.type === 'Identifier' && n.name === 'Value').length, 1)
  assert.equal(nodes(output, n => n.type === 'MemberAccess' && n.property?.type === 'Sequence').length, 1)
})

test('slice inference does not invent a length for variable or unsupported bounds', async () => {
  for (const slice of ['0x1:0x3', '0_1:0_3', '0b1:0b11', 'lo:hi', ':', '1:hi:4']) {
    const { output } = await project(`package p\nfunc F(lo,hi int) { a := []int{0,1,2,3}; b := a[${slice}]; _ = b }`)
    const b = nodes(output, n => n.type === 'VariableDeclaration' && n.id?.name === 'b')[0]
    assert.equal(b.varType.size.type, 'Noop', slice)
  }
  const { output } = await project('package p\nfunc F(){ a:=[]int{0,1,2,3}; b:=a[1:3]; _=b }')
  assert.equal(nodes(output, n => n.type === 'VariableDeclaration' && n.id?.name === 'b')[0].varType.size.value, '2')
})

test('elided map key synthetic identifier starts at the inherited key type', async () => {
  const { output } = await project('package p\ntype K struct { N int }\nvar x = map[K]bool{\n {N:1}: true,\n}\n')
  const key = nodes(output, n => n.type === 'VariableDeclaration' && n.varType?.name === 'K' && n.id?.name?.startsWith('tmp'))[0]
  assert.equal(key.id.loc.start.line, 3)
  assert.equal(key.id.loc.start.column, 13)
  const sequence = nodes(output, n => n.type === 'Sequence' && n.expressions?.[0] === key)[0]
  assert.deepEqual(sequence.loc, key.id.loc, 'the complete inherited composite expression also needs its range')
})

test('conversion keeps unary dereference outside a parenthesized type call', async () => {
  const { output } = await project('package p\nfunc f(p any){ x := *(*[]string)(p); _=x }')
  const x = nodes(output, n => n.type === 'VariableDeclaration' && n.id?.name === 'x')[0]
  assert.equal(x.init.type, 'DereferenceExpression')
  assert.equal(x.init.argument.type, 'CallExpression')
  assert.equal(x.init.argument.callee.type, 'DereferenceExpression')
  assert.equal(x.init.argument.callee.argument.type, 'ArrayType')
})

test('grouped parameters keep every name and the shared type range', async () => {
  const { output } = await project('package p\nfunc f(a,b,c,d,e,f,g,h,i,j string, timeout int) {}')
  const fn = nodes(output, n => n.type === 'FunctionDefinition')[0]
  assert.equal(fn.parameters.length, 11)
  assert.deepEqual(fn.parameters.map((p: any) => p.id?.name), ['a','b','c','d','e','f','g','h','i','j','timeout'])
  assert.ok(fn.parameters.slice(0,10).every((p: any) => p.varType.name === 'string'))
  assert.deepEqual(fn.parameters[0].loc, fn.parameters[9].loc)
})

test('generic call under dereference strips only call type arguments', async () => {
  const { output } = await project('package p\nfunc f(){ x := *buffer.NewRing[func()](v); _=x }')
  const x = nodes(output, n => n.type === 'VariableDeclaration' && n.id?.name === 'x')[0]
  assert.equal(x.init.argument.callee.computed, false)
  assert.equal(x.init.argument.callee.property.name, 'NewRing')
})

test('valid type declaration at end of file does not require a trailing newline', async () => {
  const parser = new Parser(); await parser.init()
  const output = parser.parseSource('/p/type.go', 'package p\ntype T struct { X int }')
  assert.deepEqual(parser.lastErrors, [])
  const t = nodes(output, n => n.type === 'ClassDefinition')[0]
  assert.equal(t.id.name, 'T')
  assert.deepEqual(t.loc.end, {line:2,column:24})
})

test('declaration lists retain positions on declarations, not on the array container', async () => {
  const { output } = await project('package p\nfunc f(){ switch 1 { case 1: var x int; _=x } }\n')
  assert.equal(nodes(output, n => Array.isArray(n) && Object.prototype.hasOwnProperty.call(n, 'loc')).length, 0)
  assert.ok(nodes(output, n => n.type === 'VariableDeclaration' && n.id?.name === 'x')[0].loc)
})

function compositeSequence(node: any): any {
  const result = nodes(node, (value) =>
    value.type === 'Sequence' &&
    value.expressions?.[0]?.type === 'VariableDeclaration' &&
    value.expressions[0].init?.type === 'NewExpression'
  )[0]
  assert.ok(result, '未找到复合字面量 Sequence')
  return result
}

const EMBEDDED_WITH_FIELD = `package p

import "bufio"

type w struct {
	n int
	*bufio.Writer
}

func f(b *bufio.Writer) w {
	return w{1, b}
}
`

test('embedded *T field: positional composite key is DereferenceExpression', async () => {
  const parser = new Parser()
  await parser.init()
  const out = parser.parseSource('w.go', EMBEDDED_WITH_FIELD)
  const node = out.packageInfo.subs['/'].files['w.go'].node

  const seq = compositeSequence(node)

  const assigns = seq.expressions.filter((e: { type: string }) => e && e.type === 'AssignmentExpression')
  assert.equal(assigns.length, 2, 'w{1, b} 应有 2 个元素赋值')

  // 第 1 个字段 n：key = Identifier "n"
  assert.equal(assigns[0].left.property.type, 'Identifier')
  assert.equal(assigns[0].left.property.name, 'n')

  // 第 2 个字段是嵌入的 *bufio.Writer：key = DereferenceExpression{MemberAccess(bufio, Writer)}
  const key2 = assigns[1].left.property
  assert.equal(key2.type, 'DereferenceExpression')
  assert.equal(key2.argument.type, 'MemberAccess')
  assert.equal(key2.argument.object.type, 'Identifier')
  assert.equal(key2.argument.object.name, 'bufio')
  assert.equal(key2.argument.property.type, 'Identifier')
  assert.equal(key2.argument.property.name, 'Writer')

  // tmp id 的 _meta.type 是具名类型 w 的 Identifier。
  const tmpId = seq.expressions[0].id
  assert.equal(tmpId._meta.type.type, 'Identifier')
  assert.equal(tmpId._meta.type.name, 'w')
})

const SINGLE_EMBEDDED = `package p

type respWriter struct {
	*ResponseWriter
}

func g(w *ResponseWriter) respWriter {
	return respWriter{w}
}
`

test('embedded *T field: single positional element resolves without names shift', async () => {
  const parser = new Parser()
  await parser.init()
  const out = parser.parseSource('r.go', SINGLE_EMBEDDED)
  const node = out.packageInfo.subs['/'].files['r.go'].node

  const seq = compositeSequence(node)
  const assign = seq.expressions.filter((e: { type: string }) => e && e.type === 'AssignmentExpression')[0]
  assert.equal(assign.left.property.type, 'DereferenceExpression')
  assert.equal(assign.left.property.argument.type, 'Identifier')
  assert.equal(assign.left.property.argument.name, 'ResponseWriter')
})

const TYPE_ASSERTIONS = `package p

func f(v any) {
	_ = v.(interface{ M() int })
	_ = v.(func() int)
	_ = v.(*[]int)
}
`

test('_meta.type subtree keeps defaulted Type empty (defaults.Set skips Meta)', async () => {
  const parser = new Parser()
  await parser.init()
  const out = parser.parseSource('m.go', TYPE_ASSERTIONS)
  const node = out.packageInfo.subs['/'].files['m.go'].node

  const casts = nodes(node, (x) => x.type === 'BinaryExpression' && x.operator === 'instanceof')
  assert.equal(casts.length, 3)

  // 1) v.(interface{ M() int })
  const iface = casts[0]
  assert.equal(iface._meta.type.type, 'Sequence')
  assert.equal(iface._meta.type.expressions[0].type, '', 'meta 子树里的 FuncType 应保留空 type')
  assert.equal(iface._meta.type.expressions[0].id.name, 'M')
  // 同一断言可达的 right 字段：FuncType 被 defaults.Set 填成 "FuncType"
  assert.equal(iface.right.type, 'Sequence')
  assert.equal(iface.right.expressions[0].type, 'FuncType')

  // 2) v.(func() int)
  const fn = casts[1]
  assert.equal(fn._meta.type.type, '', 'meta 里的 FuncType 应为空 type')
  assert.equal(fn._meta.type.results[0].type, 'Identifier')
  assert.equal(fn.right.type, 'FuncType')

  // 3) v.(*[]int)：DereferenceExpression.argument 的 ArrayType.size 是 Noop，应为空 type
  const ptr = casts[2]
  assert.equal(ptr._meta.type.type, 'DereferenceExpression')
  assert.equal(ptr._meta.type.argument.type, 'ArrayType')
  assert.equal(ptr._meta.type.argument.element.type, 'Identifier')
  assert.equal(ptr._meta.type.argument.size.type, '', 'meta 子树里的 Noop 应保留空 type')
})

test('parenthesized expression preserves boolean semantics after comments', async () => {
  const parser = new Parser()
  await parser.init()
  const out = parser.parseSource('comment_expr.go', `package p
func F(a, b, c bool) bool {
  return (
    // The comment must not replace the expression.
    /* Another leading comment. */ a || // Keep the right operand.
    b && c)
}
`)
  const cu = Object.values<any>(out.packageInfo.subs['/'].files)[0].node
  const fn = cu.body.find((node: any) => node.type === 'FunctionDefinition' && node.id?.name === 'F')
  const expr = fn.body.body.find((node: any) => node.type === 'ReturnStatement').argument
  assert.deepEqual(
    [expr.type, expr.operator, expr.left.type, expr.left.name],
    ['BinaryExpression', '||', 'Identifier', 'a']
  )
  const { right } = expr
  assert.deepEqual(
    [right.type, right.operator, right.left.type, right.left.name, right.right.type, right.right.name],
    ['BinaryExpression', '&&', 'Identifier', 'b', 'Identifier', 'c']
  )
})
