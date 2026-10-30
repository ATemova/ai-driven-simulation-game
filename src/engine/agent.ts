export interface Traits {
  speed: number;
  vision: number;
  metabolism: number;
}

export type TraitName = keyof Traits;

export class Agent {
  age = 0;
  reproductionCooldown = 0;

  constructor(
    public readonly id: number,
    public x: number,
    public y: number,
    public readonly traits: Traits,
    public energy: number,
    public readonly generation = 0
  ) {}
}
