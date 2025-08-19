import ast
import sys

import uast.asttype as UNode


class UASTTransformer(ast.NodeTransformer):
    tmpVarIndex = 0
    sourcefile = ""

    def visit_Module(self, node):
        self.sourcefile = node.sourcefile
        body = []
        for i in range(len(node.body)):
            if (isinstance(node.body[i], ast.Expr) and isinstance(node.body[i].value, ast.Constant) and
                    isinstance(node.body[i].value.value, str)):  # 跳过文档字符串注释
                continue
            unode = self.packPos(node.body[i], self.visit(node.body[i]))
            if isinstance(unode, list):
                body.extend(unode)
            else:
                body.append(unode)
        return body

    def visit_FunctionDef(self, node):
        body = []

        params = self.packPos(node.args, self.visit(node.args))
        for param in node.args.args:
            # if param.arg == 'self' and node.name != '__init__':
            if param.arg == 'self':
                body.append(UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                                      UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), param.arg),
                                                      UNode.ThisExpression(UNode.SourceLocation(), UNode.Meta()), False,
                                                      UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))
        max_col = 0
        min_col = sys.maxsize
        for stmt in node.body:
            if (isinstance(stmt, ast.Expr) and isinstance(stmt.value, ast.Constant) and
                    isinstance(stmt.value.value, str)):  # 跳过文档字符串注释
                continue
            max_col = max(max_col, stmt.end_col_offset)
            min_col = min(min_col, stmt.col_offset)
            unode = self.packPos(stmt, self.visit(stmt))
            if isinstance(unode, list):
                body.extend(unode)
            else:
                body.append(unode)
        body_loc = None
        if len(node.body) > 0:
            body_loc = UNode.SourceLocation(UNode.Position(node.body[0].lineno, min_col),
                                            UNode.Position(node.body[-1].end_lineno, max_col), self.sourcefile)

        id = UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), node.name)
        id.loc = UNode.SourceLocation(UNode.Position(node.lineno, None), UNode.Position(node.lineno, None),
                                      self.sourcefile)
        if isinstance(node.returns, ast.Name):
            if node.returns.id == 'int' or node.returns.id == 'float':
                return_type = self.packPos(node.returns,
                                           UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(), 'PrimitiveType',
                                                               'number', None))
            elif node.returns.id == 'str':
                return_type = self.packPos(node.returns,
                                           UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(), 'PrimitiveType',
                                                               'string', None))
            elif node.returns.id == 'bool':
                return_type = self.packPos(node.returns,
                                           UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(), 'PrimitiveType',
                                                               'boolean', None))
            else:
                return_type = self.packPos(node.returns, self.visit(node.returns))
        else:
            return_type = None
        function_def = self.packPos(node,
                                    UNode.FunctionDefinition(UNode.SourceLocation(), UNode.Meta(), params, return_type,
                                                             UNode.ScopedStatement(body_loc, UNode.Meta(),
                                                                                   body), id,
                                                             None))
        if node.name == '__init__':
            function_def._meta.isConstructor = True
            # function_def.body.body.append(UNode.ReturnStatement(UNode.SourceLocation(), UNode.Meta(), UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), 'self')))
        decorator_list = []
        for decorator in node.decorator_list:
            decorator_list.append(self.packPos(decorator, self.visit(decorator)))
        function_def._meta.decorators = decorator_list
        return function_def

    def visit_ClassDef(self, node):
        name = UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), node.name)
        name.loc = UNode.SourceLocation(UNode.Position(node.lineno, None), UNode.Position(node.lineno, None),
                                        self.sourcefile)
        body = []
        body_loc = None
        if len(node.body) == 1 and isinstance(node.body[0], ast.Pass):  # 如果classDef中只有一句pass，默认加上一个__init__函数
            fdef = UNode.FunctionDefinition(UNode.SourceLocation(), UNode.Meta(), [], None,
                                            self.packPos(node.body[0],
                                                         UNode.ScopedStatement(UNode.SourceLocation(), UNode.Meta(),
                                                                               [])),
                                            self.packPos(node.body[0],
                                                         UNode.Identifier(UNode.SourceLocation(), UNode.Meta(),
                                                                          '__init__')),
                                            None)
            fdef._meta.isConstructor = True
            body.append(self.packPos(node.body[0], fdef))
            body_loc = UNode.SourceLocation(UNode.Position(node.body[0].lineno, node.body[0].col_offset),
                                            UNode.Position(node.body[0].end_lineno, node.body[0].end_col_offset),
                                            self.sourcefile)
        else:
            max_col = 0
            min_col = sys.maxsize
            for stmt in node.body:
                max_col = max(max_col, stmt.end_col_offset)
                min_col = min(min_col, stmt.col_offset)
                unode = self.packPos(stmt, self.visit(stmt))
                # if isinstance(stmt, ast.FunctionDef) and stmt.name == '__init__':
                #     for param in stmt.args.args:
                #         if param.arg == 'self':
                #             unode.body.body = [UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                #                                                         UNode.Identifier(UNode.SourceLocation(),
                #                                                                          UNode.Meta(),
                #                                                                          param.arg),
                #                                                         UNode.NewExpression(UNode.SourceLocation(),
                #                                                                             UNode.Meta(), name, []), False,
                #                                                         UNode.DynamicType(UNode.SourceLocation(),
                #                                                                           UNode.Meta()))] + unode.body.body

                if isinstance(unode, list):
                    body.extend(unode)
                else:
                    body.append(unode)
            if len(node.body) > 0:
                body_loc = UNode.SourceLocation(UNode.Position(node.body[0].lineno, min_col),
                                                UNode.Position(node.body[-1].end_lineno, max_col), self.sourcefile)

        super = []
        for base in node.bases:
            if isinstance(base, ast.Subscript):  # 暂不处理泛型
                unode = self.packPos(base, self.visit(base.value))
            else:
                unode = self.packPos(base, self.visit(base))
            if isinstance(unode, list):
                super.extend(unode)
            else:
                super.append(unode)
        class_def = self.packPos(node, UNode.ClassDefinition(UNode.SourceLocation(), UNode.Meta(), name,
                                                             body, super))
        decorator_list = []
        for decorator in node.decorator_list:
            decorator_list.append(self.packPos(decorator, self.visit(decorator)))
        class_def._meta.decorators = decorator_list
        return class_def

    def visit_Assign(self, node):
        exprs = []
        for index in range(len(node.targets)):
            if isinstance(node.targets[index], ast.Tuple) and isinstance(node.value, ast.Tuple):  # a, b = 1, 2
                if len(node.targets[index].elts) == len(node.value.elts):
                    for i in range(len(node.targets[index].elts)):
                        id = self.packPos(node.targets[index].elts[i], self.visit(node.targets[index].elts[i]))
                        init = self.packPos(node.value.elts[i], self.visit(node.value.elts[i]))
                        exprs.append(
                            UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(), id, init, False,
                                                      UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))
            else:  # a = b = 3
                id = self.packPos(node.targets[index], self.visit(node.targets[index]))
                init = self.packPos(node.value, self.visit(node.value))
                exprs.append(UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(), id, init, False,
                                                       UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))
        return exprs

    def visit_AsyncFunctionDef(self, node):
        func_def = self.packPos(node, self.visit_FunctionDef(node))
        func_def._meta.isAsync = True
        return func_def

    def visit_Eq(self, node):
        return "=="

    def visit_If(self, node):
        test = self.packPos(node.test, self.visit(node.test))
        cons_body = []
        max_col = 0
        min_col = sys.maxsize
        for stmt in node.body:
            max_col = max(max_col, stmt.end_col_offset)
            min_col = min(min_col, stmt.col_offset)
            unode = self.packPos(stmt, self.visit(stmt))
            if isinstance(unode, list):
                cons_body.extend(unode)
            else:
                cons_body.append(unode)
        cons_body_loc = None
        if len(node.body) > 0:
            cons_body_loc = UNode.SourceLocation(UNode.Position(node.body[0].lineno, min_col),
                                                 UNode.Position(node.body[-1].end_lineno, max_col), self.sourcefile)
        consequent = UNode.ScopedStatement(cons_body_loc, UNode.Meta(), cons_body)

        alter_body = []
        max_col = 0
        min_col = sys.maxsize
        for stmt in node.orelse:
            max_col = max(max_col, stmt.end_col_offset)
            min_col = min(min_col, stmt.col_offset)
            unode = self.packPos(stmt, self.visit(stmt))
            if isinstance(unode, list):
                alter_body.extend(unode)
            else:
                alter_body.append(unode)
        if len(node.orelse) > 0:
            alter_body_loc = UNode.SourceLocation(UNode.Position(node.orelse[0].lineno, min_col),
                                                  UNode.Position(node.orelse[-1].end_lineno, max_col), self.sourcefile)
            alternative = UNode.ScopedStatement(alter_body_loc, UNode.Meta(), alter_body)
        else:
            alternative = None
        return self.packPos(node,
                            UNode.IfStatement(UNode.SourceLocation(), UNode.Meta(), test, consequent, alternative))

    def visit_While(self, node):
        bodys = []
        for body in node.body:
            bodys.append(self.packPos(body, self.visit(body)))
        return self.packPos(node, UNode.WhileStatement(UNode.SourceLocation(), UNode.Meta(),
                                                       self.packPos(node.test, self.visit(node.test)), bodys))

    def visit_Gt(self, node):
        return ">"

    def visit_In(self, node):
        return "in"

    def visit_Is(self, node):
        return "instanceof"

    def visit_Lt(self, node):
        return "<"

    def visit_Or(self, node):
        return "||"

    def visit_Add(self, node):
        return "+"

    def visit_And(self, node):
        return "&&"

    def visit_arg(self, node):
        return self.packPos(node, UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), node.arg))

    def visit_Del(self, node):  # python 3.8之后被弃用
        targets = []
        for target in node.targets:
            targets.append(self.packPos(target, UNode.UnaryExpression(UNode.SourceLocation(), UNode.Meta(), "delete",
                                                                      self.packPos(target, self.visit(target)))))
        return self.packPos(node, UNode.Sequence(UNode.SourceLocation(), UNode.Meta(), targets))

    def visit_Div(self, node):
        return "/"

    def visit_For(self, node):
        right = self.packPos(node.iter, self.visit(node.iter))
        value = self.packPos(node.target, self.visit(node.target))
        max_col = 0
        min_col = sys.maxsize
        range_body = []
        for stmt in node.body:
            max_col = max(max_col, stmt.end_col_offset)
            min_col = min(min_col, stmt.col_offset)
            unode = self.packPos(stmt, self.visit(stmt))
            if isinstance(unode, list):
                range_body.extend(unode)
            else:
                range_body.append(unode)
        range_body_loc = None
        if len(node.body) > 0:
            range_body_loc = UNode.SourceLocation(UNode.Position(node.body[0].lineno, min_col),
                                                  UNode.Position(node.body[-1].end_lineno, max_col), self.sourcefile)
        body = UNode.ScopedStatement(range_body_loc, UNode.Meta(), range_body)
        return self.packPos(node, UNode.RangeStatement(UNode.SourceLocation(), UNode.Meta(), None, value, right, body))

    def visit_Mod(self, node):
        return "%"

    def visit_Not(self, node):
        return "!"

    def visit_BinOp(self, node):
        return self.packPos(node, UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(),
                                                         self.packPos(node.op, self.visit(node.op)),
                                                         self.packPos(node.left, self.visit(node.left)),
                                                         self.packPos(node.right, self.visit(node.right))))

    def visit_Name(self, node):
        return self.packPos(node, UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), node.id))

    def visit_Constant(self, node):
        literal_type = None
        if isinstance(node.value, str):
            literal_type = 'string'
        elif isinstance(node.value, bool):
            literal_type = 'boolean'
        elif isinstance(node.value, int):
            literal_type = 'number'
        elif isinstance(node.value, bytes):
            literal_type = 'bytes'
        elif isinstance(node.value, float):
            literal_type = 'float'
        if literal_type is not None:
            return self.packPos(node, UNode.Literal(UNode.SourceLocation(), UNode.Meta(), node.value, literal_type))
        else:
            return self.packPos(node, UNode.Literal(UNode.SourceLocation(), UNode.Meta(), "...", literal_type))

    def visit_arguments(self, node):
        arguments = []
        if len(node.args) >= len(node.defaults):
            num_non_default = len(node.args) - len(node.defaults)

            for i in range(len(node.args)):
                if node.args[i].arg == 'self':  # 跳过self 参数，self的参数的作用是在body中加上一句NewExpression
                    continue
                # 前 num_non_default 个参数没有默认值
                if i < num_non_default:
                    default_value = None
                # 后 len(node.defaults) 个参数有默认值
                else:
                    default_index = i - num_non_default  # 计算默认值索引
                    default_value = self.packPos(node.defaults[default_index], self.visit(node.defaults[default_index]))

                varType = UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())
                if node.args[i].annotation is not None:
                    varType = self.packPos(node.args[i].annotation, self.visit(node.args[i].annotation))

                arguments.append(
                    UNode.VariableDeclaration(
                        UNode.SourceLocation(),
                        UNode.Meta(),
                        self.packPos(node.args[i], self.visit(node.args[i])),
                        default_value,
                        False,
                        varType
                    )
                )
        if len(node.kw_defaults) == len(node.kwonlyargs):
            for i in range(len(node.kwonlyargs)):
                if node.kw_defaults[i] is not None:
                    default_value = self.packPos(node.kw_defaults[i], self.visit(node.kw_defaults[i]))
                else:
                    default_value = None
                arguments.append(
                    UNode.VariableDeclaration(
                        UNode.SourceLocation(),
                        UNode.Meta(),
                        self.packPos(node.kwonlyargs[i], self.visit(node.kwonlyargs[i])),
                        default_value,
                        False,
                        UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())
                    )
                )
        if node.vararg is not None:
            arguments.append(UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                                       self.packPos(node.vararg, self.visit(node.vararg)), None, False,
                                                       UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))
        if node.kwarg is not None:
            kwarg = self.visit(node.kwarg)
            kwarg._meta.isKwargs = True
            arguments.append(UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                                       self.packPos(node.kwarg, kwarg), None, False,
                                                       UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))
        return self.packPos(node, arguments)

    def visit_Attribute(self, node):
        return self.packPos(node, UNode.MemberAccess(UNode.SourceLocation(), UNode.Meta(),
                                                     self.packPos(node.value, self.visit(node.value)),
                                                     UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), node.attr)))

    def visit_Subscript(self, node):
        seq = []
        obj = self.packPos(node.value, self.visit(node.value))
        if isinstance(node.slice, ast.Tuple):
            for elt in node.slice.elts:
                seq.append(self.packPos(elt, self.visit(elt)))
            return self.packPos(node, UNode.MemberAccess(UNode.SourceLocation(), UNode.Meta(),
                                                         obj,
                                                         UNode.Sequence(UNode.SourceLocation(), UNode.Meta(), seq)))
        return self.packPos(node, UNode.MemberAccess(UNode.SourceLocation(), UNode.Meta(),
                                                     obj,
                                                     self.packPos(node.slice, self.visit(node.slice))))

    def visit_alias(self, node):
        name = self.packPos(node, UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), node.name))
        if node.asname is not None:
            asname = self.packPos(node, UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), node.asname))
            return self.packPos(node,
                                UNode.AssignmentExpression(UNode.SourceLocation(), UNode.Meta(), asname, name, "="))
        else:
            return name

    def visit_Assert(self, node):
        args = []
        args.append(self.packPos(node.test, self.visit(node.test)))
        if node.msg is not None:
            args.append(self.packPos(node.msg, self.visit(node.msg)))
        return self.packPos(node, UNode.CallExpression(UNode.SourceLocation(), UNode.Meta(), self.packPos(node,
                                                                                                          UNode.Identifier(
                                                                                                              UNode.SourceLocation(),
                                                                                                              UNode.Meta(),
                                                                                                              'assert')),
                                                       args))

    def visit_Await(self, node):
        return self.packPos(node.value, self.visit(node.value))  # todo 标记await

    def visit_Break(self, node):
        return self.packPos(node, UNode.BreakStatement(UNode.SourceLocation(), UNode.Meta(), None))

    def visit_Bytes(self, node):
        return self.packPos(node, UNode.Literal(UNode.SourceLocation(), UNode.Meta(), node.value, "bytes"))

    def visit_Delete(self, node):
        targets = []
        for target in node.targets:
            targets.append(self.packPos(target, UNode.UnaryExpression(UNode.SourceLocation(), UNode.Meta(), "delete",
                                                                      self.packPos(target, self.visit(target)))))
        return self.packPos(node, UNode.Sequence(UNode.SourceLocation(), UNode.Meta(), targets))

    def visit_Global(self, node):
        expressions = []
        for name in node.names:
            expressions.append(UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(), name, None, False,
                                                         UNode.DynamicType(UNode.SourceLocation(),
                                                                           UNode.Meta())))  # todo 缺失了global标注
        return self.packPos(node, UNode.Sequence(UNode.SourceLocation(), UNode.Meta(), expressions))

    def visit_Import(self, node):
        import_list = []
        for name in node.names:
            id = self.packPos(name, self.visit(name))
            if isinstance(id, UNode.AssignmentExpression):
                id = id.left
            import_list.append(self.packPos(name, UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(), id,
                                                                            self.packPos(name, UNode.ImportExpression(
                                                                                UNode.SourceLocation(),
                                                                                UNode.Meta(),
                                                                                None, None,
                                                                                self.packPos(name, UNode.Literal(
                                                                                    UNode.SourceLocation(),
                                                                                    UNode.Meta(),
                                                                                    name.name,
                                                                                    'string')))), False,
                                                                            UNode.DynamicType(UNode.SourceLocation(),
                                                                                              UNode.Meta()))))
        return import_list

    def visit_Index(self, node):  # python 3.8以后被弃用
        return self.packPos(node, UNode.Literal(UNode.SourceLocation(), UNode.Meta(), node.value, "int"))

    def visit_Invert(self, node):
        return "~"

    def visit_Lambda(self, node):
        params = self.packPos(node.args, self.visit(node.args))
        return self.packPos(node, UNode.FunctionDefinition(UNode.SourceLocation(), UNode.Meta(), params, None,
                                                           self.packPos(node.body,
                                                                        UNode.ReturnStatement(UNode.SourceLocation(),
                                                                                              UNode.Meta(),
                                                                                              self.packPos(node.body,
                                                                                                           self.visit(
                                                                                                               node.body))))))

    def visit_Match(self, node):
        cases = []
        for case in node.cases:
            cases.append(self.packPos(case, self.visit(case)))
        return self.packPos(node, UNode.SwitchStatement(UNode.SourceLocation(), UNode.Meta(),
                                                        self.packPos(node.subject, self.visit(node.subject)), cases))

    def visit_Param(self, node):  # python 3.8以后被弃用
        return self.packPos(node, UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), node.id))

    def visit_Raise(self, node):
        argument = None
        if node.exc is not None:
            argument = self.packPos(node.exc, self.visit(node.exc))
        return self.packPos(node, UNode.ThrowStatement(UNode.SourceLocation(), UNode.Meta(), argument))

    def visit_Return(self, node):
        if node.value is not None:
            return self.packPos(node, UNode.ReturnStatement(UNode.SourceLocation(), UNode.Meta(),
                                                            self.packPos(node.value, self.visit(node.value)), False))
        else:
            return self.packPos(node, UNode.ReturnStatement(UNode.SourceLocation(), UNode.Meta(),
                                                            UNode.Noop(UNode.SourceLocation(), UNode.Meta()), False))

    def visit_Slice(self, node):
        lower = upper = step = None
        if node.lower is not None:
            lower = self.packPos(node.lower, self.visit(node.lower))
        if node.upper is not None:
            upper = self.packPos(node.upper, self.visit(node.upper))
        if node.step is not None:
            step = self.packPos(node.step, self.visit(node.step))
        return self.packPos(node, UNode.SliceExpression(UNode.SourceLocation(), UNode.Meta(), lower, upper, step))

    def visit_Store(self, node):  # ctx 信息
        pass

    def visit_Suite(self, node):  # python2 节点
        pass

    def visit_Tuple(self, node):
        ele = []
        for elt in node.elts:
            ele.append(self.visit(elt))
        return self.packPos(node, UNode.TupleExpression(UNode.SourceLocation(), UNode.Meta(), ele))

    def visit_Yield(self, node):
        argument = []
        if node.value is not None:
            argument.append(self.packPos(node.value, self.visit(node.value)))
        return self.packPos(node, UNode.YieldExpression(UNode.SourceLocation(), UNode.Meta(),
                                                        argument))

    def visit_Expression(self, node):
        return self.packPos(node, UNode.ExpressionStatement(UNode.SourceLocation(), UNode.Meta(),
                                                            self.packPos(node.value, self.visit(node.value))))

    def visit_Interactive(self, node):  # 运行于交互模式
        pass

    def visit_comprehension(self, node):
        right = self.packPos(node.iter, self.visit(node.iter))
        value = self.packPos(node.target, self.visit(node.target))

        range_body = []
        max_col = 0
        min_col = sys.maxsize
        range_body_loc = None
        if node.ifs is not None and len(node.ifs) > 0:
            for ifs in node.ifs:
                max_col = max(max_col, ifs.end_col_offset)
                min_col = min(min_col, ifs.col_offset)
                range_body.append(
                    self.packPos(ifs, UNode.IfStatement(UNode.SourceLocation(), UNode.Meta(),
                                                        self.packPos(ifs, self.visit(ifs)), [])))
            range_body_loc = UNode.SourceLocation(UNode.Position(node.ifs[0].lineno, min_col),
                                                  UNode.Position(node.ifs[-1].end_lineno, max_col), self.sourcefile)
        body = UNode.ScopedStatement(range_body_loc, UNode.Meta(), range_body)
        return self.packPos(node, UNode.RangeStatement(UNode.SourceLocation(), UNode.Meta(), None, value, right, body))

    def visit_Continue(self, node):
        return self.packPos(node, UNode.ContinueStatement(UNode.SourceLocation(), UNode.Meta(), None))

    def visit_Ellipsis(self, node):  # 已被弃用
        return self.packPos(node, UNode.Literal(UNode.SourceLocation(), UNode.Meta(), "...", "string"))

    def visit_Nonlocal(self, node):
        exprs = []
        for name in node.names:
            exprs.append(UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(), name, None, False,
                                                   UNode.DynamicType(UNode.SourceLocation(),
                                                                     UNode.Meta())))  # todo 缺少了nonlocal的标记
        return self.packPos(node, UNode.Sequence(UNode.SourceLocation(), UNode.Meta(), exprs))

    def visit_withitem(self, node):  # 暂不处理
        if node.optional_vars is not None:
            return UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                             self.packPos(node.optional_vars, self.visit(node.optional_vars)),
                                             self.packPos(node.context_expr, self.visit(node.context_expr)), False,
                                             UNode.DynamicType(UNode.SourceLocation(), UNode.Meta()))
        else:
            return UNode.Noop(UNode.SourceLocation(), UNode.Meta())

    def visit_Num(self, node):  # python 3.8以后被弃用
        if isinstance(node.value, float):
            literal_type = 'float'
        elif isinstance(node.value, int):
            literal_type = 'int'
        return self.packPos(node, UNode.Literal(UNode.SourceLocation(), UNode.Meta(), node.n, literal_type))

    def visit_Pow(self, node):
        return "**"

    def visit_Set(self, node):
        objectProperty = []
        for i in range(len(node.elts)):
            objectProperty.append(
                self.packPos(node.elts[i], UNode.ObjectProperty(UNode.SourceLocation(), UNode.Meta(),
                                                                UNode.Literal(UNode.SourceLocation(), UNode.Meta(), i,
                                                                              "number"),
                                                                self.packPos(node.elts[i], self.visit(node.elts[i])))))
        return self.packPos(node, UNode.ObjectExpression(UNode.SourceLocation(), UNode.Meta(), objectProperty))

    def visit_Str(self, node):
        return UNode.Literal(UNode.SourceLocation(), UNode.Meta(), node.s, "string")

    def visit_Sub(self, node):
        return "-"

    def visit_Try(self, node):
        body = []
        for stmt in node.body:
            unode = self.packPos(stmt, self.visit(stmt))
            if isinstance(unode, list):
                body.extend(unode)
            else:
                body.append(unode)

        handler_list = []
        max_col = 0
        min_col = sys.maxsize
        for handler in node.handlers:
            max_col = max(max_col, handler.end_col_offset)
            min_col = min(min_col, handler.col_offset)
            handler_list.append(self.packPos(handler, self.visit(handler)))
        handler_loc = None
        if len(node.handlers) > 0:
            handler_loc = UNode.SourceLocation(UNode.Position(node.handlers[0].lineno, min_col),
                                               UNode.Position(node.handlers[-1].end_lineno, max_col), self.sourcefile)

        final_body = []
        max_col = 0
        min_col = sys.maxsize
        final_loc = None
        for final in node.finalbody:
            max_col = max(max_col, final.end_col_offset)
            min_col = min(min_col, final.col_offset)
            final_body.append(self.packPos(final, self.visit(final)))
        if len(node.finalbody) > 0:
            final_loc = UNode.SourceLocation(UNode.Position(node.finalbody[0].lineno, min_col),
                                             UNode.Position(node.finalbody[-1].end_lineno, max_col), self.sourcefile)

        return self.packPos(node, UNode.TryStatement(UNode.SourceLocation(), UNode.Meta(),
                                                     UNode.ScopedStatement(handler_loc,
                                                                           UNode.Meta(), body),
                                                     handler_list,
                                                     UNode.ScopedStatement(final_loc,
                                                                           UNode.Meta(), final_body)))

    def visit_Call(self, node):
        arguments = []
        for arg in node.args:
            u_arg = self.packPos(arg, self.visit(arg))
            if isinstance(u_arg, list):
                arguments.extend(u_arg)
            else:
                arguments.append(u_arg)

        for keyword in node.keywords:
            u_arg = self.packPos(keyword, self.visit(keyword))
            if isinstance(u_arg, list):
                arguments.extend(u_arg)
            else:
                arguments.append(u_arg)

        callee = self.packPos(node.func, self.visit(node.func))
        if isinstance(node.func, ast.Name):
            if node.func.id == 'super':
                return UNode.SuperExpression(UNode.SourceLocation(), UNode.Meta())

        return self.packPos(node, UNode.CallExpression(UNode.SourceLocation(), UNode.Meta(), callee, arguments))

    def visit_Dict(self, node):
        property = []
        if len(node.keys) == len(node.values):
            for i in range(len(node.keys)):
                if node.keys[i]:
                    key = self.packPos(node.keys[i], self.visit(node.keys[i]))
                    property.append(UNode.ObjectProperty(UNode.SourceLocation(), UNode.Meta(), key,
                                                         self.packPos(node.values[i], self.visit(node.values[i]))))
                else:
                    # todo需要考虑：
                    # params = {
                    #     'name': 'Tony'
                    #     'id': __taint_src,
                    # }
                    # taint_sink({**params})
                    property.append(UNode.SpreadElement(UNode.SourceLocation(), UNode.Meta(),
                                                        self.packPos(node.values[i], self.visit(node.values[i]))))
        return self.packPos(node, UNode.ObjectExpression(UNode.SourceLocation(), UNode.Meta(), property))

    def visit_Expr(self, node):
        return self.packPos(node, UNode.ExpressionStatement(UNode.SourceLocation(), UNode.Meta(),
                                                            self.packPos(node.value, self.visit(node.value))))

    def visit_List(self, node):
        objectProperty = []
        for i in range(len(node.elts)):
            objectProperty.append(
                self.packPos(node.elts[i], UNode.ObjectProperty(UNode.SourceLocation(), UNode.Meta(),
                                                                UNode.Literal(UNode.SourceLocation(), UNode.Meta(), i,
                                                                              "number"),
                                                                self.packPos(node.elts[i], self.visit(node.elts[i])))))
        return self.packPos(node, UNode.ObjectExpression(UNode.SourceLocation(), UNode.Meta(), objectProperty))

    def visit_Load(self, node):  # ctx 信息
        pass

    def visit_Mult(self, node):
        return "*"

    def visit_Pass(self, node):
        return self.packPos(node, UNode.Noop(UNode.SourceLocation(), UNode.Meta()))

    def visit_With(self, node):
        exprs = []
        for item in node.items:
            exprs.append(self.packPos(item, self.visit(item)))
        for stmt in node.body:
            unode = self.packPos(stmt, self.visit(stmt))
            if isinstance(unode, list):
                exprs.extend(unode)
            else:
                exprs.append(unode)

        return self.packPos(node, UNode.Sequence(UNode.SourceLocation(), UNode.Meta(), exprs))

    def visit_Compare(self, node):
        comp_val = []
        operator = []
        binary_expr_list = []
        if isinstance(node.comparators, list):
            for comp in node.comparators:
                comp_val.append(self.packPos(comp, self.visit(comp)))
        if isinstance(node.ops, list):
            for op in node.ops:
                operator.append(self.packPos(op, self.visit(op)))

        binary_expr_list.append(UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), operator[0],
                                                       self.packPos(node.left, self.visit(node.left)), comp_val[0]))
        if len(comp_val) > 1 and len(operator) > 1:
            for i in range(len(node.comparators)):
                if i == 0:
                    continue
                binary_expr_list.append(
                    UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), operator[i], comp_val[i - 1],
                                           comp_val[i]))

        test = binary_expr_list[0]
        for i in range(len(binary_expr_list)):
            if i == 0:
                continue
            test = self.packPos(node, UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), "&&", test,
                                                             binary_expr_list[i]))
        return test

    def visit_keyword(self, node):
        # todo 当函数调用使用 **kwargs 展开一个字典时，node.arg 的值为 None
        return self.packPos(node, UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                                            UNode.Identifier(UNode.SourceLocation(), UNode.Meta(),
                                                                             node.arg),
                                                            self.packPos(node.value, self.visit(node.value)),
                                                            False,
                                                            UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))

    def visit_Starred(self, node):
        return self.packPos(node, UNode.DereferenceExpression(UNode.SourceLocation(), UNode.Meta(),
                                                              self.packPos(node.value, self.visit(node.value))))

    def visit_AnnAssign(self, node):
        vartype = UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())
        if node.annotation is not None:
            if isinstance(node.annotation, ast.Name):
                if node.annotation.id == "float" or node.annotation.id == "int":
                    vartype = self.packPos(node.annotation,
                                           UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(), "number"))
                elif node.annotation.id == "str":
                    vartype = self.packPos(node.annotation,
                                           UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(), "string"))
                elif node.annotation.id == "bool":
                    vartype = self.packPos(node.annotation,
                                           UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(), "boolean"))
            elif isinstance(node.annotation, ast.Subscript):
                keyType = valType = None
                if isinstance(node.annotation.value, ast.Name):
                    if node.annotation.value.id == "dict":
                        if isinstance(node.annotation.slice, ast.Tuple):
                            if len(node.annotation.slice.elts) == 2:
                                if isinstance(node.annotation.slice.elts[0], ast.Name):
                                    if node.annotation.slice.elts[0].id == "float" or node.annotation.slice.elts[
                                        0].id == "int":
                                        keyType = self.packPos(node.annotation.slice.elts[0],
                                                               UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(),
                                                                                   "number"))
                                    elif node.annotation.slice.elts[0].id == "str":
                                        keyType = self.packPos(node.annotation.slice.elts[0],
                                                               UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(),
                                                                                   "string"))
                                    elif node.annotation.slice.elts[0].id == "bool":
                                        keyType = self.packPos(node.annotation.slice.elts[0],
                                                               UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(),
                                                                                   "boolean"))
                                if isinstance(node.annotation.slice.elts[0], ast.Subscript):
                                    if isinstance(node.annotation.slice.elts[0].value, ast.Name) and \
                                            node.annotation.slice.elts[0].value.id == 'tuple':
                                        keyType = self.packPos(node.annotation.slice.elts[0],
                                                               UNode.ArrayType(UNode.SourceLocation(), UNode.Meta(),
                                                                               UNode.Identifier(UNode.SourceLocation(),
                                                                                                UNode.Meta(),
                                                                                                node.annotation.slice.elts[
                                                                                                    0].slice.elts[
                                                                                                    0].id)))
                                if isinstance(node.annotation.slice.elts[1], ast.Name):
                                    if node.annotation.slice.elts[1].id == "float" or node.annotation.slice.elts[
                                        1].id == "int":
                                        valType = self.packPos(node.annotation.slice.elts[1],
                                                               UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(),
                                                                                   "number"))
                                    elif node.annotation.slice.elts[1].id == "str":
                                        valType = self.packPos(node.annotation.slice.elts[1],
                                                               UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(),
                                                                                   "string"))
                                    elif node.annotation.slice.elts[1].id == "bool":
                                        valType = self.packPos(node.annotation.slice.elts[1],
                                                               UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(),
                                                                                   "boolean"))
                        vartype = UNode.MapType(UNode.SourceLocation(), UNode.Meta(), keyType, valType)
            elif isinstance(node.annotation, ast.List):
                eleType = None
                if node.annotation.elts is not None and len(node.annotation.elts) > 0:
                    if isinstance(node.annotation.elts[0], ast.Name):
                        if node.annotation.elts[0].id == "float" or node.annotation.elts[0].id == "int":
                            eleType = self.packPos(node.annotation.elts[0],
                                                   UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(), "number"))
                        elif node.annotation.elts[0].id == "str":
                            eleType = self.packPos(node.annotation.elts[0],
                                                   UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(), "string"))
                        elif node.annotation.elts[0].id == "bool":
                            eleType = self.packPos(node.annotation.elts[0],
                                                   UNode.PrimitiveType(UNode.SourceLocation(), UNode.Meta(), "boolean"))
                vartype = UNode.ArrayType(UNode.SourceLocation(), UNode.Meta(), eleType)

        init = None
        if node.value is not None:
            init = self.packPos(node.value, self.visit(node.value))
        return self.packPos(node, UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                                            self.packPos(node.target, self.visit(node.target)), init,
                                                            False, vartype))

    def visit_AsyncWith(self, node):
        withstmt = self.packPos(node, self.visit_With(node))
        withstmt._meta.isAsync = True
        return withstmt

    def visit_AugAssign(self, node):
        return self.packPos(node, UNode.AssignmentExpression(UNode.SourceLocation(), UNode.Meta(),
                                                             self.packPos(node.target, self.visit(node.target)),
                                                             UNode.BinaryExpression(UNode.SourceLocation(),
                                                                                    UNode.Meta(),
                                                                                    self.packPos(node.op,
                                                                                                 self.visit(node.op)),
                                                                                    self.packPos(node.target,
                                                                                                 self.visit(
                                                                                                     node.target)),
                                                                                    self.packPos(node.value, self.visit(
                                                                                        node.value))), "="))

    def visit_JoinedStr(self, node):
        tmp = None
        if len(node.values) >= 2:
            tmp = UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), '+',
                                         self.packPos(node.values[0], self.visit(node.values[0])),
                                         self.packPos(node.values[1], self.visit(node.values[1])))
            for i in range(len(node.values)):
                if i <= 1:
                    continue
                tmp = UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), '+', tmp,
                                             self.packPos(node.values[i], self.visit(node.values[i])))
        elif len(node.values) == 1:
            tmp = self.packPos(node.values[0], self.visit(node.values[0]))
        return tmp

    def visit_MatchStar(self, node):
        return self.packPos(node, UNode.SpreadElement(UNode.SourceLocation(), UNode.Meta(),
                                                      UNode.Identifier(UNode.SourceLocation(), UNode.Meta(),
                                                                       node.name)))

    def visit_NamedExpr(self, node):
        return self.packPos(node, UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                                            self.packPos(node.target, self.visit(node.target)),
                                                            self.packPos(node.value, self.visit(node.value)), False,
                                                            UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))

    def visit_ParamSpec(self, node):  # 不和ast node挂钩
        pass

    def visit_IfExp(self, node):
        return self.packPos(node, UNode.ConditionalExpression(UNode.SourceLocation(), UNode.Meta(),
                                                              self.packPos(node.test, self.visit(node.test)),
                                                              self.packPos(node.body, self.visit(node.body)),
                                                              self.packPos(node.orelse, self.visit(node.orelse))))

    def visit_TypeAlias(self, node):
        supers = []
        supers.append(self.packPos(node.value, self.visit(node.value)))
        return self.packPos(node, UNode.ClassDefinition(UNode.SourceLocation(), UNode.Meta(),
                                                        self.packPos(node.name, self.visit(node.name)), None, supers))

    def visit_YieldFrom(self, node):
        return self.packPos(node, UNode.YieldExpression(UNode.SourceLocation(), UNode.Meta(),
                                                        self.packPos(node.value, self.visit(node.value))))

    def visit_BitAnd(self, node):
        return "&"

    def visit_BitOr(self, node):
        return "|"

    def visit_BitXor(self, node):
        return "^"

    def visit_BoolOp(self, node):
        if len(node.values) >= 2:
            binaryExpr = UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(),
                                                self.packPos(node.op, self.visit(node.op)),
                                                self.packPos(node.values[0], self.visit(node.values[0])),
                                                self.packPos(node.values[1], self.visit(node.values[1])))
            if len(node.values) == 2:
                return self.packPos(node, binaryExpr)
            elif len(node.values) > 2:
                i = 2
                while i < len(node.values):
                    binaryExpr = UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(),
                                                        self.packPos(node.op, self.visit(node.op)), binaryExpr,
                                                        self.packPos(node.values[i], self.visit(node.values[i])))
                    i += 1
                return self.packPos(node, binaryExpr)

    def visit_IsNot(self, node):
        return "!instanceof"

    def visit_LShift(self, node):
        return "<<"

    def visit_NotEq(self, node):
        return "!="

    def visit_NotIn(self, node):
        return "!in"

    def visit_RShift(self, node):
        return ">>"

    def visit_GeneratorExp(self, node):
        ele = self.packPos(node.elt, self.visit(node.elt))
        expressions = []
        expressions.append(UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                                     UNode.Identifier(UNode.SourceLocation(), UNode.Meta(),
                                                                      self.createTmpVariableName()),
                                                     None, False,
                                                     UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))
        tmpVar = UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), self.getTmpVariableName())
        for generator in node.generators:
            range_stmt = self.packPos(generator, self.visit(generator))
            if generator.ifs is not None and len(generator.ifs) > 0:
                if len(range_stmt.body.body) > 0 and isinstance(range_stmt.body.body[0], UNode.IfStatement):
                    range_stmt.body.body[0].consequent.append(
                        UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), "push", tmpVar,
                                               ele))
            else:
                range_stmt.body.body.append(
                    UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), "push", tmpVar,
                                           ele))
            expressions.append(range_stmt)
        expressions.append(tmpVar)
        return self.packPos(node, UNode.Sequence(UNode.SourceLocation(), UNode.Meta(), expressions))

    def visit_ImportFrom(self, node):
        import_path = ''
        for i in range(node.level):
            import_path += '.'
        if node.module is not None:
            import_path += node.module
        import_list = []
        for name in node.names:
            id = self.packPos(name, self.visit(name))
            if isinstance(name, ast.alias) and name.asname is not None:
                alias_id = id.left
                imported = id.right
            else:
                alias_id = imported = id
            import_list.append(
                self.packPos(name, UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(), alias_id,
                                                             self.packPos(name,
                                                                          UNode.ImportExpression(UNode.SourceLocation(),
                                                                                                 UNode.Meta(),
                                                                                                 self.packPos(name,
                                                                                                              UNode.Literal(
                                                                                                                  UNode.SourceLocation(),
                                                                                                                  UNode.Meta(),
                                                                                                                  import_path,
                                                                                                                  'string')),
                                                                                                 None, imported)),
                                                             False,
                                                             UNode.DynamicType(UNode.SourceLocation(), UNode.Meta()))))
        return import_list

    def visit_match_case(self, node):
        bodys = []
        max_col = 0
        min_col = sys.maxsize
        for body in node.body:
            max_col = max(max_col, body.end_col_offset)
            min_col = min(min_col, body.col_offset)
            bodys.append(self.packPos(body, self.visit(body)))
        body_loc = None
        if len(node.body) > 0:
            body_loc = UNode.SourceLocation(UNode.Position(node.body[0].lineno, min_col),
                                            UNode.Position(node.body[-1].end_lineno, max_col), self.sourcefile)
        return self.packPos(node, UNode.CaseClause(UNode.SourceLocation(), UNode.Meta(),
                                                   self.packPos(node.pattern, self.visit(node.pattern)),
                                                   UNode.ScopedStatement(body_loc, UNode.Meta(), bodys)))

    def visit_MatchClass(self, node):
        arguments = []
        if node.patterns is not None:
            for pattern in node.patterns:
                arguments.append(self.packPos(pattern, UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                                                                 self.packPos(pattern,
                                                                                              self.visit(pattern)),
                                                                                 None, False,
                                                                                 UNode.DynamicType(
                                                                                     UNode.SourceLocation(),
                                                                                     UNode.Meta()))))
        if node.kwd_patterns is not None and node.kwd_attrs is not None:
            if len(node.kwd_patterns) == len(node.kwd_attrs):
                for i in range(len(node.kwd_patterns)):
                    arguments.append(UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                                               UNode.Identifier(UNode.SourceLocation(), UNode.Meta(),
                                                                                node.kwd_attrs[i]),
                                                               self.packPos(node.kwd_patterns[i],
                                                                            self.visit(node.kwd_patterns[i])), False,
                                                               UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))
        return self.packPos(node, UNode.CallExpression(UNode.SourceLocation(), UNode.Meta(),
                                                       self.packPos(node.cls, self.visit(node.cls)),
                                                       arguments))

    def visit_MatchMapping(self, node):
        test = []
        if len(node.keys) == len(node.patterns):
            for i in range(len(node.patterns)):
                test.append(UNode.ObjectProperty(UNode.SourceLocation(), UNode.Meta(),
                                                 self.packPos(node.keys[i], self.visit(node.keys[i])),
                                                 self.packPos(node.patterns[i], self.visit(node.patterns[i]))))
        if node.rest is not None:
            test.append(
                UNode.SpreadElement(UNode.SourceLocation(), UNode.Meta(),
                                    UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), node.rest)))
        return self.packPos(node, UNode.ObjectExpression(UNode.SourceLocation(), UNode.Meta(), test))

    def visit_MatchValue(self, node):
        return self.packPos(node.value, self.visit(node.value))

    def visit_NameConstant(self, node):  # 不与ast node挂钩
        pass

    def visit_TypeIgnore(self, node):  # 用于类型检查器忽略某行的检查
        pass

    def visit_UnaryOp(self, node):
        return self.packPos(node, UNode.UnaryExpression(UNode.SourceLocation(), UNode.Meta(),
                                                        self.packPos(node.op, self.visit(node.op)),
                                                        self.packPos(node.operand, self.visit(node.operand))))

    def visit_ExceptHandler(self, node):
        body = []
        for stmt in node.body:
            unode = self.packPos(stmt, self.visit(stmt))
            if isinstance(unode, list):
                body.extend(unode)
            else:
                body.append(unode)
        type = None
        if node.type is not None and node.name is not None:
            type = self.packPos(node.type, self.visit(node.type))
        parameter = []
        parameter.append(self.packPos(node.type, UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                                                           UNode.Literal(UNode.SourceLocation(),
                                                                                         UNode.Meta(),
                                                                                         node.name, "string"),
                                                                           type, False,
                                                                           UNode.DynamicType(UNode.SourceLocation(),
                                                                                             UNode.Meta()))))
        return self.packPos(node, UNode.CatchClause(UNode.SourceLocation(), UNode.Meta(), parameter,
                                                    body))

    def visit_FormattedValue(self, node):
        return self.packPos(node.value, self.visit(node.value))

    def visit_MatchSequence(self, node):
        exprs = []
        for pattern in node.patterns:
            exprs.append(UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                                   self.packPos(pattern, self.visit(pattern)), None, False,
                                                   UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))
        return self.packPos(node, UNode.Sequence(UNode.SourceLocation(), UNode.Meta(), exprs))

    def visit_MatchSingleton(self, node):
        if node.value is None:
            return UNode.Literal(UNode.SourceLocation(), UNode.Meta(), None, "null")
        elif node.value is True:
            return UNode.Literal(UNode.SourceLocation(), UNode.Meta(), "True", "boolean")
        elif node.value is False:
            return UNode.Literal(UNode.SourceLocation(), UNode.Meta(), "False", "boolean")

    def visit_AsyncFor(self, node):
        forstmt = self.packPos(node, self.visit_For(node))
        forstmt._meta.isAsync = True
        return forstmt

    def visit_AugStore(self, node):  # ctx 信息
        pass

    def visit_DictComp(self, node):
        ele = []
        ele.append(
            UNode.ObjectProperty(UNode.SourceLocation(), UNode.Meta(), self.packPos(node.key, self.visit(node.key)),
                                 self.packPos(node.value, self.visit(node.value))))
        objectExpr = UNode.ObjectExpression(UNode.SourceLocation(), UNode.Meta(), ele)
        expressions = []
        expressions.append(UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                                     UNode.Identifier(UNode.SourceLocation(), UNode.Meta(),
                                                                      self.createTmpVariableName()),
                                                     None, False,
                                                     UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))
        tmpVar = UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), self.getTmpVariableName())
        for generator in node.generators:
            range_stmt = self.packPos(generator, self.visit(generator))
            if generator.ifs is not None and len(generator.ifs) > 0:
                if len(range_stmt.body.body) > 0 and isinstance(range_stmt.body.body[0], UNode.IfStatement):
                    range_stmt.body.body[0].consequent.append(
                        UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), "push", tmpVar,
                                               objectExpr))
            else:
                range_stmt.body.body.append(
                    UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), "push", tmpVar,
                                           objectExpr))
            expressions.append(range_stmt)
        expressions.append(tmpVar)
        return self.packPos(node, UNode.Sequence(UNode.SourceLocation(), UNode.Meta(), expressions))

    def visit_ExtSlice(self, node):
        pass

    def visit_FloorDiv(self, node):
        return "//"

    def visit_ListComp(self, node):
        ele = self.packPos(node.elt, self.visit(node.elt))
        expressions = []
        expressions.append(
            UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                      UNode.Identifier(UNode.SourceLocation(), UNode.Meta(),
                                                       self.createTmpVariableName()),
                                      None, False, UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))
        tmpVar = UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), self.getTmpVariableName())
        for generator in node.generators:
            range_stmt = self.packPos(generator, self.visit(generator))
            if generator.ifs is not None and len(generator.ifs) > 0:
                if len(range_stmt.body.body) > 0 and isinstance(range_stmt.body.body[0], UNode.IfStatement):
                    range_stmt.body.body[0].consequent.append(
                        UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), "push", tmpVar,
                                               ele))
            else:
                range_stmt.body.body.append(
                    UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), "push", tmpVar,
                                           ele))
            expressions.append(range_stmt)
        expressions.append(tmpVar)
        return self.packPos(node, UNode.Sequence(UNode.SourceLocation(), UNode.Meta(), expressions))

    def visit_GtE(self, node):
        return ">="

    def visit_LtE(self, node):
        return "<="

    def visit_UAdd(self, node):
        return "+"

    def visit_USub(self, node):
        return "-"

    def visit_AugLoad(self, node):  # ctx信息
        pass

    def visit_MatchAs(self, node):
        return self.packPos(node, UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), node.name))

    def visit_MatchOr(self, node):
        patterns = []
        for pattern in node.patterns:
            patterns.append(self.packPos(pattern, self.visit(pattern)))

        if len(patterns) == 0:
            return None
        elif len(patterns) == 1:
            return self.packPos(node, patterns[0])
        else:
            left = patterns[0]
            for right in patterns[1:]:
                left = UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), "||", left, right)
            return self.packPos(node, left)

    def visit_MatMult(self, node):
        return "@"

    def visit_SetComp(self, node):
        ele = self.packPos(node.elt, self.visit(node.elt))
        expressions = []
        expressions.append(
            UNode.VariableDeclaration(UNode.SourceLocation(), UNode.Meta(),
                                      UNode.Identifier(UNode.SourceLocation(), UNode.Meta(),
                                                       self.createTmpVariableName()),
                                      None, False, UNode.DynamicType(UNode.SourceLocation(), UNode.Meta())))
        tmpVar = UNode.Identifier(UNode.SourceLocation(), UNode.Meta(), self.getTmpVariableName())
        for generator in node.generators:
            range_stmt = self.packPos(generator, self.visit(generator))
            if generator.ifs is not None and len(generator.ifs) > 0:
                if len(range_stmt.body.body) > 0 and isinstance(range_stmt.body.body[0], UNode.IfStatement):
                    range_stmt.body.body[0].consequent.append(
                        UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), "push", tmpVar,
                                               ele))
            else:
                range_stmt.body.body.append(
                    UNode.BinaryExpression(UNode.SourceLocation(), UNode.Meta(), "push", tmpVar,
                                           ele))
            expressions.append(range_stmt)
        expressions.append(tmpVar)
        return self.packPos(node, UNode.Sequence(UNode.SourceLocation(), UNode.Meta(), expressions))

    def visit_TryStar(self, node):  # 暂未考虑异常组的影响
        return self.packPos(node, self.visit_Try(node))

    def visit_TypeVar(self, node):  # 用于类型声明
        pass

    def visit_TypeVarTuple(self, node):  # 用于类型声明
        pass

    def getTmpVariableName(self):
        return f"__tmp{self.tmpVarIndex}__"

    def createTmpVariableName(self):
        self.tmpVarIndex += 1
        return f"__tmp{self.tmpVarIndex}__"

    def packPos(self, node, unode):
        if node is None:
            return None
        loc = self.convertToLineColumn(node)
        if isinstance(unode, UNode.Node):
            unode.loc = loc
        elif isinstance(unode, list):
            for item in unode:
                if isinstance(item, UNode.Node):
                    item.loc = loc
        return unode

    def convertToLineColumn(self, node):
        def collect_child_locations(node):
            """递归收集所有子节点的位置信息"""
            locations = []
            # 处理列表类型（如 stmt 列表）
            if isinstance(node, list):
                for item in node:
                    locations.extend(collect_child_locations(item))
            else:
                # 遍历节点的所有字段
                for field, value in ast.iter_fields(node):
                    if isinstance(value, ast.AST):
                        # 递归处理子节点
                        child_loc = self.convertToLineColumn(value)
                        if child_loc is not None:
                            locations.append(child_loc)
                    elif isinstance(value, list):
                        for item in value:
                            if isinstance(item, ast.AST):
                                child_loc = self.convertToLineColumn(item)
                                if child_loc is not None:
                                    locations.append(child_loc)
            return locations

        # 如果当前节点有位置信息，直接使用
        if hasattr(node, "lineno") and hasattr(node, "col_offset") and \
                hasattr(node, "end_lineno") and hasattr(node, "end_col_offset"):
            start_lineno = node.lineno
            start_col = node.col_offset
            end_lineno = node.end_lineno
            end_col = node.end_col_offset
        else:
            # 递归收集所有子节点的位置
            child_locations = collect_child_locations(node)
            if not child_locations:
                # 如果没有任何子节点有位置信息，返回 None 或默认值
                return UNode.SourceLocation()  # 可根据需求调整

            # 取所有子节点位置的最大值作为当前节点的位置
            start_lineno = max(loc.start.line for loc in child_locations)
            start_col = max(loc.start.column for loc in child_locations)
            end_lineno = max(loc.end.line for loc in child_locations)
            end_col = max(loc.end.column for loc in child_locations)

        # 构建自定义的 SourceLocation 对象
        start_pos = UNode.Position(start_lineno, start_col + 1)
        end_pos = UNode.Position(end_lineno, end_col + 1)
        return UNode.SourceLocation(start_pos, end_pos, self.sourcefile)
