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
        kicker="Profiles"
        title={`Official profiles of ${PERSON_NAME}`}
        subtitle={`${PERSON_NAME} · ${PERSON_HEADLINE}`}
      >
        <p>
          These are the {officialProfiles.length} main profiles {PERSON_NAME} uses for code,
          writing, and work, plus a few secondary accounts.
        </p>
        <ProfileLinks extras />
        <WhoIs />
      </PublicArticle>
    </>
  );
}
