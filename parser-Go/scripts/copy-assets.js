'use strict'

// 把运行时需要的 wasm 资产复制到 dist/，使它们随 npm 包分发，
// 并让 loader.ts 能用 __dirname 的静态字面量路径加载（兼容 pkg 打包）。
//
// Go 语法仅使用 assets/ 中的补丁版；缺失时构建失败。
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const dist = path.join(root, 'dist')

const assets = [
  [path.join(root, 'assets', 'tree-sitter-go.wasm'), 'tree-sitter-go.wasm'],
  [require.resolve('web-tree-sitter'), 'tree-sitter-runtime.cjs'],
  [require.resolve('web-tree-sitter/web-tree-sitter.wasm'), 'web-tree-sitter.wasm'],
]

fs.mkdirSync(dist, { recursive: true })
for (const [src, name] of assets) {
  if (!fs.existsSync(src)) {
    throw new Error(`缺少解析器资产: ${src}`)
  }
  fs.copyFileSync(src, path.join(dist, name))
  console.log(`[copy-assets] ${name} <- ${path.relative(root, src)}`)
}
