/**
 * Introduction 结构体
 * Level 3
 */

// evaluation information start
// real case = true
// evaluation item = 完整度->污点对象跟踪完整度->数据类型->结构体
// bind_url = case/completeness/object_tracing/datatype/struct/struct_005_T/struct_005_T.go
// evaluation information end

package examples

//func process() {
//	type entry struct {
//		key string
//		val string
//	}
//	var entries []entry
//	entries = append(entries, entry{"abc", "def"})
//}

type AAA struct {
	data string
}

func struct_003_T(__taint_src string) {
	p := new(AAA)
	p.data = __taint_src
	__taint_sink(p)
}
