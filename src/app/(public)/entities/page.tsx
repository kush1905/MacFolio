import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { entityDataset, entityRelations } from "@/lib/agriGraph";
import { PERSON_NAME } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { articleGraph, absolute } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata = publicMeta({
  title: "Entity graph — Kush Gangwal, Potato Bazaar, SK Agri Exports",
  description:
    "Explicit relationships: Kush Gangwal is founding engineer of Potato Bazaar, operated by SK Agri Exports Private Limited, while employed at SK Groups.",
  path: "/entities",
  absoluteTitle: true,
});

export default function EntitiesPage() {
  const graph = articleGraph({
    headline: "Kush Gangwal entity graph",
    description:
      "Explicit relationships: Kush Gangwal is founding engineer of Potato Bazaar, operated by SK Agri Exports Private Limited, while employed at SK Groups.",
    path: "/entities",
  }) as { "@context": string; "@graph": object[] };
  graph["@graph"].push(
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/projects/potato-bazaar#app`,
      name: "Potato Bazaar",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Android, iOS, Web",
      url: "https://potatobazaar.com",
      installUrl: "https://play.google.com/store/apps/details?id=com.potatobazaar",
      creator: { "@id": `${SITE_URL}/about-kush-gangwal#person` },
      author: { "@id": `${SITE_URL}/about-kush-gangwal#person` },
      publisher: { "@id": `${SITE_URL}/work/sk-agri-exports-private-ltd#org` },
      featureList: entityDataset.potatoBazaar.features,
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/work/sk-agri-exports-private-ltd#org`,
      name: "SK Agri Exports Private Limited",
      url: absolute("/companies/sk-agri-exports-private-limited"),
      sameAs: ["http://skagriexports.com/", "https://potatobazaar.com", "https://potatobazaar.com/about"],
      email: "Support@potatobazaar.com",
      telephone: "+91-75670-81000",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ahmedabad",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      founder: {
        "@type": "Person",
        name: "Sandeep Kumar",
        jobTitle: "Founder & CEO",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/companies/mantra-agri-solutions#org`,
      name: "Mantra Agri Solutions",
      url: absolute("/companies/mantra-agri-solutions"),
      sameAs: ["https://mantraagri.com/"],
      description:
        "Potato procurement venture in the SK Group and Haldiram ecosystem. Not Kush Gangwal's employer.",
    },
  );

  return (
    <>
      <JsonLd data={graph} />
      <PublicArticle
        kicker="Knowledge graph"
        title="How these entities connect"
        subtitle="Kush Gangwal, Potato Bazaar, SK Agri Exports, SK Groups, and the potato industry, stated as relationships."
      >
        <section>
          <h2>Relationships</h2>
          <ul className="entity-relations">
            {entityRelations.map((item) => (
              <li key={`${item.from}-${item.relation}-${item.to}`}>
                <span>{item.from}</span>
                <em>{item.relation}</em>
                <Link href={item.href}>{item.to}</Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Read this as a sentence</h2>
          <p>
            {PERSON_NAME} is a Full Stack Developer & React Native Developer. He is founding engineer
            of Potato Bazaar while employed at SK Groups in Indore. Potato Bazaar's about page says
            SK Agri Exports founded the marketplace in 2024 and names Sandeep Kumar as Founder & CEO.
            The product lists a marketplace, cold storage booking, mandi prices, and an AI Crop Doctor.
            The published office is Ahmedabad. Kush Gangwal works in Indore.
          </p>
          <p>
            Machine-readable copy: <Link href="/data/entities.json">/data/entities.json</Link> and{" "}
            <Link href="/knowledge-base">/knowledge-base</Link>.
          </p>
        </section>
      </PublicArticle>
    </>
  );
}
