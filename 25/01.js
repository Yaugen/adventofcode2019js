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
  // console.log("send", cmds);
  cmds.forEach(cmd => {
    [...cmd.split(""), "\n"]
      .map(char => char.charCodeAt())
      .forEach(code => machine.sendInput(code));
  });
};

const getValidMoves = room => {
  const knownMoves = Object.keys(room.rooms);
  return room.directions.filter(direction => !knownMoves.includes(direction));
};

const getRoute = (from, to) => {
  const cursors = [{ room: from, path: [] }];
  const visited = [];
  while (true) {
    const cursor = cursors.shift();
    visited.push(cursor.room);
    const newCursors = Object.entries(cursor.room.rooms)
      .filter(([, room]) => !visited.includes(room))
      .map(([name, room]) => ({
        room,
        path: cursor.path.concat([name])
      }));

    const found = newCursors.find(r => r.room === to);
    if (found) {
      return found.path;
    }
    cursors.push(...newCursors);
  }
};

const getDiscoveryMoves = room => {
  let moves = getValidMoves(room);
  if (moves.length) {
    return [moves.pop()];
  }
};

const getMovesToUndiscoveredRoom = (rooms, room) => {
  const roomWithUndiscoveredPaths = Object.values(rooms).find(r => {
    const validMoves = getValidMoves(r);
    return validMoves.length > 0;
  });
  if (roomWithUndiscoveredPaths) {
    return getRoute(room, roomWithUndiscoveredPaths).slice(0, 1);
  }
};

const run = async () => {
  const machine = new IntCodeMachine(program);

  let output = "";
  let steps = [];
  const rooms = {};
  let lastRoom;

  const processRoom = output => {
    const { name, directions, items } = parseOutput(output);

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

    if (currentRoom.name === "Security Checkpoint") {
      const [floorDirection] = getValidMoves(currentRoom);
      rooms["Floor"] = {
        name: "Floor",
        directions: [opposite(floorDirection)],
        rooms: { [opposite(floorDirection)]: currentRoom }
      };
      currentRoom.rooms[floorDirection] = rooms["Floor"];
    }

    return currentRoom;
  };

  machine.onOutput = value => {
    output += String.fromCharCode(value);
  };

  machine.onAwaitsInput = async () => {
    // console.log(output);
    const room = processRoom(output);
    // console.log(room.name);
    let nextMoves =
      getDiscoveryMoves(room) || getMovesToUndiscoveredRoom(rooms, room);
    // console.log(nextMoves);

    if (!nextMoves) {
      console.log(rooms);
      console.log("done");
      return;
    }
    // const input = await askQuestion("");
    steps.push(...nextMoves);
    output = [];
    lastRoom = room;
    sendCommands(machine, nextMoves);
  };
  machine.run();
};

run();
