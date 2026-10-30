import { Settings } from "../engine/config";
import { SimClock } from "./simClock";

export type GraphMode = "speed" | "vision" | "metabolism";

export interface ControlHandlers {
  clock: SimClock;
  /** Live settings; changes apply to the running world immediately. */
  settings: () => Settings;
  onSettingsChanged: () => void;
  onGraphMode: (mode: GraphMode) => void;
  onReset: () => void;
  onReseed: () => void;
  onDefaults: () => void;
}

const GRAPH_ORDER: GraphMode[] = ["speed", "vision", "metabolism"];

export function setupControls(h: ControlHandlers) {
  let graphIndex = 0;

  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const s = h.settings();

    switch (e.key) {
      case " ":
        e.preventDefault();
        h.clock.paused = !h.clock.paused;
        break;
      case "1": h.clock.speed = 1; break;
      case "2": h.clock.speed = 5; break;
      case "3": h.clock.speed = 20; break;

      case "f":
        s.foodPerTick = Math.max(0, round(s.foodPerTick - 0.25));
        h.onSettingsChanged();
        break;
      case "F":
        s.foodPerTick = Math.min(20, round(s.foodPerTick + 0.25));
        h.onSettingsChanged();
        break;

      case "m":
        s.mutationStrength = Math.max(0, round(s.mutationStrength - 0.02));
        h.onSettingsChanged();
        break;
      case "M":
        s.mutationStrength = Math.min(1, round(s.mutationStrength + 0.02));
        h.onSettingsChanged();
        break;

      case "g":
      case "G":
        graphIndex = (graphIndex + 1) % GRAPH_ORDER.length;
        h.onGraphMode(GRAPH_ORDER[graphIndex]);
        break;

      case "r": h.onReset(); break;
      case "n": h.onReseed(); break;
      case "d": h.onDefaults(); break;
    }
  });
}

function round(v: number) {
  return Math.round(v * 100) / 100;
}
