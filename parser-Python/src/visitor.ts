import type { Node as SyntaxNode } from 'web-tree-sitter';
import type * as UAST from '@ant-yasa/uast-spec';

// Python's legacy UAST contains extensions (float/bytes, nullable locations and
// DynamicType string IDs) beyond the published spec. Keep that boundary explicit.
type Node = { type: UAST.Node['type']; loc: any; _meta: any; [key: string]: any };
const emptyLocation = () => ({ start: null, end: null, sourcefile: null });
const operators: Record<string, string> = {
    and: '&&',
    or: '||',
    not: '!',
    is: 'instanceof',
    'is not': '!instanceof',
    'not in': '!in',
};

export class Visitor {
    private temporary = 0;
    // Marks only the synthetic `+` nodes used to join f-string parts. A plain
    // BinaryExpression inside an interpolation (for example `{len(x) + 1}`)
    // must never be flattened as though it were part of the surrounding text.
    private readonly fStringJoins = new WeakSet<object>();
    private readonly lines: string[];
    constructor(
        private readonly source: string,
        private readonly sourcefile?: string
    ) {
        this.lines = source.split('\n');
    }

    private children(n: SyntaxNode): SyntaxNode[] {
        return n.namedChildren.filter((c) => !['comment', 'line_continuation'].includes(c.type));
    }
    private field(n: SyntaxNode, name: string): SyntaxNode | null {
        return n.childForFieldName(name);
    }
    private location(n: SyntaxNode): any {
        const position = (p: { row: number; column: number }) => ({
            line: p.row + 1,
            // web-tree-sitter uses UTF-16; CPython reports UTF-8 byte columns.
            column: Buffer.byteLength(this.lines[p.row].slice(0, p.column), 'utf8') + 1,
        });
        let endNode = n;
        while (endNode.children.length && endNode.type !== 'string') {
            const last = endNode.children
                .filter((c) => !['comment', 'line_continuation'].includes(c.type))
                .at(-1);
            if (!last) break;
            endNode = last;
        }
        return {
            start: position(n.startPosition),
            end: position(endNode.endPosition),
            sourcefile: this.sourcefile ?? null,
        };
    }
    private make(type: Node['type'], n: SyntaxNode | null, fields: Record<string, any> = {}): Node {
        // Call sites provide defaults and fields in legacy serialization order.
        return {
            loc: n ? this.location(n) : emptyLocation(),
            _meta: { isConstructor: false, isAsync: false, decorators: [], parameterKind: null },
            type,
            ...fields,
        };
    }
    private text(n: SyntaxNode): string {
        return this.source.slice(n.startIndex, n.endIndex);
    }
    private id(name: string, n: SyntaxNode | null = null): Node {
        if (n && n.type === 'identifier') name = this.text(n);
        return this.make('Identifier', n, { name });
    }
    private literal(value: any, literalType: string | null, n: SyntaxNode | null = null): Node {
        return this.make('Literal', n, { value, literalType });
    }
    private variable(
        id: any,
        init: any = null,
        n: SyntaxNode | null = null,
        varType = this.make('DynamicType', null, { id: null, typeArguments: null })
    ): Node {
        return this.make('VariableDeclaration', n, {
            id,
            varType,
            init,
            cloned: false,
            variableParam: false,
        });
    }
    private binary(operator: string, left: any, right: any, n: SyntaxNode | null = null): Node {
        return this.make('BinaryExpression', n, {
            operator: operators[operator] || operator,
            left,
            right,
        });
    }
    private isDocString(n: SyntaxNode): boolean {
        const child = this.children(n)[0];
        return (
            n.type === 'expression_statement' &&
            !!child &&
            ['string', 'concatenated_string'].includes(child.type) &&
            !child.text.match(/^[rub]*f/i)
        );
    }
    private statements(nodes: SyntaxNode[], skipStrings = false): Node[] {
        return nodes.flatMap((n) => {
            if (skipStrings && this.isDocString(n)) return [];
            const result = this.visit(n);
            return result == null ? [] : Array.isArray(result) ? result : [result];
        });
    }
    private block(n: SyntaxNode | null, skipStrings = false): Node {
        const children = n ? this.children(n) : [];
        if (n && children.length === 0)
            throw new SyntaxError(
                `${this.sourcefile || '<python>'}:${n.startPosition.row + 1}: expected a nonempty Python suite`
            );
        const result = this.make('ScopedStatement', null, {
            body: this.statements(children, skipStrings),
            id: null,
        });
        if (children.length) {
            const locations = children.map((c) => this.location(c));
            const visible = children
                .filter((c) => !skipStrings || !this.isDocString(c))
                .map((c) => this.location(c));
            result.loc = {
                start: {
                    line: locations[0].start.line,
                    column: visible.length
                        ? Math.min(...visible.map((l) => l.start.column)) - 1
                        : Number.MAX_SAFE_INTEGER,
                },
                end: {
                    line: locations.at(-1).end.line,
                    column: visible.length ? Math.max(...visible.map((l) => l.end.column)) - 1 : 0,
                },
                sourcefile: this.sourcefile ?? null,
            };
        }
        return result;
    }
    compile(n: SyntaxNode): UAST.Node {
        const children = this.children(n);
        // Preserve the legacy envelope; npm package version is exported separately.
        const result = this.make('CompileUnit', null, {
            body: this.statements(children, true),
            language: 'python',
            uri: null,
            version: null,
            languageVersion: '3.13',
        });
        if (children.length) {
            // Legacy Module derives its extent from its statements, excluding trailing whitespace.
            const locs = children.map((c) =>
                this.location(c.type === 'decorated_definition' ? this.field(c, 'definition')! : c)
            );
            result.loc = {
                start: {
                    line: locs[0].start.line,
                    column: Math.min(...locs.map((l) => l.start.column)),
                },
                end: {
                    line: locs.at(-1).end.line,
                    column: Math.max(...locs.map((l) => l.end.column)),
                },
                sourcefile: this.sourcefile ?? null,
            };
        } else result.loc.sourcefile = this.sourcefile ?? null;
        return result as UAST.Node;
    }

