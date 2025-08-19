package examples

import "fmt"

type MyString string

func main() {
	var src2, s3 = make(map[string]int), []string{"src"}
	__taint_src, s := "__taint_Src", []string{"src"}
	src, s2 := __taint_src, []string{"src"}
	var alias MyString = MyString(src)
	fmt.Println(s, s2, alias, src2, s3)
}
