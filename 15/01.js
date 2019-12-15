const fs = require("fs");
const path = require("path");
const os = require("os");
const chalk = require("chalk");

const IntCodeMachine = require("../shared/IntCodeMachine");

const print = (area, curPos, size = 1) => {
  let output = "";

  for (let y = 0; y < area[0].length; y++) {
    for (let x = 0; x < area.length; x++) {
      let char;
      if (x === curPos[0] && y === curPos[1]) {
        char = chalk.red("*".padStart(size, "*"));
      } else if (area[x][y] === "#") {
        char = chalk.bgRed("#".padStart(size, "#"));
      } else if (area[x][y] === ".") {
        char = chalk.bgBlue(".".padStart(size, "."));
      } else {
        char = area[x][y].toString().padStart(size, " ");
      }

      output += char;
    }
    output += os.EOL;
  }
  console.log(output);
};

const DIR = {
  NORTH: 1,
  SOUTH: 2,
  WEST: 3,
  EAST: 4
};
const dirToCoords = (dir, curPos) => {
  const [x, y] = curPos;
  switch (dir) {
    case DIR.SOUTH:
      return [x, y + 1];
    case DIR.NORTH:
      return [x, y - 1];
    case DIR.WEST:
      return [x - 1, y];
    case DIR.EAST:
      return [x + 1, y];
  }
};
const opposite = dir => {
  switch (dir) {
    case DIR.SOUTH:
      return DIR.NORTH;
    case DIR.NORTH:
      return DIR.SOUTH;
    case DIR.WEST:
      return DIR.EAST;
    case DIR.EAST:
      return DIR.WEST;
  }
};
const getPossibleDirections = (area, [x, y], visited) => {
  const directions = [];
  if (!visited.has(`${x + 1}:${y}`) && area[x + 1][y] !== "#") {
    directions.push(DIR.EAST);
  }
  if (!visited.has(`${x - 1}:${y}`) && area[x - 1][y] !== "#") {
    directions.push(DIR.WEST);
  }
  if (!visited.has(`${x}:${y + 1}`) && area[x][y + 1] !== "#") {
    directions.push(DIR.SOUTH);
  }
  if (!visited.has(`${x}:${y - 1}`) && area[x][y - 1] !== "#") {
    directions.push(DIR.NORTH);
  }
  return directions;
};
const hash = ([x, y]) => `${x}:${y}`;
const getCheckDirections = dir => [1, 2, 3, 4].filter(i => i !== opposite(dir));

const getArea = input =>
  new Promise(resolve => {
    const width = 50;
    const height = 50;
    const area = Array(width)
      .fill(0)
      .map(() => Array(height).fill(" "));

    let curPos = [25, 25];
    area[curPos[0]][curPos[1]] = ".";
    let lastDir;

    const machine = new IntCodeMachine(input);

    let visited = new Set();
    let history = [];
    let checkDirections = [1, 2, 3, 4];

    const makeStep = dir => {
      machine.sendInput(dir);
      lastDir = dir;
    };

    const getNextDirection = () => {
      if (checkDirections.length) {
        return checkDirections.shift();
      } else {
        const possibleDirections = getPossibleDirections(area, curPos, visited);
        visited.add(hash(curPos));
        if (possibleDirections.length > 0) {
          checkDirections = getCheckDirections(possibleDirections[0]);

          history.push(possibleDirections[0]);
          return possibleDirections[0];
        } else if (history.length) {
          return opposite(history.pop());
        } else {
          resolve({ area, curPos });
        }
      }
    };
    machine.onOutput = value => {
      const [x, y] = dirToCoords(lastDir, curPos);
      let dir;
      if (value === 0) {
        area[x][y] = "#";

        dir = getNextDirection();
      } else {
        const shouldReturn = area[x][y] === " ";
        area[x][y] = value === 1 ? "." : "@";
        curPos = [x, y];

        if (!shouldReturn) {
          dir = getNextDirection();
        } else {
          dir = opposite(lastDir);
        }
      }

      makeStep(dir);
    };

    machine.run();
    makeStep(checkDirections.shift());
  });

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

const getVisitableNeighbours = (area, [x, y]) => {
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1]
  ].filter(([x, y]) => area[x][y] === ".");
};
const markCell = (area, [x, y], counter) => {
  area[x][y] = counter;
  const neighbours = getVisitableNeighbours(area, [x, y]);
  neighbours.forEach(n => markCell(area, n, counter + 1));
};

getArea(input).then(({ area, curPos }) => {
  markCell(area, curPos, 0);
  print(area, curPos, 3);
});
