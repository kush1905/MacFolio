# PLAN — Kush Gangwal: The Product Universe

Status: **proposal, awaiting approval**. No product code has been changed. Read `AUDIT.md` and `SEO_BASELINE.md` first.

---

## 0. Decisions needed from you before implementation

| # | Decision | My recommendation |
|---|---|---|
| D1 | **Facts C1–C16** in `AUDIT.md` §4, especially the Protonshub year, "founding engineer", Bakaner vs Bikaner, and which LinkedIn and GitHub accounts are yours. | Answer these first. I will not write the new copy until the facts are settled. |
| D2 | **Turn `/` from a 308 redirect into the homepage.** Browsers cache 308s, so returning visitors may keep landing on `/about-kush-gangwal` until their cache clears. That is harmless. Google re-crawls and treats `/` as a new indexable page. | Yes, but keep `/about-kush-gangwal` as the Person entity page (`@id` unchanged). |
| D3 | **The ~28 misspelling pages and ~60 keyword-variant pages** (SEO_BASELINE S3). | Keep them all at launch, so nothing changes during the redesign. Afterwards, once you have GSC data, 301 every page with no clicks into its canonical page (misspellings → `/spellings` or the real entity page, role variants → `/about-kush-gangwal#…` or `/stack/*`). Not doing that now. |
| D4 | **`/people/*` colleague pages.** | Ask those people, or noindex the pages. They add no search value for you. |
| D5 | **AI provider for "Ask Kush".** The site already uses Gemini with a local fallback. | Keep Gemini behind a small provider interface. Don't add `ai` or `@ai-sdk/groq` unless you want to switch. |
| D6 | **Contact delivery.** Messages currently go to Postgres only. | Add Resend if you'll provide `RESEND_API_KEY` and a verified sender. Otherwise use a `mailto:` fallback. |
| D7 | **Accent color.** | Warm amber. It continues the black-and-gold logo you shipped in `301281b` (see §2). |
| D8 | **Fonts.** SF Pro on public pages is a licensing risk. | Replace them on the public site with self-hosted fonts via `next/font` (§2). `/desktop` keeps its OS look; consider swapping to Inter there too. |
| D9 | **Tooling spend.** Higgsfield and Figma MCPs are connected. Image and video generation spends credits. | Use Higgsfield for at most about 12 concept stills, to compare art directions. No video assets. Figma is optional. |
| D10 | **Browser QA.** Playwright is not installed. | Add `@playwright/test` as a devDependency, plus Lighthouse via `npx`. |

## 1. Three creative directions

All three keep the narrative ORIGIN → BUILD → SYSTEM → PRODUCTS → EXPERIENCE → ENGINEERING → INTELLIGENCE → NEXT → CONTACT and the line **"I build products that ship."**

### A. Signal Lattice (recommended)
- **Idea.** A single lit filament, the "signal", travels through graphite space. Wherever it passes, it lays down precise architectural structure. Your career becomes one continuous line that keeps building.
- **Hero.** Near-black. One amber point draws a short line, then a second and a third, and they snap into a fine-wire lattice behind the HTML headline. Total time ≤ 1.2 s, and it never blocks the page.
- **Camera journey.** The camera rides the spline the filament draws.
  - The filament splits into the stacked layers FRONTEND → API → BACKEND → DATA → SERVICES, and the camera passes between them.
  - It then exits into a wide field where each project is a distinct "station" on the line.
  - The career timeline is the same filament seen from the side.
  - The engineering core is where all the threads converge.
- **Signature object.** The filament: an instanced tube with a moving emissive pulse, plus the lattice. It is cheap to render: one spline, instanced segments, no large GLBs.
- **Projects.**
  - Potato Bazaar is the largest station: a phone and dashboard pair showing real screenshots, connected to marketplace, cold-storage and logistics nodes, with flow pulses running between them.
  - Each other project has its own small machined form (§3).
- **Materials.**
  - Dark anodized metal (MeshStandard, low roughness variance)
  - Smoked glass panels for the screenshots
  - Fine wire for the structure
  - Amber emissive only on the signal and active connections
- **Palette.** Graphite #0B0B0C, surfaces #16171A and #24262B, warm-white text #F2EEE6, muted text #8C8A85, accent amber #E9A23B.
- **Typography.** An editorial serif display font for big statements (Instrument Serif or Fraunces at opsz 144), Geist Sans for UI and body, Geist Mono for small uppercase labels.
- **Motion.** Slow, weighted, and tied to scroll.
  - Pulses travel along lines to show cause and effect.
  - Nothing bounces.
  - Pointer input adds at most 2–3° of parallax.
