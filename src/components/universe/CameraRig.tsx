"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { type PerspectiveCamera, Vector3 } from "three";
import type { HomeProject } from "@/lib/portfolio";
import { scrollState, useSceneStore } from "@/store/sceneStore";
import { CAMERA_KEYS, CHAPTER_COUNT, smoothstep } from "./layout";
import { stationWorldPosition } from "./chapters/Stations";

/**
 * One camera, driven by scroll. Each chapter has a keyframe; between chapters the
 * camera travels along the signal. Pointer adds a few degrees of parallax.
 */
export function CameraRig({ projects, mobile }: { projects: HomeProject[]; mobile: boolean }) {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  const pointer = useRef({ x: 0, y: 0 });
  const look = useMemo(() => CAMERA_KEYS[0].look.clone(), []);
  const targetPos = useMemo(() => new Vector3(), []);
  const targetLook = useMemo(() => new Vector3(), []);

  useEffect(() => {
    if (mobile) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mobile]);

  // Wide screens: scene to the right of the text. Phones: scene lifted above the text.
  // When the footer scrolls in, the frame's centre rises with it so the finale stays centred
  // in the space that is still visible.
  const appliedFooter = useRef(-1);
  const applyOffset = (footer: number) => {
    const shiftX = size.width >= 1024 ? -size.width * 0.2 : 0;
    // Phones: centre the scene on the stage band (focus line at 38% of the viewport).
    const shiftY = (size.width < 760 ? size.height * 0.12 : 0) + footer / 2;
    camera.setViewOffset(size.width, size.height, shiftX, shiftY, size.width, size.height);
    camera.updateProjectionMatrix();
    appliedFooter.current = footer;
  };
  useEffect(() => {
    applyOffset(scrollState.footer);
    invalidate();
    return () => camera.clearViewOffset();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- applyOffset reads size/camera
  }, [camera, size, invalidate]);

  useFrame((_, delta) => {
    if (Math.abs(scrollState.footer - appliedFooter.current) > 0.5) applyOffset(scrollState.footer);
    const chapter = Math.min(Math.max(scrollState.chapter, 0), CHAPTER_COUNT - 1);
    const i = Math.floor(chapter);
    const f = smoothstep(chapter - i);
    const a = CAMERA_KEYS[i];
    const b = CAMERA_KEYS[Math.min(i + 1, CHAPTER_COUNT - 1)];
    targetPos.lerpVectors(a.pos, b.pos, f);
    targetLook.lerpVectors(a.look, b.look, f);

    // Approach a project's station right before its case study opens.
    const approaching = useSceneStore.getState().approaching;
    const station = approaching ? stationWorldPosition(projects, approaching) : null;
    let rate = 3.2;
    if (station) {
      targetLook.copy(station);
      targetPos.copy(station).add(new Vector3(0, 0.35, 2.4));
      rate = 7;
    }

    // Phones: frame each chapter a little tighter so it fills its stage.
    if (mobile) targetPos.sub(targetLook).multiplyScalar(0.86).add(targetLook);

    targetPos.x += pointer.current.x * 0.35;
    targetPos.y -= pointer.current.y * 0.2;
    // Phones have no cursor parallax, so give the camera a slow drift to keep scenes alive.
    if (mobile) {
      const t = performance.now() / 1000;
      targetPos.x += Math.sin(t * 0.35) * 0.3;
      targetPos.y += Math.cos(t * 0.27) * 0.16;
    }

    const k = 1 - Math.exp(-delta * rate);
    camera.position.lerp(targetPos, k);
    look.lerp(targetLook, k);
    camera.lookAt(look);
  });

  return null;
}
