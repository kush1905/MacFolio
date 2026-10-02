import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { PERSON_NAME, personId } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { personNode } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
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
      >
        <div className="public-card-grid">
          {techPages.map((page) => (
            <Link className="public-card" key={page.slug} href={`/stack/${page.slug}`}>
              <strong>{page.name}</strong>
              {page.description}
            </Link>
          ))}
        </div>
      </PublicArticle>
    </>
  );
}
