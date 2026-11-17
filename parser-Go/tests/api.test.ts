/**
 * 单文件解析入口、输出和错误诊断。
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs'
import * as path from 'node:path'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mod = require('../dist/index.js')
const { Parser, version, LanguageType } = mod

const ROOT = path.join(__dirname, '..')
const SAMPLE = path.join(ROOT, 'examples', 'varDecl.go')

test('api: init / parseSource / parseSourceRaw / parse / lastErrors / version', async () => {
  const parser = new Parser()
  await parser.init()
  const src = fs.readFileSync(SAMPLE, 'utf8')

  const raw = parser.parseSourceRaw('examples/varDecl.go', src)
  assert.equal(typeof raw, 'string')
  const obj = JSON.parse(raw)
  assert.equal(obj.moduleName, '__single_module__')
  assert.equal(obj.goModPath, '')
  assert.equal(obj.numOfGoMod, 0)
  assert.ok(obj.packageInfo && obj.packageInfo.subs)
  const leaf = obj.packageInfo.subs['/']
  assert.ok(leaf)
  assert.equal(leaf.files['examples/varDecl.go'].packageName, '__single__')

  assert.deepStrictEqual(parser.parseSource('examples/varDecl.go', src), JSON.parse(raw))
  assert.deepStrictEqual(parser.parse(src, { sourcefile: 'examples/varDecl.go' }), JSON.parse(raw))

  assert.ok(Array.isArray(parser.lastErrors))
  assert.equal(typeof version, 'string')
  assert.equal(LanguageType.LANG_GO, 'golang')
})

const INVALID_CASES: Record<string, string> = {
  'err-binop-missing-rhs.go': 'package p\n\nfunc f(a int) {\n\tif a = 1 {\n\t}\n}\n',
  'err-if-no-cond.go': 'package p\n\nfunc f() {\n\tif {\n\t}\n}\n',
  'err-selector-dot.go': 'package p\n\nfunc f() {\n\tx := a.\n\t_ = x\n}\n',
  'err-paren.go': 'package p\n\nfunc f() {\n\tx := (1\n\t_ = x\n}\n',
  'err-assign.go': 'package p\n\nfunc f() {\n\t= 1\n}\n',
  'err-call.go': 'package p\n\nfunc f() {\n\tg(,)\n}\n',
  'empty.go': '',
  'whitespace-only.go': '\n\n   \n\n',
  'no-package-func.go': 'func main() {}\n',
  'comment-only.go': '// just a comment\n',
  'top-level-call.go': 'package p\nprintln(42)\n',
  'top-level-short-decl.go': 'package p\nx := 1\n',
  'late-package.go': 'var x = 1\npackage p\n',
  'second-package.go': 'package p\npackage q\n',
  'late-import.go': 'package p\nvar x = 1\nimport "fmt"\n',
}

const VALID_CASES: Record<string, string> = {
  'package-only.go': 'package p\n',
  'comment-package.go': '// Package p is a fixture.\npackage p\n',
  'build-tag.go': '//go:build linux && amd64\n\npackage p\n\nfunc F() {}\n',
  'generics.go':
    'package p\n\ntype Set[T comparable] map[T]struct{}\n\nfunc New[T comparable]() Set[T] { return Set[T]{} }\n',
  'method-iota.go':
    'package p\n\ntype T int\n\nconst (\n\tA T = iota\n\tB\n)\n\nfunc (t T) M() int { return int(t) }\n',
  'range-int.go': 'package p\n\nfunc F() int {\n\ts := 0\n\tfor i := range 10 {\n\t\ts += i\n\t}\n\treturn s\n}\n',
  'range-func.go':
    'package p\n\nfunc F(seq func(func(int) bool)) {\n\tfor x := range seq {\n\t\t_ = x\n\t}\n}\n',
  'builtins.go':
    'package p\n\nfunc F(a, b int, m map[int]int) int {\n\tclear(m)\n\treturn min(a, b) + max(a, b)\n}\n',
  'generic-alias.go': 'package p\n\ntype X[T any] = []T\n',
}

function assertParseError(parser: InstanceType<typeof Parser>, file: string, parse: () => unknown): void {
  assert.throws(parse, (error: Error & { errors?: unknown }) => {
    assert.match(error.message, /uast 解析失败/)
    assert.equal(error.errors, parser.lastErrors)
    assert.equal(parser.lastErrors.length, 1)
    const [diagnostic] = parser.lastErrors
    assert.equal(diagnostic.file, file)
    assert.equal(diagnostic.severity, 'error')
    assert.equal(diagnostic.kind, 'parse_error')
    assert.ok(diagnostic.message.includes(file))
    return true
  })
}

test('api: invalid Go files fail on all single-file entry points with current diagnostics', async () => {
  const parser = new Parser()
  await parser.init()
  for (const [name, content] of Object.entries(INVALID_CASES)) {
    assertParseError(parser, name, () => parser.parseSource(name, content))
  }
  assertParseError(parser, 'raw.go', () => parser.parseSourceRaw('raw.go', INVALID_CASES['err-paren.go']))
  assertParseError(parser, 'alias.go', () => parser.parse(INVALID_CASES['err-paren.go'], { sourcefile: 'alias.go' }))
})

test('api: accepts valid Go files and clears diagnostics on the next request', async () => {
  const parser = new Parser()
  await parser.init()
  assertParseError(parser, 'invalid.go', () => parser.parseSource('invalid.go', INVALID_CASES['err-assign.go']))
  for (const [name, content] of Object.entries(VALID_CASES)) {
    assert.ok(parser.parseSource(name, content).packageInfo, name)
    assert.deepEqual(parser.lastErrors, [])
  }
})

test('api: a caller-supplied prototype name is an ordinary file key', async () => {
  const parser = new Parser()
  await parser.init()
  const out = parser.parseSource('__proto__', 'package p')
  const { files } = out.packageInfo.subs['/']
  assert.deepEqual(Object.keys(files), ['__proto__'])
  assert.equal(files.__proto__.packageName, '__single__')
  assert.equal(Object.getPrototypeOf(files), Object.prototype)
})

test('api: a path containing examples keeps its source location', async () => {
  const parser = new Parser()
  await parser.init()
  const name = '/project/examples/p.go'
  const output = parser.parseSource(name, 'package p\nvar x = 1')
  const node = output.packageInfo.subs['/'].files[name].node
  assert.equal(node.loc.sourcefile, name)
  assert.equal(node.body.find((child: { type: string }) => child.type === 'VariableDeclaration').loc.sourcefile, name)
})
