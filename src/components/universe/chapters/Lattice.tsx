"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
} from "three";
import { ANCHORS, COLORS, rng } from "../layout";
import { glowTexture } from "../materials";
import { useChapter } from "../useChapter";

const lineVertex = /* glsl */ `
  attribute float aBirth;
  varying float vBirth;
  void main() {
    vBirth = aBirth;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const lineFragment = /* glsl */ `
  uniform float uReveal;
  uniform float uFade;
  uniform vec3 uWire;
  uniform vec3 uAmber;
  varying float vBirth;
  void main() {
    float shown = smoothstep(vBirth, vBirth - 0.08, uReveal);
    float fresh = smoothstep(0.25, 0.0, uReveal - vBirth) * shown;
    vec3 color = mix(uWire, uAmber, fresh);
    gl_FragColor = vec4(color, (0.42 + fresh * 0.55) * shown * uFade);
  }
`;

/**
 * Scene 00 — the signal lays down its first structure: a sparse architectural lattice
 * that assembles outward from where the signal enters.
 */
export function Lattice({ mobile }: { mobile: boolean }) {
  const { ref, amount } = useChapter(0, 1.3);

  const { lines, points, material, pointMaterial } = useMemo(() => {
    const random = rng(19);
    const nodes: [number, number, number][] = [];
    const nx = mobile ? 6 : 8;
    for (let x = 0; x < nx; x++)
      for (let y = 0; y < 4; y++)
        for (let z = 0; z < 3; z++) {
          if (random() < (mobile ? 0.55 : 0.42)) continue;
          nodes.push([
            (x - nx / 2) * 1.05 + 1.2 + (random() - 0.5) * 0.25,
            (y - 1.5) * 0.95 + (random() - 0.5) * 0.2,
            (z - 1) * 1.1 - 1.4 + (random() - 0.5) * 0.25,
          ]);
        }
    const origin = [-4, -1.2, 0];
    const dist = (p: number[]) => Math.hypot(p[0] - origin[0], p[1] - origin[1], p[2] - origin[2]);
    const maxDist = Math.max(...nodes.map(dist));

    const positions: number[] = [];
    const births: number[] = [];
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
        if (d > 1.32) continue;
        const birth = Math.min(dist(a), dist(b)) / maxDist;
        positions.push(...a, ...b);
        births.push(birth, birth);
      }
    const lineGeometry = new BufferGeometry();
    lineGeometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    lineGeometry.setAttribute("aBirth", new BufferAttribute(new Float32Array(births), 1));

    const material = new ShaderMaterial({
      vertexShader: lineVertex,
      fragmentShader: lineFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uReveal: { value: 0 },
        uFade: { value: 1 },
        uWire: { value: new Color(COLORS.wire) },
        uAmber: { value: new Color(COLORS.amber) },
      },
    });

    const pointGeometry = new BufferGeometry();
    pointGeometry.setAttribute("position", new BufferAttribute(new Float32Array(nodes.flat()), 3));
    const pointMaterial = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uMap: { value: glowTexture() }, uOpacity: { value: 0 }, uColor: { value: new Color(COLORS.wire) } },
      vertexShader: /* glsl */ `
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = mv.z < -0.2 ? min(110.0 / -mv.z, 64.0) : 0.0;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap; uniform float uOpacity; uniform vec3 uColor;
        void main() { gl_FragColor = vec4(uColor, texture2D(uMap, gl_PointCoord).a * uOpacity); }`,
    });
    return {
      lines: lineGeometry,
      points: new Points(pointGeometry, pointMaterial),
      material,
      pointMaterial,
    };
  }, [mobile]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    material.uniforms.uReveal.value = Math.min(1.1, Math.max(0, (t - 0.5) / 1.6));
    material.uniforms.uFade.value = amount.current;
    pointMaterial.uniforms.uOpacity.value = 0.8 * amount.current * Math.min(1, Math.max(0, (t - 0.9) / 1.2));
    if (ref.current) ref.current.rotation.y = Math.sin(t * 0.08) * 0.06;
  });

  return (
    <group ref={ref} position={ANCHORS[0]}>
      <lineSegments geometry={lines} material={material} />
      <primitive object={points} />
    </group>
  );
}
