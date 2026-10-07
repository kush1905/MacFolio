"use client";

import { useEffect } from "react";

const BOOT_CSS = `
.boot-track{height:4px;width:168px;overflow:hidden;border-radius:999px;background:rgba(255,255,255,.12)}
.boot-bar{height:100%;width:100%;border-radius:999px;background:rgba(255,255,255,.92);transform:scaleX(0);transform-origin:left center;animation:boot-fill .7s cubic-bezier(.22,1,.36,1) forwards}
@keyframes boot-fill{to{transform:scaleX(1)}}
`;

export function BootScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    let cancelled = false;
    const minTime = new Promise((resolve) => window.setTimeout(resolve, 700));
    const lockReady = import("@/components/lock/LockScreen");
    Promise.all([minTime, lockReady]).then(() => {
      if (!cancelled) onDone();
    });
    return () => {
      cancelled = true;
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black text-white">
      <style>{BOOT_CSS}</style>
      <img
        src="/assets/kush/logo-icon.png"
        alt=""
        width={96}
        height={96}
        className="mb-[64px] h-24 w-24 rounded-[22px] object-cover"
      />
      <div className="boot-track" aria-hidden>
        <div className="boot-bar" />
      </div>
    </div>
  );
}
