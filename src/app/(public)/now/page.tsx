import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhoIs } from "@/components/public/WhoIs";
import { PublicArticle } from "@/components/public/PublicArticle";
import { content } from "@/lib/content";
import { PERSON_HEADLINE, PERSON_NAME } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { nowGraph } from "@/lib/seo";

const now = content.now;

export const metadata = publicMeta({
  title: `Now — ${PERSON_NAME}`,
  description: `${PERSON_NAME} is currently working at ${now.workingAt}. Building Potato Bazaar, mobile applications, and AI integrations. Interested in Agentic AI, GenAI, and React Native.`,
  path: "/now",
});

export default function NowPage() {
  return (
    <>
      <JsonLd data={nowGraph()} />
      <PublicArticle
        kicker="Now"
        title={`What ${PERSON_NAME} is doing now`}
        subtitle={`${PERSON_NAME} is a ${PERSON_HEADLINE}. This page is updated monthly.`}
        updated={now.updated}
        crumbs={[{ href: "/now", label: "Now" }]}
      >
        <section>
          <h2>Currently working at {now.workingAt}</h2>
          <p>
            {PERSON_NAME} works at {now.workingAt} as {now.workingAs}, onsite in {now.location}.
            Public identity stays {now.identity}.
          </p>
        </section>

        <section>
          <h2>Building</h2>
          <ul>
            {now.building.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Interested in</h2>
          <ul>
            {now.interestedIn.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Learning</h2>
          <ul>
            {now.learning.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <WhoIs />

        <p>
          Last updated {now.updatedLabel}. Related:{" "}
          <Link href="/about-kush-gangwal">about</Link>,{" "}
          <Link href="/projects/potato-bazaar">Potato Bazaar</Link>,{" "}
          <Link href="/kush-gangwal-react-native-developer">React Native</Link>.
        </p>
      </PublicArticle>
    </>
  );
}
