const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

class IntCodeMachine {
  constructor(program, input = [], name = "") {
    this.memory = program.slice();
    this.pointer = 0;
    this.input = input;
    this.output;
    this.name = name;
    this.relativeBase = 0;
  }

  get currentInstruction() {
    return this.memory[this.pointer];
  }

  get parsedInstruction() {
    const [mode3, mode2, mode1, , opCode] = `${this.currentInstruction}`
      .padStart(5, "0")
      .split("")
      .map(Number);

    return [opCode, mode1, mode2, mode3];
  }

  readMemory(pointer) {
    const value = this.memory[pointer];
    return value === undefined ? 0 : value;
  }

  writeMemory(pointer, value) {
    this.memory[pointer] = value;
  }

  getAddress(mode, offest = 0) {
    const position = this.pointer + offest;
    switch (mode) {
      case 0:
        return this.readMemory(position);
      case 1:
        return position;
      case 2:
        return this.readMemory(position) + this.relativeBase;
    }
  }

  getValue(mode, offset = 0) {
    const address = this.getAddress(mode, offset);
    const value = this.readMemory(address);
    return value === undefined ? 0 : value;
  }

  adjustPosition(offset = 0) {
    const newPosition = this.pointer + offset;
    this.pointer = newPosition;
  }
  setPosition(position) {
    const newPosition = position;
    this.pointer = newPosition;
  }

  sendInput(input) {
    this.input.push(input);
  }
  onOutput() {}
  onHalt() {}

  async run() {
    while (this.currentInstruction !== 99) {
      const [opCode, ...modes] = this.parsedInstruction;

      switch (Number(opCode)) {
        case 1:
          this._sum(modes);
          break;
        case 2:
          this._mul(modes);
          break;
        case 3:
          await this._input(modes);
          break;
        case 4:
          this._output(modes);
          break;
        case 5:
          this._jmpIfTrue(modes);
          break;
        case 6:
          this._jmpIfFalse(modes);
          break;
        case 7:
          this._lessThan(modes);
          break;
        case 8:
          this._equalTo(modes);
          break;
        case 9:
          this._changeRelativeBase(modes);
          break;
        default:
          console.log("unknown opCode", opCode);
          break;
      }
    }
    this.onHalt();
    return this.output;
  }

  _sum([mode1, mode2, mode3]) {
    const value1 = this.getValue(mode1, 1);
    const value2 = this.getValue(mode2, 2);
    const target = this.getAddress(mode3, 3);

    this.writeMemory(target, value1 + value2);
    this.adjustPosition(4);
  }
  _mul([mode1, mode2, mode3]) {
    const value1 = this.getValue(mode1, 1);
    const value2 = this.getValue(mode2, 2);
    const target = this.getAddress(mode3, 3);

    this.writeMemory(target, value1 * value2);
    this.adjustPosition(4);
  }
  async _input([mode1]) {
    const target = this.getAddress(mode1, 1);

    if (!this.input.length) {
      await sleep();
    } else {
      this.writeMemory(target, this.input.shift());
      this.adjustPosition(2);
    }
  }
  _output([mode1]) {
    const value = this.getValue(mode1, 1);

    // console.log("output ", value);
    setTimeout(() => this.onOutput(value), 0);
    this.output = value;
    this.adjustPosition(2);
  }
  _jmpIfTrue([mode1, mode2]) {
    const condition = this.getValue(mode1, 1);
    const targetPos = this.getValue(mode2, 2);

    if (condition !== 0) {
      this.setPosition(targetPos);
    } else {
      this.adjustPosition(3);
    }
  }
  _jmpIfFalse([mode1, mode2]) {
    const condition = this.getValue(mode1, 1);
    const targetPos = this.getValue(mode2, 2);

    if (condition === 0) {
      this.setPosition(targetPos);
    } else {
      this.adjustPosition(3);
    }
  }
  _lessThan([mode1, mode2, mode3]) {
    const value1 = this.getValue(mode1, 1);
    const value2 = this.getValue(mode2, 2);
    const target = this.getAddress(mode3, 3);

    this.writeMemory(target, value1 < value2 ? 1 : 0);
    this.adjustPosition(4);
  }
  _equalTo([mode1, mode2, mode3]) {
    const value1 = this.getValue(mode1, 1);
    const value2 = this.getValue(mode2, 2);
    const target = this.getAddress(mode3, 3);

    this.writeMemory(target, value1 === value2 ? 1 : 0);
    this.adjustPosition(4);
  }
  _changeRelativeBase([mode1]) {
    const offset = this.getValue(mode1, 1);
    this.relativeBase += offset;
    this.adjustPosition(2);
  }
}

module.exports = IntCodeMachine;
