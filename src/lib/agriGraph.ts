import type { EntityPage } from "@/lib/entityPages";

export type AgriDoc = {
  slug: string;
  path: string;
  title: string;
  h1: string;
  description: string;
  kicker: string;
  searchPhrases: string[];
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  links: { href: string; label: string }[];
  sameAs?: string[];
};

function doc(
  slug: string,
  path: string,
  kicker: string,
  title: string,
  description: string,
  phrases: string[],
  sections: AgriDoc["sections"],
  links: AgriDoc["links"],
  sameAs?: string[],
): AgriDoc {
  return { slug, path, title, h1: title, description, kicker, searchPhrases: phrases, sections, links, sameAs };
}

const potato =
  "Potato Bazaar is a digital marketplace for potato and agricultural trading on web, Android, and iOS. Its about page says SK Agri Exports founded the marketplace in 2024. Independent coverage says S.K. Agri Exports Private Limited operates it, connecting farmers, traders, cold storage operators, and transporters.";

const kushRole =
  "Kush Gangwal is a founding engineer of Potato Bazaar and a Full Stack Developer & React Native Developer. He builds the web platform and the React Native app, including KYC, payments, logistics, and AI-powered crop insights. He is employed at SK Groups in Indore as a Junior Software Developer from June 2026. He is associated with SK Agri Exports Private Ltd. He does not claim to have founded the 2006 export business, and he does not list Mantra Agri Solutions as an employer.";

