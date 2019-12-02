const fs = require("fs");

const run = require("./shared");

const input = fs
  .readFileSync("./input.txt", "utf8")
  .split(",")
  .map(Number);

const targetRes = 19690720;

const find = () => {
  for (let p1 = 0; p1 < 100; p1++) {
    for (let p2 = 0; p2 < 100; p2++) {
      const res = run(input, p1, p2);
      if (res === targetRes) {
        return [p1, p2];
      }
    }
  }
};
const [p1, p2] = find();
console.log(100 * p1 + p2);
