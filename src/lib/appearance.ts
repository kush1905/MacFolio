import type {
  AccentId,
  FolderColorId,
  LiquidGlass,
  SidebarIconSize,
} from "@/types";

export const ACCENT_COLORS: {
  id: AccentId;
  hex: string;
  label: string;
}[] = [
  { id: "multicolor", hex: "#0a84ff", label: "Multicolor" },
  { id: "blue", hex: "#0a84ff", label: "Blue" },
  { id: "purple", hex: "#bf5af2", label: "Purple" },
  { id: "pink", hex: "#ff375f", label: "Pink" },
  { id: "red", hex: "#ff453a", label: "Red" },
  { id: "orange", hex: "#ff9f0a", label: "Orange" },
  { id: "yellow", hex: "#ffd60a", label: "Yellow" },
  { id: "green", hex: "#30d158", label: "Green" },
  { id: "graphite", hex: "#8e8e93", label: "Graphite" },
];

export const FOLDER_COLORS: {
  id: FolderColorId;
  hex: string;
  label: string;
  filter: string;
}[] = [
  { id: "yellow", hex: "#f5c518", label: "Yellow", filter: "none" },
  { id: "orange", hex: "#ff9f0a", label: "Orange", filter: "hue-rotate(-18deg) saturate(1.15)" },
  { id: "red", hex: "#ff453a", label: "Red", filter: "hue-rotate(-48deg) saturate(1.35)" },
  { id: "pink", hex: "#ff375f", label: "Pink", filter: "hue-rotate(-78deg) saturate(1.25)" },
  { id: "purple", hex: "#bf5af2", label: "Purple", filter: "hue-rotate(-118deg) saturate(1.2)" },
  { id: "blue", hex: "#1a96f0", label: "Blue", filter: "hue-rotate(168deg) saturate(1.35)" },
  { id: "green", hex: "#30d158", label: "Green", filter: "hue-rotate(72deg) saturate(1.2)" },
  { id: "graphite", hex: "#8e8e93", label: "Graphite", filter: "grayscale(1) brightness(0.78) contrast(1.05)" },
];

export function accentHex(id: AccentId): string {
  return ACCENT_COLORS.find((c) => c.id === id)?.hex ?? "#0a84ff";
}

export function folderSpec(id: FolderColorId) {
  return FOLDER_COLORS.find((c) => c.id === id) ?? FOLDER_COLORS[0];
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = Number.parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function applyAppearance(prefs: {
  accentColor: AccentId;
  liquidGlass: LiquidGlass;
  folderColor: FolderColorId;
  sidebarIconSize: SidebarIconSize;
  theme: "light" | "dark" | "auto";
}) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const hex = accentHex(prefs.accentColor);
  const { r, g, b } = hexToRgb(hex);
  const folder = folderSpec(prefs.folderColor);

  root.style.setProperty("--mac-accent", hex);
  root.style.setProperty("--mac-accent-rgb", `${r}, ${g}, ${b}`);
  root.style.setProperty("--mac-selection", `rgba(${r}, ${g}, ${b}, 0.35)`);
  root.style.setProperty("--mac-folder", folder.hex);
  root.style.setProperty("--mac-folder-filter", folder.filter);

  const theme =
    prefs.theme === "auto"
      ? window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark"
      : prefs.theme;

  root.dataset.liquid = prefs.liquidGlass;
  root.dataset.sidebar = prefs.sidebarIconSize;
  root.dataset.theme = theme;
  root.dataset.accent = prefs.accentColor;
  root.dataset.folder = prefs.folderColor;
}
