# 🧬 AI-Driven Simulation Game

An **agent-based artificial life simulation** where autonomous agents move, consume resources, and survive based on simple decision rules — producing **emergent behavior** without scripted outcomes.

This project focuses on **systems design, determinism, and simulation architecture**, rather than graphics or gameplay.

## ✨ Key Concepts

- **Autonomous agents** with energy, vision, and movement
- **Resource-based survival** (food consumption & metabolism)
- **Emergent population dynamics** (no hardcoded behaviors)
- **Deterministic simulation** using a seeded RNG
- **Modular engine architecture** (systems-based design)

> No agents are directly controlled by the player.  
> All behavior emerges from rules + environment.

## 🧠 How It Works (High Level)

Each simulation tick:
1. Agents **perceive** nearby food
2. A **decision system** chooses an action (seek or wander)
3. A **movement system** updates position and energy
4. Agents **consume food**, age, or die
5. Food **respawns** to maintain ecosystem pressure

Over time, stable or unstable population patterns naturally emerge.

## ⚙️ Tech Stack

- **TypeScript**
- **Node.js**
- **ts-node**
- No external game engines
- No graphics (Week 1 is headless by design)

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
- Same seed → same behavior
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
- Population analytics & graphs
- Canvas-based visualization
- Environmental manipulation (climate, scarcity)