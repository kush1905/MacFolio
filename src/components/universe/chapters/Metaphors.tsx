"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, type MutableRefObject } from "react";
import {
  BoxGeometry,
  EdgesGeometry,
  MeshBasicMaterial,
  QuadraticBezierCurve3,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
} from "three";
import type { StationKind } from "@/lib/portfolio";
import { rng } from "../layout";
import {
  glowPointsMaterial,
  interfaceTexture,
  metal,
  pointsGeometry,
  segmentsGeometry,
  signalWire,
  smokedGlass,
  wire,
} from "../materials";

type Levels = { hover: MutableRefObject<number>; fade: MutableRefObject<number> };

/** Materials every metaphor shares; opacities follow hover and chapter presence. */
function useStationMaterials({ hover, fade }: Levels) {
  const mats = useMemo(
    () => ({
      line: wire(0.3),
      hot: signalWire(0.6),
      points: glowPointsMaterial("#d9d3c7", 60),
      hotPoints: glowPointsMaterial("#ffc46b", 90),
      glass: smokedGlass(0.5),
      metal: metal(),
    }),
    [],
  );
  useFrame(() => {
    const h = hover.current;
    const f = fade.current;
    mats.line.opacity = (0.22 + 0.3 * h) * f;
    mats.hot.opacity = (0.3 + 0.7 * h) * f;
    mats.points.uniforms.uOpacity.value = (0.45 + 0.4 * h) * f;
    mats.hotPoints.uniforms.uOpacity.value = (0.5 + 0.5 * h) * f;
    mats.glass.opacity = 0.5 * f;
  });
  useEffect(
    () => () => Object.values(mats).forEach((material) => material.dispose()),
    [mats],
  );
  return mats;
}

function arc(a: Vector3, b: Vector3, lift: number, segments = 24) {
  const mid = a.clone().lerp(b, 0.5).add(new Vector3(0, lift, 0));
  return new QuadraticBezierCurve3(a, mid, b).getPoints(segments);
}

function polylinePairs(points: Vector3[]): [number[], number[]][] {
  return points.slice(1).map((p, i) => [points[i].toArray(), p.toArray()]);
}

function Device({
  variant,
  size,
  scroll,
  image,
  levels,
}: {
  variant: "dashboard" | "phone" | "list";
  size: [number, number];
  scroll?: boolean;
  /** A real screenshot; the schematic interface shows until it loads. */
  image?: string;
  levels: Levels;
}) {
  const parts = useMemo(() => {
    const texture = interfaceTexture(variant);
    if (scroll) {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set(1, 0.6);
    }
    const screen = new MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false });
    const [w, h] = size;
    const body = new BoxGeometry(w + 0.06, h + 0.06, 0.035);
    return { texture, screen, body, edges: new EdgesGeometry(body) };
  }, [variant, size, scroll]);
  const mats = useStationMaterials(levels);
  useEffect(() => {
    if (!image) return;
    let disposed = false;
    new TextureLoader().load(image, (texture) => {
      if (disposed) return texture.dispose();
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = 4;
      parts.screen.map = texture;
      parts.screen.needsUpdate = true;
    });
    return () => {
      disposed = true;
      if (parts.screen.map !== parts.texture) parts.screen.map?.dispose();
    };
  }, [image, parts]);
  useFrame((_, delta) => {
    parts.screen.opacity = 0.85 * levels.fade.current;
    if (scroll) parts.texture.offset.y = (parts.texture.offset.y + delta * 0.05) % 1;
  });
  useEffect(
    () => () => {
      parts.texture.dispose();
      parts.screen.dispose();
      parts.body.dispose();
    },
    [parts],
  );
  return (
    <group>
      <mesh geometry={parts.body} material={mats.metal} position={[0, 0, -0.022]} />
      <lineSegments geometry={parts.edges} material={mats.line} position={[0, 0, -0.022]} />
      <mesh material={parts.screen}>
        <planeGeometry args={size} />
      </mesh>
    </group>
  );
}

