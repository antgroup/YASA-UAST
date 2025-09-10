package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"os"
	"path/filepath"
	"strings"
	"uast4go/uast"
)

// parsePackage parses the go files in the given directory and returns the package name.
func parsePackage(dir string, fset *token.FileSet) (packageName string, files map[string]*ast.File, err error) {
	pkgs, err := parser.ParseDir(fset, dir, func(info os.FileInfo) bool {
		// 只处理 Go 源文件
		return !info.IsDir() && strings.HasSuffix(info.Name(), ".go")
	}, 0)
	if err != nil {
		return "", nil, err
	}

	// 应该只有一个包名 per directory
	for name, pkg := range pkgs {
		return name, pkg.Files, nil
	}

	return "", nil, fmt.Errorf("no packages found in directory %s", dir)
}

// readModuleName reads the module name from the go.mod file.
func readModuleName(modFilePath string) (string, error) {
	content, err := os.ReadFile(modFilePath)
	if err != nil {
		return "", err
	}
	lines := strings.Split(string(content), "\n")
	for _, line := range lines {
		if strings.HasPrefix(line, "module") {
			fields := strings.Fields(line)
			if len(fields) == 2 {
				return fields[1], nil
			}
		}
	}
	return "", fmt.Errorf("module directive not found in %s", modFilePath)
}

type Output struct {
	PackageInfo *uast.PackagePathInfo `json:"packageInfo"`
	ModuleName  string                `json:"moduleName"`
	GoModPath   string                `json:"goModPath"`
}

func main() {
	var rootDir string
	var singleFileParse bool
	var output string
	flag.StringVar(&rootDir, "rootDir", "", "The root directory of the Go project")
	flag.BoolVar(&singleFileParse, "single", false, "is single file parse")
	flag.StringVar(&output, "output", "", "The output path of Go UAST")
	flag.Parse()

	if singleFileParse {
		parseSingleFile(rootDir, output)
	} else {
		parseGoModule(rootDir, output)
	}
}

func parseSingleFile(file string, output string) {
	// FileSet needed for parsing
	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, file, nil, parser.DeclarationErrors)
	if err != nil {
		panic(err)
	}
	pkg := &ast.Package{
		Name:    "__single__",
		Scope:   nil,
		Imports: nil,
		Files:   make(map[string]*ast.File),
	}
	pkg.Files[file] = f
	packages := make(map[string]*ast.Package)
	packages["__single__"] = pkg

	buildAndPrint("__single_module__", packages, fset, output, "")
}

func parseGoModule(rootDir string, output string) {
	// FileSet needed for parsing
	fset := token.NewFileSet()
	var moduleName string
	// Read the module name from go.mod
	// Find the go.mod file
	goModPath, err := findGoMod(rootDir)
	if err != nil {
		moduleName = "__unknown_module__"
	} else {
		name, _ := readModuleName(goModPath)
		moduleName = name
	}

	packages, _ := preparePackage(moduleName, rootDir, fset)
	//if err != nil {
	//	panic(err)
	//}
	buildAndPrint(moduleName, packages, fset, output, goModPath)
}

// findGoMod searches for a go.mod file starting from dir and recursing into subdirectories if not found
func findGoMod(dir string) (string, error) {
	if strings.Contains(dir, "/vendor") {
		return "", fmt.Errorf("find vendor")
	}
	const goModFileName = "go.mod"

	// Check if go.mod exists in the current directory
	goModPath := filepath.Join(dir, goModFileName)
	if _, err := os.Stat(goModPath); !os.IsNotExist(err) {
		return goModPath, nil
	}

	// If not found, recurse into subdirectories
	entries, err := os.ReadDir(dir)
	if err != nil {
		return "", err
	}

	for _, entry := range entries {
		if entry.IsDir() {
			subDir := filepath.Join(dir, entry.Name())
			goModPath, err := findGoMod(subDir)
			if err == nil {
				return goModPath, nil
			}
		}
	}

	return "", fmt.Errorf("go.mod not found in directory or subdirectories: %s", dir)
}

func buildAndPrint(moduleName string, packages map[string]*ast.Package, fset *token.FileSet, outputPath string, goModPath string) {
	packageInfo := buildPackage(moduleName, packages, fset)
	output := &Output{
		PackageInfo: packageInfo,
		ModuleName:  moduleName,
		GoModPath:   goModPath,
	}
	//jsonBytes, err := json.MarshalIndent(output, "", "  ")
	//if err != nil {
	//	log.Fatalf("JSON marshaling failed: %s", err)
	//}
	file, err := os.Create(outputPath)
	if err != nil {
		fmt.Println("无法创建文件:", err)
		return
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ") // 美化 JSON 输出，缩进为两个空格
	if err := encoder.Encode(output); err != nil {
		fmt.Println("编码失败:", err)
		return
	}
	// jsonBytes是一个字节切片，可以转为字符串输出
	//jsonString := string(jsonBytes)
	//fmt.Println(jsonString)
}

func preparePackage(moduleName string, rootDir string, fset *token.FileSet) (map[string]*ast.Package, error) {
	//// Read the module name from go.mod
	//moduleName, err := readModuleName(filepath.Join(rootDir, "go.mod"))
	//if err != nil {
	//	return nil, err
	//}

	// Map to store package path to package
	packages := make(map[string]*ast.Package)

	// Walk the directory tree
	err := filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// We're only interested in directories
		if !info.IsDir() || !ContainsGoFiles(path) || strings.Contains(path, "/vendor") {
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
		packagePath := filepath.Join("/", relativePath)

		if !strings.HasPrefix(packagePath, "/vendor") {
			// Store the package in the map
			packages[packagePath] = &ast.Package{
				Name:  packageName,
				Files: files,
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}
	return packages, nil
}

func buildPackage(moduleName string, packages map[string]*ast.Package, fset *token.FileSet) *uast.PackagePathInfo {
	b := uast.NewUASTBuilder(moduleName, packages, fset)
	b.Build()
	return b.GetResult()
}

func ContainsGoFiles(dir string) bool {
	list, err := os.ReadDir(dir)
	if err != nil {
		return false
	}
	flag := false
	for _, d := range list {
		if strings.HasSuffix(d.Name(), ".go") {
			flag = true
		}
	}
	return flag
}
