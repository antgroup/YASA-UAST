package examples

import "fmt"

type Filters []Filter

type Filter struct {
	Key      string
	Value    string
	Operator Operator
}

type Operator string

func (f Filters) Parse() []string {
	if len(f) == 0 {
		return nil
	}
	exp := make([]string, len(f))
	for i, v := range f {
		exp[i] = fmt.Sprintf("%s %s", v.Key, v.Value)
		__taint_sink(v.Value)
	}
	return exp
}

func main() {
	filters := Filters{
		Filter{Key: __taint_src, Value: "John", Operator: "="},
		Filter{Key: "age", Value: "30", Operator: ">"},
	}
	__taint_sink(filters.Parse())
}
