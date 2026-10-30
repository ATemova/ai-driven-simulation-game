const MOD = 2147483647;

/** Park–Miller minimal standard PRNG. Deterministic for a given seed. */
export class RNG {
  private state: number;

  constructor(seed: number) {
    const s = Math.floor(Math.abs(seed)) % MOD;
    this.state = s === 0 ? 1 : s;
  }

  next() {
    this.state = (this.state * 16807) % MOD;
    return (this.state - 1) / (MOD - 1);
  }

  range(min: number, max: number) {
    return min + this.next() * (max - min);
  }
}
