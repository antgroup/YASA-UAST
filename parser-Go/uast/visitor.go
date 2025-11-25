package uast

import (
	ast "go/ast"
	"go/token"
	"path/filepath"
	"reflect"
	"strconv"
	"strings"
)

func (u *Builder) VisitImportSpec(node *ast.ImportSpec) UNode {
	if u.import2Stmt[node] != nil {
		return u.import2Stmt[node]
	}

	importPath := getString(node.Path)
	importPath = strings.Replace(importPath, `"`, "", -1)
	// default import
	if node.Name == nil {
		baseName := getBaseName(importPath)
		return &VariableDeclaration{
			Type: "VariableDeclaration",
			Id:   &Identifier{Type: "Identifier", Name: baseName},
			Init: u.packPos(&ImportExpression{
				Type: "ImportExpression",
				From: &Literal{
					Type:        "Literal",
					Value:       importPath,
					LiteralType: "string",
				},
			}, node.Path),
			Cloned:        false,
			VarType:       &DynamicType{Type: "DynamicType"},
			VariableParam: false,
			Meta: Meta{
				IsDefaultImport: true,
			},
		}
	} else {
		localName := node.Name.Name
		if localName == "." {
			// dot import
			return &SpreadElement{
				Type: "SpreadElement",
				Argument: &ImportExpression{
					Type: "ImportExpression",
					From: u.packPos(&Literal{
						Type:        "Literal",
						Value:       importPath,
						LiteralType: "string",
					}, node.Path).(*Literal),
				},
			}
		} else {
			return &VariableDeclaration{
				Type: "VariableDeclaration",
				Id:   &Identifier{Type: "Identifier", Name: localName},
				Init: u.packPos(&ImportExpression{
					Type: "ImportExpression",
					From: &Literal{
						Type:        "Literal",
						Value:       importPath,
						LiteralType: "string",
					},
				}, node.Path),
				Cloned:        false,
				VarType:       &DynamicType{Type: "DynamicType"},
				VariableParam: false,
			}
		}
	}
}

func (u *Builder) VisitValueSpec(node *ast.ValueSpec) UNode {
	exprs := make([]Instruction, 0)
	for i, name := range node.Names {
		var valexpr Expression
		var typ UNode
		typ = &DynamicType{Type: "DynamicType"}
		if len(node.Values) != 0 && i < len(node.Values) {
			valexpr = u.visit(node.Values[i])
			// 使用反射来检查是否有 Type 字段
			v := reflect.ValueOf(node.Values[i])
			if v.Kind() == reflect.Ptr {
				v = v.Elem()
			}
			// 检查是否是一个结构体
			if v.Kind() == reflect.Struct {
				// 检查是否有 Type 字段
				if field := v.FieldByName("Type"); field.IsValid() {
					typ = u.visit(field.Interface().(ast.Expr))
				}
			}
			//todo 暂时直接匹配
			//var a [2]string; var b = a
			if id, isId := node.Values[i].(*ast.Ident); isId {
				if id.Obj != nil {
					if valueSpec, okk := id.Obj.Decl.(*ast.ValueSpec); okk {
						typ = u.visit(valueSpec.Type)
					}
				}
			}

			if id, ok := node.Values[i].(*ast.BasicLit); ok {
				typ = &Identifier{
					Name: strings.ToLower(id.Kind.String()),
					Type: "Identifier",
				}
			}

			if callExpr, isCallExpr := node.Values[i].(*ast.CallExpr); isCallExpr {
				if callName, isId := callExpr.Fun.(*ast.Ident); isId {
					//var s = make(map[string]int) 特指make函数
					if callName.Name == "make" && callExpr.Args != nil && len(callExpr.Args) > 0 {
						typ = u.visit(callExpr.Args[0])
					}
				} else {
					typ = u.visit(callExpr.Fun) //var abc = []byte("__taint_src")
					//todo
					// var mymap = newMap()  func newMap2() *map[int]string { return &map[int]string{}}
					//if ref, isId := callExpr.Fun.(*ast.Ident).Obj.Decl.(*ast.FuncDecl); isId {
					//	for _, stmt := range ref.Body.List {
					//		if ret, okk := stmt.(*ast.ReturnStmt); okk {
					//			for _, resExpr := range ret.Results {
					//				var s = u.visit(resExpr)
					//				if valDecl, okkk := s.(*ReferenceExpression).Argument.(*Sequence).Expressions[0].(*VariableDeclaration); okkk {
					//					typ = valDecl.VarType
					//				}
					//			}
					//		}
					//	}
					//}
				}
			}
		}
		if node.Type != nil {
			typ = u.visit(node.Type)
			//if resolveType, ok := node.Type.(*ast.Ident); ok {
			//	if typeSpec, okk := resolveType.Obj.Decl.(*ast.TypeSpec); okk {
			//		typ = u.visit(typeSpec.Type)
			//	}
			//}
		}
		if id, ok := u.visit(name).(*Identifier); ok {
			id.Meta = Meta{
				Type: typ,
			}
			vd := &VariableDeclaration{
				Type:          "VariableDeclaration",
				Id:            id,
				Init:          valexpr,
				Cloned:        false,
				VarType:       typ,
				VariableParam: false,
			}
			u.setVarInCurrentScope(id.Name)
			exprs = append(exprs, vd)
		}
	}
	if len(exprs) == 1 {
		return exprs[0]
	}
	return &Sequence{
		Type:        "Sequence",
		Expressions: exprs,
	}
}

func (u *Builder) VisitBasicLit(node *ast.BasicLit) UNode {
	literalType := node.Kind.String()
	return &Literal{
		Type:        "Literal",
		Value:       node.Value,
		LiteralType: literalType,
	}
}

