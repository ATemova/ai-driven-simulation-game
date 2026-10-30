import { Agent } from "./agent";
import { CONFIG, Settings } from "./config";
import { RNG } from "./rng";
import { World } from "./world";

export interface SimState {
  world: World;
  rng: RNG;
  seed: number;
}

/** Build a fresh world. Same (seed, settings) always yields the same run. */
export function createSimulation(seed: number, settings: Settings): SimState {
  const rng = new RNG(seed);
  const world = new World(CONFIG.worldSize, CONFIG.worldSize, { ...settings });

  for (let i = 0; i < CONFIG.initialAgents; i++) {
    world.addAgent(
      new Agent(
        world.nextId++,
        rng.range(0, CONFIG.worldSize),
        rng.range(0, CONFIG.worldSize),
        {
          speed: rng.range(0.8, 1.2),
          vision: rng.range(4, 8),
          metabolism: rng.range(0.8, 1.2)
        },
        CONFIG.startEnergy
      )
    );
  }

  for (let i = 0; i < CONFIG.initialFood; i++) {
    world.addFood(rng.range(0, CONFIG.worldSize), rng.range(0, CONFIG.worldSize));
  }

  return { world, rng, seed };
}

/** Order-sensitive hash of the full simulation state, for determinism checks. */
export function stateHash(world: World): string {
  let h = 2166136261;
  const mix = (n: number) => {
    const s = n.toFixed(6);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
  };
  mix(world.tickCount);
  for (const a of world.agents) {
    mix(a.id); mix(a.x); mix(a.y); mix(a.energy); mix(a.age);
    mix(a.traits.speed); mix(a.traits.vision); mix(a.traits.metabolism);
  }
  for (const f of world.food) {
    mix(f.x); mix(f.y);
  }
  return (h >>> 0).toString(16);
}
