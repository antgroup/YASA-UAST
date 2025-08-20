import is from "../validators/is";
import isValidIdentifier from "../validators/isValidIdentifier";
import { isKeyword, isReservedWord } from "@babel/helper-validator-identifier";

import {
    BINARY_OPERATORS,
    LOGICAL_OPERATORS,
    ASSIGNMENT_OPERATORS,
    UNARY_OPERATORS,
    UPDATE_OPERATORS, LANGUAGE_KEYS,
} from "../constants";

import {
    defineAliasedType,
    assertShape,
    assertOptionalChainStart,
    assertValueType,
    assertNodeType,
    assertNodeOrValueType,
    assertEach,
    chain,
    assertOneOf,
    validateOptional,
} from "./utils";

const defineType = defineAliasedType("Standardized");

defineType("Noop", {
    aliases: ["Instruction", "Expression", "Statement"],
})

defineType("Literal", {
    builder: ["value", "literalType"],
    aliases: ["Instruction", "Expression"],
    fields: {
        value: {
            validate: assertNodeOrValueType("null", "number", "string", "boolean"),
        },
        literalType: {
            validate: assertOneOf(...["null", "number", "string", "boolean"]),
        }
    },
});

defineType("Identifier", {
    builder: ["name"],
    aliases: ["Instruction", "Expression", "LVal", "Type"],
    fields: {
        name: {
            validate: assertValueType("string"),
        },
    },
});

defineType("CompileUnit", {
    comment: "一个最小的编译单元。例如一个.js或.py或.class文件，都是一个最小编译单元",
    builder: ["body", "language", "languageVersion", "uri", "version"],
    visitor: ["body"],
    fields: {
        body: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Instruction")),
            ),
        },
        language: {
            validate: assertOneOf(...LANGUAGE_KEYS),
            comment: '源语言种类'

        },
        languageVersion: {
            validate: assertNodeOrValueType("number", "string", "boolean"),
            optional: true,
            comment: "源语言版本",
        },
        uri: {
            validate: assertValueType("string"),
            comment: '该AST的唯一标识'
        },
        version: {
            validate: assertNodeOrValueType("string"),
            comment: "UAST版本",
        }
    }
})

defineType("ExportStatement", {
    builder: ["argument", "alias"],
    aliases: ["Instruction", "Statement"],
    fields: {
        argument: {
            validate: assertNodeType("Expression")
        },
        alias: {
            validate: assertNodeType("Identifier")
        },
    }
})

defineType("IfStatement", {
    visitor: ["test", "consequent", "alternative"],
    aliases: ["Instruction", "Statement", "Conditional"],
    fields: {
        test: {
            validate: assertNodeType("Expression")
        },
        consequent: {
            validate: assertNodeType("Instruction")
        },
        alternative: {
            validate: assertNodeType("Instruction"),
            optional: true,
        }
    }
})

defineType("SwitchStatement", {
    visitor: ["discriminant", "cases"],
    aliases: ["Instruction", "Statement", "Expression", "Conditional"],
    fields: {
        discriminant: {
            validate: assertNodeType("Expression")
        },
        cases: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("CaseClause")),
            ),
        },
    }
})

defineType("CaseClause", {
    visitor: ["test", "body"],
    fields: {
        test: {
            validate: assertNodeType("Expression"),
            optional: true
        },
        body: {
            validate: assertNodeType("Instruction"),
        },
    }
})

defineType("ForStatement", {
    visitor: ["init", "test", "update", "body"],
    aliases: ["Instruction", "Statement", "Loop"],
    fields: {
        init: {
            validate: assertNodeType("Expression", "VariableDeclaration"),
            optional: true
        },
        test: {
            validate: assertNodeType("Expression"),
            optional: true
        },
        update: {
            validate: assertNodeType("Expression"),
            optional: true
        },
        body: {
            validate: assertNodeType("Instruction"),
        }
    }
})

