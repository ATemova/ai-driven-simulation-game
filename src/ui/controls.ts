import { SimClock } from "./simClock";

export function setupControls(clock: SimClock) {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case " ":
        clock.paused = !clock.paused;
        console.log(clock.paused ? "Paused" : "Running");
        break;

      case "1":
        clock.speed = 1;
        console.log("Speed x1");
        break;

      case "2":
        clock.speed = 5;
        console.log("Speed x5");
        break;

      case "3":
        clock.speed = 20;
        console.log("Speed x20");
        break;
    }
  });
}