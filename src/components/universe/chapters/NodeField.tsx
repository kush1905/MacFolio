"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  Plane,
  Raycaster,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";
import { ANCHORS, COLORS } from "../layout";
import { signalHead } from "../Filament";
import { glowTexture } from "../materials";
import { useChapter } from "../useChapter";

/** Field origin relative to the hero anchor: below the signal's head, receding to a horizon. */
const FIELD_Y = -1.45;

/**
 * Shared vertex logic: a slow swell across the field, a ripple under the cursor, and the
 * reveal / glow terms the fragment shaders use.
 */
const fieldVertex = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform vec3 uPointer;
  uniform float uPointerOn;
  uniform vec3 uHead;
  varying float vShown;
  varying float vGlow;
  varying float vFade;
  float swell(vec2 p, float t) {
    return sin(p.x * 0.55 + t * 0.45) * cos(p.y * 0.38 + t * 0.32) * 0.16
         + sin(p.x * 0.17 - p.y * 0.21 + t * 0.2) * 0.12;
  }
  vec3 displaced(vec3 position) {
    vec2 p = position.xz;
    float d = distance(p, uPointer.xz);
    float ripple = exp(-d * d * 0.35) * sin(d * 3.2 - uTime * 4.0) * 0.16 * uPointerOn;
    return vec3(position.x, position.y + swell(p, uTime) + ripple, position.z);
  }
  void field(vec3 position) {
    vec2 p = position.xz;
    // Reveal sweeps from near to far.
    float depth = clamp((2.0 - position.z) / 22.0, 0.0, 1.0);
    vShown = smoothstep(depth, depth + 0.12, uReveal * 1.15);
    // Glow beneath the signal head, and where the cursor is.
    float dh = distance(p, uHead.xz);
    float dp = distance(p, uPointer.xz);
    vGlow = exp(-dh * dh * 0.09) * 0.9 + exp(-dp * dp * 0.4) * 0.8 * uPointerOn;
    // Fade toward the text column (left), the far horizon, and the near edge.
    vFade = smoothstep(-5.5, 0.5, position.x)
          * smoothstep(-25.0, -14.0, position.z)
          * (1.0 - smoothstep(0.5, 2.2, position.z) * 0.6);
  }
