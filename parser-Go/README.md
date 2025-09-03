# uast4go - UAST Go Parser

uast4go 是 YASA 项目的 Go 语言解析器，用于提取代码的统一抽象语法树（UAST）

## 构建二进制（支持多平台）

你可以使用 Go 原生命令构建适用于不同操作系统的可执行文件。

### 支持的平台

| OS      | Arch    | 输出文件名               |
|---------|---------|--------------------------|
| Linux   | amd64   | uast4go-linux-amd64     |
| macOS   | amd64   | uast4go-mac-amd64       |
| macOS   | arm64   | uast4go-mac-arm64       |

所有二进制均为静态链接，无需依赖外部库。

---

### 1. 构建 Linux 二进制（amd64）

CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o dist/uast4go-linux-amd64 .

---

### 2. 构建 macOS 二进制（Intel）

go build -o dist/uast4go-mac-amd64 .

---

### 3. 构建 macOS 二进制（Apple Silicon / M1/M2）

go build -o dist/uast4go-mac-arm64 .

---

### 输出目录

构建后的二进制文件将生成在：

parser-Go/dist/

请确保该目录存在，或提前创建：

mkdir -p dist

---

### CI/CD 集成

GitHub Actions 流水线会自动构建并发布以下文件：
- uast4go-linux-amd64
- uast4go-mac-amd64
- uast4go-mac-arm64

详细流程见：.github/workflows/release.yml
