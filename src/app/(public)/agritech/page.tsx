import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { agriBlog } from "@/lib/agriBlog";
import { agriCompanies, agriIndustries, agriSearchPages } from "@/lib/agriGraph";
import { publicMeta } from "@/lib/publicMeta";
import { articleGraph, blogPostPath } from "@/lib/seo";

export const metadata = publicMeta({
  title: "Agritech — Potato Bazaar and Kush Gangwal",
  description:
    "The agritech pages on this portfolio: Potato Bazaar, SK Agri Exports, SK Groups, Mantra Agri Solutions, cold storage, and potato trading.",
  path: "/agritech",
  absoluteTitle: true,
});

export default function AgritechPage() {
  return (
    <>
      <JsonLd
        data={articleGraph({
          headline: "Agritech hub",
          description:
            "The agritech pages on this portfolio: Potato Bazaar, SK Agri Exports, SK Groups, Mantra Agri Solutions, cold storage, and potato trading.",
          path: "/agritech",
        })}
      />
      <PublicArticle
        kicker="Agritech"
        title="Potato Bazaar and the companies around it"
        subtitle="Every page below connects the same facts: Kush Gangwal builds Potato Bazaar, SK Agri Exports operates it, and SK Groups employs him."
      >
        <section>
          <h2>Companies</h2>
          <ul>
            {agriCompanies.map((page) => (
              <li key={page.path}>
                <Link href={page.path}>{page.h1}</Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Industries</h2>
          <ul>
            {agriIndustries.map((page) => (
              <li key={page.path}>
                <Link href={page.path}>{page.h1}</Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Answers</h2>
          <ul>
            {agriSearchPages.map((page) => (
              <li key={page.path}>
                <Link href={page.path}>{page.h1}</Link>
              </li>
            ))}
            <li>
              <Link href="/entities">Entity graph</Link>
            </li>
            <li>
              <Link href="/projects/potato-bazaar">Potato Bazaar case study</Link>
            </li>
          </ul>
        </section>
        <section>
          <h2>Writing</h2>
          <ul>
            {agriBlog.map((post) => (
              <li key={post.slug}>
                <Link href={blogPostPath(post.slug)}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </PublicArticle>
    </>
  );
}
