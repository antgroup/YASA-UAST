package uast

import (
	"fmt"
	"github.com/creasty/defaults"
	"go/ast"
	"go/token"
	"os"
	"reflect"
	"strings"
	"uast4go/utils"
)

const LANGUAGE = "golang"
const VERSION = "1.18"

type BuildState int

const (
	NormalState = 1 << iota
	TypeState   // 处理类型
	StructType
	CompositeLitState
)

type NodeInfo struct {
	Node        UNode  `json:"node"`
	PackageName string `json:"packageName"`
}

type PackagePathInfo struct {
	PathName string                      // 文件路径`json:"pathName"`
	Files    map[string]*NodeInfo        `json:"files"`
	Subs     map[string]*PackagePathInfo `json:"subs"`
}

type Builder struct {
	moduleName  string
	fset        *token.FileSet
	packages    map[string]*ast.Package
	typeDecls   map[string]*ast.TypeSpec // 用于存储type 的定义，以便能够在visit method的时候，定位到 receiver 的 type decl
	type2Class  map[*ast.TypeSpec]*ClassDefinition
	import2Stmt map[*ast.ImportSpec]Instruction
	tmpVarIndex int // 临时变量
	currState   BuildState
	pkg         *ast.Package // build 过程中，引用当前正在处理的package
	filePath    string       // 当前文件路径
	pkgPath     []string     // 当前包路径
	varScope    []map[string]bool
	result      *PackagePathInfo
	parent      *ast.Node
	done        bool //
}

func NewUASTBuilder(moduleName string, packages map[string]*ast.Package, fset *token.FileSet) *Builder {
	return &Builder{moduleName: moduleName, fset: fset, packages: packages, typeDecls: make(map[string]*ast.TypeSpec), result: &PackagePathInfo{
		Files: make(map[string]*NodeInfo),
		Subs:  make(map[string]*PackagePathInfo),
	}, currState: NormalState}
}

func (u *Builder) Build() {
	for filePath, pkg := range u.packages {
		//fmt.Printf("Package path: %s, Package name: %s, Files: %v\n", filePath, pkg.Name, pkg.Files)
		u.filePath = filePath
		u.prepareBuildPackage(pkg)
		u.build()
	}
	u.done = true
}

func (u *Builder) preprocessTypeDecl() {
	for _, file := range u.pkg.Files {
		for _, decl := range file.Decls {
			if genDecl, ok := decl.(*ast.GenDecl); ok {
				switch genDecl.Tok {
				case token.TYPE:
					classDefinitions := u.visitGenDecl(genDecl)
					for i, cd := range classDefinitions {
						ts := genDecl.Specs[i].(*ast.TypeSpec)
						cDef := cd.(*ClassDefinition)
						defId := cDef.Id.Name
						u.type2Class[ts] = cDef
						u.typeDecls[defId] = ts
					}
					break
				case token.IMPORT:
					importStmts := u.visitGenDecl(genDecl)
					for i, stmt := range importStmts {
						importSpec := genDecl.Specs[i].(*ast.ImportSpec)
						u.import2Stmt[importSpec] = stmt
					}
					break
				}
			}
		}
	}
}

func (u *Builder) build() {
	for filePath, file := range u.pkg.Files {
		var compileUnit = CompileUnit{
			Body:            make([]Instruction, 0),
			Language:        LANGUAGE,
			LanguageVersion: VERSION,
			Uri:             "",
			Version:         "",
		}
		//添加package name
		compileUnit.Body = append(compileUnit.Body, &PackageDeclaration{
			Name:    u.visit(file.Name).(*Identifier),
			ASTNode: u.visit(file.Name).(*Identifier).ASTNode,
		})

		for _, decl := range file.Decls {
			switch node := decl.(type) {
			case *ast.GenDecl:
				instructions := u.visitGenDecl(node)
				compileUnit.Body = append(compileUnit.Body, instructions...)
				break
			case *ast.FuncDecl:
				instruction := u.visit(node)
				if instruction != nil {
					compileUnit.Body = append(compileUnit.Body, instruction)
				}
				break
			default:
				panic("unreachable")
			}
		}
		u.packPos(&compileUnit, file)
		u.recursiveActionInUNode(&compileUnit, func(node UNode) {
			if node == nil {
				return
			}
			err := defaults.Set(node)
			if err != nil {
				return
			}
		})

		pkgPath := u.result.Subs
		var sub *PackagePathInfo
		var paths []string
		if u.filePath == "/" {
			paths = []string{"/"}
		} else {
			paths = strings.Split(u.filePath, "/")
			paths = append([]string{"/"}, paths[1:len(paths)]...)
		}
		for _, path := range paths {
			if pkgPath[path] == nil {
				pkgPath[path] = &PackagePathInfo{
					PathName: "",
					Files:    make(map[string]*NodeInfo),
					Subs:     make(map[string]*PackagePathInfo),
				}
			}
			sub = pkgPath[path]
			pkgPath = pkgPath[path].Subs

		}
		sub.Files[filePath] = &NodeInfo{
			Node:        &compileUnit,
			PackageName: u.pkg.Name,
		}
	}
}

