import { World } from "../engine/world";

export class Metrics {
  population: number[] = [];
  avgSpeed: number[] = [];
  avgVision: number[] = [];
  avgMetabolism: number[] = [];

  maxSamples = 1000;

  sample(world: World) {
    const agents = world.agents;
    const count = agents.length;

    this.population.push(count);

    if (count > 0) {
      this.avgSpeed.push(
        agents.reduce((s, a) => s + a.traits.speed, 0) / count
      );
      this.avgVision.push(
        agents.reduce((s, a) => s + a.traits.vision, 0) / count
      );
      this.avgMetabolism.push(
        agents.reduce((s, a) => s + a.traits.metabolism, 0) / count
      );
    } else {
      this.avgSpeed.push(0);
      this.avgVision.push(0);
      this.avgMetabolism.push(0);
    }
    
    if (this.population.length > this.maxSamples) {
      this.population.shift();
      this.avgSpeed.shift();
      this.avgVision.shift();
      this.avgMetabolism.shift();
    }
  }

  reset() {
  this.population = [];
  this.avgSpeed = [];
  this.avgVision = [];
  this.avgMetabolism = [];
  }
}