/**
 * Go 作用域与短变量声明回归。
 *
 * 断言以 Go 官方对象绑定语义为准：`:=` 只看当前作用域；if/for/switch/type-switch/
 * case/select clause 各自是隐式块；函数形参、receiver、具名返回值属于函数体块作用域。
 */
import test from 'node:test'
import assert from 'node:assert/strict'
const { Parser } = require('../dist/index.js')

async function buildFunctionBody(src: string, funcName: string): Promise<any[]> {
  const parser = new Parser()
  await parser.init()
  const out: any = parser.parseSource('scope_fixture.go', src)
  const files = out.packageInfo.subs['/'].files
  const cu = Object.values<any>(files)[0].node
  const fd = cu.body.find((x: any) => x.type === 'FunctionDefinition' && x.id?.name === funcName)
  assert.ok(fd, `function ${funcName} not found`)
  assert.equal(fd.body.type, 'ScopedStatement')
  return fd.body.body
}

function asType(node: any, type: string): any {
  assert.ok(node, 'node is nil')
  assert.equal(node.type, type)
  return node
}

function varName(node: any): string {
  assert.equal(node.type, 'VariableDeclaration')
  assert.equal(node.id?.type, 'Identifier')
  return node.id.name
}

function identName(node: any): string {
  assert.equal(node.type, 'Identifier')
  return node.name
}

test('TS scope: if-init declares and does not leak', async () => {
  const src = `package p

func g() int { return 1 }

func F() {
	if v := g(); v != 0 {
		_ = v
	}
	v := 1
	_ = v
}
`
  const body = await buildFunctionBody(src, 'F')
  const initScope = asType(body[0], 'ScopedStatement')
  assert.equal(varName(initScope.body[0]), 'v')
  asType(initScope.body[1], 'IfStatement')
  assert.equal(varName(body[1]), 'v')
})

test('TS scope: switch case isolation', async () => {
  const src = `package p

func F(k int) {
	switch k {
	case 1:
		s := 1
		_ = s
	case 2:
		s := 2
		_ = s
	}
}
`
  const body = await buildFunctionBody(src, 'F')
  const sw = asType(body[0], 'SwitchStatement')
  assert.equal(sw.cases.length, 2)
  for (const c of sw.cases) {
    const clauseBody = asType(c.body, 'ScopedStatement')
    assert.equal(varName(clauseBody.body[0]), 's')
  }
})

test('TS scope: type switch guard and case isolation', async () => {
  const src = `package p

func F(x any) {
	switch v := x.(type) {
	case int:
		a := 1
		_ = a
	default:
		a := 2
		_ = a
	}
}
`
  const body = await buildFunctionBody(src, 'F')
  const sw = asType(body[0], 'SwitchStatement')
  assert.equal(varName(sw.discriminant.expressions[0]), 'v')
  assert.equal(sw.cases.length, 2)
  for (const c of sw.cases) {
    const clauseBody = asType(c.body, 'ScopedStatement')
    assert.equal(varName(clauseBody.body[0]), 'a')
  }
})

test('TS scope: mixed short var uses current scope (param reassigned)', async () => {
  const src = `package p

func F(y int) {
	y, x := 1, 2
	y, z := 3, 4
	_, _, _ = y, x, z
}
`
  const body = await buildFunctionBody(src, 'F')
  const a0 = asType(body[0], 'AssignmentExpression')
  assert.equal(identName(a0.left), 'y')
  assert.equal(a0.operator, '=')
  assert.equal(varName(body[1]), 'x')
  const a2 = asType(body[2], 'AssignmentExpression')
  assert.equal(identName(a2.left), 'y')
  assert.equal(varName(body[3]), 'z')
})

test('TS scope: multi-return tuple registers names', async () => {
  const src = `package p

func g() (int, int) { return 1, 2 }

func F() {
	a, b := g()
	a, c := 1, 2
	_, _, _ = a, b, c
}
`
  const body = await buildFunctionBody(src, 'F')
  const vd0 = asType(body[0], 'VariableDeclaration')
  const tuple = asType(vd0.id, 'TupleExpression')
  assert.equal(tuple.elements.length, 2)
  assert.equal(identName(tuple.elements[0]), 'a')
  assert.equal(identName(tuple.elements[1]), 'b')
  const a1 = asType(body[1], 'AssignmentExpression')
  assert.equal(identName(a1.left), 'a')
  assert.equal(varName(body[2]), 'c')
})

