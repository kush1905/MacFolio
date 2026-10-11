"use client";

import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  TubeGeometry,
  Vector3,
  type CatmullRomCurve3,
} from "three";
import { scrollState } from "@/store/sceneStore";
import { COLORS } from "./layout";
import { glowTexture } from "./materials";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uHead;
  uniform float uTime;
  uniform float uSpeed;
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying vec2 vUv;
  void main() {
    float u = vUv.x;
    // Drawn behind the head, a faint ghost of the path ahead.
    float drawn = 1.0 - smoothstep(uHead - 0.01, uHead + 0.004, u);
    float ghost = 0.05 * (1.0 - smoothstep(uHead, uHead + 0.12, u));
    // Pulses travel forward along the drawn signal.
    float pulse = pow(fract(u * 22.0 - uTime * uSpeed), 18.0) * drawn;
    // Bright tip at the head.
    float tip = exp(-pow((u - uHead) * 260.0, 2.0));
    float alpha = drawn * 0.42 + ghost + pulse * 0.9 + tip;
    vec3 color = mix(uColor, uHot, clamp(pulse + tip, 0.0, 1.0));
    gl_FragColor = vec4(color * (0.75 + pulse * 1.4 + tip * 1.8), alpha);
  }
`;

/** World position of the signal's head, read by the node field to glow beneath it. */
export const signalHead = new Vector3(0, 0, 0);

/**
 * The signal: a single amber line that draws itself forward as the visitor scrolls.
 * Everything else in the scene is laid out along it.
 */
export function Filament({
  curve,
  anchors,
  mobile,
}: {
  curve: CatmullRomCurve3;
  anchors: number[];
  mobile: boolean;
}) {
  const geometry = useMemo(
    () => new TubeGeometry(curve, mobile ? 360 : 900, 0.011, 5, false),
    [curve, mobile],
  );
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uHead: { value: 0 },
          uTime: { value: 0 },
          uSpeed: { value: 0.22 },
          uColor: { value: new Color(COLORS.amber) },
          uHot: { value: new Color(COLORS.amberHot) },
        },
      }),
    [],
  );
  const head = useMemo(() => {
    const sprite = new Sprite(
      new SpriteMaterial({
        map: glowTexture(),
        color: COLORS.amberHot,
        blending: AdditiveBlending,
        depthWrite: false,
        transparent: true,
      }),
    );
    sprite.scale.setScalar(0.9);
    return sprite;
  }, []);

  // Intro: the signal draws in from the darkness to the hero in ~1.2 s. Never blocks content.
  const intro = useRef({ value: 0 });
  useEffect(() => {
    const tween = gsap.to(intro.current, { value: 1, duration: 1.4, ease: "power3.out", delay: 0.15 });
    return () => {
      tween.kill();
    };
  }, []);

  const headPoint = useMemo(() => new Vector3(), []);
  const current = useRef(0);

  useFrame((state, delta) => {
    const chapter = Math.min(Math.max(scrollState.chapter, 0), anchors.length - 1);
    const i = Math.floor(chapter);
    const f = chapter - i;
    const a = anchors[i];
    const b = anchors[Math.min(i + 1, anchors.length - 1)];
    // The head leads the camera slightly so the line is always arriving somewhere.
    const target = Math.min(1, (a + (b - a) * f + 0.012) * intro.current.value);
    current.current += (target - current.current) * (1 - Math.exp(-delta * 4));
    material.uniforms.uHead.value = current.current;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uSpeed.value = 0.22 + Math.min(Math.abs(scrollState.velocity) / 4000, 0.6);
    curve.getPointAt(Math.min(current.current, 1), headPoint);
    signalHead.copy(headPoint);
    head.position.copy(headPoint);
    head.scale.setScalar(0.75 + Math.sin(state.clock.elapsedTime * 2.2) * 0.08);
  });

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      head.material.dispose();
    },
    [geometry, material, head],
  );

  return (
    <group>
      <mesh geometry={geometry} material={material} frustumCulled={false} />
      <primitive object={head} />
    </group>
  );
}
