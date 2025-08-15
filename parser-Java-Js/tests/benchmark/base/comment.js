class User {
    constructor(cardID, password, name) {
        //@sensitiveData
        this.password = password;
        //@sensitiveData
        this.cardID = cardID;
        this.name = name;
    }
    
    sink() {
        //## taint_flow_test
        __taint_sink(this.password);
        
        //#paas#
        __taint_sink(this.name);
    }
}

let user = new User(1, 2, 3);
;
user.sink();
