"use client";

import { useEffect, useState } from "react";
import { nightShiftActive } from "@/lib/display";
import { useOSStore } from "@/store/osStore";

export function DisplayOverlays() {
  const brightness = useOSStore((s) => s.preferences.brightness);
  const nightShift = useOSStore((s) => s.preferences.nightShift);
  const nightShiftSunset = useOSStore((s) => s.preferences.nightShiftSunset);
  const warmth = useOSStore((s) => s.preferences.nightShiftWarmth);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!nightShiftSunset) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 60_000);
    return () => window.clearInterval(id);
  }, [nightShiftSunset]);

  const dim = Math.max(0, (100 - brightness) / 100) * 0.72;
  const warm = nightShiftActive({ nightShift, nightShiftSunset })
    ? (warmth / 100) * 0.42
    : 0;

  if (dim < 0.01 && warm < 0.01) return null;

  return (
    <>
      {dim >= 0.01 && (
        <div
          className="pointer-events-none fixed inset-0 z-[850]"
          style={{ background: `rgba(0,0,0,${dim})` }}
        />
      )}
      {warm >= 0.01 && (
        <div
          className="pointer-events-none fixed inset-0 z-[851]"
          style={{
            background: `rgba(255, 147, 57, ${warm})`,
            mixBlendMode: "multiply",
          }}
        />
      )}
    </>
  );
}
