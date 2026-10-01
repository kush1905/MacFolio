"use client";

import { useWindowStore, isFullscreenWindow } from "@/store/windowStore";
import { WindowFrame } from "./WindowFrame";

export function WindowManager() {
  const windows = useWindowStore((s) => s.windows);
  const fullscreen = windows.some(isFullscreenWindow);

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${
        fullscreen ? "z-[45]" : "z-20"
      }`}
      style={{
        // Hard clip: no window chrome, shadow, or spring overshoot into the menu bar
        clipPath:
          "inset(calc(var(--menu-bar-h) + env(safe-area-inset-top, 0px)) 0 0 0)",
      }}
    >
      {windows
        .filter((w) => !w.minimized)
        .map((win) => (
          <WindowFrame key={win.id} win={win} />
        ))}
    </div>
  );
}
