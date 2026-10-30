import { Agent } from "./agent";
import { Food } from "./food";
import { FoodGrid } from "./foodGrid";
import { CONFIG, Settings } from "./config";

export class World {
  agents: Agent[] = [];
  readonly food: Food[] = [];
  readonly foodGrid: FoodGrid;

  tickCount = 0;
  nextId = 0;
  foodAccumulator = 0;

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly settings: Settings
  ) {
    this.foodGrid = new FoodGrid(width, height, CONFIG.gridCellSize);
  }

  clamp(x: number, y: number): [number, number] {
    return [
      Math.max(0, Math.min(this.width, x)),
      Math.max(0, Math.min(this.height, y))
    ];
  }

  addAgent(agent: Agent) {
    [agent.x, agent.y] = this.clamp(agent.x, agent.y);
    this.agents.push(agent);
  }

  addFood(x: number, y: number) {
    if (this.food.length >= CONFIG.maxFood) return;
    const [cx, cy] = this.clamp(x, y);
    const food = new Food(cx, cy, CONFIG.foodEnergy);
    food.index = this.food.length;
    this.food.push(food);
    this.foodGrid.insert(food);
  }

  removeFood(food: Food) {
    const last = this.food.pop()!;
    if (last !== food) {
      this.food[food.index] = last;
      last.index = food.index;
    }
    food.index = -1;
    this.foodGrid.remove(food);
  }
}
