"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ViewTransition, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import type { HomeProject } from "@/lib/portfolio";
import { projectVisual } from "@/lib/projectVisual";
import { useSceneStore } from "@/store/sceneStore";

const APPROACH_MS = 320;
const HOVER_INTENT_MS = 140;

/**
 * Selected work as an accordion: exactly one project is open as a full card (Potato Bazaar
 * by default). Hovering another row (or tapping/pressing it) opens that one and closes the
 * previous card. Every row keeps a direct link to its case study.
 */
export function ProjectIndex({ projects }: { projects: HomeProject[] }) {
  const router = useRouter();
  const sceneReady = useSceneStore((state) => state.sceneReady);
  const hovered = useSceneStore((state) => state.hoveredProject);
  const setHovered = useSceneStore((state) => state.setHoveredProject);
  const setApproaching = useSceneStore((state) => state.setApproaching);

  const [openSlug, setOpenSlug] = useState(projects[0]?.slug);
  const rows = useRef(new Map<string, HTMLLIElement>());
  const intent = useRef<number | undefined>(undefined);
  const anchor = useRef<{ slug: string; top: number } | null>(null);

  /** Open a project, keeping its row exactly where it was on screen. */
  function open(slug: string) {
    window.clearTimeout(intent.current);
    if (slug === openSlug) return;
    const row = rows.current.get(slug);
    anchor.current = row ? { slug, top: row.getBoundingClientRect().top } : null;
    setOpenSlug(slug);
    setHovered(slug);
  }

  // A card collapsing above the hovered row would yank it away from the cursor; compensate.
  useLayoutEffect(() => {
    const pending = anchor.current;
    anchor.current = null;
    const row = pending && rows.current.get(pending.slug);
    if (!pending || !row) return;
    const delta = row.getBoundingClientRect().top - pending.top;
    if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: "instant" });

    // Then reveal the opened card if it runs past the bottom of the screen, without
    // pushing its header under the fixed site header.
    const rect = row.getBoundingClientRect();
    const overflow = rect.bottom - (window.innerHeight - 24);
    const room = rect.top - 84;
    const by = Math.min(overflow, room);
    if (by > 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollBy({ top: by, behavior: reduce ? "instant" : "smooth" });
    }
  }, [openSlug]);

  /** Hover intent: only real pointer movement opens a row, never a layout shift under a still cursor. */
  function onPointerMove(event: PointerEvent<HTMLLIElement>, slug: string) {
    if (event.pointerType !== "mouse" || slug === openSlug) return;
    if (event.movementX === 0 && event.movementY === 0) return;
    window.clearTimeout(intent.current);
    intent.current = window.setTimeout(() => open(slug), HOVER_INTENT_MS);
  }

  /** Let the camera move toward the project's station before the route changes. */
  function approach(event: MouseEvent<HTMLAnchorElement>, slug: string) {
    if (!sceneReady || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setApproaching(slug);
    window.setTimeout(() => {
      router.push(`/projects/${slug}`);
      setApproaching(null);
    }, APPROACH_MS);
  }

  return (
    <ol className="project-stack" onPointerLeave={() => window.clearTimeout(intent.current)}>
      {projects.map((project, index) => {
        const isOpen = project.slug === openSlug;
        const panelId = `project-panel-${project.slug}`;
        return (
          <li
            key={project.slug}
            ref={(node) => {
              if (node) rows.current.set(project.slug, node);
              else rows.current.delete(project.slug);
            }}
            data-open={isOpen || undefined}
            data-tilt={isOpen || undefined}
            data-active={hovered === project.slug || undefined}
            onPointerMove={(event) => onPointerMove(event, project.slug)}
            onPointerEnter={() => setHovered(project.slug)}
            onPointerLeave={() => setHovered(null)}
          >
            <div className="ps-head">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => open(project.slug)}
                  onFocus={() => setHovered(project.slug)}
                >
                  <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="project-main">
                    {index === 0 ? <span className="ps-flag">Flagship</span> : null}
                    <ViewTransition name={`project-${project.slug}`}>
                      <strong>{project.name}</strong>
                    </ViewTransition>
                    <span className="project-tagline">{project.tagline}</span>
                  </span>
                  <span className="project-meta">
                    {project.context}
                    {project.period !== project.context ? <span>{project.period}</span> : null}
                  </span>
                </button>
              </h3>
              <Link
                className="ps-go"
                href={`/projects/${project.slug}`}
                aria-label={`${project.name} case study`}
                onClick={(e) => approach(e, project.slug)}
              >
                →
              </Link>
            </div>

            {isOpen ? <ProjectPanel id={panelId} project={project} onRead={(e) => approach(e, project.slug)} /> : null}
          </li>
        );
      })}
    </ol>
  );
}

function ProjectPanel({
  id,
  project,
  onRead,
}: {
  id: string;
  project: HomeProject;
  onRead: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const phones = project.screenshots.filter((shot) => shot.frame !== "browser").slice(0, 3);
  const visual = phones.length >= 2 ? null : projectVisual(project);
  const phoneCaption = phones.some((shot) => /\bon iOS\b/.test(shot.alt))
    ? "From the iOS and Android apps"
    : "From the Android app";

  return (
    <div className="ps-panel" id={id}>
      {phones.length >= 2 ? (
        <figure className="ps-phones">
          <div>
            {phones.map((shot) => (
              <Image key={shot.src} src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="120px" />
            ))}
          </div>
          <figcaption>{phoneCaption}</figcaption>
        </figure>
      ) : visual ? (
        <figure className={`ps-visual ps-visual-${visual.kind}`}>
          <Image src={visual.src} alt={visual.alt} width={visual.width} height={visual.height} sizes="(max-width: 700px) 92vw, 600px" />
          {visual.kind === "cover" ? <figcaption>Illustration</figcaption> : null}
        </figure>
      ) : null}
      <p className="ps-summary">{project.summary}</p>
      <dl className="ps-facts">
        <div>
          <dt>Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>{project.period}</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>{project.tech.join(", ")}</dd>
        </div>
      </dl>
      <p className="ps-links">
        <Link className="btn btn-primary btn-small" href={`/projects/${project.slug}`} onClick={onRead}>
          Read the case study
        </Link>
        {project.links
          .filter((link) => link.label !== "GitHub" || project.links.length === 1)
          .map((link) => (
            <a key={link.href} className="btn btn-small" href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label} ↗
            </a>
          ))}
      </p>
    </div>
  );
}
