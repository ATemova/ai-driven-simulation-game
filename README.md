<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" />
  <img src="https://img.shields.io/badge/Node.js-18+-green" />
  <img src="https://img.shields.io/badge/status-active-success" />
  <img src="https://img.shields.io/badge/license-MIT-orange" />
</p>

# 🧬 AI-Driven Simulation Game

An **agent-based artificial life simulation** where autonomous agents move, consume resources, reproduce, and evolve based on simple decision rules — producing **emergent behavior** without any scripted outcomes.

The project emphasizes **systems design, determinism, simulation architecture, and data-driven visualization**, rather than traditional gameplay mechanics.

## ✨ Key Concepts

- **Autonomous agents** with energy, age, and genetic traits
- **Resource-based survival** (food consumption & metabolism)
- **Reproduction and mutation**
- **Emergent population dynamics** (no hardcoded behaviors)
- **Deterministic simulation** using a seeded RNG
- **Modular engine architecture** (systems-based design)
- **Real-time visualization and metrics**

> No agents are directly controlled by the player.  
> All behavior emerges from rules, environment, and resource pressure.

## 🧠 How It Works (High Level)

Each simulation tick:

1. Agents **perceive** nearby food
2. A **decision system** selects an action (seek or wander)
3. A **movement system** updates position and energy
4. Agents **consume food**, reproduce, age, or die
5. Food **respawns** to maintain ecosystem pressure
6. Metrics are sampled for analysis and visualization

Over time, the system naturally produces:
- population booms and collapses
- trait optimization
- extinction events
- stable or unstable equilibria

## 🧬 Evolution & Genetics (Week 2)

Agents carry inheritable traits:

- **Speed** – affects movement efficiency
- **Vision** – affects food detection radius
- **Metabolism** – affects energy consumption

During reproduction:
- Offspring inherit parental traits
- Small random mutations are applied
- Traits that improve survival become more common

This results in **natural selection** without explicit fitness or scoring functions.

## 🎨 Visualization & Metrics (Week 3)

The simulation includes a **real-time Canvas-based renderer**:

- Agents rendered as moving entities
- Food rendered as resource nodes
- Energy visualized via color brightness
- Live HUD overlay:
  - population size
  - simulation speed
  - paused/running state
  - average trait values

A metrics system collects time-series data:
- population size
- average speed
- average vision
- average metabolism

This enables **data-driven inspection of emergent behavior**.

## ⚙️ Tech Stack

- **TypeScript**
- **Node.js**
- **Vite** (dev server)
- **HTML Canvas**
- No external game engines

## ▶️ Running the Simulation

### Install dependencies
```bash
npm install
```
### Run (development)
```bash
npm run dev
```
## 🔬 Determinism
The simulation uses a seeded random number generator:
- Same seed → same evolution
- Enables debugging, replayability, and analysis
- Essential for correctness in simulations

## 📈 Current Status
- ✅ Week 1 — Core simulation engine
- ✅ Week 2 — Evolution, reproduction, and mutation
- ✅ Week 3 — Real-time visualization, controls, and metrics
- ⏳ Week 4 — Environment controls, graphs, and final polish

## 🚀 Planned Extensions
- Live population & trait graphs
- Environmental manipulation (climate, scarcity)
- Multiple species and predator–prey dynamics
- Save / load and replay support
- Performance optimizations for large populations