const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");

const run = async code => {
  // prettier-ignore
  const program = [
    "NOT A J",
    "NOT B J",
    "WALK"
  ]
    .map(line => line + "\n")
    .join("")
    .split("")
    .map(c => c.charCodeAt(0));

  console.log(program);

  const machine = new IntCodeMachine(code, program);

  const output = await machine.run();
  console.log(String.fromCharCode(...output));
};

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

run(input);
