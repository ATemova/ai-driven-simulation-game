<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" />
  <img src="https://img.shields.io/badge/Node.js-18+-green" />
  <img src="https://img.shields.io/badge/status-active-success" />
  <img src="https://img.shields.io/badge/license-MIT-orange" />
</p>

# 🧬 AI-Driven Simulation Game

An **agent-based artificial life simulation** where autonomous agents move, consume resources, reproduce, and evolve based on simple decision rules — producing **emergent behavior** without any scripted outcomes.

This project focuses on **systems design, determinism, and simulation architecture**, rather than graphics or traditional gameplay.

---

## ✨ Key Concepts

- **Autonomous agents** with energy, age, and genetic traits
- **Resource-based survival** (food consumption & metabolism)
- **Reproduction and mutation**
- **Emergent population dynamics** (no hardcoded behaviors)
- **Deterministic simulation** using a seeded RNG
- **Modular engine architecture** (systems-based design)

> No agents are directly controlled by the player.  
> All behavior emerges from rules + environment + resource pressure.

---

## 🧠 How It Works (High Level)

Each simulation tick:

1. Agents **perceive** nearby food
2. A **decision system** chooses an action (seek or wander)
3. A **movement system** updates position and energy
4. Agents **consume food**, reproduce, age, or die
5. Food **respawns** to maintain ecosystem pressure

Over time, the system naturally produces:
- population booms and collapses
- trait optimization
- extinction events
- stable or unstable equilibria

---

## 🧬 Evolution & Genetics (Week 2)

Agents carry inheritable traits:

- **Speed** – affects movement efficiency
- **Vision** – affects food detection radius
- **Metabolism** – affects energy consumption

When reproducing:
- Offspring inherit parental traits
- Small random mutations are applied
- Successful traits spread through the population

This creates **natural selection** without explicit fitness functions.

---

## ⚙️ Tech Stack

- **TypeScript**
- **Node.js**
- **ts-node**
- No external game engines
- Headless simulation (visualization planned for later)

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
- Important for simulation correctness

## 📈 Current Status
- Week 1 — Complete
- Core simulation engine
- Energy-based survival
- Food spawning & consumption
- Deterministic behavior
- Stable ecosystem equilibrium

## 🚀 Planned Extensions
- Reproduction & mutation
- Trait inheritance (evolution)
- Live population & trait graphs
- Canvas-based visualization
- Environmental manipulation (climate, scarcity)
- Multiple species and predator–prey dynamics
- Save / load and replay support