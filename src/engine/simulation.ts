import { World } from "./world";
import { RNG } from "./rng";
import { Agent, TraitName, Traits } from "./agent";
import { nearestVisibleFood } from "../systems/perception";
import { decide } from "../systems/decision";
import { move } from "../systems/movement";
import { CONFIG } from "./config";

const TRAITS: TraitName[] = ["speed", "vision", "metabolism"];

function mutate(name: TraitName, value: number, world: World, rng: RNG): number {
  const { mutationRate, mutationStrength } = world.settings;
  if (rng.next() >= mutationRate) return value;
  const factor = 1 + rng.range(-mutationStrength, mutationStrength);
  const [min, max] = CONFIG.traitBounds[name];
  return Math.min(max, Math.max(min, value * factor));
}

function reproduce(parent: Agent, world: World, rng: RNG): Agent {
  const traits = {} as Traits;
  for (const name of TRAITS) traits[name] = mutate(name, parent.traits[name], world, rng);

  parent.energy -= CONFIG.reproductionCost;
  parent.reproductionCooldown = CONFIG.reproductionCooldown;

  return new Agent(
    world.nextId++,
    parent.x + rng.range(-1, 1),
    parent.y + rng.range(-1, 1),
    traits,
    CONFIG.reproductionCost,
    parent.generation + 1
  );
}

export function energyDrain(t: Traits): number {
  return (
    CONFIG.baseDrain * t.metabolism * t.metabolism +
    CONFIG.speedCost * t.speed * t.speed +
    CONFIG.visionCost * t.vision
  );
}

export function foodGain(t: Traits, foodEnergy: number): number {
  return foodEnergy * Math.sqrt(t.metabolism);
}

/** Advance the simulation by one fixed step. */
export function tick(world: World, rng: RNG) {
  const newborns: Agent[] = [];

  for (const agent of world.agents) {
    const decision = decide(agent, nearestVisibleFood(agent, world));
    move(agent, decision, rng);
    [agent.x, agent.y] = world.clamp(agent.x, agent.y);

    const food = world.foodGrid.nearest(agent.x, agent.y, CONFIG.eatRadius);
    if (food) {
      agent.energy += foodGain(agent.traits, food.energy);
      world.removeFood(food);
    }

    if (
      agent.energy >= CONFIG.reproductionEnergy &&
      agent.reproductionCooldown <= 0 &&
      world.agents.length + newborns.length < CONFIG.maxAgents
    ) {
      newborns.push(reproduce(agent, world, rng));
    }

    if (agent.reproductionCooldown > 0) agent.reproductionCooldown--;
    agent.energy -= energyDrain(agent.traits);
    agent.age++;
  }

  world.agents = world.agents.filter(a => a.energy > 0 && a.age <= CONFIG.maxAge);
  for (const child of newborns) world.addAgent(child);

  world.foodAccumulator += world.settings.foodPerTick;
  while (world.foodAccumulator >= 1) {
    world.foodAccumulator -= 1;
    world.addFood(rng.range(0, world.width), rng.range(0, world.height));
  }

  world.tickCount++;
}