/** Potato Bazaar — web and mobile clients over one marketplace, with flows to its services. */
function Marketplace({ levels, image }: { levels: Levels; image?: string }) {
  const mats = useStationMaterials(levels);
  const services = useMemo(
    () =>
      [0.35, 1.25, 2.3, 3.6].map(
        (angle) => new Vector3(Math.cos(angle) * 1.55, -0.45 + Math.sin(angle * 2) * 0.25, Math.sin(angle) * 0.9 - 0.5),
      ),
    [],
  );
  const geo = useMemo(() => {
    const hub = new Vector3(0, -0.45, 0);
    const curves = services.map((s) => arc(hub, s, 0.25, 20));
    return {
      curves,
      lines: segmentsGeometry(curves.flatMap(polylinePairs)),
      nodes: pointsGeometry([...hub.toArray(), ...services.flatMap((s) => s.toArray())], [1.4, 1, 1, 1, 1]),
      flow: pointsGeometry(curves.flatMap(() => [0, 0, 0, 0, 0, 0])),
    };
  }, [services]);
  useFrame((state) => {
    const position = geo.flow.getAttribute("position");
    const t = state.clock.elapsedTime;
    geo.curves.forEach((points, i) => {
      for (let k = 0; k < 2; k++) {
        // Transactions flow out and back.
        const phase = (t * 0.4 + i * 0.27 + k * 0.5) % 1;
        const u = k === 0 ? phase : 1 - phase;
        const p = points[Math.floor(u * (points.length - 1))];
        position.setXYZ(i * 2 + k, p.x, p.y, p.z);
      }
    });
    position.needsUpdate = true;
  });
  return (
    <group>
      <group position={[-0.35, 0.35, 0]} rotation={[0, 0.22, 0]}>
        <Device variant="dashboard" size={[1.6, 1]} levels={levels} />
      </group>
      <group position={[0.78, 0.15, 0.35]} rotation={[0, -0.32, 0]}>
        <Device variant="phone" size={[0.4, 0.8]} image={image} levels={levels} />
      </group>
      <lineSegments geometry={geo.lines} material={mats.hot} />
      <points geometry={geo.nodes} material={mats.points} />
      <points geometry={geo.flow} material={mats.hotPoints} frustumCulled={false} />
    </group>
  );
}

/** Tybee Go — a production mobile client; the list scrolls like paginated content. */
function Mobile({ levels }: { levels: Levels }) {
  return (
    <group rotation={[0, -0.2, 0]}>
      <Device variant="list" size={[0.48, 0.96]} scroll levels={levels} />
    </group>
  );
}

/** Nexus — two communities exchanging skills in both directions. */
function Exchange({ levels }: { levels: Levels }) {
  const mats = useStationMaterials(levels);
  const geo = useMemo(() => {
    const random = rng(41);
    const cluster = (cx: number) =>
      Array.from({ length: 5 }, () => new Vector3(cx + (random() - 0.5) * 0.4, (random() - 0.5) * 0.6, (random() - 0.5) * 0.4));
    const left = cluster(-0.6);
    const right = cluster(0.6);
    const curves = left.map((a, i) => arc(a, right[(i * 2) % 5], 0.35, 18));
    return {
      curves,
      lines: segmentsGeometry(curves.flatMap(polylinePairs)),
      nodes: pointsGeometry([...left, ...right].flatMap((v) => v.toArray())),
      flow: pointsGeometry(curves.flatMap(() => [0, 0, 0])),
    };
  }, []);
  useFrame((state) => {
    const position = geo.flow.getAttribute("position");
    geo.curves.forEach((points, i) => {
      const phase = (state.clock.elapsedTime * 0.45 + i * 0.2) % 1;
      const u = i % 2 ? phase : 1 - phase;
      const p = points[Math.floor(u * (points.length - 1))];
      position.setXYZ(i, p.x, p.y, p.z);
    });
    position.needsUpdate = true;
  });
  return (
    <group>
      <lineSegments geometry={geo.lines} material={mats.line} />
      <points geometry={geo.nodes} material={mats.points} />
      <points geometry={geo.flow} material={mats.hotPoints} frustumCulled={false} />
    </group>
  );
}

