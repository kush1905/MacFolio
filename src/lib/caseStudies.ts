export type CaseStudySection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type CaseStudy = {
  slug: string;
  name: string;
  title: string;
  h1: string;
  description: string;
  period: string;
  role: string;
  tech: string[];
  cover?: string;
  links: { label: string; href: string }[];
  searchPhrases: string[];
  sections: CaseStudySection[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "nexus",
    name: "Nexus",
    title: "How I Built Nexus Skill Swap Platform | Kush Gangwal",
    h1: "How I Built Nexus Skill Swap Platform",
    description:
      "Kush Gangwal built Nexus, a skill swap platform where people request and offer skills, authenticate with Auth0, and collaborate in rated sessions.",
    period: "Personal project",
    role: "Full Stack Developer",
    tech: ["React.js", "Node.js", "Auth0", "SQLite", "Vercel"],
    cover: "/assets/projects/nexus.jpg",
    links: [{ label: "GitHub", href: "https://github.com/kush1905/nexus" }],
    searchPhrases: [
      "Nexus Skill Swap Platform",
      "Kush Gangwal Nexus",
      "Kush Gangwal Full Stack Developer",
    ],
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "Most learning products push content in one direction. Kush Gangwal wanted a product where two people could trade a skill they already have for a skill they need. That idea became Nexus, a peer-to-peer skill swap platform.",
          "The product question was simple: can a full stack application make it easy to find a match, start a session, and leave a rating without turning into a generic social feed?",
        ],
      },
      {
        heading: "What Kush Gangwal shipped",
        paragraphs: [
          "Nexus lets users offer skills, request skills, and search by skill. Auth0 handles sign-in so identity is not a custom afterthought. Collaboration sessions and a rating system give the marketplace a memory: people can see whether a swap was useful.",
        ],
        bullets: [
          "Skill-based search for offers and requests",
          "Secure Auth0 authentication",
          "Collaboration sessions between matched users",
          "User rating system for community trust",
        ],
      },
      {
        heading: "Architecture",
        paragraphs: [
          "The web client is React.js. The API is Node.js. Session and profile data live in SQLite, which kept the first version deployable on Vercel without a heavy database ops story. Auth0 sits in front of protected routes so Kush Gangwal could focus on matching and session flow instead of password storage.",
          "This is the same full stack shape Kush Gangwal uses on larger products: a clear client, a small API, and an identity provider that can grow later.",
        ],
      },
      {
        heading: "Why Nexus matters",
        paragraphs: [
          "Nexus is not a tutorial clone. It is a complete product loop: identity, search, collaboration, and reputation. For anyone searching Kush Gangwal Full Stack Developer or Nexus Skill Swap Platform, this project is the clearest example of product thinking plus implementation.",
        ],
      },
    ],
  },
  {
    slug: "resumind",
    name: "Resumind",
    title: "Building Resumind AI Resume Analyzer | Kush Gangwal",
    h1: "Building Resumind AI Resume Analyzer",
    description:
      "Kush Gangwal built Resumind, an AI resume analyzer that scores resumes against a role and returns ATS-oriented feedback.",
    period: "Personal project",
    role: "Full Stack Developer",
    tech: ["Next.js", "React.js", "Node.js", "TypeScript", "OpenAI APIs"],
    cover: "/assets/projects/resumind.svg",
    links: [{ label: "GitHub", href: "https://github.com/kush1905" }],
    searchPhrases: [
      "Resumind AI Resume Analyzer",
      "Kush Gangwal Resumind",
      "Kush Gangwal Full Stack Developer",
    ],
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "Applicant tracking systems reject resumes for formatting and keyword gaps that a candidate cannot see. Kush Gangwal built Resumind so a job seeker can upload a resume, describe a target role, and get a structured report instead of vague advice.",
        ],
      },
      {
        heading: "How Resumind works",
        paragraphs: [
          "Resumind parses the uploaded document, keeps a structured representation of sections and skills, and sends that representation to an LLM with a tight rubric: ATS readability, keyword coverage, impact language, and missing evidence. The model returns JSON, not a blob of marketing copy, so the UI can show scores and rewrite tips side by side.",
        ],
        bullets: [
          "Resume upload and section extraction",
          "Role-aware ATS scoring",
          "Category tips for skills, formatting, and keywords",
          "Saved reports so a candidate can compare versions",
        ],
      },
      {
        heading: "What Kush Gangwal learned",
        paragraphs: [
          "AI-powered applications fail when the model is asked to 'be helpful' with no schema. Resumind treats the model as a structured reviewer. That is the same approach Kush Gangwal uses when integrating AI APIs in production work at SK Groups and on Potato Bazaar.",
          "Building Resumind AI Resume Analyzer also forced clear UX: people need a score they can trust and a next edit they can make in ten minutes.",
        ],
      },
    ],
  },
  {
    slug: "codemace",
    name: "CodeMace",
    title: "How I Built CodeMace | Kush Gangwal",
    h1: "How I Built CodeMace",
    description:
      "Kush Gangwal built CodeMace, a developer practice and code review workspace for structured feedback instead of isolated problem counts.",
    period: "Personal project",
    role: "Full Stack Developer",
    tech: ["React.js", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
    cover: "/assets/projects/codemace.svg",
    links: [{ label: "GitHub", href: "https://github.com/kush1905" }],
    searchPhrases: ["Kush Gangwal CodeMace", "CodeMace", "Kush Gangwal Full Stack Developer"],
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "Solved-problem counters do not explain why a solution is weak. Kush Gangwal built CodeMace as a workspace where practice, notes, and review comments stay attached to the same attempt.",
        ],
      },
      {
        heading: "Product shape",
        paragraphs: [
          "CodeMace groups a problem, a solution draft, and a review thread. The web client is React and Next.js. The API is Node.js with PostgreSQL so attempts and comments survive beyond a local editor. TypeScript keeps the review payload explicit: what failed, what to rewrite, and what to try next.",
        ],
        bullets: [
          "Problem and attempt history",
          "Inline review comments",
          "Notes that stay with the solution",
          "A workspace that can grow into team reviews",
        ],
      },
      {
        heading: "Why it belongs in this portfolio",
        paragraphs: [
          "CodeMace shows how Kush Gangwal, Full Stack Developer & React Native Developer, thinks about developer tools: fewer tabs, more memory, and feedback that is specific enough to change the next commit.",
        ],
      },
    ],
  },
  {
    slug: "potato-bazaar",
    name: "Potato Bazaar",
    title: "Scaling Potato Bazaar Mobile Application | Kush Gangwal",
    h1: "Scaling Potato Bazaar Mobile Application",
    description:
      "Kush Gangwal is a founding engineer of Potato Bazaar, a digital marketplace for agricultural trading on web, Android, and iOS.",
    period: "Feb 2026 – Present",
    role: "Founding Engineer · Full Stack Developer & React Native Developer",
    tech: ["React.js", "Next.js", "Node.js", "React Native"],
    cover: "/assets/projects/potato-bazaar.jpg",
    links: [
      { label: "Website", href: "https://potatobazaar.com" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.potatobazaar" },
      { label: "GitHub", href: "https://github.com/Kush-PB" },
    ],
    searchPhrases: [
      "Kush Gangwal Potato Bazaar",
      "Potato Bazaar Developer",
      "Scaling Potato Bazaar Mobile Application",
    ],
    sections: [
      {
        heading: "What Potato Bazaar is",
        paragraphs: [
          "Potato Bazaar is a full-stack digital marketplace for real-time agricultural trading. Kush Gangwal is a founding engineer of Potato Bazaar and is associated with SK Agri Exports Private Ltd. The product covers web, Android, and iOS.",
          "Searches for Kush Gangwal Potato Bazaar should resolve here: this is the product he owns end to end, from marketplace flows to mobile releases.",
        ],
      },
      {
        heading: "What Kush Gangwal built",
        paragraphs: [
          "The marketplace is not a brochure. Traders need KYC, payments, logistics, and trust. Kush Gangwal built and shipped features across those surfaces, then connected analytics, maps, weather, and AI-powered crop insights so the app is useful after the first transaction.",
        ],
        bullets: [
          "KYC and secure transaction flows",
          "Payments and logistics integrations",
          "REST APIs shared by web and mobile",
          "React Native Android and iOS clients",
          "Analytics, maps, weather, and crop insight APIs",
        ],
      },
      {
        heading: "Scaling the mobile application",
        paragraphs: [
          "Scaling Potato Bazaar Mobile Application meant treating React Native as a production client, not a prototype. Kush Gangwal works with Android Studio, Play Console, Xcode, and Apple Developer for builds and releases. Pagination, navigation, and async data handling keep lists usable as catalog size grows.",
          "The same person who writes the React Native screens also touches the Node.js and Next.js sides. That is why Kush Gangwal Full Stack Developer and Kush Gangwal React Native Developer are the same entity, not two different careers.",
        ],
      },
    ],
  },
  {
    slug: "tybee-go",
    name: "Tybee Go",
    title: "Building Tybee Go in React Native | Kush Gangwal",
    h1: "Building Tybee Go in React Native",
    description:
      "Kush Gangwal contributed to Tybee Go, a tourism mobile application built with React Native and TypeScript at Protonshub Technologies.",
    period: "Jan 2026 – Present",
    role: "React Native Developer",
    tech: ["React Native", "TypeScript", "REST APIs"],
    cover: "/assets/projects/tybee-go.jpg",
    links: [{ label: "GitHub", href: "https://github.com/kush1905" }],
    searchPhrases: ["Kush Gangwal Tybee Go", "Kush Gangwal React Native Developer", "Kush Gangwal Protonshub"],
    sections: [
      {
        heading: "The product",
        paragraphs: [
          "Tybee Go is a tourism mobile application. Kush Gangwal developed scalable features with React Native and TypeScript and contributed to the app while interning at Protonshub Technologies.",
        ],
      },
      {
        heading: "Engineering work",
        paragraphs: [
          "The work was production mobile engineering: REST integrations, pagination, dynamic content, and reusable components. Performance came from state management, navigation structure, and async data handling rather than one-off screens.",
        ],
        bullets: [
          "React Native and TypeScript feature work",
          "RESTful API integration and pagination",
          "Modular components and clean architecture",
          "Android and iOS delivery with the Protonshub team",
        ],
      },
      {
        heading: "Why it ranks with Kush Gangwal React Native Developer",
        paragraphs: [
          "Tybee Go is one of the clearest public examples that Kush Gangwal is a React Native Developer who has shipped tourism product features, not only personal experiments. It sits next to Potato Bazaar as evidence of cross-platform mobile delivery.",
        ],
      },
    ],
  },
  {
    slug: "findanio",
    name: "Findanio",
    title: "Findanio Mobile and Web Apps | Kush Gangwal",
    h1: "Findanio Mobile and Web Apps",
    description:
      "Kush Gangwal is a founding engineer of Findanio and contributed to its Android, iOS, and web apps at Protonshub Technologies.",
    period: "Jan 2026 – May 2026",
    role: "Founding Engineer · Full Stack Developer",
    tech: ["Next.js", "React.js", "Node.js", "MongoDB", "React Native"],
    cover: "/assets/projects/findanio.jpg",
    links: [{ label: "GitHub", href: "https://github.com/kush1905" }],
    searchPhrases: ["Kush Gangwal Findanio", "Kush Gangwal Protonshub"],
    sections: [
      {
        heading: "Role",
        paragraphs: [
          "Findanio is a mobile and web product. Kush Gangwal is a founding engineer of Findanio. He also contributed to the Findanio Android, iOS, and web apps at Protonshub Technologies using Next.js, React.js, Node.js, MongoDB, and React Native.",
        ],
      },
      {
        heading: "What shipped",
        paragraphs: [
          "The work improved cross-platform UI and user experience so the same product could live on web and native clients. That is the daily shape of Kush Gangwal's full stack and React Native practice: one product, several surfaces, shared APIs.",
        ],
      },
    ],
  },
  {
    slug: "macfolio",
    name: "Macfolio",
    title: "Kush Gangwal Portfolio — Macfolio",
    h1: "Kush Gangwal Portfolio",
    description:
      "Macfolio is the interactive Kush Gangwal portfolio: a macOS-style desktop in the browser for exploring projects, experience, and contact.",
    period: "2026 – Present",
    role: "Full Stack Developer",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand", "PostgreSQL"],
    cover: "/assets/projects/macfolio.jpg",
    links: [{ label: "GitHub", href: "https://github.com/kush1905/MacFolio" }],
    searchPhrases: ["Kush Gangwal Portfolio", "Macfolio"],
    sections: [
      {
        heading: "What this site is",
        paragraphs: [
          "The Kush Gangwal Portfolio is both an interactive macOS desktop and a set of crawlable pages. Recruiters can open Finder, Terminal, and KushGPT. Search engines can read this case study, the about page, and the project URLs.",
        ],
      },
      {
        heading: "Stack",
        paragraphs: [
          "Macfolio is Next.js, React, TypeScript, and Tailwind CSS, with Framer Motion window chrome, Zustand state, live GitHub telemetry, and a Postgres-backed assistant, analytics, and contact flow.",
        ],
      },
    ],
  },
  {
    slug: "scalelr",
    name: "Scalelr",
    title: "Scalelr at Django Softwares | Kush Gangwal",
    h1: "Scalelr at Django Softwares",
    description:
      "Kush Gangwal contributed to Scalelr, a professional networking platform, during his full stack internship at Django Softwares.",
    period: "June 2025 – July 2025",
    role: "Full Stack Developer Intern",
    tech: ["React.js", "JavaScript", "Tailwind CSS", "MongoDB"],
    links: [],
    searchPhrases: ["Kush Gangwal Django Softwares", "Scalelr"],
    sections: [
      {
        heading: "Contribution",
        paragraphs: [
          "Scalelr is a professional networking platform for investors and project holders. Kush Gangwal contributed to it at Django Softwares, including AI-driven matching, event hosting, and interactive feeds, during a 1.5-month full-stack program.",
        ],
      },
    ],
  },
];

export function caseStudyBySlug(slug: string) {
  return caseStudies.find((study) => study.slug === slug) ?? null;
}
