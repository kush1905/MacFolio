import { readFileSync } from "fs";
import { join } from "path";
import { content } from "@/lib/content";

export type ChatTurn = { role: "user" | "assistant"; text: string };

export type AssistantReply = {
  text: string;
  openApp?: "messages" | "preview" | "vscode" | "projects" | "finder" | "terminal";
  source: "gemini" | "local";
};

function readKushgptFile(name: string): string {
  try {
    return readFileSync(
      join(process.cwd(), "content", "kushgpt", name),
      "utf8",
    ).trim();
  } catch {
    return "";
  }
}

function personalStory(): string {
  return readKushgptFile("personal_story.md");
}

function kushgptSystemRules(): string {
  return (
    readKushgptFile("assistant_system_prompt.txt") ||
    `You are KushGPT, the personal AI assistant of Kush Gangwal.
If information is unavailable, say: "I don't have enough information about that topic in Kush's knowledge base."
Never invent personal details, achievements, or experience.`
  );
}

/** Compact knowledge base injected into Gemini (and used by local fallback). */
export function buildPortfolioContext(): string {
  const {
    about,
    skills,
    projects,
    experience,
    stats,
    kushgpt: kb,
  } = content;

  const journeyPhases = Object.entries(kb.learningJourney)
    .map(([phase, v]) => `- ${phase}: ${v.focus}`)
    .join("\n");

  return `
# KushGPT knowledge base — Kush Gangwal
Answer ONLY using this data. If something is unknown, say: "I don't have enough information about that topic in Kush's knowledge base."
Speak in clear, recruiter-friendly prose (2–5 short paragraphs or bullets). Do not invent employers, dates, projects, or achievements.

## Personal story
${personalStory()}

## Identity
- Name: ${about.name}
- Role: ${about.role}
- Tagline: ${about.tagline}
- Location: ${about.location}
- Email: ${about.email}${about.emailAlt ? `\n- Email (work): ${about.emailAlt}` : ""}
- Phone: ${about.phone}
- Bio: ${about.bio}
- GitHub: ${about.links.github}
- LinkedIn: ${about.links.linkedin}
${about.links.instagram ? `- Instagram: ${about.links.instagram}` : ""}
- Resume: ${about.links.resume}
- Portfolio site: ${about.links.portfolio}

## Education
- ${about.education.degree} @ ${about.education.school}
- CGPA: ${about.education.cgpa}
- ${about.education.duration} · ${about.education.location}
${(about.educationHistory ?? [])
  .map((e) => `- ${e.level}: ${e.school} (${e.duration}) — ${e.score}`)
  .join("\n")}

## Career goals
- Short-term: ${kb.careerGoals.shortTermGoal}
- Mid-term: ${kb.careerGoals.midTermGoal}
- Long-term: ${kb.careerGoals.longTermGoal}
- Currently learning: ${kb.careerGoals.currentlyLearning.join(", ")}

## Work philosophy
- Learning approach: ${kb.workPhilosophy.learningApproach}
- Development style: ${kb.workPhilosophy.developmentStyle}
- Favorite parts: ${kb.workPhilosophy.favoritePartOfDevelopment.join(", ")}
- Values: ${kb.workPhilosophy.values.join(", ")}

## Strengths
- Technical: ${kb.strengths.technicalStrengths.join(", ")}
- Soft skills: ${kb.strengths.softSkills.join(", ")}

## Learning journey
${journeyPhases}

## Skills
- Languages: ${skills.languages.join(", ")}
- Frontend: ${skills.frontend.join(", ")}
- Mobile: ${skills.mobile.join(", ")}
- Backend: ${skills.backend.join(", ")}
- Databases: ${skills.databases.join(", ")}
- Cloud: ${skills.cloud.join(", ")}
- AI: ${skills.ai.join(", ")}
- Concepts: ${(skills.concepts ?? []).join(", ")}
- Tools: ${skills.tools.join(", ")}
- Certifications: ${skills.certifications.map((c) => `${c.name} (${c.issuer}, ${c.year})`).join("; ")}

## Projects
${projects
  .map(
    (p) =>
      `### ${p.name}\n- Tagline: ${p.tagline}\n- Period: ${p.period}\n- Tech: ${p.tech.join(", ")}\n- Description: ${p.description}\n- Links: github=${p.github}${p.demo ? ` demo=${p.demo}` : ""}${p.playStore ? ` play=${p.playStore}` : ""}`,
  )
  .join("\n\n")}