func (u *Builder) VisitIdent(node *ast.Ident) UNode {
	return &Identifier{
		Type: "Identifier",
		Name: node.Name,
	}
}

func (u *Builder) visitGenDecl(node *ast.GenDecl) []Instruction {
	ret := make([]Instruction, 0)
	for _, spec := range node.Specs {
		unode := u.visit(spec)
		if unode != nil {
			ret = append(ret, unode)
		}
	}
	return ret
}

func (u *Builder) VisitTypeSpec(node *ast.TypeSpec) UNode {
	if u.type2Class[node] != nil {
		return u.type2Class[node]
	} else {
		specName := node.Name
		ret := &ClassDefinition{
			Type:   "ClassDefinition",
			Id:     u.visit(specName).(*Identifier),
			Body:   make([]Instruction, 0),
			Supers: make([]Expression, 0),
		}

		switch unode := u.visit(node.Type).(type) {
		case *Identifier:
			ret.Supers = append(ret.Supers, unode)
			break
		case *Sequence:
			ret.Body = append(ret.Body, unode.Expressions...)
			if unode.Meta.IsInterface {
				ret.Meta.IsInterface = true
			}
			//break
		case *MapType, *ArrayType, *ChanType:
			ret.Supers = append(ret.Supers, u.visit(node.Type))
		}
		u.type2Class[node] = ret
		u.typeDecls[node.Name.Name] = node

		return ret
	}
}

func (u *Builder) VisitStructType(node *ast.StructType) UNode {
	varDecls := u.getFieldListInStructType(node.Fields)
	varDeclsInstructions := make([]Instruction, 0)
	for _, v := range varDecls {
		varDeclsInstructions = append(varDeclsInstructions, v)
	}
	return &Sequence{
		Type:        "Sequence",
		Expressions: varDeclsInstructions,
	}
}

func (u *Builder) VisitIndexExpr(node *ast.IndexExpr) UNode {
	xVal := u.visit(node.X)
	indexVal := u.visit(node.Index)
	return merge(xVal, indexVal, true)
}

func (u *Builder) VisitIndexListExpr(node *ast.IndexListExpr) UNode {
	var properties []Instruction
	for _, index := range node.Indices {
		indexVal := u.visit(index)
		properties = append(properties, indexVal.(Expression))
	}
	return &MemberAccess{
		Type:     "MemberAccess",
		Object:   u.visit(node.X),
		Property: &Sequence{Type: "Sequence", Expressions: properties},
		Computed: true,
	}
}

// VisitDeferStmt defer callexpr -> defer (()->{callexpr})()
func (u *Builder) VisitDeferStmt(node *ast.DeferStmt) UNode {
	arguments := make([]Expression, 0)
	for _, arg := range node.Call.Args {
		arguments = append(arguments, u.visit(arg))
	}
	return &CallExpression{
		Type:      "CallExpression",
		Callee:    u.visit(node.Call.Fun),
		Arguments: arguments,
		Meta: Meta{
			Defer: true, //给外层call expr标注defer, 这样分析器可以在分析的时候做defer特殊处理
		},
	}
}

func (u *Builder) VisitSelectorExpr(node *ast.SelectorExpr) UNode {
	object := u.visit(node.X)
	property := u.visit(node.Sel)
	return merge(object, property, false)
}

func (u *Builder) visitFunc(bodystmt *ast.BlockStmt, funcType *ast.FuncType, recvList *ast.FieldList, name *ast.Ident) UNode {
	var body *ScopedStatement = nil
	if bodystmt != nil {
		body = u.visit(bodystmt).(*ScopedStatement)
	} else {
		body = &ScopedStatement{
			Type: "ScopedStatement",
			Body: make([]Instruction, 0),
			Id:   nil,
		}
	}
	var returnVarDecls []*VariableDeclaration = u.getFieldList(funcType.Results)
	var funcName string
	var nameNode UNode
	if name == nil {
		nameNode = nil
	} else {
		funcName = name.Name
		nameNode = u.packPos(&Identifier{Type: "Identifier", Name: funcName}, name)
	}

	ret := &FunctionDefinition{
		Type:       "FunctionDefinition",
		Id:         nameNode,
		Parameters: u.getFieldList(funcType.Params),
		ReturnType: u.getVariableDeclarationType(returnVarDecls),
		Body:       body,
	}

	if body == nil {
		return ret
	}

	// 返回值处理，如果返回是具名的，则需要将具名的返回变量声明，下放到函数体中，并且将默认的返回语句，添加上变量名
	if len(returnVarDecls) != 0 && returnVarDecls[0].Id != nil {
		// 将 []*VariableDeclaration 转为 []Instruction
		retInstruction := make([]Instruction, len(returnVarDecls))
		for i, decl := range returnVarDecls {
			retInstruction[i] = decl // 这里做了类型转换，因为每个元素都实现了 Instruction 接口
		}
		body.Body = append(retInstruction, body.Body...)

		// 返回语句增加默认返回变量名
		u.recursiveActionInUNode(body, func(node UNode) {
			switch v := node.(type) {
			case *ReturnStatement:
				// 只有裸返回才需要增加默认返回变量名
				if _, ok := v.Argument.(*Noop); !ok {
					break
				}
				if len(returnVarDecls) == 1 {
					v.Argument = returnVarDecls[0].Id
				} else {
					retExpressions := make([]UNode, len(returnVarDecls))
					for i, decl := range returnVarDecls {
						retExpressions[i] = decl.Id // 这里做了类型转换，因为每个元素都实现了 Instruction 接口
					}
					v.Argument = &TupleExpression{
						Type:     "TupleExpression",
						Elements: retExpressions,
					}
				}
			}
		})
	}

	recvDecls := u.getFieldList(recvList)
	// 如果recv不为空，那么
	// - 在func的body里面增加 reciever = this 语句
	// - 将生成的 func 放入指定的 class definition 中
	if len(recvDecls) != 0 {
		recv := recvDecls[0]
		var thisExpr Expression
		if _, ok := recv.VarType.(*PointerType); ok {
			thisExpr = &ThisExpression{Meta: Meta{
				Type: &PointerType{Type: "PointerType"},
			},
				Type: "ThisExpression"}
		} else {
			thisExpr = &ThisExpression{Type: "ThisExpression"}
		}
		if recv.Id != nil {
			recvName := recv.Id.(*Identifier).Name
			recvId := &Identifier{
				Type: "Identifier",
				Name: recvName,
			}
			recvId.Meta = Meta{
				Type: recv.VarType,
			}
			body.Body = append([]Instruction{&VariableDeclaration{
				Type:          "VariableDeclaration",
				Id:            recvId,
				Init:          thisExpr,
				Cloned:        true,
				VarType:       recv.VarType,
				VariableParam: false,
			}}, body.Body...)
		}
		return ret
	}
	return ret
}

