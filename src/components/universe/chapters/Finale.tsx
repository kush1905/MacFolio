"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  type Group,
  QuadraticBezierCurve3,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";
import { useSceneStore } from "@/store/sceneStore";
import { ANCHORS, COLORS, rng } from "../layout";
import { glowPointsMaterial, glowTexture, pointsGeometry, segmentsGeometry, wire } from "../materials";
import { useChapter } from "../useChapter";

const THREADS = 9;
const PARTICLES = 170;

function glowSprite(color: string, opacity: number) {
  const sprite = new Sprite(
    new SpriteMaterial({
      map: glowTexture(),
      color,
      opacity,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  );
  return sprite;
}

function circle(radius: number, segments = 96) {
  return segmentsGeometry(
    Array.from({ length: segments }, (_, i) => {
      const a = (i / segments) * Math.PI * 2;
      const b = ((i + 1) / segments) * Math.PI * 2;
      return [
        [Math.cos(a) * radius, Math.sin(a) * radius, 0],
        [Math.cos(b) * radius, Math.sin(b) * radius, 0],
      ];
    }),
  );
}

/** Fine particles spiralling inward to the point; positions are computed on the GPU. */
function spiralMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uMap: { value: glowTexture() },
      uColor: { value: new Color(COLORS.amberHot) },
    },
    vertexShader: /* glsl */ `
      attribute float aAngle;
      attribute float aRadius;
      attribute float aSpeed;
      attribute float aLift;
      uniform float uTime;
      varying float vFade;
      void main() {
        float r = mod(aRadius - uTime * aSpeed, 6.2) + 0.25;
        float a = aAngle + uTime * 0.12 + (6.4 - r) * 0.42;
        vec3 p = vec3(cos(a) * r, aLift * r * 0.22, sin(a) * r * 0.55);
        vFade = smoothstep(0.25, 1.1, r) * (1.0 - smoothstep(4.6, 6.4, r));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = mv.z < -0.2 ? min(26.0 / -mv.z, 18.0) : 0.0;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap; uniform float uOpacity; uniform vec3 uColor;
      varying float vFade;
      void main() { gl_FragColor = vec4(uColor, texture2D(uMap, gl_PointCoord).a * uOpacity * vFade); }`,
  });
}

/**
 * Scene 09 — contact. Every thread of the work converges into one point, held by three
 * slow gyroscope rings. Focusing the contact form brightens it; sending fires a shockwave.
 */
