import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProfileLinks } from "@/components/public/ProfileLinks";
import { PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { content } from "@/lib/content";
import { PERSON_HEADLINE, PERSON_NAME, PERSON_TITLE_TAG } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { aboutDescription, aboutGraph, companies, products } from "@/lib/seo";

export const metadata = publicMeta({
  title: PERSON_TITLE_TAG,
  description: aboutDescription,
  path: "/about-kush-gangwal",
  absoluteTitle: true,
  type: "profile",
});

export default function AboutKushGangwalPage() {
  return (
    <>
      <JsonLd data={aboutGraph()} />
      <PublicArticle
        kicker={PERSON_HEADLINE}
        title={PERSON_NAME}
        subtitle={aboutDescription}
      >
        <WhoIs />

        <section>
          <h2>Work</h2>
          <p>
            Kush Gangwal currently works at SK Groups in Indore. He previously interned at
            Protonshub Technologies and Django Softwares, and is a founding engineer of Potato
            Bazaar and Findanio.
          </p>
          <div className="public-related">
            {companies.map((company) => (
              <Link key={company.slug} href={`/work/${company.slug}`}>
                <strong>{company.name}</strong>
                {company.summary}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>Projects</h2>
          <p>
            Independent case studies exist so Google can rank Potato Bazaar, Nexus, Resumind,
            CodeMace, and Tybee Go on their own URLs.
          </p>
          <div className="public-card-grid">
            {products.map((product) => (
              <Link className="public-card" key={product.slug} href={`/projects/${product.slug}`}>
                <strong>{product.name}</strong>
                {product.tagline}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>Education</h2>
          <p>
            Kush Gangwal studies {content.about.education.degree} at{" "}
            <Link href="/education/medicaps-university">Medicaps University</Link> in Indore
            ({content.about.education.duration}, CGPA {content.about.education.cgpa}).
          </p>
        </section>

        <section>
          <h2>Official profiles</h2>
          <p>
            Every profile uses the same name and headline: {PERSON_NAME}, {PERSON_HEADLINE}.
          </p>
          <ProfileLinks extras />
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Email{" "}
            <a href={`mailto:${content.about.email}`}>{content.about.email}</a>
            {content.about.emailAlt ? (
              <>
                {" "}
                or <a href={`mailto:${content.about.emailAlt}`}>{content.about.emailAlt}</a>
              </>
            ) : null}
            . Also see <Link href="/now">/now</Link>, <Link href="/faq">FAQ</Link>, and the{" "}
            <Link href="/desktop">interactive portfolio desktop</Link>.
          </p>
        </section>
      </PublicArticle>
    </>
  );
}
