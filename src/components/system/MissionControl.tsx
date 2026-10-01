"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AppIcon } from "@/components/icons/AppIcon";
import { APPS, WALLPAPERS, resolveWallpaper } from "@/lib/apps";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";

export function MissionControl() {
  const open = useOSStore((s) => s.missionControlOpen);
  const setOpen = useOSStore((s) => s.setMissionControlOpen);
  const wallpaper = resolveWallpaper(
    useOSStore((s) => s.preferences.wallpaper),
  );
  const windows = useWindowStore((s) => s.windows);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);

  const visible = windows.filter((w) => !w.minimized);
  const all = windows;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[88] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div
            className="absolute inset-0 scale-110 blur-2xl"
            style={
              WALLPAPERS[wallpaper].image
                ? {
                    backgroundImage: `url(${WALLPAPERS[wallpaper].image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : { background: WALLPAPERS[wallpaper].css }
            }
          />
          <div className="absolute inset-0 bg-black/45 backdrop-blur-xl" />

          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Exit Mission Control"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-10 flex h-full flex-col px-8 pb-10 pt-12">
            <div className="mb-6 text-center text-[13px] font-medium text-white/70">
              Mission Control · click a window to focus
            </div>

            {all.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-white/50">
                No open windows
              </div>
            ) : (
              <div className="mac-scroll mx-auto grid max-w-6xl flex-1 grid-cols-2 content-start gap-6 md:grid-cols-3">
                {all.map((w, i) => (
                  <motion.button
                    key={w.id}
                    type="button"
                    initial={{ opacity: 0, y: 16, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 380, damping: 28 }}
                    className="group cursor-default text-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (w.minimized) restoreWindow(w.id);
                      else focusWindow(w.id);
                      setOpen(false);
                    }}
                  >
                    <div className="overflow-hidden rounded-[12px] border border-white/20 bg-[#2a2a2c] shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition group-hover:border-white/40 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                      <div className="flex h-8 items-center gap-2 border-b border-white/10 bg-white/5 px-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/90" />
                        <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/90" />
                        <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]/90" />
                        <span className="ml-1 truncate text-[11px] text-white/70">
                          {w.title}
                          {w.minimized ? " (minimized)" : ""}
                        </span>
                      </div>
                      <div className="flex h-[140px] items-center justify-center bg-gradient-to-br from-white/5 to-black/20">
                        <div className="h-16 w-16 drop-shadow-xl">
                          <AppIcon id={w.appId} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-white/80">
                      <div className="h-4 w-4">
                        <AppIcon id={w.appId} />
                      </div>
                      {APPS[w.appId].name}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {visible.length === 0 && all.length > 0 && (
              <div className="mt-4 text-center text-[12px] text-white/45">
                All windows are minimized — click one to restore
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
