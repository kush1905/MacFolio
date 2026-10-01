"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppIcon } from "@/components/icons/AppIcon";
import { APPS } from "@/lib/apps";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";
import type { AppId } from "@/types";

export function ForceQuit() {
  const open = useOSStore((s) => s.forceQuitOpen);
  const setOpen = useOSStore((s) => s.setForceQuitOpen);
  const windows = useWindowStore((s) => s.windows);
  const closeApp = useWindowStore((s) => s.closeApp);

  const apps = useMemo(() => {
    const seen = new Set<AppId>();
    return windows
      .filter((w) => {
        if (seen.has(w.appId)) return false;
        seen.add(w.appId);
        return true;
      })
      .map((w) => w.appId);
  }, [windows]);

  const [selected, setSelected] = useState<AppId | null>(null);
  const active = selected && apps.includes(selected) ? selected : apps[0] ?? null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[95] bg-black/40"
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="force-quit pointer-events-auto absolute left-1/2 top-[18%] z-[100] w-[420px] -translate-x-1/2 overflow-hidden rounded-[12px] text-white"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            <div className="border-b border-white/10 px-4 py-3">
              <div className="text-[13px] font-semibold">Force Quit Applications</div>
              <div className="mt-0.5 text-[11px] text-white/50">
                If an app is not responding, select it and click Force Quit.
              </div>
            </div>
            <div className="mac-scroll max-h-[260px] overflow-auto py-1">
              {apps.length === 0 && (
                <div className="px-4 py-8 text-center text-[12px] text-white/45">
                  No applications are open.
                </div>
              )}
              {apps.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left ${
                    active === id ? "bg-mac-accent" : "hover:bg-white/8"
                  }`}
                  onClick={() => setSelected(id)}
                >
                  <div className="h-7 w-7">
                    <AppIcon id={id} />
                  </div>
                  <span className="text-[13px]">{APPS[id].name}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t border-white/10 px-4 py-3">
              <button
                type="button"
                className="rounded-[6px] bg-white/10 px-3 py-1 text-[12px] hover:bg-white/15"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!active}
                className="rounded-[6px] bg-[#ff453a] px-3 py-1 text-[12px] font-medium disabled:opacity-40"
                onClick={() => {
                  if (!active) return;
                  closeApp(active);
                  if (apps.length <= 1) setOpen(false);
                }}
              >
                Force Quit
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