## Experience
${experience.experience
  .map(
    (e) =>
      `### ${e.role} @ ${e.company} (${e.type}, ${e.duration})\n${
        e.skillSet.length > 0 ? `Skills: ${e.skillSet.join(", ")}\n` : ""
      }${e.highlights.map((h) => `- ${h}`).join("\n")}`,
  )
  .join("\n\n")}

## Journey timeline
${experience.journey.map((j) => `- ${j.year}: ${j.title} — ${j.body}`).join("\n")}

## Interview-ready answers (paraphrase naturally, first person as Kush when asked as him)
- Why hire me: ${kb.interviewAnswers.whyHireMe}
- Biggest strength: ${kb.interviewAnswers.biggestStrength}
- Best project: ${kb.interviewAnswers.bestProject}
- Current focus: ${kb.interviewAnswers.currentFocus}
- Why full stack: ${kb.interviewAnswers.whyFullStack}
- About Protonshub: ${kb.interviewAnswers.aboutProtonshub}
- About Django Softwares: ${kb.interviewAnswers.aboutDjangoSoftwares}
- About SK Groups: ${kb.interviewAnswers.aboutSKGroups}
- About Nexus: ${kb.interviewAnswers.aboutNexus}
- About Macfolio: ${kb.interviewAnswers.aboutMacfolio}

## Achievements (KushGPT + portfolio)
- Competitive programming: ${kb.achievements.competitiveProgramming.problemsSolved} problems on ${kb.achievements.competitiveProgramming.platforms.join(", ")}; ${kb.achievements.competitiveProgramming.badges} badges
- Hackathons: ${kb.achievements.hackathons.map((h) => `${h.name} (${h.achievement})`).join("; ")}
- Portfolio list: ${experience.achievements.join("; ")}

## Fun facts / preferences
- Favorite areas: ${kb.funFacts.favoriteAreas.join(", ")}
- Likes building: ${kb.funFacts.likesBuilding.join(", ")}
- Hackathons participated: ${kb.funFacts.hackathonsParticipated}

## Stats
- Projects completed: ${stats.projectsCompleted}
- Hackathons: ${stats.hackathons}
- Internships: ${stats.internships}
- LeetCode badges: ${stats.leetcodeBadges}
- Years coding: ${stats.yearsCoding}
- CGPA: ${stats.cgpa}
- Commits this year: ${stats.commitsThisYear}
`.trim();
}

export function systemPrompt(): string {
  return `${kushgptSystemRules()}

