import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactsCard, ProseSection, PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { caseStudyBySlug } from "@/lib/caseStudies";
import { fdeFaqs, fdePage } from "@/lib/fdePage";
import { publicMeta } from "@/lib/publicMeta";
import { fdeGraph } from "@/lib/seo";

export const metadata = {
  ...publicMeta({
    title: fdePage.title,
    description: fdePage.description,
    path: fdePage.path,
    absoluteTitle: true,
    type: "article",
    image: fdePage.image,
  }),
  keywords: fdePage.keywords,
};

const screenshots = (caseStudyBySlug("potato-bazaar")?.screenshots ?? []).filter(
  (shot) => (shot.frame ?? "phone") === "phone",
);

export default function PotatoBazaarFdePage() {
  return (
    <>
      <JsonLd data={fdeGraph()} />
      <PublicArticle
        kicker={fdePage.kicker}
        title={fdePage.h1}
        subtitle={fdePage.lede}
        updated={fdePage.datePublished}
        crumbs={[
          { href: "/projects/potato-bazaar", label: "Potato Bazaar" },
          { href: fdePage.path, label: "Forward Deployed Engineer" },
        ]}
        aside={<FactsCard title="Role" facts={fdePage.facts} />}
        actions={
          <>
            <a className="btn btn-primary btn-small" href="https://potatobazaar.com" rel="noopener noreferrer" target="_blank">
              Potato Bazaar ↗
            </a>
            <a
              className="btn btn-small"
              href="https://play.google.com/store/apps/details?id=com.potatobazaar"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google Play ↗
            </a>
          </>
        }
      >
        {fdePage.sections.map((section) => (
          <ProseSection key={section.heading} {...section} />
        ))}

        {screenshots.length > 0 ? (
          <section>
            <h2>The Potato Bazaar app</h2>
            <div className="public-screens">
              {screenshots.map((shot) => (
                <figure key={shot.src}>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="(max-width: 640px) 45vw, 240px"
                  />
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h2>Questions about the role</h2>
          {fdeFaqs.map((faq) => (
            <div key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>

        <section>
          <h2>Related</h2>
          <ul>
            <li>
              <Link href="/projects/potato-bazaar">Potato Bazaar case study</Link>
            </li>
            <li>
              <Link href="/potato-bazaar-ai-crop-doctor">Potato Bazaar AI Crop Doctor</Link>
            </li>
            <li>
              <Link href="/kush-gangwal-ai-application-developer">AI application work</Link>
            </li>
            <li>
              <Link href="/about-kush-gangwal">About Kush Gangwal</Link>
            </li>
          </ul>
        </section>

        <WhoIs />
      </PublicArticle>
    </>
  );
}
