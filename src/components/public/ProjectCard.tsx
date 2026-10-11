import Image from "next/image";
import Link from "next/link";
import type { HomeProject } from "@/lib/portfolio";

/** Picks the most honest visual: a real web capture, then a phone capture, then cover art. */
function visualFor(project: HomeProject) {
  const browser = project.screenshots.find((shot) => shot.frame === "browser");
  if (browser) return { ...browser, kind: "browser" as const };
  const phone = project.screenshots.find((shot) => shot.frame !== "browser");
  if (phone) return { ...phone, kind: "phone" as const };
  if (project.cover && !project.cover.endsWith(".svg"))
    return { src: project.cover, alt: "", width: 1536, height: 1024, kind: "cover" as const };
  return null;
}

export function ProjectCard({ project, description = true }: { project: HomeProject; description?: boolean }) {
  const visual = visualFor(project);
  return (
    <Link className="project-card" href={`/projects/${project.slug}`}>
      <span className={`project-card-visual project-card-${visual?.kind ?? "none"}`}>
        {visual ? (
          <Image
            src={visual.src}
            alt={visual.alt}
            width={visual.width}
            height={visual.height}
            sizes="(max-width: 700px) 92vw, 380px"
          />
        ) : (
          <span className="project-card-monogram" aria-hidden="true">
            {project.name.slice(0, 1)}
          </span>
        )}
      </span>
      <span className="project-card-body">
        <span className="project-card-meta">
          {project.context}
          {project.period !== project.context ? ` · ${project.period}` : ""}
        </span>
        <strong>{project.name}</strong>
        <span className="project-card-tagline">{project.tagline}</span>
        {description ? <span className="project-card-summary">{project.summary}</span> : null}
        <span className="project-card-tech">
          {project.tech.slice(0, 4).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </span>
      </span>
    </Link>
  );
}
