import { INDEXNOW_KEY } from "@/lib/indexnow";
import { sitemapEntries } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

/**
 * Submits the sitemap to IndexNow. Requires INDEXNOW_TRIGGER_TOKEN (as a Bearer token or
 * ?token=) so the public can't spam submissions; returns 404 when the token isn't configured.
 */
export async function GET(req: Request) {
  const expected = process.env.INDEXNOW_TRIGGER_TOKEN?.trim();
  const given =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    new URL(req.url).searchParams.get("token") ??
    "";
  if (!expected) return new Response("Not found", { status: 404 });
  if (given !== expected) return new Response("Unauthorized", { status: 401 });

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
