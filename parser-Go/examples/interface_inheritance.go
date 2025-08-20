package examples

import "fmt"

type TInterface1 struct {
	name string
}

func (t TInterface1) ClearName()     {}
func (t TInterface1) N()             {}
func (t TInterface1) String() string { return "" }
func (t TInterface1) Error() string  { return "" }

type TInterface2 struct {
	name string
}

func (t TInterface2) ClearName()     {}
func (t TInterface2) N()             {}
func (t TInterface2) String() string { return "" }
func (t TInterface2) Error() string  { return "" }

type I interface {
	ClearName()
}

// In the following interface declaration, error is an
// inherited interface, not the "result" type of N()
type V interface {
	I
	fmt.Stringer
	N()
	error
}

func main() {
	m := make(map[I]int)
	var i1 I = TInterface1{"foo"}
	var i2 I = TInterface2{"bar"}
	m[i1] = 1
	m[i2] = 2
	fmt.Println(m)

	n := make(map[V]int)
	var v1 V = TInterface1{"foo"}
	var v2 V = TInterface2{"bar"}
	v1.N()
	v2.ClearName()
	v1.String()
	v2.Error()
	n[v1] = 3
	n[v2] = 4
	fmt.Println(n)
}
