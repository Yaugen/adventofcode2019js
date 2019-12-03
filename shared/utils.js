const getRange = (from, to) => {
  const length = Math.abs(from - to) + 1;
  const sign = from > to ? -1 : 1;
  return Array(length)
    .fill(0)
    .map((_, index) => from + sign * index);
};

const getManhattanDistance = (x1, y1, x2, y2) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

module.exports = { getRange, getManhattanDistance };
