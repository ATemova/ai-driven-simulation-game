export class SimClock {
  speed = 1;
  paused = false;

  private accumulator = 0;
  private readonly fixedStep = 1 / 60;

  update(deltaTime: number, tickFn: () => void) {
    if (this.paused) return;

    this.accumulator += deltaTime * this.speed;

    while (this.accumulator >= this.fixedStep) {
      tickFn();
      this.accumulator -= this.fixedStep;
    }
  }
}