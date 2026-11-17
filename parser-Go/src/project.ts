/**
 * 项目模式：把一组内存源码文件（.go + go.mod）整理成 package 列表。
 *
 * 沿用原 Go parser 的模块、目录剪枝规则，并独立处理同目录的不同包：
 * - package 路径为 "/"+相对 root 的目录（与 CLI `-rootDir` 一致）；
 * - module 名取原生深度优先顺序中的第一个 go.mod，缺省 __unknown_module__（warning/no_gomod）；
 * - 目录 basename 以 "." 开头的剪枝只在“该目录直接含 .go”时生效；
 * - 含 /vendor 的路径被排除；
 * - 坏文件记 error/parse_error 并跳过，好文件照常构建。
 */
import * as path from 'path'
import type { Node as SyntaxNode } from 'web-tree-sitter'
import { isTopLevelDeclaration } from './builder'
import type { BuildError, FileInput, PackageInput } from './builder'
import { SourceMap } from './loc'
import * as loader from './loader'
import type { OwnedTree } from './loader'

export interface RawSourceFile {
  name: string
  content: string
}

/** 从 go.mod 内容解析 module 名（复刻 moduleNameFromContent）。 */
export function moduleNameFromContent(content: string, source: string): { name: string; error?: string } {
  for (const line of content.split('\n')) {
    if (!line.startsWith('module')) continue
    const fields = line.split(/\s+/).filter((s) => s.length > 0)
    if (fields.length === 2) return { name: fields[1] }
  }
  return { name: '', error: `module directive not found in ${source}` }
}

/** 原生先读当前目录的 go.mod，再按目录名顺序完整搜索每个子树。 */
export function findAllGoMod(root: string, files: RawSourceFile[]): RawSourceFile[] {
  const modules: Array<{ file: RawSourceFile; parts: Buffer[] }> = []
  for (const file of files) {
    if (path.basename(file.name) !== 'go.mod') continue
    const dir = path.dirname(file.name)
    const rel = path.relative(root, dir)
    if (path.isAbsolute(rel) || isParentRef(rel) || containsVendor(dir) || containsVendor(path.sep + rel)) continue
    const parts = rel ? rel.split(path.sep).map((part) => Buffer.from(part)) : []
    modules.push({ file, parts })
  }
  modules.sort((a, b) => {
    const shared = Math.min(a.parts.length, b.parts.length)
    for (let i = 0; i < shared; i++) {
      const order = Buffer.compare(a.parts[i], b.parts[i])
      if (order !== 0) return order
    }
    return a.parts.length - b.parts.length
  })
  return modules.map(({ file }) => file)
}

function isParentRef(rel: string): boolean {
  return rel === '..' || rel.startsWith('..' + path.sep)
}

function commonDir(a: string, b: string): string {
  if (a === b) return a
  const relAB = path.relative(a, b)
  if (!isParentRef(relAB)) return a
  const relBA = path.relative(b, a)
  if (!isParentRef(relBA)) return b
  let cur = a
  for (;;) {
    const parent = path.dirname(cur)
    if (parent === cur) return parent
    cur = parent
    const rel = path.relative(cur, b)
    if (!isParentRef(rel)) return cur
  }
}

/** 各文件名的共同祖先目录（复刻 commonRoot）。 */
export function commonRoot(files: RawSourceFile[]): string {
  if (files.length === 0) return ''
  let root = path.dirname(files[0].name)
  for (const f of files.slice(1)) root = commonDir(root, path.dirname(f.name))
  return root
}

/** 统一路径分隔符后，沿用原生实现的 /vendor 前缀排除规则。 */
function containsVendor(dir: string): boolean {
  return dir.split(path.sep).join('/').includes('/vendor')
}

/**
 * dot 目录剪枝：CLI 只对“直接包含 .go 文件”的 dot 目录 SkipDir；没有直接 .go
 * 文件的 dot 目录会被下钻，其子孙仍参与解析。
 */
