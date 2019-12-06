const fs = require("fs");
const path = require("path");

console.log(__dirname);
const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split("\r\n");

const getOrCreate = (objects, objectName) => {
  let object = objects[objectName];
  if (!object) {
    object = { parent: null, children: [], name: objectName };
    objects[objectName] = object;
  }
  return object;
};

const getOrbitCountForObject = object => {
  let counter = 0;
  let currentObject = object;
  while (currentObject) {
    currentObject = currentObject.parent;
    if (currentObject) {
      counter += 1;
    }
  }

  return counter;
};

const getObjectTransfers = object => {
  let transfers = [];
  let currentObject = object;
  while (currentObject) {
    const transfer = `${currentObject.name}->${
      currentObject.parent ? currentObject.parent.name : ""
    }`;
    currentObject = currentObject.parent;
    transfers.push(transfer);
  }

  return transfers;
};

const diffArrays = (arrA, arrB) =>
  arrA.reduce((acc, item) => {
    if (!arrB.includes(item)) {
      acc.push(item);
    }
    return acc;
  }, []);

const objects = input.reduce((objects, item) => {
  const [a, b] = item.split(")");
  let objectA = getOrCreate(objects, a);
  let objectB = getOrCreate(objects, b);

  objectA.children.push(objectB);
  objectB.parent = objectA;

  return objects;
}, {});

const orbitsCount = Object.values(objects)
  .map(getOrbitCountForObject)
  .reduce((sum, item) => sum + item, 0);

console.log(orbitsCount);

const youTransfers = getObjectTransfers(objects.YOU);
const sanTransfers = getObjectTransfers(objects.SAN);

const diff1 = diffArrays(youTransfers, sanTransfers);
const diff2 = diffArrays(sanTransfers, youTransfers);

console.log(diff1, diff2);

console.log(diff1.length + diff2.length - 2);
