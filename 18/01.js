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

const runNew = input => {
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
  console.log(Object.keys(edges).length, Object.keys(edges));
  // console.log(edges["@"].edges);

  let cursors = [{ ...initialEdge, steps: 0, visited: "" }];
  let result = [];

  const getVisible = visited => {
    const item = visited[visited.length - 1];

    return edges[item].edges
      .filter(
        edge =>
          !visited.includes(edge.item) &&
          edge.doors.every(door => visited.includes(door))
      )
      .map(edge => ({
        item: edge.item,
        steps: edge.steps,
        visited: visited + edge.item
      }));
  };

  let counter = 0;
  let minSteps = 6094;

  console.time();
  while (cursors.length) {
    const cursor = cursors.pop();
    let visibleEdges = [];
    if (cursor.steps < minSteps) {
      visibleEdges = getVisible(cursor.visited || cursor.item);
    }
    if (!visibleEdges.length && cursor.steps < minSteps) {
      console.log(cursors.length);

      result.push(cursor);
      minSteps = cursor.steps;
      console.timeEnd();
      console.log(cursor);
      console.time();
    } else {
      visibleEdges.forEach(edge => {
        edge.steps += cursor.steps;
        cursors.push(edge);
      });
    }
  }
  console.timeEnd();
  console.log(
    result.reduce((min, item) => (item.steps < min.steps ? item : min), {
      steps: Infinity
    })
  );
};

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(os.EOL);

runNew(input);
