import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProfileLinks } from "@/components/public/ProfileLinks";
import { GitHubLinks } from "@/components/site/GitHubLinks";
import { ProjectCard } from "@/components/public/ProjectCard";
import { PublicArticle } from "@/components/public/PublicArticle";
import { homeProjects } from "@/lib/portfolio";
import { WhoIs } from "@/components/public/WhoIs";
import { content } from "@/lib/content";
import { PERSON_HEADLINE, PERSON_NAME, PERSON_TITLE_TAG } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { aboutDescription, aboutGraph, companies } from "@/lib/seo";

export const metadata = publicMeta({
  title: PERSON_TITLE_TAG,
  description: aboutDescription,
  path: "/about-kush-gangwal",
  absoluteTitle: true,
  type: "profile",
  image: "/assets/kush/avatar.png",
});

export default function AboutKushGangwalPage() {
  return (
    <>
      <JsonLd data={aboutGraph()} />
      <PublicArticle
        kicker={PERSON_HEADLINE}
        title={PERSON_NAME}
        subtitle={aboutDescription}
        portrait={{ src: content.about.avatar, alt: `${PERSON_NAME}, ${PERSON_HEADLINE}` }}
        actions={
          <>
            <Link className="btn btn-primary" href="/#contact">
              Get in touch
            </Link>
            <a className="btn" href="/resume.pdf">
              Resume (PDF)
            </a>
            <Link className="btn" href="/projects">
              See projects
            </Link>
          </>
        }
      >
        <ul className="pa-chips" aria-label="At a glance">
          <li>{content.now.workingAs} · SK Groups</li>
          <li>Based in {content.about.location}</li>
          <li>From Bakaner, Madhya Pradesh</li>
          <li>B.Tech CST · Medicaps University</li>
        </ul>

        <WhoIs />

        <section>
          <h2>Work</h2>
          <p>
            Kush Gangwal is a Junior Software Developer at SK Groups in Ahmedabad, where he
            develops Potato Bazaar&apos;s mobile app, backend, and web platform. He previously
            interned at Protonshub Technologies, where he contributed to Tybee Go and Findanio, and
            at Django Softwares.
          </p>
          <ol className="pa-timeline">
            {companies.map((company) => (
              <li key={company.slug}>
                <span className="pa-timeline-meta">
                  {[company.role, company.duration].filter(Boolean).join(" · ")}
                </span>
                <Link href={`/work/${company.slug}`}>{company.name}</Link>
                <p>{company.summary}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2>Projects</h2>
          <p>
            Each project has its own case study covering the problem, what Kush Gangwal worked
            on, and the stack.
          </p>
          <div className="project-grid">
            {homeProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} description={false} />
            ))}
          </div>
        </section>

        <section>
          <h2>Education</h2>
          <p>
            Kush Gangwal graduated with {content.about.education.degree} from{" "}
            <Link href="/education/medicaps-university">Medicaps University</Link> in Indore
            ({content.about.education.duration}, CGPA {content.about.education.cgpa}). He grew up in
            Bakaner, Dhar district, Madhya Pradesh, and works in Ahmedabad.
          </p>
        </section>

        <section>
          <h2>Official profiles</h2>
          <p>
            Code lives mainly on <a href="https://github.com/kush1905">github.com/kush1905</a>:
            Nexus, Macfolio, and this site. Potato Bazaar work is on a second account,{" "}
            <a href="https://github.com/Kush-PB">Kush-PB</a>.
          </p>
          <GitHubLinks />
          <p>Other profiles:</p>
          <ProfileLinks extras hideGitHub />
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Email{" "}
            <a href={`mailto:${content.about.email}`}>{content.about.email}</a>
            {content.about.emailAlt ? (
              <>
                {" "}
                or <a href={`mailto:${content.about.emailAlt}`}>{content.about.emailAlt}</a>
              </>
            ) : null}
            . Also see <Link href="/now">/now</Link>, <Link href="/faq">FAQ</Link>, and the{" "}
            <Link href="/desktop">interactive portfolio desktop</Link>.
          </p>
        </section>
      </PublicArticle>
    </>
  );
}
