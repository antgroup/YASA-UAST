package main

import (
	"encoding/json"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"uast4go/uast"

	"github.com/stretchr/testify/assert"
)

func TestCreatePackage(t *testing.T) {
	// Assume we're in the module root directory
	rootDir := "/Users/xxxx/dev/uast/yasa/yasa/deps/uast4go/examples/asdf"

	// Read the module name from go.mod
	moduleName, err := readModuleName(filepath.Join(rootDir, "go.mod"))
	if err != nil {
		panic(err)
	}

	// FileSet needed for parsing
	fset := token.NewFileSet()

	// Map to store package path to package
	packages := make(map[string]*ast.Package)

	// Walk the directory tree
	err = filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// We're only interested in directories
		if !info.IsDir() {
			return nil
		}

		// Skip the .git folder and any other dot folders
		if strings.HasPrefix(info.Name(), ".") {
			return filepath.SkipDir
		}

		// Parse the package in the directory
		packageName, files, err := parsePackage(path, fset)
		if err != nil {
			return err
		}

		// Construct the full package import path
		relativePath, _ := filepath.Rel(rootDir, path)
		packagePath := filepath.Join(moduleName, relativePath)

		// Store the package in the map
		packages[packagePath] = &ast.Package{
			Name:  packageName,
			Files: files,
		}

		return nil
	})
	if err != nil {
		panic(err)
	}

	b := uast.NewUASTBuilder("test", packages, fset)
	b.Build()
	files := b.GetResult()

	jsonBytes, err := json.MarshalIndent(files, "", "  ")
	if err != nil {
		log.Fatalf("JSON marshaling failed: %s", err)
	}

	// jsonBytes是一个字节切片，可以转为字符串输出
	jsonString := string(jsonBytes)
	fmt.Println(jsonString)
}

type AssignCopy struct {
	T string
}

func TestCreatePackage1(t *testing.T) {
	a := AssignCopy{T: "asdf"}
	b := &a
	c := &b
	//## taint_flow_test
	println((*c).T)
}

func buidUAST(path string) string {
	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, path, nil, parser.DeclarationErrors)
	if err != nil {
		panic(err)
	}
	pkg := &ast.Package{
		Name:    "__single__",
		Scope:   nil,
		Imports: nil,
		Files:   make(map[string]*ast.File),
	}
	pkg.Files[path] = f
	packages := make(map[string]*ast.Package)
	packages["__single__"] = pkg

	packageInfo := buildPackage("__single_module__", packages, fset)
	output := &Output{
		PackageInfo: packageInfo,
		ModuleName:  "__single_module__",
	}
	jsonBytes, err := json.MarshalIndent(output, "", "  ")
	if err != nil {
		log.Fatalf("JSON marshaling failed: %s", err)
	}
	// jsonBytes是一个字节切片，可以转为字符串输出
	jsonString := string(jsonBytes)
	return jsonString
}

func processGoFiles(dir string) error {
	return filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		// 检查文件是否是 .go 文件
		if !info.IsDir() && strings.HasSuffix(info.Name(), ".go") {
			// 调用 test 函数
			result := buidUAST(path)

			// 创建对应的 .go.json 文件路径
			jsonFilePath := path + ".json"

			// 将结果写入 .go.json 文件
			err = ioutil.WriteFile(jsonFilePath, []byte(result), 0644)
			if err != nil {
				return fmt.Errorf("failed to write to file %s: %v", jsonFilePath, err)
			}
			fmt.Printf("Processed %s, result written to %s\n", path, jsonFilePath)
		}
		return nil
	})
}

// 注意：只在全局更新uast时运行，运行时打开注释即可
//func TestBuildUAST(t *testing.T) {
//	dir := "/Users/ariel/code/uast/uast4go/examples"
//
//	if err := processGoFiles(dir); err != nil {
//		fmt.Printf("Error processing files: %v\n", err)
//	}
//}

// readFileContent 读取文件内容并返回为字符串
func readFileContent(filePath string) (string, error) {
	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

// 真正校验uast正确性的单测
func TestBuildOutput(t *testing.T) {
	// 使用 assert 库
	assert := assert.New(t)

	dir := "/Users/ariel/code/uast/uast4go/examples"

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// 只处理 .go 文件
		if !info.IsDir() && strings.HasSuffix(info.Name(), ".go") {
			// 调用 build 函数
			result := buidUAST(path)

			// 构建 .go.json 文件路径
			jsonFilePath := path + ".json"

			// 读取 .go.json 文件内容
			expectedContent, err := readFileContent(jsonFilePath)
			if err != nil {
				assert.Failf("Failed to read JSON file", "Could not read file %s: %v", jsonFilePath, err)
				return nil
			}

			// 使用 assert.Equal 来比较结果
			assert.Equal(expectedContent, result, "Output mismatch for file %s", path)
		}
		return nil
	})

	if err != nil {
		t.Fatalf("Error processing files: %v", err)
	}
}
