package examples

func main() {
	var ch = make(chan int, 1)
	ch <- 1
}
