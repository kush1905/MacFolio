import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { scrollState } from "@/store/sceneStore";
import { presence } from "./layout";

/**
 * Hides a chapter's group when the camera is far from it (saves draw calls) and
 * exposes how present it is, 0–1, for fades.
 */
export function useChapter(index: number, range = 1.4) {
  const ref = useRef<Group>(null);
  const amount = useRef(0);
  useFrame(() => {
    const value = presence(scrollState.chapter, index, range);
    amount.current = value;
    if (ref.current) ref.current.visible = value > 0;
  });
  return { ref, amount };
}
