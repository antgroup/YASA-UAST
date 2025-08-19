package examples

func main() {
	var m map[string]string
	m = make(map[string]string)
	var __taint_src = ""
	m["key1"] = __taint_src
	__taint_sink(m)
}

//	func main() {
//		var m map[string]string
//		m = make(map[string]string)
//		m["key1"] = "__taint_src"
//	}
var myMap = map[int]int{
	1: 1,
	2: 5,
	3: 10,
	4: 50,
}

//
//var myMap2 = map[string][3]string{
//	"fruits":  {"apple", "banana", "cherry"},
//	"animals": {"cat", "dog", "elephant"},
//}
