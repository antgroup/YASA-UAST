/**
 * CST 调试小工具：打印某个 .go 文件的 tree-sitter 节点树，便于对照 visitor 映射。
 *
 * 用法：npx tsx scripts/dump-cst.ts examples/varDecl.go
 *       npx tsx scripts/dump-cst.ts examples/varDecl.go --bytes   # 附带 UTF-16 下标
 */
import { readFileSync } from 'node:fs'
import type { Node as SyntaxNode } from 'web-tree-sitter'
import { init, parseTree, reset } from '../dist/loader.js'

interface Options {
  bytes: boolean
}

function printNode(node: SyntaxNode, indent: string, opts: Options): void {
  const named = node.isNamed ? '' : ' (anon)'
  let line = `${indent}${node.type}${named}`
  if (opts.bytes) line += ` [${node.startIndex},${node.endIndex}]`
  if (node.isMissing) line += ' MISSING'
  if (node.hasError) line += ' ERROR'
  console.log(line)
  for (const child of node.children) {
    printNode(child, indent + '  ', opts)
  }
}

async function main(): Promise<void> {
  const file = process.argv[2]
  if (!file) {
    console.error('用法: npx tsx scripts/dump-cst.ts <file.go> [--bytes]')
    process.exit(1)
  }
  const opts: Options = { bytes: process.argv.includes('--bytes') }

  await init()
  try {
    const tree = parseTree(readFileSync(file, 'utf8'))
    try {
      printNode(tree.rootNode, '', opts)
    } finally {
      tree.delete()
    }
  } finally {
    reset()
  }
}

void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
