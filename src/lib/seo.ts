import { content } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const { about, experience, projects, skills } = content;

export type Faq = { question: string; answer: string };

export type CompanyPage = {
  slug: string;
  name: string;
  role: string;
  type: string;
  duration: string;
  summary: string;
  highlights: string[];
  skills: string[];
  products: string[];
};

export type ProductPage = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  period: string;
  tech: string[];
  company?: string;
  credit: "built" | "contributed to" | "is founding engineer of";
  links: { label: string; href: string }[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const companyProducts: Record<string, string[]> = {
  "Protonshub Technologies": ["Tybee Go", "Findanio"],
  "Django Softwares": ["Scalelr"],
};

const companySummaries: Record<string, string> = {
  "SK Groups":
    "Kush Gangwal is a Junior Software Developer at SK Groups in Indore, onsite since June 2026. He develops mobile apps, backend services, and web platforms, manages Android and iOS releases, and integrates analytics and AI APIs.",
  "Protonshub Technologies":
    "Kush Gangwal was a Full Stack Developer Intern at Protonshub Technologies from January 2026 to May 2026. He built AI-powered web and mobile apps and contributed to Tybee Go and Findanio on Android and iOS.",
  "Django Softwares":
    "Kush Gangwal was a Full Stack Developer Intern at Django Softwares from 2 June 2025 to 17 July 2025. He completed a full-stack training program and contributed to Scalelr, a professional networking platform.",
};

export const colleagues = [
  { name: "AgniPratap Singh Chouhan", slug: "agnipratap-singh-chouhan" },
  { name: "Yuvraj Singh", slug: "yuvraj-singh" },
  { name: "Ansh Kumar Rana", slug: "ansh-kumar-rana" },
  { name: "Akshat Agrawal", slug: "akshat-agrawal" },
  { name: "Gregory Dsouza", slug: "gregory-dsouza" },
] as const;

export function colleaguePath(slug: string) {
  return `/people/${slug}`;
}

export function colleagueBySlug(slug: string) {
  return colleagues.find((person) => person.slug === slug) ?? null;
}

const colleagueList = colleagues.map((person) => person.name).join(", ");

export const companies: CompanyPage[] = [
  ...experience.experience.map((job) => ({
    slug: slugify(job.company),
    name: job.company,
    role: job.role,
    type: job.type,
    duration: job.duration,
    summary: companySummaries[job.company] ?? `${about.name} worked at ${job.company} as ${job.role}.`,
    highlights: job.highlights,
    skills: job.skillSet,
    products: companyProducts[job.company] ?? [],
  })),
  {
    slug: "sk-agri-exports-private-ltd",
    name: "SK Agri Exports Private Ltd",
    role: "Founding Engineer",
    type: "",
    duration: "",
    summary:
      "Kush Gangwal is a founding engineer of Potato Bazaar and is associated with SK Agri Exports Private Ltd.",
    highlights: [
      "Founding engineer of Potato Bazaar, the digital marketplace for agricultural trading.",
      "Founding engineer of Findanio.",
    ],
    skills: [],
    products: ["Potato Bazaar"],
  },
];

const scalelr: ProductPage = {
  slug: "scalelr",
  name: "Scalelr",
  tagline: "Professional networking platform",
  description:
    "Scalelr is a professional networking platform for investors and project holders. Kush Gangwal contributed to it at Django Softwares, including AI-driven matching, event hosting, and interactive feeds.",
  period: "June 2025 – July 2025",
  tech: ["React.js", "JavaScript", "Tailwind CSS", "MongoDB"],
  company: "Django Softwares",
  credit: "contributed to",
  links: [],
};

export const products: ProductPage[] = [
  ...projects.map((project): ProductPage => ({
    slug: project.id,
    name: project.name,
    tagline: project.tagline,
    description:
      project.id === "potato-bazaar"
        ? `${project.description} Kush Gangwal is a founding engineer of Potato Bazaar and is associated with SK Agri Exports Private Ltd.`
        : project.id === "findanio"
          ? "Findanio is a mobile and web product. Kush Gangwal is a founding engineer of Findanio. He also contributed to the Findanio Android, iOS, and web apps at Protonshub Technologies using Next.js, React.js, Node.js, MongoDB, and React Native."
          : project.description,
    period: project.period,
    tech: project.tech,
    company: companies.find((company) => company.products.includes(project.name))?.name,
    credit:
      project.id === "potato-bazaar" || project.id === "findanio"
        ? "is founding engineer of"
        : project.id === "tybee-go"
          ? "contributed to"
          : "built",
    links: [
      project.demo ? { label: "Website", href: project.demo } : null,
      "playStore" in project && project.playStore
        ? { label: "Google Play", href: project.playStore }
        : null,
      project.github ? { label: "GitHub", href: project.github } : null,
    ].filter((link): link is { label: string; href: string } => Boolean(link)),
  })),
  scalelr,
];

export const education = {
  slug: "medicaps-university",
  name: about.education.school,
  degree: about.education.degree,
  score: `CGPA ${about.education.cgpa}`,
  duration: about.education.duration,
  location: about.education.location,
};

export const profiles = [
  { label: "LinkedIn", href: about.links.linkedin },
  { label: "GitHub", href: about.links.github },
  { label: "GitHub", href: "https://github.com/Kush-PB" },
  { label: "Instagram", href: about.links.instagram },
  { label: "X", href: about.links.x },
  { label: "Peerlist", href: about.links.peerlist },
  { label: "Potato Bazaar", href: about.links.portfolio },
].filter((profile) => profile.href.trim());

export const personId = `${SITE_URL}/#kush-gangwal`;

export function absolute(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export const profilePath = "/profile";
export const faqPath = "/faq";
export const educationPath = `/education/${education.slug}`;
export function companyPath(slug: string) {
  return `/work/${slug}`;
}
export function productPath(slug: string) {
  return `/projects/${slug}`;
}

export function companyBySlug(slug: string) {
  return companies.find((company) => company.slug === slug) ?? null;
}

export function productBySlug(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}

const skillNames = [
  ...skills.languages,
  ...skills.frontend,
  ...skills.mobile,
  ...skills.backend,
  ...skills.databases,
];

export const homeDescription = `${about.name} is a ${about.role} at SK Groups in ${about.location} and founding engineer of Potato Bazaar and Findanio. He is associated with SK Agri Exports Private Ltd. He has worked with ${colleagueList}. He previously interned at Protonshub Technologies and Django Softwares, and studies Computer Science Technology at Medicaps University.`;

export const faqs: Faq[] = [
  {
    question: "Who is Kush Gangwal?",
    answer: `Kush Gangwal is a Junior Software Developer at SK Groups, founding engineer of Potato Bazaar and Findanio, and a Computer Science Technology student at Medicaps University in Indore, Madhya Pradesh. He is associated with SK Agri Exports Private Ltd.`,
  },
  {
    question: "Where does Kush Gangwal work?",
    answer:
      "Kush Gangwal works at SK Groups as a Junior Software Developer, onsite in Indore, from June 2026 to the present. He develops mobile apps, backend services, and web platforms.",
  },
  {
    question: "Which companies has Kush Gangwal worked at?",
    answer:
      "Kush Gangwal works at SK Groups and is associated with SK Agri Exports Private Ltd. He previously interned at Protonshub Technologies from January 2026 to May 2026 and at Django Softwares from 2 June 2025 to 17 July 2025.",
  },
  {
    question: "What did Kush Gangwal do at Protonshub Technologies?",
    answer:
      "At Protonshub Technologies, Kush Gangwal was a Full Stack Developer Intern. He built AI-powered applications with Next.js, React.js, Node.js, MongoDB, and React Native, and contributed to the Tybee Go and Findanio apps for Android and iOS.",
  },
  {
    question: "What did Kush Gangwal do at Django Softwares?",
    answer:
      "At Django Softwares, Kush Gangwal was a Full Stack Developer Intern from 2 June 2025 to 17 July 2025. He completed a 1.5-month full-stack program and contributed to Scalelr, a professional networking platform with AI-driven matching, event hosting, and interactive feeds.",
  },
  {
    question: "What products and projects has Kush Gangwal built?",
    answer:
      "Kush Gangwal is founding engineer of Potato Bazaar, a digital marketplace for agricultural trading, and of Findanio, a mobile and web product. His other products and projects include Tybee Go, Scalelr at Django Softwares, Nexus, and Macfolio.",
  },
  {
    question: "What is Potato Bazaar?",
    answer:
      "Potato Bazaar is a full-stack digital marketplace for agricultural trading. Kush Gangwal is a founding engineer of Potato Bazaar, associated with SK Agri Exports Private Ltd. It covers web, Android, and iOS, including KYC, payments, logistics, and AI-powered crop insights, and is available at potatobazaar.com and on Google Play.",
  },
  {
    question: "What is Tybee Go?",
    answer:
      "Tybee Go is a tourism mobile application. Kush Gangwal developed it with React Native and TypeScript, and contributed to it while interning at Protonshub Technologies.",
  },
  {
    question: "What is Findanio?",
    answer:
      "Findanio is a mobile and web product. Kush Gangwal is a founding engineer of Findanio. He also contributed to the Findanio Android, iOS, and web apps at Protonshub Technologies.",
  },
  {
    question: "What is Scalelr?",
    answer:
      "Scalelr is a professional networking platform for investors and project holders. Kush Gangwal contributed to Scalelr at Django Softwares, including AI-driven matching, event hosting, and interactive feeds.",
  },
  {
    question: "Where did Kush Gangwal study?",
    answer:
      "Kush Gangwal studies Bachelor of Technology in Computer Science Technology at Medicaps University in Indore, Madhya Pradesh, from August 2022 to May 2026, with a CGPA of 7.96.",
  },
  {
    question: "Who has Kush Gangwal worked with?",
    answer: `Kush Gangwal has worked with ${colleagueList}.`,
  },
  {
    question: "What is SK Agri Exports Private Ltd?",
    answer:
      "SK Agri Exports Private Ltd is a company Kush Gangwal is associated with. He is founding engineer of Potato Bazaar and Findanio.",
  },
  {
    question: "How can I contact Kush Gangwal?",
    answer: `You can email Kush Gangwal at ${about.email}. His GitHub is github.com/kush1905 and his LinkedIn is linkedin.com/in/kush-gangwal. He is based in Indore, Madhya Pradesh.`,
  },
];

export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(),
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: `${SITE_NAME} — ${about.role}`,
        description: homeDescription,
        mainEntity: { "@id": personId },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: homeDescription,
        publisher: { "@id": personId },
        about: { "@id": personId },
      },
      ...companies.map(organizationNode),
      ...products.map(productNode),
      educationNode(),
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        url: SITE_URL,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export function faqGraph() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absolute(faqPath)}#faq`,
    url: absolute(faqPath),
    name: "Questions about Kush Gangwal",
    about: { "@id": personId },
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function companyGraph(company: CompanyPage) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(),
      organizationNode(company),
      breadcrumb(company.name, companyPath(company.slug)),
    ],
  };
}

