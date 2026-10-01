import type { MetadataRoute } from "next";
import { sitemapEntries } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries().map((url) => ({
    url,
    lastModified: new Date("2026-10-01"),
    changeFrequency: "monthly",
    priority: url === SITE_URL ? 1 : 0.8,
  }));
}
