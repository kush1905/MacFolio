"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate as animateMv } from "framer-motion";
import { TrafficLights } from "./TrafficLights";
import {
  isFullscreenWindow,
  menuBarOffset,
  useWindowStore,
} from "@/store/windowStore";
import { useOSStore } from "@/store/osStore";
import { APPS } from "@/lib/apps";
import { liveDisplayZoom } from "@/lib/display";
import type { WindowState } from "@/types";
import { AppContent } from "@/components/apps/AppContent";
import {
  getDockIconTarget,
  MAC_GENIE_EASE,
  MAC_GENIE_EASE_OUT,
  MAC_WINDOW_SPRING,
  MAC_ZOOM_TWEEN,
} from "@/lib/windowMotion";

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

type GenieState = {
  tx: number;
  ty: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  originX: string;
  originY: string;
};

export function WindowFrame({ win }: { win: WindowState }) {
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const tileWindow = useWindowStore((s) => s.tileWindow);
  const moveWindow = useWindowStore((s) => s.moveWindow);
  const resizeWindow = useWindowStore((s) => s.resizeWindow);
  const pullDownFromMaximized = useWindowStore((s) => s.pullDownFromMaximized);
  const clearAnimOrigin = useWindowStore((s) => s.clearAnimOrigin);
  const setActiveMenuApp = useOSStore((s) => s.setActiveMenuApp);
  const reduceMotion = useOSStore((s) => s.preferences.reduceMotion);

  const unified = APPS[win.appId].chrome === "unified";
  const dim = !win.focused;
  const fullscreen = isFullscreenWindow(win);
  const { x, y, width, height } = win.bounds;

  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [exiting, setExiting] = useState<"close" | "minimize" | null>(null);
  const [genie, setGenie] = useState<GenieState | null>(null);
  const [entered, setEntered] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Motion values for 1:1 drag (no React re-render lag mid-frame)
  const mvX = useMotionValue(x);
  const mvY = useMotionValue(Math.max(menuBarOffset(), y));
  const mvW = useMotionValue(width);
  const mvH = useMotionValue(height);
  const visualY = useTransform(mvY, (v) => Math.max(menuBarOffset(), v));

  // Sync store → motion when not actively dragging/resizing
  useLayoutEffect(() => {
    if (dragging || resizing || exiting) return;
    const clampedY = Math.max(menuBarOffset(), y);
    const motion = fullscreen || win.tiled ? MAC_ZOOM_TWEEN : MAC_WINDOW_SPRING;
    if (reduceMotion) {
      mvX.set(x);
      mvY.set(clampedY);
      mvW.set(width);
      mvH.set(height);
      return;
    }
    const ctrls = [
      animateMv(mvX, x, motion),
      // Tween Y so the frame cannot spring-overshoot into the menu bar
      animateMv(mvY, clampedY, MAC_ZOOM_TWEEN),
      animateMv(mvW, width, motion),
      animateMv(mvH, height, motion),
    ];
    return () => ctrls.forEach((c) => c.stop());
  }, [
    x,
    y,
    width,
    height,
    dragging,
    resizing,
    exiting,
    reduceMotion,
    fullscreen,
    win.tiled,
    mvX,
    mvY,
    mvW,
    mvH,
  ]);

  // Open / restore entrance
  useEffect(() => {
    if (reduceMotion || entered) return;
    if (!win.animOrigin) {
      setEntered(true);
      return;
    }

    if (win.animOrigin === "dock") {
      const dock = getDockIconTarget(win.appId);
      const cx = x + width / 2;
      const cy = y + height / 2;
      setGenie({
        tx: dock.x - cx,
        ty: dock.y - cy,
        scaleX: 0.08,
        scaleY: 0.04,
        opacity: 0.35,
        originX: "50%",
        originY: "100%",
      });
      // next frame → expand out of dock
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setGenie({
            tx: 0,
            ty: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            originX: "50%",
            originY: "100%",
          });
          setEntered(true);
          clearAnimOrigin(win.id);
        });
      });
    } else {
      // Fresh open: macOS-like scale + fade from slightly below
      setGenie({
        tx: 0,
        ty: 14,
        scaleX: 0.96,
        scaleY: 0.96,
        opacity: 0,
        originX: "50%",
        originY: "50%",
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setGenie({
            tx: 0,
            ty: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            originX: "50%",
            originY: "50%",
          });
          setEntered(true);
          clearAnimOrigin(win.id);
        });
      });
    }
  }, [
    win.animOrigin,
    win.appId,
    win.id,
    x,
    y,
    width,
    height,
    reduceMotion,
    entered,
    clearAnimOrigin,
  ]);

  useEffect(() => {
    setExiting(null);
    setGenie(null);
    setEntered(false);
  }, [win.id]);

  const onFocus = useCallback(() => {
    focusWindow(win.id);
    setActiveMenuApp(APPS[win.appId].name);
  }, [focusWindow, setActiveMenuApp, win.appId, win.id]);

  const requestClose = () => {
    if (reduceMotion) {
      closeWindow(win.id);
      return;
    }
    setExiting("close");
    setGenie({
      tx: 0,
      ty: 0,
      scaleX: 0.97,
      scaleY: 0.97,
      opacity: 0,
      originX: "50%",
      originY: "40%",
    });
  };

  const requestMinimize = () => {
    if (reduceMotion) {
      minimizeWindow(win.id);
      return;
    }
    const dock = getDockIconTarget(win.appId);
    const left = mvX.get();
    const top = mvY.get();
    const w = mvW.get();
    const h = mvH.get();
    const cx = left + w / 2;
    const cy = top + h;
    const originX = `${((dock.x - left) / Math.max(1, w)) * 100}%`;

    setExiting("minimize");
    // Phase 1 — stretch toward dock (classic genie inhale)
    setGenie({
      tx: (dock.x - cx) * 0.25,
      ty: Math.max(24, (dock.y - cy) * 0.2),
      scaleX: 0.82,
      scaleY: 1.08,
      opacity: 1,
      originX,
      originY: "100%",
    });

    window.setTimeout(() => {
      // Phase 2 — suck into dock icon
      setGenie({
        tx: dock.x - cx,
        ty: dock.y - cy + 10,
        scaleX: 0.05,
        scaleY: 0.015,
        opacity: 0.15,
        originX,
        originY: "100%",
      });
    }, 90);
  };

  const finishExit = () => {
    if (exiting === "close") closeWindow(win.id);
    if (exiting === "minimize") minimizeWindow(win.id);
  };

  /* ─── 1:1 titlebar drag (macOS: immediate follow, no spring) ─── */
  const beginDrag = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest("button, input, a, textarea, select")) return;

      onFocus();
      e.preventDefault();

      let startX = e.clientX;
      let startY = e.clientY;
      let origX = mvX.get();
      let origY = mvY.get();

      // Pull down from full-screen / tile — place restored window under cursor
      if (win.maximized || win.tiled) {
        const z = liveDisplayZoom();
        pullDownFromMaximized(win.id, e.clientX / z, e.clientY / z);
        const next = useWindowStore.getState().windows.find((w) => w.id === win.id);
        if (next) {
          mvX.set(next.bounds.x);
          mvY.set(next.bounds.y);
          mvW.set(next.bounds.width);
          mvH.set(next.bounds.height);
          origX = next.bounds.x;
          origY = next.bounds.y;
        }
      }

      setDragging(true);
      document.body.classList.add("is-window-dragging");

      const onMove = (ev: PointerEvent) => {
        const z = liveDisplayZoom();
        const floor = menuBarOffset();
        const nx = origX + (ev.clientX - startX) / z;
        const ny = Math.max(floor, origY + (ev.clientY - startY) / z);
        // Live paint via motion values — zero React lag
        mvX.set(nx);
        mvY.set(ny);
      };

      const onUp = (ev: PointerEvent) => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        document.body.classList.remove("is-window-dragging");
        setDragging(false);
        const z = liveDisplayZoom();
        const floor = menuBarOffset();
        const nx = origX + (ev.clientX - startX) / z;
        const ny = Math.max(floor, origY + (ev.clientY - startY) / z);
        moveWindow(win.id, nx, ny);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [
      onFocus,
      win.maximized,
      win.tiled,
      win.id,
      pullDownFromMaximized,
      moveWindow,
      mvX,
      mvY,
      mvW,
      mvH,
    ],
  );

  /* ─── Resize edges ─── */
  const startResize = useCallback(
    (edge: Edge, e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (win.maximized) return;
      onFocus();
      setResizing(true);
      document.body.classList.add("is-window-resizing");

      const startX = e.clientX;
      const startY = e.clientY;
      const orig = {
        x: mvX.get(),
        y: mvY.get(),
        width: mvW.get(),
        height: mvH.get(),
      };
      const min = APPS[win.appId].minSize;

      const onMove = (ev: PointerEvent) => {
        const z = liveDisplayZoom();
        const dx = (ev.clientX - startX) / z;
        const dy = (ev.clientY - startY) / z;
        let next = { ...orig };

        if (edge.includes("e")) next.width = orig.width + dx;
        if (edge.includes("s")) next.height = orig.height + dy;
        if (edge.includes("w")) {
          next.width = orig.width - dx;
          next.x = orig.x + dx;
          if (next.width < min.width) {
            next.x = orig.x + orig.width - min.width;
            next.width = min.width;
          }
        }
        if (edge.includes("n")) {
          const floor = menuBarOffset();
          next.height = orig.height - dy;
          next.y = orig.y + dy;
          if (next.y < floor) {
            next.height -= floor - next.y;
            next.y = floor;
          }
          if (next.height < min.height) {
            next.y = orig.y + orig.height - min.height;
            next.height = min.height;
            if (next.y < floor) {
              next.y = floor;
              next.height = orig.y + orig.height - floor;
            }
          }
        }

        next.width = Math.max(min.width, next.width);
        next.height = Math.max(min.height, next.height);
        mvX.set(next.x);
        mvY.set(next.y);
        mvW.set(next.width);
        mvH.set(next.height);
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        document.body.classList.remove("is-window-resizing");
        setResizing(false);
        resizeWindow(win.id, {
          x: mvX.get(),
          y: mvY.get(),
          width: mvW.get(),
          height: mvH.get(),
        });
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [onFocus, win.maximized, win.appId, win.id, resizeWindow, mvX, mvY, mvW, mvH],
  );

  const shellTransform = genie ?? {
    tx: 0,
    ty: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: dim ? 0.94 : 1,
    originX: "50%",
    originY: "50%",
  };

  return (
    <motion.div
      ref={frameRef}
      className="pointer-events-auto absolute will-change-transform"
      style={{
        left: mvX,
        top: visualY,
        width: mvW,
        height: mvH,
        zIndex: win.zIndex,
      }}
      onMouseDown={onFocus}
    >
      <motion.div
        className={`flex h-full w-full flex-col overflow-hidden ${
          fullscreen ? "rounded-none" : "rounded-[var(--window-radius)]"
        } ${
          win.appId === "terminal"
            ? "window-terminal"
            : fullscreen
              ? ""
              : dragging
                ? "window-shadow-dragging"
                : win.focused
                  ? "window-shadow-focused"
                  : "window-shadow"
        } ${
          win.appId === "terminal" && win.focused && !fullscreen
            ? "window-shadow-focused"
            : ""
        } ${dragging ? "window-dragging" : ""}`}
        style={{
          background:
            win.appId === "terminal"
              ? "#161618"
              : unified
                ? "transparent"
                : "var(--window-bg)",
          transformOrigin: `${shellTransform.originX} ${shellTransform.originY}`,
        }}
        animate={{
          x: shellTransform.tx,
          y: Math.max(shellTransform.ty, menuBarOffset() - Math.max(menuBarOffset(), y)),
          scaleX: shellTransform.scaleX,
          scaleY: shellTransform.scaleY,
          opacity: shellTransform.opacity,
          filter:
            exiting === "minimize"
              ? "blur(1.2px) brightness(1.05)"
              : "blur(0px) brightness(1)",
        }}
        transition={
          exiting === "minimize"
            ? {
                duration: shellTransform.scaleY < 0.5 ? 0.42 : 0.12,
                ease:
                  shellTransform.scaleY < 0.5
                    ? MAC_GENIE_EASE
                    : ([0.2, 0.8, 0.2, 1] as const),
              }
            : exiting === "close"
              ? { duration: 0.16, ease: "easeIn" }
              : !entered
                ? { duration: 0.48, ease: MAC_GENIE_EASE_OUT }
                : { type: "spring", stiffness: 520, damping: 36, mass: 0.75 }
        }
        onAnimationComplete={() => {
          if (exiting === "minimize" && shellTransform.scaleY > 0.5) {
            // wait for phase 2
            return;
          }
          if (exiting) finishExit();
          if (entered && genie && !exiting && genie.scaleX === 1) {
            setGenie(null);
          }
        }}
      >
        {/* Subtle live preview shear while genie-ing */}
        {exiting === "minimize" && (
          <div className="pointer-events-none absolute inset-0 z-50 bg-gradient-to-b from-transparent via-transparent to-white/10" />
        )}

        {unified ? (
          <>
            <div className="absolute left-[8px] top-[15px] z-40">
              <TrafficLights
                focused={win.focused}
                onClose={requestClose}
                onMinimize={requestMinimize}
                onMaximize={() => toggleMaximize(win.id)}
                onTileLeft={() => tileWindow(win.id, "left")}
                onTileRight={() => tileWindow(win.id, "right")}
                onFill={() => tileWindow(win.id, "fill")}
              />
            </div>
            <div
              className={`relative z-10 min-h-0 flex-1 overflow-hidden bg-[var(--window-bg)] ${
                fullscreen ? "" : "rounded-[var(--window-radius)]"
              }`}
              onPointerDown={(e) => {
                const node = e.currentTarget;
                if (e.clientY - node.getBoundingClientRect().top > 48) return;
                beginDrag(e);
              }}
              onDoubleClick={(e) => {
                const t = e.target as HTMLElement;
                if (t.closest("button, input, a, textarea, select")) return;
                const node = e.currentTarget;
                if (e.clientY - node.getBoundingClientRect().top > 48) return;
                toggleMaximize(win.id);
              }}
            >
              <AppContent appId={win.appId} windowId={win.id} />
            </div>
          </>
        ) : (
          <>
            <div
              className={`window-drag relative flex shrink-0 items-center ${
                win.appId === "terminal"
                  ? "h-[28px] gap-[8px] pl-[8px] pr-3"
                  : "h-[28px] pl-[8px] pr-3.5"
              }`}
              style={
                win.appId === "terminal"
                  ? {
                      background: "#1c1c1e",
                      borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                    }
                  : {
                      background:
                        "linear-gradient(180deg, rgba(62,62,64,0.98), rgba(48,48,50,0.98))",
                      borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                    }
              }
              onPointerDown={beginDrag}
              onDoubleClick={() => toggleMaximize(win.id)}
            >
              <TrafficLights
                focused={win.focused}
                onClose={requestClose}
                onMinimize={requestMinimize}
                onMaximize={() => toggleMaximize(win.id)}
                onTileLeft={() => tileWindow(win.id, "left")}
                onTileRight={() => tileWindow(win.id, "right")}
                onFill={() => tileWindow(win.id, "fill")}
              />
              {win.appId === "terminal" ? (
                <div className="pointer-events-none flex min-w-0 items-center gap-[6px]">
                  <svg
                    viewBox="0 0 16 13"
                    className="h-[13px] w-4 shrink-0"
                    aria-hidden
                  >
                    <path
                      d="M1.2 3.4c0-.7.55-1.25 1.25-1.25h3.35l.85 1.15h6.9c.7 0 1.25.55 1.25 1.25v6.2c0 .7-.55 1.25-1.25 1.25H2.45c-.7 0-1.25-.55-1.25-1.25V3.4z"
                      fill="#5ac8fa"
                    />
                    <path
                      d="M1.2 4.7h13.6v6.05c0 .55-.45 1-1 1H2.2c-.55 0-1-.45-1-1V4.7z"
                      fill="var(--mac-accent)"
                    />
                    <path
                      d="M5.45 2.15h3.55l.7.95H5.45z"
                      fill="#64d2ff"
                      opacity="0.9"
                    />
                  </svg>
                  <span
                    className={`truncate text-[13px] font-normal tracking-[-0.01em] ${
                      win.focused ? "text-white/90" : "text-white/40"
                    }`}
                  >
                    {win.title}
                  </span>
                </div>
              ) : (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span
                    className={`text-[13px] font-medium tracking-[-0.01em] ${
                      win.focused ? "text-white/90" : "text-white/40"
                    }`}
                  >
                    {win.title}
                  </span>
                </div>
              )}
            </div>
            <div
              className="relative min-h-0 flex-1 overflow-hidden"
              style={
                win.appId === "terminal" ? { background: "#161618" } : undefined
              }
            >
              <AppContent appId={win.appId} windowId={win.id} />
            </div>
          </>
        )}

        {!win.maximized && !exiting && (
          <>
            <div
              className="resize-n absolute left-3 right-3 top-0 z-50 h-1.5"
              onPointerDown={(e) => startResize("n", e)}
            />
            <div
              className="resize-s absolute bottom-0 left-3 right-3 z-50 h-1.5"
              onPointerDown={(e) => startResize("s", e)}
            />
            <div
              className="resize-e absolute bottom-3 right-0 top-3 z-50 w-1.5"
              onPointerDown={(e) => startResize("e", e)}
            />
            <div
              className="resize-w absolute bottom-3 left-0 top-3 z-50 w-1.5"
              onPointerDown={(e) => startResize("w", e)}
            />
            <div
              className="resize-nw absolute left-0 top-0 z-50 h-3 w-3"
              onPointerDown={(e) => startResize("nw", e)}
            />
            <div
              className="resize-ne absolute right-0 top-0 z-50 h-3 w-3"
              onPointerDown={(e) => startResize("ne", e)}
            />
            <div
              className="resize-sw absolute bottom-0 left-0 z-50 h-3 w-3"
              onPointerDown={(e) => startResize("sw", e)}
            />
            <div
              className="resize-se absolute bottom-0 right-0 z-50 h-3.5 w-3.5"
              onPointerDown={(e) => startResize("se", e)}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