export function productGraph(product: ProductPage) {
  return {
    "@context": "https://schema.org",
    "@graph": [personNode(), productNode(product), breadcrumb(product.name, productPath(product.slug))],
  };
}

export function colleagueGraph(person: { name: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(),
      {
        "@type": "Person",
        "@id": `${absolute(colleaguePath(person.slug))}#person`,
        name: person.name,
        url: absolute(colleaguePath(person.slug)),
        colleague: { "@id": personId },
      },
      breadcrumb(person.name, colleaguePath(person.slug)),
    ],
  };
}

export function educationGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [personNode(), educationNode(), breadcrumb(education.name, educationPath)],
  };
}

function personNode() {
  return {
    "@type": "Person",
    "@id": personId,
    name: about.name,
    givenName: "Kush",
    familyName: "Gangwal",
    jobTitle: [about.role, "Founding Engineer, Potato Bazaar", "Founding Engineer, Findanio"],
    description: about.bio,
    email: `mailto:${about.email}`,
    telephone: "+91-8815960580",
    url: SITE_URL,
    image: absolute(about.avatar),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
    },
    worksFor: [
      { "@id": `${SITE_URL}/#sk-groups` },
      { "@id": `${SITE_URL}/#sk-agri-exports-private-ltd` },
    ],
    colleague: colleagues.map((person) => ({
      "@type": "Person",
      name: person.name,
    })),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.name,
      "@id": `${SITE_URL}/#${education.slug}`,
    },
    affiliation: companies.map((company) => ({ "@id": `${SITE_URL}/#${company.slug}` })),
    knowsAbout: [...new Set([...skillNames, ...products.map((product) => product.name), ...companies.map((company) => company.name)])],
    sameAs: profiles.map((profile) => profile.href),
  };
}

