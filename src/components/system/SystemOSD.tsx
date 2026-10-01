"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@/store/osStore";

export function SystemOSD() {
  const osd = useOSStore((s) => s.osd);
  if (!osd.kind) return null;

  const muted = osd.kind === "volume" && osd.value === 0;
  const bars = Math.round(osd.value / 6.25); // 16 segments

  return (
    <AnimatePresence>
      {osd.visible && (
        <motion.div
          className="system-osd pointer-events-none fixed left-1/2 top-[18%] z-[110] flex w-[200px] -translate-x-1/2 flex-col items-center rounded-[18px] px-5 py-4 text-white"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <div className="mb-3 text-white/90">
            {osd.kind === "brightness" ? (
              <svg viewBox="0 0 48 48" className="h-12 w-12 fill-current">
                <circle cx="24" cy="24" r="9" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
                  <rect
                    key={d}
                    x="22"
                    y="4"
                    width="4"
                    height="8"
                    rx="2"
                    transform={`rotate(${d} 24 24)`}
                  />
                ))}
              </svg>
            ) : muted ? (
              <svg viewBox="0 0 48 48" className="h-12 w-12 fill-current">
                <path d="M10 18h8l8-8v28l-8-8h-8V18zm22 2l10 10m0-10L32 30" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 48 48" className="h-12 w-12 fill-current">
                <path d="M10 18h8l8-8v28l-8-8h-8V18z" />
                <path
                  d="M32 16a10 10 0 0 1 0 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
          <div className="flex h-[6px] w-full gap-[3px]">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`h-full flex-1 rounded-sm ${
                  i < bars ? "bg-white" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
