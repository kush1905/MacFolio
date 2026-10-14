import Link from "next/link";
import { content } from "@/lib/content";
import { GitHubLinks } from "@/components/site/GitHubLinks";
import { officialProfiles, PERSON_HEADLINE, PERSON_NAME } from "@/lib/identity";

const EXPLORE = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
  { href: "/about-kush-gangwal", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/stack", label: "Stack" },
  { href: "/faq", label: "FAQ" },
  { href: "/resume", label: "Resume" },
];

// Reference pages (topics, agritech, entities, spellings, …) are reachable from the site map,
// so the footer stays about what visitors actually want.
const MORE = [
  { href: "/desktop", label: "Macfolio desktop" },
  { href: "/projects/personal-portfolio", label: "How this site is built" },
  { href: "/site-map", label: "Site map" },
];

export function SiteFooter() {
  const { email, emailAlt, location } = content.about;
  return (
    <footer className="site-footer">
      <div className="site-footer-cta">
        <div>
          <p className="site-footer-kicker">
            <span aria-hidden="true" /> {content.now.availableFor}
          </p>
          <p className="site-footer-big">Let&apos;s build something.</p>
        </div>
        <div className="site-footer-reach">
          <a className="site-footer-mail" href={`mailto:${email}`}>
            {email} <span aria-hidden="true">↗</span>
          </a>
          {emailAlt ? (
            <a className="site-footer-mail site-footer-mail-alt" href={`mailto:${emailAlt}`}>
              {emailAlt}
            </a>
          ) : null}
          <p>{location}, India · IST (UTC+5:30)</p>
          <GitHubLinks compact />
        </div>
      </div>

      <div className="site-footer-grid">
        <div className="site-footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG mark */}
          <img src="/assets/kush/mark.svg" alt="" width={40} height={40} />
          <p className="site-footer-name">{PERSON_NAME}</p>
          <p>{PERSON_HEADLINE}</p>
          <p>Grew up in Bakaner, Madhya Pradesh · Graduated in Indore · Works in Ahmedabad</p>
        </div>
        <nav aria-label="Explore">
          <p className="site-footer-label">Explore</p>
          <ul>
            {EXPLORE.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Profiles">
          <p className="site-footer-label">Profiles</p>
          <ul>
            {officialProfiles.map((profile) => (
              <li key={profile.label}>
                <a href={profile.href} rel="me noopener noreferrer" target="_blank">
                  {profile.label === "GitHub" ? "GitHub · kush1905" : profile.label}
                </a>
              </li>
            ))}
            <li>
              <a href="https://github.com/Kush-PB" rel="me noopener noreferrer" target="_blank" className="site-footer-minor">
                GitHub · Kush-PB
              </a>
            </li>
          </ul>
        </nav>
        <nav aria-label="More">
          <p className="site-footer-label">More</p>
          <ul>
            {MORE.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="site-footer-base">
        <p>
          © {new Date().getFullYear()} {PERSON_NAME}. Built with Next.js and three.js.
        </p>
        <a href="#top" className="site-footer-top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
