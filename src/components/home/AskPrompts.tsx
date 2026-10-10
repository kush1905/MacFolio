"use client";

import { useSceneStore } from "@/store/sceneStore";

const PROMPTS = [
  "What has Kush built?",
  "Tell me about Potato Bazaar.",
  "What is his React Native experience?",
  "Which projects involve AI?",
  "What did he do at Protonshub?",
  "Which projects use Node.js?",
];

export function AskPrompts() {
  const openPalette = useSceneStore((state) => state.openPalette);
  return (
    <div className="ask-prompts">
      <button type="button" className="ask-open" onClick={() => openPalette()}>
        <span>Ask anything about Kush&apos;s work</span>
        <kbd>⌘K</kbd>
      </button>
      <ul>
        {PROMPTS.map((prompt) => (
          <li key={prompt}>
            <button type="button" onClick={() => openPalette(prompt)}>
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
