import type { DisplayScale, Preferences } from "@/types";

/** Text scale only — never zooms the viewport (that clips the desktop). */
export const DISPLAY_SCALES: {
  id: DisplayScale;
  label: string;
  zoom: number;
  preview: number;
}[] = [
  { id: "larger", label: "Larger Text", zoom: 1.18, preview: 15 },
  { id: "large", label: "Large", zoom: 1.1, preview: 12 },
  { id: "default", label: "Default", zoom: 1, preview: 9 },
  { id: "more-space", label: "More Space", zoom: 0.9, preview: 7 },
];

export function displayZoom(id?: DisplayScale): number {
  return DISPLAY_SCALES.find((s) => s.id === id)?.zoom ?? 1;
}

/** Pointer math stays in CSS pixels; layout is never zoomed. */
export function liveDisplayZoom(): number {
  return 1;
}

export function viewSize() {
  const z = 1;
  if (typeof window === "undefined") return { z, vw: 1440, vh: 900 };
  const stage = document.querySelector("[data-os-stage]") as HTMLElement | null;
  if (stage && stage.clientWidth > 0 && stage.clientHeight > 0) {
    return { z, vw: stage.clientWidth, vh: stage.clientHeight };
  }
  return {
    z,
    vw: window.innerWidth,
    vh: window.innerHeight,
  };
}

export function isSunsetHours(date = new Date()) {
  const hour = date.getHours();
  return hour >= 21 || hour < 6;
}

export function nightShiftActive(prefs: Pick<Preferences, "nightShift" | "nightShiftSunset">) {
  if (prefs.nightShift) return true;
  return prefs.nightShiftSunset && isSunsetHours();
}

export function applyDisplay(prefs: Pick<Preferences, "displayScale">) {
  if (typeof document === "undefined") return;
  const scale = displayZoom(prefs.displayScale);
  const root = document.documentElement;
  root.style.setProperty("--text-scale", String(scale));
  root.style.setProperty("--display-zoom", "1");
  root.setAttribute("data-display-scale", prefs.displayScale ?? "default");
}
