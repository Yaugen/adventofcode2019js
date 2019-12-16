const fs = require("fs");
const path = require("path");
const { memoize } = require("lodash");

const getPattern = memoize((seed, length) => {
  const pattern = [0, 1, 0, -1].reduce(
    (acc, item) => acc.concat(Array(seed).fill(item)),
    []
  );
  const fullPattern = Array(length + 1)
    .fill(0)
    .map((_, index) => pattern[index % pattern.length]);
  return fullPattern.slice(1);
});

const getNextValue = prevValue =>
  prevValue.map((_, index) => {
    const valueItem = getPattern(index + 1, prevValue.length)
      .map((p, i) => p * prevValue[i])
      .reduce((acc, item) => acc + item, 0);
    return Math.abs(valueItem % 10);
  });

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split("")
  .map(Number);

const run = (input, n) => {
  let value = input;
  for (let i = 0; i < n; i++) {
    value = getNextValue(value);
  }
  return value;
};

console.log(
  run(input, 100)
    .join("")
    .slice(0, 8)
);