${buildPortfolioContext()}`;
}

type Chunk = {
  keys: string[];
  title: string;
  body: string;
  openApp?: AssistantReply["openApp"];
};

function chunks(): Chunk[] {
  const { about, skills, projects, experience, stats, kushgpt: kb } = content;
  const story = personalStory().replace(/^#+\s*.+\n+/, "");

  return [
    {
      keys: [
        "who",
        "about",
        "bio",
        "introduce",
        "kush",
        "name",
        "tell me",
        "story",
        "background",
      ],
      title: "About",
      body: `**${about.name}** is a **${about.role}** based in ${about.location}.\n\n${story || about.bio}`,
    },
    {
      keys: [
        "skill",
        "stack",
        "tech",
        "language",
        "frontend",
        "backend",
        "react",
        "node",
        "java",
        "strength",
      ],
      title: "Skills & strengths",
      body: `${about.name}'s stack covers ${skills.languages.join(", ")}; frontend with ${skills.frontend.join(", ")}; backend with ${skills.backend.join(", ")}; mobile with ${skills.mobile.join(", ")}; data with ${skills.databases.join(", ")}; concepts (${(skills.concepts ?? []).join(", ")}); plus cloud (${skills.cloud.join(", ")}) and AI (${skills.ai.join(", ")}). Tools: ${skills.tools.join(", ")}.\n\nTechnical strengths: ${kb.strengths.technicalStrengths.join(", ")}. Soft skills: ${kb.strengths.softSkills.join(", ")}.`,
    },
    {
      keys: [
        "project",
        "built",
        "build",
        "app",
        "potato",
        "tybee",
        "findanio",
        "nexus",
        "portfolio",
        "macfolio",
        "mac folio",
        "bazaar",
        "skill swap",
      ],
      title: "Projects",
      body:
        `Featured projects:\n` +
        projects
          .map(
            (p) =>
              `- **${p.name}** — ${p.tagline}. ${p.description.slice(0, 220)}${p.description.length > 220 ? "…" : ""} Tech: ${p.tech.join(", ")}.`,
          )
          .join("\n") +
        `\n\nOn “best project”: ${kb.interviewAnswers.bestProject}`,
    },
    {
      keys: [
        "experience",
        "job",
        "intern",
        "work",
        "proton",
        "protonshub",
        "django",
        "scalelr",
        "sk group",
        "company",
        "role",
      ],
      title: "Experience",
      body:
        kb.interviewAnswers.aboutSKGroups +
        "\n\n" +
        kb.interviewAnswers.aboutDjangoSoftwares +
        "\n\n" +
        kb.interviewAnswers.aboutProtonshub +
        "\n\n" +
        experience.experience
          .map(
            (e) =>
              `- **${e.role}** at **${e.company}** (${e.duration}, ${e.type}): ${e.highlights.slice(0, 3).join(" ")}`,
          )
          .join("\n\n"),
    },
    {
      keys: ["nexus", "skill swap", "why is nexus"],
      title: "Nexus",
      body: kb.interviewAnswers.aboutNexus,
    },
    {
      keys: ["macfolio", "mac folio", "portfolioos", "portfolio os", "this site", "this portfolio"],
      title: "Macfolio",
      body: kb.interviewAnswers.aboutMacfolio,
    },
    {
      keys: ["learn", "learning", "studying", "currently", "spring", "goal", "career"],
      title: "Learning & goals",
      body: `Currently learning: ${kb.careerGoals.currentlyLearning.join(", ")}.\n\nCurrent focus: ${kb.interviewAnswers.currentFocus}\n\nShort-term: ${kb.careerGoals.shortTermGoal}\nMid-term: ${kb.careerGoals.midTermGoal}\nLong-term: ${kb.careerGoals.longTermGoal}\n\nLearning journey: ${Object.values(kb.learningJourney)
        .map((p) => p.focus)
        .join(" → ")}.`,
    },
    {
      keys: ["philosoph", "value", "approach", "style", "favorite"],
      title: "Work philosophy",
      body: `${kb.workPhilosophy.learningApproach} Style: ${kb.workPhilosophy.developmentStyle}. Favorite parts: ${kb.workPhilosophy.favoritePartOfDevelopment.join(", ")}. Values: ${kb.workPhilosophy.values.join(", ")}.`,
    },
    {
      keys: [
        "hire",
        "why hire",
        "recruiter",
        "interview",
        "strength",
        "strongest",
      ],
      title: "Interview",
      body: `**${about.name}** is a strong hire because he already ships production work, not just coursework.\n\n${kb.interviewAnswers.whyHireMe}\n\nBiggest strength: ${kb.interviewAnswers.biggestStrength}\n\nHe is strongest at end-to-end product work — **React Native** mobile apps, **React.js / Next.js** web, and **Node.js** APIs — shown in **Potato Bazaar**, **Tybee Go**, **Macfolio**, and internships at **Protonshub** and **Django Softwares**. Right now he is a **Junior Software Developer at SK Groups**.\n\nReach him at ${about.email}${about.emailAlt ? ` or ${about.emailAlt}` : ""}, or open **Messages** in PortfolioOS.`,
    },
    {
      keys: ["education", "college", "university", "degree", "cgpa", "medicaps", "school", "12th", "10th"],
      title: "Education",
      body:
        `**${about.name}** is pursuing **${about.education.degree}** at **${about.education.school}** (${about.education.duration}) with CGPA ${about.education.cgpa}.\n` +
        (about.educationHistory ?? [])
          .map((e) => `• ${e.level} — ${e.school} (${e.duration}): ${e.score}`)
          .join("\n"),
    },
    {
      keys: ["contact", "email", "phone", "reach", "linkedin", "message"],
      title: "Contact",
      body: `You can reach **${about.name}** at ${about.email}${about.emailAlt ? ` or ${about.emailAlt}` : ""} or ${about.phone}.\n\n- LinkedIn: ${about.links.linkedin}\n- GitHub: ${about.links.github}${about.links.instagram ? `\n- Instagram: ${about.links.instagram}` : ""}\n\nOpen **Messages** for every contact channel.`,
    },
    {
      keys: ["resume", "cv"],
      title: "Resume",
      body: `${about.name}'s resume is available as Resume.pdf in PortfolioOS Preview (path ${about.links.resume}).`,
    },
    {
      keys: ["github", "git", "repo"],
      title: "GitHub",
      body: `GitHub profile: ${about.links.github} (~${stats.commitsThisYear} commits this year in portfolio stats).`,
    },
    {
      keys: [
        "achievement",
        "hackathon",
        "award",
        "leetcode",
        "badge",
        "moonhack",
        "hackmivo",
        "dsa",
      ],
      title: "Achievements",
      body: `${kb.achievements.competitiveProgramming.problemsSolved} DSA problems on ${kb.achievements.competitiveProgramming.platforms.join(" & ")} · ${kb.achievements.competitiveProgramming.badges} badges · Hackathons: ${kb.achievements.hackathons
        .map((h) => `${h.name} (${h.achievement})`)
        .join("; ")} · Also: ${experience.achievements.join(" · ")}`,
    },
    {
      keys: ["stat", "years", "internship"],
      title: "Stats",
      body: `${stats.yearsCoding} years coding · ${stats.projectsCompleted} projects · ${stats.hackathons} hackathons · ${stats.internships} internship(s) · ${stats.leetcodeBadges} LeetCode badges.`,
    },
  ];
}

