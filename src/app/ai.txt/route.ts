import { PERSON_NAME, personUrl } from "@/lib/identity";
import { SITE_URL } from "@/lib/site";

export function GET() {
  const body = [
    `# ${PERSON_NAME}`,
    "User-Agent: *",
    "Allow: /",
    "",
    `Canonical-Entity: ${personUrl}`,
    `llms-txt: ${SITE_URL}/llms.txt`,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