export function Finale({ mobile }: { mobile: boolean }) {
  const { ref, amount } = useChapter(7, 1.25);
  const rings = useRef<(Group | null)[]>([]);
  const wave = useRef<Group>(null);
  const energy = useRef(0);
  const waveStart = useRef(-10);
  const clock = useRef(0);

  const parts = useMemo(() => {
    const random = rng(97);

    // Core: bright point, inner glow, wide soft bloom, and a faint anamorphic streak.
    const core = glowSprite("#fff6e6", 1);
    core.scale.setScalar(0.32);
    const inner = glowSprite(COLORS.amberHot, 0.6);
    inner.scale.setScalar(1.2);
    const bloom = glowSprite(COLORS.amber, 0.1);
    bloom.scale.setScalar(4.2);
    const streak = glowSprite(COLORS.amberHot, 0.28);
    streak.scale.set(5.2, 0.1, 1);

    // Gyroscope rings, each with a small light riding it.
    const ringDefs = [
      { r: 1.05, tilt: [1.15, 0.2, 0], speed: 0.32, color: COLORS.amberHot, opacity: 0.32 },
      { r: 1.55, tilt: [0.35, 0.9, 0.2], speed: -0.21, color: COLORS.wire, opacity: 0.16 },
      { r: 2.15, tilt: [1.45, -0.55, 0.5], speed: 0.14, color: COLORS.amber, opacity: 0.18 },
    ].map((def) => ({
      ...def,
      geometry: circle(def.r),
      material: wire(def.opacity, def.color),
      rider: pointsGeometry([def.r, 0, 0], [1.2]),
    }));
    const riderMaterial = glowPointsMaterial(COLORS.amberHot, 70);

    // Threads converging from all around (kept behind and beside the point, never at the lens).
    const curves = Array.from({ length: THREADS }, (_, i) => {
      const theta = (i / THREADS) * Math.PI * 2 + random() * 0.4;
      const radius = 5.5 + random() * 2;
      const start = new Vector3(
        Math.cos(theta) * radius,
        (random() - 0.5) * 3.2,
        -Math.abs(Math.sin(theta)) * radius * 0.6 - 0.5,
      );
      const control = start.clone().multiplyScalar(0.45).add(new Vector3(-start.y * 0.4, start.x * 0.3, 0));
      return new QuadraticBezierCurve3(start, control, new Vector3(0, 0, 0)).getPoints(40);
    });
    const threads = segmentsGeometry(
      curves.flatMap((points) => points.slice(1).map((p, i) => [points[i].toArray(), p.toArray()] as [number[], number[]])),
    );
    const threadMaterial = wire(0.1, COLORS.amber);
    const sparks = pointsGeometry(
      curves.flatMap(() => [0, 0, 0]),
      curves.map(() => 1),
    );
    const sparkMaterial = glowPointsMaterial(COLORS.amberHot, 85);

    // Spiral particles.
    const count = mobile ? 90 : PARTICLES;
    const spiral = new BufferGeometry();
    spiral.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
    spiral.setAttribute("aAngle", new BufferAttribute(Float32Array.from({ length: count }, () => random() * Math.PI * 2), 1));
    spiral.setAttribute("aRadius", new BufferAttribute(Float32Array.from({ length: count }, () => random() * 6.2), 1));
    spiral.setAttribute("aSpeed", new BufferAttribute(Float32Array.from({ length: count }, () => 0.25 + random() * 0.35), 1));
    spiral.setAttribute("aLift", new BufferAttribute(Float32Array.from({ length: count }, () => random() * 2 - 1), 1));
    spiral.boundingSphere = null;
    const spiralMat = spiralMaterial();

    // Shockwave for a sent message.
    const waveGeometry = circle(1, 128);
    const waveMaterial = wire(0, COLORS.amberHot);

    return {
      core,
      inner,
      bloom,
      streak,
      ringDefs,
      riderMaterial,
      curves,
      threads,
      threadMaterial,
      sparks,
      sparkMaterial,
      spiral,
      spiralMat,
      waveGeometry,
      waveMaterial,
    };
  }, [mobile]);

  // A successful send triggers the shockwave.
  useEffect(
    () =>
      useSceneStore.subscribe((state, previous) => {
        if (state.contact === "sent" && previous.contact !== "sent") waveStart.current = clock.current;
      }),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    clock.current = t;
    const p = amount.current;
    const contact = useSceneStore.getState().contact;
    const target = contact === "composing" ? 1 : 0;
    energy.current += (target - energy.current) * (1 - Math.exp(-delta * 3));
    const e = energy.current;
    const breathe = 1 + Math.sin(t * 1.6) * 0.06;

    // Core
    parts.core.material.opacity = p;
    parts.core.scale.setScalar(0.32 * breathe * (1 + e * 0.25));
    parts.inner.material.opacity = 0.6 * p * (1 + e * 0.4);
    parts.inner.scale.setScalar(1.2 * breathe * (1 + e * 0.3));
    parts.bloom.material.opacity = 0.1 * p * (1 + e * 0.8);
    parts.streak.material.opacity = 0.28 * p * (0.85 + e * 0.5);
    parts.streak.scale.set(5.2 * (1 + e * 0.25), 0.1, 1);

    // Rings turn; faster while someone is writing a message.
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const def = parts.ringDefs[i];
      ring.rotation.z += def.speed * delta * (1 + e * 1.8);
      def.material.opacity = def.opacity * p * (1 + e * 0.6);
    });
    parts.riderMaterial.uniforms.uOpacity.value = 0.9 * p;

    // Threads and sparks flowing inward.
    parts.threadMaterial.opacity = 0.1 * p * (1 + e);
    const position = parts.sparks.getAttribute("position");
    parts.curves.forEach((points, i) => {
      const phase = (t * (0.22 + e * 0.25) + i * 0.137) % 1;
      const point = points[Math.floor(phase * (points.length - 1))];
      position.setXYZ(i, point.x, point.y, point.z);
    });
    position.needsUpdate = true;
    parts.sparkMaterial.uniforms.uOpacity.value = p;

    // Spiral particles.
    parts.spiralMat.uniforms.uTime.value = t;
    parts.spiralMat.uniforms.uOpacity.value = 0.7 * p;

    // Shockwave after a successful send.
    const since = t - waveStart.current;
    if (wave.current) {
      const active = since >= 0 && since < 1.8;
      wave.current.visible = active;
      if (active) {
        const k = since / 1.8;
        wave.current.scale.setScalar(0.3 + k * 6);
        parts.waveMaterial.opacity = (1 - k) * 0.85 * p;
        parts.core.scale.multiplyScalar(1 + (1 - k) * 0.8);
      }
    }
  });

  useEffect(
    () => () => {
      [parts.core, parts.inner, parts.bloom, parts.streak].forEach((s) => s.material.dispose());
      parts.ringDefs.forEach((d) => {
        d.geometry.dispose();
        d.material.dispose();
        d.rider.dispose();
      });
      [parts.threads, parts.sparks, parts.spiral, parts.waveGeometry].forEach((g) => g.dispose());
      [parts.riderMaterial, parts.threadMaterial, parts.sparkMaterial, parts.spiralMat, parts.waveMaterial].forEach((m) =>
        m.dispose(),
      );
    },
    [parts],
  );

  return (
    <group ref={ref} position={ANCHORS[7]}>
      <lineSegments geometry={parts.threads} material={parts.threadMaterial} />
      <points geometry={parts.sparks} material={parts.sparkMaterial} frustumCulled={false} />
      <points geometry={parts.spiral} material={parts.spiralMat} frustumCulled={false} />
      {parts.ringDefs.map((def, i) => (
        <group key={def.r} rotation={def.tilt as [number, number, number]}>
          <group ref={(node) => void (rings.current[i] = node)}>
            <lineSegments geometry={def.geometry} material={def.material} />
            <points geometry={def.rider} material={parts.riderMaterial} frustumCulled={false} />
          </group>
        </group>
      ))}
      <primitive object={parts.bloom} />
      <primitive object={parts.inner} />
      <primitive object={parts.streak} />
      <primitive object={parts.core} />
      <group ref={wave} visible={false}>
        <lineSegments geometry={parts.waveGeometry} material={parts.waveMaterial} />
      </group>
    </group>
  );
}
