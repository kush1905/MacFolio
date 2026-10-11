/**
 * Homepage view of the portfolio. Everything here is derived from content/*.json,
 * the case studies, and the tech evidence map — no facts are restated.
 */
import { caseStudyBySlug, type Screenshot } from "@/lib/caseStudies";
import { content } from "@/lib/content";
import { products } from "@/lib/seo";
import { techPages } from "@/lib/techPages";

/** Visual metaphor each project uses in the 3D scene. */
export type StationKind =
  | "marketplace"
  | "mobile"
  | "exchange"
  | "document"
  | "structure"
  | "discovery"
  | "matching"
  | "window";

const STATIONS: { slug: string; kind: StationKind; ownership: "own" | "team" }[] = [
  { slug: "potato-bazaar", kind: "marketplace", ownership: "team" },
  { slug: "tybee-go", kind: "mobile", ownership: "team" },
  { slug: "nexus", kind: "exchange", ownership: "own" },
  { slug: "resumind", kind: "document", ownership: "own" },
  { slug: "codemace", kind: "structure", ownership: "own" },
  { slug: "findanio", kind: "discovery", ownership: "team" },
  { slug: "scalelr", kind: "matching", ownership: "team" },
  { slug: "macfolio", kind: "window", ownership: "own" },
];

export type HomeProject = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  period: string;
  role: string;
  context: string;
  tech: string[];
  kind: StationKind;
  ownership: "own" | "team";
  links: { label: string; href: string }[];
  screenshots: Screenshot[];
  cover?: string;
};

export const homeProjects: HomeProject[] = STATIONS.flatMap(({ slug, kind, ownership }) => {
  const product = products.find((item) => item.slug === slug);
  if (!product) return [];
  const study = caseStudyBySlug(slug);
  return [
    {
      slug,
      name: product.name,
      tagline: product.tagline,
      summary: study?.description ?? product.description,
      period: product.period,
      role: study?.role ?? "Full Stack Developer",
      context: ownership === "own" ? "Personal project" : (product.company ?? "Team project"),
      tech: product.tech,
      kind,
      ownership,
      links: product.links,
      screenshots: study?.screenshots ?? [],
      cover: study?.cover,
    },
  ];
});

export const flagship = homeProjects[0];

/** Chronological journey, oldest first. */
export const journey = [
  {
    id: "medicaps",
    org: content.about.education.school,
    role: content.about.education.degree,
    period: content.about.education.duration,
    place: content.about.education.location,
    href: "/education/medicaps-university",
    points: [] as string[],
  },
  ...[...content.experience.experience].reverse().map((job) => ({
    id: job.company.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    org: job.company,
    role: job.role,
    period: job.duration,
    place: job.type,
    href: `/work/${job.company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    points: job.highlights.slice(0, 2),
  })),
];

const TECH_GROUPS: { label: string; slugs: string[] }[] = [
  { label: "Frontend", slugs: ["react", "nextjs", "typescript", "javascript", "tailwind-css"] },
  { label: "Mobile", slugs: ["react-native", "android-development", "ios-development"] },
  { label: "Backend", slugs: ["nodejs", "express", "rest-apis", "auth0"] },
  { label: "Data", slugs: ["postgresql", "mongodb", "sqlite"] },
  { label: "AI", slugs: ["ai-integrations", "openai-api"] },
  { label: "Analytics", slugs: ["posthog", "mixpanel"] },
  { label: "Ship", slugs: ["git", "github", "vercel"] },
];

export type TechNode = {
  slug: string;
  name: string;
  group: string;
  use: string;
  proof: string[];
  projects: string[];
};

/** Projects whose names appear in a tech page's own evidence. */
function evidenceFor(text: string) {
  const lower = text.toLowerCase();
  return homeProjects
    .filter((project) => lower.includes(project.name.toLowerCase()))
    .map((project) => project.slug);
}

export const techNodes: TechNode[] = TECH_GROUPS.flatMap((group) =>
  group.slugs.flatMap((slug) => {
    const page = techPages.find((item) => item.slug === slug);
    if (!page) return [];
    return [
      {
        slug,
        name: page.name,
        group: group.label,
        use: page.use,
        proof: page.proof,
        projects: evidenceFor([page.description, ...page.proof].join(" ")),
      },
    ];
  }),
);

export const techGroups = TECH_GROUPS.map((group) => group.label);

export const learning = {
  updated: content.now.updatedLabel,
  learning: content.now.learning,
  exploring: content.now.interestedIn.filter(
    (topic) => !content.now.learning.includes(topic),
  ),
};

export const contact = {
  email: content.about.email,
  location: content.about.location,
};