func (u *Builder) VisitFuncLit(node *ast.FuncLit) UNode {
	return u.visitFunc(node.Body, node.Type, nil, nil)
}

// VisitFuncDecl 如果有recv，则需要将生成的def添加进指定的ClassDefinition
// 针对返回是具名的情况，需要进行额外处理，来应对default return的问题
// todo 没有处理TypeParams
func (u *Builder) VisitFuncDecl(node *ast.FuncDecl) UNode {
	ret := u.visitFunc(node.Body, node.Type, node.Recv, node.Name)

	if len(u.getFieldList(node.Recv)) != 0 {
		clsName := getDirectName(node.Recv.List[0].Type)
		ret.(*FunctionDefinition).Meta.ReceiveCls = clsName
		cd := u.type2Class[u.typeDecls[clsName]]
		if cd != nil {
			u.packPos(ret, node)
			cd.Body = append(cd.Body, ret)
			return nil
		}
	}
	return ret
}

// VisitSelectStmt 将select里面的case并行无差别分析
func (u *Builder) VisitSelectStmt(node *ast.SelectStmt) UNode {
	return u.visit(node.Body)
}

func (u *Builder) VisitCommClause(node *ast.CommClause) UNode {
	body := make([]Instruction, 0)
	body = append(body, u.visit(node.Comm))
	for _, stmt := range node.Body {
		body = append(body, u.visit(stmt))
	}
	return &ScopedStatement{
		Type: "ScopedStatement",
		Body: body,
		Id:   nil,
	}
}

func (u *Builder) VisitSendStmt(node *ast.SendStmt) UNode {
	return &BinaryExpression{
		Type:     "BinaryExpression",
		Operator: "push",
		Left:     u.visit(node.Chan),
		Right:    u.visit(node.Value),
	}
}

func (u *Builder) getVariableDeclarationType(vars []*VariableDeclaration) Type {
	if len(vars) == 0 {
		return &VoidType{}
	} else if len(vars) == 1 {
		return vars[0].VarType
	} else {
		var varTypes = make([]Type, len(vars))
		for i, v := range vars {
			varTypes[i] = v.VarType
		}
		return &TupleType{
			Type:          "TupleType",
			Id:            nil,
			Elements:      varTypes,
			TypeArguments: nil,
		}
	}
}

func (u *Builder) handleInBuildState(newState BuildState, action func()) {
	old := u.currState
	u.currState |= newState
	action()
	u.currState = old
}

func (u *Builder) isInBuildState(state BuildState) bool {
	if state&u.currState != 0 {
		return true
	}
	return false
}

func getDirectName(typ ast.Expr) string {
	switch node := typ.(type) {
	case *ast.Ident:
		return node.Name
	case *ast.SelectorExpr:
		return node.Sel.Name
	case *ast.StarExpr:
		return getDirectName(node.X)
	default:
		return ""
	}
}

func (u *Builder) getFieldListInStructType(node *ast.FieldList) []Instruction {
	ret := make([]Instruction, 0)
	if node == nil {
		return ret
	}

	for _, field := range node.List {
		var typ UNode
		u.handleInBuildState(TypeState, func() {
			typ = u.packPos(u.visitAsType(&field.Type).(Type), field.Type)
		})

		if field.Names == nil {
			//处理 Struct Embedding
			varName := &Identifier{Type: "Identifier", Name: getDirectName(field.Type)}
			instruction1 := u.packPos(&SpreadElement{
				Type:     "SpreadElement",
				Argument: varName,
			}, field)
			varName.Meta = Meta{Type: typ}
			instruction2 := u.packPos(&VariableDeclaration{
				Type:    "VariableDeclaration",
				Id:      varName,
				Cloned:  true,
				VarType: typ,
			}, field)
			ret = append(ret, instruction1)
			ret = append(ret, instruction2)
		} else {
			for _, name := range field.Names {
				varName := u.visit(name).(*Identifier)
				varName.Meta = Meta{Type: typ}
				ret = append(ret, u.packPos(&VariableDeclaration{
					Type:          "VariableDeclaration",
					Id:            varName,
					Init:          nil,
					Cloned:        true,
					VarType:       typ,
					VariableParam: false,
				}, field))
			}
		}
	}
	return ret
}

