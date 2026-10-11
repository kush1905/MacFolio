import { expect, test } from "@playwright/test";

const PROJECTS = ["potato-bazaar", "tybee-go", "nexus", "resumind", "codemace", "findanio", "scalelr", "macfolio"];

test.describe("homepage", () => {
  test("serves semantic, crawlable content and metadata", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Kush Gangwal — Full Stack & React Native Developer");
    await expect(page.locator("h1")).toHaveText("Kush Gangwal");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByText("I build products that ship.")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://kushgangwal.site");
    for (const slug of PROJECTS) {
      await expect(page.locator(`main a[href="/projects/${slug}"]`).first()).toBeAttached();
    }
    const types = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
      nodes.flatMap((n) => (JSON.parse(n.textContent ?? "{}")["@graph"] ?? []).map((g: { "@type": string }) => g["@type"])),
    );
    expect(types).toEqual(expect.arrayContaining(["Person", "WebSite", "WebPage", "ItemList"]));
    expect(types).not.toContain("FAQPage");
  });

  test("important text is in the server HTML, not only the canvas", async ({ request }) => {
    const html = await (await request.get("/")).text();
    for (const text of ["Kush Gangwal", "I build products that ship.", "Potato Bazaar", "Protonshub Technologies", "Let&#x27;s build something."]) {
      expect(html).toContain(text);
    }
    expect(html).not.toMatch(/\$\{SITE_URL\}|founding engineer|Bikaner/i);
  });

  test("has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto("/");
    await page.waitForTimeout(2500);
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    expect(errors).toEqual([]);
  });

  test("never scrolls horizontally", async ({ page }) => {
    for (const width of [1440, 1280, 1024, 768, 430, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
    }
  });

  test("reduced motion keeps all content and skips WebGL", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator(".universe")).toHaveAttribute("data-mode", "static", { timeout: 5000 });
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Selected work" })).toBeAttached();
    await context.close();
  });

  test("static fallback works without WebGL", async ({ page }) => {
    await page.goto("/?static");
    await expect(page.locator(".universe")).toHaveAttribute("data-mode", "static", { timeout: 5000 });
    await page.getByRole("link", { name: "See the work" }).click();
    await expect(page.locator("#work")).toBeInViewport();
  });

  test("project links keep browser history working", async ({ page }) => {
    await page.goto("/?static");
    await page.locator('main a[href="/projects/potato-bazaar"]').first().click();
    await expect(page).toHaveURL(/\/projects\/potato-bazaar$/);
    await expect(page.locator("h1")).toContainText("Potato Bazaar");
    await page.goBack();
    await expect(page).toHaveURL(/\/\?static$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/projects\/potato-bazaar$/);
  });

  test("hovering a project row opens its preview card", async ({ page, isMobile }) => {
    test.skip(isMobile, "previews need a hover-capable pointer");
    await page.goto("/?static");
    const rows = page.locator(".project-list > li");
    for (const index of [0, 3]) {
      const name = (await rows.nth(index).locator("strong").textContent())!;
      await rows.nth(index).hover();
      await expect(page.locator(".project-preview-name")).toHaveText(name);
    }
    // The card stays open while the pointer moves into it.
    const card = page.locator(".project-preview");
    const box = (await card.boundingBox())!;
    await page.mouse.move(box.x + 30, box.y + box.height - 30, { steps: 10 });
    await expect(card).toBeVisible();
  });

  test("project deep links resolve", async ({ page }) => {
    for (const slug of PROJECTS) {
      const response = await page.goto(`/projects/${slug}`);
      expect(response?.status(), slug).toBe(200);
    }
  });
});

test.describe("Ask Kush palette", () => {
  test("opens with Cmd/Ctrl+K, searches locally, and closes with Escape", async ({ page }) => {
    await page.goto("/?static");
    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: "Ask Kush" });
    await expect(dialog).toBeVisible();
    await page.keyboard.type("nexus");
    await expect(dialog.getByRole("option", { name: /Nexus/ }).first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("Enter on a result navigates", async ({ page }) => {
    await page.goto("/?static");
    await page.keyboard.press("ControlOrMeta+k");
    await page.keyboard.type("codemace");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects\/codemace$/);
  });

  test("answers questions and links to projects (stubbed API)", async ({ page }) => {
    await page.route("**/api/assistant", (route) =>
      route.fulfill({
        json: {
          text: "**Potato Bazaar** is an agricultural marketplace.",
          links: [{ label: "Potato Bazaar", href: "/projects/potato-bazaar" }],
          source: "local",
        },
      }),
    );
    await page.goto("/?static");
    await page.getByRole("button", { name: "Tell me about Potato Bazaar." }).click();
    const dialog = page.getByRole("dialog", { name: "Ask Kush" });
    await expect(dialog.getByText("is an agricultural marketplace.")).toBeVisible();
    await expect(dialog.getByRole("link", { name: /Potato Bazaar/ })).toHaveAttribute("href", "/projects/potato-bazaar");
  });

  test("is available on public pages", async ({ page }) => {
    await page.goto("/about-kush-gangwal");
    await page.getByRole("button", { name: /Ask/ }).click();
    await expect(page.getByRole("dialog", { name: "Ask Kush" })).toBeVisible();
  });
});

test.describe("contact form", () => {
  test("shows MESSAGE RECEIVED only after a successful request", async ({ page }) => {
    await page.route("**/api/messages", (route) => route.fulfill({ status: 201, json: { delivered: true, stored: false } }));
    await page.goto("/?static");
    await page.getByLabel("Name").fill("Recruiter");
    await page.getByLabel("Email").fill("recruiter@example.com");
    await page.getByLabel("Message").fill("Hello Kush, let us talk about a role.");
    await page.getByRole("button", { name: "Send transmission" }).click();
    await expect(page.getByText("Message received")).toBeVisible();
  });

  test("reports failure honestly with an email fallback", async ({ page }) => {
    await page.route("**/api/messages", (route) => route.fulfill({ status: 503, json: { error: "delivery_unavailable" } }));
    await page.goto("/?static");
    await page.getByLabel("Name").fill("Recruiter");
    await page.getByLabel("Email").fill("recruiter@example.com");
    await page.getByLabel("Message").fill("Hello Kush, let us talk about a role.");
    await page.getByRole("button", { name: "Send transmission" }).click();
    await expect(page.locator(".contact-error")).toContainText("Please email instead");
    await expect(page.getByText("Message received")).toHaveCount(0);
  });

  test("validates required fields before sending", async ({ page }) => {
    let called = false;
    await page.route("**/api/messages", (route) => {
      called = true;
      return route.fulfill({ status: 201, json: {} });
    });
    await page.goto("/?static");
    await page.getByRole("button", { name: "Send transmission" }).click();
    expect(called).toBe(false);
  });
});
