import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProseSection, PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { blogPostBySlug, blogPosts } from "@/lib/blogPosts";
import { PERSON_NAME } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { articleGraph, blogPostPath } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  if (!post) return {};
  return publicMeta({
    title: `${post.title} | ${PERSON_NAME}`,
    description: post.description,
    path: blogPostPath(slug),
    absoluteTitle: true,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={articleGraph({
          headline: post.title,
          description: post.description,
          path: blogPostPath(slug),
          date: post.date,
        })}
      />
      <PublicArticle
        kicker={post.tags.join(" · ")}
        title={post.title}
        subtitle={post.description}
        updated={post.date}
        crumbs={[
          { href: "/blog", label: "Writing" },
          { href: blogPostPath(slug), label: post.title },
        ]}
      >
        {post.sections.map((section) => (
          <ProseSection key={section.heading} {...section} />
        ))}
        <WhoIs />
        <p>
          More writing on the <Link href="/blog">Kush Gangwal blog</Link>. Cross-post with a
          canonical link back here.
        </p>
      </PublicArticle>
    </>
  );
}
