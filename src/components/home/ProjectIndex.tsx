"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ViewTransition, type MouseEvent } from "react";
import type { HomeProject } from "@/lib/portfolio";
import { useSceneStore } from "@/store/sceneStore";

const APPROACH_MS = 320;

export function ProjectIndex({ projects }: { projects: HomeProject[] }) {
  const router = useRouter();
  const sceneReady = useSceneStore((state) => state.sceneReady);
  const hovered = useSceneStore((state) => state.hoveredProject);
  const setHovered = useSceneStore((state) => state.setHoveredProject);
  const setApproaching = useSceneStore((state) => state.setApproaching);
  const [flagship, ...rest] = projects;

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
        {flagship.screenshots.length > 0 ? (
          <figure className="flagship-screens">
            <div>
              {flagship.screenshots.slice(0, 3).map((shot) => (
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

      <ol className="project-list">
        {rest.map((project, index) => (
          <li key={project.slug} data-active={hovered === project.slug || undefined} {...bind(project.slug)}>
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
    </div>
  );
}
