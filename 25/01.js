const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");
const { askQuestion } = require("../shared/utils");

const program = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

const parseOutput = output => {
  const [, roomName] = output.match(/==\s(.*)\s==/);
  const directions = output.match(/(north|south|west|east)/g);

  let items = [];
  if (output.includes("Items here:")) {
    items = output
      .split("Items here:")
      .pop()
      .split("\n")
      .filter(line => line.startsWith("-"))
      .map(line => line.replace(/-\s/, ""));
  }

  return { roomName, directions, items };
};

const run = async () => {
  const machine = new IntCodeMachine(program);

  let output = "";
  machine.onOutput = value => {
    output += String.fromCharCode(value);
  };

  machine.onAwaitsInput = async () => {
    console.log(output);
    const {} = parseOutput(output);
    const input = await askQuestion("");
    [...input.split(""), "\n"]
      .map(char => char.charCodeAt())
      .forEach(code => machine.sendInput(code));
  };
  machine.run();
};

run();