    private annotation(n: SyntaxNode | null): Node {
        if (!n) return this.make('DynamicType', null, { id: null, typeArguments: null });
        if (n.type === 'type') return this.annotation(this.children(n)[0]);
        if (n.type === 'splat_type')
            return this.make('SpreadElement', n, {
                argument: this.annotation(this.children(n)[0]),
            });
        if (n.type === 'union_type') {
            const args: Node[] = [];
            const collect = (child: SyntaxNode) => {
                if (child.type === 'union_type' || child.type === 'type')
                    this.children(child).forEach(collect);
                else args.push(this.annotation(child));
            };
            collect(n);
            return this.make('DynamicType', n, { id: 'Union', typeArguments: args });
        }
        if (n.type === 'none')
            return this.make('PrimitiveType', n, {
                id: this.id('PrimitiveType'),
                kind: 'null',
                typeArguments: null,
            });
        if (n.type === 'identifier') {
            const kind = (
                { int: 'number', float: 'number', str: 'string', bool: 'boolean' } as Record<
                    string,
                    string
                >
            )[n.text];
            if (kind)
                return this.make('PrimitiveType', n, {
                    id: this.id('PrimitiveType'),
                    kind,
                    typeArguments: null,
                });
            if (n.text === 'Any')
                return this.make('DynamicType', n, { id: 'Any', typeArguments: null });
            return this.make('ScopedType', n, {
                id: this.id(n.text, n),
                scope: null,
                typeArguments: null,
            });
        }
        if (n.type === 'binary_operator' && this.field(n, 'operator')?.text === '|') {
            const args: Node[] = [];
            const collect = (c: SyntaxNode) => {
                if (c.type === 'binary_operator' && this.field(c, 'operator')?.text === '|') {
                    collect(this.field(c, 'left')!);
                    collect(this.field(c, 'right')!);
                } else args.push(this.annotation(c));
            };
            collect(n);
            return this.make('DynamicType', n, { id: 'Union', typeArguments: args });
        }
        if (n.type === 'generic_type' || n.type === 'subscript') {
            const base = this.field(n, 'value') || this.children(n)[0];
            const name = base.text.split('.').at(-1)!;
            const args =
                n.type === 'generic_type'
                    ? this.children(this.children(n)[1])
                    : n.childrenForFieldName('subscript');
            const types = args.map((a) => this.annotation(a));
            if (['list', 'List'].includes(name))
                return this.make('ArrayType', n, {
                    id: this.id('ArrayType'),
                    element: types[0],
                    typeArguments: null,
                    size: null,
                });
            if (['dict', 'Dict'].includes(name))
                return this.make('MapType', n, {
                    id: this.id('MapType'),
                    keyType: types[0] ?? null,
                    valueType: types[1] ?? null,
                    typeArguments: null,
                });
            if (name === 'Callable' && args.length >= 2) {
                const first = args[0].type === 'type' ? this.children(args[0])[0] : args[0];
                if (first.type === 'ellipsis' || first.type === 'list')
                    types[0] = this.make('DynamicType', first, {
                        id: 'Params',
                        typeArguments:
                            first.type === 'ellipsis'
                                ? ['Any']
                                : this.children(first).map((c) => this.annotation(c)),
                    });
                else types.shift(); // Legacy Callable[P, R] retains only R.
            }
            return this.make('DynamicType', n, {
                id: name,
                typeArguments: types.length ? types : null,
            });
        }
        return this.visit(n);
    }

    private parameters(n: SyntaxNode | null): Node[] {
        if (!n) return [];
        const children = this.children(n);
        const slash = children.findIndex((c) => c.type === 'positional_separator');
        let keywordOnly = false;
        const result: Node[] = [];
        children.forEach((p, index) => {
            if (p.type === 'positional_separator') return;
            if (p.type === 'keyword_separator') {
                keywordOnly = true;
                return;
            }
            let name =
                this.field(p, 'name') ||
                this.children(p).find(
                    (c) => c.type === 'identifier' || c.type.endsWith('splat_pattern')
                ) ||
                p;
            const stars = p.text.startsWith('**') ? 2 : p.text.startsWith('*') ? 1 : 0;
            if (name.type.endsWith('splat_pattern')) name = this.children(name)[0];
            const kind =
                stars === 2
                    ? 'varkw'
                    : stars === 1
                      ? 'vararg'
                      : keywordOnly
                        ? 'keyword_only'
                        : index < slash
                          ? 'positional_only'
                          : 'positional_or_keyword';
            if (stars) keywordOnly = true;
            if (name.text === 'self') return;
            const param = this.variable(
                this.id(name.text, name),
                this.visit(this.field(p, 'value')),
                p,
                this.annotation(this.field(p, 'type'))
            );
            param._meta.parameterKind = kind;
            result.push(param);
        });
        return result;
    }

