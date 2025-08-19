package examples

import (
	"fmt"
)

func ArrayDecls() {
	/*[32]byte
	[2*N] struct { x, y int32 }
	[1000]*float64
	[3][5]int
	[2][2][2]float64  // same as [2]([2]([2]float64))
	*/
	//c := make([]string, 1)
	//_ = c
	//
	//var s = make(map[string]int)
	//fmt.Println(s)

	var a [2]string
	a[0] = "Hello"
	a[1] = "World"
	fmt.Println(a[0], a[1])

	var b = a
	fmt.Println(b[0])

	primes := [6]int{2, 3, 5, 7, 11, 13}
	l0 := primes[:3]
	fmt.Println(l0, primes)

	var (
		twoD  [2][4]int
		twoD2 [2][4]int
	)
	for i := 0; i < 2; i++ {
		for j := 0; j < 3; j++ {
			twoD[i][j] = i + j
			twoD2[i][j] = i + j
		}
	}
	fmt.Println("2d: ", twoD, twoD2)

	primes2 := map[string][]int{
		"primeNumbers": {2, 3, 5, 7, 11, 13},
	}
	fmt.Println(primes2)

	type ScoreMap = map[string]int
	var scores ScoreMap
	scores["a"] = 1
}
