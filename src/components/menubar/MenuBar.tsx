"use client";

import { useEffect, useState } from "react";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";
import { APPS } from "@/lib/apps";
import { content } from "@/lib/content";
import { AppleLogo } from "@/components/icons/AppleLogo";
import {
  BatterySymbol,
  ControlCenterSymbol,
  SpotlightSymbol,
  WifiSymbol,
} from "@/components/icons/MenuBarSymbols";

type MenuKey = "File" | "Edit" | "View" | "Window" | "Help" | null;

/** On macOS, -apple-system resolves to real SF Pro. Named SF Pro is optional if installed. */
const MENU_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';

export function MenuBar() {
  const activeMenuApp = useOSStore((s) => s.activeMenuApp);
  const setSpotlightOpen = useOSStore((s) => s.setSpotlightOpen);
  const setControlCenterOpen = useOSStore((s) => s.setControlCenterOpen);
  const controlCenterOpen = useOSStore((s) => s.controlCenterOpen);
  const setNotificationCenterOpen = useOSStore(
    (s) => s.setNotificationCenterOpen,
  );
  const notificationCenterOpen = useOSStore((s) => s.notificationCenterOpen);
  const setForceQuitOpen = useOSStore((s) => s.setForceQuitOpen);
  const wifi = useOSStore((s) => s.preferences.wifi);
  const lock = useOSStore((s) => s.lock);
  const focused = useWindowStore((s) => s.getFocused());
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const closeApp = useWindowStore((s) => s.closeApp);
  const tileWindow = useWindowStore((s) => s.tileWindow);

  const [now, setNow] = useState(() => new Date());
  const [appleOpen, setAppleOpen] = useState(false);
  const [menu, setMenu] = useState<MenuKey>(null);
  const [statusMenu, setStatusMenu] = useState<"battery" | "wifi" | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);

  const appName =
    activeMenuApp ?? (focused ? APPS[focused.appId].name : "Finder");

  // Match real macOS menubar clock: "Sun Aug 9  6:50 AM"
  const weekday = now.toLocaleString("en-US", { weekday: "short" });
  const month = now.toLocaleString("en-US", { month: "short" });
  const day = now.getDate();
  const clock = now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const time = `${weekday} ${month} ${day}  ${clock}`;

  // Portfolio Mac — always “charging” look like a plugged-in MacBook
  const batteryPct = 95;

  const closeMenus = () => {
    setAppleOpen(false);
    setMenu(null);
    setStatusMenu(null);
  };

  return (
    <header
      data-menu-bar
      className="pointer-events-auto fixed inset-x-0 top-0 z-[200] text-white"
      style={{
        height: "calc(var(--menu-bar-h) + env(safe-area-inset-top, 0px))",
        paddingTop: "env(safe-area-inset-top, 0px)",
        fontFamily: MENU_FONT,
        fontSize: "calc(13px * var(--text-scale, 1))",
        letterSpacing: "-0.01em",
        lineHeight: 1,
        WebkitFontSmoothing: "antialiased",
        textShadow: "0 0.5px 1.5px rgba(0,0,0,0.45)",
      }}
    >
      <div
        className="menubar-glass pointer-events-none absolute inset-0"
        aria-hidden
      />

      <div className="relative z-10 flex h-full w-full items-center pl-[10px] pr-[12px]">
        {/* Left: Apple + App + menus */}
        <div className="relative flex h-full items-center">
          <button
            type="button"
            className={`flex h-[22px] cursor-default items-center rounded-[4px] px-[7px] ${
              appleOpen ? "bg-white/20" : "hover:bg-white/15"
            }`}
            onClick={() => {
              setMenu(null);
              setAppleOpen((v) => !v);
            }}
            aria-label="Apple menu"
          >
            <AppleLogo className="h-[16px] w-[15px]" />
          </button>

          {appleOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeMenus} />
              <div className="menu-dropdown absolute left-0 top-[22px] z-50 w-[250px] overflow-hidden rounded-[8px] py-1 text-[13px]">
                <MenuItem
                  label="About This Mac"
                  onClick={() => {
                    closeMenus();
                    useOSStore.getState().setAboutThisMacOpen(true);
                  }}
                />
                <div className="my-1 h-px bg-white/10" />
                <MenuItem
                  label="System Settings…"
                  onClick={() => {
                    closeMenus();
                    useWindowStore.getState().openApp("settings");
                  }}
                />
                <MenuItem label="App Store…" disabled onClick={closeMenus} />
                <div className="my-1 h-px bg-white/10" />
                <MenuItem
                  label="Force Quit…"
                  shortcut="⌥⌘Esc"
                  onClick={() => {
                    closeMenus();
                    setForceQuitOpen(true);
                  }}
                />
                <div className="my-1 h-px bg-white/10" />
                <MenuItem
                  label="Sleep"
                  onClick={() => {
                    closeMenus();
                    lock();
                  }}
                />
                <MenuItem
                  label="Lock Screen"
                  shortcut="⌃⌘Q"
                  onClick={() => {
                    closeMenus();
                    lock();
                  }}
                />
                <MenuItem
                  label={`Log Out ${content.about.name}…`}
                  onClick={() => {
                    closeMenus();
                    lock();
                  }}
                />
              </div>
            </>
          )}

          {/* Active app — Bold like real macOS */}
          <span
            className="ml-[2px] cursor-default px-[7px] leading-none"
            style={{ fontWeight: 700 }}
          >
            {appName}
          </span>

          {(
            [
              {
                key: "File" as const,
                items: [
                  {
                    label: `New Window`,
                    action: () =>
                      useWindowStore
                        .getState()
                        .openApp(focused?.appId ?? "finder"),
                  },
                  {
                    label: "Close Window",
                    shortcut: "⌘W",
                    action: () => focused && closeWindow(focused.id),
                  },
                ],
              },
              {
                key: "Edit" as const,
                items: [
                  { label: "Undo", shortcut: "⌘Z", disabled: true },
                  { label: "Cut", shortcut: "⌘X", disabled: true },
                  { label: "Copy", shortcut: "⌘C", disabled: true },
                  { label: "Paste", shortcut: "⌘V", disabled: true },
                ],
              },
              {
                key: "View" as const,
                items: [
                  {
                    label: "Show Launchpad",
                    action: () => useOSStore.getState().setLaunchpadOpen(true),
                  },
                  {
                    label: "Enter Full Screen",
                    action: () => focused && toggleMaximize(focused.id),
                  },
                ],
              },
              {
                key: "Window" as const,
                items: [
                  {
                    label: "Mission Control",
                    shortcut: "F3",
                    action: () =>
                      useOSStore
                        .getState()
                        .setMissionControlOpen(
                          !useOSStore.getState().missionControlOpen,
                        ),
                  },
                  {
                    label: "Minimize",
                    shortcut: "⌘M",
                    action: () => focused && minimizeWindow(focused.id),
                  },
                  {
                    label: "Zoom",
                    action: () => focused && toggleMaximize(focused.id),
                  },
                  {
                    label: "Tile Left",
                    action: () => focused && tileWindow(focused.id, "left"),
                  },
                  {
                    label: "Tile Right",
                    action: () => focused && tileWindow(focused.id, "right"),
                  },
                  {
                    label: `Bring All to Front`,
                    action: () => {
                      if (focused)
                        useWindowStore.getState().focusWindow(focused.id);
                    },
                  },
                ],
              },
              {
                key: "Help" as const,
                items: [
                  {
                    label: "PortfolioOS Help…",
                    action: () =>
                      useOSStore.getState().setHelpCenterOpen(true, "finder"),
                  },
                  {
                    label: `${appName} Help`,
                    action: () => {
                      const id = focused?.appId ?? "finder";
                      useOSStore.getState().setHelpCenterOpen(true, id);
                    },
                  },
                  {
                    label: "What Each App Does…",
                    action: () =>
                      useOSStore.getState().setHelpCenterOpen(true, "finder"),
                  },
                  {
                    label: "Spotlight Search…",
                    shortcut: "⌘Space",
                    action: () => setSpotlightOpen(true),
                  },
                  {
                    label: "Terminal Commands…",
                    action: () =>
                      useOSStore.getState().setHelpCenterOpen(true, "terminal"),
                  },
                  {
                    label: "Resume / Preview…",
                    action: () =>
                      useOSStore.getState().setHelpCenterOpen(true, "preview"),
                  },
                ],
              },
            ] as const
          ).map((m) => (
            <div key={m.key} className="relative hidden sm:block">
              <button
                type="button"
                className={`flex h-[22px] cursor-default items-center rounded-[4px] px-[7px] leading-none ${
                  menu === m.key ? "bg-white/20" : "hover:bg-white/15"
                }`}
                style={{ fontWeight: 500 }}
                onClick={() => {
                  setAppleOpen(false);
                  setMenu((cur) => (cur === m.key ? null : m.key));
                }}
                onMouseEnter={() => {
                  if (menu) setMenu(m.key);
                }}
              >
                {m.key}
              </button>
              {menu === m.key && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeMenus} />
                  <div className="menu-dropdown absolute left-0 top-[22px] z-50 min-w-[210px] overflow-hidden rounded-[8px] py-1 text-[13px]">
                    {m.items.map((item) => (
                      <MenuItem
                        key={item.label}
                        label={item.label}
                        shortcut={
                          "shortcut" in item ? item.shortcut : undefined
                        }
                        disabled={
                          "disabled" in item ? !!item.disabled : false
                        }
                        onClick={() => {
                          closeMenus();
                          if ("action" in item && item.action) item.action();
                        }}
                      />
                    ))}
                    {m.key === "File" && focused && (
                      <>
                        <div className="my-1 h-px bg-white/10" />
                        <MenuItem
                          label={`Quit ${APPS[focused.appId].name}`}
                          shortcut="⌘Q"
                          onClick={() => {
                            closeMenus();
                            closeApp(focused.appId);
                          }}
                        />
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Right: macOS menu extras — match system glyph order + click targets */}
        <div
          className="ml-auto flex h-full items-center"
          style={{ fontWeight: 500, gap: 0 }}
        >
          {/* Battery → status menu */}
          <div className="relative">
            <StatusBtn
              label="Battery"
              active={statusMenu === "battery"}
              onClick={(e) => {
                e.stopPropagation();
                setAppleOpen(false);
                setMenu(null);
                setControlCenterOpen(false);
                setNotificationCenterOpen(false);
                setSpotlightOpen(false);
                setStatusMenu((m) => (m === "battery" ? null : "battery"));
              }}
            >
              <span
                className="mr-[5px] tabular-nums leading-none"
                style={{ fontSize: "calc(13px * var(--text-scale, 1))", fontWeight: 500 }}
              >
                {batteryPct}%
              </span>
              <BatterySymbol charging pct={batteryPct} />
            </StatusBtn>
            {statusMenu === "battery" && (
              <StatusMenu onClose={() => setStatusMenu(null)}>
                <StatusMenuTitle>Battery</StatusMenuTitle>
                <StatusMenuRow
                  label="Power Source"
                  value="Power Adapter"
                />
                <StatusMenuRow label="Charge" value={`${batteryPct}%`} />
                <div className="my-1 h-px bg-white/10" />
                <StatusMenuItem
                  label="Battery Settings…"
                  onClick={() => {
                    setStatusMenu(null);
                    useOSStore.getState().openSettingsSection("about");
                    useWindowStore.getState().openApp("settings");
                  }}
                />
              </StatusMenu>
            )}
          </div>

          {/* Wi‑Fi → menu (toggle + Network Settings) */}
          <div className="relative">
            <StatusBtn
              label="Wi-Fi"
              active={statusMenu === "wifi"}
              onClick={(e) => {
                e.stopPropagation();
                setAppleOpen(false);
                setMenu(null);
                setControlCenterOpen(false);
                setNotificationCenterOpen(false);
                setSpotlightOpen(false);
                setStatusMenu((m) => (m === "wifi" ? null : "wifi"));
              }}
            >
              <WifiSymbol on={wifi} />
            </StatusBtn>
            {statusMenu === "wifi" && (
              <StatusMenu onClose={() => setStatusMenu(null)}>
                <StatusMenuTitle>Wi-Fi</StatusMenuTitle>
                <StatusMenuItem
                  label={wifi ? "Turn Wi-Fi Off" : "Turn Wi-Fi On"}
                  onClick={() => {
                    useOSStore.getState().setWifi(!wifi);
                  }}
                />
                {wifi && (
                  <StatusMenuRow label="Network" value="PortfolioOS" />
                )}
                <div className="my-1 h-px bg-white/10" />
                <StatusMenuItem
                  label="Wi-Fi Settings…"
                  onClick={() => {
                    setStatusMenu(null);
                    useOSStore.getState().openSettingsSection("wifi");
                    useWindowStore.getState().openApp("settings");
                  }}
                />
                <StatusMenuItem
                  label="Open Control Center"
                  onClick={() => {
                    setStatusMenu(null);
                    setControlCenterOpen(true);
                  }}
                />
              </StatusMenu>
            )}
          </div>

          {/* Spotlight */}
          <StatusBtn
            label="Spotlight Search"
            onClick={() => {
              closeMenus();
              setStatusMenu(null);
              setControlCenterOpen(false);
              setNotificationCenterOpen(false);
              setSpotlightOpen(true);
            }}
          >
            <SpotlightSymbol />
          </StatusBtn>

          {/* Control Center */}
          <StatusBtn
            label="Control Center"
            active={controlCenterOpen}
            onClick={() => {
              closeMenus();
              setStatusMenu(null);
              setSpotlightOpen(false);
              setNotificationCenterOpen(false);
              setControlCenterOpen(!controlCenterOpen);
            }}
          >
            <ControlCenterSymbol />
          </StatusBtn>

          {/* Clock → Notification Center */}
          <button
            type="button"
            className={`flex h-[22px] cursor-default items-center rounded-[4px] px-[8px] tabular-nums leading-none ${
              notificationCenterOpen ? "bg-white/20" : "hover:bg-white/15"
            }`}
            style={{
              fontFamily: MENU_FONT,
              fontWeight: 500,
              fontSize: "calc(13px * var(--text-scale, 1))",
              letterSpacing: "-0.012em",
            }}
            onClick={() => {
              closeMenus();
              setStatusMenu(null);
              setSpotlightOpen(false);
              setControlCenterOpen(false);
              setNotificationCenterOpen(!notificationCenterOpen);
            }}
          >
            {time}
          </button>
        </div>
      </div>
    </header>
  );
}

function StatusBtn({
  label,
  children,
  onClick,
  active,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex h-[22px] cursor-default items-center rounded-[4px] px-[6px] text-white ${
        active ? "bg-white/20" : "hover:bg-white/15"
      }`}
    >
      {children}
    </button>
  );
}

function StatusMenu({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="menu-dropdown absolute right-0 top-[22px] z-50 w-[240px] overflow-hidden rounded-[8px] py-1 text-[13px] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
}

function StatusMenuTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-0.5 pt-1.5 text-[11px] font-semibold text-white/45">
      {children}
    </div>
  );
}

function StatusMenuRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-[5px] text-[13px]">
      <span className="text-white/80">{label}</span>
      <span className="text-white/55">{value}</span>
    </div>
  );
}

function StatusMenuItem({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full cursor-default px-3 py-[5px] text-left hover:bg-mac-accent"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function MenuItem({
  label,
  shortcut,
  onClick,
  disabled,
}: {
  label: string;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full cursor-default items-center justify-between px-3 py-[3px] text-left hover:bg-mac-accent disabled:opacity-35 disabled:hover:bg-transparent"
      style={{
        fontFamily: MENU_FONT,
        fontWeight: 400,
        fontSize: "calc(13px * var(--text-scale, 1))",
      }}
    >
      <span>{label}</span>
      {shortcut && (
        <span className="text-[12px] text-white/45">{shortcut}</span>
      )}
    </button>
  );
}
