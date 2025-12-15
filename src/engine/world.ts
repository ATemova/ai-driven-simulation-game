import { Agent } from "./agent";
import { Food } from "./food";

export class World {
  agents: Agent[] = [];
  food: Food[] = [];

  constructor(
    public readonly width: number,
    public readonly height: number
  ) {}

  clampPosition(entity: { x: number; y: number }) {
    entity.x = Math.max(0, Math.min(this.width, entity.x));
    entity.y = Math.max(0, Math.min(this.height, entity.y));
  }

  addAgent(agent: Agent) {
    this.clampPosition(agent);
    this.agents.push(agent);
  }

  addFood(food: Food) {
    this.clampPosition(food);
    this.food.push(food);
  }
}