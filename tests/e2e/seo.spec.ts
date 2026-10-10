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
});