func (u *Builder) getFieldList(node *ast.FieldList) []*VariableDeclaration {
	ret := make([]*VariableDeclaration, 0)
	if node == nil {
		return ret
	}

	for _, field := range node.List {
		var typ UNode
		u.handleInBuildState(TypeState, func() {
			typ = u.packPos(u.visitAsType(&field.Type), field.Type)
		})
		_, isRestElement := field.Type.(*ast.Ellipsis)
		if field.Names == nil {
			// 如果为空，则设置一个不具名的VariableDeclaration
			ret = append(ret, u.packPos(&VariableDeclaration{
				Type:          "VariableDeclaration",
				Id:            nil,
				Init:          nil,
				Cloned:        true,
				VarType:       typ,
				VariableParam: false,
				Meta: Meta{
					IsRestElement: isRestElement,
				},
			}, field).(*VariableDeclaration))
		} else {
			for _, name := range field.Names {
				fieldId := u.visit(name).(*Identifier)
				fieldId.Meta = Meta{Type: typ}
				ret = append(ret, u.packPos(&VariableDeclaration{
					Type:          "VariableDeclaration",
					Id:            fieldId,
					Init:          nil,
					Cloned:        true,
					VarType:       typ,
					VariableParam: false,
				}, field).(*VariableDeclaration))
			}
		}
	}
	return ret
}

func (u *Builder) VisitFieldList(node *ast.FieldList) UNode {
	ret := make([]Instruction, 0)
	if node == nil {
		return &Sequence{Type: "Sequence", Expressions: ret}
	}

	for _, field := range node.List {
		var typ UNode
		u.handleInBuildState(TypeState, func() {
			typ = u.packPos(u.visitAsType(&field.Type), field.Type)
		})
		_, isRestElement := field.Type.(*ast.Ellipsis)
		if field.Names == nil {
			// 如果为空，则设置一个不具名的VariableDeclaration
			ret = append(ret, u.packPos(&VariableDeclaration{
				Type:          "VariableDeclaration",
				Id:            nil,
				Init:          nil,
				Cloned:        true,
				VarType:       typ,
				VariableParam: false,
				Meta: Meta{
					IsRestElement: isRestElement,
				},
			}, field).(*VariableDeclaration))
		} else {
			for _, name := range field.Names {
				fieldId := u.visit(name).(*Identifier)
				fieldId.Meta = Meta{Type: typ}
				ret = append(ret, u.packPos(&VariableDeclaration{
					Type:          "VariableDeclaration",
					Id:            fieldId,
					Init:          nil,
					Cloned:        true,
					VarType:       typ,
					VariableParam: false,
				}, field).(*VariableDeclaration))
			}
		}
	}
	return &Sequence{Type: "Sequence", Expressions: ret}
}

func (u *Builder) VisitStarExpr(node *ast.StarExpr) UNode {
	if u.isInBuildState(TypeState) {
		return &PointerType{
			Type:          "PointerType",
			Id:            nil,
			Element:       u.visit(node.X),
			TypeArguments: nil,
			Kind:          "pointer",
		}
	} else {
		return &DereferenceExpression{
			Type:     "DereferenceExpression",
			Argument: u.visit(node.X),
		}
	}
}

func (u *Builder) VisitEllipsis(node *ast.Ellipsis) UNode {
	return u.visit(node.Elt)
}

func (u *Builder) VisitBlockStmt(node *ast.BlockStmt) UNode {
	u.enterNewScope()
	defer u.exitCurrentScope()
	ret := &ScopedStatement{
		Type: "ScopedStatement",
		Body: make([]Instruction, 0),
		Id:   nil,
	}
	for _, stmt := range node.List {
		unode := u.visit(stmt)
		if seq, ok := unode.(*Sequence); ok {
			ret.Body = append(ret.Body, seq.Expressions...)
		} else {
			ret.Body = append(ret.Body, unode)
		}
	}
	return ret
}

func (u *Builder) VisitDeclStmt(node *ast.DeclStmt) UNode {
	return &Sequence{Type: "Sequence", Expressions: u.visitGenDecl(node.Decl.(*ast.GenDecl))}
}

