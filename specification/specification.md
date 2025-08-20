# Specification of UAST

## 版本
0.1.64
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
```json
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
```
* meta
附加属性，通常为不同语言的parser实现时存放的扩展内容，以及一些节点的附加信息。如函数/类的注解（装饰器）会放在里面。


### Noop


Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression), [`Statement`](#statement)

---

### Literal


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `value` | null &#124; number &#124; string &#124; boolean |  required | 
| `literalType` | "null" &#124; "number" &#124; "string" &#124; "boolean" |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### Identifier


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `name` | string |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression), [`LVal`](#lval), [`Type`](#type)

---

### CompileUnit
一个最小的编译单元。例如一个.js或.py或.class文件，都是一个最小编译单元

*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `body` | Array<Instruction> |  required | 
| `language` | "javascript" &#124; "typescript" &#124; "java" &#124; "golang" &#124; "python" |  required | 源语言种类
| `languageVersion` | number &#124; string &#124; boolean |  default: null | 源语言版本
| `uri` | string |  required | 该AST的唯一标识
| `version` | string |  required | UAST版本

Aliases: [`Standardized`](#standardized)

---

### ExportStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `argument` | Expression |  required | 
| `alias` | Identifier |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement)

---

### IfStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `test` | Expression |  required | 
| `consequent` | Instruction |  required | 
| `alternative` | Instruction |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement), [`Conditional`](#conditional)

---

### SwitchStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `discriminant` | Expression |  required | 
| `cases` | Array<CaseClause> |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement), [`Expression`](#expression), [`Conditional`](#conditional)

---

### CaseClause


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `test` | Expression |  default: null | 
| `body` | Instruction |  required | 

Aliases: [`Standardized`](#standardized)

---

### ForStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `init` | Expression &#124; VariableDeclaration |  default: null | 
| `test` | Expression |  default: null | 
| `update` | Expression |  default: null | 
| `body` | Instruction |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement), [`Loop`](#loop)

---

### WhileStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `test` | Expression |  required | 
| `body` | Instruction |  required | 
| `isPostTest` | boolean |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement), [`Loop`](#loop), [`Scopable`](#scopable)

---

### RangeStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `key` | VariableDeclaration &#124; Expression |  default: null | 
| `value` | VariableDeclaration &#124; Expression |  default: null | 
| `right` | Expression |  required | 
| `body` | Instruction |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement), [`Loop`](#loop), [`Scopable`](#scopable)

---

### LabeledStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `label` | Identifier |  default: null | 
| `body` | Instruction |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement)

---

### ReturnStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `argument` | Expression |  default: null | 
| `isYield` | boolean |  default: false | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement), [`Expression`](#expression)

---

### BreakStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `label` | Identifier |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement)

---

### ContinueStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `label` | Identifier |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement)

---

### ThrowStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `argument` | Expression |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement)

---

### TryStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `body` | Statement |  required | 
| `handlers` | Array<null &#124; CatchClause> |  default: null | 
| `finalizer` | Instruction |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement)

---