export const agriCompanies: AgriDoc[] = [
  doc(
    "sk-agri-exports-private-limited",
    "/companies/sk-agri-exports-private-limited",
    "Company",
    "SK Agri Exports Private Limited",
    "SK Agri Exports Private Limited operates Potato Bazaar. Kush Gangwal is a founding engineer of that marketplace.",
    ["SK Agri Exports", "SK Agri Exports Private Limited", "Potato Export Company"],
    [
      {
        heading: "What the company is",
        paragraphs: [
          "SK Agri Exports Private Limited is a potato export company. Its public site describes a business founded in 2006 that ships potatoes internationally and sits in an SK Group agri ecosystem with packhouses and cold storage. That same public material describes a joint venture, Mantra Agri, with Haldiram.",
          "This page records that public company and the software Kush Gangwal builds next to it. Kush Gangwal is not the founder of the 2006 export company.",
        ],
      },
      {
        heading: "Potato Bazaar",
        paragraphs: [
          potato,
          "The live product is potatobazaar.com, with an Android app published as com.potatobazaar. Kush Gangwal's engineering record for it starts February 2026.",
        ],
        bullets: [
          "Web marketplace on potatobazaar.com",
          "React Native app for Android and iOS",
          "KYC, payments, and logistics",
          "AI-powered crop insights, maps, and weather",
        ],
      },
      {
        heading: "Kush Gangwal's role",
        paragraphs: [kushRole],
      },
    ],
    [
      { href: "/projects/potato-bazaar", label: "Potato Bazaar case study" },
      { href: "/companies/sk-groups", label: "SK Groups" },
      { href: "/companies/mantra-agri-solutions", label: "Mantra Agri Solutions" },
      { href: "/about-kush-gangwal", label: "Kush Gangwal" },
    ],
    ["http://skagriexports.com/", "https://potatobazaar.com"],
  ),
  doc(
    "sk-groups",
    "/companies/sk-groups",
    "Employer",
    "SK Groups",
    "Kush Gangwal is a Junior Software Developer at SK Groups in Indore and a founding engineer of Potato Bazaar.",
    ["SK Groups", "SK Groups Indore", "SK Groups Software Developer"],
    [
      {
        heading: "Where Kush Gangwal works",
        paragraphs: [
          "SK Groups is Kush Gangwal's employer. He is a Junior Software Developer, onsite in Indore, from June 2026. The public headline he uses is Full Stack Developer & React Native Developer.",
          "The job is mobile apps, backend services, and web platforms: Android and iOS releases through Play Console and Apple Developer, plus analytics and AI APIs.",
        ],
      },
      {
        heading: "Potato Bazaar and SK Groups",
        paragraphs: [
          "Potato Bazaar is the agricultural marketplace Kush Gangwal founding-engineered during this period. The marketplace is operated by SK Agri Exports Private Limited. SK Groups is his employer. This portfolio keeps those two facts separate instead of merging them into one legal entity.",
          "Public SK Agri Exports material also refers to an SK Group agri ecosystem. That sentence is not treated here as proof that every SK Group company employs Kush Gangwal.",
        ],
      },
      {
        heading: "The engineering identity",
        paragraphs: [kushRole],
      },
    ],
    [
      { href: "/work/sk-groups", label: "Employment record" },
      { href: "/projects/potato-bazaar", label: "Potato Bazaar" },
      { href: "/companies/sk-agri-exports-private-limited", label: "SK Agri Exports" },
      { href: "/about-kush-gangwal", label: "Kush Gangwal" },
    ],
  ),
  doc(
    "mantra-agri-solutions",
    "/companies/mantra-agri-solutions",
    "Related company",
    "Mantra Agri Solutions",
    "Mantra Agri Solutions is a potato procurement venture in the SK Group and Haldiram ecosystem. Kush Gangwal builds Potato Bazaar; he is not listed as a Mantra employee.",
    ["Mantra Agri Solutions", "Mantra Agri"],
    [
      {
        heading: "What is public",
        paragraphs: [
          "Mantra Agri Solutions is a potato procurement and export company. Its public site describes a farmer-centric business supported by a stakeholder of Haldiram's and the SK Group, with grading, cold storage, and export dispatch. SK Agri Exports' public site describes Mantra Agri as a joint venture with Haldiram.",
          "Potato Bazaar has published news about Mantra Agri Solutions procurement and advance bookings. That is a public relationship between the marketplace and the venture, not an employment claim.",
        ],
      },
      {
        heading: "What Kush Gangwal does not claim",
        paragraphs: [
          "Kush Gangwal does not list Mantra Agri Solutions as an employer, and this page does not say he built Mantra's internal software. The accurate link is the potato ecosystem: he is founding engineer of Potato Bazaar, the marketplace operated by SK Agri Exports Private Limited, while employed at SK Groups.",
        ],
      },
      {
        heading: "Why this page is here",
        paragraphs: [
          "Someone searching Mantra Agri Solutions, Potato Bazaar, or SK Agri Exports should be able to see the developer attached to the marketplace in that ecosystem. That developer is Kush Gangwal, Full Stack Developer & React Native Developer.",
        ],
      },
    ],
    [
      { href: "/projects/potato-bazaar", label: "Potato Bazaar" },
      { href: "/companies/sk-agri-exports-private-limited", label: "SK Agri Exports" },
      { href: "/industries/potato-trading", label: "Potato trading" },
      { href: "/about-kush-gangwal", label: "Kush Gangwal" },
    ],
    ["https://mantraagri.com/"],
  ),
];