function prunedByDotDir(root: string, dir: string, dirHasGo: Set<string>): boolean {
  let cur = dir
  for (;;) {
    const base = path.basename(cur)
    if (base !== '.' && base !== '..' && base.startsWith('.') && dirHasGo.has(cur)) return true
    if (cur === root) return false
    const parent = path.dirname(cur)
    if (parent === cur) return false
    cur = parent
  }
}

/** Tree-sitter 也接受片段；完整 Go 文件必须先有 package，且顶层只允许声明。 */
export function validPackageName(rootNode: SyntaxNode): string | undefined {
  if (rootNode.hasError) return undefined
  const [clause, ...decls] = rootNode.namedChildren.filter((node) => node.type !== 'comment')
  if (clause?.type !== 'package_clause') return undefined
  let allowImport = true
  for (const decl of decls) {
    if (!isTopLevelDeclaration(decl)) return undefined
    if (decl.type === 'import_declaration') {
      if (!allowImport) return undefined
    } else {
      allowImport = false
    }
  }
  return clause.namedChildren.find((node) => node.type === 'package_identifier')?.text
}

/** 先登记树的所有权，再读 CST；即使读取失败，也会释放该树。 */
export function parseFileTree(file: RawSourceFile, trees: OwnedTree[], errs: BuildError[]): {
  rootNode: SyntaxNode
  packageName: string | undefined
} {
  try {
    const tree = loader.parseTree(file.content)
    trees.push({ tree, file: file.name })
    const rootNode = tree.rootNode
    return { rootNode, packageName: validPackageName(rootNode) }
  } catch (cause) {
    throw loader.sourceFailure(cause, file.name, 'parse', errs)
  }
}

/**
 * 按目录和 package 名分组，保留同目录的所有包。每组独立构建，
 * 仍挂载到同一目录树，通过逐文件 packageName 保持包身份。
 */
export function preparePackagesFromSources(
  root: string,
  files: RawSourceFile[],
  errs: BuildError[],
  consume: (packages: PackageInput[]) => void
): void {
  const dirHasGo = new Set<string>()
  for (const f of files) {
    if (f.name.endsWith('.go')) dirHasGo.add(path.dirname(f.name))
  }

  const byDir = new Map<string, RawSourceFile[]>()
  for (const f of files) {
    if (!f.name.endsWith('.go')) continue
    const dir = path.dirname(f.name)
    if (containsVendor(dir)) continue
    if (prunedByDotDir(root, dir, dirHasGo)) continue
    const arr = byDir.get(dir)
    if (arr) arr.push(f)
    else byDir.set(dir, [f])
  }

  // 一个目录内可能有主包与外部测试包；只保留当前目录的 CST。
  for (const dir of [...byDir.keys()].sort()) {
    loader.withTrees(errs, (trees) => {
      const packages: PackageInput[] = []
      const dirFiles = [...byDir.get(dir)!].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
      const groups = new Map<string, FileInput[]>()
      for (const f of dirFiles) {
        const { rootNode, packageName } = parseFileTree(f, trees, errs)
        // 对齐 api.ParsePackage：解析失败的文件记 error 并跳过，不丢弃好文件。
        if (!packageName) {
          errs.push({ file: f.name, message: 'parse error', severity: 'error', kind: 'parse_error' })
          continue
        }
        const fi: FileInput = {
          name: f.name,
          displayPath: f.name,
          rootNode,
          source: new SourceMap(f.content),
        }
        const g = groups.get(packageName)
        if (g) g.push(fi)
        else groups.set(packageName, [fi])
      }
      const pkgNames = [...groups.keys()].sort()
      if (pkgNames.length === 0) return
      const rel = path.relative(root, dir)
      const packageKey = path.join('/', rel)
      if (packageKey.split(path.sep).join('/').startsWith('/vendor')) return
      for (const packageName of pkgNames) {
        packages.push({ packageKey, packageName, files: groups.get(packageName) as FileInput[] })
      }
      consume(packages)
    })
  }
}
