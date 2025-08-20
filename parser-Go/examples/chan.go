package examples

import "fmt"

func main() {
	ch := make(chan int, 1)
	go testData(ch)
	fmt.Println(<-ch)

	var ch2 chan int
	go testData(ch2)
}

func testData(ch chan<- int) {
	ch <- 10
}
