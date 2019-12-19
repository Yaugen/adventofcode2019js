const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");

const checkCoords = async (input, x, y) => {
  const machine = new IntCodeMachine(input, [x, y]);
  return machine.run();
};

const run = async input => {
  let counter = 0;
  for (let x = 0; x < 50; x++) {
    for (let y = 0; y < 50; y++) {
      const [value] = await checkCoords(input, x, y);
      counter += value;
    }
  }
  console.log(counter);
};

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

run(input);
