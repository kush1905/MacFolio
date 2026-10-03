import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProseSection, PublicArticle } from "@/components/public/PublicArticle";
import type { AgriDoc } from "@/lib/agriGraph";
import { PERSON_NAME } from "@/lib/identity";
import { articleGraph } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export function AgriDocument({
  page,
  orgId,
}: {
  page: AgriDoc;
  orgId?: string;
}) {
  const graph = articleGraph({
    headline: page.title,
    description: page.description,
    path: page.path,
  }) as { "@context": string; "@graph": object[] };
  if (orgId) {
    graph["@graph"].push({
      "@type": "Organization",
      "@id": orgId,
      name: page.h1,
      url: `${SITE_URL}${page.path}`,
      description: page.description,
      ...(page.sameAs ? { sameAs: page.sameAs } : {}),
    });
  }

  return (
    <>
      <JsonLd data={graph} />
      <PublicArticle
        kicker={page.kicker}
        title={page.h1}
        subtitle={page.description}
        crumbs={[
          { href: "/agritech", label: "Agritech" },
          { href: page.path, label: page.h1 },
        ]}
      >
        {page.sections.map((section) => (
          <ProseSection key={section.heading} {...section} />
        ))}
        <section>
          <h2>Connected pages</h2>
          <ul>
            {page.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            {page.sameAs?.map((href) => (
              <li key={href}>
                <a href={href} rel="noopener noreferrer" target="_blank">
                  {href.replace(/^https?:\/\//, "")}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <p>
          Identity: <Link href="/about-kush-gangwal">{PERSON_NAME}</Link>.
        </p>
      </PublicArticle>
    </>
  );
}
