const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");

const convert = program =>
  program
    .map(line => line + "\n")
    .join("")
    .split("")
    .map(c => c.charCodeAt(0));

const run = async code => {
  const program = [
    "NOT A T",
    "NOT B J",
    "OR T J",
    "NOT C T",
    "OR T J",
    "AND D J",
    "NOT E T",
    "NOT T T",
    "OR H T",
    "AND T J",
    "RUN"
  ];

  const machine = new IntCodeMachine(code, convert(program));

  const output = await machine.run();
  console.log(String.fromCharCode(...output));
  console.log(output[output.length - 1]);
};

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

run(input);
