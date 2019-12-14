const fs = require("fs");
const path = require("path");
const os = require("os");
const chalk = require("chalk");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(os.EOL)
  .map(item => {
    const [from, to] = item.split("=>");
    return [
      from
        .trim()
        .split(",")
        .map(item => item.trim())
    ];
  });