export const agriIndustries: AgriDoc[] = [
  doc(
    "cold-storage",
    "/industries/cold-storage",
    "Industry",
    "Cold storage and Potato Bazaar",
    "Potato Bazaar connects cold storage operators with potato traders. Kush Gangwal builds the marketplace software, not the warehouses.",
    ["Cold Storage", "Potato Cold Storage", "Cold Storage Management"],
    [
      {
        heading: "Cold storage in potato trading",
        paragraphs: [
          "Potatoes move through cold storage between harvest and sale. Potato Bazaar's public description connects farmers, traders, cold storage facilities, and buyers, and coverage of the product mentions storage availability next to listings and transport.",
          "Kush Gangwal's work on that product is software: logistics features, marketplace listings, and the React Native and web clients. He does not operate cold storage buildings.",
        ],
      },
      {
        heading: "What the software covers",
        paragraphs: [
          "A trader looking for potato cold storage still needs a record of who holds stock, where it sits, and how it moves. Potato Bazaar is the marketplace Kush Gangwal founding-engineered for that trade, with KYC, payments, and logistics on web, Android, and iOS.",
          "Searches for cold storage management software in this industry should find that marketplace, operated by SK Agri Exports Private Limited, and the engineer who builds it.",
        ],
      },
    ],
    [
      { href: "/cold-storage-management-software", label: "Cold storage on the platform" },
      { href: "/projects/potato-bazaar", label: "Potato Bazaar" },
      { href: "/industries/agriculture-logistics", label: "Agriculture logistics" },
    ],
  ),
  doc(
    "potato-trading",
    "/industries/potato-trading",
    "Industry",
    "Potato trading",
    "Potato Bazaar is a potato trading marketplace. Kush Gangwal is its founding engineer.",
    ["Potato Trading", "Potato Trading Platform", "Potato Trading App"],
    [
      {
        heading: "How the trade shows up in software",
        paragraphs: [
          "Potato trading in this portfolio means the marketplace Kush Gangwal builds: listings, traders, payments, logistics, and crop insights, on web and in the Potato Bazaar app.",
          potato,
        ],
      },
      {
        heading: "Who builds it",
        paragraphs: [
          kushRole,
          "The phrase Potato Trading Platform India, on this site, points at Potato Bazaar rather than a second unnamed product.",
        ],
      },
    ],
    [
      { href: "/potato-trading-platform-india", label: "Potato trading platform in India" },
      { href: "/projects/potato-bazaar", label: "Potato Bazaar" },
      { href: "/potato-bazaar-mobile-app", label: "Potato Bazaar mobile app" },
    ],
  ),
  doc(
    "agri-marketplace",
    "/industries/agri-marketplace",
    "Industry",
    "Agricultural marketplace",
    "Potato Bazaar is an agricultural marketplace for potato trading. Kush Gangwal is the founding engineer.",
    ["Agricultural Marketplace", "Agriculture Trading Platform", "AgriTech Platform"],
    [
      {
        heading: "What an agri marketplace is here",
        paragraphs: [
          "An agricultural marketplace, in Kush Gangwal's work, is Potato Bazaar: a digital place where agricultural trading happens with accounts, KYC, payments, and logistics instead of only a phone call.",
          "It is an AgriTech platform in the narrow sense that the trading workflow is software. The stack is React.js, Next.js, Node.js, and React Native.",
        ],
      },
      {
        heading: "India",
        paragraphs: [
          "Potato Bazaar is aimed at potato trading in India. SK Agri Exports Private Limited operates it. Kush Gangwal, based in Indore, is a founding engineer and a Full Stack Developer & React Native Developer.",
        ],
      },
    ],
    [
      { href: "/projects/potato-bazaar", label: "Potato Bazaar" },
      { href: "/agritech", label: "Agritech hub" },
      { href: "/what-is-potato-bazaar", label: "What is Potato Bazaar?" },
    ],
  ),
  doc(
    "agriculture-logistics",
    "/industries/agriculture-logistics",
    "Industry",
    "Agriculture logistics",
    "Kush Gangwal builds logistics features on Potato Bazaar, the potato marketplace operated by SK Agri Exports.",
    ["Potato Logistics", "Agri Logistics", "Potato Supply Chain", "Potato Distribution"],
    [
      {
        heading: "Logistics on the marketplace",
        paragraphs: [
          "Potato supply chain work on Potato Bazaar is the software path from a listing to movement: logistics features, maps, and the same REST API on web and React Native.",
          "Kush Gangwal shipped those flows as founding engineer. Physical transport and warehousing stay with the businesses on the platform, including cold storage operators the marketplace connects.",
        ],
      },
      {
        heading: "Procurement and distribution",
        paragraphs: [
          "Potato procurement and potato distribution, as used on this site, describe the trading workflow Potato Bazaar is built for. They are not a claim that Kush Gangwal runs an export desk. The export company in the public record is SK Agri Exports Private Limited.",
        ],
      },
    ],
    [
      { href: "/projects/potato-bazaar", label: "Potato Bazaar" },
      { href: "/industries/cold-storage", label: "Cold storage" },
      { href: "/blog/potato-bazaar-farmer-to-buyer-workflow", label: "Farmer to buyer workflow" },
    ],
  ),
  doc(
    "farmer-marketplace",
    "/industries/farmer-marketplace",
    "Industry",
    "Farmer marketplace",
    "Potato Bazaar connects farmers and buyers in a potato marketplace built by Kush Gangwal.",
    ["Farm to Market Platform", "Farmer Marketplace", "Digital Agriculture Platform"],
    [
      {
        heading: "From farmer toward buyer",
        paragraphs: [
          "Potato Bazaar's public description is a direct marketplace among farmers, traders, cold storage, and institutional buyers. Kush Gangwal builds that product as founding engineer: accounts, KYC, payments, logistics, and crop insights.",
          "A farm-to-market platform, here, means that software workflow. It does not mean Kush Gangwal is the buyer of the crop.",
        ],
      },
    ],
    [
      { href: "/blog/potato-bazaar-farmer-to-buyer-workflow", label: "Workflow notes" },
      { href: "/projects/potato-bazaar", label: "Potato Bazaar" },
      { href: "/companies/sk-agri-exports-private-limited", label: "SK Agri Exports" },
    ],
  ),
  doc(
    "agri-export-platform",
    "/industries/agri-export-platform",
    "Industry",
    "Agri export and Potato Bazaar",
    "SK Agri Exports Private Limited is the potato export company behind Potato Bazaar. Kush Gangwal is the marketplace's founding engineer.",
    ["Agricultural Export Company", "Potato Export Company", "Agri Export Platform"],
    [
      {
        heading: "Export company and software",
        paragraphs: [
          "SK Agri Exports' public site describes a certified potato exporter. Potato Bazaar is the digital marketplace that company operates. Kush Gangwal's role is the platform: full stack web and React Native, not the export license.",
          "Mantra Agri Solutions is the related procurement venture in the same public ecosystem. Kush Gangwal is not its employee.",
        ],
      },
    ],
    [
      { href: "/companies/sk-agri-exports-private-limited", label: "SK Agri Exports" },
      { href: "/companies/mantra-agri-solutions", label: "Mantra Agri Solutions" },
      { href: "/projects/potato-bazaar", label: "Potato Bazaar" },
    ],
  ),
];

