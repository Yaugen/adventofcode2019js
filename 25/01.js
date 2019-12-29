const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");

const {
  sendCommands,
  getRoute,
  getDiscoveryMoves,
  getMovesToUndiscoveredRoom,
  processRoom,
  getItemCombinations
} = require("./helpers");
const { parseOutput, outputStorage } = require("./parser");

const run = async () => {
  const machine = new IntCodeMachine(program);
  let phase = 0;

  let steps = [];
  const rooms = {};
  let lastRoom;
  const phase0 = () => {
    const invalidItems = [
      "infinite loop",
      "giant electromagnet",
      "escape pod",
      "molten lava",
      "photons"
    ];

    const room = processRoom(rooms, steps, lastRoom);
    let nextMoves =
      getDiscoveryMoves(room) || getMovesToUndiscoveredRoom(rooms, room);

    if (!nextMoves) {
      const routeToSecurity = getRoute(room, rooms["Floor"]);
      sendCommands(machine, [...routeToSecurity, "inv"]);
      phase = 1;
      return;
    }

    let take = room.items
      .filter(item => !invalidItems.includes(item))
      .map(item => `take ${item}`);

    steps.push(...nextMoves);
    output = [];
    lastRoom = room;
    sendCommands(machine, [...take, ...nextMoves]);
  };

  let combinations = [];
  const phase1 = () => {
    if (!combinations.length) {
      combinations = getItemCombinations();
    }
    const [currentInventory] = outputStorage.inventory.reverse();

    let commands = [];
    const itemCombination = combinations.pop();
    currentInventory.forEach(item => commands.push(`drop ${item}`));
    itemCombination.forEach(item => commands.push(`take ${item}`));
    commands.push("east", "inv");

    if (!combinations.length) {
      console.log("last");
    }

    sendCommands(machine, commands);
  };

  machine.onAwaitsInput = async () => {
    if (phase === 0) {
      phase0();
    } else {
      phase1();
    }
  };

  let output = "";
  machine.onOutput = value => {
    output += String.fromCharCode(value);
    if (output.endsWith("Command?\n")) {
      parseOutput(output);
      output = "";
    }
  };

  machine.onHalt = () => {
    console.log(output);
  };

  await machine.run();
};

const program = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

run(program);
