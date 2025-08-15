import util from "util";
import stringifyValidator from "../utils/stringifyValidator.js";
import toFunctionName from "../utils/toFunctionName.js";
import fs from 'fs';

import t from "../../dist/index.js";


const packageJsonStr = fs.readFileSync('./package.json').toString('utf8');
const pkg = JSON.parse(packageJsonStr);
const version = pkg.version;

const readme = [
  `# Specification of UAST

## 版本
${version}
## 介绍
UAST(Unified Abstract Syntax Tree) 是一种统一的抽象语法树（AST）表达，旨在为程序语言提供高层次（higher level）的通用中间表达形式。
UAST的直接或者间接产物，将以安全、查错、优化等程序分析场景为目的，并以此目标作为设计时的考量。

UAST的设计理念是：
* 简单
尽量用最少的语法节点信息
* 通用
尽可能高的通用性，即同一语法节点能够适配不同程序语言，也即是，更少的特有语言定制语法
* 详尽
包含尽可能多的节点元信息，用于作程序分析辅助或者功能扩展，比如location信息，modifier等

注意:

UAST不提供后续编译可执行承诺，即是说，和程序分析无关的信息可能会被去掉。
UAST会对不同语言里面的语法语义信息在程序分析层面作有损统一抽象，目的是用尽可能简单的语法信息做统一表达。

## 语法节点

### 基础节点属性
以下属性为每一个AST节点都会有的属性，表示一些节点本身的信息
* type
表示节点的类型，具体类型信息可以看下文对于type的枚举。
* loc
表示位置，通过start、end、sourcefile表示节点表示源码的位置，start、end包含line与column两个信息。line、column均从1开始。
\`\`\`json
loc:{
    start: {
        line: number,
        column: number
    },
    end: {
        line: number,
        column: number
    },
    sourcefile:string
 }
\`\`\`
* meta
附加属性，通常为不同语言的parser实现时存放的扩展内容，以及一些节点的附加信息。如函数/类的注解（装饰器）会放在里面。
`,
];

const APIHistory = {
  ClassProperty: [["v7.6.0", "Supports `static`"]],
  ClassDefinition: [["v7.6.0", "Supports `static`"]],
};
function formatHistory(historyItems) {
  const lines = historyItems.map(
    item => "| `" + item[0] + "` | " + item[1] + " |"
  );
  return [
    "<details>",
    "  <summary>History</summary>",
    "",
    "| 版本 | 更新 |",
    "| --- | --- |",
    ...lines,
    "</details>",
  ];
}
function printAPIHistory(key, readme) {
  if (APIHistory[key]) {
    readme.push("");
    readme.push(...formatHistory(APIHistory[key]));
  }
}
function printNodeFields(key, readme) {
  if (Object.keys(t.NODE_FIELDS[key]).length > 0) {
    readme.push("");
    readme.push("*属性描述*");
    readme.push("");
    readme.push(`| 属性名 | 类型 | 约束 | 说明 |`);
    readme.push(`| --- | --- | --- | --- |`);
    Object.keys(t.NODE_FIELDS[key])
      .sort(function (fieldA, fieldB) {
        const indexA = t.BUILDER_KEYS[key].indexOf(fieldA);
        const indexB = t.BUILDER_KEYS[key].indexOf(fieldB);
        if (indexA === indexB) return fieldA < fieldB ? -1 : 1;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      })
      .forEach(function (field) {

        const defaultValue = t.NODE_FIELDS[key][field].default;
        const fieldDescription = ["`" + field + "`"];
        const validator = t.NODE_FIELDS[key][field].validate;
        const row = ["`" + field + "`", "", "", ""];
        // if (customTypes[key] && customTypes[key][field]) {
        //   fieldDescription.push(`: ${customTypes[key][field]}`);
        // } else if (validator) {
        if (validator) {
          try {
            fieldDescription.push(
              ": `" + stringifyValidator(validator, "") + "`"
            );
            row[1] = stringifyValidator(validator, "").replace(/\|/g, '&#124;');
          } catch (ex) {
            if (ex.code === "UNEXPECTED_VALIDATOR_TYPE") {
              console.log(
                "Unrecognised validator type for " + key + "." + field
              );
              console.dir(ex.validator, { depth: 10, colors: true });
            }
          }
        }
        if (defaultValue !== null || t.NODE_FIELDS[key][field].optional) {
          fieldDescription.push(
            " (default: `" + util.inspect(defaultValue) + "`"
          );
          row[2] += " default: " + util.inspect(defaultValue) + "";
          if (t.BUILDER_KEYS[key].indexOf(field) < 0) {
            fieldDescription.push(", excluded from builder function");
          }
          fieldDescription.push(")");
        } else {
          fieldDescription.push(" (required)");
          row[2] += " required"
        }
        row[3] = t.NODE_FIELD_COMMENTS[key][field];
        // readme.push("- " + fieldDescription.join(""));
        readme.push(`| ${row[0]} | ${row[1]} | ${row[2]} | ${row[3]}`);
      });
  }
}

