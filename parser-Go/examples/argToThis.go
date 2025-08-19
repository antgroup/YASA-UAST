package examples

import (
	"bytes"
)

func main() {
	c := make([]string, 1)
	_ = c
	var buf bytes.Buffer
	abc := []byte("__taint_src")
	var ab string = string(abc)
	buf.Write(abc)
	_ = ab

	__taint_sink(buf)
}
