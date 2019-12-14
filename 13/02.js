const fs = require("fs");
const path = require("path");
const os = require("os");
const chalk = require("chalk");

const InCodeMachine = require("../shared/IntCodeMachine");
const { askQuestion, sleep, onKeyPress } = require("../shared/utils");

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
  input[0] = 2;
  const width = 40;
  const height = 20;
  const area = Array(width)
    .fill(0)
    .map(() => Array(height).fill(0));

  let output = [];
  let score = 0;
  let paddleX = 0;
  let ballX = 0;
  let suggested = 0;

  const machine = new InCodeMachine(input);

  onKeyPress(key => {
    // console.log(key);
    switch (key.name) {
      case "left":
        machine.sendInput(-1);
        break;
      case "right":
        machine.sendInput(1);
        break;
      case "up":
        machine.sendInput(0);
        break;
      case "return":
        machine.sendInput(suggested);
        break;
    }
  });

  machine.onOutput = value => {
    output.push(value);
    if (output.length === 3) {
      const [x, y, t] = output;

      if (x === -1 && y === 0) {
        score = t;
      } else {
        area[x][y] = t;
        if (t === 3) {
          paddleX = x;
        }
        if (t === 4) {
          ballX = x;
        }
      }
      output = [];
    }
  };
  machine.onHalt = () => {};
  machine.onAwaitsInput = async () => {
    if (paddleX > ballX) {
      suggested = -1;
    } else if (paddleX < ballX) {
      suggested = 1;
    } else {
      suggested = 0;
    }

    console.log(
      score,
      `suggesteed ${suggested} ball x:${ballX} paddle x:${paddleX}`
    );
    // print(area);
    machine.sendInput(suggested);
  };

  await machine.run();
  console.log("DONE", score);
};

run(input);
