import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import { spawnSync } from 'node:child_process'
const { Parser } = require('../dist/index.js')
const { Builder } = require('../dist/builder.js')
const loader = require('../dist/loader.js')

const root = '/p'
const goMod = { name: '/p/go.mod', content: 'module p\n' }
const validSource = 'package p'

type Failure = Error & {
  runtimeInvalid?: boolean
  file?: string
  stage?: string
  cleanupErrors?: unknown[]
  errors?: unknown
}

test('project releases each directory before parsing the next, including malformed files', async () => {
  const parser = new Parser()
  await parser.init()
  const parseTree = loader.parseTree
  let created = 0
  let live = 0
  let peak = 0
  loader.parseTree = (...args: unknown[]) => {
    const tree = parseTree(...args)
    created++
    live++
    peak = Math.max(peak, live)
    const dispose = tree.delete.bind(tree)
    tree.delete = () => {
      dispose()
      live--
    }
    return tree
  }
  try {
    const output = parser.parseProject([
      goMod,
      { name: '/p/a/a.go', content: validSource },
      { name: '/p/b/b.go', content: 'package p\nprintln(42)' },
      { name: '/p/c/c.go', content: validSource },
    ], { root })
    assert.deepEqual(Object.keys(output.packageInfo.subs['/'].subs), ['a', 'c'])
    assert.equal(created, 3)
    assert.equal(peak, 1)
    assert.equal(live, 0)
  } finally {
    loader.parseTree = parseTree
  }
})

test('conversion diagnostics preserve the cause, and only runtime traps require initialization', async () => {
  const cases = [
    { failure: new Error('controlled converter error'), invalid: false, kind: 'convert_error' },
    { failure: new WebAssembly.RuntimeError('controlled runtime trap'), invalid: true, kind: 'runtime_error' },
  ]
  for (const { failure, invalid, kind } of cases) {
    const parser = new Parser()
    await parser.init()
    const buildPackageTree = Builder.prototype.buildPackageTree
    Builder.prototype.buildPackageTree = () => { throw failure }
    const name = '/p/failure.go'
    try {
      assert.throws(() => parser.parseSource(name, validSource), (error: Failure) => {
        assert.equal(error, failure)
        assert.equal(error.file, name)
        assert.equal(error.stage, 'convert')
        assert.equal(error.runtimeInvalid, invalid ? true : undefined)
        assert.equal(error.errors, parser.lastErrors)
        return true
      })
      assert.equal(parser.lastErrors.length, 1)
      assert.equal(parser.lastErrors[0].file, name)
      assert.equal(parser.lastErrors[0].severity, 'error')
      assert.equal(parser.lastErrors[0].kind, kind)
    } finally {
      Builder.prototype.buildPackageTree = buildPackageTree
    }

    if (invalid) {
      assert.throws(() => parser.parseSource('/p/needs-init.go', validSource), /未初始化|not initialized/i)
      await parser.init()
    }
    // 普通转换错误不调用 init，直接验证当前运行时仍可用。
    const output = parser.parseSource('/p/recovered.go', validSource)
    assert.ok(output.packageInfo.subs['/'].files['/p/recovered.go'])
    assert.deepEqual(parser.lastErrors, [])
  }
})

test('project stops on the first error and attempts to release every created tree', async () => {
  const parser = new Parser()
  await parser.init()
  const parseTree = loader.parseTree
  const buildPackageTree = Builder.prototype.buildPackageTree
  const first = new Error('controlled conversion failure')
  const cleanupErrors = [new Error('first cleanup failed'), new Error('second cleanup failed')]
  let parsed = 0
  let released = 0
  loader.parseTree = (...args: unknown[]) => {
    const tree = parseTree(...args)
    const cleanupError = cleanupErrors[parsed++]
    const dispose = tree.delete.bind(tree)
    tree.delete = () => {
      dispose()
      released++
      throw cleanupError
    }
    return tree
  }
  Builder.prototype.buildPackageTree = () => { throw first }
  try {
    assert.throws(() => parser.parseProject([
      goMod,
      { name: '/p/a/a.go', content: 'package a' },
      { name: '/p/a/b.go', content: 'package a' },
      { name: '/p/b/c.go', content: 'package b' },
    ], { root }), (error: Failure) => {
      assert.equal(error, first)
      assert.equal(error.stage, 'convert')
      assert.equal(error.runtimeInvalid, true)
      assert.deepEqual(error.cleanupErrors, cleanupErrors)
      assert.equal(error.errors, parser.lastErrors)
      assert.equal(parser.lastErrors[0].kind, 'convert_error')
      return true
    })
    assert.equal(parsed, 2, '后续目录不应继续解析')
    assert.equal(released, 2, '一次清理失败不应跳过其他语法树')
  } finally {
    loader.parseTree = parseTree
    Builder.prototype.buildPackageTree = buildPackageTree
  }
  await parser.init()
  assert.ok(parser.parseSource('/p/ok.go', validSource))
})

