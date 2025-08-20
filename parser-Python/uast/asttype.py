from typing import List, Optional, Union, Literal as TypingLiteral
from dataclasses import dataclass, field
from dataclasses_json import dataclass_json, config


@dataclass_json
@dataclass
class Meta:
    isConstructor: bool = False
    isAsync: bool = False
    decorators: Optional['Identifier'] = None
    isKwargs: bool = False


@dataclass_json
@dataclass
class SourceLocation:
    start: 'Position' = None
    end: 'Position' = None
    sourcefile: str = None


@dataclass_json
@dataclass
class Position:
    line: int
    column: int


@dataclass_json
@dataclass
class BaseNode:
    loc: Optional[SourceLocation]
    _meta: Meta

    # def __init__(self,
    #              loc: Optional[SourceLocation] = None,
    #              _meta: Optional[Dict[str, Any]] = None):
    #     self.loc = loc
    #     self._meta = _meta or {}

    # @property
    # def type(self) -> str:
    #     return self.__class__.__name__

    type: str = field(init=False)

    def __post_init__(self):
        # 初始化时动态设置类型名称
        self.type = self.__class__.__name__


# ========== Core Nodes ==========
@dataclass_json
@dataclass
class Noop(BaseNode):
    pass


@dataclass_json
@dataclass
class Literal(BaseNode):
    value: Union[None, int, str, bool]
    literal_type: str  # 'null' , 'number' , 'string' , 'boolean', 'bytes', 'float', 'bytes'


@dataclass_json
@dataclass
class Identifier(BaseNode):
    name: str


# ========== Structure Nodes ==========
@dataclass_json
@dataclass
class CompileUnit(BaseNode):
    body: List['Instruction']
    language: TypingLiteral['javascript', 'typescript', 'java', 'golang', 'python']
    uri: str
    version: str
    language_version: Optional[Union[int, str, bool]] = None


@dataclass_json
@dataclass
class ExportStatement(BaseNode):
    argument: 'Expression'
    alias: Identifier


# ========== Control Flow ==========
@dataclass_json
@dataclass
class IfStatement(BaseNode):
    test: 'Expression'
    consequent: 'Instruction'
    alternative: Optional['Instruction'] = None


@dataclass_json
@dataclass
class ForStatement(BaseNode):
    init: Optional[Union['Expression', 'VariableDeclaration']]
    test: Optional['Expression']
    update: Optional['Expression']
    body: 'Instruction'


@dataclass_json
@dataclass
class RangeStatement(BaseNode):
    key: Optional[Union['VariableDeclaration', 'Expression']]
    value: Optional[Union['VariableDeclaration', 'Expression']]
    right: 'Expression'
    body: 'Instruction'


@dataclass_json
@dataclass
class WhileStatement(BaseNode):
    test: 'Expression'
    body: 'Instruction'
    is_post_test: bool = False


@dataclass_json
@dataclass
class IfStatement(BaseNode):
    test: 'Expression'
    consequent: 'Instruction'
    alternative: Optional['Instruction'] = None

@dataclass_json
@dataclass
class SwitchStatement(BaseNode):
    discriminant: 'Expression'
    cases: List['CaseClause']


@dataclass_json
@dataclass
class CaseClause(BaseNode):
    test: Optional['Expression']
    body: 'Instruction'


@dataclass_json
@dataclass
class BreakStatement(BaseNode):
    label: Optional[Identifier]

@dataclass_json
@dataclass
class ContinueStatement(BaseNode):
    label: Optional[Identifier]

# ========== Expressions ==========
@dataclass_json
@dataclass
class BinaryExpression(BaseNode):
    operator: str  # e.g. '+', '&&', 'instanceof', etc.
    left: 'Expression'
    right: 'Expression'


@dataclass_json
@dataclass
class CallExpression(BaseNode):
    callee: 'Expression'
    arguments: List[Optional['Expression']]


@dataclass_json
@dataclass
class ThisExpression(BaseNode):
    pass


@dataclass_json
@dataclass
class SuperExpression(BaseNode):
    pass


@dataclass_json
@dataclass
class MemberAccess(BaseNode):
    object: 'Expression'
    property: 'Expression'
    computed: bool = False


# ========== Declarations ==========
@dataclass_json
@dataclass
class FunctionDefinition(BaseNode):
    parameters: List[Optional['VariableDeclaration']]
    return_type: 'Type'
    body: 'Instruction'
    id: Optional['Expression'] = None
    modifiers: List[Optional[str]] = None


@dataclass_json
@dataclass
class VariableDeclaration(BaseNode):
    id: 'Expression'
    init: Optional['Expression']
    cloned: bool
    varType: 'Type'
    variableParam: bool = False


@dataclass_json
@dataclass
class ScopedStatement(BaseNode):
    body: List['Instruction']
    id: Optional[Identifier] = None


@dataclass_json
@dataclass
class ReturnStatement(BaseNode):
    argument: 'Expression'
    isYield: bool = False


@dataclass_json
@dataclass
class ExpressionStatement(BaseNode):
    expression: 'Expression'

@dataclass_json
@dataclass
class TryStatement(BaseNode):
    body: 'Statement'
    handlers: List[Optional['CatchClause']]
    finalizer: Optional['Instruction']

@dataclass_json
@dataclass
class CatchClause(BaseNode):
    parameter: List[Optional[Union[VariableDeclaration, 'Sequence']]]
    body: 'Instruction'


@dataclass_json
@dataclass
class ThrowStatement(BaseNode):
    argument: Optional['Expression']

