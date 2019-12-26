const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");

const code = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);
const queue = [];

const sendPacket = packet => {
  queue.push(packet);

  const [adr, x, y] = packet;
  if (adr === 255) {
    console.log(y);
    process.exit(0);
  }
  if (network[adr]) {
    network[adr].sendInput(x);
    network[adr].sendInput(y);
  }
};

const network = Array(50)
  .fill(0)
  .map((_, i) => {
    const machine = new IntCodeMachine(code, [i]);
    let packet = [];
    machine.onOutput = value => {
      packet.push(value);
      if (packet.length === 3) {
        sendPacket(packet);
        packet = [];
      }
    };
    machine.sendInput(-1);
    machine.run();
    return machine;
  });
