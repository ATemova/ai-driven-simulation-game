export class SimClock {
  speed = 1;
  paused = false;

  private accumulator = 0;
  private readonly fixedStep = 1 / 60;
  private readonly maxFrameDelta = 0.1;

  /** Runs tickFn a whole number of fixed steps. Returns ticks run. */
  update(deltaTime: number, tickFn: () => void): number {
    if (this.paused) return 0;

    this.accumulator += Math.min(deltaTime, this.maxFrameDelta) * this.speed;

    let ticks = 0;
    while (this.accumulator >= this.fixedStep) {
      tickFn();
      this.accumulator -= this.fixedStep;
      ticks++;
    }
    return ticks;
  }

  resetAccumulator() {
    this.accumulator = 0;
  }
}
