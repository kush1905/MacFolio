# SEO Regression Report: Product Universe launch

Run on 2026-10-10.

- **Baseline:** the live site, https://kushgangwal.site at commit `301281b`.
- **Candidate:** a local production build (`next build && next start`) of the uncommitted working tree.
- **Tool:** `npm run seo:check -- --base https://kushgangwal.site --candidate http://localhost:3100`, implemented in [scripts/seo-check.mjs](scripts/seo-check.mjs).
- **Method:** crawls every URL in both sitemaps (227 + 226, union 227) and compares status, title, meta description, canonical, robots, H1 count and JSON-LD `@type`s.

**Verified** below means measured by this script, by `npm run test:e2e` (40/40 passing), or by Lighthouse 12.8.2 against the local build.

**Not verified** means a recommendation or expectation. No Search Console data was available, so nothing here claims anything about indexing, rankings or traffic.

---

## 1. Routes

| | Verified result |
|---|---|
| URLs in baseline sitemap | 227 |
| URLs in candidate sitemap | 226 |
| Baseline URLs dropped | **1**: `/kush-gangwal-bikaner` (intentional, see §2) |
| URLs added to the sitemap | 0 |
| Status changes | `/`: 308 → **200**; `/kush-gangwal-bikaner`: 200 → **308** to `/kush-gangwal-bakaner` |
| Other indexable URLs | All 224 still return 200 with a self-referencing canonical on `https://kushgangwal.site` |
| Non-200 URLs in the candidate sitemap | 0. The baseline listed `/`, which redirected; it is now a real page. |
| Noindex URLs in the sitemap | 0. `/desktop` stays `noindex, follow` and is still excluded. |
| Canonicals pointing at a non-canonical host | 0 |

## 2. Intentional URL changes

| URL | Change | Reason |
|---|---|---|
| `/` | Was a 308 to `/about-kush-gangwal`; now the 3D portfolio homepage (200, canonical `https://kushgangwal.site`) | Approved by Kush (D2). `/about-kush-gangwal` keeps its role as the Person entity page and the only `ProfilePage`. |
| `/kush-gangwal-bikaner` | Now a 308 to `/kush-gangwal-bakaner` | Kush grew up in Bakaner (Dhar district, Madhya Pradesh), not Bikaner (Rajasthan). The page asserted a false equivalence. |
| Legacy hosts (`*.vercel.app`, `www`) | The root now redirects to `https://kushgangwal.site/` instead of `/about-kush-gangwal` | Follows the new homepage |

**Note on `/`:** browsers cache permanent redirects. Returning visitors may land on `/about-kush-gangwal` until their cache clears. That is harmless, because the page still exists. Google re-crawls and should treat `/` as a page; whether and when it does is not verified.

## 3. Titles and descriptions

- **Titles changed: 5, all intended:**
  - `/` (new page)
  - `/kush-gangwal-bikaner` (now a redirect)
  - Three blog posts retitled so they no longer share a title with their case study:
    - `/blog/how-i-built-nexus-skill-swap-platform`
    - `/blog/building-resumind-ai-resume-analyzer`
    - `/blog/scaling-potato-bazaar-mobile-application`

  Their slugs are unchanged.
- **Duplicate titles:** 3 pairs at baseline → **0** now.
- **Duplicate meta descriptions:** 1 pair at baseline (`/kush-gangwal-protonshub` vs `/protonshub-technologies-intern`) → **0** now.
- **Descriptions changed: 87.** These come from the factual corrections: "founding engineer" replaced with the confirmed developer role, Bikaner removed, and Findanio re-attributed to the Protonshub internship. The page subjects, URLs and primary phrases (Kush Gangwal, Potato Bazaar, React Native, and so on) are unchanged.
- **Missing titles or descriptions on HTML pages:** 0.

## 4. Structured data

