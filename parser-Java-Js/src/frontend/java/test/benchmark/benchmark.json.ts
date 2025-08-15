import { parse, parseImport, parsePackage, parseClass, parseClassBody, parseInstruction } from '../utils'

export default {
    _testCompilationUnit: {
        test: ``,
        expected: {
            "type": "CompileUnit",
            "body": [],
            "language": "java",
            "languageVersion": "17",
            "uri": "",
            "version": "0.1.53",
        },
        parse,
    },
    _testPackage: {
        test: `package java.xxx;`,
        expected: 'java.xxx',
        parse: parsePackage,
    },
    _testImport: {
        test: `import java.util.ArrayList;`,
        expected: {
            "type": "VariableDeclaration",
            "id": {
                "type": "Identifier",
                "name": "ArrayList",
            },
            "init": {
                "type": "ImportExpression",
                "from": {
                    "type": "Literal",
                    "value": "java.util",
                    "literalType": "string",
                },
                "local": {
                    "type": "Identifier",
                    "name": "ArrayList",
                },
                "imported": {
                    "type": "Identifier",
                    "name": "ArrayList",
                },
            },
            "cloned": false,
            "varType": {
                "type": "ScopedType",
                "id": {
                    "type": "Identifier",
                    "name": "java.util.ArrayList",
                },
                "scope": null,
                "typeArguments": null,
            },
        },
        parse: parseImport,
    },
    _testClassDeclaration: {
        test: `class Person {}`,
        expected: {
            "type": "ClassDefinition",
            "id": {
                "type": "Identifier",
                "name": "Person",
            },
            "body": [],
            "supers": [],
        },
        parse: parseClass,
    },
    _testAnnotationTypeDeclaration: {
        test: `@interface Person{}`,
        expected: {
            "type": "ClassDefinition",
            "id": {
                "type": "Identifier",
                "name": "Person"
            },
            "body": [],
            "supers": []
        },
        parse: parseClass,
    },
    _testInterfaceDeclaration: {
        test: `interface Person {}`,
        expected: {
            "type": "ClassDefinition",
            "id": {
                "type": "Identifier",
                "name": "Person",
            },
            "body": [
                {
                    "type": "ScopedStatement",
                    "body": [],
                    "id": null,
                }
            ],
            "supers": [],
        },
        parse: parseClass,
    },
    
    _testEnumDeclaration: {
        test: `enum Person {}`,
        expected: {
            "type": "ClassDefinition",
            "id": {
                "type": "Identifier",
                "name": "Person",
            },
            "body": [],
            "supers": [],
        },
        parse: parseClass,
    },
    _testRecordDeclaration: {
        test: `
        record Person(int a, int b){
            public void foo(){}
        }`,
        expected:
            {
                "type": "ClassDefinition",
                "id": {
                    "type": "Identifier",
                    "name": "Person",
                },
                "body": [
                    {
                        "type": "FunctionDefinition",
                        "id": {
                            "type": "Identifier",
                            "name": "foo",
                        },
                        "parameters": [],
                        "returnType": {
                            "type": "PrimitiveType",
                            "id": {
                                "type": "Identifier",
                                "name": "void",
                            },
                            "typeArguments": null,
                        },
                        "body": {
                            "type": "ScopedStatement",
                            "body": [],
                            "id": null,
                        },
                        "modifiers": [],
                    },
                    {
                        "type": "FunctionDefinition",
                        "id": {
                            "type": "Identifier",
                            "name": "__CTOR__",
                        },
                        "parameters": [
                            {
                                "type": "VariableDeclaration",
                                "id": {
                                    "type": "Identifier",
                                    "name": "a",
                                },
                                "init": null,
                                "cloned": false,
                                "varType": {
                                    "type": "PrimitiveType",
                                    "id": {
                                        "type": "Identifier",
                                        "name": "int",
                                    },
                                    "typeArguments": null,
                                },
                            },
                            {
                                "type": "VariableDeclaration",
                                "id": {
                                    "type": "Identifier",
                                    "name": "b",
                                },
                                "init": null,
                                "cloned": false,
                                "varType": {
                                    "type": "PrimitiveType",
                                    "id": {
                                        "type": "Identifier",
                                        "name": "int",
                                    },
                                    "typeArguments": null,
                                },
                            }
                        ],
                        "returnType": {
                            "type": "PrimitiveType",
                            "id": {
                                "type": "Identifier",
                                "name": "void",
                            },
                            "typeArguments": null,
                        },
                        "body": {
                            "type": "ScopedStatement",
                            "body": [
                                {
                                    "type": "AssignmentExpression",
                                    "left": {
                                        "type": "MemberAccess",
                                        "object": {
                                            "type": "ThisExpression",
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "a",
                                        },
                                        "computed": false,
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "a",
                                    },
                                    "operator": "=",
                                    "cloned": null,
                                },
                                {
                                    "type": "AssignmentExpression",
                                    "left": {
                                        "type": "MemberAccess",
                                        "object": {
                                            "type": "ThisExpression",
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "b",
                                        },
                                        "computed": false,
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "b",
                                    },
                                    "operator": "=",
                                    "cloned": null,
                                }
                            ],
                            "id": null,
                        },
                        "modifiers": [],
                        "_meta": {
                            "isConstructor": true
                        }
                    }
                ],
                "supers": [],
            }
        ,
        parse: parseClass,
    },
    _testIfStatement: {
        test: `if (test) {}else if (test2) { }else{}`,
        expected: {
            "type": "ScopedStatement",
            "body": [
                {
                    "type": "IfStatement",
                    "test": {
                        "type": "Identifier",
                        "name": "test",
                    },
                    "consequent": {
                        "type": "ScopedStatement",
                        "body": [],
                        "id": null,
                    },
                    "alternative": {
                        "type": "IfStatement",
                        "test": {
                            "type": "Identifier",
                            "name": "test2",
                        },
                        "consequent": {
                            "type": "ScopedStatement",
                            "body": [],
                            "id": null,
                        },
                        "alternative": {
                            "type": "ScopedStatement",
                            "body": [],
                            "id": null,
                        },
                    },
                }
            ],
            "id": null,
        },
        parse: parseInstruction,
    },
    _testWhileStatement: {
        test: `while(true){}`,
        expected: {
            "type": "ScopedStatement",
            "body": [
                {
                    "type": "WhileStatement",
                    "test": {
                        "type": "Literal",
                        "value": "true",
                        "literalType": "boolean",
                    },
                    "body": {
                        "type": "ScopedStatement",
                        "body": [],
                        "id": null,
                    },
                    "isPostTest": false,
                }
            ],
            "id": null,
        },
        parse: parseInstruction,
    },
    _testSwitchStatement: {
        test: `switch(a){case 1: break; default: return;}`,
        expected: {
            "type": "ScopedStatement",
            "body": [
                {
                    "type": "SwitchStatement",
                    "discriminant": {
                        "type": "Identifier",
                        "name": "a",
                    },
                    "cases": [
                        {
                            "type": "CaseClause",
                            "test": {
                                "type": "Literal",
                                "value": "1",
                                "literalType": "number",
                            },
                            "body": {
                                "type": "ScopedStatement",
                                "body": [
                                    {
                                        "type": "BreakStatement",
                                        "label": null,
                                    }
                                ],
                                "id": null,
                            },
                        },
                        {
                            "type": "CaseClause",
                            "test": {
                                "type": "Noop",
                            },
                            "body": {
                                "type": "ScopedStatement",
                                "body": [
                                    {
                                        "type": "ReturnStatement",
                                        "argument": null,
                                        "isYield": false,
                                    }
                                ],
                                "id": null,
                            },
                        }
                    ],
                }
            ],
            "id": null,
        },
        parse: parseInstruction,
    },
    _testForStatement: {
        test: `for(var i = 0; i < 10; i++) {}`,
        expected: {
            "type": "ScopedStatement",
            "body": [
                {
                    "type": "ForStatement",
                    "init": {
                        "type": "VariableDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "i",
                        },
                        "init": {
                            "type": "Literal",
                            "value": "0",
                            "literalType": "number",
                        },
                        "cloned": false,
                        "varType": {
                            "type": "DynamicType",
                            "id": null,
                        },
                    },
                    "test": {
                        "type": "BinaryExpression",
                        "operator": "<",
                        "left": {
                            "type": "Identifier",
                            "name": "i",
                        },
                        "right": {
                            "type": "Literal",
                            "value": "10",
                            "literalType": "number",
                        },
                    },
                    "update": {
                        "type": "UnaryExpression",
                        "operator": "++",
                        "argument": {
                            "type": "Identifier",
                            "name": "i",
                        },
                        "isSuffix": true,
                    },
                    "body": {
                        "type": "ScopedStatement",
                        "body": [],
                        "id": null,
                    },
                }
            ],
            "id": null,
        },
        parse: parseInstruction,
    },
    _testForRangeStatement: {
        test: `for(var i : foo) {}`,
        expected: {
            "type": "ScopedStatement",
            "body": [
                {
                    "type": "RangeStatement",
                    "key": null,
                    "value": {
                        "type": "Identifier",
                        "name": "i",
                    },
                    "right": {
                        "type": "Identifier",
                        "name": "foo",
                    },
                    "body": {
                        "type": "ScopedStatement",
                        "body": [],
                        "id": null,
                    },
                }
            ],
            "id": null,
        },
        parse: parseInstruction,
    },
    _testTryStatement: {
        test: `try{}catch(Exception e){}finally{}`,
        expected: {
            "type": "ScopedStatement",
            "body": [
                {
                    "type": "TryStatement",
                    "body": {
                        "type": "ScopedStatement",
                        "body": [],
                        "id": null
                    },
                    "handlers": [
                        {
                            "type": "CatchClause",
                            "parameter": [
                                {
                                    "type": "VariableDeclaration",
                                    "id": {
                                        "type": "Identifier",
                                        "name": "e"
                                    },
                                    "init": null,
                                    "cloned": false,
                                    "varType": {
                                        "type": "ScopedType",
                                        "id": {
                                            "type": "Identifier",
                                            "name": "Exception"
                                        },
                                        "scope": null,
                                        "typeArguments": null
                                    }
                                }
                            ],
                            "body": {
                                "type": "ScopedStatement",
                                "body": [],
                                "id": null
                            }
                        }
                    ],
                    "finalizer": {
                        "type": "ScopedStatement",
                        "body": [],
                        "id": null
                    }
                }
            ],
            "id": null
        },
        parse: parseInstruction,
    },
    _testSwitchExpression: {
        test: `switch(month){case 1 -> "Jan";default->"Oth";};`,
        expected: {
            "type": "ScopedStatement",
            "body": [
                {
                    "type": "SwitchStatement",
                    "discriminant": {
                        "type": "Identifier",
                        "name": "month"
                    },
                    "cases": [
                        {
                            "type": "CaseClause",
                            "test": {
                                "type": "Literal",
                                "value": "1",
                                "literalType": "number"
                            },
                            "body": {
                                "type": "ScopedStatement",
                                "body": [
                                    {
                                        "type": "Literal",
                                        "value": "\"Jan\"",
                                        "literalType": "string"
                                    }
                                ],
                                "id": null
                            }
                        },
                        {
                            "type": "CaseClause",
                            "test": null,
                            "body": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "FunctionDefinition",
                                    "id": null,
                                    "parameters": [],
                                    "returnType": {
                                        "type": "DynamicType",
                                        "id": null
                                    },
                                    "body": {
                                        "type": "ScopedStatement",
                                        "body": [
                                            {
                                                "type": "Literal",
                                                "value": "\"Oth\"",
                                                "literalType": "string"
                                            }
                                        ],
                                        "id": null
                                    },
                                    "modifiers": []
                                },
                                "arguments": []
                            }
                        }
                    ]
                }
            ],
            "id": null
        },
        parse: parseInstruction,
    },
    _testSwitchExpressionWithGuarded: {
        test: `switch(month){case String s && s=="Jan" -> "Jan";};`,
        expected: {
            "type": "ScopedStatement",
            "body": [
                {
                    "type": "SwitchStatement",
                    "discriminant": {
                        "type": "Identifier",
                        "name": "month"
                    },
                    "cases": [
                        {
                            "type": "CaseClause",
                            "test": {
                                "type": "Sequence",
                                "expressions": [
                                    {
                                        "type": "VariableDeclaration",
                                        "id": {
                                            "type": "Identifier",
                                            "name": "s"
                                        },
                                        "init": null,
                                        "cloned": false,
                                        "varType": {
                                            "type": "DynamicType",
                                            "id": null
                                        }
                                    },
                                    {
                                        "type": "BinaryExpression",
                                        "operator": "&&",
                                        "left": {
                                            "type": "BinaryExpression",
                                            "operator": "==",
                                            "left": {
                                                "type": "UnaryExpression",
                                                "operator": "typeof",
                                                "argument": {
                                                    "type": "Identifier",
                                                    "name": "month"
                                                },
                                                "isSuffix": true
                                            },
                                            "right": {
                                                "type": "Identifier",
                                                "name": "String"
                                            }
                                        },
                                        "right": {
                                            "type": "BinaryExpression",
                                            "operator": "==",
                                            "left": {
                                                "type": "Identifier",
                                                "name": "s"
                                            },
                                            "right": {
                                                "type": "Literal",
                                                "value": "\"Jan\"",
                                                "literalType": "string"
                                            }
                                        }
                                    }
                                ]
                            },
                            "body": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "FunctionDefinition",
                                    "id": null,
                                    "parameters": [
                                        {
                                            "type": "VariableDeclaration",
                                            "id": {
                                                "type": "Identifier",
                                                "name": "s"
                                            },
                                            "init": null,
                                            "cloned": false,
                                            "varType": {
                                                "type": "DynamicType",
                                                "id": null
                                            }
                                        }
                                    ],
                                    "returnType": {
                                        "type": "DynamicType",
                                        "id": null
                                    },
                                    "body": {
                                        "type": "ScopedStatement",
                                        "body": [
                                            {
                                                "type": "Literal",
                                                "value": "\"Jan\"",
                                                "literalType": "string"
                                            }
                                        ],
                                        "id": null
                                    },
                                    "modifiers": []
                                },
                                "arguments": [
                                    {
                                        "type": "Identifier",
                                        "name": "s"
                                    }
                                ]
                            }
                        }
                    ]
                }
            ],
            "id": null
        },
        parse: parseInstruction,
    },
    _testLamdaExpression: {
        test: `(int even, int odd) -> even + odd ;`,
        expected: {
            "type": "ScopedStatement",
            "body": [
                {
                    "type": "FunctionDefinition",
                    "id": null,
                    "parameters": [
                        {
                            "type": "VariableDeclaration",
                            "id": {
                                "type": "Identifier",
                                "name": "even"
                            },
                            "init": null,
                            "cloned": false,
                            "varType": {
                                "type": "PrimitiveType",
                                "id": {
                                    "type": "Identifier",
                                    "name": "int"
                                },
                                "typeArguments": null
                            }
                        },
                        {
                            "type": "VariableDeclaration",
                            "id": {
                                "type": "Identifier",
                                "name": "odd"
                            },
                            "init": null,
                            "cloned": false,
                            "varType": {
                                "type": "PrimitiveType",
                                "id": {
                                    "type": "Identifier",
                                    "name": "int"
                                },
                                "typeArguments": null
                            }
                        }
                    ],
                    "returnType": {
                        "type": "DynamicType",
                        "id": null
                    },
                    "body": {
                        "type": "ScopedStatement",
                        "body": [
                            {
                                "type": "BinaryExpression",
                                "operator": "+",
                                "left": {
                                    "type": "Identifier",
                                    "name": "even"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "odd"
                                }
                            }
                        ],
                        "id": null
                    },
                    "modifiers": []
                }
            ],
            "id": null
        },
        parse: parseInstruction,
    },
    _testAnnotationTypeDeclaration2: {
        test: `@Retention(RetentionPolicy.RUNTIME) public @interface TvmPermission {
    boolean isToken() default false;
}`,
        expected: {
            "type": "CompileUnit",
            "body": [
                {
                    "type": "ExportStatement",
                    "argument": {
                        "type": "ClassDefinition",
                        "id": {
                            "type": "Identifier",
                            "name": "TvmPermission"
                        },
                        "body": [
                            {
                                "type": "VariableDeclaration",
                                "id": {
                                    "type": "Identifier",
                                    "name": "isToken"
                                },
                                "init": {
                                    "type": "Literal",
                                    "value": "false",
                                    "literalType": "boolean"
                                },
                                "cloned": false,
                                "varType": {
                                    "type": "PrimitiveType",
                                    "id": {
                                        "type": "Identifier",
                                        "name": "boolean"
                                    },
                                    "typeArguments": null
                                }
                            }
                        ],
                        "supers": [],
                        "_meta": {
                            "annotations": [
                                {
                                    "type": "ScopedStatement",
                                    "body": [
                                        {
                                            "type": "VariableDeclaration",
                                            "id": {
                                                "type": "Identifier",
                                                "name": "Retention"
                                            },
                                            "init": {
                                                "type": "NewExpression",
                                                "callee": {
                                                    "type": "Identifier",
                                                    "name": "Retention"
                                                },
                                                "arguments": []
                                            },
                                            "cloned": false,
                                            "varType": {
                                                "type": "ScopedType",
                                                "id": {
                                                    "type": "Identifier",
                                                    "name": "Retention"
                                                },
                                                "scope": null,
                                                "typeArguments": null
                                            }
                                        },
                                        {
                                            "type": "MemberAccess",
                                            "object": {
                                                "type": "Identifier",
                                                "name": "RetentionPolicy"
                                            },
                                            "property": {
                                                "type": "Identifier",
                                                "name": "RUNTIME"
                                            },
                                            "computed": false
                                        }
                                    ],
                                    "id": null
                                }
                            ],
                            "modifiers": [
                                "public"
                            ]
                        }
                    },
                    "alias": {
                        "type": "Identifier",
                        "name": "TvmPermission"
                    }
                }
            ],
            "language": "java",
            "languageVersion": "17",
            "uri": "",
            "version": "0.1.53"
        },
        parse,
    }
    
}

