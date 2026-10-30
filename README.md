<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" />
  <img src="https://img.shields.io/badge/simulation-deterministic-purple" />
  <img src="https://img.shields.io/badge/model-agent--based-informational" />
  <img src="https://img.shields.io/badge/license-MIT-orange" />
</p>

# 🧬 AI-Driven Simulation Game

A **deterministic, agent-based artificial life simulation**. Agents forage, spend energy, reproduce with mutation, and die. Their traits evolve toward whatever the current environment rewards. No fitness function is coded in.

**▶ Live demo:** https://atemova.github.io/ai-driven-simulation-game/

> The "AI" here is emergent, not learned: each agent follows the same simple rules (seek the nearest visible food when hungry, otherwise wander). Adaptation happens at the population level through selection on inherited traits.

## How it works

Every agent carries three heritable traits, each with a benefit and a cost:

| Trait | Benefit | Cost per tick |
|---|---|---|
| **speed** | reaches food first | `0.1 · speed²` |
| **vision** | detects food from farther away | `0.015 · vision` |
| **metabolism** | extracts more energy from food (`30 · √metabolism`) | `0.1 · metabolism²` |

Because every trait carries both a benefit and a cost, selection settles on interior optima instead of drifting to the bounds. Those optima depend on the environment: scarce food favours larger vision and higher speed, while abundant food supports larger populations with cheaper bodies.

Energy is conserved through reproduction: the parent pays 60 energy, and the child starts with exactly that amount.

### Tick order

1. Each agent finds the nearest food within its vision (spatial grid lookup).
2. If its energy is below the hunger threshold it moves toward that food; otherwise it wanders.
3. It eats any food within reach.
4. If its energy and cooldown allow, it reproduces. Each trait mutates with probability *p* by up to ±strength.
5. It pays its energy drain and ages.
6. Agents that are starved or past maximum age are removed, newborns are added, and food respawns at the configured rate.

### Determinism

All randomness goes through a seeded Park–Miller RNG, and the simulation runs on a fixed timestep regardless of frame rate. A given **seed plus settings** always produces the same run, and a test checks this by hashing the full world state. The seed is stored in the URL (`?seed=123`), so a run can be shared.

## Controls

| Key | Action |
|---|---|
| `Space` | pause / resume |
| `1` `2` `3` | simulation speed ×1 / ×5 / ×20 |
| `f` / `F` | food respawn rate − / + (applies immediately) |
| `m` / `M` | mutation strength − / + |
| `g` | cycle trait graph (speed → vision → metabolism) |
| `r` | restart with the same seed and current settings |
| `n` | restart with a new random seed |
| `d` | restore default settings and restart |

## Run locally

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

## Project structure

```
src/
  engine/   world, agents, food, spatial grid, RNG, config, tick loop
  systems/  perception, decision, movement
  ui/       renderer, graphs, metrics, controls, fixed-step clock
tests/      determinism + invariant tests (Vitest)
```

The engine has no DOM dependencies and runs headless, which is how the tests and parameter tuning work.

## License

MIT
