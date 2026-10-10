"use client";

import { useSceneStore } from "@/store/sceneStore";

/** Opens the ⌘K "Ask Kush" palette. */
export function AskButton() {
  const openPalette = useSceneStore((state) => state.openPalette);
  return (
    <button type="button" className="ask-trigger" onClick={() => openPalette()}>
      Ask <kbd>⌘K</kbd>
    </button>
  );
}
