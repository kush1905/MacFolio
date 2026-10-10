"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { scrollState } from "@/store/sceneStore";
import { ANCHORS } from "../layout";
import { glowPointsMaterial, pointsGeometry, segmentsGeometry, signalWire, wire } from "../materials";
import { useChapter } from "../useChapter";

/**
 * Scene 05 — career evolution, seen side-on. Each step along the line branches into
 * more connections: progression, not a judgement of earlier work.
 */
export function Timeline({ steps }: { steps: number }) {
  const { ref, amount } = useChapter(3, 1.3);

  const geo = useMemo(() => {
    const zs = Array.from({ length: steps }, (_, i) => 1.2 - (i * 5.4) / Math.max(1, steps - 1));
    const branchCounts = zs.map((_, i) => [1, 2, 3, 5, 6][Math.min(i, 4)]);
    const branches: [number[], number[]][] = [];
    const tips: number[] = [];
    zs.forEach((z, i) => {
      const n = branchCounts[i];
      const len = 0.45 + i * 0.22;
      for (let b = 0; b < n; b++) {
        const a = -Math.PI / 2 + ((b + 0.5) / n) * Math.PI - Math.PI / 2 + (i % 2 ? 0.2 : -0.2);
        const end = [0, Math.sin(a + Math.PI / 2) * len, z + Math.cos(a + Math.PI / 2) * len * 0.45];
        branches.push([[0, 0, z], end]);
        tips.push(...end);
      }
    });
    return {
      spine: segmentsGeometry([[[0, 0, 1.8], [0, 0, -5]]]),
      branches: segmentsGeometry(branches),
      nodes: pointsGeometry(zs.flatMap((z) => [0, 0, z]), zs.map((_, i) => 1 + i * 0.2)),
      tips: pointsGeometry(tips),
      spineMaterial: signalWire(0.7),
      branchMaterial: wire(0.3),
      nodeMaterial: glowPointsMaterial("#ffc46b", 110),
      tipMaterial: glowPointsMaterial("#d9d3c7", 50),
    };
  }, [steps]);

  useFrame(() => {
    const p = amount.current;
    // Branches grow in as the visitor reads down the timeline.
    const reveal = Math.min(1, Math.max(0.25, (scrollState.chapter - 2.5) / 0.8));
    geo.spineMaterial.opacity = 0.7 * p;
    geo.branchMaterial.opacity = 0.55 * p * reveal;
    geo.nodeMaterial.uniforms.uOpacity.value = p;
    geo.tipMaterial.uniforms.uOpacity.value = 0.85 * p * reveal;
  });

  return (
    <group ref={ref} position={ANCHORS[3]}>
      <lineSegments geometry={geo.spine} material={geo.spineMaterial} />
      <lineSegments geometry={geo.branches} material={geo.branchMaterial} />
      <points geometry={geo.nodes} material={geo.nodeMaterial} />
      <points geometry={geo.tips} material={geo.tipMaterial} />
    </group>
  );
}
