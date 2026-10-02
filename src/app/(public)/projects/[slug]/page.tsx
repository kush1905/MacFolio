import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProseSection, PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { caseStudies, caseStudyBySlug } from "@/lib/caseStudies";
import { publicMeta } from "@/lib/publicMeta";
import { productBySlug, productGraph, products } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  const product = productBySlug(slug);
  if (!product) return {};
  return publicMeta({
    title: study?.title ?? `${product.name} | Kush Gangwal`,
    description: study?.description ?? product.description,
    path: `/projects/${slug}`,
    absoluteTitle: Boolean(study),
    type: "article",
    image: study?.cover,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const product = productBySlug(slug);
  const study = caseStudyBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <JsonLd data={productGraph(product)} />
      <PublicArticle
        kicker={product.period}
        title={study?.h1 ?? product.name}
        subtitle={study?.description ?? product.description}
        crumbs={[
          { href: "/projects", label: "Projects" },
          { href: `/projects/${slug}`, label: product.name },
        ]}
      >
        <p>
          {product.credit === "is founding engineer of"
            ? `Kush Gangwal is founding engineer of ${product.name}.`
            : product.credit === "contributed to"
              ? `Kush Gangwal contributed to ${product.name}.`
              : `Kush Gangwal built ${product.name}.`}{" "}
          Role: {study?.role ?? "Full Stack Developer & React Native Developer"}. Tech:{" "}
          {product.tech.join(", ")}.
        </p>

        {study
          ? study.sections.map((section) => <ProseSection key={section.heading} {...section} />)
          : null}

        {product.links.length > 0 ? (
          <section>
            <h2>Links</h2>
            <ul>
              {product.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} rel="noopener noreferrer" target="_blank">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <WhoIs />

        <section>
          <h2>More projects</h2>
          <div className="public-card-grid">
            {caseStudies
              .filter((item) => item.slug !== slug)
              .slice(0, 4)
              .map((item) => (
                <Link className="public-card" key={item.slug} href={`/projects/${item.slug}`}>
                  <strong>{item.name}</strong>
                  {item.description}
                </Link>
              ))}
          </div>
        </section>
      </PublicArticle>
    </>
  );
}
