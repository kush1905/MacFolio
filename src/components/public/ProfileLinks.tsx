import { extraProfiles, officialProfiles } from "@/lib/identity";

export function ProfileLinks({ extras = false }: { extras?: boolean }) {
  const profiles = extras ? [...officialProfiles, ...extraProfiles] : officialProfiles;
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
