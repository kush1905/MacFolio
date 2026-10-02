import { officialProfiles, PERSON_HEADLINE, PERSON_NAME } from "@/lib/identity";
import { SITE_URL } from "@/lib/site";

export function GET() {
  const body = [
    "/* TEAM */",
    `  ${PERSON_NAME}`,
    `  ${PERSON_HEADLINE}`,
    "  Location: Indore, India",
    `  Site: ${SITE_URL}/about-kush-gangwal`,
    "",
    "/* PROFILES */",
    ...officialProfiles.map((profile) => `  ${profile.label}: ${profile.href}`),
    "",
    "/* SITE */",
    "  Standards: HTML5, Schema.org Person",
    "  Built with: Next.js",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
