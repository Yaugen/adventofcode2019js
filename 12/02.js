const fs = require("fs");
const path = require("path");
const os = require("os");
const chalk = require("chalk");

const Moon = require("./Moon");
const { lcm } = require("../shared/utils");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(os.EOL)
  .map(line => {
    const [, x, y, z] = line.match(/<x=(.*), y=(.*), z=(.*)>/);
    return [x, y, z].map(Number);
  });

const getCycle = (moons, axis) => {
  let stepCounter = 0;
  let cycle = 0;
  do {
    stepCounter += 1;

    for (let moon of moons) {
      for (let otherMoon of moons) {
        if (moon !== otherMoon) {
          moon.changeVelocityByAxis(otherMoon.pos, axis);
        }
      }
    }
    for (let moon of moons) {
      moon.makeStepByAxis(axis);
    }
    if (!cycle && moons.every(moon => moon.isOnInitialPosByAxis(axis))) {
      console.log(`every moon is on same ${axis} axis on step ${stepCounter}`);
      cycle = stepCounter;
    }
  } while (!cycle);

  return cycle;
};

const run = input => {
  const moons = input.map(coords => new Moon(coords));
  const xCycle = getCycle(moons, 0);
  const yCycle = getCycle(moons, 1);
  const zCycle = getCycle(moons, 2);

  console.log(lcm(xCycle, lcm(yCycle, zCycle)));
};

run(input);
