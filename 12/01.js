const fs = require("fs");
const path = require("path");
const os = require("os");

const Moon = require("./Moon");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(os.EOL)
  .map(line => {
    const [, x, y, z] = line.match(/<x=(.*), y=(.*), z=(.*)>/);
    return [x, y, z].map(Number);
  });

const run = (input, steps) => {
  const moons = input.map(coords => new Moon(coords));

  for (let step = 0; step < steps; step++) {
    for (let moon of moons) {
      for (let otherMoon of moons) {
        if (moon !== otherMoon) {
          moon.changeVelocity(otherMoon.pos);
        }
      }
    }
    moons.forEach(moon => {
      moon.makeStep();
    });
  }

  const totalEnergy = moons
    .map(moon => moon.getTotalEnergy())
    .reduce((sum, moonEnergy) => sum + moonEnergy, 0);
  console.log(totalEnergy);
};

run(input, 1000);
