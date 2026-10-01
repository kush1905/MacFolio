"use client";

import { useEffect, useMemo, useState } from "react";
import { WALLPAPERS, resolveWallpaper } from "@/lib/apps";
import { ACCENT_COLORS, FOLDER_COLORS } from "@/lib/appearance";
import { DISPLAY_SCALES, nightShiftActive } from "@/lib/display";
import { content } from "@/lib/content";
import { useOSStore } from "@/store/osStore";
import { TahoeBadge } from "@/components/icons/TahoeBadge";
import { AppleLogo } from "@/components/icons/AppleLogo";
import { UserAvatar } from "@/components/icons/UserAvatar";
import type { FolderColorId, SidebarIconSize, WallpaperId } from "@/types";

type Section =
  | "wifi"
  | "bluetooth"
  | "network"
  | "appearance"
  | "wallpaper"
  | "displays"
  | "dock"
  | "general"
  | "accessibility"
  | "about"
  | "update"
  | "account";

type NavItem = {
  id: Section;
  label: string;
  icon: React.ReactNode;
  accent: string;
};

function IconBox({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="settings-nav-icon flex shrink-0 items-center justify-center rounded-[7px] text-white shadow-sm"
      style={{ background: bg }}
    >
      {children}
    </span>
  );
}

const NAV: NavItem[] = [
  {
    id: "wifi",
    label: "Wi-Fi",
    accent: "linear-gradient(180deg,#3d9bff,#0a84ff)",
    icon: (
      <IconBox bg="linear-gradient(180deg,#3d9bff,#0a84ff)">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-white">
          <path d="M8 13.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm-3.3-3.1a4.7 4.7 0 0 1 6.6 0l-.9.9a3.4 3.4 0 0 0-4.8 0l-.9-.9zm-2.2-2.2a7.8 7.8 0 0 1 11 0l-.9.9a6.5 6.5 0 0 0-9.2 0l-.9-.9z" />
        </svg>
      </IconBox>
    ),
  },
  {
    id: "bluetooth",
    label: "Bluetooth",
    accent: "linear-gradient(180deg,#3d9bff,#0a84ff)",
    icon: (
      <IconBox bg="linear-gradient(180deg,#3d9bff,#0a84ff)">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-white" strokeWidth="1.4">
          <path d="M4.5 4.5 L11.5 11.5 L8 14.5 V1.5 L11.5 4.5 L4.5 11.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </IconBox>
    ),
  },
  {
    id: "network",
    label: "Network",
    accent: "linear-gradient(180deg,#3d9bff,#0a84ff)",
    icon: (
      <IconBox bg="linear-gradient(180deg,#3d9bff,#0a84ff)">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-white">
          <circle cx="8" cy="8" r="2" />
          <path d="M8 2a6 6 0 0 1 0 12 6 6 0 0 1 0-12zm0 2a4 4 0 0 0 0 8 4 4 0 0 0 0-8z" fillOpacity="0.45" />
        </svg>
      </IconBox>
    ),
  },
  {
    id: "appearance",
    label: "Appearance",
    accent: "linear-gradient(180deg,#bf5af2,#8e44d4)",
    icon: (
      <IconBox bg="linear-gradient(135deg,#fff 40%,#1c1c1e 40%)">
        <span className="text-[10px]">◐</span>
      </IconBox>
    ),
  },
  {
    id: "wallpaper",
    label: "Wallpaper",
    accent: "linear-gradient(180deg,#30d158,#248a3d)",
    icon: (
      <IconBox bg="linear-gradient(135deg,#64d2ff,#bf5af2 55%,#ff9f0a)">
        <svg viewBox="0 0 16 16" className="h-3 w-3 fill-white">
          <rect x="1" y="3" width="14" height="10" rx="1.5" fillOpacity="0.3" />
          <circle cx="5" cy="7" r="1.2" />
          <path d="M1 11l4-3 3 2 3-3 4 4v1H1z" />
        </svg>
      </IconBox>
    ),
  },
  {
    id: "displays",
    label: "Displays",
    accent: "linear-gradient(180deg,#0a84ff,#0060df)",
    icon: (
      <IconBox bg="linear-gradient(180deg,#5ac8fa,#007aff)">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-white">
          <rect x="1.5" y="2.5" width="13" height="8.5" rx="1.4" />
          <path d="M5 13h6M8 11v2" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </svg>
      </IconBox>
    ),
  },
  {
    id: "dock",
    label: "Desktop & Dock",
    accent: "linear-gradient(180deg,#0a84ff,#0060df)",
    icon: (
      <IconBox bg="linear-gradient(180deg,#5ac8fa,#007aff)">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-white">
          <rect x="2" y="11" width="12" height="2.5" rx="1" />
          <rect x="3" y="3" width="4" height="6" rx="0.8" opacity="0.85" />
          <rect x="9" y="5" width="4" height="4" rx="0.8" opacity="0.85" />
        </svg>
      </IconBox>
    ),
  },
  {
    id: "general",
    label: "General",
    accent: "linear-gradient(180deg,#8e8e93,#636366)",
    icon: (
      <IconBox bg="linear-gradient(180deg,#8e8e93,#636366)">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-white">
          <circle cx="8" cy="8" r="2.2" fill="none" stroke="white" strokeWidth="1.4" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
            <rect
              key={d}
              x="7"
              y="1.5"
              width="2"
              height="3"
              rx="0.6"
              transform={`rotate(${d} 8 8)`}
            />
          ))}
        </svg>
      </IconBox>
    ),
  },
  {
    id: "accessibility",
    label: "Accessibility",
    accent: "linear-gradient(180deg,#0a84ff,#0060df)",
    icon: (
      <IconBox bg="linear-gradient(180deg,#0a84ff,#0060df)">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-white">
          <circle cx="8" cy="3.5" r="1.6" />
          <path d="M4 7h8l-1.2 7H5.2L4 7z" />
        </svg>
      </IconBox>
    ),
  },
  {
    id: "about",
    label: "About",
    accent: "linear-gradient(180deg,#8e8e93,#636366)",
    icon: (
      <IconBox bg="linear-gradient(180deg,#8e8e93,#636366)">
        <AppleLogo className="h-4 w-4" />
      </IconBox>
    ),
  },
];

