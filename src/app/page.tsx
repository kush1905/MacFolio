import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Fraunces } from "next/font/google";
import { ArrowRight, Briefcase, GraduationCap, MapPin } from "lucide-react";
import "./site.css";
import "./home.css";
import { AskPrompts } from "@/components/home/AskPrompts";
import { ContactForm } from "@/components/home/ContactForm";
import { HeroAsk } from "@/components/home/HeroAsk";
import { ProjectIndex } from "@/components/home/ProjectIndex";
import { TechCore } from "@/components/home/TechCore";
import { CommandPalette } from "@/components/command/CommandPalette";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { UniverseStage } from "@/components/universe/UniverseStage";
import { JsonLd } from "@/components/seo/JsonLd";
import { content } from "@/lib/content";
import { officialProfiles, PERSON_NAME } from "@/lib/identity";
import { contact, homeProjects, journey, learning, techGroups, techNodes } from "@/lib/portfolio";
import { homeDescription, homeGraph } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

/** Extra-wide display face for the hero name; loaded only on the homepage. */
/** Display face for the hero name; loaded only on the homepage. */
const nameFont = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-name",
  display: "swap",
  preload: false,
});

const HOME_TITLE = "Kush Gangwal — Full Stack & React Native Developer";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: homeDescription,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: HOME_TITLE,
    description: homeDescription,
    siteName: PERSON_NAME,
    locale: "en_IN",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: `${PERSON_NAME}: I build products that ship.` }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: homeDescription,
    creator: "@kushgg19",
    images: ["/og/home.png"],
  },
};

const LAYERS = [
  {
    name: "Interface",
    body: "React and Next.js on the web. React Native on Android and iOS, through Play Console and Xcode releases.",
  },
  {
    name: "API",
    body: "REST endpoints shared by the web app and the mobile clients, with authentication and pagination.",
  },
  {
    name: "Services",
    body: "Node.js and Express services that hold the product logic behind those clients.",
  },
  { name: "Data", body: "PostgreSQL, MongoDB, or SQLite, chosen for what each product needs." },
  {
    name: "Integrations",
    body: "PostHog and Mixpanel analytics, maps, weather, speech, and AI APIs wired into production apps.",
  },
];

