for (var i = 0; i < multiArray.length; i++) {
  var lastTime = multiArray[i].split('~')[1];
  if (lastTime == time) {
    num2 = i;
    break;
  }
}
