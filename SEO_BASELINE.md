# SEO BASELINE — kushgangwal.site

Captured: 2026-10-10, from the live production site (server HTML via curl) and a local `next build` of commit `301281b`.

**No Search Console, Bing Webmaster or rank-tracking data was available.** This baseline therefore covers technical state only: URLs, metadata, schema and links. It contains no impressions, clicks, positions or index-coverage figures. §10 lists what you need to export so a real before/after comparison is possible.

---

## 1. Host and redirect behaviour

| Request | Result |
|---|---|
| `https://kushgangwal.site/` | **308 → `/about-kush-gangwal`** (permanent; set in `next.config.mjs` and `src/app/page.tsx`) |
| `http://kushgangwal.site/` | 308 → https, then 308 → `/about-kush-gangwal` (2 hops) |
| `https://kushgangwal.vercel.app/` | 308 → `/about-kush-gangwal` on the same host, then 308 → apex (2 hops) |
| `https://kushgangwal-macfolio.vercel.app/` | Same pattern as above |
| `https://www.kushgangwal.site/` | **Broken: TLS failure.** DNS points to Vercel, but the certificate does not cover `www`. `next.config.mjs` has a www redirect rule that never runs. |
| `/profile` | 308 → `/about-kush-gangwal` |
| Trailing slash | 308 → no trailing slash |
| Case | Case-sensitive. `/About-Kush-Gangwal` returns 404. |
| Unknown path | 404 |

Permanent redirects in `next.config.mjs`:
- `/`, `/who-is-kush-gangwal`, `/kush-gangwal` → `/about-kush-gangwal`
- `/portfolio` → `/kush-gangwal-portfolio`
- `/writing` → `/blog`
- `/for-ai`, `/llm-profile` → `/knowledge-base`
- `/sk-groups` → `/companies/sk-groups`
- `/sk-agri-exports`, `/sk-agri-exports-private-limited` → `/companies/sk-agri-exports-private-limited`
- `/mantra-agri-solutions` → `/companies/…`
- `/potato-trading`, `/cold-storage`, `/agri-marketplace`, `/agriculture-logistics`, `/farmer-marketplace`, `/agri-export-platform` → `/industries/…`
- the three legacy hosts → apex

## 2. Robots

- `User-agent: *` allows `/` and disallows `/api/`.
- GPTBot, OAI-SearchBot, ChatGPT-User, Google-Extended, PerplexityBot, ClaudeBot and Applebot-Extended are explicitly allowed.
- `Sitemap:` points to `https://kushgangwal.site/sitemap.xml`.
- It has a non-standard `Host:` line, which crawlers ignore and which does no harm.
- Meta robots on every page is `index, follow, max-image-preview:large, max-snippet:-1`. **Only `/desktop` is `noindex, follow`.**

## 3. Sitemap: 227 URLs, all `lastmod` = build time

| Group | Count |
|---|---|
| `/` (redirects; **the only non-200 sitemap entry**) | 1 |
| Top-level hubs and the about page | 15 |
| Root-level `/[slug]` pages | 96 |
| `/blog/*` | 62 |
| `/stack/*` | 25 |
| `/projects/*` | 8 |
| `/industries/*` | 6 |
| `/people/*` | 5 |
| `/work/*` | 4 |
| `/companies/*` | 3 |
| `/education/*` | 1 |
| `/data/entities.json` | 1 |

Not in the sitemap, which is correct: `/desktop` (noindex) and the redirect sources.

The full URL inventory is in Appendix A.

## 4. Titles, descriptions, canonicals: key pages

Every indexable page has a self-referencing canonical on `https://kushgangwal.site`, and `og:url` equals the canonical. No canonical points to a Vercel host. Every page except `/desktop` has exactly one H1.

