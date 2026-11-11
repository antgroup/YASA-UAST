import test from 'node:test'
import assert from 'node:assert/strict'
const { Parser } = require('../dist/index.js')

const root = '/fixture'
const goMod = { name: '/fixture/go.mod', content: 'module fixture\n' }
const goodFile = { name: '/fixture/a.go', content: 'package p\nvar X = 1' }

function positionalFields(unit: any, functionName: string): Array<{ name: string; sourcefile: string }> {
  const fn = unit.body.find((node: any) => node.type === 'FunctionDefinition' && node.id?.name === functionName)
  assert.ok(fn, `function ${functionName} not found`)
  const result = fn.body.body.find((node: any) => node.type === 'ReturnStatement')?.argument
  assert.equal(result?.type, 'Sequence')
  return result.expressions
    .filter((node: any) => node.type === 'AssignmentExpression')
    .map((node: any) => {
      const field = node.left.property
      assert.equal(field?.type, 'Identifier')
      return { name: field.name, sourcefile: field.loc.sourcefile }
    })
}

test('project preserves package boundaries and resolves positional fields in another file', async () => {
  const parser = new Parser()
  await parser.init()
  const files = [
    goMod,
    { name: '/fixture/a.go', content: 'package p\ntype Point struct{ X, Y int }\n' },
    { name: '/fixture/b.go', content: 'package p\nfunc Origin() Point { return Point{1, 2} }\n' },
    { name: '/fixture/a_test.go', content: 'package p\nfunc Sample() Point { return Point{3, 4} }\n' },
    {
      name: '/fixture/external_test.go',
      content: 'package p_test\ntype Point struct{ External string }\nfunc Sample() Point { return Point{"ok"} }\n',
    },
    { name: '/fixture/sub/d.go', content: 'package subpkg' },
  ]
  const output = parser.parseProject(files, { root })
  assert.equal(output.moduleName, 'fixture')
  assert.equal(output.goModPath, goMod.name)
  assert.equal(output.numOfGoMod, 1)
  assert.deepEqual(parser.lastErrors, [])

  const pkg = output.packageInfo.subs['/']
  assert.deepEqual(Object.keys(pkg.files).sort(), [
    '/fixture/a.go', '/fixture/a_test.go', '/fixture/b.go', '/fixture/external_test.go',
  ])
  assert.equal(pkg.files['/fixture/a_test.go'].packageName, 'p')
  assert.equal(pkg.files['/fixture/external_test.go'].packageName, 'p_test')
  assert.equal(pkg.subs.sub.files['/fixture/sub/d.go'].packageName, 'subpkg')

  // 字段名没有写在 b.go；只有读取到 a.go 的声明才能得到 X、Y。
  assert.deepEqual(positionalFields(pkg.files['/fixture/b.go'].node, 'Origin'), [
    { name: 'X', sourcefile: '/fixture/a.go' },
    { name: 'Y', sourcefile: '/fixture/a.go' },
  ])
  assert.deepEqual(positionalFields(pkg.files['/fixture/external_test.go'].node, 'Sample'), [
    { name: 'External', sourcefile: '/fixture/external_test.go' },
  ])
  assert.deepEqual(parser.parseProject([...files].reverse(), { root }), output)
})

test('project infers the root and warns when go.mod is missing', async () => {
  const parser = new Parser()
  await parser.init()
  const output = parser.parseProject([goodFile])
  assert.equal(output.packageInfo.subs['/'].files[goodFile.name].packageName, 'p')
  assert.equal(output.moduleName, '__unknown_module__')
  assert.equal(output.goModPath, '')
  assert.equal(output.numOfGoMod, 0)
  assert.deepEqual(
    parser.lastErrors.map(({ file, severity, kind }: any) => ({ file, severity, kind })),
    [{ file: root, severity: 'warning', kind: 'no_gomod' }]
  )
})

