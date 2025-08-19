package examples

import "fmt"

type Person1 struct {
	work func()
	name string
	age  int32
}

func testFunc() {
	fmt.Println("I am working!")
}

func main() {
	// 创建Person实例，并为其work字段分配testFunc函数
	person := Person1{work: testFunc, name: "Michał", age: 29}

	// 打印Person实例
	fmt.Printf("%+v\n", person)

	// 调用person的work函数（如果非nil）
	if person.work != nil {
		person.work()
	}
}
