import { CONFIG } from "../engine/config";

export function setupEnvironmentControls() {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      // Food availability
      case "f":
        CONFIG.initialFood = Math.max(10, CONFIG.initialFood - 10);
        break;

      case "F":
        CONFIG.initialFood += 10;
        break;

      // Mutation strength
      case "m":
        CONFIG.mutationStrength = Math.max(0, CONFIG.mutationStrength - 0.02);
        break;

      case "M":
        CONFIG.mutationStrength += 0.02;
        break;
    }
  });
}