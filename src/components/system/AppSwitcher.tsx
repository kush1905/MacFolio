"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppIcon } from "@/components/icons/AppIcon";
import { APPS } from "@/lib/apps";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";
import type { AppId } from "@/types";

export function AppSwitcher() {
  const open = useOSStore((s) => s.appSwitcherOpen);
  const setOpen = useOSStore((s) => s.setAppSwitcherOpen);
  const windows = useWindowStore((s) => s.windows);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const openApp = useWindowStore((s) => s.openApp);
  const setActiveMenuApp = useOSStore((s) => s.setActiveMenuApp);

  const apps = useMemo(() => {
    const seen = new Set<AppId>();
    const ordered = [...windows].sort((a, b) => b.zIndex - a.zIndex);
    const list: AppId[] = [];
    for (const w of ordered) {
      if (!seen.has(w.appId)) {
        seen.add(w.appId);
        list.push(w.appId);
      }
    }
    if (list.length === 0) list.push("finder");
    return list;
  }, [windows]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setIndex(apps.length > 1 ? 1 : 0);
  }, [open, apps.length]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        setIndex((i) => {
          const next = e.shiftKey
            ? (i - 1 + apps.length) % apps.length
            : (i + 1) % apps.length;
          return next;
        });
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        activate(apps[index]);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Meta" || e.key === "Control") {
        activate(apps[index]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, apps, index]);

  const activate = (id: AppId) => {
    const win = windows.find((w) => w.appId === id);
    if (win) focusWindow(win.id);
    else openApp(id);
    setActiveMenuApp(APPS[id].name);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-[90] flex items-center justify-center bg-black/25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="app-switcher flex max-w-[90vw] items-end gap-3 rounded-[22px] px-5 pb-4 pt-5"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
          >
            {apps.map((id, i) => (
              <button
                key={id}
                type="button"
                className={`flex w-[88px] flex-col items-center gap-2 rounded-[14px] px-2 py-2 ${
                  i === index ? "bg-white/20 ring-2 ring-white/40" : ""
                }`}
                onClick={() => activate(id)}
                onMouseEnter={() => setIndex(i)}
              >
                <div className="h-16 w-16 drop-shadow-xl">
                  <AppIcon id={id} />
                </div>
                <span className="truncate text-[11px] font-medium text-white">
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
