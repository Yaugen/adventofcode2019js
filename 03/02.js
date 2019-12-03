const fs = require("fs");
const { getCurvePoints } = require("./shared");

const curves = fs.readFileSync("./input.txt", "utf8").split("\n");
const [curve1, curve2] = curves.map(getCurvePoints);
const crossings = curve1.filter(
  point => point !== "0:0" && curve2.includes(point)
);

const stepsCount = crossings.map(crossing => {
  const dist1 = curve1.indexOf(crossing) + 1;
  const dist2 = curve2.indexOf(crossing) + 1;
  return dist1 + dist2;
});
console.log(Math.min(...stepsCount));
