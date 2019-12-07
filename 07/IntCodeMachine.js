const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

class IntCodeMachine {
  constructor(program, input = [], name = "") {
    this.codes = program.slice();
    this.curPos = 0;
    this.input = input;
    this.output;
    this.name = name;
  }

  parseInstruction(instruction) {
    const [mode3, mode2, mode1, , opCode] = `${instruction}`
      .padStart(5, "0")
      .split("")
      .map(Number);
    return [opCode, mode1, mode2, mode3];
  }

  getCode(offest = 0) {
    return this.codes[this.curPos + offest];
  }
  getOperands() {
    return [this.getCode(1), this.getCode(2), this.getCode(3)];
  }
  resolveMode(mode, operand) {
    return mode === 0 ? this.codes[operand] : operand;
  }

  sendInput(input) {
    this.input.push(input);
  }
  onOutput() {}
  onHalt() {}

  async run() {
    while (this.getCode() !== 99) {
      const [opCode, ...instructions] = this.parseInstruction(this.getCode());

      switch (opCode) {
        case 1:
          this._sum(instructions);
          break;
        case 2:
          this._mul(instructions);
          break;
        case 3:
          await this._input();
          break;
        case 4:
          this._output(instructions);
          break;
        case 5:
          this._jmpIfTrue(instructions);
          break;
        case 6:
          this._jmpIfFalse(instructions);
          break;
        case 7:
          this._lessThan(instructions);
          break;
        case 8:
          this._equalTo(instructions);
          break;
      }
    }
    this.onHalt();
    return this.output;
  }

  _sum([mode1, mode2]) {
    const [op1, op2, target] = this.getOperands();
    const value1 = this.resolveMode(mode1, op1);
    const value2 = this.resolveMode(mode2, op2);

    this.codes[target] = value1 + value2;
    this.curPos += 4;
  }
  _mul([mode1, mode2]) {
    const [op1, op2, target] = this.getOperands();
    const value1 = this.resolveMode(mode1, op1);
    const value2 = this.resolveMode(mode2, op2);

    this.codes[target] = value1 * value2;
    this.curPos += 4;
  }
  async _input() {
    // input
    const [target] = this.getOperands();

    if (!this.input.length) {
      await sleep();
    } else {
      this.codes[target] = this.input.shift();
      this.curPos += 2;
    }
  }
  _output([mode1]) {
    // output
    const [op1] = this.getOperands();
    const value = this.resolveMode(mode1, op1);
    // console.log("output ", value);
    setTimeout(() => this.onOutput(value), 0);
    this.output = value;
    this.curPos += 2;
  }
  _jmpIfTrue([mode1, mode2]) {
    const [op1, op2] = this.getOperands();
    const condition = this.resolveMode(mode1, op1);
    const targetPos = this.resolveMode(mode2, op2);

    this.curPos = condition !== 0 ? targetPos : this.curPos + 3;
  }
  _jmpIfFalse([mode1, mode2]) {
    const [op1, op2] = this.getOperands();
    const condition = this.resolveMode(mode1, op1);
    const targetPos = this.resolveMode(mode2, op2);

    this.curPos = condition === 0 ? targetPos : this.curPos + 3;
  }
  _lessThan([mode1, mode2]) {
    const [op1, op2, target] = this.getOperands();
    const value1 = this.resolveMode(mode1, op1);
    const value2 = this.resolveMode(mode2, op2);

    this.codes[target] = value1 < value2 ? 1 : 0;
    this.curPos += 4;
  }
  _equalTo([mode1, mode2]) {
    const [op1, op2, target] = this.getOperands();
    const value1 = this.resolveMode(mode1, op1);
    const value2 = this.resolveMode(mode2, op2);

    this.codes[target] = value1 === value2 ? 1 : 0;
    this.curPos += 4;
  }
}

module.exports = IntCodeMachine;
