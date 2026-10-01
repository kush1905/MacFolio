"use client";

import { useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { BootScreen } from "@/components/boot/BootScreen";

const LockScreen = dynamic(() =>
  import("@/components/lock/LockScreen").then((m) => m.LockScreen),
);
const Desktop = dynamic(() =>
  import("@/components/desktop/Desktop").then((m) => m.Desktop),
);
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";
import { APPS } from "@/lib/apps";
import { applyAppearance } from "@/lib/appearance";
import { applyDisplay } from "@/lib/display";
import { startBackendSync } from "@/lib/backendSync";
import { DisplayOverlays } from "@/components/system/DisplayOverlays";
import {
  captureDesktopScreenshot,
  flashScreen,
} from "@/lib/screenshot";

export function OS() {
  const phase = useOSStore((s) => s.phase);
  const setPhase = useOSStore((s) => s.setPhase);
  const unlock = useOSStore((s) => s.unlock);
  const lock = useOSStore((s) => s.lock);
  const appearance = useOSStore((s) => s.preferences);
  const sessionShown = useRef(false);

  useEffect(() => {
    applyAppearance(appearance);
    applyDisplay(appearance);
    useWindowStore.getState().syncLayout();
  }, [appearance]);

  const onBootDone = useCallback(() => setPhase("locked"), [setPhase]);

  useEffect(() => {
    if (phase !== "locked") return;
    void import("@/components/desktop/Desktop");
  }, [phase]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      const os = useOSStore.getState();
      const wins = useWindowStore.getState();
      const desktop = os.phase === "desktop";

      // ⌘Tab App Switcher
      if (desktop && meta && key === "tab") {
        e.preventDefault();
        if (!os.appSwitcherOpen) {
          os.setAppSwitcherOpen(true);
        }
        return;
      }

      // Mission Control — F3 or ⌘↑
      if (
        desktop &&
        (e.key === "F3" ||
          (meta && e.key === "ArrowUp" && !e.altKey && !e.shiftKey))
      ) {
        e.preventDefault();
        os.setMissionControlOpen(!os.missionControlOpen);
        return;
      }

      // Force Quit ⌥⌘Esc
      if (desktop && meta && e.altKey && e.key === "Escape") {
        e.preventDefault();
        os.setForceQuitOpen(true);
        return;
      }

      // Spotlight ⌘K / ⌘Space
      if (desktop && meta && !e.altKey && (key === "k" || e.code === "Space")) {
        e.preventDefault();
        os.setSpotlightOpen(!os.spotlightOpen);
        return;
      }

      // Lock ⌃⌘Q
      if (meta && e.ctrlKey && key === "q") {
        e.preventDefault();
        lock();
        return;
      }

      if (!desktop) return;

      // Screenshots
      if (meta && e.shiftKey && (key === "3" || e.code === "Digit3")) {
        e.preventDefault();
        void (async () => {
          flashScreen();
          const shot = await captureDesktopScreenshot();
          useOSStore.getState().addScreenshot(shot);
        })();
        return;
      }
      if (meta && e.shiftKey && (key === "4" || e.code === "Digit4")) {
        e.preventDefault();
        os.setScreenshotSelectMode(true);
        return;
      }

      // Settings ⌘,
      if (meta && key === ",") {
        e.preventDefault();
        wins.openApp("settings");
        return;
      }

      const focused = wins.getFocused();

      // Close window ⌘W
      if (meta && key === "w" && focused) {
        e.preventDefault();
        wins.closeWindow(focused.id);
        return;
      }

      // Minimize ⌘M
      if (meta && key === "m" && focused) {
        e.preventDefault();
        wins.minimizeWindow(focused.id);
        return;
      }

      // Quit app ⌘Q
      if (meta && key === "q" && !e.ctrlKey && focused) {
        e.preventDefault();
        wins.closeApp(focused.appId);
        os.setActiveMenuApp(null);
        return;
      }

      // Volume / brightness via arrows with alt/ctrl
      if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        const delta = e.key === "ArrowUp" ? 6 : -6;
        os.setVolume(os.preferences.volume + delta);
        return;
      }
      if (e.ctrlKey && !meta && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        const delta = e.key === "ArrowUp" ? 6 : -6;
        os.setBrightness(os.preferences.brightness + delta);
        return;
      }

      if (e.key === "Escape") {
        if (os.missionControlOpen) os.setMissionControlOpen(false);
        else if (os.helpCenterOpen) os.setHelpCenterOpen(false);
        else if (os.aboutThisMacOpen) os.setAboutThisMacOpen(false);
        else if (os.screenshotSelectMode) os.setScreenshotSelectMode(false);
        else if (os.forceQuitOpen) os.setForceQuitOpen(false);
        else if (os.controlCenterOpen) os.setControlCenterOpen(false);
        else if (os.notificationCenterOpen) os.setNotificationCenterOpen(false);
        else if (os.spotlightOpen) os.setSpotlightOpen(false);
        else if (os.launchpadOpen) os.setLaunchpadOpen(false);
        else if (os.appSwitcherOpen) os.setAppSwitcherOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lock]);

  // Quietly keep persisted windows, or open Finder if desktop is empty
  useEffect(() => {
    if (phase !== "desktop") return;

    let cancelled = false;
    const run = () => {
      if (cancelled || sessionShown.current) return;
      sessionShown.current = true;
      const windows = useWindowStore.getState().windows;
      if (windows.length > 0) return;
      window.setTimeout(() => {
        if (cancelled) return;
        useWindowStore.getState().openApp("finder");
        useOSStore.getState().setActiveMenuApp(APPS.finder.name);
      }, 280);
    };

    const persistApi = useWindowStore.persist;
    if (persistApi.hasHydrated()) {
      run();
      return () => {
        cancelled = true;
      };
    }

    const unsub = persistApi.onFinishHydration(() => run());
    return () => {
      cancelled = true;
      unsub();
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "desktop") return;
    return startBackendSync();
  }, [phase]);

  // Auto wallpaper by time of day
  useEffect(() => {
    if (phase !== "desktop") return;
    const apply = () => {
      const os = useOSStore.getState();
      if (os.preferences.wallpaperAuto) os.applyTimeWallpaper();
    };
    apply();
    const id = window.setInterval(apply, 60_000 * 15);
    return () => window.clearInterval(id);
  }, [phase]);

  return (
    <div className="fixed inset-0 z-0 h-dvh w-screen select-none overflow-hidden bg-black">
      <div data-os-stage className="relative h-full w-full">
        <AnimatePresence mode="wait">
          {phase === "booting" && <BootScreen key="boot" onDone={onBootDone} />}
          {phase === "locked" && (
            <LockScreen key="lock" onUnlock={unlock} />
          )}
        </AnimatePresence>
        {phase === "desktop" && <Desktop />}
      </div>
      <DisplayOverlays />
    </div>
  );
}
