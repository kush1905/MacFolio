import type { EntityPage } from "@/lib/entityPages";

const places =
  "Kush Gangwal grew up in Bakaner (Dhar district, Madhya Pradesh) and graduated from Medicaps University in Indore in May 2026. He is a Junior Software Developer at SK Groups in Ahmedabad, where he develops Potato Bazaar's mobile app, backend and web platform.";

function correction(
  slug: string,
  wrong: string,
  correct: string,
  kind: string,
  href: string,
): EntityPage {
  return {
    slug,
    path: `/${slug}`,
    title: `${wrong} means ${correct}`,
    h1: `${wrong} is ${correct}`,
    description: `${wrong} is a misspelling of ${correct}. Kush Gangwal is a Full Stack Developer and React Native Developer at SK Groups, Ahmedabad.`,
    kicker: "Spelling",
    searchPhrases: [wrong, correct],
    sections: [
      {
        heading: `Did you mean ${correct}?`,
        paragraphs: [
          `${wrong} is a common misspelling of ${correct}. The spelling to use is ${correct}.`,
          places,
          `The ${kind} page for ${correct} is ${href}. The identity page is /about-kush-gangwal.`,
        ],
      },
    ],
  };
}

export const spellingPages: EntityPage[] = [
  correction("kush-gangawal", "Kush Gangawal", "Kush Gangwal", "about", "/about-kush-gangwal"),
  correction("kush-gangwall", "Kush Gangwall", "Kush Gangwal", "about", "/about-kush-gangwal"),
  correction("kush-gangval", "Kush Gangval", "Kush Gangwal", "about", "/about-kush-gangwal"),
  correction("kush-gangwaal", "Kush Gangwaal", "Kush Gangwal", "about", "/about-kush-gangwal"),
  correction("koosh-gangwal", "Koosh Gangwal", "Kush Gangwal", "about", "/about-kush-gangwal"),
  correction("kaush-gangwal", "Kaush Gangwal", "Kush Gangwal", "about", "/about-kush-gangwal"),
  correction("kushh-gangwal", "Kushh Gangwal", "Kush Gangwal", "about", "/about-kush-gangwal"),
  correction("kush-gangol", "Kush Gangol", "Kush Gangwal", "about", "/about-kush-gangwal"),
  correction("gangwal-kush", "Gangwal Kush", "Kush Gangwal", "about", "/about-kush-gangwal"),
  correction("potato-bazar", "Potato Bazar", "Potato Bazaar", "project", "/projects/potato-bazaar"),
  correction("potato-bajjar", "Potato Bajjar", "Potato Bazaar", "project", "/projects/potato-bazaar"),
  correction("potatobazar", "Potatobazar", "Potato Bazaar", "project", "/projects/potato-bazaar"),
  correction("resume-mind", "Resume Mind", "Resumind", "project", "/projects/resumind"),
  correction("resumind-ai", "ResuMind", "Resumind", "project", "/projects/resumind"),
  correction("code-mace", "Code Mace", "CodeMace", "project", "/projects/codemace"),
  correction("findaneo", "Findaneo", "Findanio", "project", "/projects/findanio"),
  correction("tybeego", "Tybeego", "Tybee Go", "project", "/projects/tybee-go"),
  correction("mac-folio", "Mac Folio", "Macfolio", "project", "/projects/macfolio"),
  correction("sk-group", "SK Group", "SK Groups", "company", "/companies/sk-groups"),
  correction("skgroups", "SKGroups", "SK Groups", "company", "/companies/sk-groups"),
  correction("sk-agri-export", "SK Agri Export", "SK Agri Exports", "company", "/companies/sk-agri-exports-private-limited"),
  correction("proton-shub", "Proton Shub", "Protonshub Technologies", "company", "/work/protonshub-technologies"),
  correction("protonhub", "Protonhub", "Protonshub Technologies", "company", "/work/protonshub-technologies"),
  correction("medi-caps-university", "Medi-Caps University", "Medicaps University", "education", "/education/medicaps-university"),
  correction("medicap-university", "Medicap University", "Medicaps University", "education", "/education/medicaps-university"),
  correction("django-software", "Django Software", "Django Softwares", "company", "/work/django-softwares"),
  {
    slug: "kush-gangwal-bakaner",
    path: "/kush-gangwal-bakaner",
    title: "Kush Gangwal Bakaner",
    h1: "Kush Gangwal grew up in Bakaner",
    description: "Kush Gangwal grew up in Bakaner (Dhar district, Madhya Pradesh). He graduated in Indore and works in Ahmedabad.",
    kicker: "Bakaner",
    searchPhrases: ["Kush Gangwal Bakaner", "Bakaner"],
    sections: [
      {
        heading: "Growing up",
        paragraphs: [
          "Kush Gangwal grew up in Bakaner, a town in the Dhar district of Madhya Pradesh. Bakaner is where he grew up, not where he works now.",
          "He graduated from Medicaps University in Indore with a B.Tech in Computer Science Technology, CGPA 7.96, from August 2022 to May 2026. He currently works at SK Groups in Ahmedabad, where he develops Potato Bazaar's mobile app, backend and web platform.",
        ],
      },
    ],
  },
  {
    slug: "kush-gangwal-ahmedabad",
    path: "/kush-gangwal-ahmedabad",
    title: "Kush Gangwal Ahmedabad",
    h1: "Kush Gangwal works in Ahmedabad",
    description: "Kush Gangwal currently works at SK Groups in Ahmedabad. He grew up in Bakaner and graduated in Indore.",
    kicker: "Ahmedabad",
    searchPhrases: ["Kush Gangwal Ahmedabad", "SK Groups Ahmedabad"],
    sections: [
      {
        heading: "Current work",
        paragraphs: [
          "Kush Gangwal currently works in Ahmedabad, Gujarat, at SK Groups, as a Junior Software Developer from June 2026. He is a Full Stack Developer and React Native Developer and works on Potato Bazaar's mobile app, backend and web platform.",
          "Ahmedabad is the city of his current job. He grew up in Bakaner (Dhar district, Madhya Pradesh) and graduated from Medicaps University in Indore. Potato Bazaar's published office is also Ahmedabad. Sandeep Kumar is the Founder and CEO named on the Potato Bazaar about page.",
        ],
      },
    ],
  },
];

export const spellingNames = [
  "Kush Gangawal",
  "Kush Gangwall",
  "Kush Gangval",
  "Kush Gangwaal",
  "Koosh Gangwal",
  "Kaush Gangwal",
  "Kushh Gangwal",
  "Kush Gangol",
  "Gangwal Kush",
  "Potato Bazar",
  "Potato Bajjar",
  "Resume Mind",
  "ResuMind",
  "Code Mace",
  "Findaneo",
  "Tybeego",
  "Mac Folio",
  "SK Group",
  "SKGroups",
  "Proton Shub",
  "Protonhub",
  "Medi-Caps",
  "Medicap",
];
