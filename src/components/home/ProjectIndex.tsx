"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ViewTransition, useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import type { HomeProject } from "@/lib/portfolio";
import { projectVisual } from "@/lib/projectVisual";
import { useSceneStore } from "@/store/sceneStore";

const APPROACH_MS = 320;
const OPEN_DELAY = 70;
const CLOSE_DELAY = 180;

/** Previews need a hover-capable pointer and room beside the list. */
const PREVIEW_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 1180px)";
function subscribePreview(onChange: () => void) {
  const query = window.matchMedia(PREVIEW_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Floating preview for a project row. Mouse-only enhancement: everything in it is also on
 * the case study, so it's hidden from assistive tech and its links skip the tab order.
 */
function ProjectPreview({
  project,
  top,
  onEnter,
  onLeave,
}: {
  project: HomeProject;
  top: number;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const visual = projectVisual(project);
  const phones = project.screenshots.filter((shot) => shot.frame !== "browser").slice(0, 2);
  const external = project.links.slice(0, 2);
  return (
    <div
      className="project-preview"
      style={{ top }}
      aria-hidden="true"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={`project-preview-visual project-preview-${visual?.kind ?? "none"}`}>
        {visual?.kind === "phone" ? (
          phones.map((shot) => (
            <Image key={shot.src} src={shot.src} alt="" width={shot.width} height={shot.height} sizes="130px" />
          ))
        ) : visual ? (
          <>
            <Image src={visual.src} alt="" width={visual.width} height={visual.height} sizes="440px" />
            {visual.kind === "cover" ? <span className="project-preview-badge">Illustration</span> : null}
          </>
        ) : (
          <span className="project-preview-monogram">{project.name.slice(0, 1)}</span>
        )}
      </div>
      <div className="project-preview-body">
        <p className="project-preview-meta">
          {project.context}
          {project.period !== project.context ? ` · ${project.period}` : ""}
        </p>
        <p className="project-preview-name">{project.name}</p>
        <p className="project-preview-tagline">{project.tagline}</p>
        <p className="project-preview-summary">{project.summary}</p>
        <dl>
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>
        <p className="project-preview-tech">
          {project.tech.slice(0, 5).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </p>
        <p className="project-preview-links">
          <Link className="btn btn-primary btn-small" href={`/projects/${project.slug}`} tabIndex={-1}>
            Case study →
          </Link>
          {external.map((link) => (
            <a
              key={link.href}
              className="btn btn-small"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
            >
              {link.label} ↗
            </a>
          ))}
        </p>
      </div>
    </div>
  );
}

export function ProjectIndex({ projects }: { projects: HomeProject[] }) {
  const router = useRouter();
  const sceneReady = useSceneStore((state) => state.sceneReady);
  const hovered = useSceneStore((state) => state.hoveredProject);
  const setHovered = useSceneStore((state) => state.setHoveredProject);
  const setApproaching = useSceneStore((state) => state.setApproaching);
  const [flagship, ...rest] = projects;
  const canPreview = useSyncExternalStore(subscribePreview, () => window.matchMedia(PREVIEW_QUERY).matches, () => false);
  const [preview, setPreview] = useState<{ slug: string; top: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /** Opens the preview beside a row, keeping it inside the viewport. */
  function openPreview(slug: string, row: HTMLElement) {
    if (!canPreview) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const list = listRef.current;
      if (!list) return;
      const cardHeight = 520;
      const rowCentre = row.offsetTop + row.offsetHeight / 2;
      const listTop = list.getBoundingClientRect().top;
      // Keep the card within the visible viewport (below the fixed header).
      const minTop = 84 - listTop;
      const maxTop = window.innerHeight - 24 - cardHeight - listTop;
      const top = Math.max(minTop, Math.min(rowCentre - cardHeight / 2, maxTop));
      setPreview({ slug, top });
    }, OPEN_DELAY);
  }

  function closePreview() {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPreview(null), CLOSE_DELAY);
  }

  function keepPreview() {
    window.clearTimeout(timer.current);
  }

  const previewProject = preview ? rest.find((project) => project.slug === preview.slug) : undefined;

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

  const bind = (slug: string) => ({
    onMouseEnter: () => setHovered(slug),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(slug),
    onBlur: () => setHovered(null),
  });

  return (
    <div className="projects">
      <article className="flagship" data-active={hovered === flagship.slug || undefined} {...bind(flagship.slug)}>
        <p className="flagship-label">Flagship · {flagship.context}</p>
        <h3>
          <Link href={`/projects/${flagship.slug}`} onClick={(e) => approach(e, flagship.slug)}>
            <ViewTransition name={`project-${flagship.slug}`}>
              <span>{flagship.name}</span>
            </ViewTransition>
          </Link>
        </h3>
        <p className="flagship-tagline">{flagship.tagline}</p>
        {flagship.screenshots.some((shot) => shot.frame !== "browser") ? (
          <figure className="flagship-screens">
            <div>
              {flagship.screenshots
                .filter((shot) => shot.frame !== "browser")
                .slice(0, 3)
                .map((shot) => (
                  <Image
                    key={shot.src}
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="120px"
                  />
                ))}
            </div>
            <figcaption>From the Android app</figcaption>
          </figure>
        ) : null}
        <p>{flagship.summary}</p>
        <dl className="flagship-facts">
          <div>
            <dt>Role</dt>
            <dd>{flagship.role}</dd>
          </div>
          <div>
            <dt>Period</dt>
            <dd>{flagship.period}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{flagship.tech.join(", ")}</dd>
          </div>
        </dl>
        <p className="flagship-links">
          <Link
            className="btn btn-primary btn-small"
            href={`/projects/${flagship.slug}`}
            onClick={(e) => approach(e, flagship.slug)}
          >
            Read the case study
          </Link>
          {flagship.links
            .filter((link) => !link.href.includes("github.com"))
            .map((link) => (
              <a key={link.href} className="btn btn-small" href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label} ↗
              </a>
            ))}
        </p>
      </article>

      <div className="project-list-wrap">
      <ol className="project-list" ref={listRef}>
        {rest.map((project, index) => (
          <li
            key={project.slug}
            data-active={hovered === project.slug || undefined}
            onMouseEnter={(e) => {
              setHovered(project.slug);
              openPreview(project.slug, e.currentTarget);
            }}
            onMouseLeave={() => {
              setHovered(null);
              closePreview();
            }}
            onFocus={(e) => {
              setHovered(project.slug);
              openPreview(project.slug, e.currentTarget);
            }}
            onBlur={() => {
              setHovered(null);
              closePreview();
            }}
          >
            <Link href={`/projects/${project.slug}`} onClick={(e) => approach(e, project.slug)}>
              <span className="project-index">{String(index + 2).padStart(2, "0")}</span>
              <span className="project-main">
                <ViewTransition name={`project-${project.slug}`}>
                  <strong>{project.name}</strong>
                </ViewTransition>
                <span className="project-tagline">{project.tagline}</span>
              </span>
              <span className="project-meta">
                {project.context}
                {project.period !== project.context ? <span>{project.period}</span> : null}
              </span>
              <span className="project-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
      {previewProject && preview ? (
        <ProjectPreview
          key={previewProject.slug}
          project={previewProject}
          top={preview.top}
          onEnter={() => {
            keepPreview();
            setHovered(previewProject.slug);
          }}
          onLeave={() => {
            setHovered(null);
            closePreview();
          }}
        />
      ) : null}
      </div>
    </div>
  );
}
