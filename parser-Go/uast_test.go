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
	"reflect"
	"runtime"
	"strings"
	"testing"
	"uast4go/uast"

	"github.com/stretchr/testify/assert"
)

// testdataDir returns the parser-Go directory (where uast_test.go lives), for portable paths.
func testdataDir(t *testing.T) string {
	_, filename, _, _ := runtime.Caller(0)
	return filepath.Dir(filename)
}

func TestCreatePackage(t *testing.T) {
	// Use repo examples dir (has go.mod) so test runs on any machine (Mac/Linux/CI)
	rootDir := filepath.Join(testdataDir(t), "examples")

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
	displayPath := filepath.ToSlash(path)
	if absPath, err := filepath.Abs(path); err == nil {
		normalizedAbsPath := filepath.ToSlash(absPath)
		if i := strings.LastIndex(normalizedAbsPath, "examples/"); i >= 0 {
			displayPath = normalizedAbsPath[i:]
		}
	}
	content, err := os.ReadFile(path)
	if err != nil {
		panic(err)
	}
	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, displayPath, content, parser.DeclarationErrors)
	if err != nil {
		panic(err)
	}
	pkg := &ast.Package{
		Name:    "__single__",
		Scope:   nil,
		Imports: nil,
		Files:   make(map[string]*ast.File),
	}
	pkg.Files[displayPath] = f
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

// normalizeJSONForGoldenCompare 规范化 JSON 再比较：路径统一为 examples/相对路径，去掉 Offset/goModPath/numOfGoMod，_meta 统一为 {}，便于跨机器 golden 通过。返回规范化后的 map 便于深度比较（避免 JSON 键序差异）。
func normalizeJSONForGoldenCompare(jsonStr string) (map[string]interface{}, error) {
	var m map[string]interface{}
	if err := json.Unmarshal([]byte(jsonStr), &m); err != nil {
		return nil, err
	}
	normalizeMapForGolden(m)
	return m, nil
}

func normalizeMapForGolden(m map[string]interface{}) {
	const (
		keyOffset     = "Offset"
		keyGoModPath  = "goModPath"
		keyNumOfGoMod = "numOfGoMod"
	)
	var keyRenames []struct{ old, new string }
	for k, v := range m {
		switch k {
		case keyOffset:
			if isNumberZero(v) {
				delete(m, k)
			}
			continue
		case keyGoModPath, keyNumOfGoMod:
			delete(m, k)
			continue
		case "_meta":
			if meta, ok := v.(map[string]interface{}); ok {
				normalizeMapForGolden(meta)
				if isReceiveClsOnlyMeta(meta) {
					m[k] = map[string]interface{}{}
				}
			}
			continue
		}
		// 路径有时在 key 里（如 files 的 key 是文件路径）
		if normalized, ok := normalizeExamplePath(k); ok && normalized != k {
			keyRenames = append(keyRenames, struct{ old, new string }{k, normalized})
		}
		switch val := v.(type) {
		case string:
			if normalized, ok := normalizeExamplePath(val); ok {
				m[k] = normalized
			}
		case map[string]interface{}:
			normalizeMapForGolden(val)
		case []interface{}:
			for _, e := range val {
				if nm, ok := e.(map[string]interface{}); ok {
					normalizeMapForGolden(nm)
				}
			}
		}
	}
	for _, r := range keyRenames {
		m[r.new] = m[r.old]
		delete(m, r.old)
	}
}

func normalizeExamplePath(value string) (string, bool) {
	if !strings.Contains(value, "examples") || !strings.HasSuffix(value, ".go") {
		return "", false
	}
	value = strings.ReplaceAll(value, "\\", "/")
	if i := strings.LastIndex(value, "examples/"); i >= 0 {
		return value[i:], true
	}
	return "", false
}

func isNumberZero(v interface{}) bool {
	switch x := v.(type) {
	case float64:
		return x == 0
	case int:
		return x == 0
	default:
		return false
	}
}

func isReceiveClsOnlyMeta(v interface{}) bool {
	m, ok := v.(map[string]interface{})
	if !ok || len(m) != 1 {
		return false
	}
	rc, ok := m["ReceiveCls"]
	return ok && (rc == "" || rc == nil)
}

// TestRegenerateGolden 在 REGENERATE_GOLDEN=1 时用当前 builder 输出覆盖 examples/*.go.json（已规范化路径），便于跨机器一致。平时不跑。
func TestRegenerateGolden(t *testing.T) {
	if os.Getenv("REGENERATE_GOLDEN") != "1" {
		t.Skip("set REGENERATE_GOLDEN=1 to regenerate golden files")
	}
	dir := filepath.Join(testdataDir(t), "examples")
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() || !strings.HasSuffix(info.Name(), ".go") {
			return nil
		}
		result := buidUAST(path)
		norm, err := normalizeJSONForGoldenCompare(result)
		if err != nil {
			return err
		}
		bytes, err := json.MarshalIndent(norm, "", "  ")
		if err != nil {
			return err
		}
		return ioutil.WriteFile(path+".json", bytes, 0644)
	})
	if err != nil {
		t.Fatal(err)
	}
}

// 真正校验uast正确性的单测
func TestBuildOutput(t *testing.T) {
	assert := assert.New(t)
	dir := filepath.Join(testdataDir(t), "examples")

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		// 只处理 .go 文件
		if info.IsDir() || !strings.HasSuffix(info.Name(), ".go") {
			return nil
		}

		result := buidUAST(path)
		jsonFilePath := path + ".json"
		expectedContent, err := readFileContent(jsonFilePath)
		if err != nil {
			assert.Failf("Failed to read JSON file", "Could not read file %s: %v", jsonFilePath, err)
			return nil
		}

		normExpected, err := normalizeJSONForGoldenCompare(expectedContent)
		assert.NoError(err, "normalize expected for %s", path)
		normResult, err := normalizeJSONForGoldenCompare(result)
		assert.NoError(err, "normalize result for %s", path)
		assert.True(reflect.DeepEqual(normExpected, normResult), "Output mismatch for file %s", path)
		return nil
	})

	if err != nil {
		t.Fatalf("Error processing files: %v", err)
	}
}
