const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");
// const { askQuestion } = require("../shared/utils");

const program = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

const parseOutput = o => {
  const oo = o.split("\n\n\n");
  const output = oo[oo.length - 1];
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

  return { name, directions, items };
};
const opposite = dir => {
  const dirs = {
    north: "south",
    south: "north",
    west: "east",
    east: "west"
  };
  return dirs[dir];
};

const sendCommands = (machine, cmds) => {
  console.log("send", cmds);
  cmds.forEach(cmd => {
    [...cmd.split(""), "\n"]
      .map(char => char.charCodeAt())
      .forEach(code => machine.sendInput(code));
  });
};

const run = async () => {
  const machine = new IntCodeMachine(program);

  let output = "";
  let steps = [];
  const rooms = {};
  let lastRoom;

  const getValidMoves = room => {
    const knownMoves = Object.keys(room.rooms);

    return room.directions.filter(direction => !knownMoves.includes(direction));
  };
  const getNextMoves = room => {
    let moves = getValidMoves(room);
    if (moves.length) {
      return { moves: [moves.pop()] };
    }

    let currentRoom = room;
    while (!getValidMoves(currentRoom).length) {
      const step = opposite(steps.pop());
      currentRoom = currentRoom.rooms[step];
      moves.push(step);
      if (!currentRoom) {
        break;
      }
    }

    return { moves, targetRoom: currentRoom };
  };

  const processRoom = (name, directions, items) => {
    let currentRoom = rooms[name];
    // let isNewRoom = false;
    const lastStep = steps[steps.length - 1];

    if (!currentRoom) {
      currentRoom = { name, directions, items, rooms: {} };
      rooms[name] = currentRoom;
      // isNewRoom = true;
    }
    if (lastRoom) {
      lastRoom.rooms[lastStep] = currentRoom;
      currentRoom.rooms[opposite(lastStep)] = lastRoom;
    }

    return currentRoom;
  };

  machine.onOutput = value => {
    output += String.fromCharCode(value);
  };

  machine.onAwaitsInput = async () => {
    console.log(output);
    const { name, directions, items } = parseOutput(output);
    const room = processRoom(name, directions, items);
    console.log(room);
    const { moves: nextMoves, targetRoom } = getNextMoves(room);
    console.log(nextMoves);
    if (nextMoves.length > 1) {
      lastRoom = targetRoom;
      sendCommands(machine, nextMoves);
      return;
    }

    // const input = await askQuestion("");
    steps.push(nextMoves[0]);
    output = [];
    lastRoom = room;
    sendCommands(machine, nextMoves);
  };
  machine.run();
};

run();
