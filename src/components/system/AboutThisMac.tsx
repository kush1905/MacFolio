"use client";

import { motion, AnimatePresence } from "framer-motion";
import { content } from "@/lib/content";
import { useOSStore } from "@/store/osStore";
import { UserAvatar } from "@/components/icons/UserAvatar";

export function AboutThisMac() {
  const open = useOSStore((s) => s.aboutThisMacOpen);
  const setOpen = useOSStore((s) => s.setAboutThisMacOpen);
  const mac = content.about.aboutThisMac;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[120] bg-black/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="about-mac-modal pointer-events-auto fixed left-1/2 top-[16%] z-[130] w-[420px] -translate-x-1/2 overflow-hidden rounded-[14px] text-white"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <div className="flex flex-col items-center px-8 pb-5 pt-7">
              <UserAvatar
                size={72}
                className="mb-4 ring-2 ring-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              />
              <div className="text-[20px] font-semibold tracking-[-0.02em]">
                {content.about.name}
              </div>
              <div className="mt-0.5 text-[12px] text-white/50">
                PortfolioOS 1.0
              </div>
            </div>

            <div className="mx-5 mb-5 overflow-hidden rounded-[10px] bg-white/[0.06]">
              <Row label="Name" value={content.about.name} />
              <Row label="Version" value="PortfolioOS 1.0" />
              <Row label="Processor" value="Full Stack Developer" />
              <Row label="Memory" value="React + Node + Java" />
              <Row
                label="Storage"
                value="LeetCode & GFG · 2 badges"
              />
              <Row label="Chip" value={mac.chip} />
              <Row label="System" value={mac.displayVersion} last />
            </div>

            <div className="flex justify-center gap-2 pb-5">
              <button
                type="button"
                className="rounded-[6px] bg-white/12 px-3.5 py-1 text-[12px] hover:bg-white/18"
                onClick={() => setOpen(false)}
              >
                OK
              </button>
              <button
                type="button"
                className="rounded-[6px] bg-mac-accent px-3.5 py-1 text-[12px] font-medium"
                onClick={() => {
                  setOpen(false);
                  useOSStore.getState().openSettingsSection("about");
                  // open settings via dynamic import-free store hop
                  import("@/store/windowStore").then(({ useWindowStore }) => {
                    useWindowStore.getState().openApp("settings");
                  });
                }}
              >
                More Info…
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[112px_1fr] gap-3 px-3.5 py-2 text-[12px] ${
        last ? "" : "border-b border-white/[0.06]"
      }`}
    >
      <span className="text-right text-white/45">{label}</span>
      <span className="font-medium text-white/90">{value}</span>
    </div>
  );
}
