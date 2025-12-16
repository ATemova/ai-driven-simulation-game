import { World } from "./engine/world";
import { Agent } from "./engine/agent";
import { RNG } from "./engine/rng";
import { Food } from "./engine/food";
import { CONFIG } from "./engine/config";
import { tick } from "./engine/simulation";

import { Renderer } from "./ui/renderer";
import { SimClock } from "./ui/simClock";
import { setupControls } from "./ui/controls";
import { Metrics } from "./ui/metrics";

// Canvas setup
const canvas = document.getElementById("sim") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// World & RNG
const world = new World(CONFIG.worldSize, CONFIG.worldSize);
const rng = new RNG(123);

// Metrics
const metrics = new Metrics();
let sampleCounter = 0;

// Initial agents
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

// Initial food
for (let i = 0; i < CONFIG.initialFood; i++) {
  world.addFood(
    new Food(
      rng.range(0, CONFIG.worldSize),
      rng.range(0, CONFIG.worldSize)
    )
  );
}

// Renderer
const renderer = new Renderer(canvas, world);

// Simulation clock + controls
const clock = new SimClock();
setupControls(clock);

// Main loop timing
let lastTime = performance.now();

function loop(now: number) {
  const deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  clock.update(deltaTime, () => {
    tick(world, rng);

    sampleCounter++;
    if (sampleCounter % 10 === 0) {
      metrics.sample(world);
    }
  });

  // Get latest metrics safely
  const lastIndex = metrics.population.length - 1;
  const avgSpeed =
    lastIndex >= 0 ? metrics.avgSpeed[lastIndex] : undefined;
  const avgVision =
    lastIndex >= 0 ? metrics.avgVision[lastIndex] : undefined;

  renderer.render(clock.speed, clock.paused, avgSpeed, avgVision);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);