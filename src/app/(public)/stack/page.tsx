import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { PERSON_NAME, personId } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { personNode } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { techGroups, techNodes } from "@/lib/portfolio";
import { techPages } from "@/lib/techPages";

export const metadata = publicMeta({
  title: `Technology stack · ${PERSON_NAME}`,
  description: `Technologies Kush Gangwal uses: React Native, React.js, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL, and AI APIs.`,
  path: "/stack",
});

export default function StackIndexPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            personNode(),
            {
              "@type": "CollectionPage",
              name: `${PERSON_NAME} technology stack`,
              url: `${SITE_URL}/stack`,
              about: { "@id": personId },
            },
          ],
        }}
      />
      <PublicArticle
        kicker="Stack"
        title={`Technologies ${PERSON_NAME} uses`}
        subtitle="Each page ties a technology to a real project or job. This is not a general tutorial index."
        width="wide"
      >
        {[...techGroups, "More"].map((group) => {
          const pages = techPages.filter(
            (page) => (techNodes.find((node) => node.slug === page.slug)?.group ?? "More") === group,
          );
          if (pages.length === 0) return null;
          return (
            <section key={group} className="stack-group">
              <h2>{group}</h2>
              <div className="public-card-grid">
                {pages.map((page) => (
                  <Link className="public-card" key={page.slug} href={`/stack/${page.slug}`}>
                    <strong>{page.name}</strong>
                    {page.description}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </PublicArticle>
    </>
  );
}