`;

function fieldMaterial(kind: "points" | "lines") {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uFade: { value: 1 },
      uPointer: { value: new Vector3(99, 0, 99) },
      uPointerOn: { value: 0 },
      uHead: { value: new Vector3(0, 0, 0) },
      uWire: { value: new Color(COLORS.wire) },
      uAmber: { value: new Color(COLORS.amberHot) },
      uMap: { value: glowTexture() },
    },
    vertexShader:
      fieldVertex +
      (kind === "points"
        ? /* glsl */ `
      void main() {
        field(position);
        vec4 mv = modelViewMatrix * vec4(displaced(position), 1.0);
        gl_PointSize = mv.z < -0.2 ? min((34.0 + vGlow * 34.0) / -mv.z, 15.0) : 0.0;
        gl_Position = projectionMatrix * mv;
      }`
        : /* glsl */ `
      void main() {
        field(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced(position), 1.0);
      }`),
    fragmentShader:
      kind === "points"
        ? /* glsl */ `
      uniform sampler2D uMap; uniform float uFade; uniform vec3 uWire; uniform vec3 uAmber;
      varying float vShown; varying float vGlow; varying float vFade;
      void main() {
        float a = texture2D(uMap, gl_PointCoord).a;
        vec3 color = mix(uWire, uAmber, clamp(vGlow, 0.0, 1.0));
        gl_FragColor = vec4(color, a * (0.58 + vGlow * 0.9) * vShown * vFade * uFade);
      }`
        : /* glsl */ `
      uniform float uFade; uniform vec3 uWire; uniform vec3 uAmber;
      varying float vShown; varying float vGlow; varying float vFade;
      void main() {
        vec3 color = mix(uWire, uAmber, clamp(vGlow, 0.0, 1.0));
        gl_FragColor = vec4(color, (0.085 + vGlow * 0.34) * vShown * vFade * uFade);
      }`,
  });
}

/**
 * A field of nodes receding to a horizon: an ordered system, gently alive, that answers the
 * cursor with a ripple and glows where the signal passes. Used by the Ask Kush chapter.
 */
export function NodeField({ mobile, chapter }: { mobile: boolean; chapter: number }) {
  const { ref, amount } = useChapter(chapter, 1.15);
  const revealed = useRef(0);
  const camera = useThree((state) => state.camera);
  const ndc = useRef(new Vector2(9, 9));
  const pointerOn = useRef(0);

  const parts = useMemo(() => {
    const cols = mobile ? 50 : 86;
    const rows = mobile ? 26 : 46;
    const xMin = -7;
    const xMax = 15;
    const zNear = 1.8;
    const zFar = -24;
    const at = (c: number, r: number) => {
      // Rows get farther apart toward the viewer for a natural perspective rhythm.
      const t = r / (rows - 1);
      return [xMin + ((xMax - xMin) * c) / (cols - 1), FIELD_Y, zNear + (zFar - zNear) * Math.pow(t, 1.15)];
    };
    const points: number[] = [];
    const lines: number[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        points.push(...at(c, r));
        if (c < cols - 1) lines.push(...at(c, r), ...at(c + 1, r));
      }
    const pointGeometry = new BufferGeometry();
    pointGeometry.setAttribute("position", new BufferAttribute(new Float32Array(points), 3));
    const lineGeometry = new BufferGeometry();
    lineGeometry.setAttribute("position", new BufferAttribute(new Float32Array(lines), 3));
    return {
      pointGeometry,
      lineGeometry,
      pointMaterial: fieldMaterial("points"),
      lineMaterial: fieldMaterial("lines"),
      plane: new Plane(new Vector3(0, 1, 0), -FIELD_Y),
      ray: new Raycaster(),
      hit: new Vector3(),
      local: new Vector3(),
      headLocal: new Vector3(),
      pool: (() => {
        const mesh = new Mesh(
          new PlaneGeometry(9, 5),
          new MeshBasicMaterial({
            map: glowTexture(),
            color: COLORS.amber,
            transparent: true,
            opacity: 0,
            blending: AdditiveBlending,
            depthWrite: false,
          }),
        );
        mesh.rotation.x = -Math.PI / 2;
        return mesh;
      })(),
    };
  }, [mobile]);

  // Mouse: follow the cursor. Touch: a tap lights and ripples the field for a moment.
  const touchAt = useRef(-10);
  useEffect(() => {
    const set = (event: PointerEvent) =>
      ndc.current.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    const onMove = (event: PointerEvent) => event.pointerType === "mouse" && set(event);
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      set(event);
      touchAt.current = performance.now() / 1000;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  useEffect(
    () => () => {
      parts.pointGeometry.dispose();
      parts.lineGeometry.dispose();
      parts.pointMaterial.dispose();
      parts.lineMaterial.dispose();
      parts.pool.geometry.dispose();
      (parts.pool.material as MeshBasicMaterial).dispose();
    },
    [parts],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // Reveal (near to far) the first time the chapter comes into view, then stay revealed.
    if (amount.current > 0.15) revealed.current = Math.min(1, revealed.current + delta / 2.2);
    const reveal = revealed.current;

    // Cursor → point on the field plane, in the field's local space.
    let on = 0;
    const touching = performance.now() / 1000 - touchAt.current < 1.8;
    if (ref.current && ndc.current.x < 2 && (!mobile || touching)) {
      parts.ray.setFromCamera(ndc.current, camera);
      if (parts.ray.ray.intersectPlane(parts.plane, parts.hit)) {
        parts.local.copy(parts.hit);
        ref.current.worldToLocal(parts.local);
        on = 1;
      }
    }
    pointerOn.current += (on - pointerOn.current) * (1 - Math.exp(-delta * 4));

    const headLocal = ref.current ? ref.current.worldToLocal(parts.headLocal.copy(signalHead)) : parts.headLocal;
    // A soft pool of light on the field under the signal's head.
    parts.pool.position.set(headLocal.x, FIELD_Y + 0.02, headLocal.z - 0.6);
    (parts.pool.material as MeshBasicMaterial).opacity = 0.32 * amount.current * reveal;
    for (const material of [parts.pointMaterial, parts.lineMaterial]) {
      material.uniforms.uHead.value.copy(headLocal);
      material.uniforms.uTime.value = t;
      material.uniforms.uReveal.value = reveal;
      material.uniforms.uFade.value = amount.current;
      material.uniforms.uPointerOn.value = pointerOn.current;
      if (on) material.uniforms.uPointer.value.lerp(parts.local, 0.18);
    }
  });

  return (
    <group ref={ref} position={ANCHORS[chapter]}>
      <lineSegments geometry={parts.lineGeometry} material={parts.lineMaterial} frustumCulled={false} />
      <points geometry={parts.pointGeometry} material={parts.pointMaterial} frustumCulled={false} />
      <primitive object={parts.pool} />
    </group>
  );
}
