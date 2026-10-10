import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  LineBasicMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
  ShaderMaterial,
} from "three";
import { COLORS } from "./layout";

let glow: CanvasTexture | null = null;

/** Soft radial falloff used for every point of light (signal head, nodes, beacon). */
export function glowTexture() {
  if (glow) return glow;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(255,255,255,0.55)");
  g.addColorStop(0.5, "rgba(255,255,255,0.08)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  glow = new CanvasTexture(canvas);
  glow.colorSpace = SRGBColorSpace;
  return glow;
}

/**
 * Abstract interface drawn on device screens. These are deliberately schematic:
 * the repo has no real product screenshots yet, so nothing pretends to be one.
 */
export function interfaceTexture(variant: "dashboard" | "phone" | "list") {
  const w = variant === "dashboard" ? 640 : 300;
  const h = variant === "dashboard" ? 400 : 600;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#101114";
  ctx.fillRect(0, 0, w, h);
  const line = "rgba(217,211,199,0.16)";
  const soft = "rgba(217,211,199,0.07)";
  const amber = COLORS.amber;
  const block = (x: number, y: number, bw: number, bh: number, color = soft) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, bw, bh, 8);
    ctx.fill();
  };

  if (variant === "dashboard") {
    block(0, 0, 70, h, "rgba(255,255,255,0.03)");
    for (let i = 0; i < 6; i++) block(20, 30 + i * 46, 30, 22, i === 1 ? "rgba(233,162,59,0.5)" : soft);
    block(90, 24, 250, 170);
    ctx.strokeStyle = amber;
    ctx.lineWidth = 3;
    ctx.beginPath();
    [0.8, 0.72, 0.76, 0.6, 0.64, 0.45, 0.5, 0.32, 0.36, 0.22].forEach((v, i) => {
      const x = 106 + i * 24;
      const y = 40 + v * 130;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    block(356, 24, 264, 170);
    for (let i = 0; i < 7; i++) block(374 + i * 34, 170 - (20 + ((i * 37) % 90)), 20, 20 + ((i * 37) % 90), i === 4 ? amber : line);
    for (let i = 0; i < 4; i++) {
      block(90 + i * 134, 214, 120, 160);
      block(102 + i * 134, 226, 96, 70, "rgba(255,255,255,0.06)");
      block(102 + i * 134, 340, 60, 18, i === 0 ? amber : line);
    }
  } else if (variant === "phone") {
    block(20, 30, 120, 16, line);
    block(20, 70, w - 40, 180);
    ctx.strokeStyle = amber;
    ctx.lineWidth = 3;
    ctx.beginPath();
    [0.7, 0.62, 0.66, 0.4, 0.46, 0.28].forEach((v, i) => {
      const x = 40 + i * 44;
      const y = 90 + v * 140;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
      block(20, 270 + i * 70, w - 40, 56);
      block(32, 282 + i * 70, 32, 32, "rgba(255,255,255,0.08)");
      block(76, 288 + i * 70, 120, 10, line);
    }
    block(w - 90, h - 70, 60, 40, amber);
  } else {
    for (let i = 0; i < 6; i++) {
      block(18, 24 + i * 94, w - 36, 80);
      block(30, 36 + i * 94, 56, 56, "rgba(255,255,255,0.07)");
      block(98, 44 + i * 94, 140, 12, line);
      block(98, 66 + i * 94, 90, 10, soft);
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Dark anodized metal: bodies, plinths, device frames. */
export const metal = () =>
  new MeshStandardMaterial({ color: COLORS.metal, metalness: 0.55, roughness: 0.42 });

/** Smoked glass: translucent architectural planes. */
export const smokedGlass = (opacity = 0.42) =>
  new MeshStandardMaterial({
    color: COLORS.glass,
    metalness: 0.2,
    roughness: 0.18,
    transparent: true,
    opacity,
    depthWrite: false,
  });

/** Fine wire for structure lines. */
export const wire = (opacity = 0.28, color = COLORS.wire) =>
  new LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });

/** Emissive amber lines for active connections. */
export const signalWire = (opacity = 0.9) =>
  new LineBasicMaterial({
    color: COLORS.amber,
    transparent: true,
    opacity,
    blending: AdditiveBlending,
    depthWrite: false,
  });

export const amber = new Color(COLORS.amber);
export const amberHot = new Color(COLORS.amberHot);
export const wireColor = new Color(COLORS.wire);

/** Glowing round points with per-point size; colour/opacity are uniforms so callers can animate them. */
export function glowPointsMaterial(color: string, size = 70) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uMap: { value: glowTexture() },
      uOpacity: { value: 1 },
      uColor: { value: new Color(color) },
      uSize: { value: size },
    },
    vertexShader: /* glsl */ `
      attribute float aScale;
      uniform float uSize;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        // Clamp: a point grazing the lens would otherwise cover the screen in additive overdraw.
        gl_PointSize = mv.z < -0.2 ? min(uSize * aScale / -mv.z, 64.0) : 0.0;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap; uniform float uOpacity; uniform vec3 uColor;
      void main() { gl_FragColor = vec4(uColor, texture2D(uMap, gl_PointCoord).a * uOpacity); }`,
  });
}

/** Points geometry with an aScale attribute (defaults to 1). */
export function pointsGeometry(positions: number[], scales?: number[]) {
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute(
    "aScale",
    new BufferAttribute(new Float32Array(scales ?? positions.filter((_, i) => i % 3 === 0).map(() => 1)), 1),
  );
  return geometry;
}

/** Line segments geometry from [a, b] pairs. */
export function segmentsGeometry(pairs: [number[], number[]][]) {
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(pairs.flatMap(([a, b]) => [...a, ...b])), 3),
  );
  return geometry;
}
