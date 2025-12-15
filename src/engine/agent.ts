export class Agent {
  id: number;
  x: number;
  y: number;

  energy = 100;
  age = 0;

  speed = 1;
  vision = 6;

  constructor(id: number, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}