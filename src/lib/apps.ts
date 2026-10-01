import type { AppDefinition, AppId, WallpaperId } from "@/types";

export const APPS: Record<AppId, AppDefinition> = {
  finder: {
    id: "finder",
    name: "Finder",
    showInDock: true,
    defaultSize: { width: 920, height: 600 },
    minSize: { width: 560, height: 380 },
    chrome: "unified",
  },
  launchpad: {
    id: "launchpad",
    name: "Launchpad",
    showInDock: true,
    defaultSize: { width: 800, height: 500 },
    minSize: { width: 400, height: 300 },
  },
  safari: {
    id: "safari",
    name: "Safari",
    showInDock: true,
    defaultSize: { width: 960, height: 640 },
    minSize: { width: 480, height: 360 },
  },
  messages: {
    id: "messages",
    name: "Messages",
    showInDock: true,
    defaultSize: { width: 820, height: 560 },
    minSize: { width: 420, height: 360 },
    chrome: "unified",
  },
  photos: {
    id: "photos",
    name: "Photos",
    showInDock: true,
    defaultSize: { width: 940, height: 620 },
    minSize: { width: 520, height: 380 },
    chrome: "unified",
  },
  notes: {
    id: "notes",
    name: "Notes",
    showInDock: true,
    defaultSize: { width: 860, height: 580 },
    minSize: { width: 480, height: 360 },
    chrome: "unified",
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    showInDock: true,
    defaultSize: { width: 780, height: 520 },
    minSize: { width: 520, height: 320 },
  },
  vscode: {
    id: "vscode",
    name: "VS Code",
    showInDock: true,
    defaultSize: { width: 1000, height: 660 },
    minSize: { width: 560, height: 400 },
  },
  projects: {
    id: "projects",
    name: "Projects",
    showInDock: true,
    defaultSize: { width: 1040, height: 680 },
    minSize: { width: 720, height: 480 },
    chrome: "unified",
  },
  activity: {
    id: "activity",
    name: "Activity Monitor",
    showInDock: true,
    defaultSize: { width: 920, height: 640 },
    minSize: { width: 640, height: 420 },
    chrome: "unified",
  },
  settings: {
    id: "settings",
    name: "System Settings",
    showInDock: true,
    defaultSize: { width: 780, height: 640 },
    minSize: { width: 680, height: 480 },
    chrome: "unified",
  },
  preview: {
    id: "preview",
    name: "Preview",
    showInDock: false,
    defaultSize: { width: 820, height: 640 },
    minSize: { width: 480, height: 360 },
  },
  assistant: {
    id: "assistant",
    name: "KushGPT",
    showInDock: true,
    defaultSize: { width: 480, height: 640 },
    minSize: { width: 400, height: 480 },
    chrome: "unified",
  },
  trash: {
    id: "trash",
    name: "Trash",
    showInDock: true,
    defaultSize: { width: 520, height: 360 },
    minSize: { width: 360, height: 260 },
  },
};

/** Apps that always stay pinned (Finder / Launchpad) */
export const DOCK_LOCKED: AppId[] = ["finder", "launchpad"];

export const DOCK_ORDER: AppId[] = [
  "finder",
  "launchpad",
  "safari",
  "messages",
  "photos",
  "projects",
  "notes",
  "terminal",
  "vscode",
  "assistant",
  "activity",
  "settings",
];

const WP = "/assets/macos/wallpapers";

export const WALLPAPERS: Record<
  WallpaperId,
  { name: string; css: string; preview: string; image?: string }
> = {
  "sequoia-light": {
    name: "Sequoia Light",
    image: `${WP}/sequoia-light.jpg`,
    css: "linear-gradient(180deg, #87a0b8, #c4b49a)",
    preview: "linear-gradient(180deg, #9bb0c4, #d4c4a8)",
  },
  "sequoia-dark": {
    name: "Sequoia Dark",
    image: `${WP}/sequoia-dark.jpg`,
    css: "linear-gradient(180deg, #1a2038, #4a3048)",
    preview: "linear-gradient(180deg, #1a2038, #8a5060)",
  },
  "sonoma-light": {
    name: "Sonoma Light",
    image: `${WP}/sonoma-light.jpg`,
    css: "linear-gradient(180deg, #a8c4d8, #e8dcc8)",
    preview: "linear-gradient(180deg, #a8c4d8, #e8dcc8)",
  },
  "sonoma-dark": {
    name: "Sonoma Dark",
    image: `${WP}/sonoma-dark.jpg`,
    css: "linear-gradient(180deg, #0b1c2e, #2a4a5a)",
    preview: "linear-gradient(180deg, #0b1c2e, #2a6a7a)",
  },
  monterey: {
    name: "Monterey",
    image: `${WP}/monterey.jpg`,
    css: "linear-gradient(185deg, #1a1040 0%, #4a2040 55%, #8a4030 100%)",
    preview: "linear-gradient(135deg, #1a1040, #c13a8a, #ff7a4a)",
  },
  ventura: {
    name: "Ventura",
    image: `${WP}/ventura.jpg`,
    css: "linear-gradient(180deg, #4a7a9a, #1a3040)",
    preview: "linear-gradient(180deg, #5a8aaa, #1a3040)",
  },
  "tahoe-day": {
    name: "Tahoe Day",
    image: `${WP}/tahoe-day.jpg`,
    css: "linear-gradient(180deg, #6a9aba, #c8d8e8)",
    preview: "linear-gradient(180deg, #6a9aba, #c8d8e8)",
  },
  "space-black": {
    name: "Space Black",
    image: `${WP}/space-black.jpg`,
    css: "radial-gradient(ellipse at 30% 40%, #2a2a2e 0%, #000 55%), #000",
    preview: "linear-gradient(135deg, #1a1a1c, #4a4a50 40%, #0a0a0a)",
  },
  "space-black-tubes": {
    name: "Space Black Pro",
    image: `${WP}/space-black-tubes.jpg`,
    css: "radial-gradient(ellipse at 40% 50%, #2c2c30 0%, #000 60%)",
    preview: "linear-gradient(135deg, #111, #666 35%, #222 70%, #000)",
  },
  "cinque-terre": {
    name: "Cinque Terre",
    image: `${WP}/cinque-terre.jpg`,
    css: "linear-gradient(180deg, #1a1028, #c45a20)",
    preview: "linear-gradient(180deg, #2a1840, #e87830 55%, #0a1828)",
  },
};

/** Map legacy localStorage wallpaper ids → current authentic set */
const WALLPAPER_ALIASES: Record<string, WallpaperId> = {
  "sequoia-abstract": "monterey",
  "sonoma-horizon": "sonoma-light",
  "sequoia-peak": "sequoia-dark",
  "ventura-lake": "ventura",
  "tahoe-dusk": "tahoe-day",
  "ventura-horizon": "ventura",
  "solid-graphite": "space-black",
  "sonoma-horizon-photo": "sonoma-light",
};

export function resolveWallpaper(id: string | undefined): WallpaperId {
  if (id && id in WALLPAPERS) return id as WallpaperId;
  if (id && id in WALLPAPER_ALIASES) return WALLPAPER_ALIASES[id];
  return "space-black";
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export function uid(prefix = "win") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
