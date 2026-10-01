import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trackEvent } from "@/lib/api";
import { APPS, clamp, uid } from "@/lib/apps";
import { viewSize } from "@/lib/display";
import type { AppId, TileMode, WindowBounds, WindowState } from "@/types";

/** Fallback menu bar height when the live bar isn’t mounted yet. */
export const MENU_BAR = 25;
const DOCK_CLEARANCE = 80;
const GAP = 6;

/** Live menu bar height (includes safe-area). Windows must stay strictly below this. */
export function menuBarOffset(): number {
  if (typeof document === "undefined") return MENU_BAR;
  const el = document.querySelector("[data-menu-bar]");
  if (el instanceof HTMLElement) {
    const h = el.getBoundingClientRect().height;
    if (h > 0) return Math.ceil(h);
  }
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--menu-bar-h")
    .trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.ceil(parsed) : MENU_BAR;
}

export function clampWindowY(y: number): number {
  return Math.max(menuBarOffset(), y);
}

function defaultBounds(
  appId: AppId,
  existingCount: number,
): WindowBounds {
  const def = APPS[appId].defaultSize;
  const { vw, vh } = viewSize();
  const offset = (existingCount % 8) * 24;
  const width = Math.min(def.width, vw - 80);
  const bar = menuBarOffset();
  const height = Math.min(def.height, vh - bar - DOCK_CLEARANCE - 40);
  return {
    x: Math.round((vw - width) / 2) + offset,
    y: bar + 40 + offset,
    width,
    height,
  };
}

function workArea(): WindowBounds {
  const { vw, vh } = viewSize();
  const bar = menuBarOffset();
  return {
    x: GAP,
    y: bar + GAP,
    width: vw - GAP * 2,
    height: vh - bar - DOCK_CLEARANCE,
  };
}

function maximizedBounds(): WindowBounds {
  const { vw, vh } = viewSize();
  const bar = menuBarOffset();
  return {
    x: 0,
    y: bar,
    width: vw,
    height: Math.max(0, vh - bar),
  };
}

function tileBounds(mode: Exclude<TileMode, null>): WindowBounds {
  const area = workArea();
  if (mode === "maximize" || mode === "fill") {
    return {
      x: area.x,
      y: area.y,
      width: area.width,
      height: area.height,
    };
  }
  const half = Math.floor((area.width - GAP) / 2);
  if (mode === "left") {
    return {
      x: area.x,
      y: area.y,
      width: half,
      height: area.height,
    };
  }
  return {
    x: area.x + half + GAP,
    y: area.y,
    width: half,
    height: area.height,
  };
}

/** True full screen (green button) — not left/right tile or Fill. */
export function isFullscreenWindow(w: {
  minimized: boolean;
  maximized: boolean;
  tiled: TileMode;
}) {
  return !w.minimized && w.maximized && w.tiled !== "fill" && w.tiled !== "left" && w.tiled !== "right";
}

interface WindowStore {
  windows: WindowState[];
  nextZ: number;
  bouncing: AppId | null;
  openApp: (appId: AppId, title?: string) => void;
  focusWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  tileWindow: (id: string, mode: Exclude<TileMode, null>) => void;
  pullDownFromMaximized: (
    id: string,
    cursorX: number,
    cursorY: number,
  ) => void;
  clearAnimOrigin: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (
    id: string,
    bounds: Partial<WindowBounds>,
  ) => void;
  closeApp: (appId: AppId) => void;
  clearBounce: () => void;
  isAppOpen: (appId: AppId) => boolean;
  isAppRunning: (appId: AppId) => boolean;
  getFocused: () => WindowState | undefined;
  getRunningApps: () => AppId[];
  cycleFocus: (dir: 1 | -1) => void;
  syncLayout: () => void;
}

