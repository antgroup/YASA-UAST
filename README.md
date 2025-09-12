<img src="folder-img/logo.png" style="width:50%;"  />

## [ Official Website ](https://cybersec.antgroup.com/)
#### [简体中文](README_ch.md) / [English](README.md)

YASA (Yet Another Static Analyzer) is an open-source static program analysis project. Its core innovation lies in a unified intermediate representation called the Unified Abstract Syntax Tree (UAST), designed to support multiple programming languages. Built on top of UAST, YASA provides a highly accurate static analysis framework. Users can extend its capabilities by writing custom checkers to perform various program analysis tasks—such as AST queries, data flow analysis, and function call graph analysis—and expose functionality through SDK, declarative query language (QL), or MCP.

As a project originally developed within a security team, YASA also comes with built-in taint analysis capabilities, implemented as a checker, to detect security vulnerabilities.

The YASA Project consists of:

- YASA-UAST
- [YASA-Engine](https://github.com/antgroup/YASA-Engine)
- YASA-UQL
- YASA-MCP
- YASA-SDK
- [xAST](https://github.com/alipay/ant-application-security-testing-benchmark)

For more information about the YASA Project, please visit [here](https://www.yuque.com/u22090306/bebf6g).

# YASA-UAST
This project is the YASA-UAST component of the YASA Project.

YASA-UAST is an intermediate representation structure for multi-language program analysis. The UAST-Parser parses code from different programming languages into a unified abstract syntax format. Through UAST, source code in different languages can be converted into a standardized tree structure, enabling unified analysis and processing across multiple languages.

# YASA-UAST Components

## specification
- [UAST Node Specification](https://github.com/antgroup/YASA-UAST/blob/main/specification/specification.md)

## parser-Go
- Go language parser for UAST, parsing Go code into UAST.

## parser-Java-JS
- Java and JS language parsers for UAST, parsing Java, JS, and TS code into UAST.

## parser-Python
- Python language parser for UAST, parsing Python code into UAST.

## Join Us
Welcome to submit issues if you encounter any problems!

For code contributions, please refer to [CONTRIBUTION](https://www.yuque.com/u22090306/bebf6g/rgm1xmoa38wlfxzc)

## Resource Links
[Official Documentation](https://www.yuque.com/u22090306/bebf6g)

[Community Activities](https://www.yuque.com/u22090306/bebf6g/fn1rauxwtp7z0l1u)

## Open Source License
Apache License 2.0 - Details in LICENSE Apache-2.0.

## Acknowledgments
Thanks to all developers who have contributed to the YASA project! Special thanks to the open-source community for their support and feedback, enabling us to jointly advance the development of program analysis technology.

YASA - Making code analysis more precise, easier, and smarter.

## Contact Us
[Official Website](https://cybersec.antgroup.com/)

<img src="folder-img/contactus.png" style="width:20%;" />