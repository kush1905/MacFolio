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
        portrait={{ src: content.about.avatar, alt: `${PERSON_NAME}, ${PERSON_HEADLINE}` }}
      >
        <WhoIs />

        <section>
          <h2>Work</h2>
          <p>
            Kush Gangwal is a Junior Software Developer at SK Groups in Ahmedabad, where he
            develops Potato Bazaar&apos;s mobile app, backend, and web platform. He previously
            interned at Protonshub Technologies, where he contributed to Tybee Go and Findanio, and
            at Django Softwares.
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
            Each project has its own case study covering the problem, what Kush Gangwal worked
            on, and the stack.
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
            Kush Gangwal graduated with {content.about.education.degree} from{" "}
            <Link href="/education/medicaps-university">Medicaps University</Link> in Indore
            ({content.about.education.duration}, CGPA {content.about.education.cgpa}). He grew up in
            Bakaner, Dhar district, Madhya Pradesh, and works in Ahmedabad.
          </p>
        </section>

        <section>
          <h2>Official profiles</h2>
          <p>
            Find {PERSON_NAME} on these networks.
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