function printAliasKeys(key, readme) {
  if (t.ALIAS_KEYS[key] && t.ALIAS_KEYS[key].length) {
    readme.push("");
    readme.push(
      "Aliases: " +
        t.ALIAS_KEYS[key]
          .map(function (key) {
            return "[`" + key + "`](#" + key.toLowerCase() + ")";
          })
          .join(", ")
    );
  }
}
readme.push("");
Object.keys(t.BUILDER_KEYS)
  // .sort()
  .forEach(function (key) {
    readme.push("### " + key);
    // readme.push("");
    // readme.push("```javascript");
    // readme.push(
    //   "t." + toFunctionName(key) + "(" + t.BUILDER_KEYS[key].join(", ") + ");"
    // );
    // readme.push("```");
    printAPIHistory(key, readme);
    // readme.push("");
    // readme.push(
    //   "See also `t.is" +
    //     key +
    //     "(node, opts)` and `t.assert" +
    //     key +
    //     "(node, opts)`."
    // );

    // print node comment
    readme.push(t.NODE_COMMENTS[key].replace("\n", `<br />`));

    printNodeFields(key, readme);
    printAliasKeys(key, readme);

    readme.push("");
    readme.push("---");
    readme.push("");
  });

function generateMapAliasToNodeTypes() {
  const result = new Map();
  for (const nodeType of Object.keys(t.ALIAS_KEYS)) {
    const aliases = t.ALIAS_KEYS[nodeType];
    if (!aliases) continue;
    for (const alias of aliases) {
      if (!result.has(alias)) {
        result.set(alias, []);
      }
      const nodeTypes = result.get(alias);
      nodeTypes.push(nodeType);
    }
  }
  return result;
}
const aliasDescriptions = {
  Binary:
    "A cover of BinaryExpression and LogicalExpression, which share the same AST shape.",
  Block: "Deprecated. Will be removed in Babel 8.",
  BlockParent:
    "A cover of AST nodes that start an execution context with new [LexicalEnvironment](https://tc39.es/ecma262/#table-additional-state-components-for-ecmascript-code-execution-contexts). In other words, they define the scope of `let` and `const` declarations.",
  Class:
    "A cover of ClassExpression and ClassDeclaration, which share the same AST shape.",
  CompletionStatement:
    "A statement that indicates the [completion records](https://tc39.es/ecma262/#sec-completion-record-specification-type). In other words, they define the control flow of the program, such as when should a loop break or an action throws critical errors.",
  Conditional:
    "A cover of ConditionalExpression and IfStatement, which share the same AST shape.",
  Declaration:
    "A cover of any [Declaration](https://tc39.es/ecma262/#prod-Declaration)s.",
  EnumBody: "A cover of Flow enum bodies.",
  EnumMember: "A cover of Flow enum membors.",
  ExportDeclaration:
    "A cover of any [ExportDeclaration](https://tc39.es/ecma262/#prod-ExportDeclaration)s.",
  Expression:
    "A cover of any [Expression](https://tc39.es/ecma262/#sec-ecmascript-language-expressions)s.",
  ExpressionWrapper:
    "A wrapper of expression that does not have runtime semantics.",
  Flow: "A cover of AST nodes defined for Flow.",
  FlowBaseAnnotation: "A cover of primary Flow type annotations.",
  FlowDeclaration: "A cover of Flow declarations.",
  FlowPredicate: "A cover of Flow predicates.",
  FlowType: "A cover of Flow type annotations.",
  For: "A cover of [ForStatement](https://tc39.es/ecma262/#sec-for-statement)s and [ForXStatement](#forxstatement)s.",
  ForXStatement:
    "A cover of [ForInStatements and ForOfStatements](https://tc39.es/ecma262/#sec-for-in-and-for-of-statements).",
  Function:
    "A cover of functions and [method](#method)s, the must have `body` and `params`. Note: `Function` is different to `FunctionParent`. For example, a `StaticBlock` is a `FunctionParent` but not `Function`.",
  FunctionParent:
    "A cover of AST nodes that start an execution context with new [VariableEnvironment](https://tc39.es/ecma262/#table-additional-state-components-for-ecmascript-code-execution-contexts). In other words, they define the scope of `var` declarations. FunctionParent did not include `Program` since Babel 7.",
  Immutable:
    "A cover of immutable objects and JSX elements. An object is [immutable](https://tc39.es/ecma262/#immutable-prototype-exotic-object) if no other properties can be defined once created.",
  JSX: "A cover of AST nodes defined for [JSX](https://facebook.github.io/jsx/).",
  LVal: "A cover of left hand side expressions used in the `left` of assignment expressions and [ForXStatement](#forxstatement)s. ",
  Literal:
    "A cover of [Literal](https://tc39.es/ecma262/#sec-primary-expression-literals)s, [Regular Expression Literal](https://tc39.es/ecma262/#sec-primary-expression-regular-expression-literals)s and [Template Literal](https://tc39.es/ecma262/#sec-template-literals)s.",
  Loop: "A cover of loop statements.",
  Method: "A cover of object methods and class methods.",
  Miscellaneous:
    "A cover of non-standard AST types that are sometimes useful for development.",
  ModuleDeclaration:
    "A cover of ImportDeclaration and [ExportDeclaration](#exportdeclaration)",
  ModuleSpecifier:
    "A cover of import and export specifiers. Note: It is _not_ the [ModuleSpecifier](https://tc39.es/ecma262/#prod-ModuleSpecifier) defined in the spec.",
  ObjectMember:
    "A cover of [members](https://tc39.es/ecma262/#prod-PropertyDefinitionList) in an object literal.",
  Pattern:
    "A cover of [BindingPattern](https://tc39.es/ecma262/#prod-BindingPattern) except Identifiers.",
  PatternLike:
    "A cover of [BindingPattern](https://tc39.es/ecma262/#prod-BindingPattern)s. ",
  Private: "A cover of private class elements and private identifiers.",
  Property: "A cover of object properties and class properties.",
  Pureish:
    "A cover of AST nodes which do not have side-effects. In other words, there is no observable behaviour changes if they are evaluated more than once.",
  Scopable:
    "A cover of [FunctionParent](#functionparent) and [BlockParent](#blockparent).",
  Standardized:
    "A cover of AST nodes which are part of an official ECMAScript specification.",
  Statement:
    "A cover of any [Statement](https://tc39.es/ecma262/#prod-Statement)s.",
  TSBaseType: "A cover of primary TypeScript type annotations.",
  TSEntityName: "A cover of ts entities.",
  TSType: "A cover of TypeScript type annotations.",
  TSTypeElement: "A cover of TypeScript type declarations.",
  TypeScript: "A cover of AST nodes defined for TypeScript.",
  Terminatorless:
    "A cover of AST nodes whose semantic will change when a line terminator is inserted between the operator and the operand.",
  UnaryLike: "A cover of UnaryExpression and SpreadElement.",
  UserWhitespacable: "Deprecated. Will be removed in Babel 8.",
  While:
    "A cover of DoWhileStatement and WhileStatement, which share the same AST shape.",
};
const mapAliasToNodeTypes = generateMapAliasToNodeTypes();
readme.push("### Aliases");
readme.push("");
for (const alias of [...mapAliasToNodeTypes.keys()].sort()) {
  const nodeTypes = mapAliasToNodeTypes.get(alias);
  nodeTypes.sort();
  // if (!(alias in aliasDescriptions)) {
  //   throw new Error(
  //     'Missing alias descriptions of "' +
  //       alias +
  //       ", which covers " +
  //       nodeTypes.join(",")
  //   );
  // }
  readme.push("#### " + alias);
  readme.push("");
  readme.push(aliasDescriptions[alias]);
  readme.push("```javascript");
  readme.push("t.is" + alias + "(node);");
  readme.push("```");
  readme.push("");
  readme.push("Covered nodes: ");
  for (const nodeType of nodeTypes) {
    readme.push("- [`" + nodeType + "`](#" + nodeType.toLowerCase() + ")");
  }
  readme.push("");
}

process.stdout.write(readme.join("\n"));
