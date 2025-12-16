import { World } from "./engine/world";
import { Agent } from "./engine/agent";
import { RNG } from "./engine/rng";
import { Food } from "./engine/food";
import { CONFIG } from "./engine/config";
import { tick } from "./engine/simulation";

const world = new World(CONFIG.worldSize, CONFIG.worldSize);
const rng = new RNG(123);

// Initial agents with random traits
for (let i = 0; i < CONFIG.initialAgents; i++) {
  world.addAgent(
    new Agent(
      i,
      rng.range(0, CONFIG.worldSize),
      rng.range(0, CONFIG.worldSize),
      {
        speed: rng.range(0.8, 1.2),
        vision: rng.range(4, 8),
        metabolism: rng.range(0.8, 1.2)
      }
    )
  );
}

// Food
for (let i = 0; i < CONFIG.initialFood; i++) {
  world.addFood(
    new Food(
      rng.range(0, CONFIG.worldSize),
      rng.range(0, CONFIG.worldSize)
    )
  );
}

let tickCount = 0;

setInterval(() => {
  tick(world, rng);
  tickCount++;

  if (tickCount % 100 === 0) {
    const avgSpeed =
      world.agents.reduce((s, a) => s + a.traits.speed, 0) /
      Math.max(1, world.agents.length);

    const avgVision =
      world.agents.reduce((s, a) => s + a.traits.vision, 0) /
      Math.max(1, world.agents.length);

    console.log(
      `Tick ${tickCount} | Pop ${world.agents.length} | AvgSpeed ${avgSpeed.toFixed(
        2
      )} | AvgVision ${avgVision.toFixed(2)}`
    );
  }
}, 50);