// getLastPartAfterDot 截取并返回字符串中最后一个'.'之后的部分。
// 如果没有找到'.'或者'.'是最后一个字符，返回空字符串。
func getLastPartAfterDot(s string) string {
	dotIndex := strings.LastIndex(s, ".")
	if dotIndex != -1 && dotIndex+1 < len(s) {
		return s[dotIndex+1:]
	}
	return ""
}

func (u *Builder) visit(node ast.Node) UNode {
	if node == nil {
		return &Noop{}
	}

	t := reflect.TypeOf(node)
	funcName := "Visit" + getLastPartAfterDot(t.String())
	if funcName == "Visit" {
		fmt.Printf("node type %v not found\n", node)
		os.Exit(-1)
	}

	// 获取类型实例的反射值
	builderVal := reflect.ValueOf(u)

	// 通过反射查找实例的方法
	methodVal := builderVal.MethodByName(funcName)
	if !methodVal.IsValid() {
		fmt.Printf("Method %s not found\n", funcName)
		os.Exit(-1)
	}

	// 准备方法的参数
	args := []reflect.Value{reflect.ValueOf(node)}

	// 调用方法
	retVals := methodVal.Call(args)
	if retVals[0].Interface() == nil {
		return nil
	}
	ret := retVals[0].Interface().(UNode)
	u.packPos(ret, node) // 一个节点得到一个uNode时会添加pos信息，但是如果在这个过程中，产生了新的节点，则没有pos
	return ret
}

func (u *Builder) prepareBuildPackage(pkg *ast.Package) {
	u.typeDecls = make(map[string]*ast.TypeSpec)
	u.type2Class = make(map[*ast.TypeSpec]*ClassDefinition)
	u.import2Stmt = make(map[*ast.ImportSpec]Instruction)
	u.tmpVarIndex = 0
	u.pkg = pkg
	u.varScope = make([]map[string]bool, 0)
	u.preprocessTypeDecl()
}

func (u *Builder) isDefinedInCurrentScope(varName string) bool {
	if currScope, ok := utils.GetLastElement(u.varScope); ok {
		return currScope[varName]
	}
	return false
}

func (u *Builder) enterNewScope() map[string]bool {
	ret := make(map[string]bool)
	u.varScope = append(u.varScope, ret)
	return ret
}

func (u *Builder) setVarInCurrentScope(varName string) {
	var curr map[string]bool
	if len(u.varScope) == 0 {
		curr = u.enterNewScope()
	} else {
		curr = u.varScope[len(u.varScope)-1]
	}
	curr[varName] = true
}

func (u *Builder) exitCurrentScope() {
	utils.RemoveLastElement(u.varScope)
}

func (u *Builder) getTmpVariableName() string {
	u.tmpVarIndex += 1
	return fmt.Sprintf("tmp%d", u.tmpVarIndex)
}

func (u *Builder) convertToLineColumn(node ast.Node) *Location {
	return convertToLineColumn(node, u.fset)
}

func (u *Builder) GetResult() *PackagePathInfo {
	if !u.done {
		panic("It should [Build] result before get it")
	}
	return u.result
}