| URL | Title | Desc. length | JSON-LD |
|---|---|---|---|
| /about-kush-gangwal | Kush Gangwal \| Full Stack Developer \| React Native Developer | 222 (long) | ProfilePage, Person, WebSite, BreadcrumbList, CollegeOrUniversity, Occupation |
| /projects | Projects by Kush Gangwal | 105 | CollectionPage, Person |
| /projects/potato-bazaar | Scaling Potato Bazaar Mobile Application \| Kush Gangwal | 126 | Article, SoftwareApplication, BreadcrumbList, Person |
| /projects/tybee-go | Building Tybee Go in React Native \| Kush Gangwal | 133 | same |
| /projects/findanio | Findanio Mobile and Web Apps \| Kush Gangwal | 125 | same |
| /projects/nexus | How I Built Nexus Skill Swap Platform \| Kush Gangwal | 146 | same |
| /projects/resumind | Building Resumind AI Resume Analyzer \| Kush Gangwal | 120 | same (SVG og:image) |
| /projects/codemace | How I Built CodeMace \| Kush Gangwal | 135 | same (SVG og:image) |
| /projects/scalelr | Scalelr at Django Softwares \| Kush Gangwal | 126 | same |
| /projects/macfolio | (case study) | — | same |
| /now | Now — Kush Gangwal | 164 | WebPage, BreadcrumbList, Person |
| /faq | Questions about Kush Gangwal | 139 | FAQPage (51 Q&As) |
| /topics | Topics · Kush Gangwal | 88 | **none** |
| /stack | Technology stack · Kush Gangwal | 119 | CollectionPage, Person |
| /blog | Writing by Kush Gangwal | 119 | Blog, Person |
| /kush-gangwal-portfolio | Kush Gangwal Portfolio | 120 | Article, BreadcrumbList, Person |
| /knowledge-base | Knowledge base — Kush Gangwal | 115 | Article |
| /entities | Entity graph — Kush Gangwal, Potato Bazaar, SK Agri Exports | 149 | Article, Organization, SoftwareApplication |
| /agritech | Agritech — Potato Bazaar and Kush Gangwal | 137 | Article |
| /resume | Resume — Kush Gangwal | 99 | Person |
| /site-map | Site map — Kush Gangwal | 84 | **none** |
| /spellings | Spellings of Kush Gangwal, Potato Bazaar, and SK Groups | 142 | Article |
| /accounts | Official profiles — Kush Gangwal | 146 | Person |
| /mentions | How to mention Kush Gangwal | 92 | Person |
| /desktop | Kush Gangwal \| … — Desktop | 259 | ProfilePage, WebSite, FAQPage, Organization, SoftwareApplication, Person · **noindex** · 2 H1s · no og:image |

The default OG image is `/assets/kush/avatar.png` everywhere except the case studies, which use their cover image. `src/app/opengraph-image.tsx` also exists.

## 5. Structured data in use

- **Person:** the single `@id` is `https://kushgangwal.site/about-kush-gangwal#person`, emitted on nearly every page. It includes:
  - `name`, `givenName`/`familyName`, `jobTitle[]` and `hasOccupation[]`
  - `description`, `email`, **`telephone`**, `url` and `image`
  - `address` (Ahmedabad), `homeLocation` (Bakaner, with alternateName Bikaner)
  - `worksFor` (SK Groups, SK Agri Exports), `colleague[5]`, `alumniOf` (Medicaps) and `affiliation[]`
  - `knowsAbout[]`, `sameAs[]` and `identifier[]`
- **WebSite** (`/#website`), **ProfilePage**, **BreadcrumbList** (2 levels), **Article** (case studies, blog and entity pages), **SoftwareApplication** (each project), **Organization** (each company), **CollegeOrUniversity**, **FAQPage**, **CollectionPage**, **Blog** and **WebPage**.

Schema concerns, to evaluate rather than change blindly:
1. **Person.`alternateName` contains keyword phrases and misspellings**, for example "Kush Gangwal Portfolio" and "Kush Gangawal". **`knowsAbout` contains place names and phrases** such as "Bakaner" and "Kush Gangwal Protonshub". Google's guidelines expect these properties to describe the entity, not list search queries. They are low-value at best and could be read as manipulative.
2. **`sameAs` includes `potatobazaar.com`**, which is a company site, not a profile of the person. See AUDIT C8.
3. **`worksFor` points to `/work/sk-agri-exports-private-ltd#org`, while the redirects use `/companies/sk-agri-exports-private-limited`.** That gives two Organization `@id`s for one company.
4. **`SoftwareApplication` has `author`/`creator` = Kush on every project**, including the products he contributed to rather than created (Potato Bazaar, Tybee Go, Scalelr). `contributor` is the accurate property for those.
5. **FAQPage markup on `/faq` and `/desktop` will not produce rich results.** Google restricts FAQ rich results to authoritative government and health sites. The markup does no harm, but it does not help.
6. **All Article `datePublished` values are hard-coded to `2026-10-01`.**

## 6. Keyword and topic clusters (as currently targeted)