- **Mobile.** No camera ride. The lattice is a sticky, low-poly backdrop that changes state per section. Each project station is a static, tappable render. Effects and particles are off.
- **Why A wins.**
  - The signal **is** the story: the metaphor and the narrative are the same object.
  - It has the most original read and avoids "planets".
  - It needs the cheapest geometry and works without custom GLBs, so Blender is optional.
  - The amber connects to the existing brand.

### B. Exploded Product
- **Idea.** A cinematic product film. A single machined object, the "product core", comes apart into labeled layers as you scroll. Each project is a precision artifact on a dark plinth.
- **Strengths.** It looks very premium, and the exploded architecture is easy to read.
- **Weaknesses.** It drifts toward "one giant floating object". It needs several custom-modeled GLBs (Blender time plus about 2–4 MB of assets). The story of career progression is weaker.
- **What A borrows from B.** I'd take its exploded-layer technique for Scenes 02 and 04.

### C. Field Survey
- **Idea.** Scientific visualization. The career is a topographic data terrain drawn in contour lines (acid lime on black). Projects are survey markers. Potato Bazaar's logistics show up as routes across the field.
- **Strengths.** It is distinctive and nods subtly to agri-tech.
- **Weaknesses.** The agriculture theme risks dominating the whole identity. The terrain shader is GPU-heavy on mobile. It reads as "a map site" more than a builder.

## 2. Storyboard for direction A

The **HTML is always the source of truth**. The canvas sits behind it as `position: fixed`, `aria-hidden`, `pointer-events` only where interactive.

| Scene | HTML (semantic, crawlable) | 3D | Interaction |
|---|---|---|---|
| 00 Signal | `<h1>Kush Gangwal</h1>`, "Full stack · Mobile · AI integrations", "I build products that ship.", plus Projects / Contact / Ask buttons | A point of light draws the first lattice, ≤ 1.2 s | Nothing to skip, because the content is never blocked. The animation is simply ambient. |
| 01 Origin | A short intro paragraph: foundations (JS, React, Git, CS fundamentals at Medicaps) | 4–5 sparse wire primitives, which connect as you scroll | Scroll |
| 02 System | "How I build": frontend → API → backend → database → services, one line each | The filament splits into 5 stacked translucent planes, and the camera passes through them | Scroll. Each plane highlights as its paragraph enters view. |
| 03 Products | A project list (`<ol>` of cards with links). Potato Bazaar is first and larger. | Project stations along the line | Hover or focus: the station responds. Click: navigate to `/projects/[slug]` with a ViewTransition. |
| 04 Flagship | A Potato Bazaar summary: your role (accurate wording after D1), what you built, a "Read case study" link | The station deconstructs: UX → web/mobile → API → backend → data → integrations. Layers you didn't build are dimmed and labeled honestly. | Scroll |
| 05 Experience | `<ol>` timeline: Django Softwares → Protonshub → SK Groups, with the settled dates | The same filament, seen side-on, branching more at each step | Scroll |
| 06 Engineering core | Technology chips (real `<button>`s) grouped into Frontend, Mobile, Backend, Data, AI, Analytics, Tools, Deploy | The threads converge into a node graph | Selecting a chip highlights the projects that use it, from the `techPages.ts` evidence map. No percentages. |
| 07 Intelligence | "Ask Kush" entry point, with suggested questions | The scene quiets; a sparse network breathes | Opens the ⌘K panel |
| 08 Next | "Currently learning": agentic AI, ML, system design, Spring Boot, clearly labeled *learning* | Dashed, unfinished filament extending past the last node | — |
| 09 Contact | `<h2>Let's build something.</h2>`, a form (Name, Email, Message → **Send transmission**), profile links, email | Everything resolves into a single point | The form works without WebGL |

A fallback renders when there is no WebGL, `prefers-reduced-motion` is set, the device is low-power, or JavaScript is disabled. It shows the identical HTML with one static, art-directed poster image per scene, using CSS backgrounds from Higgsfield or a pre-rendered three.js frame.

## 3. Project metaphors (each built from 2–4 primitives, same material system)

