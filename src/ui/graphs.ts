export class Graphs {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private x: number,
    private y: number,
    private width: number,
    private height: number
  ) {}

  frame(label: string) {
    const ctx = this.ctx;

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "#cbd5f5";
    ctx.font = "12px monospace";
    ctx.fillText(label, this.x + 6, this.y - 6);
  }

  drawGrid(lines = 4) {
    const ctx = this.ctx;

    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.lineWidth = 1;

    for (let i = 1; i < lines; i++) {
      const y = this.y + (i / lines) * this.height;
      ctx.beginPath();
      ctx.moveTo(this.x, y);
      ctx.lineTo(this.x + this.width, y);
      ctx.stroke();
    }
  }

  drawLine(data: number[], color: string, maxValue?: number) {
    if (data.length < 2) return;

    const ctx = this.ctx;
    const max = maxValue ?? Math.max(...data, 1);

    ctx.strokeStyle = color;      
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 1;          

    ctx.beginPath();

    data.forEach((value, i) => {
      const px = this.x + (i / (data.length - 1)) * this.width;
      const py =
        this.y + this.height - (value / max) * this.height;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });

    ctx.stroke();
    ctx.globalAlpha = 1;          // reset (safe for other drawing)
  }
}