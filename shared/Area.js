class Area {
  constructor(emptyValue = undefined) {
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;
    this.items = new Map();
    this.emptyValue = emptyValue;
  }

  get width() {
    const width = this.maxX - this.minX;
    return width === 0 ? width : width + 1;
  }

  get height() {
    const height = this.maxY - this.minY;
    return height === 0 ? height : height + 1;
  }

  hash(x, y) {
    return `${x}:${y}`;
  }

  set(x, y, value) {
    this.items.set(this.hash(x, y), value);
    this.minX = Math.min(x, this.minX);
    this.minY = Math.min(y, this.minY);
    this.maxX = Math.max(x, this.maxX);
    this.maxY = Math.max(y, this.maxY);
  }

  get(x, y) {
    const value = this.items.get(this.hash(x, y));
    return value !== undefined ? value : this.emptyValue;
  }

  traverse(cb) {
    for (let x = this.minX; x <= this.maxX; x++) {
      for (let y = this.minY; y <= this.maxY; y++) {
        cb(x, y, this.get(x, y));
      }
    }
  }

  print(cb = (x, y, item) => item) {
    let line = "";
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        line += cb(x, y, this.get(x, y));
      }
      line += "\n";
    }
    console.log(line);
  }
}

module.exports = Area;