// 如果内部有任何的ast子节点，并且子节点没有被设置loc，则将loc默认设置为当前父节点的loc
func (u *Builder) packPos(unode UNode, node ast.Node) UNode {
	if node == nil {
		return nil
	}
	loc := convertToLineColumn(node, u.fset)
	unode.SetLocation(loc)
	recursiveSetLocation(reflect.ValueOf(unode), loc)
	return unode
}

func (u *Builder) recursiveActionInUNode(unode UNode, action func(node UNode)) {
	action(unode)
	v := reflect.ValueOf(unode)
	v = reflect.Indirect(v)
	// Iterate through all fields of the struct value
	if v.Kind() == reflect.Struct {
		for i := 0; i < v.NumField(); i++ {
			field := v.Field(i)
			// Check if the field is a slice or array
			if field.Kind() == reflect.Slice || field.Kind() == reflect.Array {
				for j := 0; j < field.Len(); j++ {
					elem := field.Index(j)
					// If the element is an interface or a pointer to a struct, then it could implement UNode
					if elem.Kind() == reflect.Interface || (elem.Kind() == reflect.Ptr && elem.Elem().Kind() == reflect.Struct) {
						// Check if the element can be an UNode (i.e., implements the UNode interface)
						if elem.Type().Implements(reflect.TypeOf((*UNode)(nil)).Elem()) && !elem.IsNil() {
							u.recursiveActionInUNode(elem.Interface().(UNode), action)
						}
					}
				}
			} else if field.Kind() == reflect.Interface || (field.Kind() == reflect.Ptr && field.Elem().Kind() == reflect.Struct) {
				// Check if the field can be an UNode (i.e., implements the UNode interface)
				if field.Type().Implements(reflect.TypeOf((*UNode)(nil)).Elem()) && !field.IsNil() {
					u.recursiveActionInUNode(field.Interface().(UNode), action)
				}
			}
		}
	}
}

func recursiveSetLocation(v reflect.Value, loc *Location) {
	// Ensure we're operating on a value (not a pointer)
	v = reflect.Indirect(v)

	// Make sure we don't try to process values that are invalid (e.g., nil)
	if !v.IsValid() {
		return
	}

	// Check if this value implements the UNode interface
	if v.CanAddr() {
		vPtr := v.Addr()
		if uNodeValue, ok := vPtr.Interface().(UNode); ok {
			// Only set location if it's not already set
			if uNodeValue.GetLocation() == nil {
				uNodeValue.SetLocation(loc)
			}
		}
	}
	// Iterate through all fields of the struct value
	if v.Kind() == reflect.Struct {
		for i := 0; i < v.NumField(); i++ {
			field := v.Field(i)
			// Check if the field is a slice or array
			if field.Kind() == reflect.Slice || field.Kind() == reflect.Array {
				for j := 0; j < field.Len(); j++ {
					elem := field.Index(j)
					// If the element is an interface or a pointer to a struct, then it could implement UNode
					if elem.Kind() == reflect.Interface || (elem.Kind() == reflect.Ptr && elem.Elem().Kind() == reflect.Struct) {
						// Check if the element can be an UNode (i.e., implements the UNode interface)
						if elem.Type().Implements(reflect.TypeOf((*UNode)(nil)).Elem()) && !elem.IsNil() {
							// Recursively call SetLocation on the UNode if its location is not set
							recursiveSetLocation(elem, loc)
						}
					}
				}
			} else if field.Kind() == reflect.Interface || (field.Kind() == reflect.Ptr && field.Elem().Kind() == reflect.Struct) {
				// Check if the field can be an UNode (i.e., implements the UNode interface)
				if field.Type().Implements(reflect.TypeOf((*UNode)(nil)).Elem()) && !field.IsNil() {
					// Recursively call SetLocation on the UNode if its location is not set
					recursiveSetLocation(field, loc)
				}
			}
		}
	}
}

func convertToLineColumn(node ast.Node, fset *token.FileSet) *Location {
	startPos := fset.Position(node.Pos())
	endPos := fset.Position(node.End())
	return &Location{
		SourceFile: startPos.Filename,
		Start: Position{
			Line:   startPos.Line,
			Column: startPos.Column,
		},
		End: Position{
			Line:   endPos.Line,
			Column: endPos.Column,
		},
	}
}
