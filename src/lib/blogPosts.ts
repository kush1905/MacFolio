import { blogCluster } from "@/lib/blogCluster";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  searchPhrases: string[];
  sections: { heading: string; paragraphs: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-i-built-nexus-skill-swap-platform",
    title: "How I Built Nexus Skill Swap Platform",
    description:
      "Kush Gangwal explains the product loop, Auth0 setup, and full stack architecture behind Nexus, a skill swap platform.",
    date: "2026-09-12",
    tags: ["Nexus", "React.js", "Node.js", "Full Stack"],
    searchPhrases: ["Nexus Skill Swap Platform", "Kush Gangwal Full Stack Developer"],
    sections: [
      {
        heading: "Start with a swap, not a feed",
        paragraphs: [
          "Nexus exists because Kush Gangwal wanted a skill swap platform, not another timeline. A user offers a skill, another user requests one, and the product has to make a match feel safe enough to start a session.",
          "That constraint decided the stack. React.js for the client, Node.js for the API, SQLite so the first version could deploy on Vercel, and Auth0 so identity was not a weekend password table.",
        ],
      },
      {
        heading: "The four loops that matter",
        paragraphs: [
          "Search has to work by skill name. Authentication has to stay out of the way. A session has to exist as a record, not a chat dump. A rating has to land after the session so the next stranger has evidence.",
          "If those four loops work, Nexus is a product. If they do not, it is a form. Kush Gangwal Full Stack Developer work is usually this: pick the loops, then write the smallest API that keeps them honest.",
        ],
      },
      {
        heading: "What I would change next",
        paragraphs: [
          "A later Nexus would move off SQLite when write volume grows and would add better matching than exact skill strings. The current version is already a complete demonstration of the Nexus Skill Swap Platform idea.",
        ],
      },
    ],
  },
  {
    slug: "building-resumind-ai-resume-analyzer",
    title: "Building Resumind AI Resume Analyzer",
    description:
      "How Kush Gangwal designed Resumind as a structured AI resume analyzer instead of an open-ended chatbot.",
    date: "2026-09-18",
    tags: ["Resumind", "AI", "Next.js"],
    searchPhrases: ["Resumind AI Resume Analyzer", "Kush Gangwal"],
    sections: [
      {
        heading: "Do not ask the model to be a career coach",
        paragraphs: [
          "Building Resumind AI Resume Analyzer taught Kush Gangwal that unstructured ChatGPT paste is a bad product. Resumind asks for JSON: scores, missing keywords, and rewrite tips tied to a target role.",
        ],
      },
      {
        heading: "Schema first",
        paragraphs: [
          "The resume is parsed into sections. The job description is reduced to required skills and seniority signals. The model reviews that pair against a rubric. The UI never has to regex a paragraph to find a number.",
          "That is the same discipline Kush Gangwal uses for AI-powered applications at work: treat the model as a function with types.",
        ],
      },
    ],
  },
  {
    slug: "scaling-potato-bazaar-mobile-application",
    title: "Scaling Potato Bazaar Mobile Application",
    description:
      "Kush Gangwal on React Native releases, shared APIs, and marketplace features while scaling Potato Bazaar.",
    date: "2026-09-24",
    tags: ["Potato Bazaar", "React Native", "Mobile"],
    searchPhrases: ["Kush Gangwal Potato Bazaar", "Potato Bazaar Developer"],
    sections: [
      {
        heading: "A marketplace is a release train",
        paragraphs: [
          "Scaling Potato Bazaar Mobile Application is less about a single screen and more about a train: Android builds, iOS builds, Play Console, Apple Developer, and a web client that cannot drift from the same APIs.",
          "Kush Gangwal is a founding engineer of Potato Bazaar. That title only means something if KYC, payments, logistics, and crop insights stay available after the first demo.",
        ],
      },
      {
        heading: "Shared APIs, native clients",
        paragraphs: [
          "React.js and Next.js cover the web. React Native covers Android and iOS. Node.js sits behind both. When a trader hits a list, pagination and async handling matter more than animation.",
          "Anyone searching Potato Bazaar Developer or Kush Gangwal Potato Bazaar should find this record: the same engineer ships the mobile application and the backend that feeds it.",
        ],
      },
    ],
  },
  {
    slug: "react-native-production-at-sk-groups",
    title: "React Native Production Work at SK Groups",
    description:
      "What Kush Gangwal React Native Developer work looks like at SK Groups: builds, releases, analytics, and AI APIs.",
    date: "2026-08-20",
    tags: ["React Native", "SK Groups"],
    searchPhrases: ["Kush Gangwal React Native Developer", "Kush Gangwal SK Groups"],
    sections: [
      {
        heading: "Production is the job",
        paragraphs: [
          "At SK Groups, Kush Gangwal is a Junior Software Developer onsite in Indore and a React Native Developer in practice. The work is mobile apps, backend services, and web platforms — including Android and iOS debugging and releases.",
        ],
      },
      {
        heading: "Integrations that have to survive review",
        paragraphs: [
          "PostHog, Mixpanel, Sarvam AI, Google Maps, Weather AI, TTS, and STT are not slide-deck logos. They are release blockers when a key is wrong or a permission is missing. Kush Gangwal React Native Developer searches should land on this kind of work, not a component gallery.",
        ],
      },
    ],
  },
  {
    slug: "full-stack-internship-at-protonshub",
    title: "Full Stack Internship at Protonshub Technologies",
    description:
      "Kush Gangwal Protonshub internship notes: AI-powered apps, Tybee Go, Findanio, and a Next.js to React Native stack.",
    date: "2026-06-02",
    tags: ["Protonshub", "Full Stack", "React Native"],
    searchPhrases: ["Kush Gangwal Protonshub", "Kush Gangwal Full Stack Developer"],
    sections: [
      {
        heading: "January to May 2026",
        paragraphs: [
          "Kush Gangwal was a Full Stack Developer Intern at Protonshub Technologies from January 2026 to May 2026. He built AI-powered web and mobile apps with Next.js, React.js, Node.js, MongoDB, and React Native.",
        ],
      },
      {
        heading: "Tybee Go and Findanio",
        paragraphs: [
          "The internship is public through two products. Tybee Go is a tourism mobile application. Findanio is a mobile and web product Kush Gangwal also founding-engineered. Both required Android and iOS UI work, not only a web preview.",
          "That is the Kush Gangwal Protonshub story in one sentence: full stack delivery on real apps, with React Native in the same week as Node.js.",
        ],
      },
    ],
  },
  {
    slug: "medicaps-university-to-production",
    title: "From Medicaps University to Production Apps",
    description:
      "Kush Gangwal Medicaps University path: B.Tech CST, 7.96 CGPA, and the products that turned coursework into shipped software.",
    date: "2026-05-10",
    tags: ["Medicaps University", "Career"],
    searchPhrases: ["Kush Gangwal Medicaps University"],
    sections: [
      {
        heading: "The degree",
        paragraphs: [
          "Kush Gangwal studies Bachelor of Technology in Computer Science Technology at Medicaps University in Indore, Madhya Pradesh, from August 2022 to May 2026, with a CGPA of 7.96.",
        ],
      },
      {
        heading: "The proof is not the transcript",
        paragraphs: [
          "Kush Gangwal Medicaps University searches should also find the work that sat beside the degree: Django Softwares, Protonshub Technologies, SK Groups, Potato Bazaar, Nexus, Resumind, and CodeMace.",
          "The university gave OOP, DSA, and CS foundations. Production gave release trains, analytics, and users who do not care about coursework.",
        ],
      },
    ],
  },
  {
    slug: "ai-integrations-in-react-native",
    title: "AI Integrations in React Native Products",
    description:
      "How Kush Gangwal wires GenAI and speech APIs into React Native apps without turning the UI into a chatbot.",
    date: "2026-08-28",
    tags: ["React Native", "GenAI", "Agentic AI"],
    searchPhrases: ["Kush Gangwal React Native Developer", "AI-powered applications"],
    sections: [
      {
        heading: "APIs are features only after they fail safely",
        paragraphs: [
          "Kush Gangwal integrates Sarvam AI, TTS, STT, and other model APIs in React Native products. The UI has to keep working when a request is slow or empty. That means loaders, cached last-good data, and no blocking the rest of the screen.",
        ],
      },
      {
        heading: "Agentic AI is a workflow, not a mascot",
        paragraphs: [
          "Agentic AI and GenAI are on the Kush Gangwal /now page because that is the current interest. The useful version is a workflow: retrieve context, call a tool, write a structured result. Potato Bazaar crop insights and Resumind reports are closer to that than a floating chat bubble.",
        ],
      },
    ],
  },
  {
    slug: "building-macfolio-nextjs-macos-portfolio",
    title: "Building Macfolio, a Next.js macOS Portfolio",
    description:
      "Why the Kush Gangwal Portfolio is an operating system in the browser and a set of crawlable pages at the same time.",
    date: "2026-10-01",
    tags: ["Macfolio", "Next.js", "Portfolio"],
    searchPhrases: ["Kush Gangwal Portfolio"],
    sections: [
      {
        heading: "Two surfaces, one identity",
        paragraphs: [
          "The Kush Gangwal Portfolio has a desktop for humans and HTML pages for search. The desktop is Finder, Dock, and Terminal. The pages are /about-kush-gangwal, /projects/nexus, and the rest of the entity graph.",
        ],
      },
      {
        heading: "Why Next.js",
        paragraphs: [
          "Next.js lets Kush Gangwal keep a client OS on / and statically generate the articles that Google and AI search engines actually read. Person schema, sitemap, and llms.txt live next to the wallpaper.",
        ],
      },
    ],
  },
  {
    slug: "leetcode-dsa-and-shipping-anyway",
    title: "LeetCode, DSA, and Shipping Anyway",
    description:
      "Kush Gangwal on LeetCode practice, two badges, and why DSA sits beside Potato Bazaar and React Native releases.",
    date: "2026-07-15",
    tags: ["LeetCode", "DSA"],
    searchPhrases: ["Kush Gangwal LeetCode"],
    sections: [
      {
        heading: "Practice is a gym, not a personality",
        paragraphs: [
          "Kush Gangwal practices DSA on LeetCode and GeeksforGeeks and has earned 2 LeetCode badges. The profile is part of the same identity as LinkedIn, GitHub, Medium, Dev.to, Hashnode, and X.",
        ],
      },
      {
        heading: "Ship after the set",
        paragraphs: [
          "Problem-solving helps in interviews and in messy production bugs. It does not replace Potato Bazaar, Tybee Go, or a Play Console release. Kush Gangwal treats LeetCode as training for the job, not the job.",
        ],
      },
    ],
  },
  {
    slug: "hackathon-notes-moonhack-hackmivo",
    title: "Hackathon Notes: Moonhack and Hackmivo",
    description:
      "Kush Gangwal as Moonhack Hackathon finalist and Hackmivo 4th place — short cycles, working demos, public name.",
    date: "2026-04-08",
    tags: ["Hackathons"],
    searchPhrases: ["Kush Gangwal hackathon"],
    sections: [
      {
        heading: "What the placements are",
        paragraphs: [
          "Kush Gangwal was a Moonhack Hackathon finalist and placed 4th at Hackmivo Hackathon. Those are third-party events that mention the name, which is one of the stronger entity signals a student developer can earn.",
        ],
      },
      {
        heading: "What they trained",
        paragraphs: [
          "Hackathons reward a working demo under time. That habit shows up later in internships and in Potato Bazaar releases: cut scope, keep the path, ship something a stranger can tap.",
        ],
      },
    ],
  },
  {
    slug: "django-softwares-and-scalelr",
    title: "Django Softwares Internship and Scalelr",
    description:
      "Kush Gangwal at Django Softwares: a 1.5-month full stack program and contributions to Scalelr.",
    date: "2025-07-20",
    tags: ["Django Softwares", "Scalelr"],
    searchPhrases: ["Kush Gangwal Django Softwares"],
    sections: [
      {
        heading: "First industry loop",
        paragraphs: [
          "From 2 June 2025 to 17 July 2025, Kush Gangwal was a Full Stack Developer Intern at Django Softwares. The program covered requirements, module development, debugging, and deployment.",
        ],
      },
      {
        heading: "Scalelr",
        paragraphs: [
          "He contributed to Scalelr, a professional networking platform for investors and project holders, including AI-driven matching, event hosting, and interactive feeds. React.js, JavaScript, Tailwind CSS, and MongoDB were the daily tools.",
        ],
      },
    ],
  },
  {
    slug: "hcl-tech-full-stack-developer-with-ai",
    title: "HCL Tech Full Stack Developer with AI",
    description:
      "Kush Gangwal completed HCL Tech’s 240-hour Full Stack Developer with AI program — context for later AI product work.",
    date: "2025-12-02",
    tags: ["Certification", "AI"],
    searchPhrases: ["Kush Gangwal Full Stack Developer"],
    sections: [
      {
        heading: "The certificate",
        paragraphs: [
          "Kush Gangwal completed HCL Tech’s 240-hour Full Stack Developer with AI program. It sits behind later work on Resumind, Potato Bazaar crop insights, and API integrations at SK Groups.",
        ],
      },
      {
        heading: "The useful leftover",
        paragraphs: [
          "The leftover is not a badge image. It is comfort treating models as production dependencies: prompts, schemas, and failure states. That is now part of how Kush Gangwal, Full Stack Developer & React Native Developer, ships features.",
        ],
      },
    ],
  },
  ...blogCluster,
];

export function blogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