    private definition(n: SyntaxNode, decorators: Node[] = []): Node {
        const name = this.field(n, 'name')!;
        const id = this.id(this.text(name));
        id.loc = {
            start: { line: n.startPosition.row + 1, column: null },
            end: { line: n.startPosition.row + 1, column: null },
            sourcefile: this.sourcefile ?? null,
        };
        const bodyNode = this.field(n, 'body')!;
        if (!this.children(bodyNode).length)
            throw new SyntaxError(
                `${this.sourcefile || '<python>'}:${n.startPosition.row + 1}: expected a nonempty Python suite`
            );
        if (n.type === 'class_definition') {
            const body = this.statements(this.children(bodyNode));
            if (
                this.children(bodyNode).length === 1 &&
                this.children(bodyNode)[0].type === 'pass_statement'
            ) {
                const pass = this.children(bodyNode)[0];
                const ctor = this.make('FunctionDefinition', pass, {
                    parameters: [],
                    returnType: null,
                    body: this.make('ScopedStatement', pass, { body: [], id: null }),
                    id: this.id('__init__', pass),
                    modifiers: null,
                });
                ctor._meta.isConstructor = true;
                body.splice(0, 1, ctor);
            }
            const result = this.make('ClassDefinition', n, {
                body,
                supers: this.children(this.field(n, 'superclasses') || bodyNode)
                    .filter((c) => this.field(n, 'superclasses') && c.type !== 'keyword_argument')
                    .map((c) => this.visit(c)),
                id,
            });
            result._meta.decorators = decorators;
            const dataclass = decorators.some(
                (d) =>
                    d.name === 'dataclass' ||
                    (d.type === 'CallExpression' &&
                        (d.callee.name === 'dataclass' || d.callee.property?.name === 'dataclass'))
            );
            if (
                dataclass &&
                !body.some((d) => d.type === 'FunctionDefinition' && d.id?.name === '__init__')
            ) {
                const fields = this.children(bodyNode).flatMap((s) =>
                    this.children(s).filter(
                        (a) =>
                            a.type === 'assignment' &&
                            this.field(a, 'type') &&
                            this.field(a, 'left')?.type === 'identifier'
                    )
                );
                if (fields.length) {
                    const initBody = [
                        this.variable(this.id('self'), this.make('ThisExpression', null)),
                    ];
                    const parameters = fields.map((field) => {
                        const name = this.field(field, 'left')!.text;
                        const parameter = this.variable(
                            this.id(name, field),
                            this.visit(this.field(field, 'right')),
                            field,
                            this.annotation(this.field(field, 'type'))
                        );
                        parameter._meta.parameterKind = 'positional_or_keyword';
                        initBody.push(
                            this.make('AssignmentExpression', field, {
                                left: this.make('MemberAccess', null, {
                                    object: this.id('self'),
                                    property: this.id(name),
                                    computed: false,
                                }),
                                right: this.id(name),
                                operator: '=',
                                cloned: false,
                            })
                        );
                        return parameter;
                    });
                    const initId = this.id('__init__');
                    initId.loc = id.loc;
                    const ctor = this.make('FunctionDefinition', n, {
                        parameters,
                        returnType: null,
                        body: { ...this.block(bodyNode), body: initBody },
                        id: initId,
                        modifiers: null,
                    });
                    ctor.loc.start.column = null;
                    ctor.loc.end.column = null;
                    ctor._meta.isConstructor = true;
                    body.push(ctor);
                }
            }
            return result;
        }
        const params = this.field(n, 'parameters');
        const body = this.block(bodyNode, true);
        if (
            params &&
            this.children(params).some((p) => p.text === 'self' || /^self\s*:/.test(p.text))
        ) {
            body.body.unshift(this.variable(this.id('self'), this.make('ThisExpression', null)));
        }
        const result = this.make('FunctionDefinition', n, {
            parameters: this.parameters(params),
            returnType: this.field(n, 'return_type')
                ? this.annotation(this.field(n, 'return_type'))
                : null,
            body,
            id,
            modifiers: null,
        });
        result._meta.decorators = decorators;
        result._meta.isConstructor = name.text === '__init__';
        result._meta.isAsync = n.children[0]?.type === 'async';
        return result;
    }

