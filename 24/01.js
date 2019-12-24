const fs = require("fs");
const path = require("path");
const os = require("os");

const N = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
];
const SIZE = 5;
const toIndex = (x, y) => x + y * SIZE;
const print = str => {
  let output = "";
  for (let y = 0; y < SIZE; y++) {
    output += str.slice(y * SIZE, y * SIZE + SIZE) + os.EOL;
  }
  console.log(output);
};

const mutate = area => {
  let newArea = "";
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const curValue = area[toIndex(x, y)];
      const coords = N.map(([dx, dy]) => [x + dx, y + dy]);
      const validCoords = coords.filter(
        ([nx, ny]) => nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE
      );
      const indexes = validCoords.map(([nx, ny]) => toIndex(nx, ny));
      // const validIndexes = indexes.filter(i => i >= 0 && i < area.length);
      const bugsCount = indexes.reduce(
        (bugs, i) => (area[i] === "#" ? bugs + 1 : bugs),
        0
      );

      if (curValue === "#" && bugsCount !== 1) {
        newArea += ".";
      } else if (curValue === "." && bugsCount >= 1 && bugsCount <= 2) {
        newArea += "#";
      } else {
        newArea += curValue;
      }
    }
  }
  return newArea;
};

const run = input => {
  const history = new Set();
  history.add(input);
  let area = input;
  while (true) {
    area = mutate(area);
    if (history.has(area)) {
      break;
    }
    // print(area);
    history.add(area);
  }
  print(area);
  const rating = area
    .split("")
    .reduce(
      (acc, item, index) => (item === "#" ? acc + Math.pow(2, index) : acc),
      0
    );

  console.log(rating);
};

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(os.EOL)
  .join("");

run(input);