/** Resumind — a document separating into structured fields. */
function Document({ levels }: { levels: Levels }) {
  const mats = useStationMaterials(levels);
  const strips = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);
  const sheet = useMemo(() => new EdgesGeometry(new BoxGeometry(0.72, 0.96, 0.01)), []);
  const strip = useMemo(() => new BoxGeometry(0.5, 0.06, 0.012), []);
  const stripEdges = useMemo(() => new EdgesGeometry(strip), [strip]);
  const refs = useMemo(() => strips.map(() => ({ current: null as null | { position: Vector3 } })), [strips]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.forEach((ref, i) => {
      if (!ref.current) return;
      // Each field lifts out of the page, then settles back — parsing on a loop.
      const phase = Math.max(0, Math.sin(t * 0.8 - i * 0.45));
      ref.current.position.set(0.05 + phase * 0.55, 0.36 - i * 0.14, 0.02 + phase * 0.2);
    });
  });
  return (
    <group rotation={[0, -0.25, 0]}>
      <mesh material={mats.glass}>
        <planeGeometry args={[0.72, 0.96]} />
      </mesh>
      <lineSegments geometry={sheet} material={mats.line} />
      {strips.map((i) => (
        <mesh
          key={i}
          ref={(node) => void (refs[i].current = node)}
          geometry={strip}
          material={i % 3 === 0 ? mats.metal : mats.glass}
        >
          <lineSegments geometry={stripEdges} material={i % 3 === 0 ? mats.hot : mats.line} />
        </mesh>
      ))}
    </group>
  );
}

/** CodeMace — a precise data structure with a traversal running through it. */
function Structure({ levels }: { levels: Levels }) {
  const mats = useStationMaterials(levels);
  const geo = useMemo(() => {
    const nodes: Vector3[] = [];
    const pairs: [number[], number[]][] = [];
    const place = (level: number, index: number) =>
      new Vector3((index - (2 ** level - 1) / 2) * (1.4 / 2 ** level), 0.55 - level * 0.36, 0);
    for (let level = 0; level < 4; level++)
      for (let i = 0; i < 2 ** level; i++) {
        const node = place(level, i);
        nodes.push(node);
        if (level > 0) pairs.push([place(level - 1, Math.floor(i / 2)).toArray(), node.toArray()]);
      }
    // Depth-first order over the heap-indexed tree.
    const order: number[] = [];
    const visit = (i: number) => {
      if (i >= nodes.length) return;
      order.push(i);
      visit(i * 2 + 1);
      visit(i * 2 + 2);
    };
    visit(0);
    return {
      nodes,
      order,
      lines: segmentsGeometry(pairs),
      points: pointsGeometry(nodes.flatMap((v) => v.toArray())),
      cursor: pointsGeometry([0, 0, 0], [1.6]),
    };
  }, []);
  useFrame((state) => {
    const step = Math.floor(state.clock.elapsedTime / 0.35) % geo.order.length;
    const node = geo.nodes[geo.order[step]];
    geo.cursor.getAttribute("position").setXYZ(0, node.x, node.y, node.z);
    geo.cursor.getAttribute("position").needsUpdate = true;
  });
  return (
    <group>
      <lineSegments geometry={geo.lines} material={mats.line} />
      <points geometry={geo.points} material={mats.points} />
      <points geometry={geo.cursor} material={mats.hotPoints} frustumCulled={false} />
    </group>
  );
}

/** Findanio — discovery: a sweep across rings that reveals what is nearby. */
function Discovery({ levels }: { levels: Levels }) {
  const mats = useStationMaterials(levels);
  const geo = useMemo(() => {
    const random = rng(5);
    const ring = (r: number) =>
      polylinePairs(
        Array.from({ length: 49 }, (_, i) => {
          const a = (i / 48) * Math.PI * 2;
          return new Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
        }),
      );
    const finds = Array.from({ length: 10 }, () => {
      const a = random() * Math.PI * 2;
      const r = 0.2 + random() * 0.6;
      return { angle: a, position: new Vector3(Math.cos(a) * r, 0.02, Math.sin(a) * r) };
    });
    return {
      rings: segmentsGeometry([...ring(0.3), ...ring(0.55), ...ring(0.82)]),
      sweep: segmentsGeometry([[[0, 0, 0], [0.85, 0, 0]]]),
      finds,
      points: pointsGeometry(
        finds.flatMap((f) => f.position.toArray()),
        finds.map(() => 0.5),
      ),
    };
  }, []);
  const sweepRef = useMemo(() => ({ current: null as null | { rotation: { y: number } } }), []);
  useFrame((state) => {
    const angle = (state.clock.elapsedTime * 0.9) % (Math.PI * 2);
    if (sweepRef.current) sweepRef.current.rotation.y = -angle;
    const scale = geo.points.getAttribute("aScale");
    geo.finds.forEach((find, i) => {
      const behind = (angle - find.angle + Math.PI * 2) % (Math.PI * 2);
      scale.setX(i, 0.4 + 1.2 * Math.exp(-behind * 1.8));
    });
    scale.needsUpdate = true;
  });
  return (
    <group rotation={[0.5, 0, 0]} position={[0, -0.1, 0]}>
      <lineSegments geometry={geo.rings} material={mats.line} />
      <lineSegments ref={(node) => void (sweepRef.current = node)} geometry={geo.sweep} material={mats.hot} />
      <points geometry={geo.points} material={mats.hotPoints} />
    </group>
  );
}

