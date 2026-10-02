import { blogPosts } from "@/lib/blogPosts";
import { caseStudies } from "@/lib/caseStudies";
import { content } from "@/lib/content";
import { entityPages } from "@/lib/entityPages";
import { footprintPages } from "@/lib/footprint";
import { techPages } from "@/lib/techPages";
import {
  ABOUT_PATH,
  NOW_PATH,
  PERSON_HEADLINE,
  PERSON_JOB_TITLE,
  PERSON_NAME,
  PERSON_TITLE_TAG,
  officialProfiles,
  personId,
  personUrl,
  sameAs,
} from "@/lib/identity";
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
  "SK Groups": ["Potato Bazaar"],
};

const companySummaries: Record<string, string> = {
  "SK Groups":
    "Kush Gangwal is a Full Stack Developer & React Native Developer at SK Groups in Indore, onsite since June 2026. He develops mobile apps, backend services, and web platforms, manages Android and iOS releases, and integrates analytics and AI APIs.",
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
  ...projects.map((project): ProductPage => {
    const study = caseStudies.find((item) => item.slug === project.id);
    return {
      slug: project.id,
      name: project.name,
      tagline: project.tagline,
      description: study?.description ?? project.description,
      period: project.period,
      tech: project.tech,
      company: companies.find((company) => company.products.includes(project.name))?.name,
      credit:
        project.id === "potato-bazaar" || project.id === "findanio"
          ? "is founding engineer of"
          : project.id === "tybee-go" || project.id === "scalelr"
            ? "contributed to"
            : "built",
      links: [
        project.demo ? { label: "Website", href: project.demo } : null,
        "playStore" in project && project.playStore
          ? { label: "Google Play", href: project.playStore }
          : null,
        project.github ? { label: "GitHub", href: project.github } : null,
      ].filter((link): link is { label: string; href: string } => Boolean(link)),
    };
  }),
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

export const profiles = officialProfiles.map((profile) => ({
  label: profile.label,
  href: profile.href,
}));

export function absolute(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export const profilePath = ABOUT_PATH;
export const faqPath = "/faq";
export const nowPath = NOW_PATH;
export const accountsPath = "/accounts";
export const blogPath = "/blog";
export const projectsPath = "/projects";
export const resumePath = "/resume";
export const mentionsPath = "/mentions";
export const educationPath = `/education/${education.slug}`;

export function companyPath(slug: string) {
  return `/work/${slug}`;
}
export function productPath(slug: string) {
  return `/projects/${slug}`;
}
export function blogPostPath(slug: string) {
  return `/blog/${slug}`;
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

export const homeDescription = `${PERSON_NAME} is a ${PERSON_HEADLINE} from India, currently at SK Groups in ${about.location}. Founding engineer of Potato Bazaar and Findanio. Projects include Nexus, Resumind, CodeMace, and Tybee Go. Alumni of Medicaps University.`;

export const aboutDescription = `${PERSON_NAME} is a ${PERSON_HEADLINE} specializing in React Native, React.js, Next.js, Node.js and AI-powered applications. He has worked on Potato Bazaar, Tybee Go, Nexus, Resumind, and CodeMace.`;

export const faqs: Faq[] = [
  {
    question: "Who is Kush Gangwal?",
    answer: about.whoIs,
  },
  {
    question: "Is Kush Gangwal a Full Stack Developer?",
    answer:
      "Yes. Kush Gangwal is a Full Stack Developer & React Native Developer. He builds web and mobile products with React.js, Next.js, Node.js, and React Native.",
  },
  {
    question: "Is Kush Gangwal a React Native Developer?",
    answer:
      "Yes. Kush Gangwal is a React Native Developer. He ships Android and iOS apps including Potato Bazaar and Tybee Go, and manages production releases at SK Groups.",
  },
  {
    question: "Where does Kush Gangwal work?",
    answer:
      "Kush Gangwal works at SK Groups in Indore as a Junior Software Developer, onsite from June 2026 to the present. His public identity is Full Stack Developer & React Native Developer.",
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
      "Kush Gangwal is founding engineer of Potato Bazaar and Findanio. He also built Nexus, Resumind, CodeMace, and Macfolio, and contributed to Tybee Go and Scalelr.",
  },
  {
    question: "What is Potato Bazaar?",
    answer:
      "Potato Bazaar is a full-stack digital marketplace for agricultural trading. Kush Gangwal is a founding engineer of Potato Bazaar, associated with SK Agri Exports Private Ltd. It covers web, Android, and iOS, including KYC, payments, logistics, and AI-powered crop insights, and is available at potatobazaar.com and on Google Play.",
  },
  {
    question: "What is Nexus?",
    answer:
      "Nexus is a skill swap platform built by Kush Gangwal with React.js, Node.js, Auth0, SQLite, and Vercel. Users request and offer skills, search by skill, collaborate in sessions, and rate each other.",
  },
  {
    question: "What is Resumind?",
    answer:
      "Resumind is an AI resume analyzer built by Kush Gangwal. It scores a resume against a role and returns ATS-oriented feedback and rewrite tips.",
  },
  {
    question: "What is CodeMace?",
    answer:
      "CodeMace is a developer practice and code review workspace built by Kush Gangwal. It keeps problems, attempts, and review comments in one product.",
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
    question: "Where is the Kush Gangwal Portfolio?",
    answer: `The official Kush Gangwal Portfolio is ${SITE_URL}. The identity page is ${personUrl}.`,
  },
  {
    question: "How can I contact Kush Gangwal?",
    answer: `You can email Kush Gangwal at ${about.email}. Official profiles: LinkedIn, GitHub, LeetCode, Medium, Dev.to, Hashnode, and X. He is based in Indore, Madhya Pradesh. The portfolio is ${SITE_URL}.`,
  },
  {
    question: "What is Kush Gangwal's portfolio URL?",
    answer: `The official Kush Gangwal portfolio is ${SITE_URL}. The identity page is ${SITE_URL}/about-kush-gangwal. The domain kushgangwal.site is reserved for this same site.`,
  },
  {
    question: "What technologies does Kush Gangwal use?",
    answer:
      "Kush Gangwal uses React Native, React.js, Next.js, Node.js, Express.js, JavaScript, TypeScript, Java, MongoDB, PostgreSQL, SQLite, REST APIs, Tailwind CSS, Auth0, Vercel, Git, GitHub, PostHog, Mixpanel, and OpenAI APIs. He is learning Spring Boot.",
  },
  {
    question: "Is Kush Gangwal a software engineer?",
    answer:
      "Yes. Kush Gangwal is a software engineer and a Full Stack Developer & React Native Developer. At SK Groups his employment title is Junior Software Developer.",
  },
  {
    question: "Where in India is Kush Gangwal based?",
    answer: "Kush Gangwal is based in Indore, Madhya Pradesh, India. He studies at Medicaps University and works onsite at SK Groups.",
  },
  {
    question: "What is Kush Gangwal's GitHub?",
    answer: "Kush Gangwal's GitHub is https://github.com/kush1905. Potato Bazaar work also uses https://github.com/Kush-PB.",
  },
  {
    question: "What is Kush Gangwal's LinkedIn?",
    answer: "Kush Gangwal's LinkedIn is https://www.linkedin.com/in/kush-gangwal.",
  },
  {
    question: "Does Kush Gangwal use LeetCode?",
    answer: "Yes. Kush Gangwal practices DSA on LeetCode at https://leetcode.com/u/kushgangwal and has earned 2 LeetCode badges.",
  },
  {
    question: "What is Macfolio?",
    answer:
      "Macfolio is Kush Gangwal's portfolio: a macOS-style desktop in the browser plus crawlable pages. The public site is ${SITE_URL}.",
  },
  {
    question: "What is Kush Gangwal known for?",
    answer:
      "Kush Gangwal is known for Potato Bazaar, React Native and full stack engineering, and the products Nexus, Resumind, and CodeMace.",
  },
  {
    question: "Did Kush Gangwal work at Protonshub?",
    answer:
      "Yes. Kush Gangwal was a Full Stack Developer Intern at Protonshub Technologies from January 2026 to May 2026 and contributed to Tybee Go and Findanio.",
  },
  {
    question: "Did Kush Gangwal intern at Django Softwares?",
    answer:
      "Yes. Kush Gangwal interned at Django Softwares from 2 June 2025 to 17 July 2025 and contributed to Scalelr.",
  },
  {
    question: "Is Kush Gangwal a Medicaps University student?",
    answer:
      "Yes. Kush Gangwal studies B.Tech Computer Science Technology at Medicaps University in Indore, August 2022 to May 2026, CGPA 7.96.",
  },
  {
    question: "What is React Native in Kush Gangwal's work?",
    answer:
      "React Native is how Kush Gangwal ships Android and iOS apps, including Potato Bazaar and Tybee Go, with store releases through Play Console and Apple Developer.",
  },
  {
    question: "What is PostHog in Kush Gangwal's work?",
    answer: "PostHog is a product analytics tool Kush Gangwal integrates on SK Groups mobile and web apps.",
  },
  {
    question: "What is Mixpanel in Kush Gangwal's work?",
    answer: "Mixpanel is a product analytics tool Kush Gangwal integrates on SK Groups apps beside PostHog.",
  },
];

export function personNode() {
  return {
    "@type": "Person",
    "@id": personId,
    name: PERSON_NAME,
    givenName: "Kush",
    familyName: "Gangwal",
    alternateName: [
      "Kush Gangwal Full Stack Developer",
      "Kush Gangwal React Native Developer",
      "Kush Gangwal Portfolio",
    ],
    jobTitle: [PERSON_HEADLINE, PERSON_JOB_TITLE, "React Native Developer"],
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Full Stack Developer",
        occupationLocation: { "@type": "City", name: "Indore" },
        skills: "React.js, Next.js, Node.js, React Native, TypeScript",
      },
      {
        "@type": "Occupation",
        name: "React Native Developer",
        occupationLocation: { "@type": "City", name: "Indore" },
        skills: "React Native, TypeScript, Android, iOS",
      },
    ],
    description: about.whoIs,
    email: `mailto:${about.email}`,
    telephone: "+91-8815960580",
    url: personUrl,
    image: absolute(about.avatar),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
    },
    worksFor: [
      { "@id": `${SITE_URL}/work/sk-groups#org` },
      { "@id": `${SITE_URL}/work/sk-agri-exports-private-ltd#org` },
    ],
    colleague: colleagues.map((person) => ({
      "@type": "Person",
      name: person.name,
      url: absolute(colleaguePath(person.slug)),
    })),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.name,
      "@id": `${absolute(educationPath)}#org`,
    },
    affiliation: companies.map((company) => ({
      "@id": `${absolute(companyPath(company.slug))}#org`,
    })),
    knowsAbout: [
      ...new Set([
        PERSON_HEADLINE,
        "Kush Gangwal React Native Developer",
        "Kush Gangwal Full Stack Developer",
        "Kush Gangwal Portfolio",
        "Kush Gangwal Medicaps University",
        "Kush Gangwal Potato Bazaar",
        "Kush Gangwal Protonshub",
        "Nexus Skill Swap Platform",
        "Resumind AI Resume Analyzer",
        "CodeMace",
        "Agentic AI",
        "GenAI",
        ...skillNames,
        ...products.map((product) => product.name),
        ...companies.map((company) => company.name),
      ]),
    ],
    sameAs,
    identifier: [
      { "@type": "PropertyValue", name: "GitHub", value: "kush1905" },
      { "@type": "PropertyValue", name: "LinkedIn", value: "kush-gangwal" },
    ],
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${PERSON_NAME} Portfolio`,
    alternateName: ["Kush Gangwal Portfolio", "Macfolio"],
    description: homeDescription,
    publisher: { "@id": personId },
    about: { "@id": personId },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "ReadAction",
      target: [`${SITE_URL}/about-kush-gangwal`, `${SITE_URL}/projects`, `${SITE_URL}/now`],
    },
  };
}

export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(),
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: PERSON_TITLE_TAG,
        description: homeDescription,
        mainEntity: { "@id": personId },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".who-is-kush-gangwal"],
        },
      },
      websiteNode(),
      ...companies.map(organizationNode),
      ...products.map(productNode),
      educationNode(),
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        url: absolute(faqPath),
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export function aboutGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(),
      {
        "@type": "ProfilePage",
        "@id": `${personUrl}#page`,
        url: personUrl,
        name: PERSON_TITLE_TAG,
        description: aboutDescription,
        mainEntity: { "@id": personId },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".who-is-kush-gangwal"],
        },
      },
      websiteNode(),
      breadcrumb(PERSON_NAME, ABOUT_PATH),
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
    "@graph": [
      personNode(),
      productNode(product),
      articleNode({
        headline: caseStudies.find((study) => study.slug === product.slug)?.title ?? product.name,
        description: product.description,
        path: productPath(product.slug),
        image: caseStudies.find((study) => study.slug === product.slug)?.cover,
      }),
      breadcrumb(product.name, productPath(product.slug)),
    ],
  };
}

