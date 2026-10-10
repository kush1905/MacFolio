import Link from "next/link";
import { AskButton } from "@/components/command/AskButton";
import { officialProfiles, PERSON_HEADLINE, PERSON_NAME } from "@/lib/identity";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about-kush-gangwal", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
  { href: "/now", label: "Now" },
  { href: "/faq", label: "FAQ" },
  { href: "/accounts", label: "Profiles" },
  { href: "/topics", label: "Topics" },
  { href: "/stack", label: "Stack" },
  { href: "/desktop", label: "Desktop" },
];

export function PublicHeader() {
  return (
    <header className="public-header">
      <Link className="public-brand" href="/">
        <img
          className="public-logo"
          src="/assets/kush/logo-icon.png"
          alt=""
          width={40}
          height={40}
        />
        <span className="public-brand-text">
          <strong>{PERSON_NAME}</strong>
          <span>{PERSON_HEADLINE}</span>
        </span>
      </Link>
      <nav aria-label="Primary">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <AskButton />
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
        <p>Grew up in Bakaner, Madhya Pradesh · Graduated in Indore · Works in Ahmedabad</p>
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
          <Link href="/agritech">Agritech</Link>
        </li>
        <li>
          <Link href="/entities">How it connects</Link>
        </li>
        <li>
          <Link href="/site-map">Site map</Link>
        </li>
      </ul>
    </footer>
  );
}
