import { agriCompanies, agriIndustries, agriSearchPages } from "@/lib/agriGraph";
import { spellingPages } from "@/lib/spellings";
import { blogPosts } from "@/lib/blogPosts";
import { caseStudies } from "@/lib/caseStudies";
import { content } from "@/lib/content";
import { entityPages } from "@/lib/entityPages";
import { FDE_ORG_LEGAL_NAME, FDE_ORG_NAME, FDE_ROLE, fdeFaqs, fdePage } from "@/lib/fdePage";
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
import { CONTENT_UPDATED, SITE_NAME, SITE_URL } from "@/lib/site";

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
  credit: "built" | "contributed to" | "develops";
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
    "Kush Gangwal has been a Junior Software Developer at SK Groups in Ahmedabad since June 2026. He develops Potato Bazaar's React Native mobile app for Android and iOS, its backend, its web platform, and related products, manages Android and iOS releases, and integrates analytics and AI APIs.",
  "Protonshub Technologies":
    "Kush Gangwal was a Full Stack Developer Intern at Protonshub Technologies from January 2026 to May 2026. He built full-stack web and mobile apps, including AI API integrations, and contributed to Tybee Go and Findanio on Android and iOS.",
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
    role: "Developer, Potato Bazaar",
    type: "",
    duration: "",
    summary:
      "SK Agri Exports Private Limited operates Potato Bazaar. Kush Gangwal develops Potato Bazaar's mobile app, backend and web platform as a developer at SK Groups.",
    highlights: [
      "Potato Bazaar, the digital marketplace for agricultural trading, was founded in 2024 by SK Agri Exports.",
      "Kush Gangwal works on Potato Bazaar's React Native app for Android and iOS, its backend, and its web platform.",
    ],
    skills: [],
    products: ["Potato Bazaar"],
  },
];

/**
 * Drops placeholder links: the bare personal GitHub profile isn't a project link, and a
 * "Website" that is really a GitHub repo duplicates the GitHub button.
 */