| Page | Change (verified) |
|---|---|
| `/` | Now has Person + WebSite + WebPage + ItemList (8 projects). No FAQPage (FAQ rich results are restricted to gov/health sites) and no ProfilePage, so it doesn't compete with the about page. |
| `/kush-gangwal-bikaner` | Article, BreadcrumbList and Person removed (the page is now a redirect) |
| Every other page | **No `@type` removed** |

Content changes inside the Person node, made by hand and checked by e2e tests:
- `alternateName`: keyword phrases and misspellings removed. The misspellings stay visible on `/spellings`.
- `knowsAbout`: only skills and domains (no place names, no "Kush Gangwal X" phrases, and no Agentic AI or GenAI, which are learning interests).
- `homeLocation`: Bakaner, Dhar district, Madhya Pradesh.
- `worksFor`: SK Groups only. SK Agri Exports moved to `affiliation`.
- `sameAs`: `potatobazaar.com` removed. It is a company site, not a profile; it stays as a visible link on the Potato Bazaar case study.
- `SoftwareApplication`: `contributor` replaces `author`/`creator` for Potato Bazaar, Tybee Go, Findanio and Scalelr.

Invalid JSON-LD blocks: 0.

## 5. Robots, sitemap and text endpoints

- **robots.txt:** unchanged. It allows `/`, disallows `/api/`, explicitly allows the AI crawlers, and points to the sitemap. Verified by e2e test.
- **sitemap.xml:** includes `https://kushgangwal.site` as a real 200 page and excludes the Bikaner redirect. Verified by e2e test.
- **llms.txt:** the "Search phrases this site is the source for" block and the "for answer engines" preamble are removed. All 8 projects are listed (it was 5), and the Potato Bazaar role is corrected. This was checked by reading the output; no automated test covers it.

## 6. Content and keyword clusters

Every cluster in `SEO_BASELINE.md` §6 still has its landing URLs: brand/name, role + name, profiles, education, location, employers, Potato Bazaar/agritech, projects, technology, and misspellings. The only exception is the Bikaner page, which now redirects to the Bakaner page.

Visible internal SEO notes such as "search engines can rank", "This page exists so…", "Long-tail" and "Why it ranks…" are removed from every rendered page.

The regression script finds no leaks on any of the 227 URLs for:
- `${SITE_URL}`
- "search engines can rank"
- "founding engineer"
- "Bikaner"

## 7. Internal links

- **Homepage:** links to all 8 case studies, about, resume, `/now`, `/stack/*` (via the tech panel), `/work/*`, `/education/medicaps-university`, `/projects`, `/blog`, `/faq`, `/topics`, `/site-map` and `/desktop`.
- **Public header:** gains Home and an "Ask ⌘K" button. The brand now links to `/`.
- **Public footer:** "Entities", "Spellings" and "llms.txt" were replaced with "How it connects" (`/entities`) and "Site map". `/spellings` and `/llms.txt` are now linked from `/site-map`, so neither is orphaned.
- **Desktop gate (phones on `/desktop`):** now links to the homepage.

## 8. Performance and accessibility (Lighthouse 12.8.2, local build)

| Page | Perf (mobile) | A11y | Best practices | SEO | LCP / TBT / CLS (mobile, simulated) |
|---|---|---|---|---|---|
| `/` | 94 (desktop preset: 100) | 96 → fixed\* | 100 | 100 | 3.0 s / 10 ms / 0 |
| `/projects/potato-bazaar` | 96 | 100 | 100 | 100 | 2.8 s / 0 ms / 0 |
| `/about-kush-gangwal` | 95 | 100 | 100 | 100 | 3.0 s / 0 ms / 0 |
| `/faq` | 94 | 100 | 100 | 100 | 3.0 s / 0 ms / 0 |

\* The homepage's one accessibility failure was low contrast on the faint text token. It has been fixed (`#74716b` → `#8f8b84`), but Lighthouse was not re-run after the fix.