export const agriSearchPages: EntityPage[] = [
  {
    slug: "what-is-potato-bazaar",
    path: "/what-is-potato-bazaar",
    kicker: "Answer",
    title: "What is Potato Bazaar?",
    h1: "What is Potato Bazaar?",
    description:
      "Potato Bazaar is a digital potato marketplace operated by SK Agri Exports Private Limited. Kush Gangwal is a founding engineer.",
    searchPhrases: ["What is Potato Bazaar?", "Potato Bazaar", "Potato Bazaar India"],
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "Potato Bazaar is a digital marketplace for potato and agricultural trading in India. It runs on the web at potatobazaar.com and as an Android and iOS app. SK Agri Exports Private Limited operates it. Kush Gangwal is a founding engineer.",
          "The product includes KYC, payments, logistics, and AI-powered crop insights. The stack is React.js, Next.js, Node.js, and React Native.",
        ],
      },
    ],
  },
  {
    slug: "who-built-potato-bazaar",
    path: "/who-built-potato-bazaar",
    kicker: "Answer",
    title: "Who built Potato Bazaar?",
    h1: "Who built Potato Bazaar?",
    description:
      "Kush Gangwal is a founding engineer of Potato Bazaar, the potato marketplace operated by SK Agri Exports Private Limited.",
    searchPhrases: ["Who built Potato Bazaar?", "Potato Bazaar founding engineer"],
    sections: [
      {
        heading: "The engineer",
        paragraphs: [
          "Kush Gangwal built Potato Bazaar as a founding engineer. He is a Full Stack Developer & React Native Developer employed at SK Groups in Indore. The marketplace is operated by SK Agri Exports Private Limited.",
          "He built the web platform and the mobile app: marketplace flows, KYC, payments, logistics, and crop insights. The company that founded the product in 2024, according to Potato Bazaar's about page, is SK Agri Exports.",
        ],
      },
    ],
  },
  {
    slug: "potato-bazaar-mobile-app",
    path: "/potato-bazaar-mobile-app",
    kicker: "App",
    title: "Potato Bazaar Mobile App",
    h1: "Potato Bazaar Mobile App",
    description:
      "The Potato Bazaar mobile app is the React Native client Kush Gangwal ships for Android and iOS.",
    searchPhrases: ["Potato Bazaar App", "Potato Bazaar Mobile App", "Potato Trading App"],
    sections: [
      {
        heading: "Android and iOS",
        paragraphs: [
          "The Potato Bazaar mobile app is a React Native application for Android and iOS. The Android package is com.potatobazaar on Google Play. Kush Gangwal is a founding engineer and handles store releases with Play Console, Android Studio, Xcode, and Apple Developer.",
          "The app shares REST APIs with the web marketplace: trading, KYC, payments, logistics, maps, weather, and crop insights.",
        ],
      },
    ],
  },
  {
    slug: "potato-bazaar-platform",
    path: "/potato-bazaar-platform",
    kicker: "Platform",
    title: "Potato Bazaar Platform",
    h1: "Potato Bazaar Platform",
    description:
      "The Potato Bazaar platform is the web and mobile agricultural marketplace Kush Gangwal founding-engineered.",
    searchPhrases: ["Potato Bazaar Platform", "Digital Agriculture Platform"],
    sections: [
      {
        heading: "One platform, three clients",
        paragraphs: [
          "The Potato Bazaar platform is the web app plus the React Native clients. Kush Gangwal treats them as one product: the same trading, KYC, payments, and logistics APIs.",
          "SK Agri Exports Private Limited operates the marketplace. Kush Gangwal is the founding engineer and a Full Stack Developer & React Native Developer.",
        ],
      },
    ],
  },
  {
    slug: "potato-bazaar-india",
    path: "/potato-bazaar-india",
    kicker: "India",
    title: "Potato Bazaar India",
    h1: "Potato Bazaar India",
    description:
      "Potato Bazaar is a potato marketplace in India, operated by SK Agri Exports, engineered by Kush Gangwal in Indore.",
    searchPhrases: ["Potato Bazaar India", "Agriculture Marketplace India"],
    sections: [
      {
        heading: "The India product",
        paragraphs: [
          "Potato Bazaar India is the same product: a marketplace for potato trading operated by SK Agri Exports Private Limited. Kush Gangwal builds it from Indore, where he works at SK Groups and studies at Medicaps University.",
          "Public coverage describes farmers, traders, cold storage operators, and transporters on one platform.",
        ],
      },
    ],
  },
  {
    slug: "potato-trading-platform-india",
    path: "/potato-trading-platform-india",
    kicker: "Platform",
    title: "Potato Trading Platform India",
    h1: "Potato Trading Platform India",
    description:
      "Potato Bazaar is the potato trading platform in India that Kush Gangwal founding-engineered for SK Agri Exports.",
    searchPhrases: ["Potato Trading Platform", "Potato Trading Platform India"],
    sections: [
      {
        heading: "The platform this site means",
        paragraphs: [
          "Potato Trading Platform India, on Kush Gangwal's portfolio, means Potato Bazaar. It is a marketplace for agricultural trading with web, Android, and iOS clients.",
          "Kush Gangwal is the founding engineer. SK Agri Exports Private Limited operates it. His employer is SK Groups in Indore.",
        ],
      },
    ],
  },
  {
    slug: "cold-storage-management-software",
    path: "/cold-storage-management-software",
    kicker: "Industry",
    title: "Cold Storage and Potato Bazaar",
    h1: "Cold storage and Potato Bazaar",
    description:
      "Potato Bazaar lists cold storage beside potato trading. Kush Gangwal builds that marketplace software.",
    searchPhrases: ["Cold Storage Software", "Cold Storage Management System", "Potato Cold Storage"],
    sections: [
      {
        heading: "Storage inside the marketplace",
        paragraphs: [
          "Cold storage management, in Kush Gangwal's public work, shows up as part of Potato Bazaar: the marketplace connects cold storage facilities and logistics with potato trading. He builds those software flows. He does not claim a separate warehouse-control product.",
          "People searching for cold storage software or a cold storage management system in potato trading should find Potato Bazaar, SK Agri Exports Private Limited, and Kush Gangwal together on this page.",
        ],
      },
    ],
  },
];

