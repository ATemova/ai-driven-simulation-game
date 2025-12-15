import { Agent } from "../engine/agent";
import { Food } from "../engine/food";

export type Decision =
  | { type: "seek"; target: Food }
  | { type: "wander" };

export function decide(agent: Agent, visibleFood: Food[]): Decision {
  if (agent.energy < 60 && visibleFood.length > 0) {
    return { type: "seek", target: visibleFood[0] };
  }
  return { type: "wander" };
}