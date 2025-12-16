import { World } from "./world";
import { RNG } from "./rng";
import { Food } from "./food";
import { Agent, Traits } from "./agent";
import { perceiveFood } from "../systems/perception";
import { decide } from "../systems/decision";
import { move } from "../systems/movement";
import { CONFIG } from "./config";

let NEXT_ID = 1000;

function mutate(value: number, rng: RNG) {
  const factor = 1 + rng.range(-CONFIG.mutationStrength, CONFIG.mutationStrength);
  return Math.max(0.1, value * factor);
}

function reproduce(parent: Agent, rng: RNG): Agent {
  const t = parent.traits;

  const childTraits: Traits = {
    speed: mutate(t.speed, rng),
    vision: mutate(t.vision, rng),
    metabolism: mutate(t.metabolism, rng)
  };

  parent.energy -= CONFIG.reproductionCost;
  parent.reproductionCooldown = CONFIG.reproductionCooldown;

  return new Agent(
    NEXT_ID++,
    parent.x + rng.range(-1, 1),
    parent.y + rng.range(-1, 1),
    childTraits,
    parent.generation + 1
  );
}

export function tick(world: World, rng: RNG) {
  const newborns: Agent[] = [];

  for (let i = world.agents.length - 1; i >= 0; i--) {
    const agent = world.agents[i];

    const visibleFood = perceiveFood(agent, world.food);
    const decision = decide(agent, visibleFood);

    move(agent, decision, rng);
    world.clampPosition(agent);

    // Eat
    for (let j = world.food.length - 1; j >= 0; j--) {
      const food = world.food[j];
      if (Math.hypot(food.x - agent.x, food.y - agent.y) < 1) {
        agent.energy += food.energy;
        world.food.splice(j, 1);
        break;
      }
    }

    // Reproduction
    if (
      agent.energy >= CONFIG.reproductionEnergy &&
      agent.reproductionCooldown <= 0
    ) {
      newborns.push(reproduce(agent, rng));
    }

    agent.reproductionCooldown--;
    agent.energy -= 0.05;
    agent.age++;

    // Death
    if (agent.energy <= 0 || agent.age > CONFIG.maxAge) {
      world.agents.splice(i, 1);
    }
  }

  // Add newborns
  for (const child of newborns) {
    world.addAgent(child);
  }

  // Respawn food
  if (world.food.length < CONFIG.initialFood) {
    world.addFood(
      new Food(
        rng.range(0, world.width),
        rng.range(0, world.height)
      )
    );
  }
}