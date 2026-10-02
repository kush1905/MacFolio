import { INDEXNOW_KEY } from "@/lib/indexnow";
import { sitemapEntries } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export async function GET() {
  const host = new URL(SITE_URL).host;
  const urlList = sitemapEntries().slice(0, 100);
  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  return Response.json({
    ok: response.ok,
    status: response.status,
    submitted: urlList.length,
  });
}
