import { Agent } from "../engine/agent";
import { Food } from "../engine/food";
import { World } from "../engine/world";

export function nearestVisibleFood(agent: Agent, world: World): Food | null {
  return world.foodGrid.nearest(agent.x, agent.y, agent.traits.vision);
}
