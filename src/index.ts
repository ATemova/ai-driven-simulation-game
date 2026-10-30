import { DEFAULT_SETTINGS, Settings } from "./engine/config";
import { tick } from "./engine/simulation";
import { createSimulation, SimState } from "./engine/setup";
import { Renderer } from "./ui/renderer";
import { SimClock } from "./ui/simClock";
import { Metrics } from "./ui/metrics";
import { GraphMode, setupControls } from "./ui/controls";

const canvas = document.getElementById("sim") as HTMLCanvasElement;

function seedFromUrl(): number {
  const raw = new URLSearchParams(location.search).get("seed");
  const n = raw === null ? NaN : Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 123;
}

function writeSeedToUrl(seed: number) {
  const url = new URL(location.href);
  url.searchParams.set("seed", String(seed));
  history.replaceState(null, "", url);
}

let settings: Settings = { ...DEFAULT_SETTINGS };
let sim: SimState = createSimulation(seedFromUrl(), settings);
let graphMode: GraphMode = "speed";

const metrics = new Metrics();
const clock = new SimClock();
const renderer = new Renderer(canvas, sim.world);

function restart(seed: number) {
  sim = createSimulation(seed, settings);
  metrics.reset();
  clock.resetAccumulator();
  renderer.setWorld(sim.world);
  writeSeedToUrl(seed);
  metrics.sample(sim.world);
}

window.addEventListener("resize", () => renderer.resize());

setupControls({
  clock,
  settings: () => settings,
  onSettingsChanged: () => Object.assign(sim.world.settings, settings),
  onGraphMode: (mode) => { graphMode = mode; },
  onReset: () => restart(sim.seed),
  onReseed: () => restart(1 + Math.floor(Math.random() * 999_999)),
  onDefaults: () => {
    settings = { ...DEFAULT_SETTINGS };
    restart(sim.seed);
  }
});

metrics.sample(sim.world);

let lastTime = performance.now();

function loop(now: number) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  clock.update(dt, () => {
    tick(sim.world, sim.rng);
    metrics.maybeSample(sim.world);
  });

  renderer.render(metrics, {
    seed: sim.seed,
    speed: clock.speed,
    paused: clock.paused,
    graphMode
  });

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