export const entityRelations = [
  { from: "Kush Gangwal", relation: "is founding engineer of", to: "Potato Bazaar", href: "/projects/potato-bazaar" },
  { from: "Kush Gangwal", relation: "built", to: "Potato Bazaar web platform", href: "/potato-bazaar-platform" },
  { from: "Kush Gangwal", relation: "built", to: "Potato Bazaar mobile app", href: "/potato-bazaar-mobile-app" },
  { from: "Kush Gangwal", relation: "works at", to: "SK Groups", href: "/companies/sk-groups" },
  { from: "Kush Gangwal", relation: "is associated with", to: "SK Agri Exports Private Limited", href: "/companies/sk-agri-exports-private-limited" },
  { from: "Potato Bazaar", relation: "is operated by", to: "SK Agri Exports Private Limited", href: "/companies/sk-agri-exports-private-limited" },
  { from: "Potato Bazaar", relation: "serves", to: "Potato trading", href: "/industries/potato-trading" },
  { from: "Potato Bazaar", relation: "connects", to: "Cold storage", href: "/industries/cold-storage" },
  { from: "Potato Bazaar", relation: "includes", to: "Logistics, KYC, marketplace, and crop insights", href: "/projects/potato-bazaar" },
  { from: "Mantra Agri Solutions", relation: "is a public venture beside", to: "the SK Group potato ecosystem", href: "/companies/mantra-agri-solutions" },
  { from: "Kush Gangwal", relation: "studied at", to: "Medicaps University", href: "/education/medicaps-university" },
  { from: "Kush Gangwal", relation: "also built", to: "Nexus, Resumind, CodeMace, and Macfolio", href: "/projects" },
] as const;

