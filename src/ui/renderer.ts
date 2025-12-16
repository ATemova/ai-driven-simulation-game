import { World } from "../engine/world";
import { Agent } from "../engine/agent";
import { Food } from "../engine/food";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private scale: number;

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
  }

  clear() {
    this.ctx.fillStyle = "#0f172a";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawFood(food: Food) {
    this.ctx.fillStyle = "#22c55e";
    this.ctx.beginPath();
    this.ctx.arc(
      food.x * this.scale,
      food.y * this.scale,
      2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  drawAgent(agent: Agent) {
    const energyRatio = Math.min(agent.energy / 150, 1);
    const brightness = Math.floor(100 + energyRatio * 155);

    this.ctx.fillStyle = `rgb(${brightness}, 80, 80)`;
    this.ctx.beginPath();
    this.ctx.arc(
      agent.x * this.scale,
      agent.y * this.scale,
      4,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  /** Main render entry point */
  render(
    speed: number,
    paused: boolean,
    avgSpeed?: number,
    avgVision?: number
  ) {
    this.clear();

    for (const food of this.world.food) {
      this.drawFood(food);
    }

    for (const agent of this.world.agents) {
      this.drawAgent(agent);
    }

    this.drawOverlay(
      this.world.agents.length,
      speed,
      paused,
      avgSpeed,
      avgVision
    );
  }

  /** HUD overlay */
  drawOverlay(
    population: number,
    speed: number,
    paused: boolean,
    avgSpeed?: number,
    avgVision?: number
  ) {
    this.ctx.fillStyle = "#e5e7eb";
    this.ctx.font = "14px monospace";

    let y = 20;
    this.ctx.fillText(`Pop: ${population}`, 12, y); y += 16;
    this.ctx.fillText(`Speed: x${speed}`, 12, y); y += 16;
    this.ctx.fillText(paused ? "Paused" : "Running", 12, y); y += 16;

    if (avgSpeed !== undefined) {
      this.ctx.fillText(`AvgSpeed: ${avgSpeed.toFixed(2)}`, 12, y);
      y += 16;
    }

    if (avgVision !== undefined) {
      this.ctx.fillText(`AvgVision: ${avgVision.toFixed(2)}`, 12, y);
    }
  }
}