const fs = require("fs");
const { getCurvePoints } = require("./shared");
const { getManhattanDistance } = require("../shared/utils");

const curves = fs.readFileSync("./input.txt", "utf8").split("\n");
const [curve1, curve2] = curves.map(getCurvePoints);
const crossings = curve1.filter(
  point => point !== "0:0" && curve2.includes(point)
);

const distances = crossings.map(crossing => {
  const [crossingX, crossingY] = crossing.split(":").map(Number);
  return getManhattanDistance(0, 0, crossingX, crossingY);
});
console.log(Math.min(...distances));
