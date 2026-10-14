import Image from "next/image";
import type { Screenshot } from "@/lib/caseStudies";
import type { HomeProject } from "@/lib/portfolio";

/**
 * A project's preview, framed like the thing it is: a browser window for web screenshots,
 * phone bezels for app screenshots, both together when a project has both. Hover motion is
 * pure CSS (see .pm in site.css), driven by the nearest card that contains it.
 */
export function ProjectMedia({ project, priority = false }: { project: HomeProject; priority?: boolean }) {
  const web = project.screenshots.filter((shot) => shot.frame === "browser");
  const phones = project.screenshots.filter((shot) => shot.frame !== "browser");
  const live = project.links.find((link) => !/github\.com/i.test(link.href));
  const address = live ? live.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : project.name.toLowerCase();

  if (web.length > 0 && phones.length > 0) {
    return (
      <div className="pm pm-combo">
        <Browser shot={web[0]} address={address} priority={priority} />
        <Phone shot={phones[0]} className="pm-phone-front" />
      </div>
    );
  }
  if (web.length > 0) {
    return (
      <div className="pm pm-web">
        <Browser shot={web[0]} address={address} priority={priority} />
      </div>
    );
  }
  if (phones.length > 0) {
    const [front, ...rest] = phones;
    return (
      <div className="pm pm-phones">
        {rest[0] ? <Phone shot={rest[0]} className="pm-phone-left" /> : null}
        {rest[1] ? <Phone shot={rest[1]} className="pm-phone-right" /> : null}
        <Phone shot={front} className="pm-phone-center" />
      </div>
    );
  }
  if (project.cover && !project.cover.endsWith(".svg")) {
    return (
      <div className="pm pm-cover">
        <Image src={project.cover} alt="" fill sizes="(max-width: 700px) 92vw, 560px" />
        <span className="pm-badge">Illustration</span>
      </div>
    );
  }
  return (
    <div className="pm pm-empty" aria-hidden="true">
      <span>{project.name.slice(0, 1)}</span>
    </div>
  );
}

function Browser({ shot, address, priority }: { shot: Screenshot; address: string; priority: boolean }) {
  return (
    <div className="pm-browser">
      <div className="pm-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{address}</span>
      </div>
      <div className="pm-screen">
        <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 700px) 80vw, 520px" priority={priority} />
      </div>
    </div>
  );
}

function Phone({ shot, className }: { shot: Screenshot; className: string }) {
  return (
    <div className={`pm-phone ${className}`}>
      <div className="pm-screen">
        <Image src={shot.src} alt={shot.alt} fill sizes="160px" />
      </div>
    </div>
  );
}
