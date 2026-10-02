import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { content } from "@/lib/content";
import { PERSON_HEADLINE, PERSON_NAME } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { companies, education, personNode, products } from "@/lib/seo";

export const metadata = publicMeta({
  title: `Resume — ${PERSON_NAME}`,
  description: `HTML resume for ${PERSON_NAME}, ${PERSON_HEADLINE}. Also available as PDF.`,
  path: "/resume",
});

export default function ResumePage() {
  const { about, experience } = content;
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [personNode()] }} />
      <PublicArticle
        kicker="Resume"
        title={PERSON_NAME}
        subtitle={PERSON_HEADLINE}
      >
        <p>
          {about.bio}{" "}
          <a href={about.links.resume} rel="noopener">
            Download PDF
          </a>
          .
        </p>
        <section>
          <h2>Experience</h2>
          {experience.experience.map((job) => (
            <section key={job.company}>
              <h2>
                {job.role} — {job.company}
              </h2>
              <p>
                {job.duration} · {job.type}
              </p>
              <ul>
                {job.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </section>
        <section>
          <h2>Projects</h2>
          <ul>
            {products.map((product) => (
              <li key={product.slug}>
                <Link href={`/projects/${product.slug}`}>{product.name}</Link> — {product.tagline}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Education</h2>
          <p>
            {education.degree}, {education.name}, {education.score}, {education.duration}.
          </p>
        </section>
        <section>
          <h2>Companies on this site</h2>
          <ul>
            {companies.map((company) => (
              <li key={company.slug}>
                <Link href={`/work/${company.slug}`}>{company.name}</Link>
              </li>
            ))}
          </ul>
        </section>
        <WhoIs />
      </PublicArticle>
    </>
  );
}