/** Offline framed answers when Gemini is unavailable. */
export function localAssistantReply(question: string): AssistantReply {
  const q = question.toLowerCase().trim();
  if (!q) {
    return {
      text: `Ask me anything about ${content.about.name} — background, projects, Protonshub, what he's learning, or how to get in touch.`,
      source: "local",
    };
  }

  // Explicit unknown handled by scoring — Nexus is in the knowledge base.

  const scored = chunks()
    .map((c) => {
      let score = 0;
      for (const k of c.keys) {
        if (q.includes(k)) score += k.length > 4 ? 3 : 2;
      }
      for (const t of q.split(/[^a-z0-9]+/).filter((w) => w.length > 3)) {
        if (c.body.toLowerCase().includes(t) || c.title.toLowerCase().includes(t))
          score += 1;
      }
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      text: `I don't have enough information about that topic in Kush's knowledge base.\n\nTry asking about his story, projects (Macfolio, Potato Bazaar, Tybee Go, Findanio, Nexus, Scalelr), Protonshub, Django Softwares, SK Groups, what he's learning, skills, or contact.`,
      source: "local",
    };
  }

  const top = scored.slice(0, 2);
  const parts = top.map(({ c }) => c.body);

  const intro =
    scored[0].score >= 3
      ? ``
      : `Here's what I know that's closest to your question:\n\n`;

  return {
    text: intro + parts.join("\n\n"),
    // Only open apps on explicit user intent (see detectOpenApp)
    openApp: detectOpenApp(question),
    source: "local",
  };
}

/** Open another OS app only when the user clearly asks to open / show something. */
export function detectOpenApp(text: string): AssistantReply["openApp"] {
  const s = text.toLowerCase().trim();

  // Casual Q&A like "tell me about Kush" must NOT open apps even if the
  // answer mentions projects, contact, or resume.
  const wantsOpen =
    /\b(open|show|launch|take me to|go to|pull up)\b/.test(s) ||
    /\b(how (do|can) i (contact|reach|hire|email))\b/.test(s) ||
    /\b(send (him |kush )?(a )?message|message him|contact him|hire him)\b/.test(
      s,
    );

  if (!wantsOpen) return undefined;

  if (/\b(message|messages|contact|email|hire|reach)\b/.test(s)) {
    return "messages";
  }
  if (/\b(resume|cv|cv\.pdf|resume\.pdf)\b/.test(s)) return "preview";
  if (
    /\b(project|projects|potato|tybee|findanio|nexus|macfolio)\b/.test(s)
  ) {
    return "projects";
  }
  if (/\b(vscode|code|editor)\b/.test(s)) return "vscode";
  if (/\b(finder|files)\b/.test(s)) return "finder";
  if (/\b(terminal)\b/.test(s)) return "terminal";
  return undefined;
}
