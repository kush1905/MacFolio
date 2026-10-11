"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { BufferGeometry, Line, LineDashedMaterial, Vector3 } from "three";
import { ANCHORS, COLORS } from "../layout";
import { segmentsGeometry, wire } from "../materials";
import { useChapter } from "../useChapter";

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
