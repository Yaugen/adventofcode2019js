const { per } = require("../shared/utils");
const { outputStorage } = require("./parser");

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

const processRoom = (rooms, steps, lastRoom) => {
  const [{ name, directions, items }] = outputStorage.rooms.reverse();

  let currentRoom = rooms[name];
  const lastStep = steps[steps.length - 1];

  if (!currentRoom) {
    currentRoom = { name, directions, items, rooms: {} };
    rooms[name] = currentRoom;
  }
  if (lastRoom) {
    lastRoom.rooms[lastStep] = currentRoom;
    currentRoom.rooms[opposite(lastStep)] = lastRoom;
  }

  if (currentRoom.name === "Security Checkpoint") {
    const [floorDirection] = getValidMoves(currentRoom);
    rooms["Floor"] = {
      name: "Floor",
      items: [],
      directions: [opposite(floorDirection)],
      rooms: { [opposite(floorDirection)]: currentRoom }
    };
    currentRoom.rooms[floorDirection] = rooms["Floor"];
  }

  return currentRoom;
};

const getItemCombinations = () => {
  const items = outputStorage.inventory[outputStorage.inventory.length - 1];
  let combinationsCount = Math.pow(2, items.length);
  const combinations = [];
  for (let i = 1; i < combinationsCount; i++) {
    const mask = (i >>> 0)
      .toString(2)
      .padStart(items.length, "0")
      .split("")
      .map(Number);

    combinations.push(items.filter((_, index) => mask[index]));
  }
  return combinations;
};

module.exports = {
  opposite,
  sendCommands,
  getValidMoves,
  getRoute,
  getDiscoveryMoves,
  getMovesToUndiscoveredRoom,
  processRoom,
  getItemCombinations
};
