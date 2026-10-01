"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";
import { APPS } from "@/lib/apps";

export function ControlCenter() {
  const open = useOSStore((s) => s.controlCenterOpen);
  const setOpen = useOSStore((s) => s.setControlCenterOpen);
  const prefs = useOSStore((s) => s.preferences);
  const setWifi = useOSStore((s) => s.setWifi);
  const setBluetooth = useOSStore((s) => s.setBluetooth);
  const setAirDrop = useOSStore((s) => s.setAirDrop);
  const setDoNotDisturb = useOSStore((s) => s.setDoNotDisturb);
  const setVolume = useOSStore((s) => s.setVolume);
  const setBrightness = useOSStore((s) => s.setBrightness);
  const setDockMagnification = useOSStore((s) => s.setDockMagnification);
  const setLaunchpadOpen = useOSStore((s) => s.setLaunchpadOpen);
  const openApp = useWindowStore((s) => s.openApp);

  return (
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[70]"
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="control-center pointer-events-auto absolute right-3 top-[28px] z-[80] w-[320px] rounded-[18px] p-3 text-white"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 480, damping: 34 }}
          >
            <div className="grid grid-cols-2 gap-2.5">
              <div className="cc-card col-span-1 space-y-1 p-2.5">
                <ToggleRow
                  active={prefs.wifi}
                  label="Wi-Fi"
                  sub={prefs.wifi ? "Connected" : "Off"}
                  onClick={() => setWifi(!prefs.wifi)}
                  icon={
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-white">
                      <path d="M8 13a1.15 1.15 0 1 0 0-2.3A1.15 1.15 0 0 0 8 13zm-3.2-3a4.5 4.5 0 0 1 6.4 0l-.85.85a3.3 3.3 0 0 0-4.7 0L4.8 10zm-2.1-2.1a7.5 7.5 0 0 1 10.6 0l-.85.85a6.3 6.3 0 0 0-8.9 0l-.85-.85z" />
                    </svg>
                  }
                />
                <ToggleRow
                  active={prefs.bluetooth}
                  label="Bluetooth"
                  sub={prefs.bluetooth ? "On" : "Off"}
                  onClick={() => setBluetooth(!prefs.bluetooth)}
                  icon={
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-white" strokeWidth="1.4">
                      <path d="M4.5 4.5 L11.5 11.5 L8 14.5 V1.5 L11.5 4.5 L4.5 11.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                />
                <ToggleRow
                  active={prefs.airDrop}
                  label="AirDrop"
                  sub={prefs.airDrop ? "Contacts Only" : "Off"}
                  onClick={() => setAirDrop(!prefs.airDrop)}
                  icon={
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-white">
                      <circle cx="8" cy="8" r="2" />
                      <path d="M8 2a6 6 0 0 1 0 12 6 6 0 0 1 0-12zm0 2a4 4 0 0 0 0 8 4 4 0 0 0 0-8z" fillOpacity="0.45" />
                    </svg>
                  }
                />
              </div>

              <div className="cc-card flex flex-col justify-between p-3">
                <button
                  type="button"
                  className="flex items-center gap-2 text-left"
                  onClick={() => setDoNotDisturb(!prefs.doNotDisturb)}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      prefs.doNotDisturb ? "bg-[#5e5ce6]" : "bg-white/15"
                    }`}
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4 fill-white">
                      <path d="M11.5 2.2A6.5 6.5 0 1 0 13.8 11a5.2 5.2 0 0 1-2.3-8.8z" />
                    </svg>
                  </span>
                  <div>
                    <div className="text-[12px] font-medium">Focus</div>
                    <div className="text-[11px] text-white/50">
                      {prefs.doNotDisturb ? "Do Not Disturb" : "Off"}
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  className="mt-3 rounded-[10px] bg-white/10 px-2.5 py-2 text-left text-[12px] hover:bg-white/15"
                  onClick={() => {
                    setOpen(false);
                    setLaunchpadOpen(true);
                  }}
                >
                  Launchpad
                </button>
              </div>

              <div className="cc-card col-span-2 px-3 py-3">
                <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-white/55">
                  <span>Display</span>
                  <button
                    type="button"
                    onClick={() =>
                      useOSStore.getState().setNightShift(!prefs.nightShift)
                    }
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      prefs.nightShift || prefs.nightShiftSunset
                        ? "bg-mac-accent text-white"
                        : "bg-white/10 text-white/70"
                    }`}
                  >
                    Night Shift
                  </button>
                </div>
                <Slider
                  value={prefs.brightness}
                  onChange={(v) => setBrightness(v)}
                  icon={
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-white/80">
                      <circle cx="8" cy="8" r="3" />
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
                        <rect
                          key={d}
                          x="7.3"
                          y="1"
                          width="1.4"
                          height="2.4"
                          rx="0.5"
                          transform={`rotate(${d} 8 8)`}
                        />
                      ))}
                    </svg>
                  }
                />
              </div>

              <div className="cc-card col-span-2 px-3 py-3">
                <div className="mb-1.5 text-[11px] font-medium text-white/55">
                  Sound
                </div>
                <Slider
                  value={prefs.volume}
                  onChange={(v) => setVolume(v)}
                  icon={
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-white/80">
                      <path d="M2 6h3l3-3v10l-3-3H2V6zm8.2-.8a3.5 3.5 0 0 1 0 5.6l-.9-.9a2.2 2.2 0 0 0 0-3.8l.9-.9zm1.8-1.9a6 6 0 0 1 0 9.4l-.9-.9a4.7 4.7 0 0 0 0-7.6l.9-.9z" />
                    </svg>
                  }
                />
              </div>

              <button
                type="button"
                className="cc-card col-span-1 flex items-center gap-2 p-3 text-left hover:bg-white/[0.12]"
                onClick={() => setDockMagnification(!prefs.dockMagnification)}
              >
                <span className="text-[20px] leading-none">▤</span>
                <div>
                  <div className="text-[12px] font-medium">Dock</div>
                  <div className="text-[11px] text-white/50">
                    Magnify {prefs.dockMagnification ? "On" : "Off"}
                  </div>
                </div>
              </button>
              <button
                type="button"
                className="cc-card col-span-1 flex items-center gap-2 p-3 text-left hover:bg-white/[0.12]"
                onClick={() => {
                  setOpen(false);
                  openApp("settings");
                }}
              >
                <span className="text-[18px] leading-none">⚙</span>
                <div>
                  <div className="text-[12px] font-medium">
                    {APPS.settings.name}
                  </div>
                  <div className="text-[11px] text-white/50">Open</div>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ToggleRow({
  active,
  label,
  sub,
  onClick,
  icon,
}: {
  active: boolean;
  label: string;
  sub: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-[10px] px-1 py-1.5 text-left hover:bg-white/10"
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full ${
          active ? "bg-mac-accent" : "bg-white/15"
        }`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="truncate text-[12px] font-medium">{label}</div>
        <div className="truncate text-[11px] text-white/45">{sub}</div>
      </div>
    </button>
  );
}

function Slider({
  value,
  onChange,
  icon,
}: {
  value: number;
  onChange: (v: number) => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="opacity-80">{icon}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mac-slider flex-1"
      />
    </div>
  );
}
