export class Food {
  /** Bookkeeping for O(1) removal; managed by World / FoodGrid. */
  index = -1;
  cell = -1;
  slot = -1;

  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly energy: number
  ) {}
}
