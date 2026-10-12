"use client";

import { useEffect } from "react";
import { activeSystemLayer } from "@/components/universe/systemLayer";
import { scrollState } from "@/store/sceneStore";

/**
 * Puts the homepage content into the same 3D space as the scene behind it.
 *
 * - Depth: blocks fold up out of depth as they enter the viewport and recede as they leave,
 *   and sit perfectly flat while they cross the middle band (so text is always readable).
 * - Hero: layered depth that tilts with the cursor (the same input that drives the camera
 *   parallax) and recedes as the camera flies forward.
 * - Sync: the "How I build" list highlights the same layer the 3D stack lights.
 * - Tilt: cards marked [data-tilt] lean toward the cursor with a moving glare.
 *
 * Everything is written as CSS custom properties; the CSS decides how to use them and turns
 * it all off for reduced motion. Renders nothing.
 */

const DEPTH_SELECTOR = [
  ".chapter:not(.chapter-hero) .eyebrow",
  ".chapter:not(.chapter-hero) h2",
  ".chapter:not(.chapter-hero) .lede",
  ".layers > li",
  ".project-stack > li",
  ".timeline > li",
  ".core-groups > fieldset",
  ".core-panel",
  ".ask-prompts",
  ".next-lists > div",
  ".contact-form",
  ".contact-done",
  ".contact-links",
  ".chapter .section-more",
].join(",");

/** Elements rest flat while any part of them is inside this band of the viewport. */
const BAND_TOP = 0.36;
const BAND_BOTTOM = 0.66;

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

export function ContentMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home");
    const hero = document.querySelector<HTMLElement>(".chapter-hero");
    if (!root) return;
    const home: HTMLElement = root;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let started = false;
    let cleanup = () => {};
    const triggers = [
      "pointermove",
      "scroll",
      "touchstart",
      "keydown",
    ] as const;

    /**
     * Every effect responds to scrolling or the pointer, so nothing starts until the visitor
     * does one of those. (Starting earlier repaints the hero mid-load, which browsers record
     * as a late Largest Contentful Paint.)
     */
    const start = () => {
      if (started) return;
      started = true;
      for (const type of triggers) window.removeEventListener(type, start);
      cleanup = setup();
    };
    for (const type of triggers)
      window.addEventListener(type, start, { passive: true });

    function setup() {
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      let frame = 0;
      let lastLayer = -1;

      const tick = () => {
        frame = 0;
        const vh = window.innerHeight;

        // Depth fold for every content block near the viewport.
        for (const el of document.querySelectorAll<HTMLElement>(
          DEPTH_SELECTOR,
        )) {
          if (!el.hasAttribute("data-depth")) el.setAttribute("data-depth", "");
          const rect = el.getBoundingClientRect();
          if (rect.bottom < -vh * 0.5 || rect.top > vh * 1.5) continue;
          let s = 0;
          let k = 0;
          if (rect.top > vh * BAND_BOTTOM) {
            s = 1; // entering from below
            k = smooth(
              (rect.top - vh * BAND_BOTTOM) / (vh * (1 - BAND_BOTTOM)),
            );
          } else if (rect.bottom < vh * BAND_TOP) {
            s = -1; // leaving through the top
            k = smooth((vh * BAND_TOP - rect.bottom) / (vh * BAND_TOP));
          }
          el.style.setProperty("--s", String(s));
          el.style.setProperty("--k", k.toFixed(3));
        }

        // Hero recedes as you scroll away, in step with the camera moving forward.
        if (hero) {
          const leave = smooth(window.scrollY / (vh * 0.85));
          hero.style.setProperty("--leave", leave.toFixed(3));
        }

        // Pointer parallax, eased toward the target.
        pointer.x += (pointer.tx - pointer.x) * 0.12;
        pointer.y += (pointer.ty - pointer.y) * 0.12;
        home.style.setProperty("--mx", pointer.x.toFixed(4));
        home.style.setProperty("--my", pointer.y.toFixed(4));

        // Light the same layer the 3D stack is lighting.
        const layer = activeSystemLayer(scrollState.chapter);
        if (layer !== lastLayer) {
          lastLayer = layer;
          document
            .querySelectorAll<HTMLElement>(".layers > li")
            .forEach((li, i) => {
              if (i === layer) li.setAttribute("data-lit", "");
              else li.removeAttribute("data-lit");
            });
        }

        if (
          Math.abs(pointer.tx - pointer.x) > 0.001 ||
          Math.abs(pointer.ty - pointer.y) > 0.001
        )
          schedule();
      };

      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(tick);
      };

      const onPointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
        schedule();
      };

      // Card tilt + glare under the cursor.
      const onTilt = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const card = (event.target as Element | null)?.closest<HTMLElement>(
          "[data-tilt]",
        );
        document
          .querySelectorAll<HTMLElement>("[data-tilt][data-tilting]")
          .forEach((other) => {
            if (other !== card) {
              other.removeAttribute("data-tilting");
              other.style.setProperty("--rx", "0");
              other.style.setProperty("--ry", "0");
            }
          });
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        card.setAttribute("data-tilting", "");
        card.style.setProperty("--ry", ((px - 0.5) * 6).toFixed(2));
        card.style.setProperty("--rx", ((0.5 - py) * 5).toFixed(2));
        card.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      };

      tick();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      if (finePointer) {
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("pointermove", onTilt, { passive: true });
      }
      // Accordion / contact state changes swap elements in and out.
      const observer = new MutationObserver(schedule);
      observer.observe(home, { childList: true, subtree: true });
      home.setAttribute("data-motion", "");
      home.setAttribute("data-hero-3d", "");

      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("pointermove", onTilt);
        observer.disconnect();
        home.removeAttribute("data-motion");
        home.removeAttribute("data-hero-3d");
      };
    }

    return () => {
      for (const type of triggers) window.removeEventListener(type, start);
      cleanup();
    };
  }, []);

  return null;
}