export default function HomePage() {
  const { about, now } = content;
  return (
    <div className={`home pu ${nameFont.variable}`}>
      <JsonLd data={homeGraph()} />
      <a className="pu-skip" href="#main">
        Skip to content
      </a>
      <UniverseStage projects={homeProjects} techNodes={techNodes} steps={journey.length} />
      <SiteHeader />

      <main id="main" className="home-main">
        <section className="chapter chapter-hero" data-chapter="0" aria-labelledby="hero-title">
          <div className="chapter-col hero-col">
            <p className="hero-status rise" style={{ "--rise": 0 } as CSSProperties}>
              <span aria-hidden="true" />
              Open to full-stack and React Native roles
            </p>
            <p className="hero-role rise" style={{ "--rise": 1 } as CSSProperties}>
              Full stack <i aria-hidden="true" /> React Native <i aria-hidden="true" /> AI integrations
            </p>
            <h1 id="hero-title" className="hero-name">
              Kush Gangwal<span className="hero-name-dot" aria-hidden="true">.</span>
            </h1>
            <p className="hero-statement rise" style={{ "--rise": 2 } as CSSProperties}>
              I build products that <em>ship.</em>
            </p>
            <p className="hero-intro">
              Software developer at SK Groups in Ahmedabad. I work across Potato Bazaar&apos;s React
              Native app, backend, and web platform, and build full-stack products of my own.
            </p>
            <ul className="hero-facts rise" style={{ "--rise": 3 } as CSSProperties} aria-label="At a glance">
              <li>
                <Briefcase aria-hidden="true" />
                {now.workingAs}, {now.workingAt}
              </li>
              <li>
                <MapPin aria-hidden="true" />
                Ahmedabad, India
              </li>
              <li>
                <GraduationCap aria-hidden="true" />
                B.Tech CST, Medicaps University
              </li>
            </ul>
            <div className="hero-actions rise" style={{ "--rise": 4 } as CSSProperties}>
              <a className="btn btn-primary btn-hero" href="#work">
                See the work
                <span className="btn-arrow" aria-hidden="true">
                  <ArrowRight />
                </span>
              </a>
              <a className="btn btn-glass" href="#contact">
                Get in touch
              </a>
              <HeroAsk />
            </div>
            <p className="hero-shipping rise" style={{ "--rise": 5 } as CSSProperties}>
              <span>Currently shipping</span>
              <Link href="/projects/potato-bazaar">
                Potato Bazaar <em>web · Android · iOS</em> <b aria-hidden="true">→</b>
              </Link>
            </p>
          </div>
          <a className="scroll-cue" href="#system" aria-label="Scroll to how I build">
            <span aria-hidden="true" />
          </a>
        </section>

        <section id="system" className="chapter" data-chapter="1" aria-labelledby="system-title">
          <div className="chapter-stage" aria-hidden="true" />
          <div className="chapter-col">
            <p className="eyebrow">01 — System</p>
            <h2 id="system-title">How I build</h2>
            <p className="lede">
              Most of my work spans the whole path a request takes, from the screen someone taps to
              the services and data behind it.
            </p>
            <ol className="layers">
              {LAYERS.map((layer, index) => (
                <li key={layer.name}>
                  <span className="layer-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{layer.name}</h3>
                  <p>{layer.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="work" className="chapter chapter-work" data-chapter="2" aria-labelledby="work-title">
          <div className="chapter-stage" aria-hidden="true" />
          <div className="chapter-col chapter-col-wide">
            <p className="eyebrow">02 — Products</p>
            <h2 id="work-title">Selected work</h2>
            <p className="lede">
              Production apps I work on with teams, and products I designed and built myself. Each
              one has a full case study.
            </p>
            <ProjectIndex projects={homeProjects} />
            <p className="section-more">
              <Link href="/projects">All projects and case studies →</Link>
            </p>
          </div>
        </section>

        <section
          id="experience"
          className="chapter"
          data-chapter="3"
          aria-labelledby="experience-title"
        >
          <div className="chapter-stage" aria-hidden="true" />
          <div className="chapter-col">
            <p className="eyebrow">03 — Experience</p>
            <h2 id="experience-title">Where I&apos;ve worked</h2>
            <ol className="timeline">
              {journey.map((step) => (
                <li key={step.id}>
                  <p className="timeline-period">{step.period}</p>
                  <h3>
                    <Link href={step.href}>{step.org}</Link>
                  </h3>
                  <p className="timeline-role">
                    {step.role}
                    {step.place ? <span> · {step.place}</span> : null}
                  </p>
                  {step.points.length > 0 ? (
                    <ul>
                      {step.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
            <p className="section-more">
              <Link href="/about-kush-gangwal">Full profile →</Link>
              <Link href="/resume">Resume →</Link>
            </p>
          </div>
        </section>

        <section id="core" className="chapter" data-chapter="4" aria-labelledby="core-title">
          <div className="chapter-stage" aria-hidden="true" />
          <div className="chapter-col chapter-col-wide">
            <p className="eyebrow">04 — Engineering</p>
            <h2 id="core-title">The stack, with receipts</h2>
            <p className="lede">
              Pick a technology to see the projects it shipped in. No skill bars, just where it was
              used.
            </p>
            <TechCore groups={techGroups} nodes={techNodes} projects={homeProjects} />
          </div>
        </section>

        <section id="ask" className="chapter" data-chapter="5" aria-labelledby="ask-title">
          <div className="chapter-stage" aria-hidden="true" />
          <div className="chapter-col">
            <p className="eyebrow">05 — Intelligence</p>
            <h2 id="ask-title">Ask Kush</h2>
            <p className="lede">
              Ask about projects, experience, or stack. Answers come from what is published on this
              site. If it isn&apos;t here, the assistant says so.
            </p>
            <AskPrompts />
          </div>
        </section>

        <section id="next" className="chapter" data-chapter="6" aria-labelledby="next-title">
          <div className="chapter-stage" aria-hidden="true" />
          <div className="chapter-col">
            <p className="eyebrow">06 — Next</p>
            <h2 id="next-title">What I&apos;m learning</h2>
            <p className="lede">
              Where I&apos;m heading. These are learning tracks, not production experience yet.
            </p>
            <div className="next-lists">
              <div>
                <h3>Learning now</h3>
                <ul>
                  {learning.learning.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Exploring</h3>
                <ul>
                  {learning.exploring.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="section-more">
              <Link href="/now">What I&apos;m doing now · updated {learning.updated} →</Link>
            </p>
          </div>
        </section>

        <section id="contact" className="chapter chapter-contact" data-chapter="7" aria-labelledby="contact-title">
          <div className="chapter-stage" aria-hidden="true" />
          <div className="chapter-col">
            <p className="eyebrow">07 — Contact</p>
            <h2 id="contact-title" className="contact-title">
              Let&apos;s build something.
            </h2>
            <p className="lede">{now.availableFor}</p>
            <ContactForm email={contact.email} />
            <ul className="contact-links">
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              {officialProfiles.map((profile) => (
                <li key={profile.label}>
                  <a href={profile.href} rel="me noopener noreferrer" target="_blank">
                    {profile.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />

      <CommandPalette projects={homeProjects} techNodes={techNodes} />
    </div>
  );
}