const GENERAL_ROWS: { label: string; section?: Section }[] = [
  { label: "About", section: "about" },
  { label: "Software Update", section: "update" },
  { label: "Storage" },
  { label: "Login Items" },
  { label: "Language & Region" },
  { label: "Date & Time" },
  { label: "Sharing" },
  { label: "Time Machine" },
  { label: "Transfer or Reset" },
];

const mac = content.about.aboutThisMac;

export function SettingsApp() {
  const [section, setSection] = useState<Section>("general");
  const [query, setQuery] = useState("");
  const [nightOpen, setNightOpen] = useState(false);
  const preferences = useOSStore((s) => s.preferences);
  const settingsSection = useOSStore((s) => s.settingsSection);
  const consumeSettingsSection = useOSStore((s) => s.consumeSettingsSection);
  const activeWallpaper = resolveWallpaper(preferences.wallpaper);
  const setWallpaper = useOSStore((s) => s.setWallpaper);
  const setTheme = useOSStore((s) => s.setTheme);
  const setLiquidGlass = useOSStore((s) => s.setLiquidGlass);
  const setAccentColor = useOSStore((s) => s.setAccentColor);
  const setFolderColor = useOSStore((s) => s.setFolderColor);
  const setSidebarIconSize = useOSStore((s) => s.setSidebarIconSize);
  const setDisplayScale = useOSStore((s) => s.setDisplayScale);
  const setNightShift = useOSStore((s) => s.setNightShift);
  const setNightShiftSunset = useOSStore((s) => s.setNightShiftSunset);
  const setNightShiftWarmth = useOSStore((s) => s.setNightShiftWarmth);
  const setBrightness = useOSStore((s) => s.setBrightness);
  const setReduceMotion = useOSStore((s) => s.setReduceMotion);
  const setShowDesktopIcons = useOSStore((s) => s.setShowDesktopIcons);

  useEffect(() => {
    if (!settingsSection) return;
    const allowed: Section[] = [
      "wifi",
      "bluetooth",
      "network",
      "appearance",
      "wallpaper",
      "displays",
      "dock",
      "general",
      "accessibility",
      "about",
      "update",
      "account",
    ];
    if (allowed.includes(settingsSection as Section)) {
      setSection(settingsSection as Section);
    }
    consumeSettingsSection();
  }, [settingsSection, consumeSettingsSection]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV;
    return NAV.filter((n) => n.label.toLowerCase().includes(q));
  }, [query]);

  const active = NAV.find((n) => n.id === section) ?? NAV[0];

  return (
    <div className="flex h-full text-[13px] text-white/90">
      {/* Sidebar */}
      <aside className="settings-sidebar mac-scroll flex w-[244px] shrink-0 flex-col border-r border-white/[0.08] pt-11">
        <div className="px-3 pb-2">
          <div className="relative">
            <svg
              viewBox="0 0 16 16"
              className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/35"
            >
              <circle cx="6.5" cy="6.5" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10 10l3.2 3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="select-text w-full rounded-[8px] border border-white/10 bg-white/[0.08] py-1.5 pl-8 pr-3 text-[12px] outline-none placeholder:text-white/35 focus:border-white/20 focus:bg-white/[0.1]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSection("account")}
          className={`mx-2 mb-2 flex cursor-default items-center gap-2.5 rounded-[10px] px-2 py-2 text-left ${
            section === "account"
              ? "bg-white/[0.14]"
              : "hover:bg-white/[0.07]"
          }`}
        >
          <UserAvatar
            size={40}
            className="shadow-md ring-1 ring-white/20"
          />
          <div className="min-w-0">
            <div className="truncate font-semibold leading-tight">
              {content.about.name}
            </div>
            <div className="text-[11px] text-white/45">Apple Account</div>
          </div>
        </button>

        <div className="space-y-0.5 px-2 pb-4">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`flex w-full cursor-default items-center gap-2.5 rounded-[8px] px-2 py-[6px] text-left ${
                section === item.id
                  ? "bg-white/[0.14]"
                  : "hover:bg-white/[0.07]"
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="mac-scroll flex-1 bg-[#1e1e20] pt-10">
        <div className="mx-auto max-w-[520px] px-8 pb-10">
          {section === "general" && (
            <>
              <Header
                icon={active.icon}
                title="General"
                subtitle={`Manage overall system settings on ${mac.osName}`}
              />
              <GroupedList>
                {GENERAL_ROWS.map((row) => (
                  <ChevronRow
                    key={row.label}
                    label={row.label}
                    onClick={() => {
                      if (row.section) setSection(row.section);
                    }}
                  />
                ))}
              </GroupedList>
            </>
          )}

          {section === "appearance" && (
            <>
              <Header
                icon={active.icon}
                title="Appearance"
                subtitle="Light, Dark, Liquid Glass, and accent colors"
              />

              <div className="settings-card space-y-3 p-4">
                <div className="text-[12px] font-medium text-white/55">
                  Appearance
                </div>
                <div className="flex justify-center gap-5">
                  {(["auto", "light", "dark"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className="flex cursor-default flex-col items-center gap-2"
                    >
                      <div
                        className={`h-[70px] w-[108px] overflow-hidden rounded-[10px] border-2 ${
                          preferences.theme === t
                            ? "border-mac-accent"
                            : "border-white/12"
                        }`}
                        style={{
                          background:
                            t === "light"
                              ? "linear-gradient(180deg,#f2f2f7,#e5e5ea)"
                              : t === "dark"
                                ? "linear-gradient(180deg,#2c2c2e,#1c1c1e)"
                                : "linear-gradient(90deg,#f2f2f7 50%,#1c1c1e 50%)",
                        }}
                      />
                      <span className="capitalize text-[12px]">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-card mt-3 space-y-3 p-4">
                <div className="text-[12px] font-medium text-white/55">
                  Liquid Glass
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(["clear", "tinted"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setLiquidGlass(mode)}
                      className="cursor-default text-left"
                    >
                      <div
                        className={`overflow-hidden rounded-[12px] border-2 ${
                          preferences.liquidGlass === mode
                            ? "border-mac-accent"
                            : "border-white/12"
                        }`}
                      >
                        <div
                          className="relative h-[92px]"
                          style={{
                            background:
                              "linear-gradient(135deg,#5b6cff 0%,#c44bff 42%,#5ad0ff 100%)",
                          }}
                        >
                          <div
                            className="absolute inset-3 rounded-[10px] border border-white/25"
                            style={
                              mode === "clear"
                                ? {
                                    background: "rgba(255,255,255,0.18)",
                                    backdropFilter: "blur(18px) saturate(180%)",
                                  }
                                : {
                                    background: `rgba(${
                                      preferences.accentColor === "graphite"
                                        ? "40,40,44,0.72"
                                        : "20,24,48,0.55"
                                    })`,
                                    backdropFilter: "blur(14px) saturate(140%)",
                                    boxShadow:
                                      "inset 0 0 24px rgba(90,80,180,0.35)",
                                  }
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-1.5 text-center text-[12px] capitalize">
                        {mode}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-card mt-3 divide-y divide-white/[0.08]">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span>Color</span>
                  <div className="flex flex-wrap items-center justify-end gap-[7px]">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        title={c.label}
                        onClick={() => setAccentColor(c.id)}
                        className={`h-[22px] w-[22px] cursor-default rounded-full ring-offset-2 ring-offset-[#1e1e20] ${
                          preferences.accentColor === c.id
                            ? "ring-2 ring-white"
                            : "ring-0"
                        }`}
                        style={
                          c.id === "multicolor"
                            ? {
                                background:
                                  "conic-gradient(#0a84ff,#bf5af2,#ff375f,#ff9f0a,#ffd60a,#30d158,#0a84ff)",
                              }
                            : { background: c.hex }
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span>Folder color</span>
                  <MacSelect
                    value={preferences.folderColor}
                    onChange={(v) => setFolderColor(v as FolderColorId)}
                    options={FOLDER_COLORS.map((c) => ({
                      value: c.id,
                      label: c.label,
                      swatch: c.hex,
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span>Sidebar icon size</span>
                  <MacSelect
                    value={preferences.sidebarIconSize}
                    onChange={(v) => setSidebarIconSize(v as SidebarIconSize)}
                    options={[
                      { value: "small", label: "Small" },
                      { value: "medium", label: "Medium" },
                      { value: "large", label: "Large" },
                    ]}
                  />
                </div>
              </div>
            </>
          )}

          {section === "wallpaper" && (
            <>
              <Header icon={active.icon} title="Wallpaper" subtitle="Choose a look for your desktop" />
              <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                <div
                  className="h-36 w-full bg-cover bg-center"
                  style={wallpaperStyle(activeWallpaper)}
                />
              </div>
              <div className="settings-card mb-4 divide-y divide-white/[0.08]">
                <RowToggle
                  label="Dynamic by time of day"
                  on={preferences.wallpaperAuto}
                  onChange={(on) => {
                    useOSStore.getState().setWallpaperAuto(on);
                    if (on) useOSStore.getState().applyTimeWallpaper();
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(WALLPAPERS) as WallpaperId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      useOSStore.getState().setWallpaperAuto(false);
                      setWallpaper(id);
                    }}
                    className={`cursor-default overflow-hidden rounded-xl border-2 text-left transition ${
                      activeWallpaper === id
                        ? "border-mac-accent shadow-[0_0_0_1px_var(--mac-accent)]"
                        : "border-transparent hover:border-white/25"
                    }`}
                  >
                    <div
                      className="h-[72px] w-full bg-cover bg-center"
                      style={wallpaperStyle(id)}
                    />
                    <div className="bg-[#2a2a2c] px-2 py-1.5 text-[11px]">
                      {WALLPAPERS[id].name}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {section === "displays" && (
            <>
              <div className="mb-6 flex flex-col items-center text-center">
                <LaptopPreview wallpaper={activeWallpaper} />
                <div className="mt-3 text-[15px] font-semibold tracking-tight">
                  Built-in Display
                </div>
                <div className="mt-0.5 text-[12px] text-white/45">
                  {mac.model} · {mac.chip}
                </div>
              </div>

              <div className="settings-card p-4">
                <div className="mb-3 text-[12px] font-medium text-white/55">
                  Resolution
                </div>
                <div className="flex justify-center gap-3">
                  {DISPLAY_SCALES.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDisplayScale(opt.id)}
                      className="flex w-[92px] cursor-default flex-col items-center gap-1.5"
                    >
                      <div
                        className={`flex h-[64px] w-[84px] items-center justify-center overflow-hidden rounded-[10px] border-2 bg-[#2a2a2e] ${
                          preferences.displayScale === opt.id
                            ? "border-mac-accent"
                            : "border-white/12"
                        }`}
                      >
                        <div
                          className="rounded-[4px] border border-white/20 bg-[#1c1c1e] px-1.5 py-1 text-white/80"
                          style={{ fontSize: opt.preview }}
                        >
                          Aa
                        </div>
                      </div>
                      <span className="text-center text-[11px] leading-tight text-white/70">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-center text-[11px] text-white/40">
                  Changes text size only. The desktop stays full-screen.
                </p>
              </div>

              <div className="settings-card mt-3 px-4 py-3.5">
                <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-white/55">
                  <SunIcon small />
                  <span className="flex-1">Brightness</span>
                  <SunIcon />
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={preferences.brightness}
                  onChange={(e) =>
                    setBrightness(Number(e.target.value), false)
                  }
                  className="mac-slider w-full"
                />
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setNightOpen((v) => !v)}
                  className={`cursor-default rounded-full px-3.5 py-[6px] text-[12px] ${
                    nightOpen ||
                    nightShiftActive(preferences)
                      ? "bg-mac-accent text-white"
                      : "bg-white/10 hover:bg-white/15"
                  }`}
                >
                  Night Shift…
                </button>
              </div>

              {nightOpen && (
                <div className="settings-card mt-3 divide-y divide-white/[0.08]">
                  <RowToggle
                    label="Night Shift"
                    on={preferences.nightShift}
                    onChange={setNightShift}
                  />
                  <RowToggle
                    label="Sunset to sunrise"
                    on={preferences.nightShiftSunset}
                    onChange={setNightShiftSunset}
                  />
                  <div className="px-4 py-3">
                    <div className="mb-2 flex justify-between text-[12px] text-white/55">
                      <span>Less Warm</span>
                      <span>More Warm</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={preferences.nightShiftWarmth}
                      onChange={(e) =>
                        setNightShiftWarmth(Number(e.target.value))
                      }
                      className="mac-slider w-full"
                    />
                    <p className="mt-2 text-[11px] leading-relaxed text-white/40">
                      Warms the display to make it easier on the eyes at night.
                      Sunset schedule uses 9:00 PM – 6:00 AM local time.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {section === "dock" && (
            <>
              <Header icon={active.icon} title="Desktop & Dock" subtitle="Dock behavior and desktop" />
              <div className="settings-card divide-y divide-white/[0.08]">
                <RowToggle
                  label="Show desktop icons"
                  on={preferences.showDesktopIcons}
                  onChange={setShowDesktopIcons}
                />
              </div>
            </>
          )}

          {section === "accessibility" && (
            <>
              <Header icon={active.icon} title="Accessibility" subtitle="Motion and display" />
              <div className="settings-card">
                <RowToggle
                  label="Reduce motion"
                  on={preferences.reduceMotion}
                  onChange={setReduceMotion}
                />
              </div>
            </>
          )}

          {section === "about" && (
            <>
              <Header
                icon={<TahoeBadge size={56} />}
                title="About"
                subtitle={mac.displayVersion}
              />
              <div className="settings-card mb-3 flex items-center gap-3.5 px-4 py-3.5">
                <TahoeBadge size={48} />
                <div className="min-w-0">
                  <div className="text-[15px] font-medium tracking-tight">
                    {mac.displayVersion}
                  </div>
                  <div className="text-[12px] text-white/45">
                    {mac.version} — {mac.buildSize}
                  </div>
                </div>
              </div>
              <div className="settings-card divide-y divide-white/[0.08]">
                <InfoRow label="Name" value={content.about.name} />
                <InfoRow label="Role" value={content.about.role} />
                <InfoRow label="Model" value={mac.model} />
                <InfoRow label="Chip" value={mac.chip} />
                <InfoRow label="Memory" value={mac.memory} />
                <InfoRow label="System" value={mac.osName} />
                <InfoRow label="Version" value={mac.version} />
              </div>
            </>
          )}

          {section === "update" && (
            <>
              <Header
                icon={<TahoeBadge size={56} />}
                title="Software Update"
                subtitle="Your Mac is up to date"
              />
              <div className="settings-card flex items-center gap-3.5 px-4 py-3.5">
                <TahoeBadge size={48} />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-medium tracking-tight">
                    {mac.displayVersion}
                  </div>
                  <div className="text-[12px] text-white/45">
                    {mac.version} — {mac.buildSize}
                  </div>
                </div>
                <span className="rounded-full bg-[#30d158]/20 px-2.5 py-0.5 text-[11px] font-medium text-[#30d158]">
                  Up to Date
                </span>
              </div>
              <p className="mt-4 text-center text-[12px] text-white/40">
                Automatically keep my Mac up to date
              </p>
            </>
          )}

          {section === "account" && (
            <>
              <Header
                icon={
                  <UserAvatar
                    size={48}
                    className="ring-2 ring-white/20 shadow-md"
                  />
                }
                title={content.about.name}
                subtitle="Apple Account"
              />
              <div className="settings-card divide-y divide-white/[0.08]">
                <InfoRow label="Name" value={content.about.name} />
                <InfoRow label="Email" value={content.about.email} />
                <InfoRow label="Phone" value={content.about.phone} />
                <InfoRow label="Role" value={content.about.role} />
                <InfoRow label="Location" value={content.about.location} />
                <InfoRow
                  label="GitHub"
                  value="github.com/kush1905"
                />
                <InfoRow
                  label="LinkedIn"
                  value="linkedin.com/in/kush-gangwal"
                />
              </div>
            </>
          )}

          {(section === "wifi" ||
            section === "bluetooth" ||
            section === "network") && (
            <>
              <Header
                icon={active.icon}
                title={active.label}
                subtitle="Placeholder — portfolio chrome only"
              />
              <div className="settings-card p-4 text-white/55">
                This pane mirrors macOS System Settings. Wire real network UI later
                if you want — for now it sells the OS illusion.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function wallpaperStyle(id: WallpaperId): React.CSSProperties {
  const w = WALLPAPERS[id];
  if (w.image) {
    return { backgroundImage: `url(${w.image})`, backgroundSize: "cover" };
  }
  return { background: w.css };
}

function LaptopPreview({ wallpaper }: { wallpaper: WallpaperId }) {
  return (
    <div className="relative mx-auto h-[118px] w-[188px]">
      <div className="absolute inset-x-[18px] top-0 overflow-hidden rounded-[10px] border border-white/20 bg-black shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
        <div className="h-[78px] bg-cover bg-center" style={wallpaperStyle(wallpaper)} />
      </div>
      <div className="absolute bottom-[8px] left-1/2 h-[10px] w-[168px] -translate-x-1/2 rounded-b-[10px] bg-gradient-to-b from-[#c8c8cc] to-[#8e8e93]" />
      <div className="absolute bottom-0 left-1/2 h-[8px] w-[72px] -translate-x-1/2 rounded-t-[4px] bg-[#6e6e73]" />
    </div>
  );
}

function SunIcon({ small }: { small?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`${small ? "h-3 w-3" : "h-4 w-4"} fill-white/70`}
    >
      <circle cx="8" cy="8" r={small ? 2.2 : 3} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
        <rect
          key={d}
          x="7.3"
          y="1"
          width="1.4"
          height={small ? 2 : 2.4}
          rx="0.5"
          transform={`rotate(${d} 8 8)`}
        />
      ))}
    </svg>
  );
}

function Header({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-7 flex flex-col items-center text-center">
      <div className="mb-3 origin-center scale-[1.85]">{icon}</div>
      <h2 className="mt-3 text-[22px] font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-white/45">
        {subtitle}
      </p>
    </div>
  );
}

function GroupedList({ children }: { children: React.ReactNode }) {
  return (
    <div className="settings-card divide-y divide-white/[0.08] overflow-hidden">
      {children}
    </div>
  );
}

function ChevronRow({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-default items-center justify-between px-4 py-[11px] text-left hover:bg-white/[0.04]"
    >
      <span>{label}</span>
      <svg viewBox="0 0 8 14" className="h-3 w-2 text-white/25">
        <path
          d="M1 1l5.5 6L1 13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function RowToggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span>{label}</span>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-white/55">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-[22px] w-[40px] shrink-0 cursor-default rounded-full border-0 p-0 transition-colors ${
        on ? "bg-white/45" : "bg-white/20"
      }`}
    >
      <span
        className={`pointer-events-none absolute top-[2px] left-[2px] block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
          on ? "translate-x-[18px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function MacSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; swatch?: string }[];
}) {
  const current = options.find((o) => o.value === value);
  return (
    <label className="relative inline-flex min-w-[148px] items-center">
      {current?.swatch && (
        <span
          className="pointer-events-none absolute left-2.5 h-[11px] w-[11px] rounded-full"
          style={{ background: current.swatch }}
        />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full cursor-default appearance-none rounded-[8px] border border-white/12 bg-white/[0.08] py-[5px] pr-7 text-[13px] outline-none hover:bg-white/[0.12] ${
          current?.swatch ? "pl-7" : "pl-2.5"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 10 6"
        className="pointer-events-none absolute right-2.5 h-2 w-2.5 text-white/50"
      >
        <path
          d="M1 1l4 4 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </label>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-white/[0.08] py-2 last:border-0">
      <span className="text-white/45">{k}</span>
      <span>{v}</span>
    </div>
  );
}
