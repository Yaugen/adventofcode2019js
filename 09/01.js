const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("./IntCodeMachine");

const codes = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

const run = async () => {
  const machine = new IntCodeMachine(codes, [1]);
  machine.onOutput = value => console.log(value);
  const output = await machine.run();
  // console.log(output);
};
run();
