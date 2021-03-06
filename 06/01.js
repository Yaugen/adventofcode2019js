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

const getOrbitCountForObject = objects => object => {
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

const objects = input.reduce((objects, item) => {
  const [a, b] = item.split(")");
  let objectA = getOrCreate(objects, a);
  let objectB = getOrCreate(objects, b);

  objectA.children.push(objectB);
  objectB.parent = objectA;

  return objects;
}, {});

const orbitsCount = Object.values(objects)
  .map(getOrbitCountForObject(objects))
  .reduce((sum, item) => sum + item, 0);

console.log(orbitsCount);
