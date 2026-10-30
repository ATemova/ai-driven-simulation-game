import { Agent } from "../engine/agent";
import { RNG } from "../engine/rng";
import { Decision } from "./decision";

export function move(agent: Agent, decision: Decision, rng: RNG) {
  if (decision.type === "wander") {
    const angle = rng.range(0, Math.PI * 2);
    agent.x += Math.cos(angle) * agent.traits.speed;
    agent.y += Math.sin(angle) * agent.traits.speed;
    return;
  }

  const vx = decision.target.x - agent.x;
  const vy = decision.target.y - agent.y;
  const dist = Math.hypot(vx, vy);
  if (dist === 0) return;

  const step = Math.min(agent.traits.speed, dist);
  agent.x += (vx / dist) * step;
  agent.y += (vy / dist) * step;
}
