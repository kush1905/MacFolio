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
          "Kush Gangwal is a Full Stack Developer & React Native Developer working in Ahmedabad. He grew up in Bakaner (Dhar district, Madhya Pradesh) and graduated from Medicaps University in Indore in May 2026.",
          "He builds production mobile applications with React Native and TypeScript, manages Android and iOS releases, and connects those clients to Node.js APIs.",
        ],
      },
      {
        heading: "Mobile products",
        paragraphs: [
          "Potato Bazaar is the largest public example: Kush Gangwal works on its marketplace client on Android and iOS with KYC, payments, logistics, and AI-powered crop insights. Tybee Go is a tourism mobile application Kush Gangwal contributed to at Protonshub Technologies. He also contributed to Findanio's Android, iOS and web apps at Protonshub Technologies.",
        ],
        bullets: [
          "Potato Bazaar — React Native app, backend and web platform (developer)",
          "Tybee Go — React Native and TypeScript feature work",
          "Findanio — Android, iOS and web contributions at Protonshub Technologies",
          "SK Groups — mobile apps, Play Console, Xcode, Apple Developer",
        ],
      },
      {
        heading: "How the work is done",
        paragraphs: [
          "His React Native work includes pagination, navigation, async data, analytics (PostHog, Mixpanel), maps, weather, TTS, STT, and AI APIs. The same engineer writes full stack code when the API is the blocker.",
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
        heading: "The work",
        paragraphs: [
          "Full stack development is the job Kush Gangwal has practiced at Django Softwares, Protonshub Technologies, and SK Groups, and on Nexus, Resumind, CodeMace, Potato Bazaar, and Macfolio.",
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
          "Nexus is a skill swap platform with Auth0 and a Node API. Resumind is an AI resume analyzer. CodeMace is a practice workspace. Potato Bazaar is a live marketplace he works on at SK Groups. Macfolio is this Next.js portfolio.",
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
      "The official Kush Gangwal Portfolio: an interactive 3D homepage, a macOS-style desktop, and pages for projects and writing.",
    kicker: "Portfolio",
    searchPhrases: ["Kush Gangwal Portfolio"],
    sections: [
      {
        heading: "Official portfolio",
        paragraphs: [
          "This is the Kush Gangwal Portfolio. The homepage is an interactive 3D portfolio, and a macOS-style desktop lives at /desktop. The about, projects, writing, work, education, and /now pages hold the same information as plain pages.",
          "Use /about-kush-gangwal for his profile, /projects for case studies, and /blog for technical writing. The same name and headline appear on LinkedIn, GitHub, LeetCode, Medium, Dev.to, Hashnode, and X.",
        ],
      },
      {
        heading: "What to open first",
        paragraphs: [
          "Recruiters usually want Potato Bazaar, Tybee Go, Nexus, Resumind, and CodeMace. Each one has its own case study covering the problem, the stack, and his part in the work.",
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
      "Kush Gangwal graduated with a B.Tech in Computer Science Technology from Medicaps University, Indore, CGPA 7.96, class of 2026.",
    kicker: "Education",
    searchPhrases: ["Kush Gangwal Medicaps University"],
    sections: [
      {
        heading: "The record",
        paragraphs: [
          "Kush Gangwal graduated from Medicaps University in Indore, Madhya Pradesh, in May 2026 with a B.Tech in Computer Science Technology (August 2022 to May 2026). CGPA: 7.96.",
        ],
      },
      {
        heading: "What sat beside the degree",
        paragraphs: [
          "While enrolled at Medicaps University, Kush Gangwal interned at Django Softwares and Protonshub Technologies, contributed to Tybee Go and Findanio, and built Nexus, Resumind, CodeMace, and this portfolio. After graduating he joined SK Groups in June 2026, where he works on Potato Bazaar.",
          "The full education record is at /education/medicaps-university.",
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
      "Kush Gangwal develops the mobile app, backend and web platform of Potato Bazaar, the agricultural trading marketplace at potatobazaar.com.",
    kicker: "Potato Bazaar",
    searchPhrases: ["Kush Gangwal Potato Bazaar", "Potato Bazaar Developer"],
    sections: [
      {
        heading: "His role",
        paragraphs: [
          "Kush Gangwal is a developer on Potato Bazaar. As a Junior Software Developer at SK Groups in Ahmedabad, he works across its mobile app (React Native, Android and iOS), backend, web platform, and related products. Potato Bazaar was founded in 2024 by SK Agri Exports; its about page names Sandeep Kumar as Founder & CEO.",
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
          "Role: Potato Bazaar developer (Junior Software Developer, SK Groups)",
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
      "At Protonshub Technologies (Jan–May 2026), Kush Gangwal built AI-powered web apps and contributed to Tybee Go and Findanio.",
    kicker: "Protonshub Technologies",
    searchPhrases: ["Kush Gangwal Protonshub"],
    sections: [
      {
        heading: "The internship",
        paragraphs: [
          "Kush Gangwal was a Full Stack Developer Intern at Protonshub Technologies from January 2026 to May 2026. He built AI-powered applications with Next.js, React.js, Node.js, MongoDB, and React Native.",
        ],
      },
      {
        heading: "Products",
        paragraphs: [
          "He contributed to Tybee Go on Android and iOS, and to Findanio's Android, iOS and web apps. The company page is /work/protonshub-technologies. The project pages are /projects/tybee-go and /projects/findanio.",
        ],
      },
    ],
  },
];

export function entityPageBySlug(slug: string) {
  return entityPages.find((page) => page.slug === slug) ?? null;
}
