import { SimClock } from "./simClock";

export function setupControls(clock: SimClock) {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case " ":
        clock.paused = !clock.paused;
        break;

      case "1":
        clock.speed = 1;
        break;

      case "2":
        clock.speed = 5;
        break;

      case "3":
        clock.speed = 20;
        break;
    }
  });
}