    visit(n: SyntaxNode | null, restoredSplat = false): any {
        if (n && !restoredSplat && n.parent?.type === 'expression_list' &&
            this.text(n).startsWith('*') && n.type !== 'list_splat')
            return this.make('DereferenceExpression', n, { argument: this.visit(n, true) });
        if (!n) return null;
        const c = this.children(n);
        const f = (name: string) => this.field(n, name);
        const v = (name: string) => this.visit(f(name));
        switch (n.type) {
            case 'comment':
            case 'line_continuation':
                return null;
            case 'block':
                return this.block(n);
            case 'identifier':
            case 'dotted_name':
                return this.id(n.text, n);
            case 'type':
            case 'parenthesized_expression':
            case 'as_pattern_target':
                return this.visit(c[0]);
            case 'integer':
            case 'float': {
                const text = n.text.replaceAll('_', '');
                if (/[jJ]$/.test(text)) return this.literal('...', null, n);
                // Python integers are arbitrary precision, while JavaScript
                // Number silently rounds above Number.MAX_SAFE_INTEGER. Keep
                // an unsafe integer token as text; literalType='number'
                // preserves its Python/UAST meaning and downstream emitters
                // can reproduce the exact token.
                if (n.type === 'integer') {
                    try {
                        const integer = BigInt(text);
                        if (integer > BigInt(Number.MAX_SAFE_INTEGER) || integer < BigInt(Number.MIN_SAFE_INTEGER)) {
                            return this.literal(text, 'number', n);
                        }
                    } catch {
                        // Fall through to the existing finite-number handling.
                    }
                }
                const value = Number(text);
                return this.literal(
                    Number.isFinite(value) ? value : 'inf',
                    Number.isFinite(value) ? (n.type === 'float' ? 'float' : 'number') : 'string',
                    n
                );
            }
            case 'true':
            case 'false':
                return this.literal(n.type === 'true', 'boolean', n);
            case 'none':
            case 'ellipsis':
                return this.literal('...', null, n);
            case 'complex_pattern':
                return this.literal('...', null, n);
            case 'string':
                return this.string(n);
            case 'concatenated_string': {
                const parts = c
                    .map((child) => this.string(child))
                    .filter((part): part is Node => part !== null);
                if (!parts.length) return null;
                // CPython folds adjacent constant f-string pieces before the
                // legacy visitor sees them. Flatten the local '+' trees and
                // merge only adjacent string literals to retain that UAST
                // shape without changing interpolation order.
                const flatten = (part: any): Node[] =>
                    part?.type === 'BinaryExpression' &&
                    part.operator === '+' &&
                    this.fStringJoins.has(part)
                        ? [...flatten(part.left), ...flatten(part.right)]
                        : [part];
                const merged: Node[] = [];
                for (const part of parts.flatMap(flatten)) {
                    const previous: any = merged.at(-1);
                    if (
                        previous?.type === 'Literal' &&
                        previous.literalType === 'string' &&
                        part?.type === 'Literal' &&
                        part.literalType === 'string'
                    ) {
                        previous.value += part.value;
                        if (previous.loc?.end && part.loc?.end) previous.loc.end = part.loc.end;
                    } else merged.push(part);
                }
                if (merged.every((p) => p.type === 'Literal'))
                    return this.literal(
                        merged[0].literalType === 'bytes'
                            ? merged.flatMap((p) => p.value)
                            : merged.map((p) => p.value).join(''),
                        merged[0].literalType,
                        n
                    );
                return merged.reduce((a, b) => this.binary('+', a, b, n));
            }
            case 'expression_statement': {
                if (c.length > 1)
                    return this.make('ExpressionStatement', n, {
                        expression: this.make('TupleExpression', n, {
                            elements: c.map((x) => this.visit(x)),
                            modifiable: false,
                        }),
                    });
                const expression = this.visit(c[0]);
                return ['assignment', 'augmented_assignment'].includes(c[0].type)
                    ? expression
                    : this.make('ExpressionStatement', n, { expression });
            }
            case 'assignment': {
                if (f('type'))
                    return this.variable(v('left'), v('right'), n, this.annotation(f('type')));
                const assignments: Node[] = [];
                const targets: SyntaxNode[] = [];
                let current = n;
                while (current.type === 'assignment' && !this.field(current, 'type')) {
                    targets.push(this.field(current, 'left')!);
                    current = this.field(current, 'right')!;
                }
                for (const target of targets) {
                    const lefts = this.children(target),
                        rights = this.children(current);
                    if (
                        ['pattern_list', 'tuple_pattern', 'tuple'].includes(target.type) &&
                        ['expression_list', 'tuple'].includes(current.type) &&
                        lefts.length === rights.length
                    ) {
                        assignments.push(
                            ...lefts.map((left, i) =>
                                this.make('AssignmentExpression', null, {
                                    left: this.visit(left),
                                    right: this.visit(rights[i]),
                                    operator: '=',
                                    cloned: false,
                                })
                            )
                        );
                    } else {
                        const assign = this.make('AssignmentExpression', n, {
                            left: this.visit(target),
                            right: this.visit(current),
                            operator: '=',
                            cloned: false,
                        });
                        assign.loc.start = this.location(target).start;
                        assignments.push(assign);
                    }
                }
                return assignments.length === 1
                    ? assignments[0]
                    : this.make('Sequence', n, { expressions: assignments });
            }
            case 'augmented_assignment':
                return this.make('AssignmentExpression', n, {
                    left: v('left'),
                    right: this.binary(f('operator')!.text.slice(0, -1), v('left'), v('right')),
                    operator: '=',
                    cloned: false,
                });
            case 'named_expression':
                return this.variable(v('name'), v('value'), n);
            case 'binary_operator':
            case 'boolean_operator':
                return this.binary(f('operator')!.text, v('left'), v('right'), n);
            case 'comparison_operator': {
                const ops = n.childrenForFieldName('operators');
                const comparisons = ops.map((op, i) =>
                    this.binary(op.text, this.visit(c[i]), this.visit(c[i + 1]))
                );
                const result = comparisons.reduce((a, b) => this.binary('&&', a, b, n));
                result.loc = this.location(n);
                return result;
            }
            case 'not_operator':
            case 'unary_operator':
                // The bare-tuple compatibility parser uses a unary placeholder.
                // Its enclosing tuple item restores the splat around the whole
                // expression (e.g. *[None] * 3), not just the unary operand.
                if (n.type === 'unary_operator' && this.text(n).startsWith('*'))
                    return v('argument');
                return this.make('UnaryExpression', n, {
                    operator: operators[f('operator')?.text || 'not'] || f('operator')?.text,
                    argument: v('argument'),
                    isSuffix: false,
                });
            case 'attribute':
                return this.make('MemberAccess', n, {
                    object: v('object'),
                    property: this.id(this.text(f('attribute')!)),
                    computed: false,
                });
            case 'subscript': {
                const subs = n.childrenForFieldName('subscript');
                return this.make('MemberAccess', n, {
                    object: v('value'),
                    property:
                        subs.length === 1
                            ? this.visit(subs[0])
                            : this.make('Sequence', null, {
                                  expressions: subs.map((s) => this.visit(s)),
                              }),
                    computed: false,
                });
            }
            case 'slice': {
                const segments: any[] = [null, null, null];
                let index = 0;
                for (const child of n.children) {
                    if (child.type === ':') index++;
                    else if (child.isNamed) segments[index] = this.visit(child);
                }
                return this.make('SliceExpression', n, {
                    start: segments[0],
                    end: segments[1],
                    step: segments[2],
                });
            }
            case 'call': {
                const functionNode = f('function')!;
                if (functionNode?.text === 'super') return this.make('SuperExpression', n);
                const argumentsNode = f('arguments')!;
                const args = this.children(argumentsNode);
                const isKeyword = (a: SyntaxNode) =>
                    ['keyword_argument', 'dictionary_splat'].includes(a.type);
                // In a list such as `[*product(xs)]`, tree-sitter attaches the
                // splat node to the call's function field. The star applies to
                // the result of the complete call, not to the callee name.
                const result = this.make('CallExpression', n, {
                    callee: ['list_splat', 'dictionary_splat'].includes(functionNode.type)
                        ? this.visit(this.children(functionNode)[0])
                        : this.visit(functionNode),
                    arguments:
                        argumentsNode.type === 'generator_expression'
                            ? [this.visit(argumentsNode)]
                            : [...args.filter((a) => !isKeyword(a)), ...args.filter(isKeyword)].map(
                                  (a) => this.visit(a)
                              ),
                });
                if (functionNode.type === 'list_splat')
                    return this.make('DereferenceExpression', n, { argument: result });
                if (functionNode.type === 'dictionary_splat')
                    return this.make('SpreadElement', n, { argument: result });
                return result;
            }
            case 'keyword_argument':
                return this.variable(this.id(this.text(f('name')!)), v('value'), n);
            case 'list_splat':
            case 'list_splat_pattern':
                return this.make('DereferenceExpression', n, { argument: this.visit(c[0]) });
            case 'dictionary_splat':
            case 'dictionary_splat_pattern':
                return this.make('SpreadElement', n, { argument: this.visit(c[0]) });
            case 'tuple':
            case 'expression_list':
            case 'pattern_list':
            case 'tuple_pattern':
            case 'list_pattern':
                return this.make('TupleExpression', n, {
                    elements: c.map((x) => this.visit(x)),
                    modifiable: false,
                });
            case 'list':
            case 'set':
                return this.make('ObjectExpression', n, {
                    properties: c.map((x, i) =>
                        this.make('ObjectProperty', x, {
                            key: this.literal(i, 'number'),
                            value: this.visit(x),
                        })
                    ),
                    id: null,
                });
            case 'dictionary':
                return this.make('ObjectExpression', n, {
                    properties: c.map((x) =>
                        x.type === 'pair'
                            ? this.make('ObjectProperty', null, {
                                  key: this.visit(this.field(x, 'key')),
                                  value: this.visit(this.field(x, 'value')),
                              })
                            : this.make('SpreadElement', null, {
                                  argument: this.visit(this.children(x)[0]),
                              })
                    ),
                    id: null,
                });
            case 'conditional_expression':
                return this.make('ConditionalExpression', n, {
                    test: this.visit(c[1]),
                    consequent: this.visit(c[0]),
                    alternative: this.visit(c[2]),
                });
            case 'lambda': {
                let expression = f('body')!;
                while (expression.type === 'parenthesized_expression')
                    expression = this.children(expression)[0];
                return this.make('FunctionDefinition', n, {
                    parameters: this.parameters(f('parameters')),
                    returnType: null,
                    body: this.make('ScopedStatement', expression, {
                        body: [
                            this.make('ReturnStatement', expression, {
                                argument: this.visit(expression),
                                isYield: false,
                            }),
                        ],
                        id: null,
                    }),
                    id: null,
                    modifiers: null,
                });
            }
            case 'function_definition':
            case 'class_definition':
                return this.definition(n);
            case 'decorated_definition':
                return this.definition(
                    f('definition')!,
                    c
                        .filter((x) => x.type === 'decorator')
                        .map((x) => this.visit(this.children(x)[0]))
                );
            case 'return_statement':
                return this.make('ReturnStatement', n, {
                    argument: c.length ? this.visit(c[0]) : this.make('Noop', null),
                    isYield: false,
                });
            case 'raise_statement':
                return this.make('ThrowStatement', n, { argument: this.visit(c[0] || null) });
            case 'pass_statement':
                return this.make('Noop', n);
            case 'break_statement':
                return this.make('BreakStatement', n, { label: null });
            case 'continue_statement':
                return this.make('ContinueStatement', n, { label: null });
            case 'await':
                return this.visit(c[0]);
            case 'yield':
                return this.make('YieldExpression', n, {
                    argument: n.children.some((x) => x.type === 'from')
                        ? this.visit(c[0])
                        : c.map((x) => this.visit(x)),
                });
            case 'if_statement':
            case 'elif_clause': {
                const alternatives = c.filter((x) =>
                    ['elif_clause', 'else_clause'].includes(x.type)
                );
                let alternative: Node | null = null;
                for (const alt of alternatives.reverse()) {
                    if (alt.type === 'else_clause')
                        alternative = this.block(this.field(alt, 'body'));
                    else {
                        const branch = this.visit(alt);
                        branch.alternative = alternative;
                        branch.loc.end = this.location(n).end;
                        alternative = this.make('ScopedStatement', alt, { body: [branch], id: null });
                        alternative.loc = {
                            start: {
                                line: branch.loc.start.line,
                                column: branch.loc.start.column - 1,
                            },
                            end: { line: branch.loc.end.line, column: branch.loc.end.column - 1 },
                            sourcefile: this.sourcefile ?? null,
                        };
                    }
                }
                return this.make('IfStatement', n, {
                    test: v('condition'),
                    consequent: this.block(f('consequence')),
                    alternative,
                });
            }
            case 'while_statement':
                return this.make('WhileStatement', n, {
                    test: v('condition'),
                    body: this.block(f('body')),
                    isPostTest: false,
                });
            case 'for_statement': {
                const value = v('left');
                const result = this.make('RangeStatement', n, {
                    right: v('right'),
                    body: this.block(f('body')),
                    key: null,
                    value,
                });
                result._meta.isAsync = n.children[0]?.type === 'async';
                return result;
            }
            case 'import_statement':
            case 'import_from_statement':
            case 'future_import_statement':
                return this.imports(n);
            case 'assert_statement':
                return this.make('CallExpression', n, {
                    callee: this.id('assert', n),
                    arguments: c.map((x) => this.visit(x)),
                });
            case 'delete_statement':
                return this.make('Sequence', n, {
                    expressions: (c[0]?.type === 'expression_list' ? this.children(c[0]) : c).map(
                        (x) =>
                            this.make('UnaryExpression', x, {
                                operator: 'delete',
                                argument: this.visit(x),
                                isSuffix: false,
                            })
                    ),
                });
            case 'global_statement':
            case 'nonlocal_statement':
                return this.make('Sequence', n, {
                    expressions: c.map((x) => this.variable(x.text)),
                });
            case 'with_statement': {
                const items = this.children(c[0]).map((item) => {
                    const context = this.children(item)[0];
                    return context.type === 'as_pattern'
                        ? this.variable(
                              this.visit(this.field(context, 'alias')),
                              this.visit(this.children(context)[0]),
                              context
                          )
                        : this.make('Noop', context);
                });
                const result = this.make('Sequence', n, {
                    expressions: [...items, ...this.statements(this.children(f('body')!))],
                });
                result._meta.isAsync = n.children[0]?.type === 'async';
                return result;
            }
            case 'try_statement':
                return this.tryStatement(n);
            case 'list_comprehension':
            case 'set_comprehension':
            case 'dictionary_comprehension':
            case 'generator_expression':
                return this.comprehension(n);
            case 'match_statement':
                return this.make('SwitchStatement', n, {
                    discriminant: v('subject'),
                    cases: this.children(f('body')!).map((clause) => {
                        const guard = this.field(clause, 'guard');
                        const body = this.block(this.field(clause, 'consequence'));
                        const pattern = this.children(clause)[0];
                        const test = this.pattern(pattern);
                        const result = this.make('CaseClause', clause, {
                            body: guard
                                ? this.make('IfStatement', guard, {
                                      test: this.visit(this.children(guard)[0]),
                                      consequent: body,
                                      alternative: null,
                                  })
                                : body,
                            test,
                        });
                        const locs = [
                            pattern,
                            ...this.children(this.field(clause, 'consequence')!),
                        ].map((p) => this.location(p));
                        result.loc.start = {
                            line: locs[0].start.line,
                            column: Math.min(...locs.map((l) => l.start.column)),
                        };
                        result.loc.end.column = Math.max(...locs.map((l) => l.end.column));
                        return result;
                    }),
                });
            case 'type_alias_statement': {
                const left = this.children(c[0])[0];
                const name = left.type === 'generic_type' ? this.children(left)[0] : left;
                const id = this.visit(name);
                return this.make('ClassDefinition', n, {
                    body: null,
                    supers: [this.annotation(c[1])],
                    id,
                });
            }
            default:
                throw new SyntaxError(
                    `${this.sourcefile || '<python>'}:${n.startPosition.row + 1}: unsupported Python syntax: ${n.type}`
                );
        }
    }

