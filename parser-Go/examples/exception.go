package examples

func exception_throw_002_F(__taint_src string) {
	defer func() {
		if r := recover(); r != nil {
			__taint_sink(r)
		}
	}()

	panic("_")

}

func __taint_sink(o interface{}) {}

func main() {
	exception_throw_002_F("__taint_src")
}
