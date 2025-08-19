package examples

import "fmt"
import "sync"

//	type Persons struct {
//		name string
//		age  int32
//	}
const a, b, c = 3, 4, "foo" //yes
//
//func (p Persons) process() (int, int, string) {
//	s := make(map[string]int)
//	fmt.Println(s)
//	m := 10
//	n := 20
//	l := "result"
//	return m, n, l
//}
//
//func process2() (int, int, string) {
//	s := make(map[string]int)
//	fmt.Println(s)
//	m := 10
//	n := 20
//	l := "result"
//	return m, n, l
//}
//
//func (p Person) process1() int {
//	m := 10
//	return m
//}

func synchronization_primitive_003_T(__taint_src string) {
	ch := make(chan string, 2)
	ch <- __taint_src
	result, ok := <-ch //rhs UnaryExpr
	if ok {
		//do nothing
	}
	__taint_sink(result)
}

func parallel_range() {
	m := map[string]int{
		"apple":  5,
		"banana": 3,
	}

	for key, value := range m {
		fmt.Println(key, value)
	}

	value, ok := m["orange"] //rhs IndexExpr
	fmt.Println(value, ok)
}

func libFunction() {
	m := &sync.Map{}

	m.Store("apple", 5)

	value, ok := m.Load("orange")
	if ok {
		fmt.Println("Value:", value)
	} else {
		fmt.Println("Key not found")
	}
}

//func main() {
//	p := Persons{}             //yes
//	e, f, g := p.process()     //no
//	u, v, w := process2()      //yes
//	p2 := Person{"abc", 56789} //yes
//	u1 := p2.process1()        //no
//	fmt.Println(e, f, g, u, v, w, u1)
//
//}
