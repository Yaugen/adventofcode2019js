const fs = require("fs");

const run = require("./shared");

const input = fs
  .readFileSync("./input.txt", "utf8")
  .split(",")
  .map(Number);

console.log(run(input, 12, 2));
