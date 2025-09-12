<img src="folder-img/logo.png" style="width:50%;"  />

#### [简体中文](README_ZH.md) / [English](README.md)

YASA （Yet Another Static Analyzer ）是一个开源的静态程序分析项目。其核心是定义了一种多语言通用的中间表达——统一抽象语法树 （Unified Abstract Syntax Tree，简称UAST），基于UAST实现了一套高精度的静态程序分析框架。用户可通过编写检查器（Checker）的方式，灵活实现诸如AST查询、数据流分析、函数调用图分析等多种程序分析任务，并通过SDK/声明式查询语言QL/MCP等方式对外开放能力。
作为诞生于安全团队的开源项目，YASA也以Checker的形式内置了安全领域最重要的污点分析能力，用于安全漏洞的检测。

YASA项目包含

- YASA-UAST
- [YASA-Engine](https://github.com/antgroup/YASA-Engine)
- YASA-UQL
- YASA-MCP
- YASA-SDK
- [xAST](https://github.com/alipay/ant-application-security-testing-benchmark)

想了解更多YASA项目的内容，请点[这里](https://www.yuque.com/u22090306/bebf6g)

# YASA-UAST
本项目为YASA项目的YASA-UAST部分。

UAST（Unified Abstract Syntax Tree）是一种面向多语言程序分析的中间表示结构。UAST-Parser将不同编程语言的代码解析为统一的抽象语法格式，通过UAST，不同语言的源代码可以被转换为标准化的树形结构，从而实现多语言的统一分析和处理。

# YASA-UAST结构

## specification
- [UAST 的节点描述](https://github.com/antgroup/YASA-UAST/blob/main/specification/specification.md)

## parser-Go
- UAST Go 语言解析器，将 Go 语言代码解析为 UAST

## parser-Java-JS
- UAST Java 语言和 JS 语言解析器，将 Java 语言 / JS / TS 语言的代码解析为 UAST

## parser-Python
- UAST Python 语言的解析器，将 Python 语言代码解析为 UAST

# 加入我们
遇到问题欢迎提交issue！

参与代码贡献，详见[CONTRIBUTION](https://www.yuque.com/u22090306/bebf6g/rgm1xmoa38wlfxzc)

# 资源链接
[官方文档](https://www.yuque.com/u22090306/bebf6g)
[社区活动](https://www.yuque.com/u22090306/bebf6g/fn1rauxwtp7z0l1u)

# 开源协议
Apache License 2.0 - 详情 LICENSE Apache-2.0

# 致谢
感谢所有为YASA项目做出贡献的开发者！特别感谢开源社区的支持和反馈，让我们能够共同推动程序分析技术的发展。

YASA - 让代码分析更精确、更易用、更智能

# 联系我们

[社区官网](https://cybersec.antgroup.com/)

<img src="folder-img/contactus.png" style="width:20%;" />
