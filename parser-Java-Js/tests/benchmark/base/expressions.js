const foo = 3;
//Array Expression
[1, 1+1, (()=>1)(), foo];

//Object Exression
const bar = {
  foo,
  a1 : 3,
  a2 : { a21: true, a22: false },
  a3() {
    return 3;
  },
  a4: function() {
    return 3;
  }
};

( 1, 2, 34 )

//TODO RecordExpression TupleExpression

foo? foo: bar;

( 1+3 );