function isProjectLink(link: { label: string; href: string }) {
  if (/^https:\/\/github\.com\/kush1905\/?$/i.test(link.href)) return false;
  if (link.label === "Website" && /^https:\/\/github\.com\//i.test(link.href)) return false;
  return true;
}

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
        project.id === "potato-bazaar"
          ? "develops"
          : project.id === "tybee-go" || project.id === "findanio" || project.id === "scalelr"
            ? "contributed to"
            : "built",
      links: [
        project.demo ? { label: "Website", href: project.demo } : null,
        "playStore" in project && project.playStore
          ? { label: "Google Play", href: project.playStore }
          : null,
        project.github ? { label: "GitHub", href: project.github } : null,
      ]
        .filter((link): link is { label: string; href: string } => Boolean(link))
        .filter(isProjectLink)
        .filter((link, index, list) => list.findIndex((l) => l.href === link.href) === index),
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

export const homeDescription = `${PERSON_NAME} is a full stack and React Native developer at SK Groups in Ahmedabad, building Potato Bazaar's mobile app, backend and web platform.`;

export const aboutDescription = `${PERSON_NAME}, Full Stack and React Native Developer at SK Groups, Ahmedabad. Develops Potato Bazaar; built Nexus, Resumind and CodeMace.`;

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
      "Yes. Kush Gangwal is a React Native Developer. He works on the Potato Bazaar Android and iOS app at SK Groups, manages its production releases, and contributed to Tybee Go during his Protonshub internship.",
  },
  {
    question: "Where does Kush Gangwal work?",
    answer:
      "Kush Gangwal works at SK Groups in Ahmedabad as a Junior Software Developer, from June 2026 to the present, where he develops Potato Bazaar's mobile app, backend, and web platform. He grew up in Bakaner, Dhar district, Madhya Pradesh, and graduated from Medicaps University in Indore.",
  },
  {
    question: "Which companies has Kush Gangwal worked at?",
    answer:
      "Kush Gangwal works at SK Groups, where he develops Potato Bazaar, the marketplace operated by SK Agri Exports Private Limited. He previously interned at Protonshub Technologies from January 2026 to May 2026 and at Django Softwares from 2 June 2025 to 17 July 2025.",
  },
  {
    question: "What did Kush Gangwal do at Protonshub Technologies?",
    answer:
      "At Protonshub Technologies, Kush Gangwal was a Full Stack Developer Intern from January 2026 to May 2026. He built full-stack applications with Next.js, React.js, Node.js, MongoDB, and React Native, including AI API integrations, and contributed to the Tybee Go app and to Findanio's Android, iOS, and web apps.",
  },
  {
    question: "What did Kush Gangwal do at Django Softwares?",
    answer:
      "At Django Softwares, Kush Gangwal was a Full Stack Developer Intern from 2 June 2025 to 17 July 2025. He completed a 1.5-month full-stack program and contributed to Scalelr, a professional networking platform with AI-driven matching, event hosting, and interactive feeds.",
  },
  {
    question: "What products and projects has Kush Gangwal worked on?",
    answer:
      "Kush Gangwal develops Potato Bazaar's mobile app, backend, and web platform at SK Groups. He built Nexus, Resumind, CodeMace, and Macfolio, and contributed to Tybee Go and Findanio at Protonshub Technologies and to Scalelr at Django Softwares.",
  },
  {
    question: "What is Potato Bazaar?",
    answer:
      "Potato Bazaar is India's digital potato marketplace, founded in 2024 by SK Agri Exports and powered by S K AGRI EXPORTS PRIVATE LIMITED. It connects farmers, traders, cold storage, and buyers, with a marketplace, cold storage booking, mandi prices, and an AI Crop Doctor. Its about page names Sandeep Kumar as Founder & CEO. Kush Gangwal is a developer on Potato Bazaar at SK Groups in Ahmedabad.",
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
      "Tybee Go is a tourism mobile application. Kush Gangwal contributed features to it with React Native and TypeScript while interning at Protonshub Technologies.",
  },
  {
    question: "What is Findanio?",
    answer:
      "Findanio is a mobile and web product. Kush Gangwal contributed to Findanio's Android, iOS, and web apps at Protonshub Technologies during his internship.",
  },
  {
    question: "What is Scalelr?",
    answer:
      "Scalelr is a professional networking platform for investors and project holders, with AI-driven matching, event hosting, and interactive feeds. Kush Gangwal contributed to Scalelr at Django Softwares.",
  },
  {
    question: "Where did Kush Gangwal study?",
    answer:
      "Kush Gangwal graduated with a Bachelor of Technology in Computer Science Technology from Medicaps University in Indore, Madhya Pradesh, August 2022 to May 2026, with a CGPA of 7.96. He grew up in Bakaner, Dhar district, Madhya Pradesh, and now works in Ahmedabad.",
  },
  {
    question: "Who has Kush Gangwal worked with?",
    answer: `Kush Gangwal has worked with ${colleagueList}.`,
  },
  {
    question: "What is SK Agri Exports Private Ltd?",
    answer:
      "SK Agri Exports Private Ltd operates Potato Bazaar. Kush Gangwal develops Potato Bazaar's mobile app, backend, and web platform as a developer at SK Groups.",
  },
  {
    question: "Where is the Kush Gangwal Portfolio?",
    answer: `The official Kush Gangwal Portfolio is ${SITE_URL}. The about page is ${personUrl}.`,
  },
  {
    question: "How can I contact Kush Gangwal?",
    answer: `You can email Kush Gangwal at ${about.email}. Official profiles: LinkedIn, GitHub, LeetCode, Medium, Dev.to, Hashnode, and X. He grew up in Bakaner, Madhya Pradesh, graduated in Indore, and works in Ahmedabad. The portfolio is ${SITE_URL}.`,
  },
  {
    question: "What is Kush Gangwal's portfolio URL?",
    answer: `The official Kush Gangwal portfolio is ${SITE_URL}. The home page is an interactive 3D portfolio, the about page is ${SITE_URL}/about-kush-gangwal, and the macOS-style desktop is at ${SITE_URL}/desktop.`,
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
    answer:
      "Kush Gangwal grew up in Bakaner, in the Dhar district of Madhya Pradesh. He graduated from Medicaps University in Indore, Madhya Pradesh. He currently works at SK Groups in Ahmedabad, Gujarat.",
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
    answer: `Macfolio is Kush Gangwal's portfolio: an interactive 3D home page, a macOS-style desktop in the browser at /desktop, and plain pages about his work. The public site is ${SITE_URL}.`,
  },
  {
    question: "What is Kush Gangwal known for?",
    answer:
      "Kush Gangwal is known for his work on Potato Bazaar, React Native and full stack engineering, and the products Nexus, Resumind, and CodeMace.",
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
      "He has graduated. Kush Gangwal completed a B.Tech in Computer Science Technology at Medicaps University in Indore, August 2022 to May 2026, CGPA 7.96. He grew up in Bakaner, Madhya Pradesh, and works in Ahmedabad.",
  },
  {
    question: "What is React Native in Kush Gangwal's work?",
    answer:
      "React Native is how Kush Gangwal ships Android and iOS apps. He works on the Potato Bazaar app at SK Groups, with store releases through Play Console and Apple Developer, and contributed to Tybee Go at Protonshub Technologies.",
  },
  {
    question: "What is PostHog in Kush Gangwal's work?",
    answer: "PostHog is a product analytics tool Kush Gangwal integrates on SK Groups mobile and web apps.",
  },
  {
    question: "What is Mixpanel in Kush Gangwal's work?",
    answer: "Mixpanel is a product analytics tool Kush Gangwal integrates on SK Groups apps beside PostHog.",
  },
  {
    question: "What does Kush Gangwal do on Potato Bazaar?",
    answer:
      "Kush Gangwal works as a Forward Deployed Engineer on Potato Bazaar at SK Groups (S K Agri Exports Private Limited) in Ahmedabad. He builds its production AI layer, with RAG over embeddings, LLM workflows and Indian-language voice, and works across its React Native mobile app for Android and iOS, its backend, its web platform, and related products. Potato Bazaar's about page names Sandeep Kumar as Founder & CEO.",
  },
  {
    question: "What does Potato Bazaar do?",
    answer:
      "Potato Bazaar connects farmers, traders, cold storage facilities, and institutional buyers. Its about page lists a marketplace, cold storage booking, mandi prices, an AI Crop Doctor, and a business directory. S K AGRI EXPORTS PRIVATE LIMITED powers the product. Kush Gangwal works on its mobile app, backend, and web platform as a developer at SK Groups.",
  },
  {
    question: "How does Potato Bazaar help potato traders?",
    answer:
      "Potato Bazaar gives traders a marketplace on web and in the React Native app: listings, KYC, payments, and logistics. Kush Gangwal works on that software as a developer at SK Groups.",
  },
  {
    question: "What is SK Agri Exports Private Limited?",
    answer:
      "SK Agri Exports Private Limited is the potato export company that operates Potato Bazaar; SK Groups is the same company. Kush Gangwal works there as a Forward Deployed Engineer on Potato Bazaar, building its AI layer, mobile app, backend, and web platform.",
  },
  {
    question: "What is SK Groups?",
    answer:
      "SK Groups is Kush Gangwal's employer in Ahmedabad. He has been a Junior Software Developer there since June 2026, developing Potato Bazaar's mobile app, backend, and web platform. Potato Bazaar is powered by SK Agri Exports Private Limited.",
  },
  {
    question: "What is Mantra Agri Solutions?",
    answer:
      "Mantra Agri Solutions is a potato procurement and export venture supported by the SK Group and Haldiram ecosystem. Kush Gangwal does not list it as an employer. His connection is Potato Bazaar, the marketplace operated by SK Agri Exports Private Limited.",
  },
  {
    question: "How does cold storage work in potato trading?",
    answer:
      "Potato Bazaar's about page lets people find, book, and list cold storage, and manage inventory beside potato trading. Kush Gangwal works on that software at SK Groups. He does not operate the warehouses. SK Agri Exports Private Limited powers Potato Bazaar.",
  },
  {
    question: "What technology powers Potato Bazaar?",
    answer:
      "Potato Bazaar uses React.js, Next.js, Node.js, and React Native, and Kush Gangwal works across that stack as a developer at SK Groups. The about page also describes AI crop diagnosis, market intelligence, and escrow. The Android package is com.potatobazaar.",
  },
  {
    question: "Is Potato Bazaar a potato trading platform in India?",
    answer:
      "Yes. Potato Bazaar is a potato trading platform in India, operated by SK Agri Exports Private Limited. Kush Gangwal is one of its developers at SK Groups.",
  },
  {
    question: "Where did Kush Gangwal grow up?",
    answer:
      "Kush Gangwal grew up in Bakaner, in the Dhar district of Madhya Pradesh. He later graduated in Indore and now works in Ahmedabad.",
  },
  {
    question: "Where did Kush Gangwal graduate?",
    answer:
      "Kush Gangwal graduated from Medicaps University in Indore, Madhya Pradesh, with a B.Tech in Computer Science Technology, August 2022 to May 2026, CGPA 7.96.",
  },
  {
    question: "Where does Kush Gangwal work now?",
    answer:
      "Kush Gangwal currently works in Ahmedabad, Gujarat, at SK Groups, as a Junior Software Developer on Potato Bazaar.",
  },
  {
    question: "Is Kush Gangawal the same person as Kush Gangwal?",
    answer:
      "Yes. Kush Gangawal, Kush Gangwall, Kush Gangval, Koosh Gangwal, and Kaush Gangwal are misspellings of Kush Gangwal, the Full Stack Developer and React Native Developer who grew up in Bakaner, Madhya Pradesh, graduated in Indore, and works at SK Groups in Ahmedabad.",
  },
  {
    question: "Is Potato Bazar the same as Potato Bazaar?",
    answer:
      "Yes. Potato Bazar, Potato Bajjar, and Potatobazar are misspellings of Potato Bazaar, the marketplace whose mobile app, backend, and web platform Kush Gangwal develops at SK Groups in Ahmedabad.",
  },
];

