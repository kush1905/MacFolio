import { create } from "zustand";

/** Chapters of the homepage, in scroll order. Each section carries data-chapter. */
export const CHAPTERS = [
  "signal",
  "system",
  "work",
  "experience",
  "core",
  "ask",
  "next",
  "contact",
] as const;

export type Chapter = (typeof CHAPTERS)[number];

type SceneState = {
  /** Project slug hovered or focused in the HTML list or the 3D scene. */
  hoveredProject: string | null;
  /** Technology slug selected in the engineering core. */
  activeTech: string | null;
  /** Project the camera is approaching right before navigation. */
  approaching: string | null;
  paletteOpen: boolean;
  paletteQuery: string;
  /** Increments on every open so the dialog remounts with fresh state. */
  paletteSession: number;
  /** True once the WebGL scene is running (false for the static fallback). */
  sceneReady: boolean;
  setSceneReady: (ready: boolean) => void;
  setHoveredProject: (slug: string | null) => void;
  setActiveTech: (slug: string | null) => void;
  setApproaching: (slug: string | null) => void;
  openPalette: (query?: string) => void;
  closePalette: () => void;
};

export const useSceneStore = create<SceneState>((set) => ({
  hoveredProject: null,
  activeTech: null,
  approaching: null,
  paletteOpen: false,
  paletteQuery: "",
  paletteSession: 0,
  sceneReady: false,
  setSceneReady: (sceneReady) => set({ sceneReady }),
  setHoveredProject: (hoveredProject) => set({ hoveredProject }),
  setActiveTech: (activeTech) => set({ activeTech }),
  setApproaching: (approaching) => set({ approaching }),
  openPalette: (paletteQuery = "") =>
    set((state) => ({ paletteOpen: true, paletteQuery, paletteSession: state.paletteSession + 1 })),
  closePalette: () => set({ paletteOpen: false }),
}));

/**
 * Scroll position as a continuous chapter index (1.5 = halfway through "system").
 * Written by ScrollTrigger, read every frame by the camera rig — kept out of React
 * state so scrolling never re-renders the page.
 */
export const scrollState = { chapter: 0, velocity: 0 };
