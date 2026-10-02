import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { PERSON_NAME } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { companies, companyBySlug, companyGraph, companyPath, productPath } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return companies.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const company = companyBySlug(slug);
  if (!company) return {};
  return publicMeta({
    title: `${PERSON_NAME} at ${company.name}`,
    description: company.summary,
    path: companyPath(slug),
  });
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const company = companyBySlug(slug);
  if (!company) notFound();

  return (
    <>
      <JsonLd data={companyGraph(company)} />
      <PublicArticle
        kicker={company.duration || company.type || "Work"}
        title={`${PERSON_NAME} at ${company.name}`}
        subtitle={company.summary}
        crumbs={[
          { href: "/about-kush-gangwal", label: "About" },
          { href: companyPath(slug), label: company.name },
        ]}
      >
        <p>
          Role: {company.role}
          {company.type ? ` · ${company.type}` : ""}.
        </p>
        <ul>
          {company.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {company.skills.length > 0 ? <p>Skills: {company.skills.join(", ")}.</p> : null}
        {company.products.length > 0 ? (
          <p>
            Products:{" "}
            {company.products.map((name, index) => (
              <span key={name}>
                {index > 0 ? ", " : ""}
                <Link href={productPath(name.toLowerCase().replace(/\s+/g, "-"))}>{name}</Link>
              </span>
            ))}
            .
          </p>
        ) : null}
        <WhoIs />
      </PublicArticle>
    </>
  );
}
