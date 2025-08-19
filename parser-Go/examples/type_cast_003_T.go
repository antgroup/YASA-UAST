/**
 * Introduction 类型转换
 * Level 2
 */

// evaluation information start
// real case = true
// evaluation item = 完整度->链路跟踪完整度->表达式->类型转换->类型断言
// bind_url = case/completeness/chain_tracing/expression/type_cast/type_cast_003_T/type_cast_003_T.go
// evaluation information end

package examples

func type_cast_003_T(__taint_src interface{}) {
	result, ok := __taint_src.(string)
	_ = ok
	__taint_sink(result)
}