defineType("WhileStatement", {
    visitor: ["test", "body"],
    builder: ["test", "body", "isPostTest"],
    aliases: ["Instruction", "Statement", "Loop", "Scopable"],
    fields: {
        test: {
            validate: assertNodeType("Expression"),
        },
        body: {
            validate: assertNodeType("Instruction"),
        },
        isPostTest: {
            validate: assertValueType("boolean"),
            optional: true
        }
    }
})

defineType("RangeStatement", {
    visitor: ["key", "value", "right", "body"],
    aliases: ["Instruction", "Statement", "Loop", "Scopable"],
    fields: {
        // TODO key and value can't miss at the same time
        key: {
            validate: assertNodeType("VariableDeclaration", "Expression"),
            optional: true,
        },
        value: {
            validate: assertNodeType("VariableDeclaration", "Expression"),
            optional: true,
        },
        right: {
            validate: chain(
                assertNodeType("Expression"),
                Object.assign(
                    function (node) {
                        // This validator isn't put at the top level because we can run it
                        // even if this node doesn't have a parent.

                        if (!node.key && !node.value) {
                            throw new TypeError(
                                "RangeStatement expects either a key or value, or both",
                            );
                        }
                    },
                    {
                        oneOfNodeTypes: ["Expression"],
                    },
                ),
            )
        },
        body: {
            validate: assertNodeType("Instruction")
        }
    }
})

defineType("LabeledStatement", {
    visitor: ["label", "body"],
    aliases: ["Instruction", "Statement"],
    fields: {
        label: {
            validate: assertNodeType("Identifier"),
            optional: true,
        },
        body: {
            validate: assertNodeType("Instruction"),
        },
    }
})

defineType("ReturnStatement", {
    visitor: ["argument"],
    builder: ["argument", "isYield"],
    aliases: ["Instruction", "Statement", "Expression"],
    fields: {
        argument: {
            validate: assertNodeType("Expression"),
            optional: true
        },
        isYield: {
            default: false
        }
    }
})

defineType("BreakStatement", {
    aliases: ["Instruction", "Statement"],
    visitor: ["label"],
    fields: {
        label: {
            validate: assertNodeType("Identifier"),
            optional: true
        },
    }
})

defineType("ContinueStatement", {
    visitor: ["label"],
    aliases: ["Instruction", "Statement"],
    fields: {
        label: {
            validate: assertNodeType("Identifier"),
            optional: true
        },
    }
})

defineType("ThrowStatement", {
    visitor: ["argument"],
    aliases: ["Instruction", "Statement"],
    fields: {
        argument: {
            validate: assertNodeType("Expression"),
            optional: true
        },
    }
})

defineType("TryStatement", {
    visitor: ["body", "handlers", "finalizer"],
    aliases: ["Instruction", "Statement"],
    fields: {
        body: {
            validate: chain(
                assertNodeType("Instruction"),
                Object.assign(
                    function (node) {
                        // This validator isn't put at the top level because we can run it
                        // even if this node doesn't have a parent.

                        if (!node.handlers && !node.finalizer) {
                            throw new TypeError(
                                "RangeStatement expects either a handlers or finalizer, or both",
                            );
                        }
                    },
                    {
                        oneOfNodeTypes: ["Statement"],
                    },
                )
            )
        },
        handlers: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeOrValueType("null", "CatchClause"))
            ),
            optional: true
        },
        finalizer: {
            validate: assertNodeType("Instruction"),
            optional: true
        }
    }
})

defineType("CatchClause", {
    visitor: ["parameter", "body"],
    aliases: ["Instruction", "Scopable"],
    fields: {
        parameter: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeOrValueType("null", "VariableDeclaration", "Sequence"))
            )
        },
        body: {
            validate: assertNodeType("Instruction"),
        }
    }
})

defineType("ExpressionStatement", {
    visitor: ["expression"],
    aliases: ["Instruction", "Statement"],
    fields: {
        expression: {
            validate: assertNodeType("Expression")
        },
    }
})

defineType("ScopedStatement", {
    visitor: ["body"],
    builder: ["body", "id"],
    aliases: ["Instruction", "Statement", "Scopable"],
    fields: {
        id: {
            validate: assertNodeType("Identifier"),
            optional: true
        },
        body: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Instruction"))
            )
        }
    }
})

