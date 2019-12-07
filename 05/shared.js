const parseInstruction = instruction => {
  const [mode3, mode2, mode1, , opCode] = `${instruction}`
    .padStart(5, "0")
    .split("")
    .map(Number);
  return [opCode, mode1, mode2, mode3];
};

const run = (program, input) => {
  const codes = program.slice();
  let output;

  let curPos = 0;
  while (codes[curPos] !== 99) {
    const [opCode, mode1, mode2, mode3] = parseInstruction(codes[curPos]);

    if (opCode === 1) {
      // sum
      const op1 = codes[curPos + 1];
      const op2 = codes[curPos + 2];
      const target = codes[curPos + 3];
      const value1 = mode1 === 0 ? codes[op1] : op1;
      const value2 = mode2 === 0 ? codes[op2] : op2;

      codes[target] = value1 + value2;
      curPos += 4;
    } else if (opCode === 2) {
      // mul
      const op1 = codes[curPos + 1];
      const op2 = codes[curPos + 2];
      const target = codes[curPos + 3];
      const value1 = mode1 === 0 ? codes[op1] : op1;
      const value2 = mode2 === 0 ? codes[op2] : op2;

      codes[target] = value1 * value2;
      curPos += 4;
    } else if (opCode === 3) {
      // input
      const target = codes[curPos + 1];

      codes[target] = input;
      curPos += 2;
    } else if (opCode === 4) {
      // output
      const op1 = codes[curPos + 1];
      const value = mode1 === 0 ? codes[op1] : op1;
      console.log("output ", value);
      output = value;
      curPos += 2;
    } else if (opCode === 5) {
      // jump if true
      const op1 = codes[curPos + 1];
      const op2 = codes[curPos + 2];
      const condition = mode1 === 0 ? codes[op1] : op1;
      const targetPos = mode2 === 0 ? codes[op2] : op2;

      curPos = condition !== 0 ? targetPos : curPos + 3;
    } else if (opCode === 6) {
      // jump if false
      const op1 = codes[curPos + 1];
      const op2 = codes[curPos + 2];
      const condition = mode1 === 0 ? codes[op1] : op1;
      const targetPos = mode2 === 0 ? codes[op2] : op2;

      curPos = condition === 0 ? targetPos : curPos + 3;
    } else if (opCode === 7) {
      // less than
      const op1 = codes[curPos + 1];
      const op2 = codes[curPos + 2];
      const target = codes[curPos + 3];
      const value1 = mode1 === 0 ? codes[op1] : op1;
      const value2 = mode2 === 0 ? codes[op2] : op2;

      codes[target] = value1 < value2 ? 1 : 0;
      curPos += 4;
    } else if (opCode === 8) {
      // equal to
      const op1 = codes[curPos + 1];
      const op2 = codes[curPos + 2];
      const target = codes[curPos + 3];
      const value1 = mode1 === 0 ? codes[op1] : op1;
      const value2 = mode2 === 0 ? codes[op2] : op2;

      codes[target] = value1 === value2 ? 1 : 0;
      curPos += 4;
    }
  }
};

module.exports = run;
