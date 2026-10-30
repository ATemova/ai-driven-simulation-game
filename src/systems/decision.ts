import { Agent } from "../engine/agent";
import { CONFIG } from "../engine/config";
import { Food } from "../engine/food";

export type Decision =
  | { type: "seek"; target: Food }
  | { type: "wander" };

export function decide(agent: Agent, nearestFood: Food | null): Decision {
  if (nearestFood && agent.energy < CONFIG.hungerThreshold) {
    return { type: "seek", target: nearestFood };
  }
  return { type: "wander" };
}
