export class Graph {
  constructor(
    private ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  draw(label: string, data: number[], color: string, opts: { zeroBased?: boolean; digits?: number } = {}) {
    const ctx = this.ctx;
    const digits = opts.digits ?? 2;

    ctx.fillStyle = "#020617";
    ctx.fillRect(this.x - 2, this.y - 22, this.width + 4, 20);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.width - 1, this.height - 1);

    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    for (let i = 1; i < 4; i++) {
      const gy = Math.round(this.y + (i / 4) * this.height) + 0.5;
      ctx.beginPath();
      ctx.moveTo(this.x, gy);
      ctx.lineTo(this.x + this.width, gy);
      ctx.stroke();
    }

    const last = data.length ? data[data.length - 1] : undefined;
    ctx.font = "12px monospace";
    ctx.fillStyle = "#cbd5e1";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(label, this.x, this.y - 6);
    if (last !== undefined) {
      const text = last.toFixed(digits);
      ctx.fillStyle = color;
      ctx.fillText(text, this.x + this.width - ctx.measureText(text).width, this.y - 6);
    }

    if (data.length < 2) return;

    let min = Infinity, max = -Infinity;
    for (const v of data) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (opts.zeroBased) min = 0;
    if (max - min < 1e-9) { max += 0.5; min -= 0.5; }
    const pad = (max - min) * 0.08;
    min -= opts.zeroBased ? 0 : pad;
    max += pad;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const px = this.x + (i / (data.length - 1)) * this.width;
      const py = this.y + this.height - ((data[i] - min) / (max - min)) * this.height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.font = "10px monospace";
    const labels: [string, number][] = [
      [max.toFixed(digits), this.y + 12],
      [min.toFixed(digits), this.y + this.height - 4]
    ];
    for (const [text, ty] of labels) {
      const w = ctx.measureText(text).width;
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.fillRect(this.x + 2, ty - 10, w + 4, 13);
      ctx.fillStyle = "#64748b";
      ctx.fillText(text, this.x + 4, ty);
    }
  }
}
