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
        shuffle = ["cut", n];
      } else if ((match = line.match(/new stack/))) {
        shuffle = ["new stack"];
      } else if ((match = line.match(/increment (-?\d+)/))) {
        const n = Number(match[1]);
        shuffle = ["increment", n];
      }
      return shuffle;
    });
};

const mod = (a, b) => ((a % b) + b) % b;

const egcd = (a, b) => {
  if (a === 0) {
    return [b, 0, 1];
  } else {
    const [g, y, x] = egcd(mod(b, a), a);
    return [g, x - Math.floor(b / a) * y, y];
  }
};

const modInv = (a, m) => {
  const [g, x, y] = egcd(a, m);
  if (g !== 1) {
    throw new Error("modular inverse does not exist");
  } else {
    return mod(x, m);
  }
};

const expmod = (base, exp, mod) => {
  if (exp == 0) return 1;
  if (exp % 2 == 0) {
    return Math.pow(expmod(base, exp / 2, mod), 2) % mod;
  } else {
    return (base * expmod(base, exp - 1, mod)) % mod;
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
  const N = 119315717514047;
  const repeats = 101741582076661;

  let cards = [1, 0];

  shuffleOrder.forEach(([shuffleType, n]) => {
    const [a, b] = cards;
    if (shuffleType === "new stack") {
      cards = [mod(-a, N), mod(-b - 1, N)];
    } else if (shuffleType === "cut") {
      cards = [a, mod(b - n, N)];
    } else if (shuffleType === "increment") {
      cards = [mod(a * n, N), mod(b * n, N)];
    }
  });

  const [a, b] = cards;
  const an = Number(modPow(BigInt(a), BigInt(repeats), BigInt(N)));

  const A = an;
  const B = b * (an - 1) * modInv(a - 1, N);
  console.log(A, B);
  console.log(mod((2020 - B) * modInv(A, N), N));
};

run("./input.txt");