| Project | Form | Content sources |
|---|---|---|
| Potato Bazaar (flagship) | A phone and a dashboard on smoked glass with real screenshots, plus 4 satellite nodes (marketplace, cold storage, mandi prices, logistics) with flow pulses | `potato-bazaar.jpg`. **I need more real screenshots from you.** |
| Tybee Go | A phone with a stacked, paginated card column that slides through | `tybee-go.jpg` |
| Nexus | Two clusters of nodes exchanging pulses along bidirectional edges | `nexus.jpg` (8.6 KB placeholder; needs a real screenshot) |
| Resumind | A sheet of paper that separates into labeled, structured strips | Needs a screenshot; current SVG is a placeholder |
| CodeMace | A precise tree or graph of a data structure with an amber traversal | Needs a screenshot |
| Findanio | A radial search sweep that reveals points | `findanio.jpg` |
| Scalelr | A bipartite matching graph (investors ↔ projects) | No asset |
| Macfolio | A tiny window frame, linking to `/desktop` | `macfolio.jpg` |

## 4. Architecture

```
src/app/(public)/page.tsx          ← NEW homepage (server component, semantic sections)
src/app/(public)/layout.tsx        ← existing public chrome, restyled
src/app/desktop/layout.tsx         ← NEW: move DesktopGate/boot script/wallpaper preload here
src/app/layout.tsx                 ← slimmed: fonts, metadata, <html>/<body> only
src/components/universe/
  UniverseStage.tsx   (client) dynamic(() => import('./Scene'), { ssr:false }) + capability gate
  Scene.tsx           <Canvas frameloop="demand" dpr={[1, cap]}> with scene children
  rig/CameraRig.tsx   GSAP ScrollTrigger timeline → camera position/target (one source of truth)
  signal/Filament.tsx instanced tube + pulse shader
  stations/*.tsx      one file per project metaphor
  useSceneState.ts    tiny zustand store: activeScene, hoveredProject, activeTech
src/components/home/  HTML sections (Hero, System, Products, Experience, Core, Ask, Next, Contact)
src/components/command/CommandPalette.tsx   ⌘K: local fuzzy search → AI answer if available
content/ (existing JSON, made canonical) + src/content/index.ts typed accessors
```

- **Separation of responsibilities.**
  - React owns the content and the DOM.
  - The scene only reads `useSceneState` and the scroll progress; it never owns text.
  - GSAP owns the camera and scene choreography.
  - framer-motion (already installed) owns UI overlays such as the palette and menus.
  - No Lenis at first: native scroll plus ScrollTrigger. I'd add it only if testing shows the scroll feels jerky.
- **Navigation.** Every project is a real `<Link>`.
  - The `transitionTypes` prop and `<ViewTransition>` give the shared-element morph from the card to the case-study hero. Next 16 supports this with no config (`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`).
  - Back and forward work natively, and deep links are plain URLs.
  - The camera "approach" is a short 300 ms dolly that starts on pointerdown, before the route changes. It is skipped under reduced motion.
- **Content model.**
  - `content/*.json` becomes the single source for every fact the homepage, case studies, ⌘K and schema use.
  - Add `content/projects.json` fields: `role`, `scope` (what you built vs the team), `tech`, `screenshots`, `featured`.
  - `seo.ts` reads from the content files and stops restating facts in prose.
  - The ~160 generated pages are not migrated now (D3); they keep working as they are.
- **Ask Kush.**
  - Reuse `/api/assistant` and `content/kushgpt`.
  - Add: per-IP rate limiting (in-memory token bucket plus an Upstash or Vercel KV option), a 500-character input cap, and a mandatory "answer only from context, say 'I don't know' otherwise" instruction.
  - Responses return `links[]` to the relevant project or about page.
  - Without a key, the panel falls back to local search over the content.
- **Contact.**
  - Validation with zod (new dependency, about 13 KB, server-only), a honeypot field, and rate limiting.
  - Delivery through Resend if configured (D6). The UI shows **Message received** only on a 2xx response with `delivered: true`; otherwise it shows a `mailto:` fallback.
  - Remove the GET listing from `/api/messages`.
- **New dependencies:** `three`, `@react-three/fiber@9`, `@react-three/drei@10`, `gsap`, `@gsap/react`, `lucide-react`, `zod`. Optional: `resend` (D6), `@react-three/postprocessing` (only if bloom passes the performance budget on desktop), and `@playwright/test` as a devDependency.
- **Not adding:** `motion` (framer-motion is already installed), Lenis, rapier, `ai`/`@ai-sdk/groq` (D5), or PostHog (the custom analytics endpoint already exists).

## 5. Performance budget (to be measured with Playwright and Lighthouse, not assumed)

