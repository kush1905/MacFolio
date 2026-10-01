import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DOCK_LOCKED, DOCK_ORDER, resolveWallpaper } from "@/lib/apps";
import type {
  AccentId,
  AppId,
  ContactMessage,
  DisplayScale,
  FolderColorId,
  LiquidGlass,
  OSDKind,
  OSNotification,
  OSPhase,
  Preferences,
  ScreenshotItem,
  SidebarIconSize,
  WallpaperId,
} from "@/types";

interface OSState {
  phase: OSPhase;
  spotlightOpen: boolean;
  launchpadOpen: boolean;
  controlCenterOpen: boolean;
  notificationCenterOpen: boolean;
  forceQuitOpen: boolean;
  appSwitcherOpen: boolean;
  screenshotSelectMode: boolean;
  aboutThisMacOpen: boolean;
  missionControlOpen: boolean;
  helpCenterOpen: boolean;
  helpTopicId: string | null;
  sessionRestoring: boolean;
  activeMenuApp: string | null;
  settingsSection: string | null;
  /** Pinned dock apps (order preserved). Trash is always appended separately. */
  dockPins: AppId[];
  messages: ContactMessage[];
  notifications: OSNotification[];
  screenshots: ScreenshotItem[];
  latestScreenshotId: string | null;
  osd: { kind: OSDKind; value: number; visible: boolean };
  preferences: Preferences;
  hydrated: boolean;
  setPhase: (phase: OSPhase) => void;
  unlock: () => void;
  lock: () => void;
  setSpotlightOpen: (open: boolean) => void;
  setLaunchpadOpen: (open: boolean) => void;
  setControlCenterOpen: (open: boolean) => void;
  setNotificationCenterOpen: (open: boolean) => void;
  setForceQuitOpen: (open: boolean) => void;
  setAppSwitcherOpen: (open: boolean) => void;
  setScreenshotSelectMode: (open: boolean) => void;
  setAboutThisMacOpen: (open: boolean) => void;
  setMissionControlOpen: (open: boolean) => void;
  setHelpCenterOpen: (open: boolean, topicId?: string | null) => void;
  setHelpTopicId: (id: string | null) => void;
  setSessionRestoring: (v: boolean) => void;
  closeOverlays: () => void;
  setActiveMenuApp: (name: string | null) => void;
  openSettingsSection: (section: string) => void;
  consumeSettingsSection: () => string | null;
  setWallpaper: (id: WallpaperId) => void;
  setTheme: (theme: Preferences["theme"]) => void;
  setLiquidGlass: (mode: LiquidGlass) => void;
  setAccentColor: (id: AccentId) => void;
  setFolderColor: (id: FolderColorId) => void;
  setSidebarIconSize: (size: SidebarIconSize) => void;
  setDisplayScale: (scale: DisplayScale) => void;
  setNightShift: (on: boolean) => void;
  setNightShiftSunset: (on: boolean) => void;
  setNightShiftWarmth: (n: number) => void;
  setDockMagnification: (on: boolean) => void;
  setReduceMotion: (on: boolean) => void;
  setShowDesktopIcons: (on: boolean) => void;
  setWifi: (on: boolean) => void;
  setBluetooth: (on: boolean) => void;
  setAirDrop: (on: boolean) => void;
  setDoNotDisturb: (on: boolean) => void;
  setWallpaperAuto: (on: boolean) => void;
  applyTimeWallpaper: () => void;
  pinToDock: (id: AppId) => void;
  unpinFromDock: (id: AppId) => void;
  isPinnedToDock: (id: AppId) => boolean;
  setVolume: (n: number, showOsd?: boolean) => void;
  setBrightness: (n: number, showOsd?: boolean) => void;
  hideOsd: () => void;
  addMessage: (
    msg: Omit<ContactMessage, "id" | "createdAt"> &
      Partial<Pick<ContactMessage, "id" | "createdAt">>,
  ) => void;
  setMessages: (messages: ContactMessage[]) => void;
  addNotification: (
    n: Omit<OSNotification, "id" | "createdAt" | "read">,
  ) => void;
  markNotificationsRead: () => void;
  clearNotifications: () => void;
  addScreenshot: (shot: Omit<ScreenshotItem, "id" | "createdAt">) => void;
  dismissLatestScreenshot: () => void;
  setHydrated: (v: boolean) => void;
}

