import { blogPosts } from "@/lib/blogPosts";
import { caseStudies } from "@/lib/caseStudies";
import { PERSON_HEADLINE, PERSON_NAME } from "@/lib/identity";
import { absolute, blogPostPath, productPath } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export function GET() {
  const items = [
    ...blogPosts.map((post) => ({
      title: post.title,
      description: post.description,
      url: absolute(blogPostPath(post.slug)),
      date: post.date,
    })),
    ...caseStudies.map((study) => ({
      title: study.title,
      description: study.description,
      url: absolute(productPath(study.slug)),
      date: "2026-10-01",
    })),
  ];

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${PERSON_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${PERSON_NAME} — ${PERSON_HEADLINE}</description>
    ${items
      .map(
        (item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <guid>${item.url}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`,
      )
      .join("\n    ")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
