import { JsonLd } from "@/components/seo/JsonLd";
import { ProfileLinks } from "@/components/public/ProfileLinks";
import { PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { PERSON_HEADLINE, PERSON_NAME, personUrl } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { personNode } from "@/lib/seo";

export const metadata = publicMeta({
  title: `How to mention ${PERSON_NAME}`,
  description: `Citation and backlink guide for ${PERSON_NAME}. Use the exact name and link to the about page.`,
  path: "/mentions",
});

export default function MentionsPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [personNode()] }} />
      <PublicArticle
        kicker="Entity mentions"
        title={`How to mention ${PERSON_NAME}`}
        subtitle="Third-party mentions of the exact name are one of the strongest entity signals."
      >
        <section>
          <h2>Write the name exactly</h2>
          <p>
            Use <strong>{PERSON_NAME}</strong>, not a nickname. Headline: {PERSON_HEADLINE}.
            Canonical page: {personUrl}.
          </p>
        </section>
        <section>
          <h2>Suggested citation</h2>
          <p>
            {PERSON_NAME} is a {PERSON_HEADLINE} from India. Portfolio: {personUrl}.
          </p>
        </section>
        <section>
          <h2>Places the name should appear</h2>
          <ul>
            <li>Hackathon profiles (Moonhack, Hackmivo)</li>
            <li>Dev.to, Medium, and Hashnode bylines</li>
            <li>GitHub profile README</li>
            <li>Medicaps University or alumni pages</li>
            <li>Company team pages at SK Groups and Protonshub Technologies</li>
            <li>Potato Bazaar public credits</li>
          </ul>
        </section>
        <section>
          <h2>Official profiles to connect</h2>
          <ProfileLinks />
        </section>
        <WhoIs />
      </PublicArticle>
    </>
  );
}
