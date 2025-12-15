import { World } from "./world";
import { RNG } from "./rng";
import { Food } from "./food";
import { perceiveFood } from "../systems/perception";
import { decide } from "../systems/decision";
import { move } from "../systems/movement";

export function tick(world: World, rng: RNG) {
  for (let i = world.agents.length - 1; i >= 0; i--) {
    const agent = world.agents[i];

    const visibleFood = perceiveFood(agent, world.food);
    const decision = decide(agent, visibleFood);

    move(agent, decision, rng);
    world.clampPosition(agent);

    for (let j = world.food.length - 1; j >= 0; j--) {
      const food = world.food[j];
      if (Math.hypot(food.x - agent.x, food.y - agent.y) < 1) {
        agent.energy += food.energy;
        world.food.splice(j, 1);
        break;
      }
    }

    agent.energy -= 0.05;
    agent.age++;

    if (agent.energy <= 0 || agent.age > 500) {
      world.agents.splice(i, 1);
    }
  }

  if (world.food.length < 80) {
    world.addFood(
      new Food(
        rng.range(0, world.width),
        rng.range(0, world.height)
      )
    );
  }
}