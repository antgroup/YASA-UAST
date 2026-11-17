# Go 语法的来源与构建

随包使用的 `tree-sitter-go.wasm` 支持 Go 1.26 的 `new(expr)`、同名函数
`new` / `make` 的调用，以及 Go 1.27 的泛型方法。npm 构建只复制已有的
WASM；缺少该文件会失败，不会改用语法行为不同的上游产物。

## 源码

以 [Tree-sitter Go PR #199 的固定提交](https://github.com/tree-sitter/tree-sitter-go/commit/ac0aa849eb04b8f91ade841a3033dda8a8c88fd2)
为基线。该提交让 `new` 接受普通参数列表和内置函数的特殊参数列表。
随包提供的 [`grammar.patch`](grammar.patch) 在此基础上叠加两处修复：

- 从 [PR #193 的固定提交](https://github.com/tree-sitter/tree-sitter-go/commit/5a6af13a0a5b45bc76cac289c783b315b2b74e13)
  取特殊参数列表的表达式分支，让同名函数调用也能传入普通表达式。
- 从 [PR #198 的固定提交](https://github.com/tree-sitter/tree-sitter-go/commit/2a37d91d26d36a2709c3d0dbcfa9ba79f9e58a87)
  取方法类型参数和对应的语法冲突声明。

## 重新生成

先将 `patch` 指向随包分发的 `assets/grammar.patch`，再在独立目录执行：

```sh
patch=/absolute/path/to/assets/grammar.patch
base=ac0aa849eb04b8f91ade841a3033dda8a8c88fd2
git clone https://github.com/tree-sitter/tree-sitter-go.git
cd tree-sitter-go
git fetch origin "$base"
git checkout --detach "$base"
git apply --check "$patch"
git apply "$patch"
npx --yes --package tree-sitter-cli@0.25.8 tree-sitter generate
npx --yes --package tree-sitter-cli@0.25.8 tree-sitter build --wasm -o tree-sitter-go.wasm
```

现有产物的构建记录使用 Tree-sitter CLI 0.25.8 和
`emscripten/emsdk:4.0.4`。产物为 ABI 15，大小为 233,261 字节，SHA-256 为
`ba903b4aafe28cbd94dd8d256e13e361c67fc940110d724479016eec318011f5`。
更新语法时，将新文件放到解析器的 `assets/tree-sitter-go.wasm`，更新构建记录，
并运行语法、固定预期输出和 Engine 接入回归。

Tree-sitter Go 的 MIT 许可证随 npm 包收录在
[`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md)。
