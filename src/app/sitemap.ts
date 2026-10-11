import type { MetadataRoute } from "next";
import { ABOUT_PATH, NOW_PATH } from "@/lib/identity";
import { blogPosts } from "@/lib/blogPosts";
import { content } from "@/lib/content";
import { sitemapEntries } from "@/lib/seo";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/site";

const latest = (...dates: string[]) => dates.sort().at(-1)!;

/** Real content dates: the post date or /now update when newer than the site-wide revision. */
function lastModified(path: string) {
  if (path === NOW_PATH) return latest(CONTENT_UPDATED, content.now.updated);
  const post = blogPosts.find((item) => path === `/blog/${item.slug}`);
  if (post) return latest(CONTENT_UPDATED, post.date);
  return CONTENT_UPDATED;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = SITE_URL.replace(/\/$/, "");
  return sitemapEntries().map((url) => {
    const normalized = url.replace(/\/$/, "");
    return {
      url: normalized,
      lastModified: lastModified(new URL(normalized).pathname.replace(/\/$/, "") || "/"),
      changeFrequency: url.includes("/now") ? "weekly" : "monthly",
      priority:
        normalized === origin
          ? 1
          : url.endsWith(ABOUT_PATH)
            ? 0.95
            : url.endsWith(NOW_PATH) || url.includes("/projects/")
              ? 0.9
              : 0.75,
    };
  });
}