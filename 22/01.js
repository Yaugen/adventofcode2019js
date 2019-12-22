const fs = require("fs");
const path = require("path");
const os = require("os");

const cutShuffle = (deck, n) => {
  const first = deck.slice(n);
  const second = deck.slice(0, n);
  return first.concat(second);
};

const newStackShuffle = deck => deck.reverse();

const incrementShuffle = (deck, n) => {
  const tmpDeck = deck.slice();
  let counter = 0;
  const newDeck = [];
  while (tmpDeck.length) {
    newDeck[counter] = tmpDeck.shift();
    counter = (counter + n) % deck.length;
  }
  return newDeck;
};

const run = (inputPath, deckSize) => {
  let deck = Array(deckSize)
    .fill(0)
    .map((_, i) => i);

  fs.readFileSync(path.resolve(__dirname, inputPath), "utf8")
    .split(os.EOL)
    .forEach(line => {
      let match;
      if ((match = line.match(/cut (-?\d+)/))) {
        const n = Number(match[1]);

        deck = cutShuffle(deck, n);
        return ["cut", n];
      } else if ((match = line.match(/new stack/))) {
        deck = newStackShuffle(deck);
        return ["new stack"];
      } else if ((match = line.match(/increment (-?\d+)/))) {
        const n = Number(match[1]);

        deck = incrementShuffle(deck, n);
        return ["increment", n];
      }
    });

  return deck;
};

console.log(run("./testInputA.txt", 10));
console.log(run("./testInputB.txt", 10));
console.log(run("./testInputC.txt", 10));
console.log(run("./testInputD.txt", 10));
console.log(run("./input.txt", 10007).findIndex(c => c === 2019));
