"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserAvatar } from "@/components/icons/UserAvatar";
import { WALLPAPERS, resolveWallpaper } from "@/lib/apps";
import { useOSStore } from "@/store/osStore";
import { content } from "@/lib/content";

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const wallpaper = resolveWallpaper(
    useOSStore((s) => s.preferences.wallpaper),
  );
  const [now, setNow] = useState(() => new Date());
  const [passwordMode, setPasswordMode] = useState(false);
  const [password, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      // Enter on lock face → reveal password field (macOS-like).
      // Enter in the field → unlock with whatever was typed (any password).
      if (!passwordMode) {
        revealPassword();
        return;
      }
      onUnlock();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [passwordMode, onUnlock]);

  const time = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  /** Click reveals an empty field — any password unlocks */
  const revealPassword = () => {
    setPassword("");
    setPasswordMode(true);
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 40);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[900] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(16px)", scale: 1.02 }}
      transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
      onClick={revealPassword}
    >
      <div
        className="lock-wallpaper absolute inset-0 scale-[1.06]"
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
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="pointer-events-none absolute right-4 top-2.5 z-20 flex items-center gap-2.5 text-[12px] text-white/90">
        <span className="tracking-tight">U.S.</span>
        <svg viewBox="0 0 22 12" className="h-[11px] w-[20px]">
          <rect
            x="0.6"
            y="1.2"
            width="18"
            height="9.6"
            rx="2.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect x="2.2" y="2.8" width="14" height="6.4" rx="1" fill="currentColor" />
          <path
            d="M19.5 4.2h1.2a1 1 0 0 1 1 1v1.6a1 1 0 0 1-1 1h-1.2"
            fill="currentColor"
          />
        </svg>
        <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] fill-current">
          <path d="M8 13a1.15 1.15 0 1 0 0-2.3A1.15 1.15 0 0 0 8 13zm-3.2-3a4.5 4.5 0 0 1 6.4 0l-.85.85a3.3 3.3 0 0 0-4.7 0L4.8 10zm-2.1-2.1a7.5 7.5 0 0 1 10.6 0l-.85.85a6.3 6.3 0 0 0-8.9 0l-.85-.85z" />
        </svg>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center pt-[11vh] text-white">
        <div
          className="mb-1 text-[21px] font-medium tracking-[-0.01em] text-white/95"
          style={{
            fontFamily: '"SF Pro Display", var(--font-mac)',
            textShadow: "0 1px 8px rgba(0,0,0,0.35)",
          }}
        >
          {date}
        </div>
        <div
          className="text-[98px] font-semibold leading-none tracking-[-0.03em]"
          style={{
            fontFamily: '"SF Pro Display", var(--font-mac)',
            textShadow: "0 2px 24px rgba(0,0,0,0.35)",
          }}
        >
          {time.replace(/\s?[AP]M$/i, "")}
        </div>

        <div className="mt-auto mb-[11vh] flex flex-col items-center">
          <UserAvatar
            size={64}
            className="shadow-[0_6px_20px_rgba(0,0,0,0.28),inset_0_0.5px_0_rgba(255,255,255,0.35)] ring-1 ring-white/25"
          />

          <div
            className="mt-[10px] text-[14px] font-normal leading-none tracking-[0.01em] text-white"
            style={{
              fontFamily: '"SF Pro Text", var(--font-mac)',
              textShadow: "0 1px 3px rgba(0,0,0,0.45)",
            }}
          >
            {content.about.name}
          </div>

          <div className="mt-[10px] flex h-[32px] items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {!passwordMode ? (
                <motion.button
                  key="prompt"
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    revealPassword();
                  }}
                  className="cursor-default text-[12px] font-normal leading-none tracking-[0.01em] text-white/[0.72] hover:text-white/90"
                  style={{
                    fontFamily: '"SF Pro Text", var(--font-mac)',
                    textShadow: "0 1px 3px rgba(0,0,0,0.35)",
                  }}
                >
                  Touch ID or Enter Password
                </motion.button>
              ) : (
                <motion.form
                  key="field"
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center"
                  onClick={(e) => e.stopPropagation()}
                  onSubmit={(e) => {
                    e.preventDefault();
                    onUnlock();
                  }}
                >
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      className="w-[200px] rounded-full border border-white/20 bg-black/25 py-[6px] pl-3.5 pr-8 text-center text-[12px] font-normal tracking-[0.18em] text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl placeholder:tracking-normal placeholder:text-white/35 focus:border-white/35"
                      style={{
                        fontFamily: '"SF Pro Text", var(--font-mac)',
                      }}
                    />
                    <button
                      type="submit"
                      aria-label="Unlock"
                      className="absolute right-1 top-1/2 flex h-[20px] w-[20px] -translate-y-1/2 items-center justify-center rounded-full bg-white/18 text-white/90 hover:bg-white/28"
                    >
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-none">
                        <path
                          d="M2.5 6h7M6.5 3.5L9.5 6 6.5 8.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
