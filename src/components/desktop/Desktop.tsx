"use client";

import { useEffect, useState } from "react";
import { WALLPAPERS, resolveWallpaper } from "@/lib/apps";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";
import { AppIcon, MacOSAssetIcon } from "@/components/icons/AppIcon";
import { MenuBar } from "@/components/menubar/MenuBar";
import { Dock } from "@/components/dock/Dock";
import { WindowManager } from "@/components/windows/WindowManager";
import { Spotlight } from "@/components/spotlight/Spotlight";
import { Launchpad } from "@/components/launchpad/Launchpad";
import { ControlCenter } from "@/components/system/ControlCenter";
import { NotificationCenter } from "@/components/system/NotificationCenter";
import { AppSwitcher } from "@/components/system/AppSwitcher";
import { ForceQuit } from "@/components/system/ForceQuit";
import { SystemOSD } from "@/components/system/SystemOSD";
import { ScreenshotOverlay } from "@/components/system/ScreenshotOverlay";
import { AboutThisMac } from "@/components/system/AboutThisMac";
import { MissionControl } from "@/components/system/MissionControl";
import { HelpCenter } from "@/components/system/HelpCenter";
import type { AppId, WallpaperId } from "@/types";

const DESKTOP_ICONS: {
  id: string;
  label: string;
  app?: AppId;
  kind: "app" | "disk" | "folder" | "file";
}[] = [
  { id: "hd", label: "Macintosh HD", app: "finder", kind: "disk" },
  { id: "projects", label: "Projects", app: "projects", kind: "folder" },
  { id: "resume", label: "Resume.pdf", app: "preview", kind: "file" },
];

function wallpaperBackground(id: WallpaperId): React.CSSProperties {
  const w = WALLPAPERS[id];
  if (w.image) {
    return {
      backgroundImage: `url(${w.image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { background: w.css };
}

type CtxMenu = { x: number; y: number } | null;

export function Desktop() {
  const wallpaper = resolveWallpaper(
    useOSStore((s) => s.preferences.wallpaper),
  );
  const showIcons = useOSStore((s) => s.preferences.showDesktopIcons);
  const setShowDesktopIcons = useOSStore((s) => s.setShowDesktopIcons);
  const setLaunchpadOpen = useOSStore((s) => s.setLaunchpadOpen);
  const setSpotlightOpen = useOSStore((s) => s.setSpotlightOpen);
  const openApp = useWindowStore((s) => s.openApp);
  const [ctx, setCtx] = useState<CtxMenu>(null);

  useEffect(() => {
    const close = () => setCtx(null);
    window.addEventListener("click", close);
    window.addEventListener("blur", close);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("blur", close);
    };
  }, []);

  useEffect(() => {
    const sync = () => useWindowStore.getState().syncLayout();
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onContextMenu={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("[data-no-desktop-ctx]")) return;
        if (target.closest("button, input, a, textarea, [role='dialog']")) return;
        e.preventDefault();
        const pad = 8;
        const menuW = 220;
        const menuH = 220;
        const x = Math.min(e.clientX, window.innerWidth - menuW - pad);
        const y = Math.min(e.clientY, window.innerHeight - menuH - pad);
        setCtx({ x, y });
      }}
    >
      <div
        className="wallpaper-layer absolute inset-0 transition-[background-image,background,filter] duration-300"
        style={{
          ...wallpaperBackground(wallpaper),
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.22)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        }}
      />

      <MenuBar />

      {showIcons && (
        <div className="absolute right-3 top-9 z-10 flex flex-col gap-3">
          {DESKTOP_ICONS.map((icon) => (
            <button
              key={icon.id}
              type="button"
              className="group flex w-[78px] cursor-default flex-col items-center gap-1 rounded-[6px] px-1 py-1.5 hover:bg-white/[0.12]"
              onDoubleClick={() => icon.app && openApp(icon.app)}
            >
              {icon.kind === "disk" && (
                <div className="h-12 w-12 drop-shadow-lg">
                  <AppIcon id="finder" />
                </div>
              )}
              {icon.kind === "folder" && (
                <MacOSAssetIcon
                  name="folder"
                  className="h-12 w-14 drop-shadow-lg"
                />
              )}
              {icon.kind === "file" && (
                <MacOSAssetIcon
                  name="document"
                  className="h-12 w-10 drop-shadow-lg"
                />
              )}
              <span className="max-w-[76px] truncate rounded-[4px] px-1.5 text-center text-[11px] font-medium tracking-[-0.01em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] group-hover:bg-mac-accent">
                {icon.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {ctx && (
        <div
          className="menu-dropdown absolute z-[60] w-[220px] overflow-hidden rounded-[8px] py-1 text-[13px] text-white/90"
          style={{ left: ctx.x, top: ctx.y }}
          onClick={(e) => e.stopPropagation()}
          data-no-desktop-ctx
        >
          <CtxItem
            label="New Folder"
            onClick={() => {
              setCtx(null);
              openApp("finder");
            }}
          />
          <div className="my-1 h-px bg-white/10" />
          <CtxItem
            label="Get Info"
            onClick={() => {
              setCtx(null);
              openApp("finder");
            }}
          />
          <CtxItem
            label="Change Wallpaper…"
            onClick={() => {
              setCtx(null);
              useOSStore.getState().openSettingsSection("wallpaper");
              openApp("settings");
            }}
          />
          <div className="my-1 h-px bg-white/10" />
          <CtxItem
            label="Use Launchpad"
            onClick={() => {
              setCtx(null);
              setLaunchpadOpen(true);
            }}
          />
          <CtxItem
            label="Spotlight Search…"
            shortcut="⌘Space"
            onClick={() => {
              setCtx(null);
              setSpotlightOpen(true);
            }}
          />
          <div className="my-1 h-px bg-white/10" />
          <CtxItem
            label={showIcons ? "Hide Desktop Icons" : "Show Desktop Icons"}
            onClick={() => {
              setShowDesktopIcons(!showIcons);
              setCtx(null);
            }}
          />
        </div>
      )}

      <WindowManager />
      <Dock />
      <Spotlight />
      <Launchpad />
      <ControlCenter />
      <NotificationCenter />
      <AppSwitcher />
      <ForceQuit />
      <SystemOSD />
      <ScreenshotOverlay />
      <AboutThisMac />
      <MissionControl />
      <HelpCenter />
    </div>
  );
}

function CtxItem({
  label,
  shortcut,
  onClick,
}: {
  label: string;
  shortcut?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full cursor-default items-center justify-between px-3 py-[5px] text-left hover:bg-mac-accent"
      onClick={onClick}
    >
      <span>{label}</span>
      {shortcut && (
        <span className="ml-6 text-[12px] text-white/45">{shortcut}</span>
      )}
    </button>
  );
}
