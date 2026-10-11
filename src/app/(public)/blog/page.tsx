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
        subtitle="Articles on the products Kush Gangwal builds, React Native, and his work and study. Some are also posted on Medium, Dev.to, and Hashnode."
      >
        <div className="post-list">
          {[...blogPosts]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((post) => (
              <Link key={post.slug} href={blogPostPath(post.slug)}>
                <time dateTime={post.date}>{post.date}</time>
                <strong>{post.title}</strong>
                <span>{post.description}</span>
              </Link>
            ))}
        </div>
      </PublicArticle>
    </>
  );
}