/** Scalelr — investors and project holders, matched one pair at a time. */
function Matching({ levels }: { levels: Levels }) {
  const mats = useStationMaterials(levels);
  const geo = useMemo(() => {
    const left = Array.from({ length: 4 }, (_, i) => new Vector3(-0.55, 0.45 - i * 0.3, 0));
    const right = Array.from({ length: 4 }, (_, i) => new Vector3(0.55, 0.45 - i * 0.3, 0));
    const matches = [2, 0, 3, 1];
    const all: [number[], number[]][] = [];
    left.forEach((a) => right.forEach((b) => all.push([a.toArray(), b.toArray()])));
    return {
      left,
      right,
      matches,
      faint: segmentsGeometry(all),
      active: segmentsGeometry([[left[0].toArray(), right[matches[0]].toArray()]]),
      points: pointsGeometry([...left, ...right].flatMap((v) => v.toArray())),
    };
  }, []);
  useFrame((state) => {
    const i = Math.floor(state.clock.elapsedTime / 0.9) % 4;
    const a = geo.left[i];
    const b = geo.right[geo.matches[i]];
    const position = geo.active.getAttribute("position");
    position.setXYZ(0, a.x, a.y, a.z);
    position.setXYZ(1, b.x, b.y, b.z);
    position.needsUpdate = true;
  });
  return (
    <group>
      <lineSegments geometry={geo.faint} material={mats.line} scale={1} />
      <lineSegments geometry={geo.active} material={mats.hot} frustumCulled={false} />
      <points geometry={geo.points} material={mats.points} />
    </group>
  );
}

/** Macfolio — a window, linking to the macOS-style desktop. */
function Window({ levels }: { levels: Levels }) {
  const mats = useStationMaterials(levels);
  const geo = useMemo(() => {
    const w = 1.1;
    const h = 0.74;
    return {
      frame: segmentsGeometry([
        [[-w / 2, h / 2, 0], [w / 2, h / 2, 0]],
        [[w / 2, h / 2, 0], [w / 2, -h / 2, 0]],
        [[w / 2, -h / 2, 0], [-w / 2, -h / 2, 0]],
        [[-w / 2, -h / 2, 0], [-w / 2, h / 2, 0]],
        [[-w / 2, h / 2 - 0.12, 0], [w / 2, h / 2 - 0.12, 0]],
      ]),
      dots: pointsGeometry([-w / 2 + 0.07, h / 2 - 0.06, 0.01, -w / 2 + 0.14, h / 2 - 0.06, 0.01, -w / 2 + 0.21, h / 2 - 0.06, 0.01], [0.6, 0.6, 0.6]),
      size: [w, h] as [number, number],
    };
  }, []);
  return (
    <group rotation={[0, 0.25, 0]}>
      <mesh material={mats.glass}>
        <planeGeometry args={geo.size} />
      </mesh>
      <lineSegments geometry={geo.frame} material={mats.line} />
      <points geometry={geo.dots} material={mats.hotPoints} />
    </group>
  );
}

export function Metaphor({
  kind,
  levels,
  image,
}: {
  kind: StationKind;
  levels: Levels;
  image?: string;
}) {
  switch (kind) {
    case "marketplace":
      return <Marketplace levels={levels} image={image} />;
    case "mobile":
      return <Mobile levels={levels} />;
    case "exchange":
      return <Exchange levels={levels} />;
    case "document":
      return <Document levels={levels} />;
    case "structure":
      return <Structure levels={levels} />;
    case "discovery":
      return <Discovery levels={levels} />;
    case "matching":
      return <Matching levels={levels} />;
    case "window":
      return <Window levels={levels} />;
  }
}
