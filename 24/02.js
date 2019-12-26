const fs = require("fs");
const path = require("path");
const os = require("os");

// prettier-ignore
const NEIGHBOURS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const SIZE = 5;
const toIndex = (x, y) => x + y * SIZE;
const print = str => {
  let output = "";
  for (let y = 0; y < SIZE; y++) {
    output += str.slice(y * SIZE, y * SIZE + SIZE) + os.EOL;
  }
  console.log(output);
};

const getCol = (area, x) => {
  let col = "";
  for (let y = 0; y < SIZE; y++) {
    col += area[toIndex(x, y)];
  }
  return col;
};
const getRow = (area, y) => {
  let row = "";
  for (let x = 0; x < SIZE; x++) {
    row += area[toIndex(x, y)];
  }
  return row;
};

const cX = 2;
const cY = 2;
const getBugsCount = (levels, levelIndex, tileX, tileY) => {
  let tiles = "";
  const outerLevel = levelIndex > 0 ? levels[levelIndex - 1] : "";
  const innerLevel =
    levelIndex < levels.length - 1 ? levels[levelIndex + 1] : "";
  const currentLevel = levels[levelIndex];

  for (let [dx, dy] of NEIGHBOURS) {
    const [x, y] = [tileX + dx, tileY + dy];

    if (x < 0 && outerLevel) {
      tiles += outerLevel[toIndex(cX - 1, cY)];
    } else if (y < 0 && outerLevel) {
      tiles += outerLevel[toIndex(cX, cY - 1)];
    } else if (x >= SIZE && outerLevel) {
      tiles += outerLevel[toIndex(cX + 1, cY)];
    } else if (y >= SIZE && outerLevel) {
      tiles += outerLevel[toIndex(cX, cY + 1)];
    } else if (x === cX && y === cY) {
      if (!innerLevel) {
        continue;
      }
      if (tileX === cX - 1) {
        tiles += getCol(innerLevel, 0);
      } else if (tileX === cX + 1) {
        tiles += getCol(innerLevel, SIZE - 1);
      } else if (tileY === cY - 1) {
        tiles += getRow(innerLevel, 0);
      } else if (tileY === cY + 1) {
        tiles += getRow(innerLevel, SIZE - 1);
      }
    } else {
      tiles += currentLevel[toIndex(x, y)];
    }
  }

  const bugsCount = tiles
    .split("")
    .reduce((bugs, tile) => (tile === "#" ? bugs + 1 : bugs), 0);

  return bugsCount;
};

const mutate = (levels, levelIndex) => {
  const level = levels[levelIndex];
  let mutatedLevel = "";
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const curTile = level[toIndex(x, y)];
      const bugsCount = getBugsCount(levels, levelIndex, x, y);

      if (x === cX && y === cY) {
        mutatedLevel += ".";
      } else if (curTile === "#" && bugsCount !== 1) {
        mutatedLevel += ".";
      } else if (curTile === "." && bugsCount >= 1 && bugsCount <= 2) {
        mutatedLevel += "#";
      } else {
        mutatedLevel += curTile;
      }
    }
  }
  return mutatedLevel;
};

const mutateLevels = initialLevels => {
  const emptyLevel = Array(SIZE * SIZE)
    .fill(".")
    .join("");
  const levels = [emptyLevel, ...initialLevels, emptyLevel];
  const mutatedLevels = levels.map((_, levelIndex) =>
    mutate(levels, levelIndex)
  );

  return mutatedLevels;
};

const run = input => {
  let levels = [input];
  for (let i = 0; i < 200; i++) {
    levels = mutateLevels(levels);
  }
  const bugs = levels
    .join("")
    .split("")
    .reduce((count, tile) => (tile === "#" ? count + 1 : count), 0);
  console.log(bugs);
};

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(os.EOL)
  .join("");

run(input);