const defaultPreferences: Preferences = {
  wallpaper: "space-black",
  theme: "dark",
  liquidGlass: "tinted",
  accentColor: "blue",
  folderColor: "yellow",
  sidebarIconSize: "medium",
  displayScale: "default",
  nightShift: false,
  nightShiftSunset: false,
  nightShiftWarmth: 55,
  dockMagnification: false,
  reduceMotion: false,
  showDesktopIcons: true,
  wifi: true,
  bluetooth: true,
  airDrop: true,
  doNotDisturb: false,
  volume: 72,
  brightness: 85,
  wallpaperAuto: false,
};

let osdTimer: ReturnType<typeof setTimeout> | null = null;

function clamp01(n: number) {
  return Math.min(100, Math.max(0, Math.round(n)));
}

function seedNotifications(): OSNotification[] {
  const now = Date.now();
  return [
    {
      id: "n1",
      appId: "messages",
      title: "Currently Available for Hiring",
      body: `${"Kush Gangwal"} is open to full-time roles — say hi in Messages.`,
      createdAt: new Date(now - 1000 * 60 * 8).toISOString(),
      read: false,
    },
    {
      id: "n2",
      appId: "finder",
      title: "Resume Updated",
      body: "Resume.pdf is ready on the Desktop.",
      createdAt: new Date(now - 1000 * 60 * 40).toISOString(),
      read: false,
    },
    {
      id: "n3",
      appId: "vscode",
      title: "New Project Added",
      body: "Open VS Code for Macfolio, Potato Bazaar, Tybee Go, Findanio & Nexus.",
      createdAt: new Date(now - 1000 * 60 * 95).toISOString(),
      read: true,
    },
  ];
}

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      phase: "booting",
      spotlightOpen: false,
      launchpadOpen: false,
      controlCenterOpen: false,
      notificationCenterOpen: false,
      forceQuitOpen: false,
      appSwitcherOpen: false,
      screenshotSelectMode: false,
      aboutThisMacOpen: false,
      missionControlOpen: false,
      helpCenterOpen: false,
      helpTopicId: null,
      sessionRestoring: false,
      activeMenuApp: null,
      settingsSection: null,
      dockPins: [...DOCK_ORDER],
      messages: [],
      notifications: seedNotifications(),
      screenshots: [],
      latestScreenshotId: null,
      osd: { kind: null, value: 0, visible: false },
      preferences: defaultPreferences,
      hydrated: false,
      setPhase: (phase) => set({ phase }),
      unlock: () => set({ phase: "desktop" }),
      lock: () =>
        set({
          phase: "locked",
          spotlightOpen: false,
          launchpadOpen: false,
          controlCenterOpen: false,
          notificationCenterOpen: false,
          forceQuitOpen: false,
          appSwitcherOpen: false,
          screenshotSelectMode: false,
          aboutThisMacOpen: false,
          missionControlOpen: false,
          helpCenterOpen: false,
        }),
      closeOverlays: () =>
        set({
          spotlightOpen: false,
          launchpadOpen: false,
          controlCenterOpen: false,
          notificationCenterOpen: false,
          forceQuitOpen: false,
          appSwitcherOpen: false,
          screenshotSelectMode: false,
          aboutThisMacOpen: false,
          missionControlOpen: false,
          helpCenterOpen: false,
        }),
      setSpotlightOpen: (spotlightOpen) =>
        set((s) => ({
          spotlightOpen,
          launchpadOpen: spotlightOpen ? false : s.launchpadOpen,
          controlCenterOpen: spotlightOpen ? false : s.controlCenterOpen,
          notificationCenterOpen: spotlightOpen
            ? false
            : s.notificationCenterOpen,
        })),
      setLaunchpadOpen: (launchpadOpen) =>
        set((s) => ({
          launchpadOpen,
          spotlightOpen: launchpadOpen ? false : s.spotlightOpen,
          controlCenterOpen: launchpadOpen ? false : s.controlCenterOpen,
          notificationCenterOpen: launchpadOpen
            ? false
            : s.notificationCenterOpen,
        })),
      setControlCenterOpen: (controlCenterOpen) =>
        set((s) => ({
          controlCenterOpen,
          notificationCenterOpen: controlCenterOpen
            ? false
            : s.notificationCenterOpen,
          spotlightOpen: controlCenterOpen ? false : s.spotlightOpen,
          launchpadOpen: controlCenterOpen ? false : s.launchpadOpen,
        })),
      setNotificationCenterOpen: (notificationCenterOpen) =>
        set((s) => ({
          notificationCenterOpen,
          controlCenterOpen: notificationCenterOpen
            ? false
            : s.controlCenterOpen,
          spotlightOpen: notificationCenterOpen ? false : s.spotlightOpen,
          launchpadOpen: notificationCenterOpen ? false : s.launchpadOpen,
        })),
      setForceQuitOpen: (forceQuitOpen) =>
        set((s) => ({
          forceQuitOpen,
          controlCenterOpen: false,
          notificationCenterOpen: false,
          spotlightOpen: forceQuitOpen ? false : s.spotlightOpen,
        })),
      setAppSwitcherOpen: (appSwitcherOpen) => set({ appSwitcherOpen }),
      setScreenshotSelectMode: (screenshotSelectMode) =>
        set({
          screenshotSelectMode,
          controlCenterOpen: false,
          notificationCenterOpen: false,
          spotlightOpen: false,
        }),
      setAboutThisMacOpen: (aboutThisMacOpen) =>
        set({
          aboutThisMacOpen,
          controlCenterOpen: false,
          notificationCenterOpen: false,
        }),
      setMissionControlOpen: (missionControlOpen) =>
        set({
          missionControlOpen,
          launchpadOpen: false,
          spotlightOpen: false,
          controlCenterOpen: false,
          notificationCenterOpen: false,
          appSwitcherOpen: false,
          helpCenterOpen: false,
        }),
      setHelpCenterOpen: (helpCenterOpen, topicId) =>
        set({
          helpCenterOpen,
          helpTopicId:
            topicId !== undefined
              ? topicId
              : helpCenterOpen
                ? "finder"
                : null,
          spotlightOpen: false,
          launchpadOpen: false,
          controlCenterOpen: false,
          notificationCenterOpen: false,
          missionControlOpen: false,
        }),
      setHelpTopicId: (helpTopicId) => set({ helpTopicId }),
      setSessionRestoring: (sessionRestoring) => set({ sessionRestoring }),
      setActiveMenuApp: (activeMenuApp) => set({ activeMenuApp }),
      openSettingsSection: (settingsSection) => set({ settingsSection }),
      consumeSettingsSection: () => {
        const section = get().settingsSection;
        if (section) set({ settingsSection: null });
        return section;
      },
      setWallpaper: (wallpaper) =>
        set((s) => ({ preferences: { ...s.preferences, wallpaper } })),
      setTheme: (theme) =>
        set((s) => ({ preferences: { ...s.preferences, theme } })),
      setLiquidGlass: (liquidGlass) =>
        set((s) => ({ preferences: { ...s.preferences, liquidGlass } })),
      setAccentColor: (accentColor) =>
        set((s) => ({ preferences: { ...s.preferences, accentColor } })),
      setFolderColor: (folderColor) =>
        set((s) => ({ preferences: { ...s.preferences, folderColor } })),
      setSidebarIconSize: (sidebarIconSize) =>
        set((s) => ({ preferences: { ...s.preferences, sidebarIconSize } })),
      setDisplayScale: (displayScale) =>
        set((s) => ({ preferences: { ...s.preferences, displayScale } })),
      setNightShift: (nightShift) =>
        set((s) => ({ preferences: { ...s.preferences, nightShift } })),
      setNightShiftSunset: (nightShiftSunset) =>
        set((s) => ({ preferences: { ...s.preferences, nightShiftSunset } })),
      setNightShiftWarmth: (n) =>
        set((s) => ({
          preferences: { ...s.preferences, nightShiftWarmth: clamp01(n) },
        })),
      setDockMagnification: (dockMagnification) =>
        set((s) => ({ preferences: { ...s.preferences, dockMagnification } })),
      setReduceMotion: (reduceMotion) =>
        set((s) => ({ preferences: { ...s.preferences, reduceMotion } })),
      setShowDesktopIcons: (showDesktopIcons) =>
        set((s) => ({ preferences: { ...s.preferences, showDesktopIcons } })),
      setWifi: (wifi) =>
        set((s) => ({ preferences: { ...s.preferences, wifi } })),
      setBluetooth: (bluetooth) =>
        set((s) => ({ preferences: { ...s.preferences, bluetooth } })),
      setAirDrop: (airDrop) =>
        set((s) => ({ preferences: { ...s.preferences, airDrop } })),
      setDoNotDisturb: (doNotDisturb) =>
        set((s) => ({ preferences: { ...s.preferences, doNotDisturb } })),
      setWallpaperAuto: (wallpaperAuto) =>
        set((s) => ({ preferences: { ...s.preferences, wallpaperAuto } })),
      pinToDock: (id) => {
        if (id === "trash" || id === "launchpad") return;
        set((s) => {
          if (s.dockPins.includes(id)) return s;
          // Insert before settings if present, else append
          const pins = [...s.dockPins];
          const settingsIdx = pins.indexOf("settings");
          if (settingsIdx >= 0) pins.splice(settingsIdx, 0, id);
          else pins.push(id);
          return { dockPins: pins };
        });
      },
      unpinFromDock: (id) => {
        if (DOCK_LOCKED.includes(id) || id === "trash") return;
        set((s) => ({ dockPins: s.dockPins.filter((p) => p !== id) }));
      },
      isPinnedToDock: (id) => get().dockPins.includes(id),
      applyTimeWallpaper: () => {
        const hour = new Date().getHours();
        // Morning / day → light · evening / night → dark
        const id =
          hour >= 7 && hour < 18 ? "sequoia-light" : "space-black-tubes";
        set((s) => ({
          preferences: { ...s.preferences, wallpaper: id as WallpaperId },
        }));
      },
      setVolume: (n, showOsd = true) => {
        const volume = clamp01(n);
        set((s) => ({
          preferences: { ...s.preferences, volume },
          osd: showOsd
            ? { kind: "volume", value: volume, visible: true }
            : s.osd,
        }));
        if (showOsd) {
          if (osdTimer) clearTimeout(osdTimer);
          osdTimer = setTimeout(() => get().hideOsd(), 1400);
        }
      },
      setBrightness: (n, showOsd = true) => {
        const brightness = clamp01(n);
        set((s) => ({
          preferences: { ...s.preferences, brightness },
          osd: showOsd
            ? { kind: "brightness", value: brightness, visible: true }
            : s.osd,
        }));
        if (showOsd) {
          if (osdTimer) clearTimeout(osdTimer);
          osdTimer = setTimeout(() => get().hideOsd(), 1400);
        }
      },
      hideOsd: () =>
        set((s) => ({ osd: { ...s.osd, visible: false } })),
      addMessage: (msg) =>
        set((s) => {
          const next: ContactMessage = {
            name: msg.name,
            email: msg.email,
            message: msg.message,
            id: msg.id ?? `msg_${Date.now()}`,
            createdAt: msg.createdAt ?? new Date().toISOString(),
          };
          return {
            messages: [
              ...s.messages.filter((m) => m.id !== next.id),
              next,
            ],
          };
        }),
      setMessages: (messages) => set({ messages }),
      addNotification: (n) =>
        set((s) => {
          if (s.preferences.doNotDisturb) return s;
          return {
            notifications: [
              {
                ...n,
                id: `notif_${Date.now()}`,
                createdAt: new Date().toISOString(),
                read: false,
              },
              ...s.notifications,
            ].slice(0, 40),
          };
        }),
      markNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearNotifications: () => set({ notifications: [] }),
      addScreenshot: (shot) => {
        const id = `shot_${Date.now()}`;
        const item: ScreenshotItem = {
          ...shot,
          id,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          screenshots: [item, ...s.screenshots].slice(0, 24),
          latestScreenshotId: id,
        }));
        get().addNotification({
          appId: "photos",
          title: "Screenshot",
          body: `${shot.name} saved`,
        });
      },
      dismissLatestScreenshot: () => set({ latestScreenshotId: null }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "macfolio-os",
      partialize: (s) => ({
        preferences: s.preferences,
        dockPins: s.dockPins,
        messages: s.messages,
        notifications: s.notifications,
        screenshots: s.screenshots.slice(0, 8),
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<OSState> | undefined;
        const allowed = new Set<AppId>([
          ...DOCK_ORDER,
          "preview",
          "assistant",
          "projects",
        ]);
        const raw = (p?.dockPins ?? current.dockPins).filter(
          (id): id is AppId =>
            typeof id === "string" &&
            allowed.has(id as AppId) &&
            id !== "trash",
        );
        const withoutLocked = (raw.length ? raw : [...DOCK_ORDER]).filter(
          (id) => !DOCK_LOCKED.includes(id),
        );
        const dockPins: AppId[] = [
          "finder",
          "launchpad",
          ...withoutLocked.filter((id) => id !== "finder" && id !== "launchpad"),
        ];
        if (!dockPins.includes("projects")) {
          const at = dockPins.indexOf("photos");
          dockPins.splice(at >= 0 ? at + 1 : 2, 0, "projects");
        }
        return {
          ...current,
          ...p,
          phase: "booting",
          dockPins,
          preferences: {
            ...defaultPreferences,
            ...(p?.preferences ?? {}),
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          const wallpaper = resolveWallpaper(state.preferences.wallpaper);
          if (wallpaper !== state.preferences.wallpaper) {
            state.setWallpaper(wallpaper);
          }
          state.setHydrated(true);
        }
      },
    },
  ),
);
