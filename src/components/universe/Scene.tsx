"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HomeProject, TechNode } from "@/lib/portfolio";
import { useSceneStore } from "@/store/sceneStore";
import { CameraRig } from "./CameraRig";
import { Filament } from "./Filament";
import { FpsGuard } from "./FpsGuard";
import { Beacon, Horizon, QuietNetwork } from "./chapters/Coda";
import { CoreGraph } from "./chapters/CoreGraph";
import { Lattice } from "./chapters/Lattice";
import { Stations } from "./chapters/Stations";
import { SystemLayers } from "./chapters/SystemLayers";
import { Timeline } from "./chapters/Timeline";
import { anchorParams, buildSignalCurve, CAMERA_KEYS, COLORS } from "./layout";

export type SceneProps = {
  projects: HomeProject[];
  techNodes: TechNode[];
  steps: number;
  mobile: boolean;
  onFail: (reason: string) => void;
  onOpen: (slug: string) => void;
};

export default function Scene({ projects, techNodes, steps, mobile, onFail, onOpen }: SceneProps) {
  const setSceneReady = useSceneStore((state) => state.setSceneReady);
  const curve = useMemo(() => buildSignalCurve(), []);
  const anchors = useMemo(() => anchorParams(curve), [curve]);
  const [dpr, setDpr] = useState(mobile ? 1.25 : 1.75);

  const lostTimer = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(lostTimer.current);
      setSceneReady(false);
    },
    [setSceneReady],
  );

  return (
    <Canvas
      className="universe-canvas"
      dpr={[1, dpr]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: mobile ? 50 : 38, near: 0.1, far: 120, position: CAMERA_KEYS[0].pos.toArray() }}
      onCreated={({ gl }) => {
        gl.setClearColor(COLORS.bg);
        // A lost context usually restores (tab switch, GPU reset); fall back only if it doesn't.
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          lostTimer.current = window.setTimeout(() => onFail("context-lost"), 2500);
        });
        gl.domElement.addEventListener("webglcontextrestored", () => window.clearTimeout(lostTimer.current));
        setSceneReady(true);
      }}
    >
      <fog attach="fog" args={[COLORS.bg, 9, 32]} />
      <FpsGuard onLow={() => setDpr(1)} onFail={() => onFail("low-fps")} />
      {/* Two lights only: a warm key and a cool fill; amber accents are emissive, not lit. */}
      <hemisphereLight args={["#e9e4da", "#0b0b0c", 0.9]} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} color="#fff2df" />
      <directionalLight position={[-4, -1, -3]} intensity={0.6} color={COLORS.amber} />

      <CameraRig projects={projects} mobile={mobile} />
      <Filament curve={curve} anchors={anchors} mobile={mobile} />
      <Lattice mobile={mobile} />
      <SystemLayers mobile={mobile} />
      <Stations projects={projects} onOpen={onOpen} />
      <Timeline steps={steps} />
      <CoreGraph nodes={techNodes} projects={projects} />
      <QuietNetwork />
      <Horizon />
      <Beacon />
    </Canvas>
  );
}
