package main

import "fmt"

// 定义一个泛型类型 Map，类似于 C++ 或 Java 的 Map
type Map[K comparable, V any] struct {
	data map[K]V
}

// 创建一个新的泛型 Map
func NewMap[K comparable, V any]() *Map[K, V] {
	return &Map[K, V]{data: make(map[K]V)}
}

func main() {
	//var mymap2 = newMap2()
	//var myMap = NewMap[int, string]()
	//myMap.data[1] = "one"
	//fmt.Println(myMap)
	//fmt.Println(mymap2)

	s := make([]string, 3)

	s[0] = "a"
	s[1] = "b"
	s[2] = "c"

	l2 := s[1:]
	fmt.Println(l2)
}

func newMap2() *map[int]string {
	return &map[int]string{}
}

//type MyData struct {
//	dataslice []string
//	datamap   map[string]int
//}
//
//func NewMyData() *MyData {
//	m := new(MyData)
//	m.dataslice = []string{
//		"string1",
//		"string2",
//		"string3",
//	}
//	m.datamap = make(map[string]int)
//	for x := range m.dataslice {
//		m.datamap[m.dataslice[x]] = x
//	}
//	return m
//}
//
//func (m *MyData) GetKey(x int) string {
//	return m.dataslice[x]
//}
//
//func (m *MyData) GetVal(x string) int {
//	return m.datamap[x]
//}
