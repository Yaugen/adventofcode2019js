const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");
const Area = require("../shared/Area");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

const getArea = charCodes => {
  const area = new Area(" ");

  let x = 0;
  let y = 0;
  for (const charCode of charCodes) {
    if (charCode === 10) {
      y += 1;
      x = 0;
    } else {
      area.set(x, y, String.fromCharCode(charCode));
      x += 1;
    }
  }
  return area;
};

const run = async input => {
  const machine = new IntCodeMachine(input);

  const output = await machine.run();

  const area = getArea(output);

  const intersections = [];
  area.traverse((x, y, item) => {
    if (item === "#") {
      const neighbours = area.getNeighbours(x, y);
      if (neighbours.every(n => n === "#")) {
        intersections.push([x, y]);
      }
    }
  });
  console.log(
    intersections.map(([x, y]) => x * y).reduce((sum, item) => sum + item, 0)
  );
};

run(input);
