"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { APPS, DOCK_LOCKED } from "@/lib/apps";
import { AppIcon } from "@/components/icons/AppIcon";
import { isFullscreenWindow, useWindowStore } from "@/store/windowStore";
import { useOSStore } from "@/store/osStore";
import type { AppId } from "@/types";

/** Compact macOS dock icon size — no magnification / zoom */
const ICON = 44;
const SLOT = 48;

export function Dock() {
  const openApp = useWindowStore((s) => s.openApp);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const closeApp = useWindowStore((s) => s.closeApp);
  const windows = useWindowStore((s) => s.windows);
  const isAppRunning = useWindowStore((s) => s.isAppRunning);
  const bouncing = useWindowStore((s) => s.bouncing);
  const fullscreen = useWindowStore((s) => s.windows.some(isFullscreenWindow));
  const setLaunchpadOpen = useOSStore((s) => s.setLaunchpadOpen);
  const launchpadOpen = useOSStore((s) => s.launchpadOpen);
  const reduceMotion = useOSStore((s) => s.preferences.reduceMotion);
  const setActiveMenuApp = useOSStore((s) => s.setActiveMenuApp);
  const dockPins = useOSStore((s) => s.dockPins);
  const pinToDock = useOSStore((s) => s.pinToDock);
  const unpinFromDock = useOSStore((s) => s.unpinFromDock);

  const [hovered, setHovered] = useState<AppId | null>(null);
  const [tooltipReady, setTooltipReady] = useState(false);
  const [ctx, setCtx] = useState<{ id: AppId; x: number; y: number } | null>(
    null,
  );

  const transient = useMemo(() => {
    const seen = new Set<AppId>();
    const ordered = [...windows].sort((a, b) => b.zIndex - a.zIndex);
    const running: AppId[] = [];
    for (const w of ordered) {
      if (seen.has(w.appId)) continue;
      seen.add(w.appId);
      if (w.appId === "trash" || dockPins.includes(w.appId)) continue;
      running.push(w.appId);
    }
    return running;
  }, [dockPins, windows]);

  const items = useMemo<AppId[]>(
    () => [...dockPins, ...transient, "trash"],
    [dockPins, transient],
  );

  useEffect(() => {
    const close = () => setCtx(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    if (!hovered || ctx) {
      setTooltipReady(false);
      return;
    }
    const t = window.setTimeout(() => setTooltipReady(true), 300);
    return () => window.clearTimeout(t);
  }, [hovered, ctx]);

  const handleClick = (id: AppId) => {
    setCtx(null);
    if (id === "launchpad") {
      setLaunchpadOpen(!launchpadOpen);
      setActiveMenuApp("Launchpad");
      return;
    }
    const minimized = windows.find((w) => w.appId === id && w.minimized);
    if (minimized) {
      restoreWindow(minimized.id);
      setActiveMenuApp(APPS[id].name);
      return;
    }
    openApp(id);
    setActiveMenuApp(APPS[id].name);
  };

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center overflow-visible pb-[10px]"
      animate={fullscreen ? { y: 96, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
      style={{ pointerEvents: fullscreen ? "none" : undefined }}
    >
      <div
        className={`dock-glass relative flex items-end overflow-visible rounded-[18px] px-[6px] pb-[5px] pt-[4px] ${
          fullscreen ? "pointer-events-none" : "pointer-events-auto"
        }`}
        onMouseLeave={() => {
          setHovered(null);
          setTooltipReady(false);
        }}
      >
        <div className="relative flex items-end">
          {items.map((id, index) => {
            const showSepBefore =
              id === "trash" ||
              (transient.length > 0 && index === dockPins.length);

            return (
              <div key={`${id}-${index}`} className="relative flex items-end">
                {showSepBefore && (
                  <div
                    className="dock-separator mx-[5px] mb-[11px] h-[28px] w-px shrink-0 self-end"
                    aria-hidden
                  />
                )}
                <DockItem
                  id={id}
                  running={
                    id === "launchpad"
                      ? launchpadOpen
                      : id === "trash"
                        ? false
                        : isAppRunning(id)
                  }
                  bouncing={!reduceMotion && bouncing === id}
                  label={APPS[id].name}
                  showTooltip={hovered === id && tooltipReady && !ctx}
                  onHover={() => setHovered(id)}
                  onLeave={() => {
                    if (hovered === id) {
                      setHovered(null);
                      setTooltipReady(false);
                    }
                  }}
                  onClick={() => handleClick(id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const menuW = 220;
                    const menuH = 210;
                    setCtx({
                      id,
                      x: Math.min(e.clientX, window.innerWidth - menuW - 8),
                      y: Math.max(36, e.clientY - menuH),
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {ctx && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="menu-dropdown pointer-events-auto absolute z-[90] w-[220px] overflow-hidden rounded-[8px] py-1 text-[13px] text-white"
            style={{ left: ctx.x, top: ctx.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <CtxItem
              label="Open"
              onClick={() => {
                handleClick(ctx.id);
                setCtx(null);
              }}
            />
            {ctx.id === "finder" && (
              <CtxItem
                label="New Finder Window"
                onClick={() => {
                  openApp("finder");
                  setCtx(null);
                }}
              />
            )}
            {ctx.id === "photos" && (
              <CtxItem
                label="Recent Photos"
                onClick={() => {
                  openApp("photos");
                  setCtx(null);
                }}
              />
            )}
            {ctx.id === "settings" && (
              <CtxItem
                label="Wallpaper…"
                onClick={() => {
                  useOSStore.getState().openSettingsSection("wallpaper");
                  openApp("settings");
                  setCtx(null);
                }}
              />
            )}

            {ctx.id !== "trash" && ctx.id !== "launchpad" && (
              <>
                <div className="my-1 h-px bg-white/10" />
                {dockPins.includes(ctx.id) ? (
                  <CtxItem
                    label="Remove from Dock"
                    disabled={DOCK_LOCKED.includes(ctx.id)}
                    onClick={() => {
                      unpinFromDock(ctx.id);
                      setCtx(null);
                    }}
                  />
                ) : (
                  <CtxItem
                    label="Keep in Dock"
                    onClick={() => {
                      pinToDock(ctx.id);
                      setCtx(null);
                    }}
                  />
                )}
              </>
            )}

            {isAppRunning(ctx.id) &&
              ctx.id !== "launchpad" &&
              ctx.id !== "trash" && (
                <>
                  <div className="my-1 h-px bg-white/10" />
                  <CtxItem
                    label="Quit"
                    onClick={() => {
                      closeApp(ctx.id);
                      setCtx(null);
                    }}
                  />
                </>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CtxItem({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex w-full cursor-default px-3 py-[5px] text-left ${
        disabled ? "text-white/30" : "hover:bg-mac-accent"
      }`}
      onClick={() => {
        if (!disabled) onClick();
      }}
    >
      {label}
    </button>
  );
}

function DockItem({
  id,
  running,
  bouncing,
  label,
  showTooltip,
  onHover,
  onLeave,
  onClick,
  onContextMenu,
}: {
  id: AppId;
  running: boolean;
  bouncing: boolean;
  label: string;
  showTooltip: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      className="relative flex cursor-default flex-col items-center justify-end outline-none"
      style={{ width: SLOT, height: ICON + 12 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      onContextMenu={onContextMenu}
      aria-label={label}
      data-dock-app={id}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.1 }}
            className="dock-tooltip pointer-events-none absolute bottom-[calc(100%+2px)] z-20 whitespace-nowrap rounded-[5px] px-[9px] py-[3px] text-[12px] font-medium tracking-[-0.01em] text-white/95"
          >
            {label}
            <span className="dock-tooltip-caret absolute left-1/2 top-full -mt-px h-[5px] w-[5px] -translate-x-1/2 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative"
        style={{ width: ICON, height: ICON }}
        animate={bouncing ? { y: [0, -16, 0, -9, 0, -3, 0] } : { y: 0 }}
        transition={
          bouncing
            ? {
                duration: 0.85,
                times: [0, 0.16, 0.34, 0.52, 0.68, 0.84, 1],
                ease: "easeOut",
              }
            : { duration: 0.12 }
        }
      >
        <AppIcon
          id={id}
          className="h-full w-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
        />
      </motion.div>

      <span
        className={`pointer-events-none absolute bottom-0 h-[3px] w-[3px] rounded-full bg-white/90 transition-opacity duration-150 ${
          running ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}
