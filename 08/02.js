const fs = require("fs");

const input = fs
  .readFileSync("./input.txt", "utf8")
  .split("")
  .map(Number);

const layerWidth = 25;
const layerHeight = 6;
const layerSize = layerWidth * layerHeight;

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

const mixLayers = layers => {
  const mixed = Array(layerWidth)
    .fill(0)
    .map(() => Array(layerHeight));

  for (let i = 0; i < layerWidth; i++) {
    for (let j = 0; j < layerHeight; j++) {
      const pixels = layers.map(layer => layer[i + j * layerWidth]);
      const resPixel = pixels.find(v => v !== 2);
      mixed[i][j] = resPixel || 2;
    }
  }
  return mixed;
};

const print = arr => {
  for (let j = 0; j < layerHeight; j++) {
    let line = "";
    for (let i = 0; i < layerWidth; i++) {
      line += `${arr[i][j] === 2 ? " " : "*"}`;
    }
    console.log(line);
  }
};

const image = mixLayers(splitToLayers(input, layerSize));
console.log(image);
print(image);
