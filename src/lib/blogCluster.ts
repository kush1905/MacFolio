import type { BlogPost } from "@/lib/blogPosts";

function post(
  slug: string,
  title: string,
  description: string,
  date: string,
  tags: string[],
  phrases: string[],
  sections: BlogPost["sections"],
): BlogPost {
  return { slug, title, description, date, tags, searchPhrases: phrases, sections };
}

export const blogCluster: BlogPost[] = [
  post(
    "how-to-build-a-react-native-app",
    "How to Build a React Native App",
    "Kush Gangwal's production sequence for a React Native app: screens, REST, then store release.",
    "2026-03-04",
    ["React Native"],
    ["How to Build a React Native App", "Kush Gangwal React Native Developer"],
    [
      {
        heading: "Start from a release, not a tutorial",
        paragraphs: [
          "Kush Gangwal builds a React Native app by naming the store release first. Potato Bazaar and Tybee Go both needed Android and iOS, so the first decisions are navigation, list pagination, and a typed API client.",
          "Screens come after the data contract. A tourism list and a marketplace list fail in the same way if async state is an afterthought.",
        ],
      },
    ],
  ),
  post(
    "react-native-production-deployment",
    "React Native Production Deployment",
    "How Kush Gangwal treats React Native deployment as Play Console, Apple Developer, and a shared API.",
    "2026-03-11",
    ["React Native", "Release"],
    ["React Native Production Deployment"],
    [
      {
        heading: "Deployment is two stores",
        paragraphs: [
          "At SK Groups, Kush Gangwal's React Native production deployment is Android Studio plus Play Console, and Xcode plus Apple Developer. The JavaScript bundle is not the release.",
          "Potato Bazaar is the reference. Web, Android, and iOS have to read the same REST payloads or the marketplace drifts.",
        ],
      },
    ],
  ),
  post(
    "react-native-android-release-process",
    "React Native Android Release Process",
    "Kush Gangwal's Android release path for React Native: build, Play Console, and crash checks.",
    "2026-03-18",
    ["Android", "React Native"],
    ["React Native Android Release Process"],
    [
      {
        heading: "Play Console is the product",
        paragraphs: [
          "Kush Gangwal ships Android from React Native through a signed build and Play Console tracks. Potato Bazaar's listing is the public proof: com.potatobazaar.",
          "Before a track is promoted he checks the API the list screens call, analytics events, and permissions. A green Metro bundler is not a release.",
        ],
      },
    ],
  ),
  post(
    "react-native-ios-release-process",
    "React Native iOS Release Process",
    "Kush Gangwal's iOS release path: Xcode, signing, and Apple Developer beside the React Native app.",
    "2026-03-25",
    ["iOS", "React Native"],
    ["React Native iOS Release Process"],
    [
      {
        heading: "Signing before features",
        paragraphs: [
          "Kush Gangwal treats iOS release as signing, devices, and Apple Developer, then the React Native diff. Tybee Go and Potato Bazaar both go through Xcode.",
          "The same TypeScript screens ship to Android. The release process does not. iOS fails on capabilities and profiles that Android never mentions.",
        ],
      },
    ],
  ),
  post(
    "mixpanel-integration-react-native",
    "Mixpanel Integration in React Native",
    "How Kush Gangwal uses Mixpanel on SK Groups mobile apps without blocking the UI.",
    "2026-04-02",
    ["Mixpanel", "React Native"],
    ["Mixpanel Integration React Native", "What is Mixpanel"],
    [
      {
        heading: "Events after the user action",
        paragraphs: [
          "Mixpanel, for Kush Gangwal, is product analytics on shipped SK Groups apps. Events fire after a real action: a screen that loaded, a trade step, a release people use.",
          "The integration sits beside PostHog. Neither SDK is allowed to block navigation. If the network is slow, the app still moves.",
        ],
      },
    ],
  ),
  post(
    "posthog-react-native-guide",
    "PostHog React Native Guide",
    "Kush Gangwal on using PostHog next to Mixpanel in production React Native apps.",
    "2026-04-08",
    ["PostHog", "React Native"],
    ["PostHog React Native Guide", "What is PostHog"],
    [
      {
        heading: "One question per tool",
        paragraphs: [
          "Kush Gangwal integrates PostHog at SK Groups for product behavior on mobile and web. It answers what people do after install, not whether the binary uploaded.",
          "PostHog and Mixpanel stay separate on purpose. Doubling every event into both tools without a question creates noise. Each event needs an owner.",
        ],
      },
    ],
  ),
  post(
    "nodejs-api-architecture",
    "Node.js API Architecture",
    "The Node.js shape Kush Gangwal repeats: a small REST API shared by React and React Native.",
    "2026-04-15",
    ["Node.js"],
    ["Node.js API Architecture"],
    [
      {
        heading: "One API, two clients",
        paragraphs: [
          "Kush Gangwal's Node.js APIs serve a web client and a React Native client. Nexus, Potato Bazaar, and CodeMace follow that split.",
          "Resources stay boring: lists with pagination, writes with auth, errors the UI can show. SQLite, PostgreSQL, or MongoDB sits behind the handler, not in the component.",
        ],
      },
    ],
  ),
  post(
    "nextjs-portfolio-website",
    "Next.js Portfolio Website",
    "Why Kush Gangwal's portfolio is a Next.js site with a desktop on / and articles everywhere else.",
    "2026-04-22",
    ["Next.js", "Portfolio"],
    ["Next.js Portfolio Website", "How to Build a Portfolio Website"],
    [
      {
        heading: "Two surfaces",
        paragraphs: [
          "Kush Gangwal's Next.js portfolio is Macfolio. The home route is a macOS desktop. /about-kush-gangwal, /projects, and /blog are normal HTML so search engines can read them.",
          "The canonical origin is https://kushgangwal.vercel.app until kushgangwal.site points at the same deployment.",
        ],
      },
    ],
  ),
  post(
    "building-ai-applications-with-react",
    "Building AI Applications with React",
    "How Kush Gangwal puts AI behind a React UI in Resumind and Potato Bazaar.",
    "2026-04-29",
    ["AI", "React"],
    ["Building AI Applications with React"],
    [
      {
        heading: "The UI needs a schema",
        paragraphs: [
          "Kush Gangwal builds AI applications in React by rendering fields, not a raw model paragraph. Resumind shows scores and tips. Potato Bazaar shows crop insights inside the marketplace.",
          "The React tree should still work when the model is slow. Last-good data and a clear failure beat a spinner that locks the page.",
        ],
      },
    ],
  ),
  post(
    "using-openai-apis-in-react-native",
    "Using OpenAI APIs in React Native",
    "Kush Gangwal on calling model APIs from mobile without freezing the React Native tree.",
    "2026-05-06",
    ["OpenAI", "React Native"],
    ["Using OpenAI APIs in React Native"],
    [
      {
        heading: "Call the API from a service",
        paragraphs: [
          "Kush Gangwal does not paste prompts into a React Native screen. A service calls the OpenAI API or another model API and returns JSON the screen already knows how to render.",
          "SK Groups work also includes Sarvam AI, TTS, and STT. The lesson is the same: speech and generation are features with failure states.",
        ],
      },
    ],
  ),
  post(
    "auth0-authentication-react-app",
    "Auth0 Authentication in a React App",
    "How Kush Gangwal used Auth0 on Nexus so the skill swap platform did not store passwords.",
    "2026-05-13",
    ["Auth0", "React"],
    ["Auth0 Authentication React App"],
    [
      {
        heading: "Identity is not the product",
        paragraphs: [
          "Nexus uses Auth0. Kush Gangwal needed sign-in for sessions and ratings, not a custom password table. Protected routes check the Auth0 session, then call the Node API.",
          "The product work stayed on skill search and ratings. Auth0 is the reason that work was not spent on credential storage.",
        ],
      },
    ],
  ),
  post(
    "what-is-react-native",
    "What Is React Native",
    "React Native, as Kush Gangwal uses it: one TypeScript UI for Android and iOS production apps.",
    "2026-05-20",
    ["React Native"],
    ["What is React Native"],
    [
      {
        heading: "A practical definition",
        paragraphs: [
          "React Native is a framework for native Android and iOS apps written with React. Kush Gangwal uses it for Potato Bazaar, Tybee Go, and Findanio.",
          "It does not remove Play Console or Xcode. Those stores are still the release. React Native is the UI and client logic in front of them.",
        ],
      },
    ],
  ),
  post(
    "how-to-publish-an-app-to-play-store",
    "How to Publish an App to the Play Store",
    "Kush Gangwal's Play Store path from a React Native Android build to a public listing.",
    "2026-05-27",
    ["Android"],
    ["How to Publish an App to Play Store"],
    [
      {
        heading: "Listing after the binary",
        paragraphs: [
          "Kush Gangwal publishes Android apps through Play Console. Potato Bazaar is the public listing. The steps that matter are a signed build, a tested API, and a track that matches the binary people will install.",
          "Store text is part of the release. A crash on first open erases any description.",
        ],
      },
    ],
  ),
  post(
    "how-to-release-an-ios-app",
    "How to Release an iOS App",
    "Kush Gangwal on releasing an iOS build from a React Native codebase.",
    "2026-06-03",
    ["iOS"],
    ["How to Release an iOS App"],
    [
      {
        heading: "Apple Developer is mandatory",
        paragraphs: [
          "Kush Gangwal releases iOS apps with Xcode and Apple Developer. React Native produces the app. Certificates, profiles, and review are still Apple's process.",
          "Tybee Go and Potato Bazaar both needed that path. Android success does not imply the iOS build is signed.",
        ],
      },
    ],
  ),
  post(
    "what-is-mixpanel",
    "What Is Mixpanel",
    "Mixpanel is the product-analytics tool Kush Gangwal integrates on SK Groups apps.",
    "2026-06-10",
    ["Mixpanel"],
    ["What is Mixpanel"],
    [
      {
        heading: "Events, not vibes",
        paragraphs: [
          "Mixpanel is an analytics product for tracking what people do inside an app. Kush Gangwal wires it into React Native and web releases at SK Groups.",
          "A useful Mixpanel setup names events after product actions. A useless one tracks everything and explains nothing.",
        ],
      },
    ],
  ),
  post(
    "what-is-posthog",
    "What Is PostHog",
    "PostHog is a product-analytics platform Kush Gangwal uses beside Mixpanel at SK Groups.",
    "2026-06-17",
    ["PostHog"],
    ["What is PostHog"],
    [
      {
        heading: "Product behavior after release",
        paragraphs: [
          "PostHog records product usage. Kush Gangwal integrates it on SK Groups mobile and web work so a release can be judged after it ships.",
          "He keeps PostHog and Mixpanel as separate questions. The stack page is /stack/posthog.",
        ],
      },
    ],
  ),
  post(
    "how-to-build-a-portfolio-website",
    "How to Build a Portfolio Website",
    "Kush Gangwal built Macfolio as a portfolio that humans can use and search engines can read.",
    "2026-06-24",
    ["Portfolio", "Next.js"],
    ["How to Build a Portfolio Website", "Kush Gangwal Portfolio"],
    [
      {
        heading: "Do not hide the name",
        paragraphs: [
          "Kush Gangwal's portfolio puts the name in the title, the H1 on /about-kush-gangwal, and Person schema. The desktop on / is for people. The articles are for indexing.",
          "One domain should be canonical. Today that is https://kushgangwal.vercel.app. kushgangwal.site becomes canonical after its DNS leaves the Hostinger parking page.",
        ],
      },
    ],
  ),
  post(
    "what-is-agentic-ai",
    "What Is Agentic AI",
    "Agentic AI, as Kush Gangwal is learning it: a workflow that calls tools and returns structured results.",
    "2026-07-01",
    ["Agentic AI"],
    ["What is Agentic AI", "Kush Gangwal Agentic AI Developer"],
    [
      {
        heading: "A workflow, not a mascot",
        paragraphs: [
          "Agentic AI means software that can take steps: retrieve context, call a tool, and write a result. Kush Gangwal lists it on /now as an active interest.",
          "He applies the idea in small ways already: Resumind's structured review and API-driven insights, not an unbounded autonomous agent.",
        ],
      },
    ],
  ),
  post(
    "what-is-genai",
    "What Is GenAI",
    "GenAI is generative model output. Kush Gangwal uses it where a schema can hold the result.",
    "2026-07-08",
    ["GenAI"],
    ["What is GenAI", "Kush Gangwal GenAI Developer"],
    [
      {
        heading: "Generation with a type",
        paragraphs: [
          "GenAI is software that generates text, speech, or other media from a model. Kush Gangwal uses it in Resumind and in speech and insight APIs at work.",
          "He treats the model as a function that returns JSON. The React or React Native UI renders that JSON.",
        ],
      },
    ],
  ),
  post(
    "how-to-build-a-resume-analyzer",
    "How to Build a Resume Analyzer",
    "How Kush Gangwal built Resumind: parse a resume, score it against a role, return edits.",
    "2026-07-15",
    ["Resumind", "AI"],
    ["How to Build a Resume Analyzer", "Resumind AI Resume Analyzer"],
    [
      {
        heading: "Score first",
        paragraphs: [
          "Kush Gangwal built Resumind as an analyzer, not a chatbot. The resume is parsed, the role is reduced to skills and seniority, and the model returns scores and tips.",
          "The ATS angle of that product is /resumind-ats-resume-checker. The case study is /projects/resumind.",
        ],
      },
    ],
  ),
  post(
    "potato-bazaar-kyc-payments-logistics",
    "KYC, Payments, and Logistics on Potato Bazaar",
    "The marketplace pieces Kush Gangwal ships on Potato Bazaar beyond a catalog screen.",
    "2026-07-22",
    ["Potato Bazaar"],
    ["Potato Bazaar Marketplace", "Kush Gangwal Potato Bazaar"],
    [
      {
        heading: "A marketplace is trust",
        paragraphs: [
          "Potato Bazaar needs KYC, payments, and logistics or it is only a listing. Kush Gangwal works on those flows as founding engineer, on web and React Native.",
          "Crop insights, maps, and weather sit on top of a transaction that already has to be safe.",
        ],
      },
    ],
  ),
  post(
    "findanio-android-ios-web",
    "Findanio on Android, iOS, and Web",
    "Kush Gangwal is founding engineer of Findanio and contributed to its clients at Protonshub.",
    "2026-07-29",
    ["Findanio"],
    ["Findanio", "Kush Gangwal Protonshub"],
    [
      {
        heading: "Three surfaces",
        paragraphs: [
          "Findanio ships on Android, iOS, and web. Kush Gangwal is a founding engineer and also contributed at Protonshub Technologies using Next.js, React, Node, MongoDB, and React Native.",
          "The case study is /projects/findanio.",
        ],
      },
    ],
  ),
  post(
    "scalelr-at-django-softwares",
    "What Scalelr Taught Me",
    "Kush Gangwal's Django Softwares internship, told through Scalelr's matching and feeds.",
    "2026-01-20",
    ["Scalelr"],
    ["Scalelr", "Django Softwares Internship"],
    [
      {
        heading: "A short internship, a real product",
        paragraphs: [
          "From 2 June 2025 to 17 July 2025 Kush Gangwal contributed to Scalelr at Django Softwares. The product connects investors and project holders with matching, events, and feeds.",
          "The stack was React.js, JavaScript, Tailwind CSS, and MongoDB. It was the first industry loop before Protonshub and SK Groups.",
        ],
      },
    ],
  ),
  post(
    "rest-pagination-react-native",
    "REST Pagination in React Native",
    "How Kush Gangwal keeps React Native lists usable as Potato Bazaar and Tybee Go grow.",
    "2026-02-04",
    ["React Native", "REST"],
    ["REST APIs", "Kush Gangwal React Native Developer"],
    [
      {
        heading: "Lists are the product",
        paragraphs: [
          "Kush Gangwal treats pagination as part of the feature. Tybee Go and Potato Bazaar both render remote lists. Loading the entire collection into memory is how those screens die.",
          "The React Native list, the REST page size, and the empty state are one design. Async errors have to leave the previous page on screen.",
        ],
      },
    ],
  ),
  post(
    "typescript-on-tybee-go",
    "TypeScript on Tybee Go",
    "Why Kush Gangwal used TypeScript for Tybee Go's React Native features.",
    "2026-02-11",
    ["TypeScript", "Tybee Go"],
    ["Tybee Go App"],
    [
      {
        heading: "Types at the API boundary",
        paragraphs: [
          "Tybee Go's React Native code is TypeScript. Kush Gangwal used it so navigation params and API payloads failed at compile time instead of on a device.",
          "The tourism screens still needed pagination and reusable components. Types did not replace that structure. They kept it from rotting.",
        ],
      },
    ],
  ),
  post(
    "postgresql-behind-codemace",
    "PostgreSQL Behind CodeMace",
    "Why Kush Gangwal put CodeMace reviews in PostgreSQL instead of a local file.",
    "2026-02-18",
    ["PostgreSQL", "CodeMace"],
    ["CodeMace Developer Platform"],
    [
      {
        heading: "Reviews have to survive",
        paragraphs: [
          "CodeMace keeps attempts and comments in PostgreSQL. Kush Gangwal wanted a review from last week to still be there, which a browser-only store does not guarantee.",
          "The UI is React and Next.js. The API is Node.js. The database is the memory of the tool.",
        ],
      },
    ],
  ),
  post(
    "mongodb-at-protonshub",
    "MongoDB at Protonshub",
    "How MongoDB showed up in Kush Gangwal's Protonshub full stack internship.",
    "2026-02-25",
    ["MongoDB", "Protonshub"],
    ["Protonshub Technologies Intern"],
    [
      {
        heading: "Documents next to React Native",
        paragraphs: [
          "At Protonshub, Kush Gangwal's stack included MongoDB beside Next.js, React, Node, and React Native. Findanio and the other internship apps stored flexible product data there.",
          "MongoDB was the internship database. PostgreSQL shows up later on Macfolio and CodeMace. Both are part of the record.",
        ],
      },
    ],
  ),
  post(
    "maps-weather-and-speech-apis",
    "Maps, Weather, and Speech APIs",
    "The third-party APIs Kush Gangwal integrates at SK Groups: maps, weather, TTS, and STT.",
    "2026-08-05",
    ["APIs", "SK Groups"],
    ["AI Integrations", "SK Groups Developer"],
    [
      {
        heading: "Integrations are release blockers",
        paragraphs: [
          "Kush Gangwal integrates Google Maps, weather, TTS, and STT at SK Groups. A missing key or permission fails review even when the React Native screen looks finished.",
          "Each API gets a failure state. The rest of the app keeps working when speech or weather is down.",
        ],
      },
    ],
  ),
  post(
    "from-medicaps-university-to-sk-groups",
    "From Medicaps University to SK Groups",
    "Kush Gangwal's path from B.Tech CST in Indore to onsite engineering at SK Groups.",
    "2026-08-12",
    ["Career", "Medicaps University"],
    ["Kush Gangwal Medicaps University", "Kush Gangwal Experience"],
    [
      {
        heading: "The sequence",
        paragraphs: [
          "Kush Gangwal started B.Tech Computer Science Technology at Medicaps University in August 2022. Internships at Django Softwares and Protonshub came before SK Groups in June 2026.",
          "The degree is CGPA 7.96 through May 2026. The job is in the same city, Indore.",
        ],
      },
    ],
  ),
  post(
    "github-readme-for-kush-gangwal",
    "What the GitHub README Should Say",
    "The exact identity Kush Gangwal should repeat on GitHub so it matches this site.",
    "2026-08-19",
    ["GitHub"],
    ["Kush Gangwal GitHub"],
    [
      {
        heading: "One bio",
        paragraphs: [
          "The GitHub README for kush1905 should say Kush Gangwal, Full Stack Developer & React Native Developer, and link to https://kushgangwal.vercel.app/about-kush-gangwal.",
          "A second account, Kush-PB, is the Potato Bazaar engineering account. Both should name the same person.",
        ],
      },
    ],
  ),
  post(
    "leetcode-next-to-releases",
    "LeetCode Next to Releases",
    "Kush Gangwal's DSA practice sits beside Play Console releases, not instead of them.",
    "2026-08-26",
    ["LeetCode"],
    ["Kush Gangwal LeetCode"],
    [
      {
        heading: "Two hours, different jobs",
        paragraphs: [
          "Kush Gangwal practices on LeetCode and has 2 badges. That work sharpens debugging and interviews.",
          "The public proof of engineering is still Potato Bazaar, Tybee Go, Nexus, Resumind, and CodeMace.",
        ],
      },
    ],
  ),
  post(
    "moonhack-and-hackmivo",
    "Moonhack and Hackmivo",
    "Kush Gangwal was a Moonhack finalist and placed 4th at Hackmivo.",
    "2026-01-08",
    ["Hackathons"],
    ["Kush Gangwal"],
    [
      {
        heading: "Named results",
        paragraphs: [
          "Kush Gangwal was a Moonhack Hackathon finalist and placed 4th at Hackmivo Hackathon. Those are third-party events that use his name.",
          "Hackathon demos trained the same habit as later releases: cut scope and ship something a stranger can open.",
        ],
      },
    ],
  ),
  post(
    "hcl-tech-ai-program-notes",
    "Notes from the HCL Tech AI Program",
    "What Kush Gangwal kept from the 240-hour Full Stack Developer with AI program.",
    "2026-01-15",
    ["AI", "HCL Tech"],
    ["Kush Gangwal Full Stack Developer"],
    [
      {
        heading: "A program, then products",
        paragraphs: [
          "Kush Gangwal completed HCL Tech's 240-hour Full Stack Developer with AI program. The leftover he uses is treating models as dependencies with schemas.",
          "Resumind and the AI APIs at SK Groups are the later expression of that, not the certificate image.",
        ],
      },
    ],
  ),
  post(
    "tailwind-on-a-macos-desktop",
    "Tailwind on a macOS Desktop in the Browser",
    "How Kush Gangwal uses Tailwind CSS for Macfolio without making it look like a default template.",
    "2026-09-02",
    ["Tailwind CSS", "Macfolio"],
    ["Macfolio Portfolio"],
    [
      {
        heading: "Chrome is the design",
        paragraphs: [
          "Macfolio's menu bar, windows, and dock are Tailwind plus custom CSS. Kush Gangwal kept the type on SF Pro and the surfaces dark so it reads as a desktop, not a marketing page.",
          "Article routes use the same tokens with a reading layout. The desktop lock applies only to the home route on phones.",
        ],
      },
    ],
  ),
  post(
    "sqlite-on-vercel-for-nexus",
    "SQLite on Vercel for Nexus",
    "Why Kush Gangwal chose SQLite for the first Nexus deployment.",
    "2026-09-09",
    ["SQLite", "Nexus"],
    ["Nexus Node.js Project"],
    [
      {
        heading: "Small until it is not",
        paragraphs: [
          "Nexus stored offers and ratings in SQLite so Kush Gangwal could deploy on Vercel without running a database server on day one.",
          "A later version can move if writes grow. The product loop did not need that move to be real.",
        ],
      },
    ],
  ),
  post(
    "express-postgres-crud",
    "An Express and PostgreSQL CRUD API",
    "Kush Gangwal's Express and PostgreSQL CRUD API as backend practice beside product APIs.",
    "2026-09-16",
    ["Express.js", "PostgreSQL"],
    ["Node.js Developer"],
    [
      {
        heading: "Practice with a real server",
        paragraphs: [
          "Kush Gangwal published an Express and PostgreSQL CRUD API on GitHub to practice resources, queries, and HTTP errors outside a tutorial repo that hides the database.",
          "Product APIs on Nexus and Potato Bazaar are the same idea with domain rules on top.",
        ],
      },
    ],
  ),
  post(
    "linking-entities-on-purpose",
    "Linking Kush Gangwal to Projects and Companies",
    "How this site repeats one entity graph so search systems connect the name to the work.",
    "2026-09-30",
    ["SEO"],
    ["Kush Gangwal", "Medicaps University", "Potato Bazaar"],
    [
      {
        heading: "Say the names together",
        paragraphs: [
          "Pages on this portfolio repeat a closed set: Kush Gangwal, Medicaps University, SK Groups, SK Agri Exports, Protonshub Technologies, Django Softwares, Potato Bazaar, Nexus, Resumind, CodeMace, Findanio, and Tybee Go.",
          "The technologies stay inside that set: React Native, Next.js, and Node.js. Unrelated topics are left out so the entity does not get muddy.",
        ],
      },
    ],
  ),
  post(
    "contact-and-same-name",
    "Use the Same Name on Every Profile",
    "Kush Gangwal's contact page and the seven profiles that should match it.",
    "2026-10-02",
    ["Identity"],
    ["Kush Gangwal Contact", "Kush Gangwal LinkedIn"],
    [
      {
        heading: "Seven profiles, one headline",
        paragraphs: [
          "LinkedIn, GitHub, LeetCode, Medium, Dev.to, Hashnode, and X should all say Kush Gangwal, Full Stack Developer & React Native Developer.",
          "Each bio should link to https://kushgangwal.vercel.app/about-kush-gangwal. Email is gangwal.kush.19@gmail.com.",
        ],
      },
    ],
  ),
];
