import { notFound } from "next/navigation";
import { AgriDocument } from "@/components/public/AgriDocument";
import { agriIndustries, agriIndustryBySlug } from "@/lib/agriGraph";
import { publicMeta } from "@/lib/publicMeta";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return agriIndustries.map((industry) => ({ slug: industry.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const industry = agriIndustryBySlug(slug);
  if (!industry) return {};
  return publicMeta({
    title: industry.title,
    description: industry.description,
    path: industry.path,
    absoluteTitle: true,
  });
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = agriIndustryBySlug(slug);
  if (!industry) notFound();
  return <AgriDocument page={industry} />;
}
