"use client";

import type { AppId } from "@/types";

const ICON_SRC: Partial<Record<AppId, string>> = {
  finder: "/assets/macos/icons/finder.png",
  launchpad: "/assets/macos/icons/launchpad.png",
  safari: "/assets/macos/icons/safari.png",
  messages: "/assets/macos/icons/messages.png",
  photos: "/assets/macos/icons/photos.png",
  notes: "/assets/macos/icons/notes.png",
  terminal: "/assets/macos/icons/terminal.png",
  activity: "/assets/macos/icons/activity.png",
  settings: "/assets/macos/icons/settings.png",
  trash: "/assets/macos/icons/trash.png",
  preview: "/assets/macos/icons/document.png",
  vscode: "/assets/macos/icons/vscode.png",
};

function DrawnIcon({ id }: { id: AppId }) {
  if (id === "projects") {
    return (
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[22%]"
        style={{
          background:
            "linear-gradient(150deg,#ff375f 0%,#bf5af2 48%,#0a84ff 120%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
        }}
      >
        <span className="absolute inset-x-[18%] top-[18%] h-[10%] rounded-full bg-white/25" />
        <span className="absolute inset-x-[18%] top-[32%] h-[42%] rounded-[14%] bg-black/25" />
        <svg viewBox="0 0 24 24" className="relative h-[42%] w-[42%] text-white" fill="currentColor">
          <path d="M9 7.2v9.6L17.4 12z" />
        </svg>
      </div>
    );
  }
  if (id === "assistant") {
    return (
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[22%]"
        style={{
          background: "linear-gradient(150deg,#1d1d1f 0%,#2c2c2e 45%,#0a84ff 120%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28)",
        }}
      >
        <span
          className="text-[38%] font-bold tracking-tight text-white"
          style={{ fontFamily: "SF Pro Rounded, SF Pro Display, Helvetica Neue, sans-serif" }}
        >
          KG
        </span>
        <span className="absolute bottom-[14%] text-[18%] font-semibold tracking-wide text-white/70">
          GPT
        </span>
      </div>
    );
  }
  if (id === "preview") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/assets/macos/icons/document.png"
        alt=""
        className="mac-app-icon h-full w-full object-contain"
        draggable={false}
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[22%] bg-white/15 text-white/70">
      ?
    </div>
  );
}

export function AppIcon({
  id,
  className = "",
}: {
  id: AppId;
  className?: string;
}) {
  const src = ICON_SRC[id];
  return (
    <div className={`aspect-square ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          draggable={false}
          className="mac-app-icon h-full w-full object-contain"
        />
      ) : (
        <DrawnIcon id={id} />
      )}
    </div>
  );
}

export function MacOSAssetIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const folder = name === "folder" || name.startsWith("folder-");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/assets/macos/icons/${name}.png`}
      alt=""
      draggable={false}
      className={`object-contain ${folder ? "mac-folder-icon " : ""}${className}`}
    />
  );
}
