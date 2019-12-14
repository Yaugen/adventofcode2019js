const readline = require("readline");

const sleep = (ms = 0, resolveWith = true) =>
  new Promise(resolve => setTimeout(() => resolve(resolveWith), ms));

const getRange = (from, to) => {
  const length = Math.abs(from - to) + 1;
  const sign = from > to ? -1 : 1;
  return Array(length)
    .fill(0)
    .map((_, index) => from + sign * index);
};

const getManhattanDistance = (x1, y1, x2, y2) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve =>
    rl.question(query, ans => {
      rl.close();
      resolve(ans);
    })
  );
}

const onKeyPress = async (cb = () => {}) => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", (str, key) => {
    cb(key, str);
    if (key.ctrl && key.name === "c") {
      process.exit();
    }
  });
};

function gcd_two_numbers(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}
const gcd = (a, b) => {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
};

const lcm = (a, b) => {
  return !a || !b ? 0 : Math.abs((a * b) / gcd(a, b));
};

module.exports = {
  sleep,
  onKeyPress,
  getRange,
  getManhattanDistance,
  gcd,
  lcm,
  askQuestion
};
