"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";
import { APPS, DOCK_ORDER } from "@/lib/apps";
import { AppIcon } from "@/components/icons/AppIcon";
import { WALLPAPERS, resolveWallpaper } from "@/lib/apps";

export function Launchpad() {
  const open = useOSStore((s) => s.launchpadOpen);
  const setOpen = useOSStore((s) => s.setLaunchpadOpen);
  const wallpaper = resolveWallpaper(
    useOSStore((s) => s.preferences.wallpaper),
  );
  const openApp = useWindowStore((s) => s.openApp);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
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
          <div className="absolute inset-0 bg-black/35 backdrop-blur-3xl" />

          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close Launchpad"
            onClick={() => setOpen(false)}
          />

          <motion.div
            className="relative z-10 mx-auto grid max-w-5xl grid-cols-4 gap-x-12 gap-y-14 px-12 pt-[15vh] sm:grid-cols-6"
            initial={{ scale: 1.12, opacity: 0, filter: "blur(8px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 1.06, opacity: 0, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            {DOCK_ORDER.filter((id) => id !== "launchpad").map((id) => (
              <button
                key={id}
                type="button"
                className="group flex cursor-default flex-col items-center gap-2.5 rounded-[16px] px-2 py-2 hover:bg-white/10"
                onClick={() => {
                  openApp(id);
                  setOpen(false);
                }}
              >
                <div className="h-[76px] w-[76px] drop-shadow-[0_16px_28px_rgba(0,0,0,0.45)] transition-transform duration-200 group-hover:scale-[1.06]">
                  <AppIcon id={id} />
                </div>
                <span className="text-[12px] font-medium tracking-[-0.01em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  {APPS[id].name}
                </span>
              </button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
