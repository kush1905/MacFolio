"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppIcon } from "@/components/icons/AppIcon";
import { content } from "@/lib/content";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";
import type { AppId } from "@/types";

export function NotificationCenter() {
  const open = useOSStore((s) => s.notificationCenterOpen);
  const setOpen = useOSStore((s) => s.setNotificationCenterOpen);
  const notifications = useOSStore((s) => s.notifications);
  const markRead = useOSStore((s) => s.markNotificationsRead);
  const clear = useOSStore((s) => s.clearNotifications);
  const openApp = useWindowStore((s) => s.openApp);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = notifications.filter((n) => !dismissed.has(n.id));
  const now = new Date();
  const city = content.about.location.split(",")[0]?.trim() || "Portfolio";

  const close = () => {
    markRead();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-[70]" onClick={close} />
          <motion.aside
            className="notification-center pointer-events-auto absolute bottom-0 right-0 top-[var(--menu-bar-h)] z-[80] flex w-[min(380px,100vw)] flex-col text-white"
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 36, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
            onAnimationComplete={() => markRead()}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-3">
              <h2
                className="text-[17px] font-bold tracking-[-0.02em]"
                style={{
                  fontFamily:
                    '"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Notification Center
              </h2>
              <CloseCircle onClick={close} />
            </div>

            <div className="mac-scroll flex-1 space-y-[10px] overflow-auto px-3 pb-2">
              {/* Portfolio notifications as rich cards */}
              {visible.slice(0, 2).map((n) => (
                <GlassCard key={n.id} className="p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-[7px]">
                      {n.appId === "system" ? (
                        <div className="flex h-full w-full items-center justify-center bg-[#bf5af2]">
                          <HourglassIcon />
                        </div>
                      ) : (
                        <AppIcon id={n.appId as AppId} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="truncate text-[13px] font-semibold tracking-[-0.01em]">
                          {n.title}
                        </span>
                        <span className="shrink-0 text-[11px] text-white/45">
                          {relative(n.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] leading-snug text-white/90">
                        {n.body}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-white/[0.08] pt-2.5">
                    <p className="mb-2 text-[11px] text-white/45">
                      Keep receiving notifications from this app?
                    </p>
                    <div className="flex gap-2">
                      <PillBtn
                        label="Keep…"
                        onClick={() => {
                          if (n.appId !== "system") openApp(n.appId);
                          close();
                        }}
                      />
                      <PillBtn
                        label="Turn Off"
                        onClick={() =>
                          setDismissed((s) => new Set(s).add(n.id))
                        }
                      />
                    </div>
                  </div>
                </GlassCard>
              ))}

              {visible.length === 0 && (
                <GlassCard className="px-4 py-6 text-center text-[13px] text-white/45">
                  No Notifications
                </GlassCard>
              )}

              {/* Weather */}
              <WeatherWidget city={city} />

              {/* Calendar + Stocks */}
              <div className="grid grid-cols-2 gap-[10px]">
                <CalendarWidget date={now} />
                <StocksWidget />
              </div>

              {/* Up Next / portfolio */}
              <UpNextWidget
                onOpen={() => {
                  openApp("notes");
                  close();
                }}
              />

              {/* Activity strip */}
              <ActivityWidget />

              {notifications.length > 0 && (
                <button
                  type="button"
                  className="mx-auto block text-[12px] text-white/45 hover:text-white/70"
                  onClick={clear}
                >
                  Clear All Notifications
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="flex shrink-0 flex-col items-center gap-2 px-3 pb-4 pt-2">
              <button
                type="button"
                className="nc-pill cursor-default rounded-full px-5 py-[7px] text-[13px] font-medium text-white/90"
                onClick={() => {
                  useOSStore.getState().openSettingsSection("wallpaper");
                  openApp("settings");
                  close();
                }}
              >
                Edit Widgets
              </button>
              <CloseCircle onClick={close} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`nc-widget ${className}`}>{children}</div>;
}

function CloseCircle({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className="flex h-[22px] w-[22px] cursor-default items-center justify-center rounded-full bg-white/15 text-white/80 hover:bg-white/22"
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
        <path
          d="M2.5 2.5l7 7M9.5 2.5l-7 7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function PillBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="nc-pill flex-1 cursor-default rounded-full py-[6px] text-center text-[12.5px] font-medium text-white/90"
    >
      {label}
    </button>
  );
}

function WeatherWidget({ city }: { city: string }) {
  const hours = ["1AM", "2AM", "3AM", "4AM", "5AM", "Now"];
  return (
    <GlassCard className="p-3.5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[13px] font-medium text-white/90">{city}</div>
          <div className="text-[44px] font-thin leading-none tracking-tight">
            26°
          </div>
        </div>
        <div className="flex flex-col items-end pt-0.5">
          <CloudRainIcon className="mb-0.5 h-7 w-7 text-[#8ec7ff]" />
          <div className="text-[12px] text-white/85">Drizzle</div>
          <div className="text-[11px] text-white/50">H:28° L:25°</div>
        </div>
      </div>
      <div className="mt-3 flex justify-between border-t border-white/[0.08] pt-2.5">
        {hours.map((h, i) => (
          <div key={h} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-white/50">{h}</span>
            {i === hours.length - 1 ? (
              <SunIcon className="h-4 w-4 text-[#ffd60a]" />
            ) : (
              <CloudRainIcon className="h-4 w-4 text-[#8ec7ff]" />
            )}
            <span className="text-[12px] font-medium">26°</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function CalendarWidget({ date }: { date: Date }) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = date.getDate();
  const monthName = date
    .toLocaleString("en-US", { month: "long" })
    .toUpperCase();

  const cells = useMemo(() => {
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const grid: (number | null)[] = [];
    for (let i = 0; i < first; i++) grid.push(null);
    for (let d = 1; d <= days; d++) grid.push(d);
    while (grid.length % 7 !== 0) grid.push(null);
    return grid.slice(0, 35);
  }, [year, month]);

  return (
    <GlassCard className="p-3">
      <div className="mb-1.5 text-[11px] font-semibold tracking-wide text-[#ff453a]">
        {monthName}
      </div>
      <div className="mb-1 grid grid-cols-7 gap-y-0.5 text-center text-[9px] text-white/40">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5 text-center text-[10px]">
        {cells.map((d, i) => (
          <span
            key={i}
            className={`mx-auto flex h-[16px] w-[16px] items-center justify-center rounded-full ${
              d === today
                ? "bg-[#ff453a] font-semibold text-white"
                : d
                  ? "text-white/80"
                  : "text-transparent"
            }`}
          >
            {d ?? "·"}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}

function StocksWidget() {
  const rows = [
    { sym: "DOW", val: "54,037", up: true },
    { sym: "^NSEI", val: "24,571", up: false },
    { sym: "AAPL", val: "313.33", up: true },
  ];
  return (
    <GlassCard className="flex flex-col p-3">
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div
            key={r.sym}
            className="flex items-center justify-between text-[11px]"
          >
            <span className="font-semibold tracking-tight">{r.sym}</span>
            <span
              className={`flex items-center gap-0.5 tabular-nums ${
                r.up ? "text-[#30d158]" : "text-[#ff453a]"
              }`}
            >
              {r.up ? "▲" : "▼"} {r.val}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-auto border-t border-white/[0.08] pt-2">
        <p className="line-clamp-2 text-[10px] leading-snug text-white/55">
          US Stock Market Today · portfolio live tickers
        </p>
      </div>
    </GlassCard>
  );
}

function UpNextWidget({ onOpen }: { onOpen: () => void }) {
  const role = content.experience.experience[0];
  return (
    <GlassCard className="p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-semibold">Up Next</span>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#bf5af2] to-[#5e5ce6] text-[11px]">
          ✦
        </div>
      </div>
      {role ? (
        <button
          type="button"
          onClick={onOpen}
          className="w-full cursor-default text-left"
        >
          <div className="text-[13px] font-medium text-white/90">
            {role.role}
          </div>
          <div className="mt-0.5 text-[12px] text-white/50">
            {role.company} · {role.duration}
          </div>
          <div className="mt-2 line-clamp-2 text-[12px] text-white/65">
            {role.highlights[0]}
          </div>
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/10" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-[75%] rounded bg-white/10" />
            <div className="h-2 w-[50%] rounded bg-white/10" />
          </div>
        </div>
      )}
    </GlassCard>
  );
}

function ActivityWidget() {
  const stats = content.stats;
  return (
    <GlassCard className="p-3.5">
      <div className="mb-2 flex items-end justify-between">
        <div>
          <div className="text-[22px] font-semibold tabular-nums tracking-tight">
            {stats.yearsCoding}y
          </div>
          <div className="text-[11px] text-white/45">Years coding</div>
        </div>
        <div className="text-right text-[11px] text-white/45">
          <div>{stats.projectsCompleted} projects</div>
          <div>{stats.leetcodeBadges} LC badges</div>
        </div>
      </div>
      <div className="relative h-[56px] border-b border-white/10">
        <div className="absolute inset-x-0 top-0 flex h-full items-end gap-[3px] px-0.5">
          {[40, 55, 35, 70, 48, 82, 60, 90, 52, 75, 45, 68].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-mac-accent/85"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-0.5 text-[9px] text-white/30">
          <span>60m</span>
          <span>30m</span>
          <span>0</span>
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-white/35">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>Now</span>
      </div>
    </GlassCard>
  );
}

function relative(iso: string) {
  const mins = Math.max(
    0,
    Math.round((Date.now() - new Date(iso).getTime()) / 60000),
  );
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return "Yesterday";
}

function HourglassIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 fill-white">
      <path d="M4 2h8v1.2c0 2.2-1.4 3.6-2.8 4.8C7.4 9.2 6 10.6 6 12.8V14H4v-1.2c0-2.2 1.4-3.6 2.8-4.8C8.6 6.8 10 5.4 10 3.2V2H4z" />
    </svg>
  );
}

function CloudRainIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M7.5 18a4.5 4.5 0 0 1-.4-9 6 6 0 0 1 11.6 1.6A3.8 3.8 0 0 1 18 18H7.5z" />
      <path
        d="M9 19.5v2M12 19v2.5M15 19.5v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
    </svg>
  );
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
