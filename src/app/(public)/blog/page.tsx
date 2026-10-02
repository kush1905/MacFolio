import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { blogPosts } from "@/lib/blogPosts";
import { PERSON_NAME, personId } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { blogPostPath, personNode } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata = publicMeta({
  title: `Writing by ${PERSON_NAME}`,
  description: `Technical writing by ${PERSON_NAME} on Nexus, Resumind, Potato Bazaar, React Native, Protonshub, and Medicaps University.`,
  path: "/blog",
});

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            personNode(),
            {
              "@type": "Blog",
              name: `Writing by ${PERSON_NAME}`,
              url: `${SITE_URL}/blog`,
              author: { "@id": personId },
            },
          ],
        }}
      />
      <PublicArticle
        kicker="Writing"
        title={`Writing by ${PERSON_NAME}`}
        subtitle="Canonical articles. Syndicate to Medium, Dev.to, and Hashnode with this site as the source."
      >
        <div className="public-related">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={blogPostPath(post.slug)}>
              <strong>{post.title}</strong>
              {post.date} — {post.description}
            </Link>
          ))}
        </div>
      </PublicArticle>
    </>
  );
}
