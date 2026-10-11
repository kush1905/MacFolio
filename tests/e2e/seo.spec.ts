import { expect, test } from "@playwright/test";

test.describe("search infrastructure", () => {
  test("root no longer redirects; old Bikaner URL does", async ({ request }) => {
    const home = await request.get("/", { maxRedirects: 0 });
    expect(home.status()).toBe(200);
    const bikaner = await request.get("/kush-gangwal-bikaner", { maxRedirects: 0 });
    expect(bikaner.status()).toBe(308);
    expect(bikaner.headers().location).toBe("/kush-gangwal-bakaner");
  });

  test("sitemap lists the homepage and no redirecting URLs", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("<loc>https://kushgangwal.site</loc>");
    expect(xml).not.toContain("kush-gangwal-bikaner");
    expect(xml).not.toContain("/desktop<");
  });

  test("robots allows crawling", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Sitemap: https://kushgangwal.site/sitemap.xml");
  });

  test("about page stays the Person entity page", async ({ page }) => {
    await page.goto("/about-kush-gangwal");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://kushgangwal.site/about-kush-gangwal");
    const types = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
      nodes.flatMap((n) => (JSON.parse(n.textContent ?? "{}")["@graph"] ?? []).map((g: { "@type": string }) => g["@type"])),
    );
    expect(types).toEqual(expect.arrayContaining(["Person", "ProfilePage"]));
  });

  test("desktop stays noindex", async ({ page }) => {
    await page.goto("/desktop");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("sitemap lastmod is a stable content date, not the build time", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const dates = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1].slice(0, 10));
    expect(dates.length).toBeGreaterThan(200);
    expect(new Set(dates).size).toBeLessThan(dates.length / 4);
    const today = new Date().toISOString().slice(0, 10);
    expect(dates.every((d) => d <= today)).toBe(true);
  });

  test("IndexNow trigger is not public", async ({ request }) => {
    const res = await request.get("/api/indexnow");
    expect([401, 404]).toContain(res.status());
  });

  test("homepage shares the branded preview image", async ({ page, request }) => {
    await page.goto("/?static");
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toContain("/og/home.png");
    const image = await request.get("/og/home.png");
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
  });
});
