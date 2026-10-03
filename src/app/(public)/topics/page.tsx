import Link from "next/link";
import { PublicArticle } from "@/components/public/PublicArticle";
import { agriCompanies, agriIndustries, agriSearchPages } from "@/lib/agriGraph";
import { entityPages } from "@/lib/entityPages";
import { footprintPages } from "@/lib/footprint";
import { PERSON_NAME } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { blogPosts } from "@/lib/blogPosts";
import { techPages } from "@/lib/techPages";

export const metadata = publicMeta({
  title: `Topics · ${PERSON_NAME}`,
  description: `The Kush Gangwal topic map: name, roles, companies, projects, technologies, and writing.`,
  path: "/topics",
});

export default function TopicsPage() {
  const pages = [...entityPages, ...footprintPages];
  return (
    <PublicArticle
      kicker="Topic map"
      title={`Everything on ${PERSON_NAME}`}
      subtitle="Only identity, skills, projects, companies, and the technologies those products use."
    >
      <section>
        <h2>Name, roles, and companies</h2>
        <ul>
          {pages.map((page) => (
            <li key={page.slug}>
              <Link href={page.path}>{page.h1}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Potato Bazaar and agritech</h2>
        <ul>
          {[...agriCompanies, ...agriIndustries, ...agriSearchPages].map((page) => (
            <li key={page.path}>
              <Link href={page.path}>{page.h1}</Link>
            </li>
          ))}
          <li>
            <Link href="/entities">Entity graph</Link>
          </li>
          <li>
            <Link href="/agritech">Agritech hub</Link>
          </li>
        </ul>
      </section>
      <section>
        <h2>Technologies</h2>
        <ul>
          {techPages.map((page) => (
            <li key={page.slug}>
              <Link href={`/stack/${page.slug}`}>{page.name}</Link>
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
    </PublicArticle>
  );
}