    private imports(n: SyntaxNode): Node[] {
        const from = this.field(n, 'module_name');
        const fromText =
            n.type === 'future_import_statement'
                ? '__future__'
                : from
                  ? this.text(from)
                  : undefined;
        const names = n.childrenForFieldName('name');
        if (this.children(n).some((x) => x.type === 'wildcard_import'))
            names.push(this.children(n).find((x) => x.type === 'wildcard_import')!);
        return names.map((name) => {
            const importedName = this.text(this.field(name, 'name') || name);
            const local = this.id(
                this.field(name, 'alias') ? this.text(this.field(name, 'alias')!) : importedName,
                name
            );
            const imported = fromText
                ? this.id(importedName, name)
                : this.literal(importedName, 'string', name);
            return this.variable(
                local,
                this.make('ImportExpression', name, {
                    from: fromText ? this.literal(fromText, 'string', name) : null,
                    local: null,
                    imported,
                }),
                name
            );
        });
    }

    private pattern(n: SyntaxNode): Node {
        const c = this.children(n);
        switch (n.type) {
            case 'case_pattern':
                return c.length ? this.pattern(c[0]) : this.id(null as any, n);
            case 'dotted_name':
                return c.length === 1
                    ? this.id(n.text, n)
                    : c.slice(1).reduce(
                          (a, b) =>
                              this.make('MemberAccess', n, {
                                  object: a,
                                  property: this.id(b.text),
                                  computed: false,
                              }),
                          this.id(c[0].text, c[0])
                      );
            case 'list_pattern':
            case 'tuple_pattern':
                return this.make('Sequence', n, {
                    expressions: c.map((x) => this.variable(this.pattern(x))),
                });
            case 'splat_pattern':
                return this.make('SpreadElement', n, {
                    argument: this.id(c[0]?.text ?? (null as any)),
                });
            case 'union_pattern':
                return c.map((x) => this.pattern(x)).reduce((a, b) => this.binary('||', a, b, n));
            case 'as_pattern':
                return this.id(c.at(-1)!.text, n);
            case 'class_pattern':
                return this.make('CallExpression', n, {
                    callee: this.pattern(c[0]),
                    arguments: c.slice(1).map((p) => {
                        const x = p.type === 'case_pattern' ? this.children(p)[0] : p;
                        return x?.type === 'keyword_pattern'
                            ? this.variable(
                                  this.id(this.children(x)[0].text),
                                  this.pattern(this.children(x)[1])
                              )
                            : this.variable(this.pattern(p), null, p);
                    }),
                });
            case 'dict_pattern': {
                const keys = n.childrenForFieldName('key'),
                    values = n.childrenForFieldName('value');
                return this.make('ObjectExpression', n, {
                    properties: [
                        ...keys.map((key, i) =>
                            this.make('ObjectProperty', null, {
                                key: this.visit(key),
                                value: this.pattern(values[i]),
                            })
                        ),
                        ...c
                            .filter((x) => x.type === 'splat_pattern')
                            .map((x) => ({ ...this.pattern(x), loc: emptyLocation() })),
                    ],
                    id: null,
                });
            }
            case 'complex_pattern':
                return this.literal('...', null, n);
            case 'none':
                return this.literal(null, 'null', n);
            case 'true':
            case 'false':
                return this.literal(n.type === 'true' ? 'True' : 'False', 'boolean', n);
            default:
                return this.visit(n);
        }
    }