func (u *Builder) VisitAssignStmt(node *ast.AssignStmt) UNode {
	leftValues := make([]UNode, 0)
	rightValues := make([]UNode, 0)
	for _, l := range node.Lhs {
		leftValues = append(leftValues, u.visit(l))
	}
	exprs := make([]Instruction, 0)
	var varType Type
	varType = &DynamicType{Type: "DynamicType"}
	for _, r := range node.Rhs {
		rightValues = append(rightValues, u.visit(r))
		if id, isId := r.(*ast.Ident); isId {
			if id.Obj != nil {
				if valueSpec, isValueSpec := id.Obj.Decl.(*ast.ValueSpec); isValueSpec {
					varType = u.visit(valueSpec.Type)
				}
				if assignment, isAssStmt := id.Obj.Decl.(*ast.AssignStmt); isAssStmt {
					if lit, isBasicLit := assignment.Rhs[0].(*ast.BasicLit); isBasicLit {
						varType = &Identifier{Type: "Identifier", Name: strings.ToLower(lit.Kind.String())}
					}
				}
			}
		}
		if funcLit, isFuncLit := r.(*ast.FuncLit); isFuncLit {
			varType = u.visit(funcLit.Type)
		}

		if sliceExpr, isSliceExpr := r.(*ast.SliceExpr); isSliceExpr {
			if ident, isId := sliceExpr.X.(*ast.Ident); isId {
				if ident.Obj != nil {
					if assignment, isAssign := ident.Obj.Decl.(*ast.AssignStmt); isAssign {
						if compositeLit, isComLit := assignment.Rhs[0].(*ast.CompositeLit); isComLit {
							varType = u.visit(compositeLit.Type)
							if arrayType, isArrTy := varType.(*ArrayType); isArrTy {
								var highVal, lowVal int
								if high, isBasicLit := sliceExpr.High.(*ast.BasicLit); isBasicLit {
									var err error
									highVal, err = strconv.Atoi(high.Value)
									if err != nil {
										panic(err)
									}
								}
								if low, isBasicLit := sliceExpr.Low.(*ast.BasicLit); isBasicLit {
									var err error
									lowVal, err = strconv.Atoi(low.Value)
									if err != nil {
										panic(err)
									}
								}
								size := highVal - lowVal
								arrayType.Size = &Literal{
									Type:        "Literal",
									LiteralType: "INT",
									Value:       strconv.Itoa(size),
								}
							}
						}
					}
				}
			}
		}
	}
	leftLen := len(leftValues)
	rightLen := len(rightValues)
	// (左值) = (右值)。左值和右值长度相等
	if leftLen == rightLen {
		for i := 0; i < leftLen; i++ {
			if node.Tok == token.DEFINE {
				if v, isId := leftValues[i].(*Identifier); isId {
					if !u.isDefinedInCurrentScope(v.Name) {
						if callExpr, isCallExpr := rightValues[i].(*CallExpression); isCallExpr { //处理make的情况
							if callName, isCallId := callExpr.Callee.(*Identifier); isCallId {
								if callName.Name == "make" && len(callExpr.Arguments) > 0 {
									varType = callExpr.Arguments[0]
								}
							} else {
								varType = callExpr.Callee
							}
						} else if seq, isSeq := rightValues[i].(*Sequence); isSeq {
							varType = seq.Expressions[0].(*VariableDeclaration).VarType
						} else if literal, isLit := rightValues[i].(*Literal); isLit {
							varType = &Identifier{Type: "Identifier", Name: strings.ToLower(literal.LiteralType)}
						}
						v.Meta = Meta{Type: varType}
						exprs = append(exprs, &VariableDeclaration{
							Type:    "VariableDeclaration",
							Id:      v,
							Init:    rightValues[i],
							Cloned:  true,
							VarType: varType,
						})
						continue
					}
				}
			}
			exprs = append(exprs, &AssignmentExpression{
				Type:     "AssignmentExpression",
				Left:     leftValues[i],
				Right:    rightValues[i],
				Operator: node.Tok.String(),
				Cloned:   true,
			})
		}
		// (左值) = (右值)。左值和右值长度不相等：e.g.,a,b =/:= builtIn()
	} else if leftLen > rightLen && rightLen == 1 {
		leftTuple := &TupleExpression{Type: "TupleExpression", Elements: leftValues}
		if node.Tok == token.DEFINE {
			exprs = append(exprs, &VariableDeclaration{
				Type:    "VariableDeclaration",
				Id:      leftTuple,
				Init:    rightValues[0],
				Cloned:  true,
				VarType: &DynamicType{Type: "DynamicType"},
			})
		} else {
			exprs = append(exprs, &AssignmentExpression{
				Type:     "AssignmentExpression",
				Left:     leftTuple,
				Right:    rightValues[0],
				Operator: node.Tok.String(),
				Cloned:   true,
			})
		}
	}

	if len(exprs) == 0 {
		return &Noop{}
	} else if len(exprs) == 1 {
		return exprs[0]
	} else {
		return &Sequence{
			Type:        "Sequence",
			Expressions: exprs,
		}
	}
}

func (u *Builder) VisitTypeAssertExpr(node *ast.TypeAssertExpr) UNode {
	return &BinaryExpression{
		Type:     "BinaryExpression",
		Operator: "instanceof",
		Left:     u.visit(node.X),
		Right:    u.visit(node.Type),
		Meta: Meta{
			Type: u.visitAsType(&node.Type),
		},
	}
}

func (u *Builder) VisitForStmt(node *ast.ForStmt) UNode {
	return &ForStatement{
		Type:   "ForStatement",
		Init:   u.visit(node.Init),
		Test:   u.visit(node.Cond),
		Update: u.visit(node.Post),
		Body:   u.visit(node.Body),
	}
}

func (u *Builder) VisitRangeStmt(node *ast.RangeStmt) UNode {
	return &RangeStatement{
		Type:  "RangeStatement",
		Key:   u.visit(node.Key),
		Value: u.visit(node.Value),
		Right: u.visit(node.X),
		Body:  u.visit(node.Body),
	}
}

func (u *Builder) VisitParenExpr(node *ast.ParenExpr) UNode {
	return u.visit(node.X)
}

func (u *Builder) VisitIfStmt(node *ast.IfStmt) UNode {
	ifstmt := &IfStatement{
		Type:        "IfStatement",
		Test:        u.visit(node.Cond),
		Consequent:  u.visit(node.Body),
		Alternative: u.visit(node.Else),
	}
	if node.Init != nil {
		return &ScopedStatement{
			Type: "ScopedStatement",
			Body: []Instruction{u.visit(node.Init), ifstmt},
		}
	}
	return ifstmt
}

func (u *Builder) VisitIncDecStmt(node *ast.IncDecStmt) UNode {
	return &UnaryExpression{
		Type:     "UnaryExpression",
		Operator: node.Tok.String(),
		Argument: u.visit(node.X),
		IsSuffix: true,
	}
}

func (u *Builder) VisitSliceExpr(node *ast.SliceExpr) UNode {
	object := u.visit(node.X)
	property := &SliceExpression{
		Type:  "SliceExpression",
		Start: u.visit(node.Low),
		End:   u.visit(node.High),
	}
	return &MemberAccess{
		Type:     "MemberAccess",
		Object:   object,
		Property: property,
	}
}

func (u *Builder) VisitGoStmt(node *ast.GoStmt) UNode {
	ret := u.visit(node.Call).(*CallExpression)
	ret.Meta.Async = true
	return ret
}

