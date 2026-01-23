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
import {
  setupEnvironmentControls,
  setupResetControls
} from "./ui/environmentControls";

// =======================
// Canvas setup
// =======================
const canvas = document.getElementById("sim") as HTMLCanvasElement;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// =======================
// Metrics
// =======================
const metrics = new Metrics();
let sampleCounter = 0;

// =======================
// Simulation state
// =======================
let seed = 123;
let world: World;
let rng: RNG;

// =======================
// World creation
// =======================
function createWorld(): { world: World; rng: RNG } {
  const world = new World(CONFIG.worldSize, CONFIG.worldSize);
  const rng = new RNG(seed);

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

  for (let i = 0; i < CONFIG.initialFood; i++) {
    world.addFood(
      new Food(
        rng.range(0, CONFIG.worldSize),
        rng.range(0, CONFIG.worldSize)
      )
    );
  }

  metrics.reset();
  sampleCounter = 0;

  return { world, rng };
}

// =======================
// Initial world
// =======================
({ world, rng } = createWorld());

// =======================
// Renderer
// =======================
const renderer = new Renderer(canvas, world);

// =======================
// Controls
// =======================
const clock = new SimClock();
setupControls(clock);
setupEnvironmentControls();

setupResetControls(
  () => {
    // Reset with same seed
    ({ world, rng } = createWorld());
  },
  () => {
    // Reset with new seed
    seed = Math.floor(Math.random() * 100000);
    ({ world, rng } = createWorld());
  }
);

// =======================
// Main loop
// =======================
let lastTime = performance.now();

function loop(now: number) {
  const deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  clock.update(deltaTime, () => {
    tick(world, rng);

    sampleCounter++;
    const sampleRate =
      world.agents.length > 500 ? 30 : 10;

    if (sampleCounter % sampleRate === 0) {
      metrics.sample(world);
    }
  });

  const lastIndex = metrics.population.length - 1;
  const avgSpeed =
    lastIndex >= 0 ? metrics.avgSpeed[lastIndex] : undefined;
  const avgVision =
    lastIndex >= 0 ? metrics.avgVision[lastIndex] : undefined;

  renderer.render(
    clock.speed,
    clock.paused,
    avgSpeed,
    avgVision,
    metrics.population,
    metrics.avgSpeed,
    metrics.avgVision,
    metrics.avgMetabolism
  );

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);