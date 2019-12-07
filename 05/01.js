const fs = require("fs");

const run = require("./shared");

const codes = fs
  .readFileSync("./input.txt", "utf8")
  .split(",")
  .map(Number);

const input = 1;
run(codes, input);