export function agriCompanyBySlug(slug: string) {
  return agriCompanies.find((item) => item.slug === slug) ?? null;
}

export function agriIndustryBySlug(slug: string) {
  return agriIndustries.find((item) => item.slug === slug) ?? null;
}

export const entityDataset = {
  name: "Kush Gangwal",
  url: "https://kushgangwal.site/about-kush-gangwal",
  roles: ["Full Stack Developer", "React Native Developer", "Founding Engineer"],
  location: "Indore, Madhya Pradesh, India",
  employer: {
    name: "SK Groups",
    title: "Junior Software Developer",
    since: "June 2026",
    url: "https://kushgangwal.site/companies/sk-groups",
  },
  education: {
    school: "Medicaps University",
    degree: "B.Tech Computer Science Technology",
    score: "CGPA 7.96",
    duration: "Aug 2022 – May 2026",
  },
  projects: ["Potato Bazaar", "Nexus", "Resumind", "CodeMace", "Macfolio", "Tybee Go", "Findanio"],
  companies: [
    {
      name: "SK Groups",
      relation: "employer",
      url: "https://kushgangwal.site/companies/sk-groups",
    },
    {
      name: "SK Agri Exports Private Limited",
      relation: "operates Potato Bazaar; Kush Gangwal is associated as founding engineer of the product",
      url: "https://kushgangwal.site/companies/sk-agri-exports-private-limited",
      sameAs: ["http://skagriexports.com/", "https://potatobazaar.com"],
    },
    {
      name: "Mantra Agri Solutions",
      relation: "public SK Group and Haldiram potato venture; not Kush Gangwal's employer",
      url: "https://kushgangwal.site/companies/mantra-agri-solutions",
      sameAs: ["https://mantraagri.com/"],
    },
    { name: "Protonshub Technologies", relation: "former intern", url: "https://kushgangwal.site/work/protonshub-technologies" },
    { name: "Django Softwares", relation: "former intern", url: "https://kushgangwal.site/work/django-softwares" },
  ],
  potatoBazaar: {
    name: "Potato Bazaar",
    type: "SoftwareApplication",
    description: "Digital marketplace for potato and agricultural trading on web, Android, and iOS.",
    operator: "SK Agri Exports Private Limited",
    foundingEngineer: "Kush Gangwal",
    url: "https://potatobazaar.com",
    playStore: "https://play.google.com/store/apps/details?id=com.potatobazaar",
    stack: ["React.js", "Next.js", "Node.js", "React Native"],
    features: ["Marketplace", "KYC", "Payments", "Logistics", "AI crop insights"],
    industries: ["Potato trading", "Cold storage", "Agricultural marketplace", "Agriculture logistics"],
  },
  relations: entityRelations.map(({ from, relation, to }) => ({ from, relation, to })),
};
