export type OSPhase = "booting" | "locked" | "desktop";

export type AppId =
  | "finder"
  | "launchpad"
  | "safari"
  | "messages"
  | "photos"
  | "notes"
  | "terminal"
  | "vscode"
  | "projects"
  | "activity"
  | "settings"
  | "trash"
  | "preview"
  | "assistant";

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TileMode = "left" | "right" | "maximize" | "fill" | null;

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  bounds: WindowBounds;
  prevBounds: WindowBounds | null;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  focused: boolean;
  tiled: TileMode;
  /** Entrance style when the frame mounts */
  animOrigin: "open" | "dock" | null;
}

export interface AppDefinition {
  id: AppId;
  name: string;
  showInDock: boolean;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  /** Unified toolbar: traffic lights overlay content (Settings/Finder style) */
  chrome?: "standard" | "unified";
}

export type AccentId =
  | "multicolor"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "graphite";

export type FolderColorId =
  | "yellow"
  | "orange"
  | "red"
  | "pink"
  | "purple"
  | "blue"
  | "green"
  | "graphite";

export type LiquidGlass = "clear" | "tinted";

export type SidebarIconSize = "small" | "medium" | "large";

export type DisplayScale = "larger" | "large" | "default" | "more-space";

export type WallpaperId =
  | "sequoia-light"
  | "sequoia-dark"
  | "sonoma-light"
  | "sonoma-dark"
  | "monterey"
  | "ventura"
  | "tahoe-day"
  | "space-black"
  | "space-black-tubes"
  | "cinque-terre";

export interface Preferences {
  wallpaper: WallpaperId;
  theme: "light" | "dark" | "auto";
  liquidGlass: LiquidGlass;
  accentColor: AccentId;
  folderColor: FolderColorId;
  sidebarIconSize: SidebarIconSize;
  displayScale: DisplayScale;
  nightShift: boolean;
  nightShiftSunset: boolean;
  nightShiftWarmth: number;
  dockMagnification: boolean;
  reduceMotion: boolean;
  showDesktopIcons: boolean;
  wifi: boolean;
  bluetooth: boolean;
  airDrop: boolean;
  doNotDisturb: boolean;
  volume: number;
  brightness: number;
  wallpaperAuto: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface OSNotification {
  id: string;
  appId: AppId | "system";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface ScreenshotItem {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: string;
  region?: { x: number; y: number; width: number; height: number };
}

export type OSDKind = "volume" | "brightness" | null;