@dataclass_json
@dataclass
class AssignmentExpression(BaseNode):
    left: 'LVal'
    right: 'Expression'
    operator: str
    cloned: bool = False


@dataclass_json
@dataclass
class TupleExpression(BaseNode):
    elements: List[Union['Expression', 'Instruction']]
    modifiable: Optional[bool] = False


@dataclass_json
@dataclass
class DereferenceExpression(BaseNode):
    argument: 'Expression'


@dataclass_json
@dataclass
class ReferenceExpression(BaseNode):
    argument: 'Expression'


@dataclass_json
@dataclass
class ObjectExpression(BaseNode):
    properties: List[Union['ObjectProperty', 'SpreadElement']]
    id: Identifier = None


@dataclass_json
@dataclass
class ObjectProperty(BaseNode):
    key: 'Expression'
    value: Optional['Expression']


@dataclass_json
@dataclass
class SpreadElement(BaseNode):
    argument: 'Expression'

@dataclass_json
@dataclass
class ConditionalExpression(BaseNode):
    test: 'Expression'
    consequent: 'Expression'
    alternative: 'Expression'


@dataclass_json
@dataclass
class UnaryExpression(BaseNode):
    operator: str
    argument: 'Expression'
    isSuffix: bool = False

@dataclass_json
@dataclass
class ImportExpression(BaseNode):
    from_: Literal = field(
        metadata=config(field_name="from")  # 使用 config 显式指定 JSON 字段名
    )
    local: Identifier
    imported: 'Node'

@dataclass_json
@dataclass
class Sequence(BaseNode):
    expressions: List['Instruction']

@dataclass_json
@dataclass
class YieldExpression(BaseNode):
    argument: Optional['Expression']

@dataclass_json
@dataclass
class SliceExpression(BaseNode):
    start: Optional['Instruction']
    end: Optional['Instruction']
    step: Optional['Instruction']

@dataclass_json
@dataclass
class ClassDefinition(BaseNode):
    id: Identifier
    body: List['Instruction']
    supers: List['Expression']

@dataclass_json
@dataclass
class NewExpression(BaseNode):
    callee: 'Expression'
    arguments: List['Expression']


# ========== Types ==========
@dataclass_json
@dataclass
class PrimitiveType(BaseNode):
    kind: str  # 'string' , 'number' , 'boolean' , 'null'
    id: Identifier = "PrimitiveType" #这里交换了顺序
    type_arguments: Optional[List['Type']] = None


@dataclass_json
@dataclass
class ArrayType(BaseNode):
    element: 'Type'
    id: Identifier = "ArrayType" #这里交换了顺序
    size: Optional['Expression'] = None

@dataclass_json
@dataclass
class MapType(BaseNode):
    keyType: 'Type'
    valueType: 'Type'
    id: Identifier = "MapType"
    typeArguments: Optional[List['Type']] = None


@dataclass_json
@dataclass
class DynamicType(BaseNode):
    id: Identifier = None
    typeArguments: Optional[List['Type']] = None


# ========== Type Aliases ==========
Instruction = Union[
    Noop, Literal, Identifier, ExportStatement, IfStatement, ForStatement,
    WhileStatement, RangeStatement, SpreadElement, ObjectExpression, ObjectProperty, DereferenceExpression, ReferenceExpression,
    Sequence, SwitchStatement, ConditionalExpression, UnaryExpression, TryStatement, CatchClause, ThrowStatement, YieldExpression,
    # ...其他指令类型
]

Expression = Union[
    Literal, Identifier, BinaryExpression, CallExpression, MemberAccess, ImportExpression, ObjectExpression, ObjectProperty, SpreadElement,
    DereferenceExpression, ReferenceExpression, Sequence, SwitchStatement, ConditionalExpression, UnaryExpression, YieldExpression
    # ...其他表达式类型
]

Statement = Union[Sequence, SwitchStatement, BreakStatement, ContinueStatement, TryStatement, ThrowStatement, YieldExpression]

LVal = Union[Identifier, MemberAccess, TupleExpression]

Type = Union[
    PrimitiveType, ArrayType, DynamicType, Identifier, MapType
]
Conditional = Union[IfStatement , SwitchStatement , ConditionalExpression]

Node = Union[ArrayType
, AssignmentExpression
, BinaryExpression
    , BreakStatement
, CallExpression
    , CaseClause
    # , CastExpression
    # , CatchClause
    # , ChanType
, ClassDefinition
, CompileUnit
    , ConditionalExpression
    , ContinueStatement
    , DereferenceExpression
, DynamicType
, ExportStatement
    # , ExpressionStatement
, ForStatement
    # , FuncType
, FunctionDefinition
, Identifier
, IfStatement
    , ImportExpression
    # , LabeledStatement
, Literal
    # , MapType
, MemberAccess
    , NewExpression
, Noop
, ObjectExpression
, ObjectProperty
    # , PackageDeclaration
    # , PointerType
, PrimitiveType
, RangeStatement
    , ReferenceExpression
    , ReturnStatement
, ScopedStatement
    # , ScopedType
    , Sequence
    , SliceExpression
, SpreadElement
    # , SuperExpression
    , SwitchStatement
    # , ThisExpression  test?: Expression | null
    #   body: Instruction
    # , ThrowStatement
    , TryStatement
, TupleExpression
    # , TupleType
    , UnaryExpression
, VariableDeclaration
    # , VoidType
, WhileStatement
    , YieldExpression
]

# 其他类型别名类似定义...
