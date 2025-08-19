// Copyright 2011 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// This file implements NewPackage.

package main

import "fmt"

type MapFunc[T any, U any] func(T) U

func main() {
	fmt.Print(string(1))
	values := []int{1, 2, 3, 4}
	sum(values...) // 切片被展开为独立的参数
}

func sum(nums ...int) int {
	total := 0
	for _, num := range nums {
		total += num
	}
	return total
}

func test() {
	var x interface{}
	switch i := x.(type) {
	case nil:
		println("x is nil") // type of i is type of x (interface{})
	case int:
		println(i) // type of i is int
	case float64:
		println(i) // type of i is float64
	case func(int) float64:
		println(i) // type of i is func(int) float64
	case bool, string:
		println("type is bool or string") // type of i is type of x (interface{})
	default:
		println("don't know the type") // type of i is type of x (interface{})
	}
}