func (u *Builder) VisitReturnStmt(node *ast.ReturnStmt) UNode {
	elts := make([]UNode, len(node.Results))
	for i, result := range node.Results {
		elts[i] = u.visit(result)
	}
	var arg Expression
	if len(elts) == 1 {
		arg = elts[0]
	} else if len(elts) == 0 { // 如果是裸返回，将return_arg设为Noop类型
		arg = &Noop{}
	} else {
		arg = &TupleExpression{
			Type:     "TupleExpression",
			Elements: elts,
		}
	}
	return &ReturnStatement{
		Type:     "ReturnStatement",
		Argument: arg,
	}
}

func (u *Builder) VisitCompositeLit(node *ast.CompositeLit) UNode {
	exprs := make([]Instruction, 0)
	tmpVarName := u.getTmpVariableName()
	lastReturnVarId := u.packPos(&Identifier{Type: "Identifier", Name: tmpVarName}, node).(*Identifier)
	typ := u.visitAsType(&node.Type)
	lastReturnVarId.Meta = Meta{Type: typ}
	if node.Type != nil {
		exprs = append(exprs, &VariableDeclaration{
			Type: "VariableDeclaration",
			Id:   lastReturnVarId,
			Init: &NewExpression{
				Type:      "NewExpression",
				Callee:    u.visit(node.Type),
				Arguments: make([]Expression, 0),
			},
			VarType: typ,
			Cloned:  false,
		})
	} else {
		exprs = append(exprs, &ObjectExpression{
			Type:       "ObjectExpression",
			Properties: nil,
			Id:         nil,
		})
	}
	var names []Expression
	if nodeType, ok := node.Type.(*ast.Ident); ok {
		typeSpec := u.typeDecls[nodeType.Name]
		if typeSpec != nil {
			if structType, okkk := typeSpec.Type.(*ast.StructType); okkk {
				if len(structType.Fields.List) >= 1 {
					for _, eachField := range structType.Fields.List {
						if eachField.Names == nil && eachField.Type != nil {
							names = append(names, u.visit(eachField.Type))
						} else {
							for _, eachName := range eachField.Names {
								names = append(names, u.visit(eachName))
							}
						}
					}
				}
			}
		}
	}

	for i, elt := range node.Elts {
		var key, value Expression
		switch specElt := elt.(type) {
		case *ast.KeyValueExpr:
			if specEltLit, ok := specElt.Key.(*ast.CompositeLit); ok {
				if specEltLit.Type == nil {
					if eltLitType, ok := node.Type.(*ast.MapType); ok {
						specEltLit.Type = eltLitType.Key
					}
				}
			}
			key = u.visit(specElt.Key)
			value = u.visit(specElt.Value)
			break
		default:
			if nodeType, ok := node.Type.(*ast.Ident); ok {
				typeSpec := u.typeDecls[nodeType.Name]
				if typeSpec != nil {
					if structType, okkk := typeSpec.Type.(*ast.StructType); okkk {
						/**
						【if】为了适配写法：
						type entry struct {
							key string
							val string  //key val分别存在List[0].Names和List[1].Names中
						}
						var entries []entry
						entries = append(entries, entry{"abc", "def"})

						【else if】为了适配写法：
						type entry struct {
							key, val string  //key val分别存在List[0].Names[0]和List[0].Names[1]中
						}
						var entries []entry
						entries = append(entries, entry{"abc", "def"})
						*/
						if len(node.Elts) == len(names) {
							//if structType.Fields.List[i].Names != nil && len(structType.Fields.List[i].Names) >= 1 {
							key = names[i]
							value = u.visit(specElt)
							//} else if structType.Fields.List[i].Names == nil {
							//	key = u.visit(structType.Fields.List[i].Type)
							//	value = u.visit(specElt)
							//}
						} else if structType.Fields.List != nil && len(structType.Fields.List) >= 1 && len(node.Elts) == len(structType.Fields.List[0].Names) {
							if structType.Fields.List[0].Names != nil && len(structType.Fields.List[0].Names) >= 1 {
								key = u.visit(structType.Fields.List[0].Names[i])
								value = u.visit(specElt)
							} else if structType.Fields.List[i].Names == nil {
								key = u.visit(structType.Fields.List[i].Type)
								value = u.visit(specElt)
							}
						} else if i < len(structType.Fields.List) && structType.Fields.List[i].Names == nil {
							key = u.visit(structType.Fields.List[i].Type)
							value = u.visit(specElt)
						}
					} else if _, okkk := typeSpec.Type.(*ast.ArrayType); okkk {
						key = &Identifier{
							Type: "Identifier",
							Name: strconv.Itoa(i),
						}
						value = u.visit(specElt)
					}
				}
			} else {
				key = &Identifier{
					Type: "Identifier",
					Name: strconv.Itoa(i),
				}
				value = u.visit(specElt)
			}
		}
		var left, right Expression
		if keyMem, ok := key.(*MemberAccess); ok {
			left = &MemberAccess{
				Type: "MemberAccess",
				Object: &MemberAccess{
					Type:     "MemberAccess",
					Object:   lastReturnVarId,
					Property: keyMem.Object,
				},
				Property: keyMem.Property,
			}
		} else if keyCallExpr, ok := key.(*CallExpression); ok {
			if keyCallMem, ok := keyCallExpr.Callee.(*MemberAccess); ok {
				left = &CallExpression{
					Type: "CallExpression",
					Callee: &MemberAccess{
						Type: "MemberAccess",
						Object: &MemberAccess{
							Type:     "MemberAccess",
							Object:   lastReturnVarId,
							Property: keyCallMem.Object,
						},
						Property: keyCallMem.Property,
					},
					Arguments: keyCallExpr.Arguments,
				}
			} else {
				left = &CallExpression{
					Type: "CallExpression",
					Callee: &MemberAccess{
						Type:     "MemberAccess",
						Object:   lastReturnVarId,
						Property: keyCallExpr,
					},
					Arguments: keyCallExpr.Arguments,
				}
			}
		} else {
			left = &MemberAccess{
				Type:     "MemberAccess",
				Object:   lastReturnVarId,
				Property: key,
			}

		}
		right = value
		exprs = append(exprs, &AssignmentExpression{
			Type:     "AssignmentExpression",
			Left:     left,
			Right:    right,
			Operator: "=",
			Cloned:   true,
		})
	}

	exprs = append(exprs, lastReturnVarId)
	return &Sequence{
		Type:        "Sequence",
		Expressions: exprs,
	}
}

