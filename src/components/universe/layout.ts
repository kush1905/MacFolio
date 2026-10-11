import { CatmullRomCurve3, Vector3 } from "three";
import type { StationKind } from "@/lib/portfolio";

/** Palette shared by every material in the scene. */
export const COLORS = {
  bg: "#0b0b0c",
  amber: "#e9a23b",
  amberHot: "#ffc46b",
  wire: "#d9d3c7",
  metal: "#1b1c20",
  glass: "#14161a",
};

/** World-space centre of each chapter's composition. The signal passes through all of them. */
export const ANCHORS = [
  new Vector3(0, 0, 0), // signal
  new Vector3(1, -0.5, -16), // system
  new Vector3(0, 0, -34), // work
  new Vector3(-1, 0.5, -52), // experience
  new Vector3(0, 0, -68), // core
  new Vector3(1, 0, -82), // ask
  new Vector3(0, 0.4, -94), // next
  new Vector3(0, 0, -108), // contact
];

/** Camera position (offset from the anchor) and look target (offset) per chapter. */
const CAMERA_OFFSETS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [0.2, 0.5, 7.4], look: [0, 0, 0] },
  { pos: [4.6, 2.4, 5.6], look: [0, 0, 0] },
  { pos: [0.8, 5.4, 12.6], look: [0.4, -0.4, -0.5] },
  { pos: [9.2, 1.4, -0.6], look: [0, 0.2, -1.2] },
  { pos: [0, 0.6, 8.2], look: [0, 0, 0] },
  { pos: [-1.5, 0.4, 7.6], look: [0, 0, 0] },
  { pos: [-3.2, 1.2, 6.8], look: [1.6, 0, -2] },
  { pos: [0, 0, 6.4], look: [0, 0, 0] },
];

export const CAMERA_KEYS = ANCHORS.map((anchor, i) => ({
  pos: anchor.clone().add(new Vector3(...CAMERA_OFFSETS[i].pos)),
  look: anchor.clone().add(new Vector3(...CAMERA_OFFSETS[i].look)),
}));

export const CHAPTER_COUNT = ANCHORS.length;

/** Deterministic PRNG so the composition is identical on every visit. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The signal: one continuous curve from the darkness behind the hero to the contact beacon. */
export function buildSignalCurve() {
  // Enters from the lower right, out of frame, so it never crosses the hero copy.
  const points: Vector3[] = [new Vector3(8.5, -4.2, 3.8), new Vector3(3.8, -2.1, 2.2)];
  ANCHORS.forEach((anchor, i) => {
    points.push(anchor.clone());
    const next = ANCHORS[i + 1];
    if (next) {
      const mid = anchor.clone().lerp(next, 0.5);
      mid.x += Math.sin(i * 1.7 + 0.4) * 3.2;
      mid.y += Math.cos(i * 1.3) * 1.4;
      points.push(mid);
    }
  });
  return new CatmullRomCurve3(points, false, "centripetal", 0.5);
}

/** Arc-length position (0–1) of each anchor along the signal curve. */
export function anchorParams(curve: CatmullRomCurve3) {
  const samples = curve.getSpacedPoints(1200);
  return ANCHORS.map((anchor) => {
    let best = 0;
    let bestDist = Infinity;
    samples.forEach((point, index) => {
      const d = point.distanceToSquared(anchor);
      if (d < bestDist) {
        bestDist = d;
        best = index;
      }
    });
    return best / (samples.length - 1);
  });
}

/** Where each project station sits inside the "work" chapter (relative to its anchor). */
export function stationLayout(kinds: StationKind[]) {
  // Flagship in the centre; the others orbit it on a tilted ellipse so the whole
  // system stays in the right-hand half of the frame, clear of the text column.
  return kinds.map((kind, index) => {
    if (index === 0) return { kind, position: new Vector3(0, 0, 0), scale: 1.25 };
    const angle = Math.PI * 0.62 + ((index - 1) / (kinds.length - 1)) * Math.PI * 2;
    return {
      kind,
      position: new Vector3(Math.cos(angle) * 3.1, Math.sin(angle * 2) * 0.35, Math.sin(angle) * 2.3 - 0.4),
      scale: 0.72,
    };
  });
}

export function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** How present a chapter is (1 = centred on screen, 0 = more than `range` chapters away). */
export function presence(chapter: number, index: number, range = 1.1) {
  return Math.max(0, 1 - Math.abs(chapter - index) / range);
}