export function personNode() {
  return {
    "@type": "Person",
    "@id": personId,
    name: PERSON_NAME,
    givenName: "Kush",
    familyName: "Gangwal",
    jobTitle: [PERSON_HEADLINE, PERSON_JOB_TITLE, "React Native Developer"],
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Full Stack Developer",
        occupationLocation: { "@type": "City", name: "Ahmedabad" },
        skills: "React.js, Next.js, Node.js, React Native, TypeScript",
      },
      {
        "@type": "Occupation",
        name: "React Native Developer",
        occupationLocation: { "@type": "City", name: "Ahmedabad" },
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
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    homeLocation: {
      "@type": "Place",
      name: "Bakaner",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Madhya Pradesh",
        addressCountry: "IN",
      },
      containedInPlace: { "@type": "AdministrativeArea", name: "Dhar district" },
    },
    worksFor: { "@id": `${SITE_URL}/work/sk-groups#org` },
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
    affiliation: companies
      .filter((company) => company.slug !== "sk-groups")
      .map((company) => ({
        "@id": `${absolute(companyPath(company.slug))}#org`,
      })),
    knowsAbout: [
      ...new Set([
        ...skillNames,
        "Full stack development",
        "Mobile app development",
        "Android and iOS app releases",
        "REST API design",
        "Product analytics",
        "AI API integration",
        "Agritech marketplaces",
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
      websiteNode(),
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: PERSON_TITLE_TAG,
        description: homeDescription,
        about: { "@id": personId },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        primaryImageOfPage: { "@type": "ImageObject", url: absolute(about.avatar) },
        inLanguage: "en-IN",
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#projects`,
        name: `Projects by ${PERSON_NAME}`,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.name,
          url: absolute(productPath(product.slug)),
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

export function fdeGraph() {
  const person = { ...personNode(), colleague: undefined };
  const orgId = `${SITE_URL}/work/sk-groups#org`;
  const appId = `${absolute(productPath("potato-bazaar"))}#app`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...person,
        jobTitle: [FDE_ROLE, ...person.jobTitle],
        hasOccupation: [
          {
            "@type": "Occupation",
            name: FDE_ROLE,
            occupationLocation: { "@type": "City", name: "Ahmedabad" },
            skills: "RAG, embeddings, LLM workflows, Sarvam AI, speech-to-text, text-to-speech, React Native, Next.js, Node.js",
          },
          ...person.hasOccupation,
        ],
        knowsAbout: [
          ...new Set([
            "Forward deployed engineering",
            "Retrieval-augmented generation",
            "Embeddings",
            "LLM workflows",
            ...person.knowsAbout,
          ]),
        ],
      },
      {
        "@type": "Organization",
        "@id": orgId,
        name: FDE_ORG_NAME,
        legalName: FDE_ORG_LEGAL_NAME,
        alternateName: ["SK Agri Exports", "SK Agri Exports Private Limited", "S K Agri Exports Private Limited"],
        address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressRegion: "Gujarat", addressCountry: "IN" },
        employee: { "@id": personId },
      },
      {
        "@type": "SoftwareApplication",
        "@id": appId,
        name: "Potato Bazaar",
        alternateName: ["Potato Bazar", "PotatoBazaar"],
        applicationCategory: "BusinessApplication",
        operatingSystem: "Android, iOS, Web",
        installUrl: "https://play.google.com/store/apps/details?id=com.potatobazaar",
        sameAs: ["https://potatobazaar.com", "https://play.google.com/store/apps/details?id=com.potatobazaar"],
        publisher: { "@id": orgId },
        contributor: { "@id": personId },
      },
      {
        ...articleNode({
          headline: fdePage.title,
          description: fdePage.description,
          path: fdePage.path,
          date: fdePage.datePublished,
          image: fdePage.image,
        }),
        about: [{ "@id": personId }, { "@id": appId }],
        mentions: [{ "@id": orgId }],
        keywords: fdePage.keywords.join(", "),
      },
      {
        "@type": "FAQPage",
        "@id": `${absolute(fdePage.path)}#faq`,
        url: absolute(fdePage.path),
        about: { "@id": personId },
        mainEntity: fdeFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      breadcrumb(fdePage.h1, fdePage.path),
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
    ...(company.slug === "sk-agri-exports-private-ltd"
      ? {}
      : {
          employee: {
            "@type": "Person",
            "@id": personId,
            name: PERSON_NAME,
            jobTitle: company.role,
          },
        }),
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
    ...(product.credit === "built"
      ? { author: { "@id": personId }, creator: { "@id": personId } }
      : { contributor: { "@id": personId } }),
    ...(company ? { producer: { "@id": `${absolute(companyPath(company.slug))}#org` } } : {}),
    ...(product.slug === "potato-bazaar"
      ? {
          applicationCategory: "BusinessApplication",
          operatingSystem: "Android, iOS, Web",
          installUrl: "https://play.google.com/store/apps/details?id=com.potatobazaar",
          featureList: [
            "Marketplace",
            "Cold storage booking",
            "Mandi prices",
            "AI Crop Doctor",
            "KYC",
            "Payments",
            "Logistics",
          ],
          publisher: { "@id": `${SITE_URL}/work/sk-agri-exports-private-ltd#org` },
        }
      : {}),
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
    dateModified: input.date && input.date > CONTENT_UPDATED ? input.date : CONTENT_UPDATED,
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
    "/spellings",
    "/agritech",
    ...spellingPages.map((page) => page.path),
    "/entities",
    "/knowledge-base",
    "/data/entities.json",
    ...agriCompanies.map((company) => company.path),
    ...agriIndustries.map((industry) => industry.path),
    ...agriSearchPages.map((page) => page.path),
    ...techPages.map((page) => `/stack/${page.slug}`),
    fdePage.path,
  ];
  return [...new Set(paths)]
    .filter((path) => path !== "/kush-gangwal-bikaner")
    .map((path) => absolute(path));
}

export function llmsText() {
  const lines = [
    `# ${PERSON_NAME}`,
    "",
    `> ${about.whoIs}`,
    "",
    "A plain-text summary of Kush Gangwal's portfolio.",
    "",
    "## Identity",
    `- Name: ${PERSON_NAME}`,
    `- Headline: ${PERSON_HEADLINE}`,
    `- Title: ${PERSON_TITLE_TAG}`,
    `- Grew up: Bakaner, Dhar district, Madhya Pradesh`,
    `- Graduated: Medicaps University, Indore`,
    `- Works now: ${about.location}, India`,
    `- Email: ${about.email}`,
    `- About page: ${personUrl}`,
    `- Portfolio: ${SITE_URL}`,
    `- Now page: ${absolute(nowPath)}`,
    "",
    "## Who is Kush Gangwal?",
    about.whoIs,
    "",
    "He has worked on:",
    ...products.map(
      (product) =>
        `- ${product.name}: ${
          product.credit === "develops"
            ? "develops its mobile app, backend, and web platform"
            : product.credit === "contributed to"
              ? "contributed"
              : "built"
        }`,
    ),
    "",
    "## Official profiles",
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
    "## Potato Bazaar",
    "- Kush Gangwal works as a Forward Deployed Engineer on Potato Bazaar at SK Groups (S K Agri Exports Private Limited) in Ahmedabad, building its AI layer, React Native mobile app (Android and iOS), backend, web platform, and related products.",
    "- Potato Bazaar was founded in 2024 by SK Agri Exports and is powered by S K AGRI EXPORTS PRIVATE LIMITED.",
    "- Potato Bazaar's about page names Sandeep Kumar as Founder & CEO.",
    "- The product lists a marketplace, cold storage booking, mandi prices, and an AI Crop Doctor.",
    "- Mantra Agri Solutions is a public SK Group and Haldiram potato venture. It is not his employer.",
    "- Potato Bazaar connects potato trading, cold storage, logistics, KYC, and crop insights.",
    `- ${fdePage.lede}`,
    `- Forward Deployed Engineer on Potato Bazaar: ${absolute(fdePage.path)}`,
    ...fdeFaqs.map((faq) => `- ${faq.question} ${faq.answer}`),
    `- Relationships: ${SITE_URL}/entities`,
    `- Dataset: ${SITE_URL}/data/entities.json`,
    `- Knowledge base: ${SITE_URL}/knowledge-base`,
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
  "SK Agri Exports",
  "SK Agri Exports Private Limited",
  "Mantra Agri Solutions",
  "Potato Trading",
  "Cold Storage",
  "Agricultural Marketplace",
  "Protonshub Technologies",
  "Django Softwares",
  "Medicaps University",
  "React Native Developer",
  "Full Stack Developer",
  "Indore",
  "Bakaner",
  "Ahmedabad",
  "Kush Gangawal",
  "Potato Bazar",
];