func (u *Builder) VisitCallExpr(node *ast.CallExpr) UNode {
	if callee, ok := node.Fun.(*ast.Ident); ok {
		if callee.Name == "new" && len(node.Args) > 0 {
			return &NewExpression{
				Type:      "NewExpression",
				Callee:    u.visit(node.Args[0]),
				Arguments: make([]Expression, 0),
			}
		}
	}
	args := make([]Expression, len(node.Args))
	for i, arg := range node.Args {
		args[i] = u.visit(arg)
	}
	//todo 这里忽略了泛型参数 my_model.List[ruleModel.Rule](ruleModel.Rule{}, ds)
	if call, ok := node.Fun.(*ast.IndexExpr); ok {
		return &CallExpression{
			Type:      "CallExpression",
			Callee:    u.visit(call.X),
			Arguments: args,
		}
	}
	if call, ok := node.Fun.(*ast.IndexListExpr); ok {
		return &CallExpression{
			Type:      "CallExpression",
			Callee:    u.visit(call.X),
			Arguments: args,
		}
	}
	return &CallExpression{
		Type:      "CallExpression",
		Callee:    u.visit(node.Fun),
		Arguments: args,
	}
}

func (u *Builder) VisitUnaryExpr(node *ast.UnaryExpr) UNode {
	// 如果操作符是解引用（*）
	if node.Op == token.MUL {
		return &DereferenceExpression{
			Type:     "DereferenceExpression",
			Argument: u.visit(node.X),
		}
		//如果操作符是取地址（&）
	} else if node.Op == token.AND {
		return &ReferenceExpression{
			Type:     "ReferenceExpression",
			Argument: u.visit(node.X),
		}
	} else if node.Op == token.ARROW {
		// TODO 标注是通道取值
		return &UnaryExpression{
			Type:     "UnaryExpression",
			Operator: "pop",
			Argument: u.visit(node.X),
			IsSuffix: false,
		}
	} else {
		return &UnaryExpression{
			Type:     "UnaryExpression",
			Operator: node.Op.String(),
			Argument: u.visit(node.X),
			IsSuffix: false,
		}
	}
}

func (u *Builder) VisitBinaryExpr(node *ast.BinaryExpr) UNode {
	return &BinaryExpression{
		Type:     "BinaryExpression",
		Operator: node.Op.String(),
		Left:     u.visit(node.X),
		Right:    u.visit(node.Y),
	}
}

func (u *Builder) VisitTypeSwitchStmt(node *ast.TypeSwitchStmt) UNode {
	disc := make([]Instruction, 0)
	if node.Init != nil {
		disc = append(disc, u.visit(node.Init))
	}
	disc = append(disc, u.visit(node.Assign))
	if assign, ok := node.Assign.(*ast.AssignStmt); ok {
		disc = append(disc, u.visit(assign.Lhs[0]).(*Identifier))
	}
	cases := make([]*CaseClause, 0)
	for _, c := range node.Body.List {
		caseClause := u.visitCaseClause(c.(*ast.CaseClause), nil)
		cases = append(cases, caseClause)
	}

	return &SwitchStatement{
		Type: "SwitchStatement",
		Discriminant: &Sequence{
			Type:        "Sequence",
			Expressions: disc,
		},
		Cases: cases,
	}
}

func (u *Builder) VisitSwitchStmt(node *ast.SwitchStmt) UNode {
	disc := make([]Instruction, 0)
	if node.Init != nil {
		disc = append(disc, u.visit(node.Init))
	}
	var tagid *Identifier
	if node.Tag != nil {
		tag := u.visit(node.Tag)
		//if tid, ok := tag.(*Identifier); ok {
		//	tagid = tid
		//} else {
		//	tagid = u.packPos(&Identifier{Name: u.getTmpVariableName()}, node).(*Identifier)
		//	tag = &VariableDeclaration{
		//		Id:      tagid,
		//		Init:    tag,
		//		Cloned:  true,
		//		VarType: &DynamicType{},
		//	}
		//}
		disc = append(disc, tag)
	}
	cases := make([]*CaseClause, 0)
	for _, c := range node.Body.List {
		caseClause := u.visitCaseClause(c.(*ast.CaseClause), tagid)
		cases = append(cases, caseClause)
	}

	return &SwitchStatement{
		Type: "SwitchStatement",
		Discriminant: &Sequence{
			Type:        "Sequence",
			Expressions: disc,
		},
		Cases: cases,
	}
}