Other measurements:
- **Homepage LCP observed without throttling:** 61 ms. The LCP element is the HTML hero paragraph, not the canvas.
- **Simulated mobile LCP of ~3 s on every page:** above the 2.5 s budget. Most of it is render-blocking CSS. `globals.css` still carries all of the macOS desktop styles; splitting those into `/desktop` is the next performance task.
- **First-load JS on `/`:** about 180 KB gzipped (budget 170 KB).
- **WebGL chunk:** 271 KB gzipped, loaded only on first interaction or after load plus idle (budget 260 KB). R3F imports all of three.js; this is a known limitation.
- **3D frame rate:** 61 fps in every chapter on an Apple M4 (headless Chrome, Metal), measured by script. It has **not** been measured on a real mid-range Android phone.

## 8b. Performance after the CSS split (2026-10-11, Lighthouse 12.8.2, mobile, local build)

The macOS desktop's CSS and Tailwind utilities now load only on `/desktop`. Public pages
went from ~23 KB to ~8 KB of gzipped CSS, inlined into the HTML (`experimental.inlineCss`).
Only the two above-the-fold font faces are preloaded.

| Page | Perf | FCP | LCP |
|---|---|---|---|
| `/` | 97 | 1.2 s | 2.6 s |
| `/about-kush-gangwal` | 97 | 0.9 s | 2.7 s |
| `/projects/potato-bazaar` | 95 | 0.9 s | 2.9 s |
| `/faq` | 97 | 0.9 s | 2.6 s |

Simulated LCP is still just over the 2.5 s budget. What remains is mostly font download on
simulated slow 4G; `font-display: optional` would close it but drop the brand fonts for
first-time visitors on slow connections, so it was not applied.

## 9. Known remaining problems (not fixed)

1. ~~**`www.kushgangwal.site` TLS failure**~~ **Fixed** by Kush in Vercel. Verified on 2026-10-10: `https://www.kushgangwal.site/` returns a 308 to the apex.
2. **Doorway-pattern risk.** About 28 misspelling pages and about 60 keyword-variant root pages are still indexable. They were kept on purpose (decision D3) until Search Console data shows which ones earn clicks.
3. **Duplicate company entities.** `/work/sk-groups` duplicates `/companies/sk-groups`, and `/work/sk-agri-exports-private-ltd` duplicates `/companies/sk-agri-exports-private-limited`. They have not been consolidated, which would need a redirect decision.
4. **`/people/*` colleague pages:** still indexable (decision D4 is open).
5. **`resume.pdf` (replaced with Kush's new version on 2026-10-10) still says Protonshub was Jan–May 2025**, and its Play Store link is still the malformed `play.google.com/potatobazaar/`. Kush confirmed 2026, so the PDF needs correcting at its source. The site itself says 2026 everywhere.
6. **Tybee Go is listed as "Jan 2026 – Present"**, although the Protonshub internship ended in May 2026. This is unconfirmed.
7. **Project imagery.** Potato Bazaar now has 3 real Android screenshots: on the case study, on the homepage flagship card, and textured onto the 3D phone. The other projects still use AI-generated concept art as covers, and their 3D forms use schematic interfaces until real screenshots arrive.
8. ~~Sitemap `lastmod` was the build time on every URL~~ **Fixed:** stable content dates from `CONTENT_UPDATED` in `src/lib/site.ts` (bump it when copy changes), newer post or `/now` dates where they apply.
9. ~~`/api/indexnow` was an unauthenticated GET trigger~~ **Fixed:** it requires `INDEXNOW_TRIGGER_TOKEN` (Bearer header or `?token=`) and returns 404 when the token isn't configured.

## 10. Not verified (needs Search Console)

None of the following can be claimed until there is post-launch data:
- indexing of `/`
- ranking for "Kush Gangwal" or any other query
- impressions, clicks and CTR

**Before deploying,** export the GSC Performance and Pages reports listed in `SEO_BASELINE.md` §10.

**After deploying:**
- request indexing of `/` in Search Console;
- re-run `npm run seo:check` against production;
- compare the GSC data at 2, 4 and 8 weeks.
