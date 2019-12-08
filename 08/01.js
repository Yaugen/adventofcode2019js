const fs = require("fs");

const input = fs
  .readFileSync("./input.txt", "utf8")
  .split("")
  .map(Number);

const fieldSize = 25 * 6;

const layers = [];
for (let i = 0; i < input.length / fieldSize; i++) {
  const from = fieldSize * i;
  const to = fieldSize * (i + 1);
  console.log(from, to);
  layers.push(input.slice(from, to));
}

const countElements = arr =>
  arr.reduce(
    (acc, item) => [
      item === 0 ? acc[0] : acc[0] + 1,
      item === 1 ? acc[1] : acc[1] + 1,
      item === 2 ? acc[2] : acc[2] + 1
    ],
    [0, 0, 0]
  );

let maxEl = [0, 0, 0];
layers.map(countElements).forEach(e => {
  if (e[0] > maxEl[0]) {
    maxEl = e;
  }
});

console.log(maxEl, maxEl[1] * maxEl[2]);
