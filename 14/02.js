const fs = require("fs");
const path = require("path");
const os = require("os");

const parseElement = line => {
  const [quantity, name] = line.split(" ");
  return { quantity: Number(quantity), name };
};
const parseLeftPart = line => {
  return line.split(", ").map(parseElement);
};
const parseReaction = line => {
  const [left, right] = line.split(" => ");
  return {
    left: parseLeftPart(left),
    right: parseElement(right)
  };
};

const getWeight = (reactions, elementName) => {
  if (elementName === "ORE") {
    return 0;
  }
  const { sources } = reactions[elementName];
  return (
    1 + Math.max(...sources.map(source => getWeight(reactions, source.name)))
  );
};
const addReactionWeight = reactions => {
  Object.values(reactions).forEach(reaction => {
    reaction.sources = reaction.sources.map(source => {
      return {
        ...source,
        weight: getWeight(reactions, source.name)
      };
    });
  });
};
const getReactions = lines => {
  const reactions = lines.reduce((acc, item) => {
    acc[item.right.name] = {
      ...item.right,
      sources: item.left.map(leftItem => ({ ...leftItem }))
    };
    return acc;
  }, {});
  addReactionWeight(reactions);
  return reactions;
};

const getCoeff = (targetQuantity, reactionQuantity) =>
  targetQuantity > reactionQuantity
    ? Math.ceil(targetQuantity / reactionQuantity)
    : 1;
const getElementSources = (targetQuantity, reaction) => {
  const coeff = getCoeff(targetQuantity, reaction.quantity);
  return reaction.sources.map(source => ({
    ...source,
    quantity: source.quantity * coeff
  }));
};

const merge = (a, b) => {
  return b.reduce((acc, item) => {
    const match = acc.find(e => e.name === item.name);
    if (match) {
      match.quantity += item.quantity;
    } else {
      acc.push(item);
    }
    return acc;
  }, a);
};

const resolveToOre = (reactions, elementName, quantity) => {
  let sources = getElementSources(quantity, reactions[elementName]);
  while (!sources.every(e => e.name === "ORE")) {
    sources.sort((a, b) => a.weight - b.weight);

    const element = sources.pop();
    const elementReaction = reactions[element.name];
    const elementSources = getElementSources(element.quantity, elementReaction);
    sources = merge(sources, elementSources);
  }

  return sources;
};

const binarySearch = (initialLeft, initialRight, predicate) => {
  let left = initialLeft;
  let right = initialRight;
  while (left !== right) {
    let center = left + Math.ceil((right - left) / 2);

    if (predicate(center)) {
      right = center - 1;
    } else {
      left = center + 1;
    }
  }
  return left;
};

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(os.EOL)
  .map(parseReaction);
const reactions = getReactions(input);
addReactionWeight(reactions);

const [{ quantity: oreForOneFuel }] = resolveToOre(reactions, "FUEL", 1);
const T = 1000000000000;
const left = Math.floor(T / oreForOneFuel);

const res = binarySearch(left, left * 2, value => {
  const [{ quantity }] = resolveToOre(reactions, "FUEL", value);
  return quantity > T;
});
console.log(res);
