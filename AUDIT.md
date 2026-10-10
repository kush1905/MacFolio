# AUDIT — kushgangwal.site (Macfolio repo)

Audit date: 2026-10-10 · Commit audited: `301281b` · Branch: `main` (clean)

Sources:
- the repository (read in full where noted)
- a local `next build` (it passed)
- an HTTP crawl of the live site (server HTML only, no headless browser)
- `public/resume.pdf`, with its text extracted

Not inspected:
- Google Search Console (no access)
- client-rendered output and Core Web Vitals (no Playwright or Lighthouse available locally)
- the Vercel dashboard and environment variables

---

## 1. Current architecture

| Area | Finding |
|---|---|
| Framework | Next.js **16.3.0** (Turbopack), React **19.2.8**, TypeScript 5, App Router |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) plus one large `src/app/globals.css` (1,876 lines). The public pages use hand-written `.public-*` classes. |
| UI state / motion | Zustand 5 with immer, used by the desktop OS. `framer-motion` 13 is used by the desktop. `react-rnd` handles window dragging. |
| Data | Canonical-ish JSON lives in `content/*.json` (about, experience, projects, skills, now, stats, photos, github_repos) and in `content/kushgpt/*` (the assistant persona). Postgres (`pg`) stores settings, messages and analytics, and falls back to localStorage when `DATABASE_URL` is missing. |
| AI | `/api/assistant` calls **Google Gemini** over REST (`GEMINI_API_KEY`) and walks a list of fallback models. It has a local rule-based fallback (`localAssistantReply` in `src/lib/assistant/context.ts`). It has **no rate limiting**. |
| Contact | `/api/messages` POST writes to Postgres. It sends **no email**. If the DB is down it returns `source: "local"`, so the client cannot tell that the message was never delivered. The GET handler lists messages by a client-supplied visitor header. |
| Other APIs | `/api/analytics`, `/api/settings`, `/api/portfolio`, `/api/health`, `/api/github/contributions`. `/api/indexnow` is an **unauthenticated GET that submits 100 URLs to IndexNow**, so anyone can trigger it. |
| Text routes | `/llms.txt`, `/ai.txt`, `/humans.txt`, `/feed.xml`, `/data/entities.json` |
| 3D | **None.** There is no three, R3F, GSAP or Lenis. |
| Analytics | A custom `/api/analytics` endpoint backed by Postgres. PostHog is not installed. |
| Hosting | Vercel project `macfolio`. Git remote is `github.com/kush1905/MacFolio`. |

### Root layout coupling
`src/app/layout.tsx` wraps **every** page in the desktop gate:
- `DESKTOP_BOOT_SCRIPT` sets `data-display-mode` and rewrites the viewport meta.
- `DesktopGateHost`/`DesktopGate` show the lock screen.
- `DesktopCanvas` sets `inert` on the page.
- It also preloads `/assets/macos/wallpapers/space-black.jpg` on every page.

These checks key off `pathname === "/desktop"`, so public pages are functionally unaffected. The wallpaper preload, however, is wasted bandwidth on every public page. The desktop-only code should move into a `/desktop` layout.

### Routes (from `next build`: 249 static pages)
| Group | Count | Notes |
|---|---|---|
| `/` | 1 | **Permanent redirect (308) to `/about-kush-gangwal`**. It is set in both `next.config.mjs` and `src/app/page.tsx`. |
| `/about-kush-gangwal` | 1 | The entity page (`Person @id = /about-kush-gangwal#person`) |
| Hub pages | 15 | /projects, /blog, /now, /faq, /accounts, /topics, /stack, /resume, /mentions, /site-map, /spellings, /agritech, /entities, /knowledge-base, /profile (308 to the about page) |
| `/projects/[slug]` | 8 | macfolio, potato-bazaar, tybee-go, findanio, nexus, resumind, codemace, scalelr |
| `/blog/[slug]` | 62 | Generated from `blogPosts.ts`, `blogCluster.ts` and `agriBlog.ts` |
| `/stack/[slug]` | 25 | Technology pages that map each tech to its projects (`techPages.ts`) |
| `/[slug]` (root level) | 96 | Keyword-variant, question, location and **misspelling** pages, from `entityPages.ts`, `footprint.ts`, `agriGraph.ts` and `spellings.ts` |
| `/work/[slug]` | 4 | Employers, from `experience.json` |
| `/companies/[slug]` | 3 | The agri entity graph. Overlaps with `/work/*`. |
| `/industries/[slug]` | 6 | Agri industry pages |
| `/people/[slug]` | 5 | Colleague pages |
| `/education/[slug]` | 1 | Medicaps University |
| `/desktop` | 1 | The macOS OS experience, `noindex, follow` |

---

## 2. What works and is worth keeping

