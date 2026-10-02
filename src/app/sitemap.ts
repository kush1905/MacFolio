import type { MetadataRoute } from "next";
import { ABOUT_PATH, NOW_PATH } from "@/lib/identity";
import { sitemapEntries } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = SITE_URL.replace(/\/$/, "");
  return sitemapEntries().map((url) => {
    const normalized = url.replace(/\/$/, "");
    return {
      url: normalized,
      lastModified: new Date(),
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