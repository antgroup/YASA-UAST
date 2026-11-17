# @ant-yasa/uast-parser-go

在 Node.js 18+ 中把 Go 源码解析成 UAST（统一语法树）。npm 包随附 Tree-sitter 运行时和
Go 语法的 WebAssembly 资产，构建和使用这个 npm 包都不需要 Go 工具链。原生 `uast4go`
CLI 仍可单独构建。

## 随包分发的 Go 语法

上游 `tree-sitter-go@0.25.0` 不能解析 Go 1.26 `new(expr)`（例如 Go 1.27 stdlib 的
`new("NewConnContextKey")`），会整文件报 ERROR。因此本包在 `assets/tree-sitter-go.wasm`
保存打了补丁的语法产物（叠加上游 PR #199、#193、#198），
支持 `new(expr)`、shadowed `new`/`make` 以及 Go 1.27 generic methods。

- `scripts/copy-assets.js` 复制 `assets/tree-sitter-go.wasm` 到 `dist/`；
  缺失时构建失败，不回退到未打补丁的上游语法；
- [语法来源和构建步骤](./assets/README.md)、[源码补丁](./assets/grammar.patch)
  和[第三方许可](./THIRD_PARTY_NOTICES.md)随 npm 包分发。

## 安装与构建

```bash
npm ci
npm test          # 自动构建 dist/，然后运行测试
npm pack          # 将这次构建的 dist/ 打成 npm 安装包
```

## 用法

```ts
const { Parser } = require('@ant-yasa/uast-parser-go')

const parser = new Parser()
await parser.init()

// 返回 UAST JSON 字符串；比较输出时应先解码，原生 CLI 和 npm 包的缩进不同。
const raw = parser.parseSourceRaw('examples/varDecl.go', source)
// 返回对象
const obj = parser.parseSource('examples/varDecl.go', source)
// java/php 风格别名
const obj2 = parser.parse(source, { sourcefile: 'examples/varDecl.go' })
// 完整项目模式：目录/包树 + go.mod + 同包跨文件类型解析（tmpN 连续编号）
const proj = parser.parseProject([{ name: '/abs/a.go', content: source }], { root: '/abs' })

parser.lastErrors // 最近一次调用的 file-level 诊断
```

## 测试

`tests/golden.test.ts` 把 `examples/` 中每个 Go 样例的解析结果与同名 `.go.json` 固定预期比较。
测试归一化路径和原生序列化的默认字段；模块元信息由项目测试直接核对。

构建后可用 `npx tsx scripts/dump-cst.ts examples/varDecl.go` 查看具体语法树；它加载同一份补丁语法。

## 项目模式（parseProject）

`parseProject(files, { root })` 接收内存源码，返回与原生 `-rootDir` 相同结构的目录和包信息：

- `packageInfo` 的 `PathName`/`subs`/`files` 按 "/"+相对 root 的目录嵌套，files key
  用传入的 `name`；
- moduleName 取原生遍历顺序中的第一个 go.mod：先检查根目录，再按目录名顺序深度优先搜索，
  跳过 `/vendor` 前缀目录。返回选中的 `goModPath` 和搜索范围内的 `numOfGoMod`（缺 go.mod 时
  `__unknown_module__` + warning/no_gomod）；
- 同一 package 内多个文件共享 `typeDecls`/`type2Class`（跨文件类型/方法解析），
  `tmpN` 在同一 package 内连续编号；
- 坏文件记 file-level error/parse_error 并跳过，好文件照常构建；完全没有 package
  时为请求级错误（抛出）。

## 已知限制

- 对象解析（`id.Obj.Decl`）用轻量作用域表近似 `go/parser`；与 go/parser 一致，
  解析按文件独立进行（跨文件引用不进入对象表），但类型声明表 `typeDecls` 跨文件共享。
- 项目模式扫描传入的有效 Go 源码，不按当前平台的 build tags 隐式过滤；这不是 `go build` 的包加载器。

## 项目完整性与错误契约

同目录的每个 package 都会独立构建，包含外部测试包。输出仍使用原来的目录树，并在每个文件上保存 `packageName`。目录、包名和同包文件按名称排序，避免输入顺序改变临时变量编号。Engine 消费时须保持不同 package 的作用域隔离，不能把目录中所有声明合并到一个包。

单文件有语法错误或顶层结构无效时抛错，不返回部分 UAST。完整文件要以一个 `package` 子句开始，`import` 放在其他声明之前，且不允许顶层可执行语句。`lastErrors` 和异常对象的 `errors` 提供 `error/parse_error` 诊断。项目模式保留好文件并记录坏文件诊断，没有可构建文件时抛错。所有成功、失败路径都显式释放 Tree。

转换代码的普通异常会终止本次调用，保留原异常和 `error/convert_error` 诊断；解析器仍可处理下一次请求。WASM 陷阱、底层解析或释放失败会使运行时失效，异常带 `runtimeInvalid: true`；下一次请求前须再次调用 `await parser.init()`。清理仍会尝试释放所有已创建的树；如已有首错，清理异常通过 `cleanupErrors` 附在首错上。

UAST 保留分析需要的程序结构；如果需要还原原始源码，请保留输入文件。
