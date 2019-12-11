const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");
const { Robot } = require("./shared");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

const run = () => {
  const robot = new Robot(100, 50);
  const machine = new IntCodeMachine(input);

  robot.area[robot.x][robot.y] = "#";

  let isColor = true;

  machine.onOutput = async value => {
    if (isColor) {
      lastColor = value;
      robot.paint(value);
      isColor = false;
    } else {
      lastDirection = value;
      robot.rotate(value);
      robot.makeStep();
      isColor = true;

      machine.sendInput(robot.getCurrentColor());
    }
  };

  machine.onHalt = () => {
    robot.printArea();
  };

  machine.sendInput(robot.getCurrentColor());
  machine.run();
};

run();
