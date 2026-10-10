"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BoxGeometry, EdgesGeometry, type Group, InstancedMesh, Matrix4, type Points } from "three";
import { scrollState } from "@/store/sceneStore";
import { ANCHORS, rng } from "../layout";
import {
  amber,
  glowPointsMaterial,
  metal,
  pointsGeometry,
  segmentsGeometry,
  smokedGlass,
  wire,
  wireColor,
} from "../materials";
import { useChapter } from "../useChapter";

const LAYER_COUNT = 5; // interface, API, services, data, integrations

/**
 * Scene 02 — the system forms. Five layers of a product stack, exploded apart as the
 * camera passes between them; the layer being read glows.
 */
export function SystemLayers({ mobile }: { mobile: boolean }) {
  const { ref, amount } = useChapter(1, 1.4);
  const layers = useRef<(Group | null)[]>([]);
  const pulses = useRef<Points>(null);

  const parts = useMemo(() => {
    const slab = new BoxGeometry(3.6, 0.03, 2.2);
    const edges = new EdgesGeometry(slab);
    const glass = smokedGlass(0.5);
    const edgeMaterials = Array.from({ length: LAYER_COUNT }, () => wire(0.3));
    // Components sitting on each layer — a few small modules per slab.
    const random = rng(7);
    const moduleGeometry = new BoxGeometry(0.34, 0.07, 0.24);
    const modules = Array.from({ length: LAYER_COUNT }, (_, layer) => {
      const count = mobile ? 4 : 6 + layer;
      const mesh = new InstancedMesh(moduleGeometry, metal(), count);
      const m = new Matrix4();
      for (let i = 0; i < count; i++) {
        m.makeTranslation((random() - 0.5) * 3, 0.05, (random() - 0.5) * 1.7);
        mesh.setMatrixAt(i, m);
      }
      return mesh;
    });
    // Vertical connectors that requests travel through.
    const connectors = [
      [-1.2, -0.5],
      [0.3, 0.6],
      [1.3, -0.3],
    ];
    const pulseGeometry = pointsGeometry(
      connectors.flatMap(([x, z]) => [x, 0, z, x, 0, z]),
      connectors.flatMap(() => [1, 0.7]),
    );
    return {
      slab,
      edges,
      glass,
      edgeMaterials,
      modules,
      connectors,
      pulseGeometry,
      pulseMaterial: glowPointsMaterial("#ffc46b", 110),
      connectorMaterial: wire(0.14),
      connectorGeometry: segmentsGeometry(
        connectors.map(([x, z]) => [
          [x, 2.4, z],
          [x, -2.4, z],
        ]),
      ),
    };
  }, [mobile]);

  const span = (LAYER_COUNT - 1) / 2;

  useFrame((state) => {
    const p = amount.current;
    // Read position within the chapter decides which layer is lit.
    const local = scrollState.chapter - 1; // -1..1 around this chapter
    const active = Math.round(Math.min(Math.max((local + 0.45) / 0.9, 0), 1) * (LAYER_COUNT - 1));
    const spacing = 0.42 + p * 0.5;
    layers.current.forEach((layer, i) => {
      if (!layer) return;
      layer.position.y = (span - i) * spacing;
      const material = parts.edgeMaterials[i];
      const lit = i === active ? 1 : 0;
      material.color.lerpColors(wireColor, amber, lit);
      material.opacity = (0.2 + lit * 0.7) * p;
    });
    parts.glass.opacity = 0.5 * p;
    parts.connectorMaterial.opacity = 0.16 * p;

    // Pulses run top to bottom: a request travelling through the stack.
    const position = parts.pulseGeometry.getAttribute("position");
    const t = state.clock.elapsedTime;
    parts.connectors.forEach(([x, z], c) => {
      for (let k = 0; k < 2; k++) {
        const phase = (t * 0.35 + c * 0.31 + k * 0.5) % 1;
        position.setXYZ(c * 2 + k, x, span * spacing - phase * 2 * span * spacing, z);
      }
    });
    position.needsUpdate = true;
    parts.pulseMaterial.uniforms.uOpacity.value = p;
    if (ref.current) ref.current.rotation.y = -0.35 + Math.sin(t * 0.1) * 0.05;
  });

  return (
    <group ref={ref} position={ANCHORS[1]}>
      {Array.from({ length: LAYER_COUNT }, (_, i) => (
        <group key={i} ref={(node) => void (layers.current[i] = node)}>
          <mesh geometry={parts.slab} material={parts.glass} />
          <lineSegments geometry={parts.edges} material={parts.edgeMaterials[i]} />
          <primitive object={parts.modules[i]} />
        </group>
      ))}
      <lineSegments geometry={parts.connectorGeometry} material={parts.connectorMaterial} />
      <points ref={pulses} geometry={parts.pulseGeometry} material={parts.pulseMaterial} frustumCulled={false} />
    </group>
  );
}
