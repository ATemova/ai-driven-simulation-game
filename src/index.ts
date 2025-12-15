import { World } from "./engine/world";
import { Agent } from "./engine/agent";
import { RNG } from "./engine/rng";
import { Food } from "./engine/food";
import { CONFIG } from "./engine/config";
import { tick } from "./engine/simulation";

const world = new World(CONFIG.worldSize, CONFIG.worldSize);
const rng = new RNG(123);

for (let i = 0; i < CONFIG.initialAgents; i++) {
  world.addAgent(
    new Agent(i, rng.range(0, CONFIG.worldSize), rng.range(0, CONFIG.worldSize))
  );
}

for (let i = 0; i < CONFIG.initialFood; i++) {
  world.addFood(
    new Food(rng.range(0, CONFIG.worldSize), rng.range(0, CONFIG.worldSize))
  );
}

setInterval(() => {
  tick(world, rng);
  console.log("Agents:", world.agents.length);
}, 100);