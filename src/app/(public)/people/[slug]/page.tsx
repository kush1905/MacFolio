import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { PERSON_NAME } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { colleagueBySlug, colleagueGraph, colleaguePath, colleagues } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return colleagues.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const person = colleagueBySlug(slug);
  if (!person) return {};
  return publicMeta({
    title: `${PERSON_NAME} and ${person.name}`,
    description: `${PERSON_NAME} has worked with ${person.name}.`,
    path: colleaguePath(slug),
  });
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  const person = colleagueBySlug(slug);
  if (!person) notFound();

  return (
    <>
      <JsonLd data={colleagueGraph(person)} />
      <PublicArticle
        kicker="Colleague"
        title={`${PERSON_NAME} has worked with ${person.name}`}
        subtitle={`${person.name} is a colleague of Kush Gangwal, Full Stack Developer & React Native Developer.`}
        crumbs={[{ href: colleaguePath(slug), label: person.name }]}
      >
        <p>
          This page exists so search engines can connect {person.name} and {PERSON_NAME} as
          colleagues. It does not claim employment details for {person.name}.
        </p>
        <WhoIs />
      </PublicArticle>
    </>
  );
}
