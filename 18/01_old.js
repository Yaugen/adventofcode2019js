const fs = require("fs");
const path = require("path");
const os = require("os");
const { memoize } = require("lodash");

const Area = require("../shared/Area");

const input = fs
  .readFileSync(path.resolve(__dirname, "./testInput.txt"), "utf8")
  .split(os.EOL);

const getArea = input => {
  const area = new Area("");
  input.forEach((line, y) =>
    line.split("").forEach((cell, x) => {
      area.set(x, y, cell);
    })
  );

  // area.print();
  return area;
};
const getArea1 = input => {
  const area = Array(input[0].length).fill(Array(input.length));
  // const area = new Area("");
  input.forEach((line, y) =>
    line.split("").forEach((cell, x) => {
      area[x][y] = cell;
    })
  );

  // area.print();
  return area;
};

const getNeighbours = memoize((coords, area) => {
  const [x, y] = coords.split(":").map(Number);
  return area.getNeighbourCoords(x, y).map(([x, y]) => ({
    x,
    y,
    item: area.get(x, y)
  }));
});

const findReachableKeys = (area, initialCursor) => {
  const validCells = initialCursor.validCells;

  let cursors = [initialCursor];
  const visited = [];
  let keys = [];
  while (cursors.length) {
    let newCursors = [];
    for (const cursor of cursors) {
      const neighbours = getNeighbours(`${cursor.x}:${cursor.y}`, area);
      // for (let i = 0; i < neighbours.length; i++) {
      //   neighbours[i].steps = cursor.steps + 1;
      // }

      const possibleMoves = [];
      const foundKeys = [];
      for (const { x, y, item } of neighbours) {
        if (
          validCells.includes(item) &&
          !visited.includes(area.hash(x, y)) &&
          !newCursors.find(cursor => cursor.x === x && cursor.y === y)
        ) {
          possibleMoves.push({ x, y, item, steps: cursor.steps + 1 });
        } else if (item.match(/[a-z]/) && !validCells.includes(item)) {
          foundKeys.push({ x, y, item, steps: cursor.steps + 1 });
        }
      }

      visited.push(area.hash(cursor.x, cursor.y));
      if (foundKeys.length) {
        keys = keys.concat(foundKeys);
      }
      newCursors = newCursors.concat(possibleMoves);
    }
    cursors = newCursors;
  }

  return keys;
};

const run = () => {
  let area = getArea(input);
  let curPos;
  area.traverse((x, y, item) => {
    if (item === "@") {
      curPos = [x, y];
      // area.set(x, y, ".");
    }
  });

  let cursors = [
    { x: curPos[0], y: curPos[1], item: "@", steps: 0, validCells: ["."] }
  ];

  let found = [];
  while (cursors.length) {
    let newCursors = [];
    console.time();
    for (const cursor of cursors) {
      cursor.validCells.push(cursor.item, cursor.item.toUpperCase());
      const reachableKeys = findReachableKeys(area, cursor).map(key => ({
        ...key,
        validCells: cursor.validCells.slice()
      }));

      if (reachableKeys.length) {
        newCursors = newCursors.concat(reachableKeys);
      } else {
        found.push(cursor);
        // console.log(cursor);
      }
    }
    console.timeEnd();
    console.log(newCursors.length);
    cursors = newCursors;
  }

  const minsteps = found.reduce(
    (min, item) => (item.steps < min.steps ? item : min),
    { steps: Infinity }
  );
  console.log(minsteps);
};
run();
