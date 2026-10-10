"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { type Group, Vector3 } from "three";
import type { HomeProject } from "@/lib/portfolio";
import { useSceneStore } from "@/store/sceneStore";
import { ANCHORS, stationLayout } from "../layout";
import { amber, segmentsGeometry, signalWire, wire, wireColor } from "../materials";
import { useChapter } from "../useChapter";
import { Metaphor } from "./Metaphors";

function ring(radius: number) {
  return segmentsGeometry(
    Array.from({ length: 64 }, (_, i) => {
      const a = (i / 64) * Math.PI * 2;
      const b = ((i + 1) / 64) * Math.PI * 2;
      return [
        [Math.cos(a) * radius, 0, Math.sin(a) * radius],
        [Math.cos(b) * radius, 0, Math.sin(b) * radius],
      ];
    }),
  );
}

function Station({
  project,
  position,
  scale,
  fade,
  onOpen,
}: {
  project: HomeProject;
  position: Vector3;
  scale: number;
  fade: { current: number };
  onOpen: (slug: string) => void;
}) {
  const group = useRef<Group>(null);
  const hover = useRef(0);
  const setHovered = useSceneStore((state) => state.setHoveredProject);
  const base = useMemo(() => ({ geometry: ring(0.85), material: wire(0.2) }), []);

  useFrame((state, delta) => {
    const { hoveredProject, approaching } = useSceneStore.getState();
    const target = hoveredProject === project.slug || approaching === project.slug ? 1 : 0;
    hover.current += (target - hover.current) * (1 - Math.exp(-delta * 7));
    if (group.current) {
      group.current.scale.setScalar(scale * (1 + hover.current * 0.1));
      group.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 0.6 + position.x) * 0.04;
    }
    base.material.color.lerpColors(wireColor, amber, hover.current);
    base.material.opacity = (0.16 + hover.current * 0.6) * fade.current;
  });

  const levels = useMemo(() => ({ hover, fade }), [fade]);

  return (
    <group ref={group} position={position}>
      <lineSegments geometry={base.geometry} material={base.material} position={[0, -0.75, 0]} />
      <Metaphor kind={project.kind} levels={levels} image={project.screenshots[0]?.src} />
      {/* Invisible hit area so the whole station responds to pointer and tap. */}
      <mesh
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(project.slug);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(null);
          document.body.style.cursor = "";
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          document.body.style.cursor = "";
          onOpen(project.slug);
        }}
      >
        <sphereGeometry args={[0.95, 12, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * Scene 03 — the product universe. Potato Bazaar sits at the centre; every other
 * project is a station connected back to it by the signal.
 */
export function Stations({
  projects,
  onOpen,
}: {
  projects: HomeProject[];
  onOpen: (slug: string) => void;
}) {
  const { ref, amount } = useChapter(2, 1.35);
  const layout = useMemo(() => stationLayout(projects.map((p) => p.kind)), [projects]);
  const links = useMemo(() => {
    const hub = layout[0].position;
    return {
      geometry: segmentsGeometry(layout.slice(1).map((s) => [hub.toArray(), s.position.toArray()])),
      material: signalWire(0.12),
      faint: wire(0.06),
    };
  }, [layout]);

  useFrame(() => {
    const hovered = useSceneStore.getState().hoveredProject;
    links.material.opacity = (hovered ? 0.35 : 0.12) * amount.current;
  });

  return (
    <group ref={ref} position={ANCHORS[2]}>
      <lineSegments geometry={links.geometry} material={links.material} />
      {projects.map((project, i) => (
        <Station
          key={project.slug}
          project={project}
          position={layout[i].position}
          scale={layout[i].scale}
          fade={amount}
          onOpen={onOpen}
        />
      ))}
    </group>
  );
}

export function stationWorldPosition(projects: HomeProject[], slug: string) {
  const layout = stationLayout(projects.map((p) => p.kind));
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) return null;
  return ANCHORS[2].clone().add(layout[index].position);
}