export const binaryOpValues = [
    '+',
    '-',
    '*',
    '/',
    '**',
    '%',
    '<<',
    '>>',
    '>>>',
    '<<<',
    '&&',
    '||',
    ',,',
    '&',
    ',',
    '^',
    '<',
    '>',
    '<=',
    '>=',
    '==',
    '!=',
    '|',
    'instanceof',
    'in',
    'push',
    '===',
    '!==',
    '??'
] as const

defineType("BinaryExpression", {
    visitor: ["left", "right"],
    builder: ["operator", "left", "right"],
    aliases: ["Instruction", "Expression"],
    fields: {
        operator: {
            validate: assertOneOf(...binaryOpValues)
        },
        left: {
            validate: assertNodeType("Expression")
        },
        right: {
            validate: assertNodeType("Expression")
        }
    }
})

export const unaryOpValues = [
    '-',
    '+',
    '++',
    '--',
    '~',
    'delete',
    '!',
    'typeof',
    'void',
    //TODO
] as const

defineType("UnaryExpression", {
    visitor: ["argument"],
    builder: ["operator", "argument", "isSuffix"],
    aliases: ["Instruction", "Expression"],
    fields: {
        operator: {
            validate: assertOneOf(...unaryOpValues)
        },
        argument: {
            validate: assertNodeType("Expression")
        },
        isSuffix: {
            validate: assertValueType("boolean"),
            optional: true,
            default: true,
        }
    }
})

export const assignOpValues = [
    '=',
    '^=',
    '&=',
    '<<=',
    '>>=',
    '>>>=',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '|=',
    '**='
] as const

defineType("AssignmentExpression", {
    visitor: ["left", "right", "operator", "cloned"],
    aliases: ["Instruction", "Expression"],
    fields: {
        left: {
            validate: assertNodeType("LVal")
        },
        right: {
            validate: assertNodeType("Expression")
        },
        operator: {
            validate: assertOneOf(...assignOpValues)
        },
        cloned: {
            validate: assertValueType("boolean"),
            optional: true
        }
    }
})

defineType("Sequence", {
    visitor: ["expressions"],
    aliases: ["Instruction", "Expression", "Statement"],
    fields: {
        expressions: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Instruction")),
            ),
        },
    },

});

defineType("CastExpression", {
    visitor: ["expression", "as"],
    aliases: ["Instruction", "Expression"],
    fields: {
        expression: {
            validate: assertNodeType("Expression")
        },
        as: {
            validate: assertNodeType("Type")
        }
    }
})

defineType("ConditionalExpression", {
    visitor: ["test", "consequent", "alternative"],
    aliases: ["Instruction", "Expression", "Conditional"],
    fields: {
        test: {
            validate: assertNodeType("Expression")
        },
        consequent: {
            validate: assertNodeType("Expression")
        },
        alternative: {
            validate: assertNodeType("Expression")
        }
    }
})

defineType("SuperExpression", {
    aliases: ["Instruction", "Expression"],
})

defineType("ThisExpression", {
    aliases: ["Instruction", "Expression"],
})

defineType("MemberAccess", {
    visitor: ["object", "property", "computed"],
    aliases: ["Instruction", "Expression", "LVal"],
    fields: {
        object: {
            validate: assertNodeType("Expression")
        },
        property: {
            validate: assertNodeType("Expression")
        },
        computed: {
            validate: assertValueType("boolean"),
            default: false,
        }
    }
})

defineType("SliceExpression", {
    visitor: ["start", "end","step"],
    aliases: ["Instruction", "Expression"],
    fields: {
        start: {
            validate: assertNodeType("Instruction"),
            optional: true
        },
        end: {
            validate: assertNodeType("Instruction"),
            optional: true
        },
        step: {
            validate: assertNodeType("Instruction"),
            optional: true
        }
    }
})

