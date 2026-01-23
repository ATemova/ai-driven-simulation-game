import { CONFIG } from "../engine/config";

/** Which trait graph is currently shown */
export type GraphMode = "speed" | "vision" | "metabolism";
export let graphMode: GraphMode = "speed";

/** Environment + graph controls */
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

      // Graph mode toggle
      case "g":
      case "G":
        graphMode =
          graphMode === "speed"
            ? "vision"
            : graphMode === "vision"
            ? "metabolism"
            : "speed";
        break;
    }
  });
}

/** Reset & reseed controls */
export function setupResetControls(
  reset: () => void,
  reseed: () => void
) {
  window.addEventListener("keydown", (e) => {
    if (e.key === "r") {
      reset(); // reset with same seed
    }

    if (e.key === "n") {
      reseed(); // reset with new seed
    }
  });
}   