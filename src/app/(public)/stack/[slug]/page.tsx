import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { PERSON_NAME } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { articleGraph } from "@/lib/seo";
import { techBySlug, techPages } from "@/lib/techPages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return techPages.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = techBySlug(slug);
  if (!page) return {};
  return publicMeta({
    title: `${page.name} · ${PERSON_NAME}`,
    description: page.description,
    path: `/stack/${slug}`,
    absoluteTitle: true,
  });
}

export default async function TechPage({ params }: Props) {
  const { slug } = await params;
  const page = techBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={articleGraph({
          headline: `${page.name} · ${PERSON_NAME}`,
          description: page.description,
          path: `/stack/${slug}`,
        })}
      />
      <PublicArticle
        kicker="Technology"
        title={`${PERSON_NAME} and ${page.name}`}
        subtitle={page.description}
        crumbs={[
          { href: "/stack", label: "Stack" },
          { href: `/stack/${slug}`, label: page.name },
        ]}
      >
        <p>{page.use}</p>
        <h2>Where it shows up</h2>
        <ul>
          {page.proof.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2>Connected pages</h2>
        <ul>
          {page.related.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <WhoIs />
      </PublicArticle>
    </>
  );
}
