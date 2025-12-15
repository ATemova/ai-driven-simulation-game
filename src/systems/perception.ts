import { Agent } from "../engine/agent";
import { Food } from "../engine/food";

export function perceiveFood(agent: Agent, food: Food[]) {
  return food.filter(f =>
    Math.hypot(f.x - agent.x, f.y - agent.y) <= agent.vision
  );
}