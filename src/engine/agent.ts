export interface Traits {
  speed: number;
  vision: number;
  metabolism: number;
}

export class Agent {
  id: number;
  x: number;
  y: number;

  energy = 100;
  age = 0;
  generation: number;

  traits: Traits;

  reproductionCooldown = 0;

  constructor(
    id: number,
    x: number,
    y: number,
    traits: Traits,
    generation = 0
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.traits = traits;
    this.generation = generation;
  }
}