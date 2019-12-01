const fs = require("fs");

const data = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n")
  .map(Number);

const calcFuel = mass => Math.floor(mass / 3) - 2;
const fuelMassRecurssive = fuel => {
  const fuelMass = calcFuel(fuel);
  return fuelMass <= 0 ? 0 : fuelMass + fuelMassRecurssive(fuelMass);
};

const res = data.map(fuelMassRecurssive).reduce((acc, item) => acc + item);
console.log(res);