export const useWindowStore = create<WindowStore>()(
  persist(
    (set, get) => ({
  windows: [],
  nextZ: 10,
  bouncing: null,

  openApp: (appId, title) => {
    if (appId === "launchpad") return;

    const { windows, nextZ } = get();
    const existing = windows.find((w) => w.appId === appId && !w.minimized);
    if (existing) {
      get().focusWindow(existing.id);
      return;
    }

    const minimized = windows.find((w) => w.appId === appId && w.minimized);
    if (minimized) {
      get().restoreWindow(minimized.id);
      return;
    }

    const isFreshLaunch = !windows.some((w) => w.appId === appId);

    const defaultTitle =
      appId === "terminal"
        ? "kushgangwal — zsh — 80×24"
        : APPS[appId].name;

    const win: WindowState = {
      id: uid(appId),
      appId,
      title: title ?? defaultTitle,
      bounds: defaultBounds(appId, windows.length),
      prevBounds: null,
      zIndex: nextZ,
      minimized: false,
      maximized: false,
      focused: true,
      tiled: null,
      animOrigin: "open",
    };

    set({
      nextZ: nextZ + 1,
      bouncing: isFreshLaunch ? appId : null,
      windows: [...windows.map((w) => ({ ...w, focused: false })), win],
    });

    if (isFreshLaunch && typeof window !== "undefined") {
      trackEvent("app_open", appId);
      window.setTimeout(() => {
        if (get().bouncing === appId) set({ bouncing: null });
      }, 900);
    }
  },

  clearBounce: () => set({ bouncing: null }),

  focusWindow: (id) => {
    const { windows, nextZ } = get();
    const target = windows.find((w) => w.id === id);
    if (!target) return;
    if (target.focused && !target.minimized) return;
    set({
      nextZ: nextZ + 1,
      windows: windows.map((w) =>
        w.id === id
          ? { ...w, focused: true, zIndex: nextZ, minimized: false }
          : { ...w, focused: false },
      ),
    });
  },

  closeWindow: (id) => {
    set((s) => {
      const remaining = s.windows.filter((w) => w.id !== id);
      if (remaining.length === 0) return { windows: [] };
      const top = [...remaining].sort((a, b) => b.zIndex - a.zIndex)[0];
      return {
        windows: remaining.map((w) => ({
          ...w,
          focused: w.id === top.id,
        })),
      };
    });
  },

  minimizeWindow: (id) => {
    set((s) => {
      const remaining = s.windows.map((w) =>
        w.id === id ? { ...w, minimized: true, focused: false } : w,
      );
      const visible = remaining.filter((w) => !w.minimized);
      if (visible.length === 0) return { windows: remaining };
      const top = [...visible].sort((a, b) => b.zIndex - a.zIndex)[0];
      return {
        windows: remaining.map((w) => ({
          ...w,
          focused: w.id === top.id,
        })),
      };
    });
  },

  restoreWindow: (id) => {
    const { windows, nextZ } = get();
    set({
      nextZ: nextZ + 1,
      windows: windows.map((w) =>
        w.id === id
          ? {
              ...w,
              minimized: false,
              focused: true,
              zIndex: nextZ,
              animOrigin: "dock",
            }
          : { ...w, focused: false },
      ),
    });
  },

  clearAnimOrigin: (id) => {
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, animOrigin: null } : w,
      ),
    }));
  },

  pullDownFromMaximized: (id, cursorX, cursorY) => {
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (!w.maximized && !w.tiled) return w;
        const restored = w.prevBounds ?? {
          ...w.bounds,
          width: Math.min(w.bounds.width, 900),
          height: Math.min(w.bounds.height, 600),
        };
        const ratio = Math.min(
          1,
          Math.max(0.08, (cursorX - w.bounds.x) / Math.max(1, w.bounds.width)),
        );
        const x = cursorX - restored.width * ratio;
        const y = clampWindowY(cursorY - 18);
        return {
          ...w,
          maximized: false,
          tiled: null,
          prevBounds: null,
          bounds: {
            ...restored,
            x: Math.round(x),
            y: Math.round(y),
          },
        };
      }),
    }));
  },

  toggleMaximize: (id) => {
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized || w.tiled === "maximize" || w.tiled === "fill") {
          return {
            ...w,
            maximized: false,
            tiled: null,
            bounds: w.prevBounds ?? w.bounds,
            prevBounds: null,
          };
        }
        return {
          ...w,
          maximized: true,
          tiled: "maximize",
          prevBounds: w.prevBounds ?? w.bounds,
          bounds: maximizedBounds(),
        };
      }),
    }));
  },

  tileWindow: (id, mode) => {
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          maximized: mode === "maximize" || mode === "fill",
          tiled: mode,
          prevBounds: w.prevBounds ?? w.bounds,
          bounds: tileBounds(mode),
          minimized: false,
          focused: true,
        };
      }),
    }));
  },

  moveWindow: (id, x, y) => {
    const { vw, vh } = viewSize();
    const bar = menuBarOffset();
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id || w.maximized) return w;
        // macOS allows windows mostly off-screen — keep a grab strip visible
        return {
          ...w,
          tiled: null,
          bounds: {
            ...w.bounds,
            x: clamp(x, -w.bounds.width + 64, vw - 64),
            y: clamp(y, bar, vh - 28),
          },
        };
      }),
    }));
  },

  resizeWindow: (id, partial) => {
    const bar = menuBarOffset();
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id || w.maximized) return w;
        const min = APPS[w.appId].minSize;
        const next = { ...w.bounds, ...partial };
        if (next.y < bar) {
          next.height -= bar - next.y;
          next.y = bar;
        }
        next.width = Math.max(min.width, next.width);
        next.height = Math.max(min.height, next.height);
        return { ...w, tiled: null, bounds: next };
      }),
    }));
  },

  closeApp: (appId) => {
    set((s) => {
      const remaining = s.windows.filter((w) => w.appId !== appId);
      if (remaining.length === 0) return { windows: [] };
      const top = [...remaining].sort((a, b) => b.zIndex - a.zIndex)[0];
      return {
        windows: remaining.map((w) => ({
          ...w,
          focused: w.id === top.id,
        })),
      };
    });
  },

  isAppOpen: (appId) =>
    get().windows.some((w) => w.appId === appId && !w.minimized),

  isAppRunning: (appId) => get().windows.some((w) => w.appId === appId),

  getFocused: () => get().windows.find((w) => w.focused && !w.minimized),

  getRunningApps: () => {
    const seen = new Set<AppId>();
    const ordered = [...get().windows].sort((a, b) => b.zIndex - a.zIndex);
    const apps: AppId[] = [];
    for (const w of ordered) {
      if (!seen.has(w.appId)) {
        seen.add(w.appId);
        apps.push(w.appId);
      }
    }
    return apps;
  },

  cycleFocus: (dir) => {
    const apps = get().getRunningApps();
    if (apps.length === 0) return;
    const focused = get().getFocused();
    const cur = focused ? apps.indexOf(focused.appId) : 0;
    const next = apps[(cur + dir + apps.length) % apps.length];
    const win = get().windows.find((w) => w.appId === next);
    if (win) get().focusWindow(win.id);
  },

  syncLayout: () => {
    const bar = menuBarOffset();
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.minimized) return w;
        if (isFullscreenWindow(w)) {
          return { ...w, bounds: maximizedBounds() };
        }
        if (w.tiled) {
          return { ...w, bounds: tileBounds(w.tiled) };
        }
        if (w.bounds.y < bar) {
          return { ...w, bounds: { ...w.bounds, y: bar } };
        }
        return w;
      }),
    }));
  },
    }),
    {
      name: "macfolio-windows",
      partialize: (s) => ({
        nextZ: s.nextZ,
        windows: s.windows.map((w) => ({
          ...w,
          focused: false,
          animOrigin: null,
        })),
      }),
      onRehydrateStorage: () => (state) => {
        queueMicrotask(() => {
          const bar = menuBarOffset();
          const windows = useWindowStore.getState().windows;
          if (!windows.some((w) => w.bounds.y < bar)) return;
          useWindowStore.setState({
            windows: windows.map((w) =>
              w.bounds.y < bar
                ? { ...w, bounds: { ...w.bounds, y: bar } }
                : w,
            ),
          });
        });
      },
    },
  ),
);
