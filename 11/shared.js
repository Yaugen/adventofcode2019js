const chalk = require("chalk");

class Robot {
  constructor(width = 100, height = 100) {
    this.x = Math.floor(width / 2);
    this.y = Math.floor(height / 2);
    this.dir = 0;

    this.areaWidth = width;
    this.areaHeight = height;
    this.area = Array(this.areaWidth)
      .fill(0)
      .map(() => Array(this.areaHeight).fill("."));
  }
  makeStep() {
    switch (this.dir) {
      case 0:
        this.y -= 1;
        break;
      case 1:
        this.x += 1;
        break;
      case 2:
        this.y += 1;
        break;
      case 3:
        this.x -= 1;
        break;
    }
  }
  rotate(angle) {
    if (angle === 0) {
      this.dir -= 1;
    } else if (angle === 1) {
      this.dir += 1;
    }

    if (this.dir < 0) {
      this.dir = 3;
    }
    if (this.dir > 3) {
      this.dir = 0;
    }
  }
  getCurrentColor() {
    return this.area[this.x][this.y] === "." ? 0 : 1;
  }
  paint(color) {
    this.area[this.x][this.y] = color ? "#" : ".";
  }

  getRobotChar() {
    let robotChar;
    switch (this.dir) {
      case 0:
        robotChar = "^";
        break;
      case 1:
        robotChar = ">";
        break;
      case 2:
        robotChar = "V";
        break;
      case 3:
        robotChar = "<";
        break;
    }
    return robotChar;
  }

  printArea() {
    for (let y = 0; y < this.areaHeight; y++) {
      let line = "";
      for (let x = 0; x < this.areaWidth; x++) {
        // const color = this.area[x][y] === "." ? 0 : 1;
        const char = this.x === x && this.y === y ? this.getRobotChar() : " ";
        line +=
          this.area[x][y] === "#" ? chalk.bgYellow(char) : chalk.bgBlack(char);
      }
      console.log(line);
    }
  }
}

module.exports = { Robot };
