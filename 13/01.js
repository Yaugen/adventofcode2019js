const fs = require("fs");
const path = require("path");
const os = require("os");
const chalk = require("chalk");

const InCodeMachine = require("../shared/IntCodeMachine");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

const print = area => {
  for (let y = 0; y < area[0].length; y++) {
    let line = "";
    for (let x = 0; x < area.length; x++) {
      switch (area[x][y]) {
        case 0:
          line += " ";
          break;
        case 1:
          line += chalk.bgWhite(" ");
          break;
        case 2:
          line += chalk.bgYellow(" ");
          break;
        case 3:
          line += chalk.bgWhite(" ");
          break;
        case 4:
          line += chalk.bgWhite(" ");
          break;
      }
      // line += `${area[x][y]}`;
    }
    console.log(line);
  }
};

const run = async input => {
  const width = 40;
  const height = 20;
  const area = Array(width)
    .fill(0)
    .map(() => Array(height).fill(0));

  let output = [];
  const machine = new InCodeMachine(input);
  machine.onOutput = value => {
    output.push(value);
    if (output.length === 3) {
      console.log(output);
      const [x, y, t] = output;

      area[x][y] = t;

      output = [];
    }
  };
  machine.onHalt = () => {};
  await machine.run();

  let counter = 0;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      if (area[i][j] === 2) {
        counter += 1;
      }
    }
  }

  print(area);
  console.log(counter);
};

run(input);
