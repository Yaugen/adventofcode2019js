class Moon {
  constructor(pos) {
    this.initialPos = pos.slice();
    this.pos = pos.slice();
    this.vel = [0, 0, 0];
  }

  isOnInitialPos() {
    return (
      this.isOnInitialPosByAxis(0) &&
      this.isOnInitialPosByAxis(1) &&
      this.isOnInitialPosByAxis(2)
    );
  }

  isOnInitialPosByAxis(axis) {
    return this.initialPos[axis] === this.pos[axis] && this.vel[axis] === 0;
  }

  toString() {
    return `${this.pos[0]}:${this.pos[1]}:${this.pos[2]}`;
  }

  changeVelocity(otherMoonPos) {
    this.changeVelocityByAxis(otherMoonPos, 0);
    this.changeVelocityByAxis(otherMoonPos, 1);
    this.changeVelocityByAxis(otherMoonPos, 2);
  }

  changeVelocityByAxis(otherMoonPos, axis) {
    this.vel[axis] += this.getVelocityChange(
      this.pos[axis],
      otherMoonPos[axis]
    );
  }

  makeStep() {
    this.makeStepByAxis(0);
    this.makeStepByAxis(1);
    this.makeStepByAxis(2);
  }

  makeStepByAxis(axis) {
    this.pos[axis] += this.vel[axis];
  }

  getVelocityChange(a, b) {
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    return 0;
  }

  getPotentialEnergy() {
    return this.pos
      .map(coord => Math.abs(coord))
      .reduce((sum, item) => sum + item, 0);
  }

  getKineticEnergy() {
    return this.vel
      .map(coord => Math.abs(coord))
      .reduce((sum, item) => sum + item, 0);
  }

  getTotalEnergy() {
    return this.getPotentialEnergy() * this.getKineticEnergy();
  }
}

module.exports = Moon;
