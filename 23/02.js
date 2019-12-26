const fs = require("fs");
const path = require("path");

const IntCodeMachine = require("../shared/IntCodeMachine");

const code = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
  .split(",")
  .map(Number);

let natMemory = [];
const natHistory = new Set();

const sendPacket = packet => {
  const [adr, ...payload] = packet;
  if (adr === 255) {
    natMemory = payload;
  }
  if (network[adr]) {
    network[adr].queue.push(payload);
  }
};
const checkNetworkIdleness = () => {
  if (network.every(machine => machine.isIdle)) {
    const [, y] = natMemory;
    if (natHistory.has(y)) {
      console.log("not unique", y);
      process.exit(0);
    }
    natHistory.add(y);
    network[0].queue.push(natMemory);
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
    machine.queue = [];
    machine.onAwaitsInput = () => {
      if (machine.queue.length) {
        machine.isIdle = false;
        const [x, y] = machine.queue.shift();
        machine.sendInput(x);
        machine.sendInput(y);
      } else {
        if (!machine.isIdle) {
          machine.isIdle = true;
          setTimeout(() => checkNetworkIdleness(), 0);
        }
        machine.sendInput(-1);
      }
    };
    machine.run();
    return machine;
  });
