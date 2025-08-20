/**
 * Introduction 多返回值传递
 * Level 2
 */

// evaluation information start
// real case = true
// evaluation item = 准确度->流敏感->返回值传递->多返回值传递
// bind_url = case/accuracy/context_sensitive/return/multiple_return_006_T/multiple_return_006_T.go
// evaluation information end

package examples

func multiple_return_006_T(__taint_src interface{}) {
	a := "_"
	var ret1 interface{}
	var ret2 interface{}
	ret1, ret2 = processData(__taint_src, a)
	_ = ret2
	__taint_sink(ret1)
}

func processData(s interface{}, i interface{}) (interface{}, interface{}) {
	return s, i
}
