import { content } from "@/lib/content";
import { officialProfiles, PERSON_HEADLINE, PERSON_NAME } from "@/lib/identity";

export function DesktopGate() {
  return (
    <div
      className="desktop-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="desktop-gate-title"
      aria-describedby="desktop-gate-copy"
    >
      <div className="desktop-gate-photo" />
      <div className="desktop-gate-shade" />
      <div className="desktop-gate-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.about.avatar}
          alt={PERSON_NAME}
          width={88}
          height={88}
          className="desktop-gate-avatar"
        />
        <p className="desktop-gate-kicker">Desktop only</p>
        <h1 id="desktop-gate-title">{PERSON_NAME}</h1>
        <p className="desktop-gate-role">{PERSON_HEADLINE}</p>
        <p id="desktop-gate-copy" className="desktop-gate-copy">
          This portfolio is a macOS desktop. Open it on a computer, or turn on{" "}
          <strong>Desktop site</strong> / <strong>Request Desktop Website</strong> in your phone
          browser to see the same desktop.
        </p>
        <ul className="desktop-gate-links">
          {officialProfiles.slice(0, 4).map((profile) => (
            <li key={profile.label}>
              <a href={profile.href} rel="me noopener noreferrer" target="_blank">
                {profile.label}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${content.about.email}`}>{content.about.email}</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
