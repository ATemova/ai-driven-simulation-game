import { describe, expect, it } from "vitest";
import { CONFIG, DEFAULT_SETTINGS } from "../src/engine/config";
import { createSimulation, stateHash } from "../src/engine/setup";
import { energyDrain, tick } from "../src/engine/simulation";
import { FoodGrid } from "../src/engine/foodGrid";
import { Food } from "../src/engine/food";
import { RNG } from "../src/engine/rng";

function run(seed: number, ticks: number) {
  const sim = createSimulation(seed, { ...DEFAULT_SETTINGS });
  for (let i = 0; i < ticks; i++) tick(sim.world, sim.rng);
  return sim.world;
}

describe("determinism", () => {
  it("same seed produces identical state", () => {
    expect(stateHash(run(42, 3000))).toBe(stateHash(run(42, 3000)));
  });

  it("different seeds diverge", () => {
    expect(stateHash(run(42, 500))).not.toBe(stateHash(run(43, 500)));
  });

  it("agent ids restart per world", () => {
    const a = createSimulation(1, { ...DEFAULT_SETTINGS }).world.agents.map(x => x.id);
    const b = createSimulation(1, { ...DEFAULT_SETTINGS }).world.agents.map(x => x.id);
    expect(a).toEqual(b);
  });

  it("RNG handles seed 0 and stays in [0, 1)", () => {
    const rng = new RNG(0);
    for (let i = 0; i < 10_000; i++) {
      const v = rng.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("invariants", () => {
  it("respects population cap and trait bounds", () => {
    const world = run(7, 4000);
    expect(world.agents.length).toBeLessThanOrEqual(CONFIG.maxAgents);
    for (const a of world.agents) {
      for (const [name, [min, max]] of Object.entries(CONFIG.traitBounds)) {
        const v = a.traits[name as keyof typeof a.traits];
        expect(v).toBeGreaterThanOrEqual(min);
        expect(v).toBeLessThanOrEqual(max);
      }
    }
  });

  it("food list and grid stay in sync", () => {
    const world = run(9, 2000);
    world.food.forEach((f, i) => expect(f.index).toBe(i));
    for (const f of world.food) expect(world.foodGrid.nearest(f.x, f.y, 0)).not.toBeNull();
  });

  it("every trait has an energy cost", () => {
    const base = { speed: 1, vision: 5, metabolism: 1 };
    const d0 = energyDrain(base);
    expect(energyDrain({ ...base, speed: 2 })).toBeGreaterThan(d0);
    expect(energyDrain({ ...base, vision: 10 })).toBeGreaterThan(d0);
    expect(energyDrain({ ...base, metabolism: 2 })).toBeGreaterThan(d0);
  });
});

describe("FoodGrid", () => {
  it("nearest matches brute force", () => {
    const rng = new RNG(5);
    const grid = new FoodGrid(100, 100, 5);
    const all: Food[] = [];
    for (let i = 0; i < 500; i++) {
      const f = new Food(rng.range(0, 100), rng.range(0, 100), 1);
      grid.insert(f);
      all.push(f);
    }
    for (let i = 0; i < 200; i++) {
      const x = rng.range(0, 100), y = rng.range(0, 100), r = rng.range(1, 20);
      let best: Food | null = null, bestD = r;
      for (const f of all) {
        const d = Math.hypot(f.x - x, f.y - y);
        if (d <= bestD) { bestD = d; best = f; }
      }
      const got = grid.nearest(x, y, r);
      expect(got === null).toBe(best === null);
      if (got) expect(Math.hypot(got.x - x, got.y - y)).toBeCloseTo(bestD, 9);
    }
  });
});