| Cluster | Main landing URLs |
|---|---|
| **Name / brand**: Kush Gangwal, portfolio, developer, software engineer, resume, contact, work, experience, projects | /about-kush-gangwal, /kush-gangwal-portfolio, /kush-gangwal-developer, /kush-gangwal-software-engineer, /kush-gangwal-resume, /resume, /kush-gangwal-contact, /kush-gangwal-work, /kush-gangwal-experience, /kush-gangwal-projects, /what-is-kush-gangwal-known-for |
| **Role + name**: full stack, React Native, React, Next.js, Node.js, TypeScript, JavaScript, Java, Spring Boot, frontend, backend, web, mobile app, product engineer, AI application, GenAI, agentic AI | /kush-gangwal-{role}-developer (17 pages), /react-native-developer-from-india, /react-native-developer-with-ai-experience, /full-stack-developer-from-indore |
| **Profiles**: GitHub, LinkedIn, LeetCode | /kush-gangwal-github, -linkedin, -leetcode, /accounts |
| **Education**: Medicaps University | /education/medicaps-university, /kush-gangwal-medicaps-university, /medicaps-university-alumni, /medicaps-university-developer, plus misspellings |
| **Location (GEO)**: Bakaner, Bikaner, Indore, Ahmedabad, India | /kush-gangwal-bakaner, -bikaner, -indore, -ahmedabad, -india |
| **Employers**: SK Groups, SK Agri Exports, Protonshub, Django Softwares | /work/*, /companies/*, /sk-groups-developer, /sk-agri-exports-developer, /kush-gangwal-protonshub, /protonshub-technologies-intern, /django-softwares-internship |
| **Potato Bazaar and agritech**: Potato Bazaar, app, platform, marketplace, India, AI Crop Doctor, cold storage, potato trading, agri marketplace, logistics, Mantra Agri Solutions | /projects/potato-bazaar, /what-is-potato-bazaar, /who-built-potato-bazaar, /potato-bazaar-*, /cold-storage-management-software, /potato-trading-platform-india, /industries/*, /companies/mantra-agri-solutions, /agritech, /entities, about 15 blog posts |
| **Projects**: Tybee Go, Nexus, Resumind, CodeMace, Findanio, Scalelr, Macfolio | /projects/*, /tybee-go-app, /nexus-react-project, /nexus-nodejs-project, /engineer-behind-nexus, /resumind-ai, /resumind-ats-resume-checker, /developer-who-built-resumind, /codemace-code-review-tool, /macfolio-portfolio |
| **Technology**: React Native, React, Next.js, Node, Express, TypeScript, MongoDB, PostgreSQL, SQLite, Auth0, PostHog, Mixpanel, OpenAI API, Play Store / iOS release | /stack/* (25), plus how-to and explainer blog posts |
| **Misspellings**: Kush Gangawal / Gangwall / Gangval / Gangol / Gangwaal, Koosh, Kaush, Kushh, Gangwal Kush, Potato Bazar / Bajjar, Resume Mind, Code Mace, Findaneo, Tybeego, Mac Folio, SK Group / skgroups, Proton Shub / Protonhub, Medi-caps / Medicap, Django Software | About 28 root-level pages plus /spellings |

## 7. Entity relationships (as asserted by the site)

- Kush Gangwal → **worksFor** SK Groups (Junior Software Developer, June 2026 – present, Ahmedabad)
- Kush Gangwal → **worksFor** SK Agri Exports Pvt Ltd ("Founding Engineer"; see AUDIT C3)
- Kush Gangwal → past intern at **Protonshub Technologies** (dates disputed, AUDIT C1) and **Django Softwares** (June–July 2025)
- Kush Gangwal → **alumniOf** Medicaps University, Indore (B.Tech CST, 2022–2026)
- Potato Bazaar → operated by SK Agri Exports Pvt Ltd → part of SK Groups. Mantra Agri Solutions is a related SK Group venture and is explicitly **not** his employer.
- Projects → companies: Tybee Go and Findanio → Protonshub · Scalelr → Django Softwares · Potato Bazaar → SK Groups / SK Agri Exports · Nexus, Resumind, CodeMace and Macfolio → personal projects
- Tech → projects: `src/lib/techPages.ts` (25 mappings)
- Colleagues: 5 named people with `/people/*` pages

## 8. Internal linking

- **Header (every public page):** About, Projects, Writing, Now, FAQ, Profiles, Topics, Stack, Desktop.
- **Footer:** official profiles (`rel="me"`), Now, Cite, Agritech, Entities, Spellings and llms.txt.
- **The about page** links to every `/work/*` and `/projects/*` page, education, profiles, /now, /faq and /desktop.
- **Case studies** link to 4 other case studies (the first 4 in array order, not related ones) and contain a WhoIs block.
- **`/topics` and `/site-map`** are hubs that link to all generated pages. These hubs are the only thing keeping the ~96 root-level pages from being orphans.
- Every root-level page links back to `/about-kush-gangwal` ("Canonical identity").

## 9. Duplicate content, risks and known issues

| # | Issue | Severity |
|---|---|---|
| S1 | The literal **`${SITE_URL}`** is visible on /faq and in the FAQPage JSON-LD on /faq and /desktop (`seo.ts:352`). | High (visible bug) |
| S2 | **Visible internal SEO notes** on /projects, /about-kush-gangwal, /faq, /accounts, /people/* and many generated pages (AUDIT §3). | High (credibility) |
| S3 | **About 28 misspelling pages and about 60 keyword-variant pages** are templated, indexable and self-canonical, and the misspelling pages are identical in size. They match Google's description of **doorway pages / scaled content** in its spam policies. The risk is site-level, not just per page. They also dilute crawl attention away from the pages that matter. | **High (strategic)** |
| S4 | **Near-duplicate pairs with identical titles:** /projects/potato-bazaar ↔ /blog/scaling-potato-bazaar-mobile-application, /projects/nexus ↔ /blog/how-i-built-nexus-skill-swap-platform, /projects/resumind ↔ /blog/building-resumind-ai-resume-analyzer. | Medium |
| S5 | Duplicate company entities: /work/sk-groups vs /companies/sk-groups, and /work/sk-agri-exports-private-ltd vs /companies/sk-agri-exports-private-limited. | Medium |
| S6 | The sitemap lists `/`, which is a 308. | Low |
| S7 | `www.kushgangwal.site` has a TLS failure. **You need to fix this in Vercel → Domains.** | Medium |
| S8 | Duplicate meta description: /kush-gangwal-protonshub and /protonshub-technologies-intern. | Low |
| S9 | Description lengths: about 290–312 characters on the misspelling and /work/* pages, under 60 on /people/* and some /stack pages. | Low |
| S10 | Uniform `lastmod` across the sitemap, so search engines tend to ignore it. | Low |
| S11 | No JSON-LD on /topics or /site-map. | Low |
| S12 | /people/* pages about third parties are thin and could be seen as targeting private individuals. Check whether those people consented to having pages. | Medium (ethical) |
| S13 | Factual inconsistencies (AUDIT §4, C1–C16) undermine the AEO and GEO goals: answer engines quote contradictions. | High |
| S14 | Feed has 70 items vs 62 blog URLs in the sitemap; not reconciled. | Low |

## 10. Search Console: not available. What to export before launch

Export the following from GSC → Performance (last 16 months and last 28 days) and save them as CSV in `/seo-data/` (gitignored), or share them with me:

- **Queries.** Separate them into branded (contains "kush" or "gangwal") and non-branded.
- **Pages.** In particular, check whether any root-level keyword or misspelling page has clicks. That decides how S3 should be handled.
- **Indexing → Pages.** Record which URLs are indexed and which are "Crawled – currently not indexed" or "Duplicate without user-selected canonical".
- **URL Inspection** for `/` and `/about-kush-gangwal`.
- **Bing Webmaster Tools:** the same exports, if the site is verified there.

Without this data, any claim that the redesign improved rankings would be unverifiable. The regression report will only claim what can be measured.

---

## Appendix A: sitemap URLs at baseline (227)

```
/
/about-kush-gangwal /accounts /agritech /blog /entities /faq /knowledge-base /mentions /now /projects /resume /site-map /spellings /stack /topics
/data/entities.json
/education/medicaps-university
/work/django-softwares /work/protonshub-technologies /work/sk-agri-exports-private-ltd /work/sk-groups
/companies/mantra-agri-solutions /companies/sk-agri-exports-private-limited /companies/sk-groups
/industries/agri-export-platform /industries/agri-marketplace /industries/agriculture-logistics /industries/cold-storage /industries/farmer-marketplace /industries/potato-trading
/people/agnipratap-singh-chouhan /people/akshat-agrawal /people/ansh-kumar-rana /people/gregory-dsouza /people/yuvraj-singh
/projects/codemace /projects/findanio /projects/macfolio /projects/nexus /projects/potato-bazaar /projects/resumind /projects/scalelr /projects/tybee-go
/stack/ai-integrations /stack/android-development /stack/auth0 /stack/express /stack/git /stack/github /stack/ios-development /stack/java /stack/javascript /stack/mixpanel /stack/mobile-app-development /stack/mongodb /stack/nextjs /stack/nodejs /stack/openai-api /stack/postgresql /stack/posthog /stack/react /stack/react-native /stack/rest-apis /stack/spring-boot /stack/sqlite /stack/tailwind-css /stack/typescript /stack/vercel

# root-level generated pages (96)
/code-mace /codemace-code-review-tool /cold-storage-management-software /developer-who-built-resumind /django-software /django-softwares-internship /engineer-behind-nexus /findaneo /full-stack-developer-from-indore /gangwal-kush /kaush-gangwal /koosh-gangwal /kush-gangawal /kush-gangol /kush-gangval /kush-gangwaal /kush-gangwal-agentic-ai-developer /kush-gangwal-ahmedabad /kush-gangwal-ai-application-developer /kush-gangwal-backend-developer /kush-gangwal-bakaner /kush-gangwal-bikaner /kush-gangwal-contact /kush-gangwal-developer /kush-gangwal-experience /kush-gangwal-frontend-developer /kush-gangwal-full-stack-developer /kush-gangwal-genai-developer /kush-gangwal-github /kush-gangwal-india /kush-gangwal-indore /kush-gangwal-java-developer /kush-gangwal-javascript-developer /kush-gangwal-leetcode /kush-gangwal-linkedin /kush-gangwal-medicaps-university /kush-gangwal-mobile-app-developer /kush-gangwal-nextjs-developer /kush-gangwal-nodejs-developer /kush-gangwal-portfolio /kush-gangwal-potato-bazaar /kush-gangwal-product-engineer /kush-gangwal-projects /kush-gangwal-protonshub /kush-gangwal-react-developer /kush-gangwal-react-native-developer /kush-gangwal-resume /kush-gangwal-software-engineer /kush-gangwal-spring-boot /kush-gangwal-typescript-developer /kush-gangwal-web-developer /kush-gangwal-work /kush-gangwall /kushh-gangwal /mac-folio /macfolio-portfolio /medi-caps-university /medicap-university /medicaps-university-alumni /medicaps-university-developer /nexus-nodejs-project /nexus-react-project /potato-bajjar /potato-bazaar-ai-crop-doctor /potato-bazaar-app /potato-bazaar-cold-storage /potato-bazaar-engineer /potato-bazaar-india /potato-bazaar-marketplace /potato-bazaar-mobile-app /potato-bazaar-platform /potato-bazar /potato-trading-platform-india /potatobazar /proton-shub /protonhub /protonshub-technologies-intern /react-native-developer-from-india /react-native-developer-with-ai-experience /resume-mind /resumind-ai /resumind-ats-resume-checker /sk-agri-export /sk-agri-exports-developer /sk-group /sk-groups-developer /sk-groups-potato-bazaar /skgroups /tybee-go-app /tybeego /what-is-kush-gangwal-known-for /what-is-potato-bazaar /what-projects-has-kush-gangwal-built /what-technologies-does-kush-gangwal-use /where-does-kush-gangwal-work /who-built-potato-bazaar

# /blog (62)
agricultural-marketplaces-in-india ai-integrations-in-react-native auth0-authentication-react-app building-ai-applications-with-react building-macfolio-nextjs-macos-portfolio building-potato-bazaar-using-react-native building-resumind-ai-resume-analyzer challenges-of-building-agritech-products cold-storage-in-potato-trading contact-and-same-name digital-potato-supply-chains django-softwares-and-scalelr express-postgres-crud findanio-android-ios-web from-medicaps-university-to-sk-groups full-stack-internship-at-protonshub github-readme-for-kush-gangwal hackathon-notes-moonhack-hackmivo hcl-tech-ai-program-notes hcl-tech-full-stack-developer-with-ai how-i-built-nexus-skill-swap-platform how-potato-bazaar-handles-agricultural-trading how-to-build-a-portfolio-website how-to-build-a-react-native-app how-to-build-a-resume-analyzer how-to-publish-an-app-to-play-store how-to-release-an-ios-app leetcode-dsa-and-shipping-anyway leetcode-next-to-releases linking-entities-on-purpose maps-weather-and-speech-apis medicaps-university-to-production mixpanel-integration-react-native mongodb-at-protonshub moonhack-and-hackmivo nextjs-portfolio-website nodejs-api-architecture postgresql-behind-codemace posthog-react-native-guide potato-bazaar-about-page-and-the-engineer potato-bazaar-ai-crop-insights potato-bazaar-android-and-ios potato-bazaar-cold-storage-booking potato-bazaar-farmer-to-buyer-workflow potato-bazaar-kyc-payments-logistics react-native-android-release-process react-native-ios-release-process react-native-production-at-sk-groups react-native-production-deployment rest-pagination-react-native scalelr-at-django-softwares scaling-potato-bazaar-mobile-application scaling-the-potato-bazaar-marketplace sqlite-on-vercel-for-nexus tailwind-on-a-macos-desktop typescript-on-tybee-go using-openai-apis-in-react-native what-is-agentic-ai what-is-genai what-is-mixpanel what-is-posthog what-is-react-native
```