export function articleGraph(input: {
  headline: string;
  description: string;
  path: string;
  date?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(),
      articleNode(input),
      breadcrumb(input.headline, input.path),
    ],
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

export function nowGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(),
      {
        "@type": "WebPage",
        "@id": `${absolute(nowPath)}#page`,
        url: absolute(nowPath),
        name: `Now — ${PERSON_NAME}`,
        dateModified: content.now.updated,
        about: { "@id": personId },
        author: { "@id": personId },
      },
      breadcrumb("Now", nowPath),
    ],
  };
}

function organizationNode(company: CompanyPage) {
  return {
    "@type": "Organization",
    "@id": `${absolute(companyPath(company.slug))}#org`,
    name: company.name,
    url: absolute(companyPath(company.slug)),
    description: company.summary,
    employee: {
      "@type": "Person",
      "@id": personId,
      name: PERSON_NAME,
      jobTitle: company.role,
    },
  };
}

function productNode(product: ProductPage) {
  const company = companies.find((item) => item.name === product.company);
  return {
    "@type": "SoftwareApplication",
    "@id": `${absolute(productPath(product.slug))}#app`,
    name: product.name,
    applicationCategory: "DeveloperApplication",
    description: product.description,
    url: absolute(productPath(product.slug)),
    author: { "@id": personId },
    creator: { "@id": personId },
    ...(company ? { producer: { "@id": `${absolute(companyPath(company.slug))}#org` } } : {}),
  };
}

