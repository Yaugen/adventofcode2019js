const run = (intCodes, p1, p2) => {
  const input = intCodes.slice();
  input[1] = p1;
  input[2] = p2;

  let curPos = 0;
  while (input[curPos] !== 99) {
    const currCode = input[curPos];
    const op1 = input[curPos + 1];
    const op2 = input[curPos + 2];
    const target = input[curPos + 3];
    switch (currCode) {
      case 1:
        input[target] = input[op1] + input[op2];
        break;
      case 2:
        input[target] = input[op1] * input[op2];
        break;
    }
    curPos += 4;
  }
  return input[0];
};

module.exports = run;
