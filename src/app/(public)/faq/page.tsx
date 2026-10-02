import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { PERSON_NAME } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { faqGraph, faqs } from "@/lib/seo";

export const metadata = publicMeta({
  title: `Questions about ${PERSON_NAME}`,
  description: `FAQ about ${PERSON_NAME}: Full Stack Developer & React Native Developer, Potato Bazaar, Nexus, Resumind, Medicaps University, and Protonshub.`,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqGraph()} />
      <PublicArticle
        kicker="FAQ"
        title={`Questions about ${PERSON_NAME}`}
        subtitle="Short factual answers for search and answer engines."
      >
        {faqs.map((faq) => (
          <section key={faq.question}>
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
          </section>
        ))}
        <WhoIs />
      </PublicArticle>
    </>
  );
}
