const fs = require("fs");
const path = require("path");

const { getArea, markCell, print } = require("./shared");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

getArea(input).then(({ area, curPos }) => {
  markCell(area, curPos, 0);
  print(area, curPos, 3);
});
