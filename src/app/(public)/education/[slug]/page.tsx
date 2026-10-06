import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { PERSON_NAME } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { education, educationGraph, educationPath } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [{ slug: education.slug }];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (slug !== education.slug) return {};
  return publicMeta({
    title: `${PERSON_NAME} · ${education.name}`,
    description: `${PERSON_NAME} graduated with ${education.degree} from ${education.name} in Indore, ${education.score}, ${education.duration}. He grew up in Bakaner and works in Ahmedabad.`,
    path: educationPath,
  });
}

export default async function EducationPage({ params }: Props) {
  const { slug } = await params;
  if (slug !== education.slug) notFound();

  return (
    <>
      <JsonLd data={educationGraph()} />
      <PublicArticle
        kicker="Education"
        title={`${PERSON_NAME} at ${education.name}`}
        subtitle={`${education.degree}. ${education.score}. ${education.duration}. ${education.location}.`}
        crumbs={[{ href: educationPath, label: education.name }]}
      >
        <p>
          Kush Gangwal graduated from Medicaps University in Indore with a B.Tech in Computer Science Technology. He grew up in Bakaner and works in Ahmedabad.
          The dedicated search page is{" "}
          <Link href="/kush-gangwal-medicaps-university">/kush-gangwal-medicaps-university</Link>.
        </p>
        <WhoIs />
      </PublicArticle>
    </>
  );
}
