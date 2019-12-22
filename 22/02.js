const fs = require("fs");
const path = require("path");
const os = require("os");

const getShuffleOrder = inputPath => {
  return fs
    .readFileSync(path.resolve(__dirname, inputPath), "utf8")
    .split(os.EOL)
    .map(line => {
      let match;
      let shuffle = [];
      if ((match = line.match(/cut (-?\d+)/))) {
        const n = Number(match[1]);
        shuffle = ["cut", BigInt(n)];
      } else if ((match = line.match(/new stack/))) {
        shuffle = ["new stack"];
      } else if ((match = line.match(/increment (-?\d+)/))) {
        const n = Number(match[1]);
        shuffle = ["increment", BigInt(n)];
      }
      return shuffle;
    });
};

const mod = (a, b) => ((a % b) + b) % b;

const egcd = (a, b) => {
  if (a === 0n) {
    return [b, 0n, 1n];
  } else {
    const [g, y, x] = egcd(mod(b, a), a);
    return [g, x - (b / a) * y, y];
  }
};

const modInv = (a, m) => {
  const [g, x, y] = egcd(a, m);
  if (g !== 1n) {
    throw new Error("modular inverse does not exist");
  } else {
    return mod(x, m);
  }
};

const modPow = (a, b, n) => {
  if (b === 1n) {
    return a;
  }
  if (b % 2n === 0n) {
    const r = modPow(a, b / 2n, n);
    return (r * r) % n;
  }
  if (b % 2n == 1n) {
    return (a * modPow(a, b - 1n, n)) % n;
  }
};

const run = inputPath => {
  const shuffleOrder = getShuffleOrder(inputPath);
  const N = 119315717514047n;
  const repeats = 101741582076661n;

  let cards = [1n, 0n];

  shuffleOrder.forEach(([shuffleType, n]) => {
    const [a, b] = cards;
    if (shuffleType === "new stack") {
      cards = [mod(-a, N), mod(-b - 1n, N)];
    } else if (shuffleType === "cut") {
      cards = [a, mod(b - n, N)];
    } else if (shuffleType === "increment") {
      cards = [mod(a * n, N), mod(b * n, N)];
    }
  });

  const [a, b] = cards;
  const an = modPow(BigInt(a), BigInt(repeats), BigInt(N));

  const A = an;
  const B = b * (an - 1n) * modInv(a - 1n, N);
  console.log(A, B);
  console.log(mod((2020n - B) * modInv(A, N), N));
};

run("./input.txt");
