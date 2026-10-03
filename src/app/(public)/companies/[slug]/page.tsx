import { notFound } from "next/navigation";
import { AgriDocument } from "@/components/public/AgriDocument";
import { agriCompanies, agriCompanyBySlug } from "@/lib/agriGraph";
import { publicMeta } from "@/lib/publicMeta";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

const orgIds: Record<string, string> = {
  "sk-groups": `${SITE_URL}/work/sk-groups#org`,
  "sk-agri-exports-private-limited": `${SITE_URL}/work/sk-agri-exports-private-ltd#org`,
  "mantra-agri-solutions": `${SITE_URL}/companies/mantra-agri-solutions#org`,
};

export function generateStaticParams() {
  return agriCompanies.map((company) => ({ slug: company.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const company = agriCompanyBySlug(slug);
  if (!company) return {};
  return publicMeta({
    title: company.title,
    description: company.description,
    path: company.path,
    absoluteTitle: true,
  });
}

export default async function CompanyEntityPage({ params }: Props) {
  const { slug } = await params;
  const company = agriCompanyBySlug(slug);
  if (!company) notFound();
  return <AgriDocument page={company} orgId={orgIds[slug]} />;
}
