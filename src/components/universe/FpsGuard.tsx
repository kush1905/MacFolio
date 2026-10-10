"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

/**
 * Watches real frame times. Below ~40 fps it lowers resolution; only a sustained
 * collapse (two 4-second windows under 20 fps) gives up on WebGL entirely.
 * Ignores the first seconds, when shader compilation causes one-off hitches.
 */
export function FpsGuard({
  onLow,
  onFail,
}: {
  onLow: () => void;
  onFail: () => void;
}) {
  const state = useRef({ elapsed: 0, frames: 0, window: 0, strikes: 0, lowered: false });
  useFrame((_, delta) => {
    const s = state.current;
    s.elapsed += delta;
    if (s.elapsed < 3 || delta > 0.5) return; // warm-up, or the tab was in the background
    s.frames += 1;
    s.window += delta;
    if (s.window < 4) return;
    const fps = s.frames / s.window;
    s.frames = 0;
    s.window = 0;
    if (fps < 40 && !s.lowered) {
      s.lowered = true;
      onLow();
    }
    s.strikes = fps < 20 ? s.strikes + 1 : 0;
    if (s.strikes >= 2) onFail();
  });
  return null;
}
