export type EntityPage = {
  slug: string;
  path: string;
  title: string;
  h1: string;
  description: string;
  kicker: string;
  searchPhrases: string[];
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const entityPages: EntityPage[] = [
  {
    slug: "kush-gangwal-react-native-developer",
    path: "/kush-gangwal-react-native-developer",
    title: "Kush Gangwal React Native Developer",
    h1: "Kush Gangwal React Native Developer",
    description:
      "Kush Gangwal is a React Native Developer who ships Android and iOS apps including Potato Bazaar and Tybee Go.",
    kicker: "React Native",
    searchPhrases: ["Kush Gangwal React Native Developer"],
    sections: [
      {
        heading: "Who this page is about",
        paragraphs: [
          "Kush Gangwal is a Full Stack Developer & React Native Developer based in Indore, India. This page exists so the phrase Kush Gangwal React Native Developer has a dedicated, factual home.",
          "He builds production mobile applications with React Native and TypeScript, manages Android and iOS releases, and connects those clients to Node.js APIs.",
        ],
      },
      {
        heading: "Mobile products",
        paragraphs: [
          "Potato Bazaar is the largest public example: a marketplace client on Android and iOS with KYC, payments, logistics, and AI-powered crop insights. Tybee Go is a tourism mobile application Kush Gangwal contributed to at Protonshub Technologies. Findanio also shipped as Android and iOS apps.",
        ],
        bullets: [
          "Potato Bazaar — founding engineer, React Native marketplace",
          "Tybee Go — React Native and TypeScript feature work",
          "Findanio — cross-platform UI for Android and iOS",
          "SK Groups — mobile apps, Play Console, Xcode, Apple Developer",
        ],
      },
      {
        heading: "How the work is done",
        paragraphs: [
          "Kush Gangwal React Native Developer work includes pagination, navigation, async data, analytics (PostHog, Mixpanel), maps, weather, TTS, STT, and AI APIs. The same engineer writes full stack code when the API is the blocker.",
        ],
      },
    ],
  },
  {
    slug: "kush-gangwal-full-stack-developer",
    path: "/kush-gangwal-full-stack-developer",
    title: "Kush Gangwal Full Stack Developer",
    h1: "Kush Gangwal Full Stack Developer",
    description:
      "Kush Gangwal is a Full Stack Developer using React.js, Next.js, Node.js, and React Native across internships and shipped products.",
    kicker: "Full stack",
    searchPhrases: ["Kush Gangwal Full Stack Developer"],
    sections: [
      {
        heading: "The identity",
        paragraphs: [
          "Kush Gangwal Full Stack Developer is not a slogan. It is the job he has practiced at Django Softwares, Protonshub Technologies, and SK Groups, and on Nexus, Resumind, CodeMace, Potato Bazaar, and Macfolio.",
        ],
      },
      {
        heading: "Stack",
        paragraphs: [
          "Languages: JavaScript, TypeScript, Java. Frontend: React.js, Next.js, Tailwind CSS. Backend: Node.js, Express, REST APIs. Data: MongoDB, PostgreSQL, SQL. Mobile: React Native. Cloud: AWS, Firebase, Vercel.",
        ],
      },
      {
        heading: "Proof",
        paragraphs: [
          "Nexus is a skill swap platform with Auth0 and a Node API. Resumind is an AI resume analyzer. CodeMace is a practice workspace. Potato Bazaar is a live marketplace. Macfolio is this Next.js portfolio. Together they are the Kush Gangwal Full Stack Developer record.",
        ],
      },
    ],
  },
  {
    slug: "kush-gangwal-portfolio",
    path: "/kush-gangwal-portfolio",
    title: "Kush Gangwal Portfolio",
    h1: "Kush Gangwal Portfolio",
    description:
      "The official Kush Gangwal Portfolio: interactive macOS desktop plus crawlable pages for projects, writing, and identity.",
    kicker: "Portfolio",
    searchPhrases: ["Kush Gangwal Portfolio"],
    sections: [
      {
        heading: "Official portfolio",
        paragraphs: [
          "This is the Kush Gangwal Portfolio. The home route is an interactive macOS desktop. The indexed routes are about, projects, writing, work, education, and /now.",
          "Use /about-kush-gangwal for the entity page, /projects for case studies, and /blog for technical writing. The same name and headline appear on LinkedIn, GitHub, LeetCode, Medium, Dev.to, Hashnode, and X.",
        ],
      },
      {
        heading: "What to open first",
        paragraphs: [
          "Recruiters usually want Potato Bazaar, Tybee Go, Nexus, Resumind, and CodeMace. Those pages are written as case studies so the Kush Gangwal Portfolio ranks as a set of documents, not a single splash screen.",
        ],
      },
    ],
  },
  {
    slug: "kush-gangwal-medicaps-university",
    path: "/kush-gangwal-medicaps-university",
    title: "Kush Gangwal Medicaps University",
    h1: "Kush Gangwal Medicaps University",
    description:
      "Kush Gangwal studies B.Tech Computer Science Technology at Medicaps University, Indore, CGPA 7.96, class of 2026.",
    kicker: "Education",
    searchPhrases: ["Kush Gangwal Medicaps University"],
    sections: [
      {
        heading: "The record",
        paragraphs: [
          "Kush Gangwal Medicaps University is a B.Tech in Computer Science Technology from August 2022 to May 2026 in Indore, Madhya Pradesh. CGPA: 7.96.",
        ],
      },
      {
        heading: "What sat beside the degree",
        paragraphs: [
          "While enrolled at Medicaps University, Kush Gangwal interned at Django Softwares and Protonshub Technologies, joined SK Groups, and shipped Potato Bazaar, Nexus, Resumind, CodeMace, Tybee Go, and this portfolio.",
          "The education page at /education/medicaps-university is the structured record. This page exists for the search phrase itself.",
        ],
      },
    ],
  },
  {
    slug: "kush-gangwal-potato-bazaar",
    path: "/kush-gangwal-potato-bazaar",
    title: "Kush Gangwal Potato Bazaar",
    h1: "Kush Gangwal Potato Bazaar",
    description:
      "Kush Gangwal is a founding engineer of Potato Bazaar, the agricultural trading marketplace at potatobazaar.com.",
    kicker: "Potato Bazaar",
    searchPhrases: ["Kush Gangwal Potato Bazaar", "Potato Bazaar Developer"],
    sections: [
      {
        heading: "Founding engineer",
        paragraphs: [
          "Kush Gangwal Potato Bazaar is a founding-engineer relationship. He is associated with SK Agri Exports Private Ltd and builds the digital marketplace for agricultural trading across web and mobile.",
        ],
      },
      {
        heading: "What the product does",
        paragraphs: [
          "Potato Bazaar covers KYC, payments, logistics, and AI-powered crop insights. It is live at potatobazaar.com and on Google Play. The long case study is /projects/potato-bazaar.",
        ],
        bullets: [
          "Web: React.js, Next.js",
          "Mobile: React Native for Android and iOS",
          "Backend: Node.js and REST APIs",
          "Role: Potato Bazaar Developer and founding engineer",
        ],
      },
    ],
  },
  {
    slug: "kush-gangwal-protonshub",
    path: "/kush-gangwal-protonshub",
    title: "Kush Gangwal Protonshub",
    h1: "Kush Gangwal Protonshub",
    description:
      "Kush Gangwal was a Full Stack Developer Intern at Protonshub Technologies from January 2026 to May 2026.",
    kicker: "Protonshub Technologies",
    searchPhrases: ["Kush Gangwal Protonshub"],
    sections: [
      {
        heading: "The internship",
        paragraphs: [
          "Kush Gangwal Protonshub refers to a Full Stack Developer Intern role at Protonshub Technologies from January 2026 to May 2026. He built AI-powered applications with Next.js, React.js, Node.js, MongoDB, and React Native.",
        ],
      },
      {
        heading: "Products",
        paragraphs: [
          "He contributed to Tybee Go and Findanio on Android and iOS. The company page is /work/protonshub-technologies. The project pages are /projects/tybee-go and /projects/findanio.",
        ],
      },
    ],
  },
];

export function entityPageBySlug(slug: string) {
  return entityPages.find((page) => page.slug === slug) ?? null;
}
