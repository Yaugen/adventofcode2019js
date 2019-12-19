const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");

const counterToCoords = counter => {
  return [counter % 50, Math.floor(counter / 50)];
};

const checkCoords = async (input, x, y) => {
  const machine = new IntCodeMachine(input, [x, y]);
  return machine.run();
};

const find = area => {
  const size = 100;
  const width = area.length;
  const height = area[0].length;

  for (let y = 0; y < height; y++) {
    let hasOne = false;
    for (let x = 0; x < width; x++) {
      if (area[x][y] === 1) {
        hasOne = true;
        if (
          x + size - 1 < width &&
          y + size - 1 < height &&
          area[x + size - 1][y] === 1 &&
          area[x][y + size - 1] === 1 &&
          area[x + size - 1][y + size - 1] === 1
        ) {
          return [x, y];
        }
      } else if (hasOne) {
        break;
      }
    }
  }
};

const getLineFunc = (x1, y1, x2, y2) => {
  const A = y1 - y2;
  const B = x2 - x1;
  const C = x1 * y2 - x2 * y1;
  console.log(A, B, C);
  return x => Math.floor(-(x * A + C) / B);
};

const print = area => {
  let line = "";
  for (let y = 0; y < area[0].length; y++) {
    for (let x = 0; x < area.length; x++) {
      line += area[x][y];
    }
    line += "\n";
  }
  console.log(line);
};

const getLineFuncs = async input => {
  const yRange = [500, 1000];
  const xes = [];
  for (const y of yRange) {
    let hasOne = false;
    let x1;
    let x2;
    for (let x = 0; x < y; x++) {
      const [value] = await checkCoords(input, x, y);
      if (value === 0 && hasOne) {
        x2 = x - 1;
        break;
      }
      if (value === 1 && !hasOne) {
        x1 = x;
        hasOne = true;
      }
    }
    xes.push(x1, x2);
  }
  const [topY, bottomY] = yRange;
  const [topLine1x, topLine2x, bottomLine1x, bottomLine2x] = xes;
  const line1 = getLineFunc(topLine1x, topY, bottomLine1x, bottomY);
  const line2 = getLineFunc(topLine2x, topY, bottomLine2x, bottomY);
  return { line1, line2 };
};

const run = async input => {
  const { line1, line2 } = await getLineFuncs(input);

  console.log(line1(1122), line2(1222));

  for (let i = 1000; i < 1150; i++) {
    const x1 = i;
    const x2 = i + 100;
    const y1 = line2(x2);
    const y2 = line1(x1);
    console.log(
      `${x1}:${y1}`,
      `${x2}:${y2}`,
      `width:${x2 - x1}`,
      `height:${y2 - y1}`
    );
    if (y2 - y1 >= 100) {
      console.log("FOUND");
      console.log(
        `${x1}:${y1}`,
        `${x2}:${y2}`,
        `width:${x2 - x1}`,
        `height:${y2 - y1}`
      );
      break;
    }
  }
};

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

run(input);
