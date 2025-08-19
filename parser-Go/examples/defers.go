package examples

import (
	"context"
)

func RunCommandInAntjail(ctx context.Context, option Option) {
	defer umountFn()
}

//func CallbackProc(uri string, body interface{}) error {
//	if uri == "" {
//		return nil
//	}
//	buf := &bytes.Buffer{}
//	encoder := json.NewEncoder(buf)
//	encoder.SetEscapeHTML(false)
//	err := encoder.Encode(body)
//	if err != nil {
//		return err
//	} else {
//		defer res.Body.Close()
//	}
//	return nil
//}
//
//func DeferCallee() {
//	fmt.Println("Called from the first defer!")
//}
//
//func DeferCallee2() {
//	fmt.Println("Called from the second defer!")
//}
//
//func Defers() {
//	pvk, err := rsa.GenerateKey(rand.Reader, 2048)
//	defer DeferCallee()
//	// switch the equal sign for the different number of executed defer invocations
//	if extra := -1; err != nil {
//		fmt.Println("Something went wrong", extra)
//	} else {
//		return
//	}
//
//	defer DeferCallee2()
//	fmt.Printf("End\n", pvk.Size())
//}