    private tryStatement(n: SyntaxNode): Node {
        const clauses = this.children(n).filter((c) => c.type === 'except_clause');
        const handlers = clauses.map((c) => {
            const value = this.field(c, 'value');
            const alias = value?.type === 'as_pattern' ? this.field(value, 'alias') : null;
            const type = alias ? this.children(value!)[0] : null;
            return this.make('CatchClause', c, {
                parameter: [
                    this.variable(
                        this.literal(alias?.text ?? null, 'string'),
                        this.visit(type),
                        alias ? type : value
                    ),
                ],
                body: this.block(this.children(c).find((x) => x.type === 'block') || null),
            });
        });
        const final = this.children(n).find((c) => c.type === 'finally_clause');
        const body = this.block(this.field(n, 'body'));
        // Preserve the legacy visitor's handler-derived Try body range.
        const locs = clauses.map((c) => this.location(c));
        body.loc = locs.length
            ? {
                  start: {
                      line: locs[0].start.line,
                      column: Math.min(...locs.map((l) => l.start.column)) - 1,
                  },
                  end: {
                      line: locs.at(-1).end.line,
                      column: Math.max(...locs.map((l) => l.end.column)) - 1,
                  },
                  sourcefile: this.sourcefile ?? null,
              }
            : null;
        const finalizer = this.block(final ? this.children(final)[0] : null);
        if (!final) finalizer.loc = null;
        return this.make('TryStatement', n, { body, handlers, finalizer });
    }

