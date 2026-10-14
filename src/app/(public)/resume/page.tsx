import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { content } from "@/lib/content";
import { PERSON_HEADLINE, PERSON_NAME } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { companies, education, personNode } from "@/lib/seo";
import { allProjects } from "@/lib/portfolio";

/** Shown with screenshot previews: both are this website. */
const SHOWCASE_SLUGS = ["personal-portfolio", "macfolio"];
const SHOWCASE = SHOWCASE_SLUGS.flatMap((slug) => allProjects.filter((project) => project.slug === slug));

export const metadata = publicMeta({
  title: `Resume — ${PERSON_NAME}`,
  description: `HTML resume for ${PERSON_NAME}, ${PERSON_HEADLINE}. Also available as PDF.`,
  path: "/resume",
});

export default function ResumePage() {
  const { about, experience } = content;
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [personNode()] }} />
      <PublicArticle
        kicker="Resume"
        title={PERSON_NAME}
        subtitle={PERSON_HEADLINE}
      >
        <p>
          {about.bio}{" "}
          <a href={about.links.resume} rel="noopener">
            Download PDF
          </a>
          .
        </p>
        <section>
          <h2>Experience</h2>
          {experience.experience.map((job) => (
            <section key={job.company}>
              <h2>
                {job.role} — {job.company}
              </h2>
              <p>
                {job.duration} · {job.type}
              </p>
              <ul>
                {job.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </section>
        <section>
          <h2>Projects</h2>
          <p>Two of these are this website itself.</p>
          <div className="resume-showcase">
            {SHOWCASE.map((project) => (
              <article key={project.slug} className="resume-project">
                <div className="resume-shots">
                  {project.screenshots
                    .filter((shot) => shot.frame === "browser")
                    .slice(0, 3)
                    .map((shot, index) => (
                      <Image
                        key={shot.src}
                        src={shot.src}
                        alt={shot.alt}
                        width={shot.width}
                        height={shot.height}
                        sizes={index === 0 ? "(max-width: 700px) 92vw, 460px" : "(max-width: 700px) 45vw, 225px"}
                        className={index === 0 ? "resume-shot-main" : undefined}
                      />
                    ))}
                </div>
                <h3>
                  <Link href={`/projects/${project.slug}`}>{project.name}</Link>
                </h3>
                <p className="resume-project-meta">
                  {project.tagline} · {project.period}
                </p>
                <p>{project.summary}</p>
                <p className="resume-project-tech">{project.tech.join(" · ")}</p>
                <p className="resume-project-links">
                  {project.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label} ↗
                    </a>
                  ))}
                </p>
              </article>
            ))}
          </div>
          <h3>Other projects</h3>
          <ul>
            {allProjects
              .filter((project) => !SHOWCASE_SLUGS.includes(project.slug))
              .map((project) => (
                <li key={project.slug}>
                  <Link href={`/projects/${project.slug}`}>{project.name}</Link> — {project.tagline}
                </li>
              ))}
          </ul>
        </section>
        <section>
          <h2>Education</h2>
          <p>
            {education.degree}, {education.name}, {education.score}, {education.duration}.
          </p>
        </section>
        <section>
          <h2>Companies on this site</h2>
          <ul>
            {companies.map((company) => (
              <li key={company.slug}>
                <Link href={`/work/${company.slug}`}>{company.name}</Link>
              </li>
            ))}
          </ul>
        </section>
        <WhoIs />
      </PublicArticle>
    </>
  );
}
