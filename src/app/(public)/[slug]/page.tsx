import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProseSection, PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { agriSearchPages } from "@/lib/agriGraph";
import { entityPageBySlug, entityPages } from "@/lib/entityPages";
import { footprintBySlug, footprintPages } from "@/lib/footprint";
import { publicMeta } from "@/lib/publicMeta";
import { articleGraph } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

const pages = [...entityPages, ...footprintPages, ...agriSearchPages];

export function generateStaticParams() {
  return pages.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = entityPageBySlug(slug) ?? footprintBySlug(slug) ?? agriSearchPages.find((item) => item.slug === slug);
  if (!page) return {};
  return publicMeta({
    title: page.title,
    description: page.description,
    path: page.path,
    absoluteTitle: true,
  });
}

export default async function EntitySearchPage({ params }: Props) {
  const { slug } = await params;
  const page = entityPageBySlug(slug) ?? footprintBySlug(slug) ?? agriSearchPages.find((item) => item.slug === slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={articleGraph({
          headline: page.title,
          description: page.description,
          path: page.path,
        })}
      />
      <PublicArticle
        kicker={page.kicker}
        title={page.h1}
        subtitle={page.description}
        crumbs={[{ href: page.path, label: page.h1 }]}
      >
        {page.sections.map((section) => (
          <ProseSection key={section.heading} {...section} />
        ))}
        <WhoIs />
        <p>
          Canonical identity: <Link href="/about-kush-gangwal">Kush Gangwal</Link>.
        </p>
      </PublicArticle>
    </>
  );
}
