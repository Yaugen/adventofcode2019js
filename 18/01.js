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
        cursor.doors.push(cursor.item);
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
        if (
          item !== "#" &&
          !visited.includes(area.hash(x, y)) // &&
          // !newCursors.find(cursor => cursor.x === x && cursor.y === y)
        ) {
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

  return edges;
};

const run = () => {
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
  for (const { steps, doors, ...edge } of edges["@"].edges) {
    edges[edge.item] = { ...edge, edges: getEdges(area, edge) };
  }
  console.log(edges["@"].edges);

  let cursors = [{ ...initialEdge, steps: 0, visited: [] }];
  let result = [];

  while (cursors.length) {
    let newCursors = [];
    console.time();
    for (const cursor of cursors) {
      const cursorEdges = edges[cursor.item].edges;
      const cursorVisibleEdges = cursorEdges.filter(
        edge =>
          !cursor.visited.includes(edge.item) &&
          edge.doors
            // .split("")
            .every(door => cursor.visited.includes(door.toLowerCase()))
      );
      if (!cursorVisibleEdges.length) {
        result.push(cursor);
      } else {
        newCursors = newCursors.concat(
          cursorVisibleEdges.map(edge => ({
            // x: edge.x,
            // y: edge.y,
            item: edge.item,
            steps: cursor.steps + edge.steps,
            visited: [...cursor.visited, edge.item]
          }))
        );
      }
    }
    console.timeEnd();
    console.log(newCursors.length);
    cursors = newCursors;
  }
  const minsteps = result.reduce(
    (min, item) => (item.steps < min.steps ? item : min),
    { steps: Infinity }
  );
  console.log(minsteps);
};
run();
