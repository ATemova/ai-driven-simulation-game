import { Food } from "./food";

/** Uniform spatial hash for fast nearest-food queries. */
export class FoodGrid {
  private readonly cells: Food[][];
  private readonly cols: number;
  private readonly rows: number;

  constructor(width: number, height: number, private readonly cellSize: number) {
    this.cols = Math.floor(width / cellSize) + 1;
    this.rows = Math.floor(height / cellSize) + 1;
    this.cells = Array.from({ length: this.cols * this.rows }, () => []);
  }

  private col(x: number) {
    return Math.min(this.cols - 1, Math.max(0, Math.floor(x / this.cellSize)));
  }

  private row(y: number) {
    return Math.min(this.rows - 1, Math.max(0, Math.floor(y / this.cellSize)));
  }

  insert(food: Food) {
    const cell = this.row(food.y) * this.cols + this.col(food.x);
    const bucket = this.cells[cell];
    food.cell = cell;
    food.slot = bucket.length;
    bucket.push(food);
  }

  remove(food: Food) {
    const bucket = this.cells[food.cell];
    const last = bucket.pop()!;
    if (last !== food) {
      bucket[food.slot] = last;
      last.slot = food.slot;
    }
    food.cell = -1;
    food.slot = -1;
  }

  /** Nearest food within `radius` of (x, y), or null. */
  nearest(x: number, y: number, radius: number): Food | null {
    const c0 = this.col(x - radius);
    const c1 = this.col(x + radius);
    const r0 = this.row(y - radius);
    const r1 = this.row(y + radius);

    let best: Food | null = null;
    let bestD2 = radius * radius;

    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        for (const f of this.cells[r * this.cols + c]) {
          const dx = f.x - x;
          const dy = f.y - y;
          const d2 = dx * dx + dy * dy;
          if (d2 <= bestD2) {
            bestD2 = d2;
            best = f;
          }
        }
      }
    }
    return best;
  }
}
