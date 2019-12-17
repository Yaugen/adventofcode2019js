const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");
const Area = require("../shared/Area");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

const print = async input => {
  const codes = input.slice();
  const machine = new IntCodeMachine(codes);
  const output = await machine.run();
  console.log(String.fromCharCode(...output));
};

const prepareMachineInput = input => {
  const machineInput = input
    .split("")
    .map(item => (Number.isInteger(item) ? item : item.charCodeAt(0)));

  machineInput.push(10); // \n
  return machineInput;
};

const run = async input => {
  const codes = input.slice();
  codes[0] = 2;

  // L,8,R,12,R,12,R,10,R,10,R,12,R,10
  // L,8,R,12,R,12,R,10,R,10,R,12,R,10
  // L,10,R,10,L,6,L,10,R,10,L,6,R,10,R,12,R,10

  // L8 R12 R12 R10 R10 R12 R10 l10 r10 l6
  const mainRoutine = "A,B,A,B,C,C,B,A,B,C";
  const functionA = "L,8,R,12,R,12,R,10";
  const functionB = "R,10,R,12,R,10";
  const functionC = "L,10,R,10,L,6";
  const enableStream = "n";
  const machineInput = [
    ...prepareMachineInput(mainRoutine),
    ...prepareMachineInput(functionA),
    ...prepareMachineInput(functionB),
    ...prepareMachineInput(functionC),
    ...prepareMachineInput(enableStream)
  ];

  console.log(machineInput);

  const machine = new IntCodeMachine(codes, machineInput);

  let line = "";
  machine.onOutput = value => {
    if (value === 10) {
      console.log(line);
      line = "";
    } else {
      line += String.fromCharCode(value);
    }
  };

  const output = await machine.run();
  console.log(output.pop());
};

// print(input);
run(input);