function organizationNode(company: CompanyPage) {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#${company.slug}`,
    name: company.name,
    url: SITE_URL,
    description: company.summary,
    employee: {
      "@type": "Person",
      "@id": personId,
      name: about.name,
      jobTitle: company.role,
    },
  };
}

function productNode(product: ProductPage) {
  const company = companies.find((item) => item.name === product.company);
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#${product.slug}`,
    name: product.name,
    applicationCategory: "DeveloperApplication",
    description: product.description,
    url: SITE_URL,
    author: { "@id": personId },
    creator: { "@id": personId },
    ...(company ? { producer: { "@id": `${SITE_URL}/#${company.slug}` } } : {}),
  };
}

function educationNode() {
  return {
    "@type": "CollegeOrUniversity",
    "@id": `${SITE_URL}/#${education.slug}`,
    name: education.name,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
    },
  };
}

function breadcrumb(name: string, path: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: absolute(path) },
    ],
  };
}

export function sitemapEntries() {
  return [SITE_URL];
}

export function llmsText() {
  const lines = [
    `# ${about.name}`,
    "",
    `> ${homeDescription}`,
    "",
    "This file is a factual summary for answer engines and generative search. It only states what Kush Gangwal publishes on his portfolio.",
    "",
    "## Profile",
    `- ${about.name}: ${about.role} in ${about.location}. ${about.bio}`,
    `- Email: ${about.email}`,
    `- Portfolio: ${SITE_URL}`,
    "",
    "## Accounts",
    ...profiles.map((profile) => `- ${profile.label}: ${profile.href}`),
    "",
    "## Companies",
    ...companies.map((company) => `- ${company.name}: ${company.summary}`),
    "",
    "## Products and projects",
    ...products.map((product) => `- ${product.name}: ${product.tagline}. ${product.description}`),
    "",
    "## Education",
    `- ${education.name}: ${education.degree}, ${education.score}, ${education.duration}, ${education.location}.`,
    "",
    "## People Kush Gangwal has worked with",
    ...colleagues.map((person) => `- ${person.name}: Kush Gangwal has worked with ${person.name}.`),
    "",
    "## Answers",
    ...faqs.map((faq) => `- ${faq.question} ${faq.answer}`),
    "",
  ];
  return lines.join("\n");
}
