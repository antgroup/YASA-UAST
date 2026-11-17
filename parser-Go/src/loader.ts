/**
 * loader.ts —— web-tree-sitter + tree-sitter-go.wasm 的加载器。
 *
 * 用 path.join(__dirname, ...) 的静态字面量路径加载随包分发的 wasm，兼容 pkg
 * 打包（pkg 的静态分析需要能直接看到字符串字面量）。
 */
import * as fs from 'fs'
import * as path from 'path'
import type { Parser, Tree } from 'web-tree-sitter'
import { createRequire } from 'module'
import { runInThisContext } from 'vm'

/** file-level 诊断项（与 wasm 版 Parser 的 lastErrors 形状对齐）。 */
export interface ParseError {
  file: string
  message: string
  severity: 'warning' | 'error'
  kind: string
}

type FailureStage = 'parse' | 'convert' | 'cleanup'

/** 请求错误的附加信息；不改变最初抛出的 Error 对象。 */
interface ParserFailure extends Error {
  runtimeInvalid?: boolean
  file?: string
  stage?: FailureStage
  cleanupErrors?: Error[]
}

export interface OwnedTree {
  file: string
  tree: Tree
}

// pkg 兼容：静态字符串字面量，构建期会把 dist 下的 wasm 一起打包。
const WASM_CORE = path.join(__dirname, 'web-tree-sitter.wasm')
const WASM_LANG = path.join(__dirname, 'tree-sitter-go.wasm')

let initPromise: Promise<void> | null = null
let tsParser: Parser | null = null

function assertAsset(p: string): void {
  if (!fs.existsSync(p)) {
    throw new Error(`wasm 资产不存在: ${p}（请运行 npm run build / copy-assets）`)
  }
}

/** 幂等地初始化 web-tree-sitter 并加载 Go 语法。 */
export function init(): Promise<void> {
  if (tsParser) return Promise.resolve()
  if (initPromise) return initPromise
  initPromise = (async () => {
    assertAsset(WASM_CORE)
    assertAsset(WASM_LANG)
    // 新的 CommonJS 模块闭包持有独立 Emscripten 状态；失效后不复用模块单例。
    const entry = path.join(__dirname, 'tree-sitter-runtime.cjs')
    const fresh = { exports: {} as typeof import('web-tree-sitter') }
    const factory = runInThisContext(
      '(function(exports,require,module,__filename,__dirname){' + fs.readFileSync(entry, 'utf8') + '\n})',
      { filename: entry }
    )
    factory(fresh.exports, createRequire(entry), fresh, entry, path.dirname(entry))
    const runtime = fresh.exports
    await runtime.Parser.init({ locateFile: () => WASM_CORE })
    const language = await runtime.Language.load(fs.readFileSync(WASM_LANG))
    const parser = new runtime.Parser()
    parser.setLanguage(language)
    tsParser = parser
  })().finally(() => {
    initPromise = null
  })
  return initPromise
}

export function isReady(): boolean {
  return tsParser !== null
}

/** 纯解析：返回 tree-sitter syntax tree。 */
export function parseTree(content: string): Tree {
  const parser = tsParser
  if (!parser) throw new Error('Parser 未初始化，请先 await parser.init()')
  // Go 的 EOF 可触发分号插入。只追加换行，原有节点的起止位置不变。
  const input = content.endsWith('\n') ? content : content + '\n'
  try {
    parser.reset()
    const tree = parser.parse(input)
    if (!tree) throw new Error('tree-sitter parse 返回空')
    return tree
  } catch (cause) {
    // reset/parse 失败后不再复用该 WASM 实例；调用方知道具体的源文件。
    const error = asError(cause)
    invalidateRuntime(error)
    throw error
  }
}

/** 释放调试工具所用的常驻 parser。 */
export function reset(): void {
  const parser = tsParser
  tsParser = null
  parser?.delete()
}

function asError(cause: unknown): ParserFailure {
  return cause instanceof Error ? cause : new Error(String(cause))
}

function invalidateRuntime(error: ParserFailure): void {
  tsParser = null
  error.runtimeInvalid = true
}

/** 为首错记录文件与阶段；普通 JavaScript 转换错误不影响后续调用。 */
export function sourceFailure(cause: unknown, file: string, stage: FailureStage, diagnostics: ParseError[]): Error {
  const error = asError(cause)
  if (error instanceof WebAssembly.RuntimeError && !error.runtimeInvalid) invalidateRuntime(error)
  Object.assign(error, { file, stage })
  const kind = error.runtimeInvalid ? 'runtime_error' : stage === 'convert' ? 'convert_error' : 'parse_error'
  diagnostics.push({ file, message: `${stage}: ${error.message}`, severity: 'error', kind })
  return error
}

/** 处理一个文件或目录后释放所有树；首错仍由原请求抛出。 */
export function withTrees<T>(diagnostics: ParseError[], work: (trees: OwnedTree[]) => T): T {
  const trees: OwnedTree[] = []
  let primary: ParserFailure | undefined
  try {
    return work(trees)
  } catch (cause) {
    primary = asError(cause)
    throw Object.assign(primary, { errors: diagnostics })
  } finally {
    releaseTrees(trees, diagnostics, primary)
  }
}

function releaseTrees(trees: OwnedTree[], diagnostics: ParseError[], primary?: ParserFailure): void {
  const cleanupErrors: Array<{ error: ParserFailure; file: string }> = []
  for (const { tree, file } of trees) {
    try {
      tree.delete()
    } catch (cause) {
      cleanupErrors.push({ error: asError(cause), file })
    }
  }
  const first = cleanupErrors[0]
  if (!first) return
  if (primary) {
    invalidateRuntime(primary)
    primary.cleanupErrors = cleanupErrors.map(({ error }) => error)
    return
  }
  invalidateRuntime(first.error)
  if (cleanupErrors.length > 1) first.error.cleanupErrors = cleanupErrors.slice(1).map(({ error }) => error)
  const error = sourceFailure(first.error, first.file, 'cleanup', diagnostics)
  throw Object.assign(error, { errors: diagnostics })
}
