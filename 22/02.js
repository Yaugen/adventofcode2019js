const fs = require("fs");
const path = require("path");
const os = require("os");

const expmod = (base, exp, mod) => {
  if (exp == 0) return 1;
  if (exp % 2 == 0) {
    return Math.pow(expmod(base, exp / 2, mod), 2) % mod;
  } else {
    return (base * expmod(base, exp - 1, mod)) % mod;
  }
};

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

const run = inputPath => {
  const shuffleOrder = getShuffleOrder(inputPath);
  const cards = 119315717514047;
  const repeats = 101741582076661;

  const inv = n => {
    const powed = expmod(n, cards - 2, cards);
    return powed;
  };
  const get = (offset, increment, i) => (offset + i * increment) % cards;

  let incrementMul = 1;
  let offsetDiff = 0;

  shuffleOrder.forEach(([shuffleType, n]) => {
    if (shuffleType === "new stack") {
      incrementMul = incrementMul * -1;
      incrementMul = incrementMul % cards;

      offsetDiff = offsetDiff + incrementMul;
      offsetDiff = offsetDiff % cards;
    } else if (shuffleType === "cut") {
      offsetDiff = offsetDiff + incrementMul * n;
      offsetDiff = offsetDiff % cards;
    } else if (shuffleType === "increment") {
      incrementMul = incrementMul * inv(n);
      incrementMul = incrementMul % cards;
    }
  });

  let increment = expmod(incrementMul, repeats, cards);
  let offset = offsetDiff * (1 - increment) * inv((1 - incrementMul) % cards);
  offset = offset % cards;

  console.log(get(offset, increment, 2020));
};

// console.log(run("./testInputA.txt", 10));
// console.log(run("./testInputB.txt", 10));
// console.log(run("./testInputC.txt", 10));
// console.log(run("./testInputD.txt", 10));
run("./input.txt");
