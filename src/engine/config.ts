export const CONFIG = {
  worldSize: 100,

  initialAgents: 20,
  initialFood: 200,
  foodEnergy: 30,
  maxFood: 2000,
  eatRadius: 1,
  gridCellSize: 5,

  hungerThreshold: 120,
  startEnergy: 100,

  reproductionEnergy: 140,
  reproductionCost: 60,
  reproductionCooldown: 200,

  maxAge: 1000,
  maxAgents: 1000,

  // Energy drain per tick:
  //   baseDrain * metabolism^2 + speedCost * speed^2 + visionCost * vision
  // Energy gained per food: foodEnergy * sqrt(metabolism)
  baseDrain: 0.1,
  speedCost: 0.1,
  visionCost: 0.015,

  traitBounds: {
    speed: [0.1, 4],
    vision: [1, 40],
    metabolism: [0.2, 3]
  } as const
};

export interface Settings {
  foodPerTick: number;
  mutationRate: number;
  mutationStrength: number;
}

export const DEFAULT_SETTINGS: Readonly<Settings> = Object.freeze({
  foodPerTick: 3,
  mutationRate: 0.5,
  mutationStrength: 0.15
});
