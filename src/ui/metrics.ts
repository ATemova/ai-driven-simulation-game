import { World } from "../engine/world";

export class Metrics {
  population: number[] = [];
  avgSpeed: number[] = [];
  avgVision: number[] = [];
  avgMetabolism: number[] = [];
  maxGeneration = 0;

  /** Ticks between samples; doubles whenever the buffer fills so the graph always spans the whole run. */
  interval = 10;
  readonly maxSamples = 600;

  maybeSample(world: World) {
    if (world.tickCount % this.interval === 0) this.sample(world);
  }

  sample(world: World) {
    const agents = world.agents;
    const n = agents.length;

    let speed = 0, vision = 0, metabolism = 0;
    for (const a of agents) {
      speed += a.traits.speed;
      vision += a.traits.vision;
      metabolism += a.traits.metabolism;
      if (a.generation > this.maxGeneration) this.maxGeneration = a.generation;
    }

    this.push(this.population, n);
    this.push(this.avgSpeed, n ? speed / n : 0);
    this.push(this.avgVision, n ? vision / n : 0);
    this.push(this.avgMetabolism, n ? metabolism / n : 0);

    if (this.population.length >= this.maxSamples) this.compact();
  }

  private push(series: number[], value: number) {
    series.push(value);
  }

  private compact() {
    const halve = (a: number[]) => a.filter((_, i) => i % 2 === 0);
    this.population = halve(this.population);
    this.avgSpeed = halve(this.avgSpeed);
    this.avgVision = halve(this.avgVision);
    this.avgMetabolism = halve(this.avgMetabolism);
    this.interval *= 2;
  }

  latest(series: number[]): number | undefined {
    return series.length ? series[series.length - 1] : undefined;
  }

  reset() {
    this.population = [];
    this.avgSpeed = [];
    this.avgVision = [];
    this.avgMetabolism = [];
    this.maxGeneration = 0;
    this.interval = 10;
  }
}
