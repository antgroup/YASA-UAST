function foo(arg1, ...args) {
    //## taint_flow_test
    __taint_sink(args['1']);
}
