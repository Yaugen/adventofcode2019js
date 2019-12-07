const fs = require("fs");

const IntCodeMachine = require("./IntCodeMachine");
const { permutations } = require("./shared");

const codes = fs
  .readFileSync("./input.txt", "utf8")
  .split(",")
  .map(Number);

const processSignals = async signals => {
  let output = 0;
  for (const signal of signals) {
    const machine = new IntCodeMachine(codes, [signal, output]);
    output = await machine.run();
  }
  return output;
};

const run = async () => {
  const outputs = await Promise.all(
    permutations([0, 1, 2, 3, 4]).map(processSignals)
  );
  console.log(Math.max(...outputs));
};
run();