defineType("TupleExpression", {
    visitor: ["elements"],
    aliases: ["Instruction", "Expression"],
    fields: {
        elements: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Expression","Instruction"))
            )
        },
        modifiable: {
            validate: assertValueType("boolean"),
            optional: true
        }
    }
})

defineType("ObjectExpression", {
    visitor: ["properties", "id"],
    aliases: ["Instruction", "Expression"],
    fields: {
        id: {
            validate: assertNodeType("Identifier"),
            optional: true
        },
        properties: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("ObjectProperty", "SpreadElement"))
            )
        }
    }
})

defineType("ObjectProperty", {
    visitor: ["key", "value"],
    aliases: ["Instruction", "Expression"],
    fields: {
        key: {
            validate: assertNodeType("Expression")
        },
        value: {
            validate: assertNodeOrValueType("null", "Expression")
        }
    },
})

defineType("CallExpression", {
    visitor: ["callee", "arguments"],
    aliases: ["Instruction", "Expression"],
    fields: {
        callee: {
            validate: assertNodeType("Expression")
        },
        arguments: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeOrValueType("null", "Expression"))
            )
        }
    },
})

defineType("NewExpression", {
    visitor: ["callee", "arguments"],
    aliases: ["Instruction", "Expression"],
    fields: {
        callee: {
            validate: assertNodeType("Expression")
        },
        arguments: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Expression"))
            )
        }
    },
})

defineType("FunctionDefinition", {
    builder: ["id", "parameters", "returnType", "body", "modifiers"],
    visitor: ["parameters", "body", "returnType"],
    aliases: ["Instruction", "Expression", "Declaration", "Scopable", "Statement"],
    fields: {
        id: {
            validate: assertNodeType("Expression"),
            optional: true
        },
        parameters: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeOrValueType("null", "VariableDeclaration"))
            )
        },
        modifiers: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeOrValueType("null", "string"))
            )
        },
        returnType: {
            validate: assertNodeType("Type")
        },
        body: {
            validate: assertNodeType("Instruction")
        }
    },
})

defineType("ClassDefinition", {
    visitor: ["body"],
    builder: ["id", "body", "supers"],
    aliases: ["Instruction", "Expression", "Declaration", "Scopable", "Statement"],
    fields: {
        id: {
            validate: assertNodeType("Identifier"),
            optional: true
        },
        supers: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeOrValueType("null", "Expression"))
            )
        },
        body: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeOrValueType("null", "Instruction"))
            )
        }
    },
})

defineType("VariableDeclaration", {
    visitor: ["id","init", "varType"],
    builder: ["id", "init", "cloned", "varType"],
    aliases: ["Instruction", "Expression", "Declaration", "Statement"],
    fields: {
        id: {
            validate: assertNodeType("Expression")
        },
        init: {
            validate: assertNodeType("Expression"),
            optional: true
        },
        cloned: {
            validate: assertValueType("boolean"),
            optional: true
        },
        varType: {
            validate: assertNodeType("Type")
        },
        variableParam: {
            validate: assertNodeType("boolean"),
            optional: true
        }
    },
})

defineType("DereferenceExpression", {
    visitor: ["argument"],
    aliases: ["Instruction", "Expression"],
    fields: {
        argument: {
            validate: assertNodeType("Expression")
        },
    }
})

defineType("ReferenceExpression", {
    visitor: ["argument"],
    aliases: ["Instruction", "Expression"],
    fields: {
        argument: {
            validate: assertNodeType("Expression")
        },
    }
})

defineType("ImportExpression", {
    aliases: ["Instruction", "Expression"],
    builder: ["from", "local", "imported"],
    fields: {
        from: {
            validate: assertNodeType("Literal")
        },
        local: {
            validate: assertNodeType("Identifier"),
            optional: true
        },
        imported: {
            validate: assertNodeType("Identifier", "Literal"),
            optional: true
        }
    }
})

defineType("SpreadElement", {
    visitor: ["argument"],
    aliases: ["Instruction", "Expression"],
    fields: {
        argument: {
            validate: assertNodeType("Expression")
        },
    }
})