- **The public page architecture is semantic and server-rendered.** Pages have one H1, a breadcrumb and a self-canonical, and they work without JavaScript. Every live sitemap URL except `/` returns 200.
- **Centralized metadata.** `publicMeta()` builds the canonical, OG and Twitter tags from one place. `SITE_URL` is a single constant (`https://kushgangwal.site`).
- **A Person entity graph with a stable `@id`.** `personNode()` in `src/lib/seo.ts` is reused across pages, and the `sameAs`, `alumniOf` and `worksFor` structure is sound.
- **Project case studies** (`caseStudies.ts`) with real product facts. They are the base for the new case-study pages.
- **The `techPages.ts` evidence map** (technology → projects → proof). It is exactly the data the "Engineering Core" scene needs, so it should be reused and not re-invented.
- **The local assistant fallback** and the persona data in `content/kushgpt`, both reusable for "Ask Kush".
- **Assets:**
  - project covers: `public/assets/projects/*` (Potato Bazaar, Tybee Go, Findanio, Macfolio and Nexus JPGs; Resumind and CodeMace are tiny placeholder SVGs; Scalelr has none)
  - portraits and logos: `public/assets/kush/*`
  - `public/resume.pdf`
- **The `/desktop` Macfolio experience.** It is a legitimate project in its own right. Keep it at `/desktop`; it is also the `/projects/macfolio` case study.

## 3. Design and UX issues

1. **There is no homepage.** A visitor to `kushgangwal.site` is bounced to a text-heavy profile page. The portfolio's strongest asset, its visual identity, lives on a noindexed route.
2. **The public pages look like documentation.** Every page uses the same article template, and the card grids and prose have no hierarchy between the flagship product and minor pages.
3. **Internal SEO notes are visible to visitors.** These are real defects that people can see:
   - `/projects` subtitle: "Long-form pages so search engines can rank each product independently."
   - `/about-kush-gangwal`: "Independent case studies exist so Google can rank Potato Bazaar…"
   - `/faq`: "Short factual answers for search and answer engines."
   - `/accounts`: "Inconsistent names weaken entity recognition… the official sameAs set."
   - `/people/*`: "This page exists so search engines can connect…"
   - `caseStudies.ts`, for example: "Why it ranks with Kush Gangwal React Native Developer", "Searches for … should resolve here", "Search engines can read this case study"
   - `entityPages.ts`, `footprint.ts`, `agriGraph.ts`, `spellings.ts`, `agriBlog.ts` and `blogCluster.ts` contain about 25 similar phrases ("This page exists for the search phrase itself", "Long-tail" kickers, "Why this query matches him").
4. **An unresolved template variable is live.** `src/lib/seo.ts:352` uses a plain double-quoted string, so `/faq` and its FAQPage JSON-LD show the literal text **`${SITE_URL}`**.
5. **The footer exposes the SEO machinery** with links to "Spellings", "Entities" and "llms.txt" in the primary chrome.
6. **`/desktop` has two H1s and no og:image.**
7. **Fonts:** the site ships Apple's SF Pro `.otf` files from `public/fonts/sf-pro`. Apple's license does not permit web embedding on non-Apple sites. This is a **licensing risk**, independent of the redesign.

## 4. Content accuracy: discrepancies that need your decision

I have not resolved any of these by guessing. Each one needs you to confirm the fact.

| # | Issue | Sources |
|---|---|---|
| C1 | **Protonshub dates:** the site says **Jan–May 2026** everywhere. `resume.pdf` says **Jan–May 2025**. | `experience.json:61`, `seo.ts:69`, the resume |
| C2 | **Django Softwares is missing from the resume**, but `footprint.ts:149` says the resume lists it. The legal name is also unclear: "Django Softwares" on the site, "Django Software Pvt. Ltd." in your brief. | `experience.json:87`, `footprint.ts:149` |
| C3 | **"Founding engineer of Potato Bazaar"** appears 103 times across 12 files. The site's own facts say Potato Bazaar was founded in **2024** and already has a named CTO, while your engineering record starts **Feb 2026** and your title is **Junior Software Developer** (June 2026 onward). The claim is also stated as "the product he owns end to end" (`caseStudies.ts:188`) and as "built Potato Bazaar" (`agriGraph.ts:512`). This is the single largest credibility risk on the site. | `seo.ts:104-118`, `caseStudies.ts:166-214`, `agriGraph.ts:350` |
| C4 | **"Founding engineer of Findanio"** is attached to SK Agri Exports in `seo.ts:114`. Everywhere else, Findanio is internship work at Protonshub. | `seo.ts:114`, `footprint.ts:182,495,501` |
| C5 | **Feb–May 2026 overlap:** Potato Bazaar work starts in Feb 2026, but SK Groups employment starts in June 2026, during the Protonshub internship. Nothing explains which employer that work was for. | `projects.json:23` |
| C6 | **Tybee Go is "Jan 2026 – Present"** but credited as Protonshub internship work, and that internship ended in May 2026. `experience.json:25` says "Leading product work on Tybee Go". | `projects.json`, `experience.json` |
| C7 | **"Bakaner, also spelled Bikaner":** these appear to be different places. Bakaner is in Dhar district, Madhya Pradesh; Bikaner is a city in Rajasthan. The Person schema (`homeLocation.alternateName`), FAQs, a `/kush-gangwal-bikaner` page and llms.txt merge them. Please confirm where you grew up. | `about.json:12`, `seo.ts:335,440,506` |
| C8 | **`sameAs` includes `potatobazaar.com`** (from `about.links.portfolio`). That presents the company's website as your personal profile. | `identity.ts:47` |
| C9 | **Two LinkedIn and two GitHub accounts** (`kush-gangwal` and `kush-gangwal-96ab38263`; `kush1905` and `Kush-PB`). Confirm which ones are active and belong to you. | `identity.ts` |
| C10 | **Two company records for one company:** `/work/sk-agri-exports-private-ltd` and `/companies/sk-agri-exports-private-limited` both exist. "SK Groups" and "SK Group" are both used. | `seo.ts`, `agriGraph.ts` |
| C11 | **Unverified figures:** `stats.json` has `commitsThisYear: 1200`, and `projectsCompleted: 5` while 8 projects are listed. Third-party company metrics ("10K+ users", "₹50Cr+") sit next to your name. | `stats.json`, `agriGraph.ts:332,607` |
| C12 | **AI stated as expertise vs learning:** `about.json` says "specializing in … AI-powered applications". Resumind's LLM pipeline has no public repo. Scalelr's "AI-driven matching" is credited to a 6-week internship. `now.json` correctly lists Agentic AI as a learning interest. | `about.json:18`, `caseStudies.ts:102,333` |
| C13 | **Education tense:** most sources say you graduated in May 2026. `assistant/context.ts:318` still says "is pursuing". | |
| C14 | **Factually wrong routing claims in content:** `entityPages.ts:93`, `footprint.ts:246` and `blogCluster.ts:146` say "the home route is an interactive macOS desktop". It is a redirect. | |
| C15 | **The resume Play Store link is malformed** (`play.google.com/potatobazaar/`). | `resume.pdf` |
| C16 | **The Person schema publishes a phone number** (`telephone: +91-…`) on every page. Is that intentional? | `seo.ts:487` |

