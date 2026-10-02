import { JsonLd } from "@/components/seo/JsonLd";
import { ProfileLinks } from "@/components/public/ProfileLinks";
import { PublicArticle } from "@/components/public/PublicArticle";
import { WhoIs } from "@/components/public/WhoIs";
import { PERSON_HEADLINE, PERSON_NAME, officialProfiles } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { personNode } from "@/lib/seo";

export const metadata = publicMeta({
  title: `Official profiles — ${PERSON_NAME}`,
  description: `${PERSON_NAME} uses the same identity on LinkedIn, GitHub, LeetCode, Medium, Dev.to, Hashnode, and X: ${PERSON_HEADLINE}.`,
  path: "/accounts",
});

export default function AccountsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [personNode()],
        }}
      />
      <PublicArticle
        kicker="Same identity everywhere"
        title={`Official profiles of ${PERSON_NAME}`}
        subtitle={`${PERSON_NAME} · ${PERSON_HEADLINE}`}
      >
        <p>
          Every profile should display the same name and headline. Inconsistent names weaken
          entity recognition.
        </p>
        <ProfileLinks extras />
        <p>
          When you mention this person on a hackathon page, company team page, or article, write{" "}
          <strong>{PERSON_NAME}</strong> and link to the about page. These {officialProfiles.length}{" "}
          networks are the official sameAs set.
        </p>
        <WhoIs />
      </PublicArticle>
    </>
  );
}
