"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { HomeProject, TechNode } from "@/lib/portfolio";
import { scrollState, useSceneStore } from "@/store/sceneStore";
import { StaticSignal } from "./StaticSignal";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

type Mode = "pending" | "live" | "static";

const MOBILE_QUERY = "(max-width: 760px)";
const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;
function subscribeMobile(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** WebGL only where it will run well and the visitor hasn't asked for less motion. */
function canRun3D() {
  if (new URLSearchParams(window.location.search).has("static")) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) < 2 || (nav.hardwareConcurrency ?? 8) < 3) return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    // Release the probe so it doesn't count against the browser's context limit.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Maps scroll position to a continuous chapter index: 2.0 means the "work" section is
 * centred in the viewport, 2.5 means halfway to the next one.
 */
function useScrollChapters() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (sections.length === 0) return;
    let tops: number[] = [];
    let heights: number[] = [];
    let frame = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    const measure = () => {
      tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
      heights = sections.map((s) => s.offsetHeight || 1);
    };
    const update = () => {
      frame = 0;
      const scroll = window.scrollY;
      const now = performance.now();
      scrollState.velocity = ((scroll - lastY) / Math.max(now - lastT, 1)) * 1000;
      lastY = scroll;
      lastT = now;
      const centre = scroll + window.innerHeight / 2;
      let index = sections.length - 1;
      for (let i = 0; i < sections.length; i++) {
        if (centre < tops[i] + heights[i]) {
          index = i;
          break;
        }
      }
      const fraction = (centre - tops[index]) / heights[index];
      scrollState.chapter = Math.min(Math.max(index + fraction - 0.5, 0), sections.length - 1);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    measure();
    update();
    // Section heights change with fonts, viewport and the contact form's states.
    const resize = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    sections.forEach((section) => resize.observe(section));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}

export function UniverseStage({
  projects,
  techNodes,
  steps,
}: {
  projects: HomeProject[];
  techNodes: TechNode[];
  steps: number;
}) {
  const router = useRouter();
  const setApproaching = useSceneStore((state) => state.setApproaching);
  const [mode, setMode] = useState<Mode>("pending");
  const [fallback, setFallback] = useState<string | null>(null);
  const mobile = useSyncExternalStore(subscribeMobile, isMobile, () => false);

  useScrollChapters();

  useEffect(() => {
    // WebGL is an enhancement: start it on the first interaction, or once the page has
    // been loaded and idle for a moment, so it never competes with first paint or input.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      cleanup();
      setMode(canRun3D() ? "live" : "static");
    };
    const events = ["pointerdown", "pointermove", "wheel", "touchstart", "keydown", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    let timer: number | undefined;
    // Capable desktops (fine pointer, plenty of cores) start almost immediately after load;
    // phones and low-power machines wait so WebGL never competes with first interaction.
    const strong =
      window.matchMedia("(pointer: fine)").matches && (navigator.hardwareConcurrency ?? 0) >= 6;
    const arm = () => {
      timer = window.setTimeout(
        () => {
          if (window.requestIdleCallback) window.requestIdleCallback(start, { timeout: 1500 });
          else start();
        },
        strong ? 150 : 2500,
      );
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    function cleanup() {
      events.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener("load", arm);
      window.clearTimeout(timer);
    }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => motion.matches && setMode("static");
    motion.addEventListener("change", onMotion);
    return () => {
      cleanup();
      motion.removeEventListener("change", onMotion);
    };
  }, []);

  const onFail = useCallback((reason: string) => {
    setFallback(reason);
    setMode("static");
  }, []);
  const onOpen = useCallback(
    (slug: string) => {
      setApproaching(slug);
      window.setTimeout(() => {
        router.push(`/projects/${slug}`);
        setApproaching(null);
      }, 320);
    },
    [router, setApproaching],
  );

  return (
    <div className="universe" aria-hidden="true" data-mode={mode} data-fallback={fallback ?? undefined}>
      <div className="universe-static">
        <StaticSignal />
      </div>
      {mode === "live" ? (
        <Scene
          projects={projects}
          techNodes={techNodes}
          steps={steps}
          mobile={mobile}
          onFail={onFail}
          onOpen={onOpen}
        />
      ) : null}
    </div>
  );
}
