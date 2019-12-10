const fs = require("fs");
const path = require("path");
const os = require("os");
const chalk = require("chalk");

const { gcd, askQuestion } = require("../shared/utils");

const getMap = input =>
  Array(input[0].length)
    .fill(0)
    .map((_, x) =>
      Array(input.length)
        .fill(0)
        .map((_, y) => input[y][x])
    );

const print = (arr, f = (x, y) => arr[x][y]) => {
  for (let y = 0; y < arr[0].length; y++) {
    let line = "";
    for (let x = 0; x < arr.length; x++) {
      line += f(x, y);
    }
    console.log(line);
  }
};

const getAsteroids = map => {
  const asteroids = [];
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      if (map[x][y] === "#") {
        asteroids.push([x, y]);
      }
    }
  }
  return asteroids;
};
const signOf = a => (a < 0 ? -1 : 1);

const getStepAmount = ([x1, y1], [x2, y2]) => {
  const stepX = x2 - x1;
  const stepY = y2 - y1;
  if (stepX === 0) {
    return [0, signOf(stepY)];
  }
  if (stepY === 0) {
    return [signOf(stepX), 0];
  }
  if (Math.abs(stepX) === Math.abs(stepY)) {
    return [signOf(stepX), signOf(stepY)];
  }
  const factor = Math.abs(gcd(stepX, stepY));
  return [stepX / factor, stepY / factor];
};

const getDistance = ([x1, y1], [x2, y2]) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

const getAsteroidLineOfSight = (curAsteroid, coords, width, height) => {
  let asteroids = coords
    .filter(a => a[0] !== curAsteroid[0] || a[1] !== curAsteroid[1])
    .sort((a, b) => getDistance(curAsteroid, a) - getDistance(curAsteroid, b));

  const lineOfSight = [];
  while (asteroids.length) {
    const asteroid = asteroids.shift();
    const [distX, distY] = getStepAmount(curAsteroid, asteroid);
    lineOfSight.push(asteroid);

    let [curX, curY] = asteroid;
    let asteroidsToRemove = [];
    while (curX >= 0 && curX < width && curY >= 0 && curY < height) {
      if (asteroids.find(a => a[0] === curX && a[1] === curY)) {
        asteroidsToRemove.push([curX, curY]);
      }
      asteroids = asteroids.filter(a => !(a[0] === curX && a[1] === curY));
      curX += distX;
      curY += distY;
    }
  }
  return lineOfSight;
};

const printAsteroidMap = async (
  map,
  curAsteroid,
  asteroid,
  asteroids,
  asteroidsToRemove
) => {
  const asteroidsToRemoveCoords = asteroidsToRemove.map(
    ([x, y]) => `${x}:${y}`
  );
  const asteroidsCoords = asteroids.map(([x, y]) => `${x}:${y}`);
  console.log(lineOfSight.length);
  print(map, (x, y) => {
    if (x === curAsteroid[0] && y === curAsteroid[1]) {
      return chalk.yellow("O");
    }
    if (x === asteroid[0] && y === asteroid[1]) {
      return chalk.yellow("*");
    }
    if (asteroidsToRemoveCoords.includes(`${x}:${y}`)) {
      return chalk.yellow("-");
    }
    if (asteroidsCoords.includes(`${x}:${y}`)) {
      return "#";
    }
    return ".";
  });
  await askQuestion("");
};

const getBasePosition = (asteroids, width, height) =>
  asteroids
    .map(a => {
      const lineOfSight = getAsteroidLineOfSight(a, asteroids, width, height);
      return [lineOfSight.length, a];
    })
    .reduce((max, a) => (a[0] > max[0] ? a : max), [0, 0]);

// const getAngle = ([baseX, baseY], [coordX, coordY]) => {
//   const [difX, difY] = [baseX - coordX, baseY - coordY];
//   let angle = Math.atan2(difY, difX) - Math.PI / 2;
//   //if (angle < 0) {
//   //  angle += Math.PI * 2;
//   //}
//   console.log([difX, difY], angle);
//   return angle;
// };
function getAngle([x1, y1], [x2, y2]) {
  var angleRadians = (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI;
  if (angleRadians < 0) angleRadians += 360;
  angleRadians -= 90;
  if (angleRadians < 0) angleRadians += 360;
  console.log(x1, x2, y1, y2, angleRadians);
  return angleRadians;
}
console.log(getAngle([8, 3], [8, 1]));
const getVaporisingSequence = (coords, basePosition, width, height) => {
  const asteroids = coords.slice();
  const lineOfSight = getAsteroidLineOfSight(
    basePosition,
    asteroids,
    width,
    height
  ).sort((a, b) => getAngle(basePosition, a) - getAngle(basePosition, b));

  console.log(lineOfSight);
};

const input = fs
  .readFileSync(path.resolve(__dirname, "./testInput.txt"), "utf8")
  .split(os.EOL);

const map = getMap(input);
const asteroids = getAsteroids(map);
const width = map.length;
const height = map[0].length;
getVaporisingSequence(asteroids, [8, 3], width, height);
// const [, basePosition] = getBasePosition(asteroids, width, height);