    private comprehension(n: SyntaxNode): Node {
        const bodyNode = this.field(n, 'body')!;
        const value =
            bodyNode.type === 'pair'
                ? this.make('ObjectExpression', null, {
                      properties: [
                          this.make('ObjectProperty', null, {
                              key: this.visit(this.field(bodyNode, 'key')),
                              value: this.visit(this.field(bodyNode, 'value')),
                          }),
                      ],
                      id: null,
                  })
                : this.visit(bodyNode);
        const temporary = this.id(`__tmp${++this.temporary}__`);
        const expressions: Node[] = [this.variable(temporary)];
        const clauses = this.children(n).filter((c) =>
            ['for_in_clause', 'if_clause'].includes(c.type)
        );
        if (clauses.filter((c) => c.type === 'for_in_clause').length === 1 && clauses.length <= 2) {
            // Keep the established single-generator shape consumed by Engine.
            const clause = clauses[0],
                condition = clauses[1] ? this.children(clauses[1])[0] : null;
            const left = this.field(clause, 'left')!,
                right = this.field(clause, 'right')!;
            const push = this.binary('push', temporary, value);
            const body = this.make('ScopedStatement', null, {
                body: condition
                    ? [
                          this.make('IfStatement', condition, {
                              test: this.visit(condition),
                              consequent: [push],
                              alternative: null,
                          }),
                      ]
                    : [push],
                id: null,
            });
            const condLoc = condition ? this.location(condition) : null;
            body.loc = condLoc
                ? {
                      start: { line: condLoc.start.line, column: condLoc.start.column - 1 },
                      end: { line: condLoc.end.line, column: condLoc.end.column - 1 },
                      sourcefile: this.sourcefile ?? null,
                  }
                : null;
            const loopValue = this.visit(left);
            const loop = this.make('RangeStatement', null, {
                right: this.visit(right),
                body,
                key: null,
                value: loopValue,
            });
            const locs = [left, right, ...(condition ? [condition] : [])].map((c) =>
                this.location(c)
            );
            loop.loc = {
                start: {
                    line: Math.min(...locs.map((l) => l.start.line)),
                    column: Math.min(...locs.map((l) => l.start.column)),
                },
                end: {
                    line: Math.max(...locs.map((l) => l.end.line)),
                    column: Math.max(...locs.map((l) => l.end.column)),
                },
                sourcefile: this.sourcefile ?? null,
            };
            expressions.push(loop, temporary);
            return this.make('Sequence', n, { expressions });
        }
        let destination = expressions;
        for (const clause of clauses) {
            const body = this.make('ScopedStatement', null, { body: [], id: null });
            if (clause.type === 'for_in_clause') {
                const value = this.visit(this.field(clause, 'left'));
                const loop = this.make('RangeStatement', clause, {
                    right: this.visit(this.field(clause, 'right')),
                    body,
                    key: null,
                    value,
                });
                loop._meta.isAsync = clause.children[0]?.type === 'async';
                destination.push(loop);
            } else
                destination.push(
                    this.make('IfStatement', clause, {
                        test: this.visit(this.children(clause)[0]),
                        consequent: body,
                        alternative: null,
                    })
                );
            destination = body.body;
        }
        destination.push(this.binary('push', temporary, value));
        expressions.push(temporary);
        return this.make('Sequence', n, { expressions });
    }