### CatchClause


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `parameter` | Array<null &#124; VariableDeclaration &#124; Sequence> |  required | 
| `body` | Instruction |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Scopable`](#scopable)

---

### ExpressionStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `expression` | Expression |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement)

---

### ScopedStatement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `body` | Array<Instruction> |  required | 
| `id` | Identifier |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement), [`Scopable`](#scopable)

---

### BinaryExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `operator` | "+" &#124; "-" &#124; "*" &#124; "/" &#124; "**" &#124; "%" &#124; "<<" &#124; ">>" &#124; ">>>" &#124; "<<<" &#124; "&&" &#124; "&#124;&#124;" &#124; ",," &#124; "&" &#124; "," &#124; "^" &#124; "<" &#124; ">" &#124; "<=" &#124; ">=" &#124; "==" &#124; "!=" &#124; "&#124;" &#124; "instanceof" &#124; "in" &#124; "push" &#124; "===" &#124; "!==" &#124; "??" |  required | 
| `left` | Expression |  required | 
| `right` | Expression |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### UnaryExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `operator` | "-" &#124; "+" &#124; "++" &#124; "--" &#124; "~" &#124; "delete" &#124; "!" &#124; "typeof" &#124; "void" |  required | 
| `argument` | Expression |  required | 
| `isSuffix` | boolean |  default: true | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### AssignmentExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `left` | LVal |  required | 
| `right` | Expression |  required | 
| `operator` | "=" &#124; "^=" &#124; "&=" &#124; "<<=" &#124; ">>=" &#124; ">>>=" &#124; "+=" &#124; "-=" &#124; "*=" &#124; "/=" &#124; "%=" &#124; "&#124;=" &#124; "**=" |  required | 
| `cloned` | boolean |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### Sequence


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `expressions` | Array<Instruction> |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression), [`Statement`](#statement)

---

### CastExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `expression` | Expression |  required | 
| `as` | Type |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### ConditionalExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `test` | Expression |  required | 
| `consequent` | Expression |  required | 
| `alternative` | Expression |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression), [`Conditional`](#conditional)

---

### SuperExpression


Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### ThisExpression


Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### MemberAccess


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `object` | Expression |  required | 
| `property` | Expression |  required | 
| `computed` | boolean |  default: false | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression), [`LVal`](#lval)

---

### SliceExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `start` | Instruction |  default: null | 
| `end` | Instruction |  default: null | 
| `step` | Instruction |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### TupleExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `elements` | Array<Expression &#124; Instruction> |  required | 
| `modifiable` | boolean |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### ObjectExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `properties` | Array<ObjectProperty &#124; SpreadElement> |  required | 
| `id` | Identifier |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### ObjectProperty


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `key` | Expression |  required | 
| `value` | null &#124; Expression |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### CallExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `callee` | Expression |  required | 
| `arguments` | Array<null &#124; Expression> |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### NewExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `callee` | Expression |  required | 
| `arguments` | Array<Expression> |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### FunctionDefinition


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Expression |  default: null | 
| `parameters` | Array<null &#124; VariableDeclaration> |  required | 
| `returnType` | Type |  required | 
| `body` | Instruction |  required | 
| `modifiers` | Array<null &#124; string> |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression), [`Declaration`](#declaration), [`Scopable`](#scopable), [`Statement`](#statement)

---

### ClassDefinition

<details>
  <summary>History</summary>

| 版本 | 更新 |
| --- | --- |
| `v7.6.0` | Supports `static` |
</details>


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Identifier |  default: null | 
| `body` | Array<null &#124; Instruction> |  required | 
| `supers` | Array<null &#124; Expression> |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression), [`Declaration`](#declaration), [`Scopable`](#scopable), [`Statement`](#statement)

---

### VariableDeclaration


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Expression |  required | 
| `init` | Expression |  default: null | 
| `cloned` | boolean |  default: null | 
| `varType` | Type |  required | 
| `variableParam` | boolean |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression), [`Declaration`](#declaration), [`Statement`](#statement)

---

### DereferenceExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `argument` | Expression |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### ReferenceExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `argument` | Expression |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### ImportExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `from` | Literal |  required | 
| `local` | Identifier |  default: null | 
| `imported` | Identifier &#124; Literal |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### SpreadElement


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `argument` | Expression |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression)

---

### YieldExpression


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `argument` | Expression |  default: null | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Statement`](#statement), [`Expression`](#expression)

---

### PackageDeclaration


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `name` | Expression |  required | 

Aliases: [`Standardized`](#standardized), [`Instruction`](#instruction), [`Expression`](#expression), [`Declaration`](#declaration), [`Statement`](#statement)

---

### PrimitiveType


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Identifier |  required | 
| `typeArguments` | Array<Type> |  default: null | 
| `kind` | "string" &#124; "number" &#124; "boolean" &#124; "null" |  required | 

Aliases: [`Standardized`](#standardized), [`Type`](#type)

---

### ArrayType


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Identifier |  required | 
| `element` | Type |  required | 
| `typeArguments` | Array<Type> |  default: null | 
| `size` | Expression |  default: null | 

Aliases: [`Standardized`](#standardized), [`Type`](#type)

---

### PointerType


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Identifier |  required | 
| `element` | Type |  required | 
| `typeArguments` | Array<Type> |  default: null | 
| `kind` | "pointer" &#124; "reference" |  required | 

Aliases: [`Standardized`](#standardized), [`Type`](#type)

---

### MapType


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Identifier |  required | 
| `keyType` | Type |  required | 
| `valueType` | Type |  required | 
| `typeArguments` | Array<Type> |  default: null | 

Aliases: [`Standardized`](#standardized), [`Type`](#type)

---

### ScopedType


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Identifier |  required | 
| `scope` | null &#124; Type |  required | 
| `typeArguments` | Array<Type> |  default: null | 

Aliases: [`Standardized`](#standardized), [`Type`](#type)

---

### TupleType


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Identifier |  required | 
| `elements` | Array<Type> |  required | 
| `typeArguments` | Array<Type> |  default: null | 

Aliases: [`Standardized`](#standardized), [`Type`](#type)

---

### ChanType


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Identifier |  required | 
| `dir` | string |  required | 
| `valueType` | Type |  required | 

Aliases: [`Standardized`](#standardized), [`Type`](#type)

---

### FuncType


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Identifier |  required | 
| `typeParams` | Array<Type> |  required | 
| `params` | Array<Type> |  required | 
| `results` | Array<Type> |  required | 

Aliases: [`Standardized`](#standardized), [`Type`](#type)

---

### DynamicType


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Identifier |  default: null | 
| `typeArguments` | Array<Type> |  default: null | 

Aliases: [`Standardized`](#standardized), [`Type`](#type)

---

### VoidType


*属性描述*

| 属性名 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| `id` | Identifier |  default: null | 
| `typeArguments` | Array<Type> |  default: null | 

Aliases: [`Standardized`](#standardized), [`Type`](#type)

---

### Aliases

#### Conditional

A cover of ConditionalExpression and IfStatement, which share the same AST shape.
```javascript
t.isConditional(node);
```

Covered nodes: 
- [`ConditionalExpression`](#conditionalexpression)
- [`IfStatement`](#ifstatement)
- [`SwitchStatement`](#switchstatement)

#### Declaration

A cover of any [Declaration](https://tc39.es/ecma262/#prod-Declaration)s.
```javascript
t.isDeclaration(node);
```

Covered nodes: 
- [`ClassDefinition`](#classdefinition)
- [`FunctionDefinition`](#functiondefinition)
- [`PackageDeclaration`](#packagedeclaration)
- [`VariableDeclaration`](#variabledeclaration)

#### Expression

A cover of any [Expression](https://tc39.es/ecma262/#sec-ecmascript-language-expressions)s.
```javascript
t.isExpression(node);
```

Covered nodes: 
- [`AssignmentExpression`](#assignmentexpression)
- [`BinaryExpression`](#binaryexpression)
- [`CallExpression`](#callexpression)
- [`CastExpression`](#castexpression)
- [`ClassDefinition`](#classdefinition)
- [`ConditionalExpression`](#conditionalexpression)
- [`DereferenceExpression`](#dereferenceexpression)
- [`FunctionDefinition`](#functiondefinition)
- [`Identifier`](#identifier)
- [`ImportExpression`](#importexpression)
- [`Literal`](#literal)
- [`MemberAccess`](#memberaccess)
- [`NewExpression`](#newexpression)
- [`Noop`](#noop)
- [`ObjectExpression`](#objectexpression)
- [`ObjectProperty`](#objectproperty)
- [`PackageDeclaration`](#packagedeclaration)
- [`ReferenceExpression`](#referenceexpression)
- [`ReturnStatement`](#returnstatement)
- [`Sequence`](#sequence)
- [`SliceExpression`](#sliceexpression)
- [`SpreadElement`](#spreadelement)
- [`SuperExpression`](#superexpression)
- [`SwitchStatement`](#switchstatement)
- [`ThisExpression`](#thisexpression)
- [`TupleExpression`](#tupleexpression)
- [`UnaryExpression`](#unaryexpression)
- [`VariableDeclaration`](#variabledeclaration)
- [`YieldExpression`](#yieldexpression)

#### Instruction


```javascript
t.isInstruction(node);
```

Covered nodes: 
- [`AssignmentExpression`](#assignmentexpression)
- [`BinaryExpression`](#binaryexpression)
- [`BreakStatement`](#breakstatement)
- [`CallExpression`](#callexpression)
- [`CastExpression`](#castexpression)
- [`CatchClause`](#catchclause)
- [`ClassDefinition`](#classdefinition)
- [`ConditionalExpression`](#conditionalexpression)
- [`ContinueStatement`](#continuestatement)
- [`DereferenceExpression`](#dereferenceexpression)
- [`ExportStatement`](#exportstatement)
- [`ExpressionStatement`](#expressionstatement)
- [`ForStatement`](#forstatement)
- [`FunctionDefinition`](#functiondefinition)
- [`Identifier`](#identifier)
- [`IfStatement`](#ifstatement)
- [`ImportExpression`](#importexpression)
- [`LabeledStatement`](#labeledstatement)
- [`Literal`](#literal)
- [`MemberAccess`](#memberaccess)
- [`NewExpression`](#newexpression)
- [`Noop`](#noop)
- [`ObjectExpression`](#objectexpression)
- [`ObjectProperty`](#objectproperty)
- [`PackageDeclaration`](#packagedeclaration)
- [`RangeStatement`](#rangestatement)
- [`ReferenceExpression`](#referenceexpression)
- [`ReturnStatement`](#returnstatement)
- [`ScopedStatement`](#scopedstatement)
- [`Sequence`](#sequence)
- [`SliceExpression`](#sliceexpression)
- [`SpreadElement`](#spreadelement)
- [`SuperExpression`](#superexpression)
- [`SwitchStatement`](#switchstatement)
- [`ThisExpression`](#thisexpression)
- [`ThrowStatement`](#throwstatement)
- [`TryStatement`](#trystatement)
- [`TupleExpression`](#tupleexpression)
- [`UnaryExpression`](#unaryexpression)
- [`VariableDeclaration`](#variabledeclaration)
- [`WhileStatement`](#whilestatement)
- [`YieldExpression`](#yieldexpression)

#### LVal

A cover of left hand side expressions used in the `left` of assignment expressions and [ForXStatement](#forxstatement)s. 
```javascript
t.isLVal(node);
```

Covered nodes: 
- [`Identifier`](#identifier)
- [`MemberAccess`](#memberaccess)

#### Loop

A cover of loop statements.
```javascript
t.isLoop(node);
```

Covered nodes: 
- [`ForStatement`](#forstatement)
- [`RangeStatement`](#rangestatement)
- [`WhileStatement`](#whilestatement)

#### Scopable

A cover of [FunctionParent](#functionparent) and [BlockParent](#blockparent).
```javascript
t.isScopable(node);
```

Covered nodes: 
- [`CatchClause`](#catchclause)
- [`ClassDefinition`](#classdefinition)
- [`FunctionDefinition`](#functiondefinition)
- [`RangeStatement`](#rangestatement)
- [`ScopedStatement`](#scopedstatement)
- [`WhileStatement`](#whilestatement)

#### Standardized

A cover of AST nodes which are part of an official ECMAScript specification.
```javascript
t.isStandardized(node);
```

Covered nodes: 
- [`ArrayType`](#arraytype)
- [`AssignmentExpression`](#assignmentexpression)
- [`BinaryExpression`](#binaryexpression)
- [`BreakStatement`](#breakstatement)
- [`CallExpression`](#callexpression)
- [`CaseClause`](#caseclause)
- [`CastExpression`](#castexpression)
- [`CatchClause`](#catchclause)
- [`ChanType`](#chantype)
- [`ClassDefinition`](#classdefinition)
- [`CompileUnit`](#compileunit)
- [`ConditionalExpression`](#conditionalexpression)
- [`ContinueStatement`](#continuestatement)
- [`DereferenceExpression`](#dereferenceexpression)
- [`DynamicType`](#dynamictype)
- [`ExportStatement`](#exportstatement)
- [`ExpressionStatement`](#expressionstatement)
- [`ForStatement`](#forstatement)
- [`FuncType`](#functype)
- [`FunctionDefinition`](#functiondefinition)
- [`Identifier`](#identifier)
- [`IfStatement`](#ifstatement)
- [`ImportExpression`](#importexpression)
- [`LabeledStatement`](#labeledstatement)
- [`Literal`](#literal)
- [`MapType`](#maptype)
- [`MemberAccess`](#memberaccess)
- [`NewExpression`](#newexpression)
- [`Noop`](#noop)
- [`ObjectExpression`](#objectexpression)
- [`ObjectProperty`](#objectproperty)
- [`PackageDeclaration`](#packagedeclaration)
- [`PointerType`](#pointertype)
- [`PrimitiveType`](#primitivetype)
- [`RangeStatement`](#rangestatement)
- [`ReferenceExpression`](#referenceexpression)
- [`ReturnStatement`](#returnstatement)
- [`ScopedStatement`](#scopedstatement)
- [`ScopedType`](#scopedtype)
- [`Sequence`](#sequence)
- [`SliceExpression`](#sliceexpression)
- [`SpreadElement`](#spreadelement)
- [`SuperExpression`](#superexpression)
- [`SwitchStatement`](#switchstatement)
- [`ThisExpression`](#thisexpression)
- [`ThrowStatement`](#throwstatement)
- [`TryStatement`](#trystatement)
- [`TupleExpression`](#tupleexpression)
- [`TupleType`](#tupletype)
- [`UnaryExpression`](#unaryexpression)
- [`VariableDeclaration`](#variabledeclaration)
- [`VoidType`](#voidtype)
- [`WhileStatement`](#whilestatement)
- [`YieldExpression`](#yieldexpression)

#### Statement

A cover of any [Statement](https://tc39.es/ecma262/#prod-Statement)s.
```javascript
t.isStatement(node);
```

Covered nodes: 
- [`BreakStatement`](#breakstatement)
- [`ClassDefinition`](#classdefinition)
- [`ContinueStatement`](#continuestatement)
- [`ExportStatement`](#exportstatement)
- [`ExpressionStatement`](#expressionstatement)
- [`ForStatement`](#forstatement)
- [`FunctionDefinition`](#functiondefinition)
- [`IfStatement`](#ifstatement)
- [`LabeledStatement`](#labeledstatement)
- [`Noop`](#noop)
- [`PackageDeclaration`](#packagedeclaration)
- [`RangeStatement`](#rangestatement)
- [`ReturnStatement`](#returnstatement)
- [`ScopedStatement`](#scopedstatement)
- [`Sequence`](#sequence)
- [`SwitchStatement`](#switchstatement)
- [`ThrowStatement`](#throwstatement)
- [`TryStatement`](#trystatement)
- [`VariableDeclaration`](#variabledeclaration)
- [`WhileStatement`](#whilestatement)
- [`YieldExpression`](#yieldexpression)

#### Type


```javascript
t.isType(node);
```

Covered nodes: 
- [`ArrayType`](#arraytype)
- [`ChanType`](#chantype)
- [`DynamicType`](#dynamictype)
- [`FuncType`](#functype)
- [`Identifier`](#identifier)
- [`MapType`](#maptype)
- [`PointerType`](#pointertype)
- [`PrimitiveType`](#primitivetype)
- [`ScopedType`](#scopedtype)
- [`TupleType`](#tupletype)
- [`VoidType`](#voidtype)
