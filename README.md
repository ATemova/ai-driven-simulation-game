<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" />
  <img src="https://img.shields.io/badge/Node.js-18+-green" />
  <img src="https://img.shields.io/badge/simulation-deterministic-purple" />
  <img src="https://img.shields.io/badge/model-agent--based-informational" />
  <img src="https://img.shields.io/badge/status-complete-success" />
  <img src="https://img.shields.io/badge/license-MIT-orange" />
</p>

# 🧬 AI-Driven Simulation Game

A **deterministic, agent-based artificial life simulation** where autonomous agents move, consume resources, reproduce, and evolve under environmental pressure—producing **emergent behavior** without scripted logic or fitness functions.

The project focuses on **systems design, simulation architecture, and data-driven visualization**, not traditional gameplay.

## ✨ Key Features

- Autonomous agents with energy, age, and inheritable traits  
- Resource-based survival (food, metabolism)  
- Reproduction with mutation and natural selection  
- Deterministic simulation using a seeded RNG  
- Modular engine and systems-based architecture  
- Real-time Canvas visualization with live metrics  

> No agents are player-controlled.  
> All behavior emerges from rules + environment.

## 🧠 Simulation Loop

Each tick:
1. Agents perceive nearby food  
2. A decision system selects an action  
3. Movement and energy updates occur  
4. Agents eat, reproduce, age, or die  
5. Food respawns to maintain ecosystem pressure  
6. Metrics are sampled for visualization  

This naturally produces population cycles, trait optimization, and extinction events.

## 🎨 Visualization & Metrics

- Agents and food rendered in real time  
- Energy visualized via color and size  
- HUD showing population, speed, and traits  
- Time-series graphs for population and traits 

## ▶️ Run Locally

```bash
npm install
```
```bash
npm run dev
```
## 🎮 Controls

- **Space** — pause / resume
- **1 / 2 / 3** — simulation speed
- **f / F** — food availability
- **m / M** — mutation strength
- **g** — cycle trait graph
- **r / n** — reset (same / new seed)

## 🧩 Design Principles

- Determinism first
- Emergence over scripting
- Strong separation of engine, systems, and UI
- Observability via metrics and visualization

## 🏁 Status
Feature-complete, portfolio-ready artificial life simulation.