defineType("YieldExpression", {
    visitor: ["argument"],
    builder: ["argument"],
    aliases: ["Instruction", "Statement", "Expression"],
    fields: {
        argument: {
            validate: assertNodeType("Expression"),
            optional: true
        },
    }
})

defineType("PackageDeclaration", {
    visitor: ["name"],
    builder: ["name"],
    aliases: ["Instruction", "Expression", "Declaration", "Statement"],
    fields: {
        name: {
            validate: assertNodeType("Expression")
        },
    }
})


defineType("PrimitiveType", {
    aliases: ["Type"],
    visitor: ["id", "typeArguments"],
    fields: {
        id: {
            validate: assertNodeType("Identifier")
        },
        typeArguments: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Type"))),
            optional: true
        },
        kind: {
            validate: assertOneOf("string", "number", "boolean", "null")
        },
    }
})

defineType("ArrayType", {
    visitor: ["id", "element", "typeArguments","size"],
    aliases: ["Type"],
    fields: {
        id: {
            validate: assertNodeType("Identifier")
        },
        typeArguments: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Type"))),
            optional: true
        },
        size: {
            validate: assertNodeType("Expression"),
            optional: true
        },
        element: {
            validate: assertNodeType("Type")
        }
    }
})

defineType("PointerType", {
    visitor: ["id", "element", "typeArguments"],
    aliases: ["Type"],
    fields: {
        id: {
            validate: assertNodeType("Identifier")
        },
        typeArguments: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Type"))),
            optional: true
        },
        kind: {
            validate: assertOneOf("pointer", "reference"),
        },
        element: {
            validate: assertNodeType("Type")
        }
    }
})

defineType("MapType", {
    visitor: ["id", "keyType", "valueType", "typeArguments"],
    aliases: ["Type"],
    fields: {
        id: {
            validate: assertNodeType("Identifier")
        },
        typeArguments: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Type"))),
            optional: true
        },
        keyType: {
            validate: assertNodeType("Type")
        },
        valueType: {
            validate: assertNodeType("Type")
        }
    }
})

defineType("ScopedType", {
    visitor: ["id", "scope", "typeArguments"],
    aliases: ["Type"],
    fields: {
        id: {
            validate: assertNodeType("Identifier")
        },
        typeArguments: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Type"))),
            optional: true
        },
        scope: {
            validate: assertNodeOrValueType("null", "Type")
        },
    }
})

defineType("TupleType", {
    visitor: ["id", "elements", "typeArguments"],
    aliases: ["Type"],
    fields: {
        id: {
            validate: assertNodeType("Identifier")
        },
        typeArguments: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Type"))),
            optional: true
        },
        elements: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Type"))
            )
        }
    }
})


defineType("ChanType", {
    visitor: ["id", "dir","valueType"],
    aliases: ["Type"],
    fields: {
        id: {
            validate: assertNodeType("Identifier")
        },
        dir: {
            validate: assertValueType("string")
        },
        valueType: {
            validate: assertNodeType("Type")
        },
    }
})

defineType("FuncType", {
    visitor: ["id", "typeParams","params","results"],
    aliases: ["Type"],
    fields: {
        id: {
            validate: assertNodeType("Identifier")
        },
        typeParams: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Type"))
            )
        },
        params: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Type"))
            )
        },
        results: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Type"))
            )
        },
    }
})

defineType("DynamicType", {
    visitor: ["id", "typeArguments"],
    builder: ["id"],
    aliases: ["Type"],
    fields: {
        id: {
            optional: true,
            validate: assertNodeType("Identifier")
        },
        typeArguments: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Type"))),
            optional: true
        },
    }
})

defineType("VoidType", {
    visitor: ["id", "typeArguments"],
    builder: ["id"],
    aliases: ["Type"],
    fields: {
        id: {
            optional: true,
            validate: assertNodeType("Identifier")
        },
        typeArguments: {
            validate: chain(
                assertValueType("array"),
                assertEach(assertNodeType("Type"))),
            optional: true
        },
    }
})