| Metric | Budget |
|---|---|
| LCP (mobile, Moto G Power, 4G) | ≤ 2.5 s. The LCP element is the HTML `<h1>`, never the canvas. |
| CLS | ≤ 0.02 |
| INP | ≤ 200 ms |
| Initial JS on `/`, excluding the 3D chunk | ≤ 170 KB gzip |
| 3D chunk (three + R3F + drei subset + scene) | ≤ 260 KB gzip, loaded after `requestIdleCallback` or on first interaction |
| 3D assets total | ≤ 1.5 MB. Screenshots as ≤ 1024 px WebP or KTX2; any GLB with Meshopt. |
| Draw calls | ≤ 80 on desktop, ≤ 35 on mobile, by instancing the filament and nodes |
| DPR cap | 1.75 on desktop, 1.25 on mobile |
| Lights | 1 environment map + 1 directional light. Emissive surfaces instead of extra lights. |
| Rendering | `frameloop="demand"`. Invalidate on scroll, pointer and active tweens. Pause offscreen with IntersectionObserver. |
| Low-power fallback | If `navigator.hardwareConcurrency ≤ 4`, `deviceMemory ≤ 4`, or the first 30 frames average under 40 fps, switch to static posters |

## 6. SEO preservation strategy

1. **Before any redesign, fix the low-risk defects** (it can ship as its own PR):
   - the `${SITE_URL}` leak
   - the visible SEO notes, rewritten as real human copy
   - removing `/` from the sitemap until the homepage exists
   - moving the desktop chrome into `/desktop/layout.tsx`
   - dropping the wallpaper preload from public pages
   - adding JSON-LD to `/topics` and `/site-map`
   - a unique description for the duplicate pair
   - **you:** add `www` as a domain in Vercel and redirect it to the apex
2. **Homepage launch:**
   - Remove both `/` redirects. Legacy hosts' root redirects point to `/` instead.
   - `/` gets `WebSite` and `WebPage` (about → `#person`) markup.
   - `/about-kush-gangwal` remains the only `ProfilePage` and the home of the Person `@id`.
   - Title: "Kush Gangwal — Full Stack & React Native Developer", which is distinct from the about page title.
   - `/` returns to the sitemap.
3. **No URL is removed or renamed in this project.** Case studies keep their URLs and gain depth: role, scope, architecture, decisions and screenshots.
4. **Schema corrections**, each logged in the regression report:
   - `alternateName` limited to real name variants
   - `knowsAbout` limited to skills
   - `sameAs` limited to profiles you confirm (D1, C8–C9)
   - `contributor` instead of `creator` where you contributed rather than built
   - one Organization `@id` per company
5. **Internal linking.** The homepage links to every case study, about, `/now`, `/stack`, `/blog` and the profiles. Case studies get "related by technology" links instead of the first 4 in array order. The header and footer keep their existing links; the "Spellings", "Entities" and "llms.txt" links move to `/site-map`, which stays linked from the footer, so those pages are not orphaned.
6. **Regression gate.** A script recrawls the built site and diffs it against Appendix A in `SEO_BASELINE.md`. It checks status, title, description, canonical, robots and JSON-LD types for all 227 URLs. Any unexpected change blocks the merge. The output becomes `SEO_REGRESSION_REPORT.md`.

## 7. Phased delivery (each phase is a separate reviewable commit or PR)

1. **Defect fixes** (§6.1). Small and independent of the redesign.
2. **Fact consolidation** after D1: single content source, corrected copy, the resume flagged for your update.
3. **Foundation:** tokens, fonts, slim root layout, semantic homepage (HTML only), restyled public chrome. **The homepage ships here without 3D.**
4. **3D core:** canvas, capability gate, filament and camera rig for Scenes 00–02.
5. **Potato Bazaar station and case-study transition.**
6. **Other project stations.**
7. **Experience timeline and engineering core.**
8. **⌘K Ask Kush and contact hardening.**
9. **Case-study template redesign.**
10. **Playwright QA** at 1440, 1280, 1024, 768, 430 and 390 px, plus Lighthouse, reduced motion, no-WebGL and keyboard tests.
11. **SEO regression report and polish.**

## 8. MCP and tool availability (verified in this session)

| Tool | Status | Use |
|---|---|---|
| Higgsfield MCP | Connected | Concept stills for directions A/B/C and fallback posters, after you approve the credit spend (D9) |
| Figma MCP | Connected | Optional: tokens and key frames. I'd skip it unless you want to review the design in Figma. |
| Playwright | **Not installed** (no MCP, no package) | Add `@playwright/test` (D10) |
| Lighthouse | Not installed | `npx lighthouse` in QA |
| Blender | Not available | Not needed for direction A |
| Search Console | **No access** | You export the data (SEO_BASELINE §10) |
| PostHog MCP | Needs authorization in your claude.ai connector settings | Not needed |
