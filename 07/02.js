const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("./IntCodeMachine");
const { permutations } = require("./shared");

const codes = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

const processSignals = async signals => {
  const machines = signals.map(
    (signal, index) => new IntCodeMachine(codes, [signal], index)
  );
  machines.forEach((machine, index) => {
    const nextMachine =
      index + 1 === machines.length ? machines[0] : machines[index + 1];
    machine.onOutput = value => {
      // console.log("output", value);
      nextMachine.sendInput(value);
    };
  });
  machines[0].sendInput(0);

  const outputs = await Promise.all(machines.map(m => m.run()));
  // console.log(signals, outputs);
  return outputs[4];
};

const run = async () => {
  const outputs = await Promise.all(
    permutations([5, 6, 7, 8, 9]).map(processSignals)
  );
  console.log(Math.max(...outputs));
};
run();