test('TS scope: outer shadowing in block/if/for', async () => {
  const src = `package p

func F() {
	x := 1
	{
		x := 2
		_ = x
	}
	if x := 3; x > 0 {
		_ = x
	}
	for x := 0; x < 1; x++ {
		_ = x
	}
	_ = x
}
`
  const body = await buildFunctionBody(src, 'F')
  assert.equal(varName(body[0]), 'x')
  const block = asType(body[1], 'ScopedStatement')
  assert.equal(varName(block.body[0]), 'x')
  const ifScope = asType(body[2], 'ScopedStatement')
  assert.equal(varName(ifScope.body[0]), 'x')
  const fs = asType(body[3], 'ForStatement')
  assert.equal(varName(fs.init), 'x')
})

test('TS scope: select comm case isolation', async () => {
  const src = `package p

func F(c chan int) {
	select {
	case x := <-c:
		_ = x
	case x := <-c:
		_ = x
	}
}
`
  const body = await buildFunctionBody(src, 'F')
  const selectBody = asType(body[0], 'ScopedStatement')
  assert.equal(selectBody.body.length, 2)
  for (const clause of selectBody.body) {
    const clauseBody = asType(clause, 'ScopedStatement')
    assert.equal(varName(clauseBody.body[0]), 'x')
  }
})

test('TS scope: named result stays in function body scope', async () => {
  const src = `package p

func g() error { return nil }

func F() (err error) {
	err, x := g(), 1
	_, _ = err, x
	return
}
`
  const body = await buildFunctionBody(src, 'F')
  assert.equal(varName(body[0]), 'err')
  const a1 = asType(body[1], 'AssignmentExpression')
  assert.equal(identName(a1.left), 'err')
  assert.equal(a1.operator, '=')
  assert.equal(varName(body[2]), 'x')
})

// 已声明变量的类型来源不能被混合短声明覆盖。
test('TS scope: mixed short declaration preserves original typed binding', async () => {
  const body = await buildFunctionBody(`package p
type Count int
func F() {
  var x Count
  x, y := Count(1), 2
  z := x
  _, _, _ = x, y, z
}
`, 'F')
  const z = asType(body.find((node) => node.type === 'VariableDeclaration' && node.id?.name === 'z'), 'VariableDeclaration')
  assert.equal(z.varType.type, 'Identifier')
  assert.equal(z.varType.name, 'Count')
})

async function parseProject(source: string): Promise<any> {
  const parser = new Parser()
  await parser.init()
  const output = parser.parseProject([
    { name: '/p/go.mod', content: 'module p\n' },
    { name: '/p/main.go', content: source },
  ], { root: '/p' })
  assert.deepEqual(parser.lastErrors, [])
  return output.packageInfo.subs['/'].files['/p/main.go'].node
}

function findDeclaration(value: any, name: string, initName?: string): any {
  if (!value || typeof value !== 'object') return undefined
  if (value.type === 'VariableDeclaration' && value.id?.name === name &&
    (initName === undefined || value.init?.name === initName)) return value
  for (const [key, child] of Object.entries(value)) {
    if (key === '_meta' || key === 'loc') continue
    const declaration = findDeclaration(child, name, initName)
    if (declaration) return declaration
  }
  return undefined
}

test('parameters, named returns, receivers and closure parameters hide globals', async () => {
  const cases = [
    'func F(x int) { y := x; _ = y }',
    'func F() (x int) { y := x; _ = y; return }',
    'type T int\nfunc (x T) F() { y := x; _ = y }',
    'func F() { f := func(x int) { y := x; _ = y }; _ = f }',
  ]
  for (const body of cases) {
    const output = await parseProject(`package p\nvar x string\n${body}\n`)
    const y = findDeclaration(output, 'y')
    assert.ok(y, body)
    assert.equal(y.varType.type, 'DynamicType', body)
    assert.equal(y.id._meta.type.type, 'DynamicType', body)
  }
})

test('range declaration blocks lookup of a same-name package variable', async () => {
  const output = await parseProject('package p\nvar claim = makeClaim()\nfunc f(claims []int){ for _, claim := range claims { claim := claim; _=claim } }')
  const local = findDeclaration(output, 'claim', 'claim')
  assert.ok(local)
  assert.equal(local.varType.type, 'DynamicType')
})