## 5. Technical debt

- **Duplicated facts.** Roughly 10 TypeScript files restate the same facts as hand-written prose instead of reading them from `content/`:
  - "June 2026" is hard-coded 15 times in 7 files.
  - "7.96" appears 21 times in 13 files.
  - "Bakaner" appears 57 times in 16 files.
  - `seo.ts:141` overrides `projects.json` descriptions with the `caseStudies.ts` ones.
  - Fixing one fact means editing 6–16 files.
- **Generated pages at scale.** `entityPages.ts`, `footprint.ts` (847 lines), `agriGraph.ts` (611), `blogCluster.ts` (662) and `spellings.ts` produce about 160 near-template pages.
- **`src/lib/seo.ts` (987 lines)** mixes data, copy, schema builders, sitemap and llms.txt.
- **Leftover scaffolding:** `next.svg`, `vercel.svg`, `globe.svg`, `file.svg` and `window.svg` remain in `public/`. `README.md` still says "Edit placeholder JSON".
- **The root `/` redirect is duplicated** in `next.config.mjs` and `page.tsx`.
- **The assistant** has no rate limiting, no cap on message length (history is trimmed to the last 12 turns but each turn is unbounded), and Gemini model IDs hard-coded as fallbacks.
- **The messages API** has no rate limiting, no honeypot and no email delivery. Its GET handler returns messages filtered only by a client-supplied header.
- **The IndexNow GET** is a public trigger.
- **There are no tests**, no Playwright and no Lighthouse CI.

## 6. Performance risks (current site and the redesign)

Current site, measured from the live HTML:
- `/about-kush-gangwal` is 61.7 KB of HTML (11.6 KB gzip) with about 577 KB of uncompressed external JS. TTFB is 0.29–0.51 s.
- That JS is heavy for a text page because the root layout ships the desktop gate client components everywhere.
- Every public page preloads a 15 MB-folder wallpaper image.

Risks for the redesign:
- WebGL on low-end Android
- the three.js bundle (about 150 KB gzip for three, R3F and drei)
- an LCP regression if the hero waits on the canvas
- scroll jank from scroll-hijacking
- GPU memory from large textures

Section 6 of `PLAN.md` sets a budget for each of these.

## 7. Proposed migration strategy (summary; detail in `PLAN.md`)

1. **Fix the defects first, without a redesign.** This is low-risk and can ship independently:
   - the `${SITE_URL}` leak
   - the visible SEO notes
   - the sitemap listing a redirect
   - moving the desktop-only layout code into `/desktop`
   - removing the wallpaper preload from public pages
   - the www TLS fix in Vercel, which you need to do
2. **Settle the facts in C1–C16 with you.** Then make `content/*.json` the single source of truth for every fact the redesign touches.
3. **Build the new `/` as a server-rendered semantic page.** The 3D canvas is a progressive enhancement layered on top of it. Then remove the `/` → `/about-kush-gangwal` redirect.
4. **Redesign the case-study template** at the same URLs.
5. **Keep every other URL.** Decide separately, with you, what happens to the doorway-risk pages (see `SEO_BASELINE.md` §8).
