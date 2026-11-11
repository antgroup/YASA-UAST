/// <reference types="emscripten" preserve="true" />

/**
 * @ant-yasa/uast-parser-go —— 纯 JS/TS + tree-sitter 的 Go UAST parser。
 *
 * 只依赖 web-tree-sitter + tree-sitter-go.wasm，不需要 Go 工具链或平台二进制。
 * API 形状与 java/php/wasm 版对齐：init / parse / parseSource / parseSourceRaw /
 * parseProject / lastErrors / version。
 */
import * as path from 'path'
import { Builder } from './builder'
import type { BuildError, FileInput, PackagePathInfo } from './builder'
import * as loader from './loader'
import type { ParseError } from './loader'
import { SourceMap } from './loc'
import {
  commonRoot,
  findAllGoMod,
  moduleNameFromContent,
  parseFileTree,
  preparePackagesFromSources,
} from './project'
import type { RawSourceFile } from './project'

export type { ParseError } from './loader'
export { Builder } from './builder'
export { SourceMap } from './loc'
export type { BuildError } from './builder'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json') as { version?: string }

/** 包版本号（来自 package.json；CI 发布时注入真实版本）。 */
export const version: string = pkg.version ?? '0.0.0'

/** 语言标识，与 java/js/php parser 包对齐（Engine 里 Go 用 'golang'）。 */
export enum LanguageType {
  LANG_GO = 'golang',
  OTHER = 'other',
}

/** {@link Parser.parseProject} 使用的内存源码文件。 */
export interface SourceFile {
  name: string
  content: string
}

/** {@link Parser.parse} 的选项。 */
export interface ParseOptions {
  sourcefile?: string
}

/** {@link Parser.parseProject} 的选项。 */
export interface ParseProjectOptions {
  root?: string
}

function normalizeDisplayPath(name: string): string {
  return name.split(path.sep).join('/')
}

/** 把 Go 源码转换为 UAST；解析前需先异步初始化运行时。 */
export class Parser {
  private lastErrorList: ParseError[] = []

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public constructor(_opts?: Record<string, unknown>) {}

  public async init(): Promise<void> {
    await loader.init()
  }

  public get lastErrors(): ParseError[] {
    return this.lastErrorList
  }

  /** 解析单个内存源码文件，返回两空格缩进的 UAST JSON 字符串。 */
  public parseSourceRaw(name: string, content: string): string {
    this.ensureInit()
    const out = this.buildSingle(name, content)
    return JSON.stringify(out, null, 2)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public parseSource(name: string, content: string): any {
    return JSON.parse(this.parseSourceRaw(name, content))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public parse(content: string, opts?: ParseOptions): any {
    return this.parseSource(opts?.sourcefile ?? '', content)
  }

  /**
   * 完整项目模式：沿用内存输入的 `-rootDir` 语义，保留
   * 目录/包树、go.mod 判定、同包跨文件类型解析、tmpN 连续编号、file-level 错误。
   */
  public parseProject(files: SourceFile[], opts?: ParseProjectOptions): unknown {
    this.ensureInit()
    const raw: RawSourceFile[] = files.map((f) => ({ name: f.name, content: f.content }))
    const errors: BuildError[] = []
    this.lastErrorList = errors

    const root = opts?.root && opts.root !== '' ? opts.root : commonRoot(raw)
    const goMods = findAllGoMod(root, raw)
    const mainModule = goMods[0]

    let moduleName = '__unknown_module__'
    if (!mainModule) {
      errors.push({ file: root, message: 'not found go.mod', severity: 'warning', kind: 'no_gomod' })
    } else {
      const parsed = moduleNameFromContent(mainModule.content, mainModule.name)
      if (parsed.error) {
        errors.push({ file: mainModule.name, message: parsed.error, severity: 'warning', kind: 'no_gomod' })
      }
      moduleName = parsed.name
    }

    let count = 0
    const result: PackagePathInfo = { PathName: '', files: {}, subs: {} }
    preparePackagesFromSources(root, raw, errors, (packages) => {
      // Builder 的声明表持有 CST；每包创建实例，转换结束后不保留这些引用。
      for (const pkg of packages) {
        const builder = new Builder()
        try {
          builder.buildPackageTree(result, pkg)
        } catch (error) {
          throw loader.sourceFailure(error, builder.currentFile || pkg.files[0].name, 'convert', errors)
        }
        errors.push(...builder.errors)
        count++
      }
    })
    if (count === 0) {
      const message = `no packages found under ${root}`
      errors.push({ file: root, message, severity: 'error', kind: 'parse_error' })
      throw Object.assign(new Error(message), { errors })
    }

    return {
      packageInfo: result,
      moduleName,
      goModPath: mainModule?.name ?? '',
      numOfGoMod: goMods.length,
    }
  }

  /** 用独立 Builder 构造单文件结果，沿用原生单文件模式的模块字段。 */
  private buildSingle(name: string, content: string): unknown {
    const errors: ParseError[] = []
    this.lastErrorList = errors
    return loader.withTrees(errors, (trees) => {
      const { rootNode, packageName } = parseFileTree({ name, content }, trees, errors)
      if (!packageName) {
        const message = `uast 解析失败: ${name}: 源码语法不符合完整 Go 文件结构`
        errors.push({ file: name, message, severity: 'error', kind: 'parse_error' })
        throw new Error(message)
      }
      const displayPath = normalizeDisplayPath(name)
      const file: FileInput = {
        name: displayPath,
        displayPath,
        rootNode,
        source: new SourceMap(content),
      }
      const builder = new Builder()
      const result: PackagePathInfo = { PathName: '', files: {}, subs: {} }
      try {
        builder.buildPackageTree(result, {
          packageKey: '__single__',
          packageName: '__single__',
          files: [file],
        })
      } catch (cause) {
        throw loader.sourceFailure(cause, name, 'convert', errors)
      }
      errors.push(...builder.errors)
      return { moduleName: '__single_module__', packageInfo: result, goModPath: '', numOfGoMod: 0 }
    })
  }

  private ensureInit(): void {
    if (!loader.isReady()) {
      throw new Error('Parser 未初始化，请先 await parser.init()')
    }
  }
}

export default Parser
