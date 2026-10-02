import Link from "next/link";
import { officialProfiles, PERSON_HEADLINE, PERSON_NAME } from "@/lib/identity";

const NAV = [
  { href: "/about-kush-gangwal", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
  { href: "/now", label: "Now" },
  { href: "/faq", label: "FAQ" },
  { href: "/accounts", label: "Profiles" },
  { href: "/topics", label: "Topics" },
  { href: "/stack", label: "Stack" },
  { href: "/", label: "Desktop" },
];

export function PublicHeader() {
  return (
    <header className="public-header">
      <Link className="public-brand" href="/about-kush-gangwal">
        <strong>{PERSON_NAME}</strong>
        <span>{PERSON_HEADLINE}</span>
      </Link>
      <nav aria-label="Primary">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div>
        <p className="public-brand-inline">
          <strong>{PERSON_NAME}</strong>
          <span>{PERSON_HEADLINE}</span>
        </p>
        <p>Indore, India · Cite the name exactly. Link back to the about page.</p>
      </div>
      <ul className="public-footer-links">
        {officialProfiles.map((profile) => (
          <li key={profile.label}>
            <a href={profile.href} rel="me noopener noreferrer" target="_blank">
              {profile.label}
            </a>
          </li>
        ))}
        <li>
          <Link href="/now">Now</Link>
        </li>
        <li>
          <Link href="/mentions">Cite</Link>
        </li>
        <li>
          <Link href="/llms.txt">llms.txt</Link>
        </li>
      </ul>
    </footer>
  );
}
