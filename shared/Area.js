const { getRange } = require("./utils");

class Area {
  constructor(width = 0, height = 0, emptyCellValue = "") {
    this.width = width;
    this.height = height;
    this.emptyCellValue = emptyCellValue;
    this.area = Array(width)
      .fill(0)
      .map(() => Array(height).fill(emptyCellValue));
  }

  set(x, y, value) {
    if (x >= this.width) {
      this.addColumnsRight(x - this.width + 1);
    }
    if (x < 0) {
      this.addColumnsLeft(Math.abs(x));
      x = 0;
    }
    if (y >= this.height) {
      this.addRowsBottom(y - this.height + 1);
    }
    if (y < 0) {
      this.addRowsTop(Math.abs(y));
      y = 0;
    }
    this.area[x][y] =
      typeof value === "function" ? value(this.area[x][y]) : value;
  }

  drawLine(fromX, fromY, toX, toY, value) {
    const xRange = getRange(fromX, toX).map(x => (x < 0 ? -1 : x));
    const yRange = getRange(fromY, toY).map(y => (y < 0 ? -1 : y));

    xRange.forEach(x =>
      yRange.forEach(y => {
        this.set(x, y, value);
      })
    );
  }

  getValuePositions(value, returnFirst = false) {
    const positions = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.area[x][y] === value) {
          positions.push([x, y]);
          if (returnFirst) {
            return [x, y];
          }
        }
      }
    }
    return positions;
  }

  print() {
    let line = "";
    for (let y = 0; y < this.height; y++) {
      line = "";
      for (let x = 0; x < this.width; x++) {
        line += this.area[x][y];
      }
      console.log(line);
    }
  }

  addColumnsRight(count = 0, fillValue = this.emptyCellValue) {
    for (let i = 0; i < count; i++) {
      this.area.push(Array(this.height).fill(fillValue));
    }
    this.width += count;
  }
  addColumnsLeft(count = 0, fillValue = this.emptyCellValue) {
    for (let i = 0; i < count; i++) {
      this.area.unshift(Array(this.height).fill(fillValue));
    }
    this.width += count;
  }
  addRowsTop(count = 0, fillValue = this.emptyCellValue) {
    this.area.map(row => row.unshift(...Array(count).fill(fillValue)));
    this.height += count;
  }
  addRowsBottom(count = 0, fillValue = this.emptyCellValue) {
    this.area.map(row => row.push(...Array(count).fill(fillValue)));
    this.height += count;
  }
}

module.exports = Area;
