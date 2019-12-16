const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), "utf8");

const getNextValue = prevValue => {
  const nextValue = [];
  let sum = 0;
  for (let n = prevValue.length - 1; n >= 0; n--) {
    sum += prevValue[n];
    nextValue[n] = Math.abs(sum % 10);
  }
  return nextValue;
};
const run = data => {
  const repeatTimes = 1000;
  let value = Array(repeatTimes)
    .fill(data)
    .join("")
    .split("")
    .map(Number);

  for (let i = 0; i < 100; i++) {
    value = getNextValue(value);
  }

  const offset = Number(data.slice(0, 7)) - data.length * (10000 - repeatTimes);
  return value.slice(offset, offset + 8).join("");
};

const runFast = data => {
  const repeatTimes = 10000;
  let value = Array(repeatTimes)
    .fill(data)
    .join("")
    .split("")
    .map(Number);
  const offset = Number(data.slice(0, 7));

  for (let i = 0; i < 100; i++) {
    let partialSum = value.slice(offset).reduce((sum, item) => sum + item, 0);
    for (let j = offset; j < value.length; j++) {
      const prevSum = partialSum;
      partialSum -= value[j];
      value[j] = Math.abs(prevSum % 10);
    }
  }

  return value.slice(offset, offset + 8).join("");
};

console.time();
console.log(runFast(input));
console.timeEnd();
