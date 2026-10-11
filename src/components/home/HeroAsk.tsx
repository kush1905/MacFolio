"use client";

import { useSyncExternalStore } from "react";
import { useSceneStore } from "@/store/sceneStore";

const subscribeNoop = () => () => {};

/** "Ask me anything" link in the hero; opens the ⌘K assistant. */
export function HeroAsk() {
  const openPalette = useSceneStore((state) => state.openPalette);
  const mac = useSyncExternalStore(
    subscribeNoop,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => true,
  );
  return (
    <button type="button" className="hero-ask" onClick={() => openPalette()}>
      Ask me anything <kbd>{mac ? "⌘" : "Ctrl"} K</kbd>
    </button>
  );
}
