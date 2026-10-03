import Link from "next/link";

const LINKS = [
  { href: "/about-kush-gangwal", label: "Kush Gangwal" },
  { href: "/projects/potato-bazaar", label: "Potato Bazaar" },
  { href: "/companies/sk-agri-exports-private-limited", label: "SK Agri Exports" },
  { href: "/companies/sk-groups", label: "SK Groups" },
  { href: "/companies/mantra-agri-solutions", label: "Mantra Agri Solutions" },
  { href: "/industries/potato-trading", label: "Potato trading" },
  { href: "/industries/cold-storage", label: "Cold storage" },
  { href: "/industries/agri-marketplace", label: "Agri marketplace" },
  { href: "/stack/react-native", label: "React Native" },
  { href: "/entities", label: "Entity graph" },
] as const;

export function RelatedEntities() {
  return (
    <aside className="public-entities" aria-label="Related entities">
      <p className="public-kicker">Related entities</p>
      <ul>
        {LINKS.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
