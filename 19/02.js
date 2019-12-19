const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");

const checkCoords = async (input, x, y) => {
  const machine = new IntCodeMachine(input, [x, y]);
  return machine.run();
};

const run = async input => {
  // may be optimized by skipping ys that not enough possible beam area using edges line function
  for (let y = 1200; y < 1300; y++) {
    let hasOne = false;
    for (let x = 0; x < y; x++) {
      const [value] = await checkCoords(input, x, y + 99);
      if (value) {
        hasOne = true;
        const [oppositeValue] = await checkCoords(input, x + 99, y);
        if (oppositeValue) {
          console.log(x, y);
          return;
        }
      } else if (hasOne) {
        break;
      }
    }
  }
  console.log("NOPE");
};

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

run(input);