test('cleanup failure without a prior error identifies the file and invalidates the runtime', async () => {
  const parser = new Parser()
  await parser.init()
  const parseTree = loader.parseTree
  const failure = new Error('controlled cleanup failure')
  loader.parseTree = (...args: unknown[]) => {
    const tree = parseTree(...args)
    const dispose = tree.delete.bind(tree)
    tree.delete = () => { dispose(); throw failure }
    return tree
  }
  const name = '/p/cleanup.go'
  try {
    assert.throws(() => parser.parseProject([goMod, { name, content: validSource }], { root }), (error: Failure) => {
      assert.equal(error, failure)
      assert.equal(error.runtimeInvalid, true)
      assert.equal(error.file, name)
      assert.equal(error.stage, 'cleanup')
      assert.equal(error.errors, parser.lastErrors)
      return true
    })
    assert.equal(parser.lastErrors[0].kind, 'runtime_error')
    assert.equal(parser.lastErrors[0].file, name)
  } finally {
    loader.parseTree = parseTree
  }
  await parser.init()
})

test('cross-file methods attach once and do not reintroduce shared output objects', async () => {
  const parser = new Parser()
  await parser.init()
  const output = parser.parseProject([
    goMod,
    { name: '/p/a.go', content: 'package p\ntype T struct { X int }\nvar a = T{X:1}\n' },
    { name: '/p/b.go', content: 'package p\nfunc (t T) F(x []int) []int { y:=[]int{1,2}; return y }\n' },
  ], { root })
  assert.deepEqual(parser.lastErrors, [])
  const body = output.packageInfo.subs['/'].files['/p/a.go'].node.body
  const cls = body.find((node: any) => node.type === 'ClassDefinition' && node.id?.name === 'T')
  const methods = cls.body.filter((node: any) => node.type === 'FunctionDefinition' && node.id?.name === 'F')
  assert.equal(methods.length, 1)
  assert.equal(methods[0].loc.sourcefile, '/p/b.go')

  const seen = new Set<object>()
  function check(value: unknown): void {
    if (!value || typeof value !== 'object') return
    assert.ok(!seen.has(value), '返回的 UAST 不应共享可变对象')
    seen.add(value)
    for (const child of Object.values(value)) check(child)
  }
  check(output)
  const decl = body.find((node: any) => node.type === 'VariableDeclaration' && node.id?.name === 'a')
  const metadata = structuredClone(decl.id._meta)
  decl.varType.nodehash = 'mutation'
  assert.deepEqual(decl.id._meta, metadata)
})

test('missing patched grammar is a build failure, not an upstream fallback', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'go-grammar-'))
  try {
    fs.mkdirSync(path.join(dir, 'scripts'))
    const script = path.join(dir, 'scripts/copy-assets.js')
    fs.copyFileSync(path.join(__dirname, '../scripts/copy-assets.js'), script)
    fs.symlinkSync(path.resolve(__dirname, '../node_modules'), path.join(dir, 'node_modules'))
    const result = spawnSync(process.execPath, [script], { encoding: 'utf8' })
    assert.equal(result.error, undefined)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /assets.*tree-sitter-go\.wasm/)
    assert.equal(fs.existsSync(path.join(dir, 'dist/tree-sitter-go.wasm')), false)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
