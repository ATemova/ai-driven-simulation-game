import { Agent } from "../engine/agent";
import { RNG } from "../engine/rng";
import { Decision } from "./decision";

export function move(agent: Agent, decision: Decision, rng: RNG) {
  let dx = 0;
  let dy = 0;

  if (decision.type === "wander") {
    dx = rng.range(-1, 1);
    dy = rng.range(-1, 1);
  } else {
    const vx = decision.target.x - agent.x;
    const vy = decision.target.y - agent.y;
    const len = Math.hypot(vx, vy) || 1;
    dx = vx / len;
    dy = vy / len;
  }

  agent.x += dx * agent.traits.speed;
  agent.y += dy * agent.traits.speed;

  // movement cost scales with metabolism
  agent.energy -= agent.traits.metabolism * 0.1;
}