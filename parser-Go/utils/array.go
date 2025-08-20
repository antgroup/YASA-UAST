package utils

func GetLastElement[T any](slice []T) (T, bool) {
	if len(slice) == 0 {
		var zeroVal T // 根据 T 的类型自动推导零值
		return zeroVal, false
	}
	return slice[len(slice)-1], true
}

func RemoveLastElement[T any](slice []T) ([]T, bool) {
	// 边界情况：切片为空
	if len(slice) == 0 {
		return slice, false
	}
	// 移除最后一个元素
	return slice[:len(slice)-1], true
}
