const fs = require("fs");

const isValid = digits => {
  let hasAdjacent = false;
  for (let i = 0; i < digits.length - 1; i++) {
    if (digits[i] > digits[i + 1]) {
      return false;
    }
    if (digits[i] === digits[i + 1]) {
      hasAdjacent = true;
    }
  }
  return hasAdjacent;
};

const findPasswords = (min, max) => {
  let passwordCounter = 0;
  for (let i = min; i <= max; i++) {
    if (isValid(`${i}`)) {
      passwordCounter += 1;
    }
  }
  return passwordCounter;
};

const [min, max] = fs
  .readFileSync("./input.txt", "utf8")
  .split("-")
  .map(Number);

console.log(findPasswords(min, max));
