#!/usr/bin/env node
/**
 * SEO regression check. Crawls every URL in the baseline sitemap (the live site) and the
 * candidate sitemap (a local build), and diffs status, title, description, canonical,
 * robots, H1 count, and JSON-LD types.
 *
 *   npm run build && npx next start -p 3100 &
 *   npm run seo:check -- --base https://kushgangwal.site --candidate http://localhost:3100 --out seo-check.json
 */
import { writeFileSync } from "node:fs";

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .reduce((pairs, arg, i, list) => (arg.startsWith("--") ? [...pairs, [arg.slice(2), list[i + 1]]] : pairs), []),
);
const BASE = (args.base ?? "https://kushgangwal.site").replace(/\/$/, "");
const CANDIDATE = (args.candidate ?? "http://localhost:3100").replace(/\/$/, "");
const CANONICAL_ORIGIN = "https://kushgangwal.site";

const decode = (s) =>
  s
    ?.replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

function meta(html, name) {
  const re = new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]*>`, "i");
  return decode(html.match(re)?.[0].match(/content="([^"]*)"/)?.[1]);
}

function parse(html) {
  const types = [];
  for (const block of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(block[1]);
      const nodes = data["@graph"] ?? [data];
      for (const node of nodes) [node["@type"]].flat().forEach((t) => t && types.push(t));
    } catch {
      types.push("INVALID_JSON");
    }
  }
  return {
    title: decode(html.match(/<title>([^<]*)<\/title>/)?.[1]),
    description: meta(html, "description"),
    robots: meta(html, "robots"),
    canonical: html.match(/<link rel="canonical" href="([^"]*)"/)?.[1],
    h1: (html.match(/<h1[\s>]/g) ?? []).length,
    jsonLd: [...new Set(types)].sort(),
    leaks: [/\$\{SITE_URL\}/, /search engines can rank/i, /founding engineer/i, /\bBikaner\b/].filter((re) =>
      re.test(html.replace(/<script[\s\S]*?<\/script>/g, "")),
    ).map(String),
  };
}

async function fetchPage(origin, path) {
  const res = await fetch(origin + path, { redirect: "manual" });
  const location = res.headers.get("location") ?? undefined;
  const type = res.headers.get("content-type") ?? "";
  if (res.status !== 200) return { status: res.status, location };
  if (!type.includes("html")) return { status: 200, nonHtml: type.split(";")[0] };
  return { status: 200, ...parse(await res.text()) };
}

async function sitemapPaths(origin) {
  const xml = await (await fetch(`${origin}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/");
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

const basePaths = await sitemapPaths(BASE);
const candidatePaths = await sitemapPaths(CANDIDATE);
const all = [...new Set([...basePaths, ...candidatePaths])].sort();

const rows = await pool(all, 8, async (path) => {
  const [before, after] = await Promise.all([fetchPage(BASE, path), fetchPage(CANDIDATE, path)]);
  const changes = [];
  for (const key of ["status", "title", "description", "robots", "h1"]) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) changes.push(key);
  }
  const expectedCanonical = path === "/" ? CANONICAL_ORIGIN : CANONICAL_ORIGIN + path;
  const issues = [];
  if (after.status === 200 && after.canonical && after.canonical !== expectedCanonical) issues.push(`canonical ${after.canonical}`);
  if (after.status === 200 && !after.nonHtml && after.title === undefined) issues.push("missing title");
  if (after.status === 200 && !after.nonHtml && !after.description) issues.push("missing description");
  if (after.robots?.includes("noindex") && candidatePaths.includes(path)) issues.push("noindex in sitemap");
  if (after.status !== 200 && candidatePaths.includes(path)) issues.push(`non-200 in sitemap (${after.status})`);
  if (after.jsonLd?.includes("INVALID_JSON")) issues.push("invalid JSON-LD");
  if (after.leaks?.length) issues.push(`visible leak ${after.leaks.join(",")}`);
  const removedTypes = (before.jsonLd ?? []).filter((t) => !(after.jsonLd ?? []).includes(t));
  const addedTypes = (after.jsonLd ?? []).filter((t) => !(before.jsonLd ?? []).includes(t));
  return {
    path,
    inBaseSitemap: basePaths.includes(path),
    inCandidateSitemap: candidatePaths.includes(path),
    before,
    after,
    changes,
    removedTypes,
    addedTypes,
    issues,
  };
});

const titles = new Map();
const descriptions = new Map();
for (const row of rows) {
  if (row.after.status !== 200 || row.after.nonHtml) continue;
  titles.set(row.after.title, [...(titles.get(row.after.title) ?? []), row.path]);
  descriptions.set(row.after.description, [...(descriptions.get(row.after.description) ?? []), row.path]);
}
const dupes = (map) => [...map.entries()].filter(([, paths]) => paths.length > 1).map(([value, paths]) => ({ value, paths }));

const summary = {
  base: BASE,
  candidate: CANDIDATE,
  checkedAt: new Date().toISOString(),
  baseSitemap: basePaths.length,
  candidateSitemap: candidatePaths.length,
  droppedFromSitemap: basePaths.filter((p) => !candidatePaths.includes(p)),
  addedToSitemap: candidatePaths.filter((p) => !basePaths.includes(p)),
  statusChanged: rows.filter((r) => r.changes.includes("status")).map((r) => `${r.path}: ${r.before.status} → ${r.after.status}${r.after.location ? ` (${r.after.location})` : ""}`),
  titleChanged: rows.filter((r) => r.changes.includes("title")).length,
  descriptionChanged: rows.filter((r) => r.changes.includes("description")).length,
  robotsChanged: rows.filter((r) => r.changes.includes("robots")).map((r) => r.path),
  schemaTypesRemoved: rows.filter((r) => r.removedTypes.length).map((r) => `${r.path}: -${r.removedTypes.join(",")}`),
  schemaTypesAdded: rows.filter((r) => r.addedTypes.length).map((r) => `${r.path}: +${r.addedTypes.join(",")}`),
  issues: rows.filter((r) => r.issues.length).map((r) => `${r.path}: ${r.issues.join("; ")}`),
  duplicateTitles: dupes(titles),
  duplicateDescriptions: dupes(descriptions),
};

if (args.out) writeFileSync(args.out, JSON.stringify({ summary, rows }, null, 2));
console.log(JSON.stringify(summary, null, 2));
process.exitCode = summary.issues.length || summary.droppedFromSitemap.some((p) => p !== "/kush-gangwal-bikaner") ? 1 : 0;
