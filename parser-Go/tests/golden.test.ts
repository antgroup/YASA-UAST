/**
 * golden 测试：遍历 examples/ 下所有 .go，与同名 .go.json 归一化后 deep-equal。
 *
 * 归一化语义从 parser-Go/uast_test.go:115-205 的 normalizeJSONForGoldenCompare
 * 逐行移植：去零 Offset、去 goModPath/numOfGoMod、只含空 ReceiveCls 的 _meta
 * 折叠为 {}、路径截取到 examples/ 起。
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs'
import * as path from 'node:path'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Parser } = require('../dist/index.js')

const ROOT = path.join(__dirname, '..')

function normalizeExamplePath(value: string): string | null {
  if (!value.includes('examples') || !value.endsWith('.go')) return null
  const v = value.replace(/\\/g, '/')
  const i = v.lastIndexOf('examples/')
  if (i >= 0) return v.slice(i)
  return null
}

function isReceiveClsOnlyMeta(v: unknown): boolean {
  if (v === null || typeof v !== 'object' || Array.isArray(v)) return false
  const keys = Object.keys(v as Record<string, unknown>)
  if (keys.length !== 1) return false
  if (!Object.prototype.hasOwnProperty.call(v, 'ReceiveCls')) return false
  const rc = (v as Record<string, unknown>).ReceiveCls
  return rc === '' || rc === null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMapForGolden(m: Record<string, any>): void {
  const keyRenames: Array<[string, string]> = []
  for (const k of Object.keys(m)) {
    const v = m[k]
    if (k === 'Offset') {
      if (typeof v === 'number' && v === 0) delete m[k]
      continue
    }
    if (k === 'goModPath' || k === 'numOfGoMod') {
      delete m[k]
      continue
    }
    if (k === '_meta') {
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        normalizeMapForGolden(v)
        if (isReceiveClsOnlyMeta(v)) m[k] = {}
      }
      continue
    }
    const renamed = normalizeExamplePath(k)
    if (renamed !== null && renamed !== k) keyRenames.push([k, renamed])
    if (typeof v === 'string') {
      const nv = normalizeExamplePath(v)
      if (nv !== null) m[k] = nv
    } else if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      normalizeMapForGolden(v)
    } else if (Array.isArray(v)) {
      for (const e of v) {
        if (e !== null && typeof e === 'object' && !Array.isArray(e)) normalizeMapForGolden(e)
      }
    }
  }
  for (const [oldK, newK] of keyRenames) {
    m[newK] = m[oldK]
    delete m[oldK]
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeJSONForGoldenCompare(jsonStr: string): any {
  const m = JSON.parse(jsonStr)
  normalizeMapForGolden(m)
  return m
}

function listExamples(dir: string): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...listExamples(full))
    else if (entry.name.endsWith('.go')) out.push(full)
  }
  return out.sort()
}

test('golden: npm 包对 examples/**/*.go.json 归一化后 deep-equal', async () => {
  const parser = new Parser()
  await parser.init()

  const goFiles = listExamples(path.join(ROOT, 'examples'))
  assert.ok(goFiles.length >= 60, `examples 用例过少: ${goFiles.length}`)

  const failures: Array<{ rel: string; detail: string }> = []
  let passed = 0
  let total = 0

  for (const abs of goFiles) {
    const rel = path.relative(ROOT, abs).split(path.sep).join('/')
    const goldenPath = abs + '.json'
    total++
    if (!fs.existsSync(goldenPath)) {
      failures.push({ rel, detail: 'golden .go.json 不存在' })
      continue
    }
    try {
      const actualRaw = parser.parseSourceRaw(rel, fs.readFileSync(abs, 'utf8'))
      const actual = normalizeJSONForGoldenCompare(actualRaw)
      const expected = normalizeJSONForGoldenCompare(fs.readFileSync(goldenPath, 'utf8'))
      assert.deepStrictEqual(actual, expected)
      passed++
    } catch (e) {
      failures.push({ rel, detail: e instanceof Error ? e.message : String(e) })
    }
  }

  console.log(`[golden] passed=${passed} failed=${failures.length} total=${total}`)
  if (failures.length > 0) {
    const lines = failures.map((f) => `  - ${f.rel}\n    ${f.detail}`)
    assert.fail(`${failures.length}/${total} 个 golden 不匹配:\n${lines.join('\n')}`)
  }
})
