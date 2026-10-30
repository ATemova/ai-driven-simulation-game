import { World } from "../engine/world";
import { Agent } from "../engine/agent";
import { CONFIG } from "../engine/config";
import { Graph } from "./graphs";
import { Metrics } from "./metrics";
import { GraphMode } from "./controls";

export interface HudState {
  seed: number;
  speed: number;
  paused: boolean;
  graphMode: GraphMode;
}

const BG = "#020617";

const TRAIT_GRAPHS: Record<GraphMode, { label: string; color: string; key: keyof Metrics }> = {
  speed: { label: "Avg speed", color: "#fbbf24", key: "avgSpeed" },
  vision: { label: "Avg vision", color: "#a78bfa", key: "avgVision" },
  metabolism: { label: "Avg metabolism", color: "#fb7185", key: "avgMetabolism" }
};

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private cssWidth = 0;
  private cssHeight = 0;
  private scale = 1;
  private offsetX = 0;
  private offsetY = 0;
  private popGraph: Graph;
  private traitGraph: Graph;

  constructor(private canvas: HTMLCanvasElement, private world: World) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    this.ctx = ctx;
    this.popGraph = new Graph(ctx, 0, 0, 0, 0);
    this.traitGraph = new Graph(ctx, 0, 0, 0, 0);
    this.resize();
  }

  setWorld(world: World) {
    this.world = world;
    this.resize();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.cssWidth = window.innerWidth;
    this.cssHeight = window.innerHeight;
    this.canvas.width = Math.round(this.cssWidth * dpr);
    this.canvas.height = Math.round(this.cssHeight * dpr);
    this.canvas.style.width = `${this.cssWidth}px`;
    this.canvas.style.height = `${this.cssHeight}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const margin = 12;
    const sideGutter = 260;
    const topBand = this.cssWidth - sideGutter * 2 < this.cssHeight * 0.75 ? 250 : 0;
    const availW = this.cssWidth - (topBand ? 0 : sideGutter * 2) - margin * 2;
    const availH = this.cssHeight - topBand - margin * 2;
    const side = Math.max(1, Math.min(availW, availH));
    this.scale = side / Math.max(this.world.width, this.world.height);
    this.offsetX = (this.cssWidth - this.world.width * this.scale) / 2;
    this.offsetY = topBand + (this.cssHeight - topBand - this.world.height * this.scale) / 2;

    const gw = Math.min(240, this.cssWidth * 0.4);
    const gx = this.cssWidth - gw - 16;
    this.popGraph.x = gx; this.popGraph.y = 30; this.popGraph.width = gw; this.popGraph.height = 90;
    this.traitGraph.x = gx; this.traitGraph.y = 150; this.traitGraph.width = gw; this.traitGraph.height = 90;

    this.ctx.fillStyle = BG;
    this.ctx.fillRect(0, 0, this.cssWidth, this.cssHeight);
  }

  render(metrics: Metrics, hud: HudState) {
    const ctx = this.ctx;

    ctx.fillStyle = hud.paused ? BG : "rgba(2, 6, 23, 0.35)";
    ctx.fillRect(0, 0, this.cssWidth, this.cssHeight);

    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      this.offsetX, this.offsetY,
      this.world.width * this.scale, this.world.height * this.scale
    );

    this.drawFood();
    for (const agent of this.world.agents) this.drawAgent(agent);

    this.drawHud(metrics, hud);

    this.popGraph.draw("Population", metrics.population, "#38bdf8", { zeroBased: true, digits: 0 });
    const tg = TRAIT_GRAPHS[hud.graphMode];
    this.traitGraph.draw(`${tg.label} (g)`, metrics[tg.key] as number[], tg.color);
  }

  private drawFood() {
    const ctx = this.ctx;
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    for (const f of this.world.food) {
      const x = this.offsetX + f.x * this.scale;
      const y = this.offsetY + f.y * this.scale;
      ctx.moveTo(x + 2.2, y);
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  private drawAgent(agent: Agent) {
    const ctx = this.ctx;
    const e = Math.min(Math.max(agent.energy / CONFIG.reproductionEnergy, 0), 1);
    const radius = 2.5 + e * 2.5;

    ctx.beginPath();
    ctx.arc(this.offsetX + agent.x * this.scale, this.offsetY + agent.y * this.scale, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${Math.floor(180 + e * 70)}, ${Math.floor(60 + e * 60)}, 60)`;
    ctx.fill();
  }

  private drawHud(m: Metrics, hud: HudState) {
    const ctx = this.ctx;
    const s = this.world.settings;
    const lines = [
      `${hud.paused ? "PAUSED" : "Running"}  x${hud.speed}`,
      `Tick:  ${this.world.tickCount}`,
      `Seed:  ${hud.seed}`,
      `Pop:   ${this.world.agents.length}`,
      `Gen:   ${m.maxGeneration}`,
      `Food:  ${this.world.food.length}  (+${s.foodPerTick}/tick)`,
      `Mut:   ${(s.mutationStrength * 100).toFixed(0)}% @ p=${s.mutationRate}`,
      "",
      "space pause  1/2/3 speed",
      "f/F food  m/M mutation",
      "g graph  r reset  n new seed",
      "d defaults"
    ];

    const lh = 16;
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    ctx.fillRect(8, 8, 232, lines.length * lh + 12);
    ctx.font = "13px monospace";
    ctx.textBaseline = "alphabetic";
    lines.forEach((text, i) => {
      ctx.fillStyle = i >= 8 ? "#64748b" : "#e5e7eb";
      ctx.fillText(text, 16, 26 + i * lh);
    });
  }
}
