import Link from "next/link";
import { ProjectMedia } from "@/components/public/ProjectMedia";
import type { HomeProject } from "@/lib/portfolio";

export function ProjectCard({ project, description = true }: { project: HomeProject; description?: boolean }) {
  return (
    <Link className="project-card" href={`/projects/${project.slug}`}>
      <div className="project-card-visual">
        <ProjectMedia project={project} />
      </div>
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
