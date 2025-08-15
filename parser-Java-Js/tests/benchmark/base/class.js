class Base1 {
  constructor() {
    this.a1 = 3;
  }

  b1() {
    return this.a1;
  }
}

class Base2 extends Base1{
  constructor() {
    super();
    this.a1 = 4;
    this.a2 = 5;
  }

  b2() {
    return super.b1() + 1;
  }
}

class Derived extends Base2{
  constructor() {
    super();
    this.a3 = 6;
  }

  b3() {
    return super.b2() + 4;
  }
}
