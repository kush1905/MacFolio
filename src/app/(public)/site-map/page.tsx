import Link from "next/link";
import { PublicArticle } from "@/components/public/PublicArticle";
import { blogPosts } from "@/lib/blogPosts";
import { entityPages } from "@/lib/entityPages";
import { PERSON_NAME } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { companies, products } from "@/lib/seo";

export const metadata = publicMeta({
  title: `Site map — ${PERSON_NAME}`,
  description: `HTML sitemap of the Kush Gangwal Portfolio: about, projects, writing, work, and now.`,
  path: "/site-map",
});

export default function HtmlSitemapPage() {
  return (
    <PublicArticle kicker="Index" title={`Site map — ${PERSON_NAME}`}>
      <section>
        <h2>Identity</h2>
        <ul>
          <li>
            <Link href="/about-kush-gangwal">About Kush Gangwal</Link>
          </li>
          <li>
            <Link href="/topics">Topics</Link>
          </li>
          <li>
            <Link href="/stack">Stack</Link>
          </li>
          <li>
            <Link href="/now">Now</Link>
          </li>
          <li>
            <Link href="/faq">FAQ</Link>
          </li>
          <li>
            <Link href="/accounts">Official profiles</Link>
          </li>
          <li>
            <Link href="/resume">Resume</Link>
          </li>
          <li>
            <Link href="/mentions">How to mention</Link>
          </li>
        </ul>
      </section>
      <section>
        <h2>Projects</h2>
        <ul>
          {products.map((product) => (
            <li key={product.slug}>
              <Link href={`/projects/${product.slug}`}>{product.name}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Writing</h2>
        <ul>
          {blogPosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Search pages</h2>
        <ul>
          {entityPages.map((page) => (
            <li key={page.slug}>
              <Link href={page.path}>{page.h1}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Work</h2>
        <ul>
          {companies.map((company) => (
            <li key={company.slug}>
              <Link href={`/work/${company.slug}`}>{company.name}</Link>
            </li>
          ))}
        </ul>
      </section>
    </PublicArticle>
  );
}
