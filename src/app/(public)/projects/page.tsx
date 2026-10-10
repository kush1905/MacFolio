import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { PERSON_NAME, personId } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { personNode, products, productPath } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata = publicMeta({
  title: `Projects by ${PERSON_NAME}`,
  description: `Case studies by ${PERSON_NAME}: Nexus, Resumind, CodeMace, Potato Bazaar, Tybee Go, Findanio, and Macfolio.`,
  path: "/projects",
});

export default function ProjectsIndexPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            personNode(),
            {
              "@type": "CollectionPage",
              name: `Projects by ${PERSON_NAME}`,
              url: `${SITE_URL}/projects`,
              about: { "@id": personId },
            },
          ],
        }}
      />
      <PublicArticle
        kicker="Case studies"
        title={`Projects by ${PERSON_NAME}`}
        subtitle="Case studies of the products Kush Gangwal has built or worked on."
      >
        <div className="public-related">
          {products.map((product) => (
            <Link key={product.slug} href={productPath(product.slug)}>
              <strong>{product.name}</strong>
              {product.tagline}. {product.description}
            </Link>
          ))}
        </div>
      </PublicArticle>
    </>
  );
}
