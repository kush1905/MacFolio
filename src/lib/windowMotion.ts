/** Locate the dock icon for an app — used by genie minimize / restore. */
export function getDockIconTarget(appId: string): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  if (typeof document === "undefined") {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight - 40,
      width: 48,
      height: 48,
    };
  }

  const el = document.querySelector(
    `[data-dock-app="${appId}"]`,
  ) as HTMLElement | null;

  if (el) {
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2,
      y: r.top + r.height * 0.35,
      width: r.width,
      height: r.height,
    };
  }

  return {
    x: window.innerWidth / 2,
    y: window.innerHeight - 36,
    width: 48,
    height: 48,
  };
}

/** macOS-like spring for window zoom / tile */
export const MAC_WINDOW_SPRING = {
  type: "spring" as const,
  stiffness: 480,
  damping: 38,
  mass: 0.85,
};

/** Full screen / tile — no overshoot so the frame stays flush under the menu bar */
export const MAC_ZOOM_TWEEN = {
  type: "tween" as const,
  duration: 0.28,
  ease: [0.33, 1, 0.68, 1] as const,
};

/** Genie suck curve — accelerate into the dock */
export const MAC_GENIE_EASE = [0.7, 0.0, 0.85, 0.2] as const;
export const MAC_GENIE_EASE_OUT = [0.16, 1, 0.3, 1] as const;
