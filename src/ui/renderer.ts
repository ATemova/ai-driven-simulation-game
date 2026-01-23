import { World } from "../engine/world";
import { Agent } from "../engine/agent";
import { Food } from "../engine/food";
import { Graphs } from "./graphs";
import { CONFIG } from "../engine/config";
import { graphMode } from "./environmentControls";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private scale: number;

  private popGraph: Graphs;
  private traitGraph: Graphs;

  constructor(
    private canvas: HTMLCanvasElement,
    private world: World
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D context");
    }

    this.ctx = ctx;
    this.scale = canvas.width / world.width;

    this.popGraph = new Graphs(
      this.ctx, this.canvas.width - 260, 20, 240, 100
    );

    this.traitGraph = new Graphs(
      this.ctx, this.canvas.width - 260, 140, 240, 100
    );
  }

  clear() {
    // Slight fade for motion trails
    this.ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawFood(food: Food) {
    const x = food.x * this.scale;
    const y = food.y * this.scale;

    // Glow
    this.ctx.beginPath();
    this.ctx.arc(x, y, 4, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(34, 197, 94, 0.25)";
    this.ctx.fill();

    // Core
    this.ctx.beginPath();
    this.ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    this.ctx.fillStyle = "#22c55e";
    this.ctx.fill();
  }

  drawAgent(agent: Agent) {
    const energyRatio = Math.min(agent.energy / 150, 1);
    const radius = 3 + energyRatio * 2;

    const r = Math.floor(180 + energyRatio * 60);
    const g = Math.floor(60 + energyRatio * 40);
    const b = 60;

    this.ctx.beginPath();
    this.ctx.arc(agent.x * this.scale, agent.y * this.scale, radius, 0, Math.PI * 2);

    this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    this.ctx.fill();

    this.ctx.strokeStyle = "rgba(0,0,0,0.3)";
    this.ctx.lineWidth = 0.5;
    this.ctx.stroke();
  }

  /* Main render entry point */
  render(speed: number, paused: boolean, avgSpeed?: number, avgVision?: number, populationHistory?: number[], avgSpeedHistory?: number[], avgVisionHistory?: number[], avgMetabolismHistory?: number[]) {
    if (paused) {
      this.clear();
      this.drawOverlay(this.world.agents.length, speed, paused, avgSpeed, avgVision);
      return;
    }

    this.clear();

    for (const food of this.world.food) this.drawFood(food);
    for (const agent of this.world.agents) this.drawAgent(agent);

    this.drawOverlay(this.world.agents.length, speed, paused, avgSpeed, avgVision);

    // 📈 Population graph
    if (populationHistory) {
      this.popGraph.frame("Population");
      this.popGraph.drawGrid();
      this.popGraph.drawLine(populationHistory, "#38bdf8");
    }

    // 🧬 Trait graph
    let label = "";
    let data: number[] | undefined;
    let color = "#fbbf24";

    if (graphMode === "speed") {
      label = "Avg Speed";
      data = avgSpeedHistory;
    } else if (graphMode === "vision") {
      label = "Avg Vision";
      data = avgVisionHistory;
      color = "#a78bfa";
    } else {
      label = "Avg Metabolism";
      data = avgMetabolismHistory;
      color = "#fb7185";
    }

    if (data) {
      this.traitGraph.frame(label);
      this.traitGraph.drawGrid();
      this.traitGraph.drawLine(data, color);
    }
  }

  /* HUD overlay */
  drawOverlay(population: number, speed: number, paused: boolean, avgSpeed?: number, avgVision?: number) {
    this.ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
    this.ctx.fillRect(6, 6, 180, 160);

    this.ctx.fillStyle = "#e5e7eb";
    this.ctx.font = "14px monospace";

    let y = 24;
    const line = 16;

    this.ctx.fillText(`Pop: ${population}`, 12, y); y += line;
    this.ctx.fillText(`Speed: x${speed}`, 12, y); y += line;
    this.ctx.fillText(paused ? "Paused" : "Running", 12, y); y += line;

    if (avgSpeed !== undefined) {
      this.ctx.fillText(`AvgSpeed: ${avgSpeed.toFixed(2)}`, 12, y);
      y += line;
    }

    if (avgVision !== undefined) {
      this.ctx.fillText(`AvgVision: ${avgVision.toFixed(2)}`, 12, y);
      y += line;
    }

    this.ctx.fillText(`Food: ${CONFIG.initialFood}`, 12, y); y += line;
    this.ctx.fillText(
      `Mutation: ${CONFIG.mutationStrength.toFixed(2)}`,
      12,
      y
    );
  }
}