test('project skips malformed files while preserving valid files', async () => {
  const parser = new Parser()
  await parser.init()
  const malformed = [
    { name: '/fixture/bad.go', content: 'func f() {}' },
    { name: '/fixture/call.go', content: 'package p\nprintln(42)' },
    { name: '/fixture/empty.go', content: '' },
    { name: '/fixture/late-import.go', content: 'package p\nvar X = 1\nimport "fmt"' },
    { name: '/fixture/late-package.go', content: 'var X = 1\npackage p' },
    { name: '/fixture/second-package.go', content: 'package p\npackage q' },
  ]
  const output = parser.parseProject([goMod, goodFile, ...malformed], { root })
  assert.deepEqual(Object.keys(output.packageInfo.subs['/'].files), [goodFile.name])
  assert.deepEqual(
    parser.lastErrors.map(({ file, severity, kind }: any) => ({ file, severity, kind })),
    malformed.map(({ name: file }) => ({ file, severity: 'error', kind: 'parse_error' }))
  )
})

test('project without any valid Go files fails and the next request recovers', async () => {
  const parser = new Parser()
  await parser.init()
  const badFile = { name: '/fixture/bad.go', content: 'package p\nprintln(42)' }
  for (const files of [[], [goMod], [goMod, badFile]]) {
    assert.throws(() => parser.parseProject(files, { root }), (error: Error & { errors?: unknown }) => {
      assert.match(error.message, /no packages found/)
      assert.equal(error.errors, parser.lastErrors)
      const failed = parser.lastErrors
        .filter((diagnostic: any) => diagnostic.severity === 'error' && diagnostic.kind === 'parse_error')
        .map((diagnostic: any) => diagnostic.file)
      assert.deepEqual(failed, files.includes(badFile) ? [badFile.name, root] : [root])
      assert.equal(parser.lastErrors.some((diagnostic: any) => diagnostic.kind === 'no_gomod'), files.length === 0)
      return true
    })
  }
  const output = parser.parseProject([goMod, goodFile], { root })
  assert.deepEqual(Object.keys(output.packageInfo.subs['/'].files), [goodFile.name])
  assert.deepEqual(parser.lastErrors, [])
})

test('project preserves paths that match inherited JavaScript property names', async () => {
  const parser = new Parser()
  await parser.init()
  const dirs = ['__proto__', 'constructor', 'toString', 'normal']
  const output = parser.parseProject([
    goMod,
    ...dirs.map((dir) => ({ name: `${root}/${dir}/a.go`, content: 'package p' })),
    { name: '/fixture/__proto__/constructor/nested.go', content: 'package nested' },
  ], { root })
  const { subs } = output.packageInfo.subs['/']
  assert.deepEqual(Object.keys(subs).sort(), [...dirs].sort())
  assert.equal(Object.getPrototypeOf(subs), Object.prototype)
  for (const dir of dirs) assert.equal(subs[dir].files[`${root}/${dir}/a.go`].packageName, 'p')
  assert.equal(subs.__proto__.subs.constructor.files['/fixture/__proto__/constructor/nested.go'].packageName, 'nested')
  assert.deepEqual(JSON.parse(JSON.stringify(output)).packageInfo.subs['/'].subs.__proto__, subs.__proto__)
  assert.deepEqual(parser.lastErrors, [])
})

test('project uses native directory DFS to select and count go.mod files', async () => {
  const parser = new Parser()
  await parser.init()
  const files = [
    { name: '/fixture/b/go.mod', content: 'module shallow\n' },
    { name: '/fixture/a-/go.mod', content: 'module sibling\n' },
    { name: '/fixture/a/deep/go.mod', content: 'module earlier/deep\n' },
    { name: '/fixture/vendor/go.mod', content: 'module vendor\n' },
    { name: '/fixture/vendor-copy/go.mod', content: 'module vendor-copy\n' },
    { name: '/other/go.mod', content: 'module outside\n' },
    { name: '/fixture/a/main.go', content: 'package p' },
  ]
  const output = parser.parseProject(files, { root })
  assert.equal(output.moduleName, 'earlier/deep')
  assert.equal(output.goModPath, '/fixture/a/deep/go.mod')
  assert.equal(output.numOfGoMod, 3)
  assert.deepEqual(parser.parseProject([...files].reverse(), { root }), output)

  const hidden = { name: '/fixture/.hidden/go.mod', content: 'module hidden\n' }
  assert.equal(parser.parseProject([...files, hidden], { root }).moduleName, 'hidden')
  const withRoot = parser.parseProject([...files, hidden, goMod], { root })
  assert.equal(withRoot.moduleName, 'fixture')
  assert.equal(withRoot.goModPath, goMod.name)
  assert.equal(withRoot.numOfGoMod, 5)
})
