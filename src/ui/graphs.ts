export class Graphs {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private x: number,
    private y: number,
    private width: number,
    private height: number
  ) {}

  drawLine(data: number[], color: string, maxValue?: number) {
    if (data.length < 2) return;

    const ctx = this.ctx;
    const max = maxValue ?? Math.max(...data, 1);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, i) => {
      const px = this.x + (i / (data.length - 1)) * this.width;
      const py =
        this.y + this.height - (value / max) * this.height;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });

    ctx.stroke();
  }

  frame(label: string) {
    const ctx = this.ctx;

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "#cbd5f5";
    ctx.font = "12px monospace";
    ctx.fillText(label, this.x + 6, this.y - 6);
  }
}
