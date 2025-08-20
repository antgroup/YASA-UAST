const { a: a1, b: { b1, b2 }, ...c } = { a: 3, b: { b1: 3, b2: 4 }, c: 5, d: 6 };

const [ r1, r2, ...rest ] = [ 1, 2, 3, 4, 5 ];

function foo({ a: a1, b }, { force } = {}) {
  return [ a1, b ];
}

for (const var1 of c) {

}

let var1
for (var1 of c) {

}

for ({ a, b } of c) {

}

for (const { a, b } of c) {

}
