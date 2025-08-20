package examples

// import "fmt"
import (
	. "time"
)

func Server() {
}

func GoStmts() {
	go Server()
	go func() { Sleep(10) }()
	/*var c chan
	go func(ch chan<- bool) { for { sleep(10); ch <- true }} (<-c)*/
}

func processTaintedData(data interface{}) {
	__taint_sink(data)
}

func main() {
	// 从污点源获取不受信任的数据
	data := __taint_src

	go processTaintedData(data)
}
