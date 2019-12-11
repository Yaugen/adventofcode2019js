const fs = require("fs");
const path = require("path");
const os = require("os");

const IntCodeMachine = require("../shared/IntCodeMachine");
const { Robot } = require("./shared");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

const run = () => {
  const robot = new Robot(250, 250);
  const machine = new IntCodeMachine(input);

  let isColor = true;
  const paintedPanels = [];

  machine.onOutput = async value => {
    if (isColor) {
      robot.paint(value);
      isColor = false;
      paintedPanels.push([robot.x, robot.y]);
    } else {
      robot.rotate(value);
      robot.makeStep();
      isColor = true;
      machine.sendInput(robot.getCurrentColor());
    }
  };

  machine.onHalt = () => {
    const set = new Set(paintedPanels.map(([x, y]) => `${x}:${y}`));
    console.log(set.size);
  };

  machine.sendInput(robot.getCurrentColor());
  machine.run();
};

run();
