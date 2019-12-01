const fs = require("fs");

const data = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n")
  .map(Number);

const res = data.reduce((acc, item) => acc + (Math.floor(item / 3) - 2), 0);
console.log(res);
