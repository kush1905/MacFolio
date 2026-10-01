import type { AppId } from "@/types";

export type HelpTopic = {
  id: AppId | "spotlight" | "mission" | "dock" | "desktop";
  name: string;
  usedFor: string;
  shows: string[];
  tip?: string;
};

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "finder",
    name: "Finder",
    usedFor:
      "Browse Kush’s portfolio like a Mac file system — folders for About, Projects, Skills, and Resume.",
    shows: [
      "About Me bio, location, education",
      "Projects as folders",
      "Skills tags (React, Node, Java, MongoDB…)",
      "Resume.pdf (opens in Preview)",
    ],
    tip: "Double-click Resume.pdf on the Desktop or in Finder.",
  },
  {
    id: "launchpad",
    name: "Launchpad",
    usedFor: "See every PortfolioOS app in a full-screen launcher grid.",
    shows: ["All dock apps as large icons you can click to open"],
  },
  {
    id: "safari",
    name: "Safari",
    usedFor: "Open portfolio links and external sites in a browser window.",
    shows: ["GitHub / LinkedIn / resume URLs", "Web pages you navigate to"],
  },
  {
    id: "messages",
    name: "Messages",
    usedFor: "Contact Kush — the hiring / contact form styled like iMessage.",
    shows: ["Name, email, and message fields", "Sent messages in this session"],
    tip: "Also opens from Terminal: sudo hire kush",
  },
  {
    id: "photos",
    name: "Photos",
    usedFor: "View project screenshots and photo gallery content.",
    shows: ["Album-style grids", "Screenshots captured in PortfolioOS"],
  },
  {
    id: "notes",
    name: "Notes",
    usedFor: "Read journey, experience, education, and achievements as notes.",
    shows: ["Career journey", "Work experience bullets", "Education & awards"],
  },
  {
    id: "terminal",
    name: "Terminal",
    usedFor:
      "Explore the portfolio with CLI commands — great for recruiters who like demos.",
    shows: [
      "zsh-style shell with ls, cd, cat, tree, find, grep",
      "Portfolio commands: about, projects, experience, neofetch",
      "Tab completion, history, Ctrl+L / Ctrl+C",
      "Easter egg: sudo hire kush",
    ],
      tip: "Try: ls → cd Projects → cat Macfolio.md",
  },
  {
    id: "projects",
    name: "Projects",
    usedFor:
      "Watch cinematic trailers and posters for Kush's shipped work — Macfolio, Potato Bazaar, Tybee Go, Findanio, and Nexus.",
    shows: [
      "Autoplaying trailer stage",
      "Hover cards with preview motion",
      "Tech stack, GitHub, and live demos",
    ],
    tip: "Hover a card to play its trailer. Click for the full story.",
  },
  {
    id: "vscode",
    name: "VS Code",
    usedFor: "Browse portfolio data in a VS Code–style workspace.",
    shows: [
      "README.md — bio & links",
      "skills.ts — tech stack as code",
      "projects.ts — project list",
      "experience.ts — work history",
    ],
  },
  {
    id: "assistant",
    name: "KushGPT",
    usedFor: "Chat with Kush's personal AI — knowledge base on story, work, and goals.",
    shows: [
      "Answers about education, projects, Protonshub, learning focus",
      "Grounded answers from Kush's knowledge base — story, work, and goals",
    ],
  },
  {
    id: "activity",
    name: "Activity Monitor",
    usedFor: "Browse real portfolio stats and live GitHub data (kush1905 + Kush-PB).",
    shows: [
      "Overview: projects, DSA, CGPA, skills, GitHub snapshot",
      "Portfolio: projects, experience, achievements, learning",
      "GitHub: both accounts’ public repos and language mix",
    ],
  },
  {
    id: "settings",
    name: "System Settings",
    usedFor: "Change wallpaper, appearance, dock/desktop preferences.",
    shows: [
      "Wallpaper gallery + Dynamic by time of day",
      "Appearance: Liquid Glass, accent, folder color, sidebar icons",
      "Displays: text size, brightness, Night Shift",
      "About / account info",
    ],
  },
  {
    id: "preview",
    name: "Preview",
    usedFor: "Read Resume.pdf inside PortfolioOS (like macOS Preview).",
    shows: ["Resume.pdf iframe", "Download / open-in-browser actions"],
  },
  {
    id: "trash",
    name: "Trash",
    usedFor: "Empty “trash” window — playful OS detail.",
    shows: ["Empty state / discarded items UI"],
  },
  {
    id: "spotlight",
    name: "Spotlight",
    usedFor: "⌘Space search across apps, resume, projects, and skills.",
    shows: [
      "Top Hit, Applications, Documents, Folders, Projects, Definitions",
      "Skill matches like “Spring Boot” → Skills › Backend",
    ],
    tip: "Press ⌘Space or click the magnifying glass in the menu bar.",
  },
  {
    id: "mission",
    name: "Mission Control",
    usedFor: "See all open windows at once and jump to any of them.",
    shows: ["Thumbnails of every open / minimized window"],
    tip: "Press F3 or ⌘↑",
  },
  {
    id: "dock",
    name: "Dock",
    usedFor: "Launch and switch apps. Right-click for Keep in Dock / Quit.",
    shows: ["Pinned apps", "Running-app indicator dots", "Trash"],
  },
  {
    id: "desktop",
    name: "Desktop",
    usedFor: "Icons for Macintosh HD, Projects, and Resume.pdf over the wallpaper.",
    shows: ["Wallpaper engine", "Desktop icons", "Context menu: wallpaper, Spotlight…"],
  },
];

export function helpTopicFor(id: HelpTopic["id"]) {
  return HELP_TOPICS.find((t) => t.id === id) ?? HELP_TOPICS[0];
}
