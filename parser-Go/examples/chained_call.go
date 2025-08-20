package examples

func chained_call_002_T(__taint_src string) {
	instance := &AA{"Bob"}
	instance.setName("_").clearName().setName(__taint_src).process()
}

type AA struct {
	name string
}

func (a *AA) setName(name string) *AA {
	a.name = name
	return a
}

func (a *AA) clearName() *AA {
	a.name = ""
	return a
}

func (a *AA) process() {
	__taint_sink(a.name)
}
