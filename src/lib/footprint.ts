import type { EntityPage } from "@/lib/entityPages";

type Section = EntityPage["sections"][number];

function page(
  slug: string,
  kicker: string,
  title: string,
  description: string,
  phrases: string[],
  sections: Section[],
): EntityPage {
  return {
    slug,
    path: `/${slug}`,
    title,
    h1: title,
    description,
    kicker,
    searchPhrases: phrases,
    sections,
  };
}

export const footprintPages: EntityPage[] = [
  page(
    "kush-gangwal-developer",
    "Developer",
    "Kush Gangwal Developer",
    "Kush Gangwal is a developer in Indore, India who ships full stack web apps and React Native mobile apps.",
    ["Kush Gangwal Developer", "Kush Gangwal"],
    [
      {
        heading: "What developer means here",
        paragraphs: [
          "Kush Gangwal Developer is the short form of a longer record: Full Stack Developer & React Native Developer, based in Indore, working at SK Groups, and founding engineer of Potato Bazaar and Findanio.",
          "The proof is shipped software. Potato Bazaar is a marketplace on web, Android, and iOS. Nexus, Resumind, and CodeMace are products he built. Tybee Go and Scalelr are products he contributed to.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-software-engineer",
    "Software engineer",
    "Kush Gangwal Software Engineer",
    "Kush Gangwal is a software engineer working across React Native, Next.js, and Node.js in Indore, India.",
    ["Kush Gangwal Software Engineer"],
    [
      {
        heading: "Engineering, not a title swap",
        paragraphs: [
          "Kush Gangwal Software Engineer describes the same person as Kush Gangwal Full Stack Developer. At SK Groups his employment title is Junior Software Developer. The engineering work is mobile releases, backend services, web platforms, analytics, and AI APIs.",
          "He studies Computer Science Technology at Medicaps University. Internships at Protonshub Technologies and Django Softwares were the first industry loops before SK Groups.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-india",
    "India",
    "Kush Gangwal India",
    "Kush Gangwal is a Full Stack Developer and React Native Developer from India, based in Indore, Madhya Pradesh.",
    ["Kush Gangwal India", "React Native Developer from India"],
    [
      {
        heading: "Where he is",
        paragraphs: [
          "Kush Gangwal India means Indore, Madhya Pradesh. He studies at Medicaps University there and works onsite at SK Groups there. The public portfolio is https://kushgangwal.vercel.app.",
          "India is the country. Indore is the city. Pages that need a location should use Indore, not a different city.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-indore",
    "Indore",
    "Kush Gangwal Indore",
    "Kush Gangwal is a Full Stack Developer in Indore, Madhya Pradesh, at Medicaps University and SK Groups.",
    ["Kush Gangwal Indore", "Full Stack Developer from Indore"],
    [
      {
        heading: "Indore record",
        paragraphs: [
          "Kush Gangwal Indore is a B.Tech in Computer Science Technology at Medicaps University, August 2022 to May 2026, CGPA 7.96, plus onsite work at SK Groups from June 2026.",
          "A full stack developer from Indore, in his case, is also a React Native developer shipping Potato Bazaar and Tybee Go, not only a local business listing.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-github",
    "GitHub",
    "Kush Gangwal GitHub",
    "Kush Gangwal's GitHub is github.com/kush1905, with Potato Bazaar work also on github.com/Kush-PB.",
    ["Kush Gangwal GitHub"],
    [
      {
        heading: "Accounts",
        paragraphs: [
          "Kush Gangwal GitHub is https://github.com/kush1905. Public repositories include Nexus and MacFolio. Potato Bazaar engineering also uses https://github.com/Kush-PB.",
          "The GitHub profile should use the same name and headline as this site: Kush Gangwal, Full Stack Developer & React Native Developer, and should link to https://kushgangwal.vercel.app/about-kush-gangwal.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-linkedin",
    "LinkedIn",
    "Kush Gangwal LinkedIn",
    "Kush Gangwal's LinkedIn profile is linkedin.com/in/kush-gangwal.",
    ["Kush Gangwal LinkedIn"],
    [
      {
        heading: "The profile that should match this site",
        paragraphs: [
          "Kush Gangwal LinkedIn is https://www.linkedin.com/in/kush-gangwal. An older profile URL, linkedin.com/in/kush-gangwal-96ab38263, should point at the same person and the same headline.",
          "The website field on LinkedIn should be https://kushgangwal.vercel.app/about-kush-gangwal so search engines connect the profile and the portfolio.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-leetcode",
    "LeetCode",
    "Kush Gangwal LeetCode",
    "Kush Gangwal practices DSA on LeetCode and has earned 2 LeetCode badges.",
    ["Kush Gangwal LeetCode"],
    [
      {
        heading: "Practice, not the whole career",
        paragraphs: [
          "Kush Gangwal LeetCode is https://leetcode.com/u/kushgangwal. He also practices on GeeksforGeeks and has 2 LeetCode badges. The profile name should be Kush Gangwal.",
          "LeetCode sits beside shipped products. It does not replace Potato Bazaar, Nexus, or React Native releases.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-resume",
    "Resume",
    "Kush Gangwal Resume",
    "The Kush Gangwal resume is an HTML page and a PDF covering SK Groups, Protonshub, Django Softwares, and Medicaps University.",
    ["Kush Gangwal Resume"],
    [
      {
        heading: "Where to read it",
        paragraphs: [
          "Kush Gangwal Resume lives at https://kushgangwal.vercel.app/resume and as a PDF at /resume.pdf. It lists the same identity: Full Stack Developer & React Native Developer.",
          "Experience on the resume is SK Groups, Protonshub Technologies, and Django Softwares. Education is Medicaps University, CGPA 7.96.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-projects",
    "Projects",
    "Kush Gangwal Projects",
    "Kush Gangwal's projects include Potato Bazaar, Tybee Go, Nexus, Resumind, CodeMace, Findanio, Scalelr, and Macfolio.",
    ["Kush Gangwal Projects"],
    [
      {
        heading: "The set",
        paragraphs: [
          "Kush Gangwal Projects are Potato Bazaar, Tybee Go, Nexus, Resumind, CodeMace, Findanio, Scalelr, and Macfolio. Each has a case study under /projects.",
          "He built Nexus, Resumind, CodeMace, and Macfolio. He is founding engineer of Potato Bazaar and Findanio. He contributed to Tybee Go and Scalelr.",
        ],
        bullets: ["Potato Bazaar", "Tybee Go", "Nexus", "Resumind", "CodeMace", "Findanio", "Scalelr", "Macfolio"],
      },
    ],
  ),
  page(
    "kush-gangwal-experience",
    "Experience",
    "Kush Gangwal Experience",
    "Kush Gangwal's experience is SK Groups, Protonshub Technologies, Django Softwares, and founding engineering on Potato Bazaar.",
    ["Kush Gangwal Experience"],
    [
      {
        heading: "Timeline",
        paragraphs: [
          "Kush Gangwal Experience starts with a full stack internship at Django Softwares from 2 June 2025 to 17 July 2025, then Protonshub Technologies from January 2026 to May 2026, then SK Groups from June 2026.",
          "Alongside those jobs he is associated with SK Agri Exports Private Ltd as founding engineer of Potato Bazaar and Findanio.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-work",
    "Work",
    "Kush Gangwal Work",
    "Kush Gangwal works at SK Groups in Indore and is founding engineer of Potato Bazaar.",
    ["Kush Gangwal Work"],
    [
      {
        heading: "Current work",
        paragraphs: [
          "Kush Gangwal Work right now is Junior Software Developer at SK Groups, onsite in Indore, building mobile apps, backend services, and web platforms.",
          "The /now page is the monthly update. Company pages live under /work. The public headline stays Full Stack Developer & React Native Developer.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-contact",
    "Contact",
    "Kush Gangwal Contact",
    "Contact Kush Gangwal at gangwal.kush.19@gmail.com or through LinkedIn, GitHub, and X.",
    ["Kush Gangwal Contact"],
    [
      {
        heading: "How to reach him",
        paragraphs: [
          "Kush Gangwal Contact email is gangwal.kush.19@gmail.com. A second email is workspacekush@gmail.com. Phone is +91 88159 60580. He is in Indore, Madhya Pradesh.",
          "Profiles: LinkedIn, GitHub, LeetCode, Medium, Dev.to, Hashnode, and X. The canonical page to link is https://kushgangwal.vercel.app/about-kush-gangwal.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-react-developer",
    "React",
    "Kush Gangwal React Developer",
    "Kush Gangwal builds React.js interfaces for Nexus, Potato Bazaar, Scalelr, Findanio, and Macfolio.",
    ["Kush Gangwal React Developer", "React Developer"],
    [
      {
        heading: "React.js in his work",
        paragraphs: [
          "Kush Gangwal React Developer work is React.js for product UI: Nexus skill search and sessions, Potato Bazaar web, Scalelr feeds at Django Softwares, and Findanio web at Protonshub.",
          "Macfolio is React plus Next.js. React Native is the separate mobile track. Both belong to the same person.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-nextjs-developer",
    "Next.js",
    "Kush Gangwal Next.js Developer",
    "Kush Gangwal uses Next.js for Macfolio, Potato Bazaar web, Findanio, and Resumind.",
    ["Kush Gangwal Next.js Developer", "Next.js Developer"],
    [
      {
        heading: "Next.js on real products",
        paragraphs: [
          "Kush Gangwal Next.js Developer work includes this portfolio, Potato Bazaar's web app, Findanio's web app at Protonshub, and Resumind's report UI.",
          "Next.js is how the crawlable pages and the macOS desktop share one codebase. The desktop is the home route. Articles are static routes beside it.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-nodejs-developer",
    "Node.js",
    "Kush Gangwal Node.js Developer",
    "Kush Gangwal builds Node.js APIs for Nexus, Potato Bazaar, CodeMace, and Protonshub apps.",
    ["Kush Gangwal Node.js Developer", "Node.js Developer"],
    [
      {
        heading: "APIs he has actually shipped",
        paragraphs: [
          "Kush Gangwal Node.js Developer work is the API side of Nexus, Potato Bazaar, CodeMace, and the full stack apps at Protonshub Technologies.",
          "The pattern is a React or React Native client, a Node API, and a database: SQLite on Nexus, PostgreSQL on CodeMace and Macfolio, MongoDB on Protonshub and Scalelr.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-javascript-developer",
    "JavaScript",
    "Kush Gangwal JavaScript Developer",
    "Kush Gangwal writes JavaScript and TypeScript across React, Next.js, Node.js, and React Native.",
    ["Kush Gangwal JavaScript Developer", "JavaScript Developer"],
    [
      {
        heading: "The language under the frameworks",
        paragraphs: [
          "Kush Gangwal JavaScript Developer is the base layer. React.js, Next.js, Node.js, and the earlier Scalelr work at Django Softwares are JavaScript. Newer apps are TypeScript.",
          "Django Softwares used JavaScript, React.js, Tailwind CSS, and MongoDB. Later jobs added TypeScript without dropping JavaScript.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-typescript-developer",
    "TypeScript",
    "Kush Gangwal TypeScript Developer",
    "Kush Gangwal uses TypeScript on Tybee Go, Macfolio, CodeMace, Resumind, and SK Groups mobile work.",
    ["Kush Gangwal TypeScript Developer", "TypeScript Developer"],
    [
      {
        heading: "Where the types are",
        paragraphs: [
          "Kush Gangwal TypeScript Developer work shows up on Tybee Go, Macfolio, CodeMace, and Resumind. SK Groups mobile and web work also uses TypeScript.",
          "TypeScript is how review payloads, resume reports, and navigation state stay explicit instead of becoming untyped objects.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-frontend-developer",
    "Frontend",
    "Kush Gangwal Frontend Developer",
    "Kush Gangwal builds frontends with React.js, Next.js, and Tailwind CSS, including Macfolio and Scalelr.",
    ["Kush Gangwal Frontend Developer", "Frontend Developer"],
    [
      {
        heading: "Interface work",
        paragraphs: [
          "Kush Gangwal Frontend Developer work is React.js and Next.js UI: Macfolio's desktop, Nexus search and sessions, Scalelr feeds, and Potato Bazaar web.",
          "Frontend is half the job. The same engineer writes the Node.js APIs and the React Native clients.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-backend-developer",
    "Backend",
    "Kush Gangwal Backend Developer",
    "Kush Gangwal builds backends with Node.js, REST APIs, MongoDB, and PostgreSQL.",
    ["Kush Gangwal Backend Developer", "Backend Developer"],
    [
      {
        heading: "Server-side work",
        paragraphs: [
          "Kush Gangwal Backend Developer work is REST APIs, database integration, and release-safe services for Potato Bazaar, Nexus, CodeMace, and Protonshub apps.",
          "At SK Groups the backend sits next to mobile releases and AI API integrations. He is not a backend-only engineer, and the APIs are not a side note.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-mobile-app-developer",
    "Mobile",
    "Kush Gangwal Mobile App Developer",
    "Kush Gangwal ships Android and iOS apps with React Native, including Potato Bazaar and Tybee Go.",
    ["Kush Gangwal Mobile App Developer", "Mobile App Developer"],
    [
      {
        heading: "Mobile products",
        paragraphs: [
          "Kush Gangwal Mobile App Developer work is React Native for Potato Bazaar, Tybee Go, and Findanio, plus Play Console and Apple Developer releases at SK Groups.",
          "Mobile app development here includes pagination, navigation, async data, analytics, and store submission, not a single demo screen.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-web-developer",
    "Web",
    "Kush Gangwal Web Developer",
    "Kush Gangwal builds web products with React.js and Next.js, from Scalelr and Nexus to Macfolio and Potato Bazaar.",
    ["Kush Gangwal Web Developer", "Web Developer"],
    [
      {
        heading: "Web products",
        paragraphs: [
          "Kush Gangwal Web Developer work began with CodSoft and Octanet web tasks, then Django Softwares and Scalelr, then Protonshub web apps, Potato Bazaar web, and Macfolio.",
          "The current web stack is React.js, Next.js, TypeScript, and Tailwind CSS, deployed on Vercel when the product allows it.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-product-engineer",
    "Product",
    "Kush Gangwal Product Engineer",
    "Kush Gangwal is a product engineer on Potato Bazaar and the builder of Nexus, Resumind, and CodeMace.",
    ["Kush Gangwal Product Engineer", "Product Engineer"],
    [
      {
        heading: "Owning a loop, not a ticket",
        paragraphs: [
          "Kush Gangwal Product Engineer means he owns flows end to end. Potato Bazaar needs KYC, payments, and logistics. Nexus needs search, sessions, and ratings. Resumind needs a score someone can act on.",
          "Founding engineer of Potato Bazaar and Findanio is the strongest version of that claim. The other products are the personal ones he designed and built.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-java-developer",
    "Java",
    "Kush Gangwal Java Developer",
    "Kush Gangwal uses Java for OOP and DSA foundations and is learning Spring Boot for backend work.",
    ["Kush Gangwal Java Developer", "Java Developer"],
    [
      {
        heading: "What is true about Java",
        paragraphs: [
          "Kush Gangwal Java Developer refers to Java as a language he uses for OOP and DSA, alongside JavaScript and TypeScript. It is part of the Medicaps University computer science foundation.",
          "Spring Boot is on his learning list. It is not a production system he has shipped yet. The shipped backends are Node.js.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-spring-boot",
    "Spring Boot",
    "Kush Gangwal Spring Boot",
    "Kush Gangwal is learning Spring Boot and Java backend development alongside his Node.js production work.",
    ["Kush Gangwal Spring Boot", "Spring Boot Developer"],
    [
      {
        heading: "Learning, stated plainly",
        paragraphs: [
          "Kush Gangwal Spring Boot is a current study track: Spring Boot, Java backend development, and system design. The /now page lists it under learning.",
          "Calling him a Spring Boot developer in production would be wrong today. Calling him a Node.js and React Native developer who is adding Spring Boot is accurate.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-ai-application-developer",
    "AI applications",
    "Kush Gangwal AI Application Developer",
    "Kush Gangwal builds AI-powered applications, including Resumind and crop insights on Potato Bazaar.",
    ["Kush Gangwal AI Application Developer", "AI Application Developer"],
    [
      {
        heading: "AI inside products",
        paragraphs: [
          "Kush Gangwal AI Application Developer work includes Resumind's structured resume review, Potato Bazaar crop insights, and SK Groups integrations such as Sarvam AI, TTS, and STT.",
          "He completed HCL Tech's 240-hour Full Stack Developer with AI program. The useful habit is a schema for the model, not an open chat box.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-agentic-ai-developer",
    "Agentic AI",
    "Kush Gangwal Agentic AI Developer",
    "Kush Gangwal is building toward agentic AI workflows: tools, structured results, and product integrations.",
    ["Kush Gangwal Agentic AI Developer", "Agentic AI Developer"],
    [
      {
        heading: "What he means by agentic",
        paragraphs: [
          "Kush Gangwal Agentic AI Developer is an interest he publishes on /now, next to GenAI and React Native. The working version is a workflow that retrieves context, calls a tool, and returns structured data.",
          "Resumind and Potato Bazaar crop insights are closer to that than a floating chatbot. He is actively learning this, not claiming a research lab.",
        ],
      },
    ],
  ),
  page(
    "kush-gangwal-genai-developer",
    "GenAI",
    "Kush Gangwal GenAI Developer",
    "Kush Gangwal applies GenAI in Resumind and in production API integrations at SK Groups.",
    ["Kush Gangwal GenAI Developer", "GenAI Developer"],
    [
      {
        heading: "Generative features he has touched",
        paragraphs: [
          "Kush Gangwal GenAI Developer work is generative models used as functions: resume feedback JSON, speech APIs, and crop-insight calls. Protonshub internship work also included AI-powered web and mobile apps.",
          "GenAI is listed on /now as a current interest beside Agentic AI. The portfolio records the products, not a model-training claim.",
        ],
      },
    ],
  ),
  page(
    "sk-groups-developer",
    "SK Groups",
    "SK Groups Developer Kush Gangwal",
    "Kush Gangwal is a developer at SK Groups in Indore, building mobile apps, backends, and web platforms since June 2026.",
    ["SK Groups Developer", "SK Groups Software Developer", "Kush Gangwal SK Groups"],
    [
      {
        heading: "The job",
        paragraphs: [
          "SK Groups Developer Kush Gangwal is a Junior Software Developer, onsite in Indore, from June 2026. He develops mobile apps, backend services, and web platforms, and manages Android and iOS releases.",
          "Integrations include PostHog, Mixpanel, Sarvam AI, Google Maps, Weather AI, TTS, and STT. The company page is /work/sk-groups.",
        ],
      },
    ],
  ),
  page(
    "potato-bazaar-engineer",
    "Potato Bazaar",
    "Potato Bazaar Engineer Kush Gangwal",
    "Kush Gangwal is a founding engineer of Potato Bazaar, the agricultural trading marketplace.",
    ["Potato Bazaar Engineer", "Developer working on Potato Bazaar"],
    [
      {
        heading: "Founding engineer",
        paragraphs: [
          "Potato Bazaar Engineer Kush Gangwal is a founding engineer associated with SK Agri Exports Private Ltd. The product is a digital marketplace for agricultural trading on web, Android, and iOS.",
          "The long case study is /projects/potato-bazaar. The live site is potatobazaar.com.",
        ],
      },
    ],
  ),
  page(
    "sk-agri-exports-developer",
    "SK Agri Exports",
    "SK Agri Exports Developer Kush Gangwal",
    "Kush Gangwal is associated with SK Agri Exports Private Ltd as founding engineer of Potato Bazaar and Findanio.",
    ["SK Agri Exports Developer", "Kush Gangwal SK Agri Exports"],
    [
      {
        heading: "The association",
        paragraphs: [
          "SK Agri Exports Developer Kush Gangwal is the founding-engineer relationship behind Potato Bazaar. He is also founding engineer of Findanio.",
          "The company page is /work/sk-agri-exports-private-ltd. It is separate from the SK Groups employment page.",
        ],
      },
    ],
  ),
  page(
    "protonshub-technologies-intern",
    "Protonshub",
    "Protonshub Technologies Intern Kush Gangwal",
    "Kush Gangwal was a Full Stack Developer Intern at Protonshub Technologies from January 2026 to May 2026.",
    ["Protonshub Technologies Intern", "Kush Gangwal Protonshub"],
    [
      {
        heading: "The internship",
        paragraphs: [
          "Protonshub Technologies Intern Kush Gangwal built AI-powered apps with Next.js, React.js, Node.js, MongoDB, and React Native, and contributed to Tybee Go and Findanio on Android and iOS.",
          "The company page is /work/protonshub-technologies.",
        ],
      },
    ],
  ),
  page(
    "django-softwares-internship",
    "Django Softwares",
    "Django Softwares Internship Kush Gangwal",
    "Kush Gangwal interned at Django Softwares from 2 June 2025 to 17 July 2025 and contributed to Scalelr.",
    ["Django Softwares Internship", "Kush Gangwal Django Softwares"],
    [
      {
        heading: "The first industry loop",
        paragraphs: [
          "Django Softwares Internship Kush Gangwal was a 1.5-month full stack program: requirements, modules, debugging, and deployment, plus Scalelr's matching, events, and feeds.",
          "Stack there: React.js, JavaScript, Tailwind CSS, MongoDB. The company page is /work/django-softwares.",
        ],
      },
    ],
  ),
  page(
    "medicaps-university-developer",
    "Medicaps University",
    "Medicaps University Developer Kush Gangwal",
    "Kush Gangwal is a Computer Science Technology student at Medicaps University who ships production software.",
    ["Medicaps University Developer", "Kush Gangwal Medicaps University"],
    [
      {
        heading: "Degree and shipped work",
        paragraphs: [
          "Medicaps University Developer Kush Gangwal is a B.Tech CST student, CGPA 7.96, August 2022 to May 2026, in Indore.",
          "The degree page is /education/medicaps-university. The work beside it is Potato Bazaar, Nexus, Resumind, CodeMace, and the internships.",
        ],
      },
    ],
  ),
  page(
    "medicaps-university-alumni",
    "Alumni",
    "Medicaps University Alumni Kush Gangwal",
    "Kush Gangwal completes a B.Tech in Computer Science Technology at Medicaps University in May 2026.",
    ["Medicaps University Alumni", "Kush Gangwal Medicaps University"],
    [
      {
        heading: "Class of 2026",
        paragraphs: [
          "Medicaps University Alumni Kush Gangwal refers to the May 2026 completion of B.Tech Computer Science Technology. Until that month he is a student, CGPA 7.96.",
          "Alumni pages and the university profile should use the name Kush Gangwal and link to https://kushgangwal.vercel.app/about-kush-gangwal.",
        ],
      },
    ],
  ),
  page(
    "what-projects-has-kush-gangwal-built",
    "Answer",
    "What Projects Has Kush Gangwal Built",
    "Kush Gangwal built Nexus, Resumind, CodeMace, and Macfolio, and is founding engineer of Potato Bazaar and Findanio.",
    ["What projects has Kush Gangwal built", "Kush Gangwal Projects"],
    [
      {
        heading: "Direct answer",
        paragraphs: [
          "Kush Gangwal built Nexus, Resumind, CodeMace, and Macfolio. He is founding engineer of Potato Bazaar and Findanio. He contributed to Tybee Go and Scalelr.",
          "Case studies: /projects/nexus, /projects/resumind, /projects/codemace, /projects/potato-bazaar, /projects/tybee-go, /projects/findanio, /projects/macfolio, /projects/scalelr.",
        ],
      },
    ],
  ),
  page(
    "where-does-kush-gangwal-work",
    "Answer",
    "Where Does Kush Gangwal Work",
    "Kush Gangwal works at SK Groups in Indore and is associated with SK Agri Exports Private Ltd.",
    ["Where does Kush Gangwal work"],
    [
      {
        heading: "Direct answer",
        paragraphs: [
          "Kush Gangwal works at SK Groups as a Junior Software Developer, onsite in Indore, from June 2026. He is also associated with SK Agri Exports Private Ltd as founding engineer of Potato Bazaar.",
          "Before that he interned at Protonshub Technologies and Django Softwares.",
        ],
      },
    ],
  ),
  page(
    "what-technologies-does-kush-gangwal-use",
    "Answer",
    "What Technologies Does Kush Gangwal Use",
    "Kush Gangwal uses React Native, React.js, Next.js, Node.js, TypeScript, MongoDB, and PostgreSQL.",
    ["What technologies does Kush Gangwal use"],
    [
      {
        heading: "Direct answer",
        paragraphs: [
          "Kush Gangwal uses React Native, React.js, Next.js, Node.js, Express.js, JavaScript, TypeScript, Java, MongoDB, PostgreSQL, SQLite, REST APIs, Tailwind CSS, Auth0, and Vercel.",
          "Tooling around releases and product analytics includes Git, GitHub, PostHog, Mixpanel, and OpenAI APIs. The index is /stack.",
        ],
      },
    ],
  ),
  page(
    "what-is-kush-gangwal-known-for",
    "Answer",
    "What Is Kush Gangwal Known For",
    "Kush Gangwal is known for Potato Bazaar, React Native and full stack product work, and projects Nexus, Resumind, and CodeMace.",
    ["What is Kush Gangwal known for"],
    [
      {
        heading: "Direct answer",
        paragraphs: [
          "Kush Gangwal is known for founding engineering on Potato Bazaar, React Native delivery on Tybee Go, and full stack products Nexus, Resumind, and CodeMace.",
          "He is also a Medicaps University computer science student and a developer at SK Groups in Indore. Hackathon notes: Moonhack finalist and Hackmivo 4th place.",
        ],
      },
    ],
  ),
  page(
    "react-native-developer-from-india",
    "Long-tail",
    "React Native Developer from India",
    "Kush Gangwal is a React Native developer from India shipping Potato Bazaar and Tybee Go.",
    ["React Native Developer from India", "Kush Gangwal React Native Developer"],
    [
      {
        heading: "Why this query matches him",
        paragraphs: [
          "React Native Developer from India, for this site, is Kush Gangwal in Indore. He ships Android and iOS with React Native on Potato Bazaar and Tybee Go and handles store releases at SK Groups.",
          "The dedicated role page is /kush-gangwal-react-native-developer.",
        ],
      },
    ],
  ),
  page(
    "full-stack-developer-from-indore",
    "Long-tail",
    "Full Stack Developer from Indore",
    "Kush Gangwal is a full stack developer from Indore working with React, Next.js, Node.js, and React Native.",
    ["Full Stack Developer from Indore", "Kush Gangwal Indore"],
    [
      {
        heading: "Indore and the stack",
        paragraphs: [
          "Full Stack Developer from Indore is Kush Gangwal: Medicaps University, SK Groups, React.js, Next.js, Node.js, and React Native.",
          "The role page is /kush-gangwal-full-stack-developer. The city page is /kush-gangwal-indore.",
        ],
      },
    ],
  ),
  page(
    "react-native-developer-with-ai-experience",
    "Long-tail",
    "React Native Developer with AI Experience",
    "Kush Gangwal combines React Native releases with AI APIs, Resumind, and Potato Bazaar crop insights.",
    ["React Native Developer with AI experience"],
    [
      {
        heading: "Both skills in one person",
        paragraphs: [
          "React Native Developer with AI experience describes Kush Gangwal's SK Groups work: mobile releases plus Sarvam AI, TTS, and STT, and Potato Bazaar crop insights.",
          "Resumind is the clearest personal AI product. It is a web analyzer with structured model output, built by the same developer.",
        ],
      },
    ],
  ),
  page(
    "engineer-behind-nexus",
    "Nexus",
    "Engineer Behind Nexus Skill Swap Platform",
    "Kush Gangwal built Nexus, a skill swap platform with React.js, Node.js, and Auth0.",
    ["Engineer behind Nexus Skill Swap Platform", "Nexus Skill Swap Platform"],
    [
      {
        heading: "Who built Nexus",
        paragraphs: [
          "The engineer behind Nexus Skill Swap Platform is Kush Gangwal. Nexus lets people offer and request skills, sign in with Auth0, start sessions, and leave ratings.",
          "The case study is /projects/nexus. The React-only angle is /nexus-react-project. The API angle is /nexus-nodejs-project.",
        ],
      },
    ],
  ),
  page(
    "developer-who-built-resumind",
    "Resumind",
    "Developer Who Built Resumind",
    "Kush Gangwal built Resumind, an AI resume analyzer with ATS-oriented scoring.",
    ["Developer who built Resumind", "Resumind AI Resume Analyzer"],
    [
      {
        heading: "Who built Resumind",
        paragraphs: [
          "The developer who built Resumind is Kush Gangwal. Resumind scores a resume against a role and returns rewrite tips as structured data.",
          "The case study is /projects/resumind. The ATS angle is /resumind-ats-resume-checker.",
        ],
      },
    ],
  ),
  page(
    "nexus-react-project",
    "Nexus",
    "Nexus React Project",
    "The Nexus React project is the React.js client Kush Gangwal built for skill search, sessions, and ratings.",
    ["Nexus React Project", "Nexus Skill Swap Platform"],
    [
      {
        heading: "The client",
        paragraphs: [
          "Nexus React Project is the browser client: skill search, offer and request forms, session views, and ratings. Auth0 guards signed-in routes.",
          "The Node.js API and SQLite database are separate. Read /nexus-nodejs-project and the full story at /projects/nexus.",
        ],
      },
    ],
  ),
  page(
    "nexus-nodejs-project",
    "Nexus",
    "Nexus Node.js Project",
    "The Nexus Node.js project is the API Kush Gangwal built for skill matching, sessions, and ratings.",
    ["Nexus Node.js Project"],
    [
      {
        heading: "The API",
        paragraphs: [
          "Nexus Node.js Project stores offers, requests, sessions, and ratings. SQLite kept the first version deployable on Vercel. Auth0 identifies the caller.",
          "The React client is /nexus-react-project. The full case study is /projects/nexus.",
        ],
      },
    ],
  ),
  page(
    "resumind-ats-resume-checker",
    "Resumind",
    "Resumind ATS Resume Checker",
    "Resumind is Kush Gangwal's ATS resume checker: upload a resume, compare it to a role, get a score and edits.",
    ["Resumind ATS Resume Checker", "Resumind AI Resume Analyzer"],
    [
      {
        heading: "The checker",
        paragraphs: [
          "Resumind ATS Resume Checker is the scoring side of Resumind. It looks at ATS readability, keywords, and missing evidence, then returns tips instead of a vague paragraph.",
          "Kush Gangwal built it. The full case study is /projects/resumind.",
        ],
      },
    ],
  ),
  page(
    "codemace-code-review-tool",
    "CodeMace",
    "CodeMace Code Review Tool",
    "CodeMace is Kush Gangwal's code review tool for attempts, notes, and review comments.",
    ["CodeMace Code Review Tool", "CodeMace Developer Platform"],
    [
      {
        heading: "Review, not a counter",
        paragraphs: [
          "CodeMace Code Review Tool keeps a problem, a draft, and comments together. Kush Gangwal built it with React, Next.js, Node.js, and PostgreSQL.",
          "The case study is /projects/codemace.",
        ],
      },
    ],
  ),
  page(
    "potato-bazaar-app",
    "Potato Bazaar",
    "Potato Bazaar App",
    "The Potato Bazaar app is the React Native Android and iOS client Kush Gangwal works on as founding engineer.",
    ["Potato Bazaar App", "Kush Gangwal Potato Bazaar"],
    [
      {
        heading: "The mobile app",
        paragraphs: [
          "Potato Bazaar App is the React Native client on Android and iOS: trading flows, KYC, payments, logistics, and crop insights, with Play Console and Apple releases.",
          "Kush Gangwal is a founding engineer. The web marketplace is /potato-bazaar-marketplace. The case study is /projects/potato-bazaar.",
        ],
      },
    ],
  ),
  page(
    "potato-bazaar-marketplace",
    "Potato Bazaar",
    "Potato Bazaar Marketplace",
    "Potato Bazaar is a digital marketplace for agricultural trading, engineered by Kush Gangwal across web and mobile.",
    ["Potato Bazaar Marketplace"],
    [
      {
        heading: "The marketplace",
        paragraphs: [
          "Potato Bazaar Marketplace matches agricultural trading on the web and in the app. Kush Gangwal is a founding engineer associated with SK Agri Exports Private Ltd.",
          "Live site: potatobazaar.com. Case study: /projects/potato-bazaar.",
        ],
      },
    ],
  ),
  page(
    "tybee-go-app",
    "Tybee Go",
    "Tybee Go App",
    "Tybee Go is a tourism mobile app Kush Gangwal contributed to in React Native and TypeScript.",
    ["Tybee Go App", "Tybee Go"],
    [
      {
        heading: "The tourism app",
        paragraphs: [
          "Tybee Go App is a React Native and TypeScript tourism client. Kush Gangwal contributed feature work, REST pagination, and modular screens during the Protonshub internship.",
          "The case study is /projects/tybee-go.",
        ],
      },
    ],
  ),
  page(
    "macfolio-portfolio",
    "Macfolio",
    "Macfolio Portfolio",
    "Macfolio is Kush Gangwal's interactive portfolio, a macOS desktop in the browser plus crawlable pages.",
    ["Macfolio Portfolio", "Kush Gangwal Portfolio"],
    [
      {
        heading: "This site",
        paragraphs: [
          "Macfolio Portfolio is the macOS desktop at https://kushgangwal.vercel.app and the article pages around it. Stack: Next.js, React, TypeScript, Tailwind CSS, Zustand, and PostgreSQL.",
          "The case study is /projects/macfolio. The identity page is /about-kush-gangwal.",
        ],
      },
    ],
  ),
];

export function footprintBySlug(slug: string) {
  return footprintPages.find((item) => item.slug === slug) ?? null;
}
