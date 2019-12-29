const outputStorage = {
  rooms: [],
  misc: [],
  inventory: []
};

const parseRoom = rawOutput => {
  // console.log(rawOutput);
  const splitOutput = rawOutput.split("\n\n\n");
  const [output] = splitOutput.reverse();
  // const output = splitOutput[splitOutput.length - 1];
  const [, name] = output.match(/==\s(.*)\s==/);
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

  outputStorage.rooms.push({ name, directions, items });
};

const parseInventory = output => {
  const items = output
    .split("\n")
    .filter(line => line.startsWith("-"))
    .map(line => line.replace("- ", ""));
  outputStorage.inventory.push(items);
};

const parseMisc = output => {
  outputStorage.misc.push(output);
};

const parseOutput = output => {
  if (output.startsWith("\n\n\n==")) {
    parseRoom(output);
  } else if (output.startsWith("\nItems in")) {
    parseInventory(output);
  } else {
    parseMisc(output);
  }
  return;
};

module.exports = {
  outputStorage,
  parseOutput
};
