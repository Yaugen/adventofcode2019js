const fs = require("fs");

const input = fs
  .readFileSync("./input.txt", "utf8")
  .split("")
  .map(Number);

const layerSize = 25 * 6;

const splitToLayers = (input, layerSize) => {
  const layers = [];
  const layersCount = input.length / layerSize;
  for (let i = 0; i < layersCount; i++) {
    const from = layerSize * i;
    const to = layerSize * (i + 1);
    layers.push(input.slice(from, to));
  }
  return layers;
};

const countElements = arr =>
  arr.reduce(
    (acc, item) => [
      item === 0 ? acc[0] + 1 : acc[0],
      item === 1 ? acc[1] + 1 : acc[1],
      item === 2 ? acc[2] + 1 : acc[2]
    ],
    [0, 0, 0]
  );

const result = splitToLayers(input, layerSize)
  .map(countElements)
  .reduce((min, e) => (e[0] < min[0] ? e : min), [Infinity, 0, 0]);

console.log(result, result[1] * result[2]);
