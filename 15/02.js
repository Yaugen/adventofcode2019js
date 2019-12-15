const fs = require("fs");
const path = require("path");

const { getArea, markCell, print } = require("./shared");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

getArea(input).then(({ area, curPos }) => {
  let oxygenPos;
  area.traverse((x, y, item) => {
    if (item === "@") {
      oxygenPos = [x, y];
    }
  });
  markCell(area, oxygenPos, 0);
  print(area, curPos, 3);
  let max = 0;
  area.traverse((x, y, item) => {
    if (Number.isInteger(item) && item > max) {
      max = item;
    }
  });
  console.log(max);
});
