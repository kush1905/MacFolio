import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { publicMeta } from "@/lib/publicMeta";
import { articleGraph } from "@/lib/seo";
import { spellingPages } from "@/lib/spellings";

export const metadata = publicMeta({
  title: "Spellings of Kush Gangwal, Potato Bazaar, and SK Groups",
  description:
    "Misspellings of Kush Gangwal, Potato Bazaar, SK Groups, and related names. He grew up in Bakaner, graduated in Indore, and works in Ahmedabad.",
  path: "/spellings",
  absoluteTitle: true,
});

export default function SpellingsPage() {
  return (
    <>
      <JsonLd
        data={articleGraph({
          headline: "Spellings of Kush Gangwal",
          description:
            "Wrong spellings of Kush Gangwal, his projects, and his workplaces still refer to the same person.",
          path: "/spellings",
        })}
      />
      <PublicArticle
        kicker="Spellings"
        title="If the spelling is off, it is still Kush Gangwal"
        subtitle="He grew up in Bakaner, Dhar district, Madhya Pradesh. He graduated in Indore. He works at SK Groups in Ahmedabad."
      >
        <ul>
          {spellingPages.map((page) => (
            <li key={page.path}>
              <Link href={page.path}>{page.h1}</Link>
            </li>
          ))}
        </ul>
      </PublicArticle>
    </>
  );
}
