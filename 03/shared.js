const { getRange } = require("../shared/utils");

const getCurvePoints = curve => {
  const curveData = curve.split(",").map(data => {
    const [, dir, amount] = data.match(/(.)(\d+)/);
    return [dir, Number(amount)];
  });

  let cursor = [0, 0];
  return curveData.reduce((acc, [dir, amount], index) => {
    const [cursorX, cursorY] = cursor;
    let [targetX, targetY] = cursor;
    switch (dir) {
      case "U":
        targetY -= amount;
        break;
      case "R":
        targetX += amount;
        break;
      case "D":
        targetY += amount;
        break;
      case "L":
        targetX -= amount;
        break;
    }
    const xRange = getRange(cursorX, targetX);
    const yRange = getRange(cursorY, targetY);

    const points = [];
    xRange.forEach(x => yRange.forEach(y => points.push(`${x}:${y}`)));
    cursor = [targetX, targetY];
    return [...acc, ...points.slice(1)];
  }, []);
};
module.exports = { getCurvePoints };
