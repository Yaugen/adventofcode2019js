const fs = require("fs");

const isValid = digits => {
  let adjacentCreteria = false;
  for (let i = 0; i < digits.length - 1; i++) {
    if (digits[i] > digits[i + 1]) {
      return false;
    }
    if (
      digits[i] !== digits[i - 1] &&
      digits[i] === digits[i + 1] &&
      digits[i] !== digits[i + 2]
    ) {
      adjacentCreteria = true;
    }
  }
  return adjacentCreteria;
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
