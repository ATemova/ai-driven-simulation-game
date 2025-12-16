export class SimClock {
  speed = 1;       // simulation speed multiplier
  paused = false;

  private accumulator = 0;
  private readonly fixedStep = 1 / 60; // 60 sim ticks per second

  update(deltaTime: number, tickFn: () => void) {
    if (this.paused) return;

    this.accumulator += deltaTime * this.speed;

    while (this.accumulator >= this.fixedStep) {
      tickFn();
      this.accumulator -= this.fixedStep;
    }
  }
}