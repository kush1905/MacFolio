"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Vector3 } from "three";
import type { HomeProject, TechNode } from "@/lib/portfolio";
import { useSceneStore } from "@/store/sceneStore";
import { ANCHORS } from "../layout";
import { glowPointsMaterial, pointsGeometry, segmentsGeometry, signalWire, wire } from "../materials";
import { useChapter } from "../useChapter";

const DEFAULT_TECH = "react-native";

/**
 * Scene 06 — the engineering core. Technologies on an outer shell, projects on an
 * inner ring, edges only where the published evidence connects them.
 */
export function CoreGraph({ nodes, projects }: { nodes: TechNode[]; projects: HomeProject[] }) {
  const { ref, amount } = useChapter(4, 1.3);
  const activeTech = useSceneStore((state) => state.activeTech) ?? DEFAULT_TECH;

  const base = useMemo(() => {
    const tech = new Map<string, Vector3>();
    const golden = Math.PI * (3 - Math.sqrt(5));
    nodes.forEach((node, i) => {
      const y = 1 - (i / (nodes.length - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      tech.set(node.slug, new Vector3(Math.cos(golden * i) * r * 2.3, y * 1.7, Math.sin(golden * i) * r * 2.3));
    });
    const proj = new Map<string, Vector3>();
    projects.forEach((project, i) => {
      const a = (i / projects.length) * Math.PI * 2;
      proj.set(project.slug, new Vector3(Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0));
    });
    const pairs: [number[], number[]][] = nodes.flatMap((node) =>
      node.projects.flatMap((slug) => {
        const p = proj.get(slug);
        return p ? [[tech.get(node.slug)!.toArray(), p.toArray()] as [number[], number[]]] : [];
      }),
    );
    return {
      tech,
      proj,
      edges: segmentsGeometry(pairs),
      techPoints: pointsGeometry([...tech.values()].flatMap((v) => v.toArray())),
      projectPoints: pointsGeometry([...proj.values()].flatMap((v) => v.toArray()), [...proj.keys()].map(() => 1.3)),
      edgeMaterial: wire(0.07),
      hotMaterial: signalWire(0.9),
      techMaterial: glowPointsMaterial("#d9d3c7", 55),
      projectMaterial: glowPointsMaterial("#d9d3c7", 75),
      hotPointsMaterial: glowPointsMaterial("#ffc46b", 130),
    };
  }, [nodes, projects]);

  const active = useMemo(() => {
    const node = nodes.find((n) => n.slug === activeTech) ?? nodes[0];
    const from = base.tech.get(node.slug)!;
    const targets = node.projects.flatMap((slug) => (base.proj.has(slug) ? [base.proj.get(slug)!] : []));
    return {
      edges: segmentsGeometry(targets.map((t) => [from.toArray(), t.toArray()])),
      points: pointsGeometry([from, ...targets].flatMap((v) => v.toArray()), [1.4, ...targets.map(() => 1)]),
    };
  }, [activeTech, base, nodes]);

  useEffect(
    () => () => {
      active.edges.dispose();
      active.points.dispose();
    },
    [active],
  );

  useFrame((state) => {
    const p = amount.current;
    base.edgeMaterial.opacity = 0.08 * p;
    base.hotMaterial.opacity = 0.9 * p;
    base.techMaterial.uniforms.uOpacity.value = 0.55 * p;
    base.projectMaterial.uniforms.uOpacity.value = 0.7 * p;
    base.hotPointsMaterial.uniforms.uOpacity.value = p;
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={ref} position={ANCHORS[4]}>
      <lineSegments geometry={base.edges} material={base.edgeMaterial} />
      <lineSegments geometry={active.edges} material={base.hotMaterial} />
      <points geometry={base.techPoints} material={base.techMaterial} />
      <points geometry={base.projectPoints} material={base.projectMaterial} />
      <points geometry={active.points} material={base.hotPointsMaterial} />
    </group>
  );
}
