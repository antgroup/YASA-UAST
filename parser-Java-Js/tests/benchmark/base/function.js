function foo() {return 0;}

(function(){
  return 0;
})()

const bar = () => 1;

function a1(a, b, ...c) {
  return [a, b, c];
}

function a2({ a:a1, b:b2 }) {
  return [a1, b2];
}
