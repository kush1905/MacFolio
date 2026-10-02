import type { MetadataRoute } from "next";
import { ABOUT_PATH, NOW_PATH } from "@/lib/identity";
import { sitemapEntries } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries().map((url) => ({
    url,
    lastModified: new Date("2026-10-02"),
    changeFrequency: url.includes("/now") ? "weekly" : "monthly",
    priority:
      url === SITE_URL
        ? 1
        : url.endsWith(ABOUT_PATH)
          ? 0.95
          : url.endsWith(NOW_PATH) || url.includes("/projects/")
            ? 0.9
            : 0.75,
  }));
}