    private string(n: SyntaxNode): Node | null {
        const prefix = n.text.match(/^([rubft]*)/i)![1].toLowerCase();
        if (prefix.includes('t'))
            throw new SyntaxError('Python template strings are not supported');
        const quote =
            n.text.slice(prefix.length).startsWith('"""') ||
            n.text.slice(prefix.length).startsWith("'''")
                ? 3
                : 1;
        const decode = (text: string) =>
            prefix.includes('r')
                ? text
                : text.replace(
                      /\\(\r?\n|N\{[^}]*\}|x[\da-fA-F]{2}|u[\da-fA-F]{4}|U[\da-fA-F]{8}|[0-7]{1,3}|[\\'"abfnrtv])/g,
                      (_all, escape: string) => {
                          if (escape.startsWith('N{')) {
                              if (prefix.includes('b')) return '\\' + escape;
                              throw new SyntaxError('Named Unicode escapes are not supported');
                          }
                          const basic: Record<string, string> = {
                              '\\': '\\',
                              "'": "'",
                              '"': '"',
                              a: '\x07',
                              b: '\b',
                              f: '\f',
                              n: '\n',
                              r: '\r',
                              t: '\t',
                              v: '\v',
                              '\n': '',
                              '\r\n': '',
                          };
                          if (escape in basic) return basic[escape];
                          if (prefix.includes('b') && /^[uU]/.test(escape)) return '\\' + escape;
                          return String.fromCodePoint(
                              parseInt(
                                  /^[xuU]/.test(escape) ? escape.slice(1) : escape,
                                  /^[xuU]/.test(escape) ? 16 : 8
                              )
                          );
                      }
                  );
        if (!prefix.includes('f')) {
            const decoded = decode(n.text.slice(prefix.length + quote, -quote));
            return this.literal(
                prefix.includes('b') ? Array.from(Buffer.from(decoded, 'latin1')) : decoded,
                prefix.includes('b') ? 'bytes' : 'string',
                n
            );
        }
        const parts: Node[] = [];
        let precedingText: Node | undefined;
        for (const child of this.children(n)) {
            if (child.type === 'string_content') {
                precedingText = this.literal(
                    decode(child.text).replaceAll('{{', '{').replaceAll('}}', '}'),
                    'string',
                    child
                );
                parts.push(precedingText);
            }
            if (child.type === 'interpolation') {
                const equal = child.children.find((part) => part.type === '=');
                if (equal) {
                    // The debug label is original source text, not an escaped
                    // string: preserve whitespace and backslashes in expressions.
                    const boundary = child.children.find(
                        (part) => part.startIndex >= equal.endIndex
                    );
                    const start = child.startIndex + 1;
                    const end = boundary?.startIndex ?? child.endIndex - 1;
                    const label = this.source.slice(start, end);
                    const positionAt = (offset: number) => {
                        const before = this.source.slice(0, offset);
                        const newline = before.lastIndexOf('\n');
                        return {
                            line: before.split('\n').length,
                            column: Buffer.byteLength(before.slice(newline + 1), 'utf8') + 1,
                        };
                    };
                    if (precedingText) {
                        precedingText.value += label;
                        precedingText.loc.end = positionAt(end);
                    } else {
                        const literal = this.literal(label, 'string');
                        literal.loc = {
                            start: positionAt(start),
                            end: positionAt(end),
                            sourcefile: this.sourcefile ?? null,
                        };
                        parts.push(literal);
                    }
                }
                parts.push(this.visit(this.field(child, 'expression')));
                precedingText = undefined;
            }
        }
        // Empty JoinedStr is null in the existing Python UAST contract.
        if (!parts.length) return null;
        const result = parts.reduce((a, b) => {
            const join = this.binary('+', a, b);
            this.fStringJoins.add(join);
            return join;
        });
        if (!result.loc.start) result.loc = this.location(n);
        return result;
    }
}
