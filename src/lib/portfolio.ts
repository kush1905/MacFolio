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

/** Projects with case studies that are not stations in the homepage's 3D scene. */
const EXTRA_PROJECTS: { slug: string; kind: StationKind; ownership: "own" | "team" }[] = [
  { slug: "personal-portfolio", kind: "window", ownership: "own" },
];

function toHomeProject({ slug, kind, ownership }: { slug: string; kind: StationKind; ownership: "own" | "team" }): HomeProject[] {
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
}

export const homeProjects: HomeProject[] = STATIONS.flatMap(toHomeProject);

/** Every project with a case study: the homepage stations plus the extras. */
export const allProjects: HomeProject[] = [...homeProjects, ...EXTRA_PROJECTS.flatMap(toHomeProject)];

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
  { label: "Mobile", slugs: ["react-native", "flutter", "android-development", "ios-development"] },
  { label: "Backend", slugs: ["nodejs", "express", "python", "django", "fastapi", "rest-apis", "auth0"] },
  { label: "Data", slugs: ["postgresql", "mongodb", "sqlite", "sql", "supabase"] },
  { label: "AI", slugs: ["ai-integrations", "openai-api", "llm-apis", "prompt-engineering", "speech-ai"] },
  { label: "Analytics", slugs: ["posthog", "mixpanel", "firebase"] },
  { label: "Ship", slugs: ["git", "github", "vercel", "render", "aws", "aws-amplify", "hostinger"] },
];

/**
 * Technologies shown in the homepage stack that have no /stack/ page of their own. Only
 * claims we can stand behind: project evidence where it exists, a plain description otherwise.
 */
const EXTRA_TECH: Record<string, { name: string; use: string; proof: string[] }> = {
  flutter: { name: "Flutter", use: "Cross-platform mobile UI with Flutter and Dart, alongside React Native.", proof: [] },
  python: { name: "Python", use: "Backend services, scripting, and API work in Python.", proof: [] },
  django: { name: "Django", use: "Python web backends with Django: models, admin, and REST endpoints.", proof: [] },
  fastapi: { name: "FastAPI", use: "Typed, async Python APIs with FastAPI.", proof: [] },
  sql: { name: "SQL", use: "Relational modelling and queries across PostgreSQL and SQLite.", proof: ["CodeMace and Macfolio on PostgreSQL", "Nexus on SQLite"] },
  supabase: { name: "Supabase", use: "Postgres with built-in auth, storage, and row-level security.", proof: [] },
  "llm-apis": {
    name: "LLM APIs",
    use: "Chat and reasoning models behind product features, with grounding and fallbacks.",
    proof: ["Ask Kush on this site (Groq, with Gemini and a local fallback)", "KushGPT assistant in Macfolio"],
  },
  "prompt-engineering": {
    name: "Prompt engineering",
    use: "System prompts, structured JSON outputs, and answers grounded in source data.",
    proof: ["Resumind's rubric-based JSON review", "Ask Kush answers only from published portfolio facts"],
  },
  "speech-ai": {
    name: "Speech AI (TTS / STT)",
    use: "Text-to-speech and speech-to-text in production mobile apps.",
    proof: ["SK Groups apps: Sarvam AI, TTS, and STT APIs"],
  },
  firebase: { name: "Firebase", use: "Analytics and backend services for mobile apps.", proof: ["SK Groups production apps"] },
  render: { name: "Render", use: "Hosting for backend services and APIs.", proof: [] },
  aws: { name: "AWS", use: "Cloud infrastructure: EC2 compute and S3 storage.", proof: ["SK Groups (AWS EC2, S3)"] },
  "aws-amplify": { name: "AWS Amplify", use: "Hosting and CI/CD for web front ends on AWS.", proof: [] },
  hostinger: { name: "Hostinger", use: "Domains and web hosting.", proof: [] },
};

export type TechNode = {
  slug: string;
  name: string;
  group: string;
  use: string;
  proof: string[];
  projects: string[];
  /** Whether /stack/{slug} exists. */
  page: boolean;
};

/** Projects whose names appear in a tech page's own evidence. */
function evidenceFor(text: string) {
  const lower = text.toLowerCase();
  return homeProjects
    .filter((project) => lower.includes(project.name.toLowerCase()))
    .map((project) => project.slug);
}

export const techNodes: TechNode[] = TECH_GROUPS.flatMap((group) =>
  group.slugs.flatMap((slug): TechNode[] => {
    const page = techPages.find((item) => item.slug === slug);
    if (page) {
      return [
        {
          slug,
          name: page.name,
          group: group.label,
          use: page.use,
          proof: page.proof,
          projects: evidenceFor([page.description, ...page.proof].join(" ")),
          page: true,
        },
      ];
    }
    const extra = EXTRA_TECH[slug];
    if (!extra) return [];
    return [
      {
        slug,
        name: extra.name,
        group: group.label,
        use: extra.use,
        proof: extra.proof,
        projects: evidenceFor(extra.proof.join(" ")),
        page: false,
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

const normaliseTech = (tech: string) => tech.toLowerCase().replace(/\.js$/, "").trim();

/**
 * Projects most related to `slug`: two points per shared technology, one for the same
 * company or for both being personal projects. Ties keep the homepage order.
 */
export function relatedProjects(slug: string, count = 4) {
  const base = homeProjects.find((project) => project.slug === slug);
  if (!base) return homeProjects.slice(0, count);
  const baseTech = new Set(base.tech.map(normaliseTech));
  return homeProjects
    .filter((project) => project.slug !== slug)
    .map((project, order) => ({
      project,
      order,
      score:
        project.tech.filter((tech) => baseTech.has(normaliseTech(tech))).length * 2 +
        (project.context === base.context ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, count)
    .map(({ project }) => project);
}