func (u *Builder) visitCaseClause(node *ast.CaseClause, tagid *Identifier) *CaseClause {
	exprs := make([]Instruction, 0)
	for _, expr := range node.List {
		e := u.visit(expr)
		if tagid != nil {
			exprs = append(exprs, &BinaryExpression{
				Type:     "BinaryExpression",
				Operator: "==",
				Left:     tagid,
				Right:    e,
			})
		} else {
			exprs = append(exprs, e)
		}
	}
	var test Instruction
	if len(exprs) != 0 {
		test = exprs[0]
		for _, expr := range exprs[1:] {
			test = &BinaryExpression{
				Type:     "BinaryExpression",
				Operator: "||",
				Left:     test,
				Right:    expr,
			}
		}
	}

	stmts := make([]Instruction, 0)
	for _, s := range node.Body {
		stmts = append(stmts, u.visit(s))
	}
	return &CaseClause{
		Type: "CaseClause",
		Test: test,
		Body: &ScopedStatement{
			Type: "ScopedStatement",
			Body: stmts,
		},
	}
}
func (u *Builder) VisitBranchStmt(node *ast.BranchStmt) UNode {
	var id *Identifier
	if node.Label != nil {
		id = u.visit(node.Label).(*Identifier)
	}
	switch node.Tok {
	case token.GOTO:
		return &Noop{} //TODO
	case token.BREAK:
		return &BreakStatement{Type: "BreakStatement", Label: id}
	case token.CONTINUE:
		return &ContinueStatement{Type: "ContinueStatement", Label: id}
	default:
		return &Noop{} //TODO
	}
}

func (u *Builder) VisitLabeledStmt(node *ast.LabeledStmt) UNode {
	return &ScopedStatement{
		Type: "ScopedStatement",
		Body: []Instruction{u.visit(node.Stmt)},
		Id:   u.visit(node.Label).(*Identifier),
	}
}

func (u *Builder) VisitEmptyStmt(node *ast.EmptyStmt) UNode {
	return &Noop{}
}

func (u *Builder) VisitExprStmt(node *ast.ExprStmt) UNode {
	return u.visit(node.X)
}

// TYPE
func (u *Builder) visitAsType(node *ast.Expr) Type {
	return u.visit(*node)
}

func (u *Builder) VisitInterfaceType(node *ast.InterfaceType) UNode {
	ret := make([]Instruction, 0)
	methodList := node.Methods.List
	if methodList == nil || len(methodList) == 0 {
		return &DynamicType{Type: "DynamicType"}
	}
	for _, method := range methodList {
		// TODO：接口嵌入接口未处理
		if len(method.Names) <= 0 {
			continue
		}
		methodName := method.Names[0].Name
		// 调用visitFuncType解析参数和返回值类型
		methodType := u.visit(method.Type)
		if methodType, ok := methodType.(*FuncType); ok {
			methodType.Id.Name = methodName
			ret = append(ret, methodType)
		}
	}
	return &Sequence{Type: "Sequence", Expressions: ret, Meta: Meta{IsInterface: true}}
}

func (u *Builder) VisitArrayType(node *ast.ArrayType) Type {
	return &ArrayType{
		Type:    "ArrayType",
		Id:      &Identifier{Type: "Identifier", Name: "ArrayType"},
		Element: u.visit(node.Elt),
		Size:    u.visit(node.Len),
	}
}

func (u *Builder) VisitChanType(node *ast.ChanType) Type {
	var dir string
	if node.Dir == 1 {
		dir = "send"
	} else if node.Dir == 2 {
		dir = "receive"
	}
	return &ChanType{
		Type:      "ChanType",
		Id:        &Identifier{Type: "Identifier", Name: "ChanType"},
		Dir:       dir,
		ValueType: u.visit(node.Value),
	}
}

func (u *Builder) VisitMapType(node *ast.MapType) UNode {
	return &MapType{
		Type:      "MapType",
		Id:        &Identifier{Type: "Identifier", Name: "MapType"},
		KeyType:   u.visit(node.Key),
		ValueType: u.visit(node.Value),
	}
}

// 因为还不处理golang的类型系统，目前仅返回动态类型，后续需要针对类型系统进行建模
func (u *Builder) VisitFuncType(node *ast.FuncType) UNode {
	var paramTyp []Type
	if node.Params != nil {
		for _, param := range node.Params.List {
			paramTyp = append(paramTyp, u.visitAsType(&param.Type))
		}
	}

	var typeParamTyp []Type
	if node.TypeParams != nil {
		for _, typeParam := range node.TypeParams.List {
			typeParamTyp = append(typeParamTyp, u.visitAsType(&typeParam.Type))
		}
	}

	var resultTyp []Type
	if node.Results != nil {
		for _, result := range node.Results.List {
			resultTyp = append(resultTyp, u.visitAsType(&result.Type))
		}
	}

	return &FuncType{
		Id:         &Identifier{Type: "Identifier", Name: "FuncType"},
		Params:     paramTyp,
		TypeParams: typeParamTyp,
		Results:    resultTyp,
	}
}

func getString(path *ast.BasicLit) string {
	return path.Value
}

func getBaseName(path string) string {
	cleanPath := filepath.Clean(path) // "x/z", 但在Windows上可能是 "x\z"
	return filepath.Base(cleanPath)   // "z"
}

func merge(a, b Expression, computed bool) Expression {
	if a == nil {
		return b
	}
	if b == nil {
		return a
	}

	// 检查是否是 MemberAccess 类型
	aMember, aIsMember := a.(*MemberAccess)
	bMember, bIsMember := b.(*MemberAccess)

	if !bIsMember {
		// 如果 `b` 不是 MemberAccess 类型
		return &MemberAccess{
			Type:     "MemberAccess",
			Object:   a,
			Property: b,
			Computed: computed,
		}
	} else if !aIsMember {
		return &MemberAccess{
			Type:     "MemberAccess",
			Object:   merge(a, bMember.Object, computed),
			Property: bMember.Property,
			Computed: computed,
		}
	} else {
		return &MemberAccess{
			Type:     "MemberAccess",
			Object:   merge(aMember, bMember.Object, computed),
			Property: bMember.Property,
			Computed: computed,
		}
	}
}
