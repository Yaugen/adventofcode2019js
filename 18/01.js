const fs = require("fs");
const path = require("path");
const os = require("os");
const { memoize } = require("lodash");

const Area = require("../shared/Area");

const getArea = input => {
  const area = new Area("");
  input.forEach((line, y) =>
    line.split("").forEach((cell, x) => {
      area.set(x, y, cell);
    })
  );

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

const getEdges = (area, initialCursor) => {
  let cursors = [{ ...initialCursor, steps: 0, doors: [] }];
  const visited = [];
  let edges = [];
  while (cursors.length) {
    let newCursors = [];
    for (const cursor of cursors) {
      if (cursor.item >= "A" && cursor.item <= "Z") {
        //door
        cursor.doors.push(cursor.item.toLowerCase());
      }
      if (
        cursor.item >= "a" &&
        cursor.item <= "z" &&
        cursor.item !== initialCursor.item &&
        !edges.find(({ x, y }) => x === cursor.x && y === cursor.y)
      ) {
        //key
        edges.push(cursor);
      }

      const neighbours = getNeighbours(`${cursor.x}:${cursor.y}`, area);

      const possibleMoves = [];
      for (const { x, y, item } of neighbours) {
        if (item !== "#" && !visited.includes(area.hash(x, y))) {
          possibleMoves.push({
            x,
            y,
            item,
            steps: cursor.steps + 1,
            doors: cursor.doors.slice()
          });
        }
      }

      visited.push(area.hash(cursor.x, cursor.y));
      newCursors = newCursors.concat(possibleMoves);
    }
    cursors = newCursors;
  }

  return edges.reduce((acc, edge) => ({ ...acc, [edge.item]: edge }), {});
};

const run = input => {
  let area = getArea(input);
  let curPos;
  area.traverse((x, y, item) => {
    if (item === "@") {
      curPos = [x, y];
    }
  });

  let initialEdge = { x: curPos[0], y: curPos[1], item: "@" };

  const edges = {
    ["@"]: {
      ...initialEdge,
      edges: getEdges(area, initialEdge)
    }
  };
  for (const { steps, doors, ...edge } of Object.values(edges["@"].edges)) {
    edges[edge.item] = { ...edge, edges: getEdges(area, edge) };
  }

  const keys = Object.keys(edges)
    .sort()
    .filter(k => k !== "@");

  const shortestPath = (visited, distance, memo) => {
    if (keys.length === visited.length - 1) {
      return distance;
    }
    const current = visited[visited.length - 1];
    const keysToVisit = keys.filter(
      key =>
        !visited.includes(key) &&
        edges[current].edges[key].doors.every(door => visited.includes(door))
    );
    if (keysToVisit.length === 0) {
      return distance;
    }
    const memoKey = `${current}:${keys
      .filter(k => !visited.includes(k))
      .join("")}`;
    if (memo[memoKey] !== undefined) {
      // console.log("hit");
      return memo[memoKey] + distance;
    }
    let min = Number.MAX_SAFE_INTEGER;
    for (const key of keysToVisit) {
      min = Math.min(
        min,
        shortestPath(
          [...visited, key],
          distance + edges[current].edges[key].steps,
          memo
        )
      );
    }
    memo[memoKey] = min - distance;
    return min;
  };

  console.log(shortestPath(["@"], 0, {}));
};

const input = fs
  .readFileSync(path.resolve(__dirname, "./testInput.txt"), "utf8")
  .split(os.EOL);

run(input);
