export class RNG {
  constructor(private seed: number) {}

  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  range(min: number, max: number) {
    return min + this.next() * (max - min);
  }
}