import { extraProfiles, officialProfiles } from "@/lib/identity";

export function ProfileLinks({ extras = false, hideGitHub = false }: { extras?: boolean; hideGitHub?: boolean }) {
  const profiles = (extras ? [...officialProfiles, ...extraProfiles] : officialProfiles).filter(
    // Pages that show the featured GitHub block pass hideGitHub so it isn't listed twice.
    (profile) => !hideGitHub || profile.label !== "GitHub",
  );
  return (
    <ul className="public-profile-list">
      {profiles.map((profile) => (
        <li key={`${profile.label}-${profile.href}`}>
          <a href={profile.href} rel="me noopener noreferrer" target="_blank">
            <span>{profile.label}</span>
            <em>{profile.handle}</em>
          </a>
        </li>
      ))}
    </ul>
  );
}
