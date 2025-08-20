package examples

import (
	"fmt"
)

// 定义一个表示人信息的结构体
type Person struct {
	Name string
	Age  int
}

func main() {
	// 使用结构体复合字面量创建Person实例
	person := Person{Name: "Alice", Age: 30}
	fmt.Printf("Person: %+v\n", person)

	// 使用数组复合字面量创建并初始化数组
	arr := [3]int{1, 2, 3}
	fmt.Printf("Array: %v\n", arr)

	// 使用切片复合字面量创建并初始化切片
	slice := []string{"apple", "banana", "cherry"}
	fmt.Printf("Slice: %v\n", slice)

	// 使用映射复合字面量创建并初始化映射
	courses := map[string]int{
		"Math":      98,
		"Physics":   92,
		"Chemistry": 95,
	}
	fmt.Printf("Map: %v\n", courses)

	// 结构体内嵌复合字面量
	book := struct {
		Title  string
		Author string
	}{
		Title:  "The Go Programming Language",
		Author: "Alan AA. AA. Donovan & Brian W. Kernighan",
	}
	fmt.Printf("Book: %+v\n", book)
}