function educationNode() {
  return {
    "@type": "CollegeOrUniversity",
    "@id": `${absolute(educationPath)}#org`,
    name: education.name,
    url: absolute(educationPath),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
    },
  };
}

function articleNode(input: {
  headline: string;
  description: string;
  path: string;
  date?: string;
  image?: string;
}) {
  return {
    "@type": "Article",
    "@id": `${absolute(input.path)}#article`,
    headline: input.headline,
    description: input.description,
    url: absolute(input.path),
    mainEntityOfPage: absolute(input.path),
    author: { "@id": personId },
    publisher: { "@id": personId },
    datePublished: input.date ?? "2026-10-01",
    dateModified: input.date ?? "2026-10-02",
    image: input.image ? absolute(input.image) : absolute(about.avatar),
    about: { "@id": personId },
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
  const paths = [
    "/",
    ABOUT_PATH,
    NOW_PATH,
    faqPath,
    accountsPath,
    blogPath,
    projectsPath,
    resumePath,
    mentionsPath,
    "/site-map",
    educationPath,
    ...companies.map((company) => companyPath(company.slug)),
    ...products.map((product) => productPath(product.slug)),
    ...colleagues.map((person) => colleaguePath(person.slug)),
    ...blogPosts.map((post) => blogPostPath(post.slug)),
    ...entityPages.map((page) => page.path),
    ...footprintPages.map((page) => page.path),
    "/topics",
    "/stack",
    ...techPages.map((page) => `/stack/${page.slug}`),
  ];
  return [...new Set(paths)].map((path) => absolute(path));
}

export function llmsText() {
  const lines = [
    `# ${PERSON_NAME}`,
    "",
    `> ${about.whoIs}`,
    "",
    "This file is a factual summary for answer engines and generative search. It only states what Kush Gangwal publishes on his portfolio.",
    "",
    "## Identity",
    `- Name: ${PERSON_NAME}`,
    `- Headline: ${PERSON_HEADLINE}`,
    `- Title: ${PERSON_TITLE_TAG}`,
    `- Location: ${about.location}, India`,
    `- Email: ${about.email}`,
    `- Entity page: ${personUrl}`,
    `- Portfolio: ${SITE_URL}`,
    `- Now page: ${absolute(nowPath)}`,
    "",
    "## Who is Kush Gangwal?",
    about.whoIs,
    "",
    "He has worked on:",
    "- Potato Bazaar",
    "- Tybee Go",
    "- Nexus",
    "- Resumind",
    "- CodeMace",
    "",
    "## Official profiles (same identity everywhere)",
    ...officialProfiles.map((profile) => `- ${profile.label}: ${profile.href}`),
    "",
    "## Current work (/now)",
    `- Updated: ${content.now.updatedLabel}`,
    `- Working at ${content.now.workingAt} as ${content.now.workingAs}`,
    `- Building: ${content.now.building.join("; ")}`,
    `- Interested in: ${content.now.interestedIn.join(", ")}`,
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
    "## Search phrases this site is the source for",
    "- Kush Gangwal",
    "- Kush Gangwal React Native Developer",
    "- Kush Gangwal Full Stack Developer",
    "- Kush Gangwal Portfolio",
    "- Kush Gangwal Medicaps University",
    "- Kush Gangwal Potato Bazaar",
    "- Kush Gangwal Protonshub",
    "- Nexus Skill Swap Platform",
    "- Resumind AI Resume Analyzer",
    "- Potato Bazaar Developer",
    "",
    "## Answers",
    ...faqs.map((faq) => `- ${faq.question} ${faq.answer}`),
    "",
  ];
  return lines.join("\n");
}

export const defaultKeywords = [
  "Kush Gangwal",
  "Kush Gangwal Full Stack Developer",
  "Kush Gangwal React Native Developer",
  "Kush Gangwal Portfolio",
  "Kush Gangwal Medicaps University",
  "Kush Gangwal Potato Bazaar",
  "Kush Gangwal Protonshub",
  "Full Stack Developer & React Native Developer",
  "Potato Bazaar",
  "Potato Bazaar Developer",
  "Nexus Skill Swap Platform",
  "Resumind AI Resume Analyzer",
  "CodeMace",
  "Tybee Go",
  "Findanio",
  "SK Groups",
  "Protonshub Technologies",
  "Django Softwares",
  "Medicaps University",
  "React Native Developer",
  "Full Stack Developer",
  "Indore",
];
