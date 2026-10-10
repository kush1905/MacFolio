"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  type Group,
  Line,
  LineDashedMaterial,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";
import { ANCHORS, COLORS, rng } from "../layout";
import { glowPointsMaterial, glowTexture, pointsGeometry, segmentsGeometry, wire } from "../materials";
import { useChapter } from "../useChapter";

/** Scene 07 — intelligence: the scene goes quiet; a sparse network breathes. */
export function QuietNetwork() {
  const { ref, amount } = useChapter(5, 1.3);
  const geo = useMemo(() => {
    const random = rng(23);
    const nodes = Array.from(
      { length: 34 },
      () => new Vector3((random() - 0.5) * 5, (random() - 0.5) * 2.6, (random() - 0.5) * 2.4),
    );
    const pairs: [number[], number[]][] = [];
    nodes.forEach((a, i) => {
      nodes
        .map((b, j) => ({ j, d: a.distanceTo(b) }))
        .filter(({ j }) => j > i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 2)
        .forEach(({ j }) => pairs.push([a.toArray(), nodes[j].toArray()]));
    });
    return {
      lines: segmentsGeometry(pairs),
      points: pointsGeometry(nodes.flatMap((v) => v.toArray())),
      lineMaterial: wire(0.12),
      pointMaterial: glowPointsMaterial("#d9d3c7", 60),
    };
  }, []);
  useFrame((state) => {
    const breathe = 0.75 + Math.sin(state.clock.elapsedTime * 0.9) * 0.25;
    geo.lineMaterial.opacity = 0.14 * amount.current * breathe;
    geo.pointMaterial.uniforms.uOpacity.value = 0.6 * amount.current * breathe;
  });
  return (
    <group ref={ref} position={ANCHORS[5]}>
      <lineSegments geometry={geo.lines} material={geo.lineMaterial} />
      <points geometry={geo.points} material={geo.pointMaterial} />
    </group>
  );
}

/** Scene 08 — next: the signal continues past what exists, dashed and unfinished. */
export function Horizon() {
  const { ref, amount } = useChapter(6, 1.3);
  const geo = useMemo(() => {
    const points = Array.from({ length: 40 }, (_, i) => {
      const t = i / 39;
      return new Vector3(t * 7, Math.sin(t * 3) * 0.6, -t * 6);
    });
    const material = new LineDashedMaterial({
      color: COLORS.amber,
      dashSize: 0.18,
      gapSize: 0.14,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const line = new Line(new BufferGeometry().setFromPoints(points), material);
    line.computeLineDistances();
    const stops = [points[10], points[22], points[34]];
    const ringPairs: [number[], number[]][] = stops.flatMap((c) =>
      Array.from({ length: 32 }, (_, i) => {
        const a = (i / 32) * Math.PI * 2;
        const b = ((i + 1) / 32) * Math.PI * 2;
        return [
          [c.x + Math.cos(a) * 0.22, c.y + Math.sin(a) * 0.22, c.z],
          [c.x + Math.cos(b) * 0.22, c.y + Math.sin(b) * 0.22, c.z],
        ] as [number[], number[]];
      }),
    );
    return { line, material, rings: segmentsGeometry(ringPairs), ringMaterial: wire(0.4) };
  }, []);
  useFrame(() => {
    geo.material.opacity = 0.7 * amount.current;
    geo.ringMaterial.opacity = 0.4 * amount.current;
  });
  return (
    <group ref={ref} position={ANCHORS[6]}>
      <primitive object={geo.line} />
      <lineSegments geometry={geo.rings} material={geo.ringMaterial} />
    </group>
  );
}

/** Scene 09 — contact: everything resolves into a single point. */
export function Beacon() {
  const { ref, amount } = useChapter(7, 1.2);
  const rings = useRef<(Group | null)[]>([]);
  const parts = useMemo(() => {
    const make = (scale: number, color: string) => {
      const sprite = new Sprite(
        new SpriteMaterial({ map: glowTexture(), color, blending: AdditiveBlending, depthWrite: false, transparent: true }),
      );
      sprite.scale.setScalar(scale);
      return sprite;
    };
    const circle = segmentsGeometry(
      Array.from({ length: 64 }, (_, i) => {
        const a = (i / 64) * Math.PI * 2;
        const b = ((i + 1) / 64) * Math.PI * 2;
        return [
          [Math.cos(a), Math.sin(a), 0],
          [Math.cos(b), Math.sin(b), 0],
        ];
      }),
    );
    return { halo: make(3.2, COLORS.amber), core: make(0.7, "#fff4e0"), circle, ringMaterials: [wire(0.3, COLORS.amber), wire(0.3, COLORS.amber)] };
  }, []);
  useFrame((state) => {
    const p = amount.current;
    const t = state.clock.elapsedTime;
    parts.halo.material.opacity = 0.55 * p;
    parts.core.material.opacity = p;
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = (t * 0.25 + i * 0.5) % 1;
      ring.scale.setScalar(0.3 + phase * 2.2);
      parts.ringMaterials[i].opacity = (1 - phase) * 0.45 * p;
    });
  });
  return (
    <group ref={ref} position={ANCHORS[7]}>
      <primitive object={parts.halo} />
      <primitive object={parts.core} />
      {parts.ringMaterials.map((material, i) => (
        <group key={i} ref={(node) => void (rings.current[i] = node)}>
          <lineSegments geometry={parts.circle} material={material} />
        </group>
      ))}
    </group>
  );
}
