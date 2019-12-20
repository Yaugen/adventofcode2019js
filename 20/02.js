const fs = require("fs");
const path = require("path");
const os = require("os");

const getInput = inputPath =>
  fs.readFileSync(path.resolve(__dirname, inputPath), "utf8").split(os.EOL);
// prettier-ignore
const NEIGHBOURS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const getNeighbours = (arr, x, y) => {
  const neighbourCoords = NEIGHBOURS.map(([dx, dy]) => [x + dx, y + dy]);
  const filtered = neighbourCoords.filter(
    ([x, y]) => x >= 0 && x < arr.length && y >= 0 && y < arr[0].length
  );
  return filtered.map(([x, y]) => [x, y, arr[x][y]]);
};
const isUpper = str => "A" <= str && str <= "Z";
const isDot = str => str === ".";
const hash = (x, y) => `${x}:${y}`;
const unHash = hash => hash.split(":").map(Number);

const print = (area, visited = []) => {
  let str = "";
  for (let y = 0; y < area[0].length; y++) {
    for (let x = 0; x < area.length; x++) {
      const value = visited.includes(hash(x, y)) ? "0" : area[x][y];
      str += value.padStart(2, value);
    }
    str += os.EOL;
  }
  console.log(str);
};

const getArea = input => {
  const width = input[0].length;
  const height = input.length;
  const area = Array(width)
    .fill(0)
    .map(() => Array(height).fill(""));
  const teleports = {};
  const addTeleport = (label, x, y) => {
    if (!teleports[label]) {
      teleports[label] = [];
    }
    const levelValue =
      x < 5 || x > width - 5 || y < 5 || y > height - 5 ? -1 : 1;
    teleports[label].push([x, y, levelValue]);
  };

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let value = input[y][x];
      if (isUpper(value)) {
        const n = getNeighbours(input, y, x); // x and y swapped intentionally
        if (n.length === 4) {
          if (isUpper(n[0][2]) && isDot(n[2][2])) {
            value = n[0][2] + value;
            addTeleport(value, n[2][1], n[2][0]);
          } else if (isUpper(n[1][2]) && isDot(n[3][2])) {
            value = value + n[1][2];
            addTeleport(value, n[3][1], n[3][0]);
          } else if (isUpper(n[2][2]) && isDot(n[0][2])) {
            value = value + n[2][2];
            addTeleport(value, n[0][1], n[0][0]);
          } else if (isUpper(n[3][2]) && isDot(n[1][2])) {
            value = n[3][2] + value;
            addTeleport(value, n[1][1], n[1][0]);
          } else {
            value = " ";
          }
        } else {
          value = " ";
        }
      }
      area[x][y] = value;
    }
  }
  return { area, teleports };
};

const walkThroughMaze = (area, teleports) => {
  const [startX, startY] = teleports.AA[0];
  let cursors = [
    {
      x: startX,
      y: startY,
      cell: ".",
      steps: 0,
      level: 0,
      teleported: true,
      path: ""
    }
  ];
  console.log(area[9][1]);

  const visited = [];

  while (cursors.length) {
    const cursor = cursors.shift();
    if (!visited[cursor.level]) {
      visited[cursor.level] = [];
    }
    const levelVisited = visited[cursor.level];
    levelVisited.push(hash(cursor.x, cursor.y));

    // if (cursor.cell === "ZZ") {
    //   return cursor;
    // }

    for (const [x, y, cell] of getNeighbours(area, cursor.x, cursor.y)) {
      if (levelVisited.includes(hash(x, y))) {
        continue;
      }
      if (cursor.level === 0 && cell === "ZZ") {
        return cursor;
      } else if (cell === ".") {
        cursors.push({
          x,
          y,
          cell,
          steps: cursor.steps + 1,
          level: cursor.level,
          path: cursor.path
        });
      } else if (
        !cursor.teleported &&
        cell !== "ZZ" &&
        cell !== "AA" &&
        cell.match(/[A-Z]+/)
      ) {
        const [currentTeleport] = teleports[cell].filter(
          ([tx, ty]) => tx === cursor.x && ty === cursor.y
        );
        const levelModifier = currentTeleport[2];
        if (cursor.level === 0 && levelModifier < 0) {
          continue;
        }
        const [[targetX, targetY]] = teleports[cell].filter(
          t => t != currentTeleport
        );
        if (cursor.level + levelModifier < 30) {
          cursors.push({
            x: targetX,
            y: targetY,
            cell: ".",
            steps: cursor.steps + 1,
            level: cursor.level + levelModifier,
            teleported: true,
            path: cursor.path + `-${levelModifier > 0 ? "V" : "^"}:${cell}`
          });
        }
        console.log(cursor.level + levelModifier);
      }
    }
    // print(area, visited);
  }
};

const run = () => {
  const input = getInput("./input.txt");
  const { area, teleports } = getArea(input);
  // print(area);
  console.log(teleports);

  console.log(walkThroughMaze(area, teleports));
};

run();
