import { APPS } from "@/lib/apps";
import { content } from "@/lib/content";
import type { AppId } from "@/types";

export type Tone = "dim" | "green" | "cyan" | "yellow" | "red" | "magenta" | "white";
export type Span = { text: string; tone?: Tone };
export type DuRow = { size: string; path: string };
export type OutLine =
  | { type: "in"; cwd: string; cmd: string }
  | { type: "out"; spans: Span[] }
  | { type: "du"; rows: DuRow[] };

export type Session = { cwd: string };

export type RunResult = {
  lines: OutLine[];
  session: Session;
  openApp?: AppId;
  openUrl?: string;
  clear?: boolean;
  exit?: boolean;
};

type DirNode = { kind: "dir"; name: string; children: FsNode[] };
type FileNode = {
  kind: "file";
  name: string;
  body: string;
  openApp?: AppId;
  openUrl?: string;
};
type FsNode = DirNode | FileNode;

export const HOME = "/Users/kushgangwal";
const USER = "kushgangwal";
const HOST = "MacBook-Pro";

export const DU_ROWS: DuRow[] = [
  { size: "1.5G", path: `${HOME}/.antigravity-ide` },
  { size: "1.4G", path: `${HOME}/.vscode` },
  { size: "964M", path: `${HOME}/.windsurf` },
  { size: "512M", path: `${HOME}/.gradle` },
  { size: "312M", path: `${HOME}/Library` },
  { size: "212M", path: `${HOME}/Documents` },
  { size: "128M", path: `${HOME}/.npm` },
  { size: "96M", path: `${HOME}/.docker` },
  { size: "64M", path: `${HOME}/Developer` },
  { size: "42M", path: `${HOME}/Downloads` },
  { size: "23M", path: `${HOME}/.nvm` },
  { size: "12M", path: `${HOME}/.local` },
  { size: "9.9M", path: `${HOME}/.cursor` },
  { size: "4.2M", path: `${HOME}/.config` },
  { size: "2.1M", path: `${HOME}/.codeium` },
];

export const COMMANDS = [
  "help",
  "man",
  "ls",
  "ll",
  "cd",
  "pwd",
  "cat",
  "tree",
  "find",
  "grep",
  "head",
  "file",
  "open",
  "code",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "stats",
  "achievements",
  "contact",
  "resume",
  "github",
  "linkedin",
  "whoami",
  "hostname",
  "id",
  "date",
  "uname",
  "echo",
  "env",
  "which",
  "history",
  "clear",
  "exit",
  "neofetch",
  "ps",
  "top",
  "du",
  "git",
  "npm",
  "ping",
  "curl",
  "fortune",
  "cowsay",
  "sudo",
  "ssh",
] as const;

const MAN: Record<string, string> = {
  help: "help — list PortfolioOS shell commands",
  ls: "ls [-la] [path] — list directory contents",
  cd: "cd [dir] — change directory",
  pwd: "pwd — print working directory",
  cat: "cat <file> — print file contents",
  tree: "tree [path] — list folders as a tree",
  find: "find <name> — search files by name",
  grep: "grep <query> — search file contents",
  open: "open <app|file|project> — open in PortfolioOS",
  neofetch: "neofetch — system / portfolio snapshot",
  git: "git status | log | remote — fake repo for this portfolio",
  sudo: "sudo hire kush — request an intro",
  fortune: "fortune — a short note about Kush",
  ps: "ps — list open PortfolioOS apps",
};

const APP_ALIASES: Record<string, AppId> = {
  finder: "finder",
  safari: "safari",
  messages: "messages",
  mail: "messages",
  photos: "photos",
  notes: "notes",
  terminal: "terminal",
  settings: "settings",
  preview: "preview",
  resume: "preview",
  projects: "projects",
  showcase: "projects",
  vscode: "vscode",
  code: "vscode",
  activity: "activity",
  monitor: "activity",
  assistant: "assistant",
  ai: "assistant",
  kushgpt: "assistant",
  gpt: "assistant",
  launchpad: "launchpad",
  trash: "trash",
};

function file(name: string, body: string, extra?: Partial<FileNode>): FileNode {
  return { kind: "file", name, body, ...extra };
}

function dir(name: string, children: FsNode[]): DirNode {
  return { kind: "dir", name, children };
}

function buildFs(): DirNode {
  const { about, projects, skills, experience, stats, kushgpt } = content;
  const projectFiles = projects.map((p) =>
    file(
      `${p.name.replace(/\s+/g, "-")}.md`,
      [
        `# ${p.name}`,
        p.tagline,
        "",
        p.description,
        "",
        `Period: ${p.period}`,
        `Tech: ${p.tech.join(", ")}`,
        p.github ? `GitHub: ${p.github}` : "",
        "demo" in p && p.demo ? `Demo: ${p.demo}` : "",
        "playStore" in p && p.playStore ? `Play Store: ${p.playStore}` : "",
        "",
        "Tip: open " + slug(p.name),
      ]
        .filter(Boolean)
        .join("\n"),
      { openApp: "projects" },
    ),
  );

  const expFiles = experience.experience.map((e) =>
    file(
      `${e.company.replace(/\s+/g, "-")}.md`,
      [
        `# ${e.role} @ ${e.company}`,
        `${e.duration} · ${e.type}`,
        e.skillSet.length ? `Skills: ${e.skillSet.join(", ")}` : "",
        "",
        ...e.highlights.map((h) => `- ${h}`),
      ]
        .filter(Boolean)
        .join("\n"),
    ),
  );

  return dir("kushgangwal", [
    file(
      "README.md",
      [
        `# ${about.name}`,
        `> ${about.tagline}`,
        "",
        about.bio,
        "",
        `Location: ${about.location}`,
        `Role: ${about.role}`,
        "",
        "Try: ls, cat Projects/Macfolio.md, neofetch, sudo hire kush",
      ].join("\n"),
    ),
    file("Resume.pdf", "PDF document — opening in Preview…", { openApp: "preview" }),
    file(
      "about.md",
      [about.name, about.role, "", about.bio, "", `${about.education.degree} @ ${about.education.school}`].join("\n"),
    ),
    file(
      "contact.md",
      [
        `Email: ${about.email}`,
        about.emailAlt ? `Email (work): ${about.emailAlt}` : "",
        `Phone: ${about.phone}`,
        `GitHub: ${about.links.github}`,
        `LinkedIn: ${about.links.linkedin}`,
        about.links.instagram ? `Instagram: ${about.links.instagram}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      { openApp: "messages" },
    ),
    file(
      "Education.md",
      [
        `${about.education.degree}`,
        about.education.school,
        `CGPA ${about.education.cgpa} · ${about.education.duration}`,
        "",
        ...(about.educationHistory ?? []).map(
          (e) => `${e.level} — ${e.school} (${e.duration}) · ${e.score}`,
        ),
      ].join("\n"),
    ),
    file(
      "Achievements.md",
      experience.achievements.map((a) => `- ${a}`).join("\n"),
    ),
    dir("Projects", projectFiles),
    dir("Experience", expFiles),
    dir("Skills", [
      file(
        "stack.txt",
        [
          `Languages: ${skills.languages.join(", ")}`,
          `Frontend: ${skills.frontend.join(", ")}`,
          `Mobile: ${skills.mobile.join(", ")}`,
          `Backend: ${skills.backend.join(", ")}`,
          `Databases: ${skills.databases.join(", ")}`,
          `Cloud: ${skills.cloud.join(", ")}`,
          `AI: ${skills.ai.join(", ")}`,
          `Tools: ${skills.tools.join(", ")}`,
        ].join("\n"),
      ),
    ]),
    file(
      ".zshrc",
      [
        `export USER=${USER}`,
        `export HOME=${HOME}`,
        "alias ll='ls -la'",
        "alias gs='git status'",
        "alias projects='ls Projects'",
      ].join("\n"),
    ),
    file(
      "stats.txt",
      `${stats.yearsCoding} years coding · ${stats.projectsCompleted} projects · ${stats.hackathons} hackathons · ${stats.internships} internships · ~${stats.commitsThisYear}/yr commits`,
    ),
    file(
      "goals.txt",
      [
        `Now: ${kushgpt.careerGoals.currentlyLearning.join(", ")}`,
        `Short: ${kushgpt.careerGoals.shortTermGoal}`,
        `Mid: ${kushgpt.careerGoals.midTermGoal}`,
        `Long: ${kushgpt.careerGoals.longTermGoal}`,
      ].join("\n"),
    ),
  ]);
}

const ROOT: DirNode = dir("Users", [buildFs()]);

export function promptPath(cwd: string) {
  if (cwd === HOME) return "~";
  if (cwd.startsWith(`${HOME}/`)) return `~${cwd.slice(HOME.length)}`;
  return cwd;
}

export function promptText(cwd: string) {
  return `${USER}@${HOST} ${promptPath(cwd)} % `;
}

export function lastLoginLine() {
  const d = new Date();
  const stamp = d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return `Last login: ${stamp} on console`;
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function tokenize(raw: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q: string | null = null;
  for (const ch of raw) {
    if (q) {
      if (ch === q) q = null;
      else cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      q = ch;
      continue;
    }
    if (/\s/.test(ch)) {
      if (cur) {
        out.push(cur);
        cur = "";
      }
      continue;
    }
    cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

function splitCommands(raw: string): string[] {
  const parts: string[] = [];
  let cur = "";
  let q: string | null = null;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (q) {
      if (ch === q) q = null;
      cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      q = ch;
      cur += ch;
      continue;
    }
    if (ch === ";") {
      if (cur.trim()) parts.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function normalize(path: string) {
  const parts = path.split("/").filter((p) => p && p !== ".");
  const out: string[] = [];
  for (const p of parts) {
    if (p === "..") out.pop();
    else out.push(p);
  }
  return "/" + out.join("/");
}

function resolvePath(cwd: string, input?: string) {
  if (!input || input === "~") return HOME;
  if (input.startsWith("~/")) return normalize(`${HOME}/${input.slice(2)}`);
  if (input.startsWith("/")) return normalize(input);
  return normalize(`${cwd}/${input}`);
}

function lookup(abs: string): FsNode | null {
  const parts = abs.split("/").filter(Boolean);
  if (parts[0] !== "Users") return null;
  let node: FsNode = ROOT;
  for (let i = 1; i < parts.length; i++) {
    if (node.kind !== "dir") return null;
    const next: FsNode | undefined = node.children.find(
      (c) => c.name.toLowerCase() === parts[i].toLowerCase(),
    );
    if (!next) return null;
    node = next;
  }
  return node;
}

function parentPath(abs: string) {
  const i = abs.lastIndexOf("/");
  return i <= 0 ? "/" : abs.slice(0, i);
}

function listDir(node: DirNode, all: boolean) {
  return node.children.filter((c) => all || !c.name.startsWith("."));
}

function text(s: string, tone?: Tone): OutLine[] {
  if (!s) return [];
  return s.split("\n").map((line) => ({
    type: "out" as const,
    spans: [{ text: line.length ? line : " ", tone }],
  }));
}

function spansLine(spans: Span[]): OutLine {
  return { type: "out", spans };
}

function err(msg: string): OutLine[] {
  return text(msg, "red");
}

function expandVars(s: string) {
  return s
    .replaceAll("$HOME", HOME)
    .replaceAll("$USER", USER)
    .replaceAll("$HOST", HOST)
    .replaceAll("~", HOME);
}

function helpText() {
  return [
    "PortfolioOS zsh — recruiter shell for Kush Gangwal",
    "",
    "Filesystem",
    "  ls [-la] [path]     list files          cd [dir]     change directory",
    "  pwd                 working directory   cat <file>   read a file",
    "  tree [path]         folder tree         find <name>  search by name",
    "  grep <query>        search contents     open <name>  open app / file / project",
    "",
    "Portfolio",
    "  about  skills  projects  experience  education  stats  achievements",
    "  contact  resume  github  linkedin",
    "",
    "System",
    "  whoami  date  uname  neofetch  ps  top  du  env  history  clear  exit",
    "  git status | log | remote     fortune     cowsay <text>",
    "",
    "Tips: Tab completes · ↑ history · Ctrl+L clears · try `ls Projects` or `sudo hire kush`",
  ].join("\n");
}

function neofetch() {
  const mac = content.about.aboutThisMac;
  const art = [
    "                    'c.",
    "                 ,xNMM.",
    "               .OMMMMo",
    "               OMMM0,",
    "     .;loddo:' loolloddol;.",
    "   cKMMMMMMMMMMNWMMMMMMMMMM0:",
    " .KMMMMMMMMMMMMMMMMMMMMMMMWd.",
    " XMMMMMMMMMMMMMMMMMMMMMMMX.",
    ";MMMMMMMMMMMMMMMMMMMMMMMM:",
    ":MMMMMMMMMMMMMMMMMMMMMMMM:",
    ".MMMMMMMMMMMMMMMMMMMMMMMMX.",
    " kMMMMMMMMMMMMMMMMMMMMMMMMWd.",
    "  .XMMMMMMMMMMMMMMMMMMMMMMMMK.",
    "    kMMMMMMMMMMMMMMMMMMMMMNd",
    "     ;KMMMMMMMWXXWMMMMMMMk.",
    "       .cooc,.    .,coo:.",
  ];
  const info = [
    `${content.about.name}@${HOST}`,
    "--------------------------",
    `OS: ${mac.displayVersion}`,
    `Host: ${mac.model}`,
    `Kernel: Next.js + React 19`,
    `Shell: zsh`,
    `Chip: ${mac.chip}`,
    `Memory: ${mac.memory}`,
    `Role: ${content.about.role}`,
    `Projects: ${content.stats.projectsCompleted}`,
    `GitHub: kush1905`,
    `Uptime: since you unlocked`,
  ];
  const rows = Math.max(art.length, info.length);
  return Array.from({ length: rows }, (_, i) => {
    const left = (art[i] ?? "").padEnd(42, " ");
    const right = info[i] ?? "";
    return spansLine([
      { text: left, tone: "green" },
      { text: right, tone: i === 0 ? "cyan" : "white" },
    ]);
  });
}

function cowsay(msg: string) {
  const m = msg || "hire Kush";
  const bar = "-".repeat(m.length + 2);
  return [
    ` ${bar}`,
    `< ${m} >`,
    ` ${bar}`,
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
  ].join("\n");
}

function gitLog() {
  const lines = ["On branch main", ""];
  content.projects.forEach((p, i) => {
    const hash = slug(p.id).slice(0, 7).padEnd(7, "0");
    lines.push(`commit ${hash}${i === 0 ? " (HEAD -> main)" : ""}`);
    lines.push(`Author: ${content.about.name} <${content.about.email}>`);
    lines.push(`Date:   ${p.period}`);
    lines.push("");
    lines.push(`    ${p.name} — ${p.tagline}`);
    lines.push("");
  });
  return lines.join("\n");
}

function collectFiles(node: DirNode, prefix: string): { path: string; file: FileNode }[] {
  const out: { path: string; file: FileNode }[] = [];
  for (const c of node.children) {
    const p = `${prefix}/${c.name}`;
    if (c.kind === "file") out.push({ path: p, file: c });
    else out.push(...collectFiles(c, p));
  }
  return out;
}

function treeLines(node: DirNode, prefix = "", depth = 0): Span[][] {
  const kids = listDir(node, false);
  return kids.flatMap((c, i) => {
    const last = i === kids.length - 1;
    const branch = last ? "└── " : "├── ";
    const row: Span[][] = [
      [
        { text: prefix + branch, tone: "dim" },
        { text: c.name, tone: c.kind === "dir" ? "cyan" : "white" },
      ],
    ];
    if (c.kind === "dir" && depth < 3) {
      row.push(...treeLines(c, prefix + (last ? "    " : "│   "), depth + 1));
    }
    return row;
  });
}

function runOne(
  raw: string,
  session: Session,
  ctx: { windows: { appId: AppId; title: string; minimized: boolean }[]; history: string[] },
): RunResult {
  const sessionNext = { ...session };
  const empty: RunResult = { lines: [], session: sessionNext };
  const trimmed = raw.trim();
  if (!trimmed) return empty;
  if (trimmed.startsWith("#")) return empty;

  const tokens = tokenize(trimmed).map((t, i) => (i === 0 ? t : expandVars(t)));
  let cmd = tokens[0]?.toLowerCase() ?? "";
  let args = tokens.slice(1);

  if (cmd === "ll") {
    cmd = "ls";
    args = ["-la", ...args];
  }

  const asText = (s: string, tone?: Tone): RunResult => ({
    lines: text(s, tone),
    session: sessionNext,
  });

  switch (cmd) {
    case "help":
    case "?":
      return asText(helpText(), "dim");
    case "man":
      return asText(MAN[args[0]?.toLowerCase() ?? "help"] ?? `No manual entry for ${args[0] ?? "man"}`, "dim");
    case "pwd":
      return asText(session.cwd);
    case "whoami":
      return asText(USER);
    case "hostname":
      return asText(HOST);
    case "id":
      return asText(`uid=501(${USER}) gid=20(staff) groups=20(staff)`);
    case "date":
      return asText(new Date().toString());
    case "uname":
      return asText(
        args[0] === "-a"
          ? `Darwin ${HOST} ${content.about.aboutThisMac.version} Darwin Kernel Version ${content.about.aboutThisMac.version}: arm64`
          : "Darwin",
      );
    case "echo":
      return asText(args.map(expandVars).join(" ") || "");
    case "env":
      return asText(
        [`USER=${USER}`, `HOME=${HOME}`, `HOST=${HOST}`, `SHELL=/bin/zsh`, `TERM=xterm-256color`].join("\n"),
        "dim",
      );
    case "which":
      return COMMANDS.includes(args[0] as (typeof COMMANDS)[number])
        ? asText(`/usr/local/bin/${args[0]}`, "green")
        : asText(`${args[0] ?? ""} not found`, "red");
    case "history":
      return {
        lines: ctx.history.map((h, i) =>
          spansLine([
            { text: String(i + 1).padStart(4, " "), tone: "dim" },
            { text: `  ${h}` },
          ]),
        ),
        session: sessionNext,
      };
    case "clear":
    case "cls":
      return { lines: [], session: sessionNext, clear: true };
    case "exit":
    case "logout":
      return { lines: text("logout"), session: sessionNext, exit: true };
    case "about":
      return asText([content.about.name, content.about.role, "", content.about.bio].join("\n"));
    case "skills":
      return runOne(`cat ${HOME}/Skills/stack.txt`, session, ctx);
    case "projects":
      return {
        lines: [
          ...text("Featured projects — cat a file or `open <name>`:\n", "dim"),
          ...content.projects.map((p) =>
            spansLine([
              { text: "  " },
              { text: p.name, tone: "cyan" },
              { text: `  ${p.tagline}`, tone: "dim" },
            ]),
          ),
        ],
        session: sessionNext,
      };
    case "experience":
      return {
        lines: content.experience.experience.flatMap((e) =>
          text(
            `${e.role} @ ${e.company} (${e.duration})${e.skillSet.length ? `\n  Skills: ${e.skillSet.join(", ")}` : ""}\n${e.highlights.map((h) => `  - ${h}`).join("\n")}\n`,
          ),
        ),
        session: sessionNext,
      };
    case "education":
      return runOne(`cat ${HOME}/Education.md`, session, ctx);
    case "achievements":
      return runOne(`cat ${HOME}/Achievements.md`, session, ctx);
    case "stats":
      return runOne(`cat ${HOME}/stats.txt`, session, ctx);
    case "contact":
      return {
        lines: text(
          [
            `Email: ${content.about.email}`,
            content.about.emailAlt ? `Email: ${content.about.emailAlt}` : "",
            `Phone: ${content.about.phone}`,
            `GitHub: ${content.about.links.github}`,
            `LinkedIn: ${content.about.links.linkedin}`,
            "",
            "Opening Messages…",
          ].join("\n"),
        ),
        session: sessionNext,
        openApp: "messages",
      };
    case "resume":
      return {
        lines: text("Opening Resume.pdf in Preview…"),
        session: sessionNext,
        openApp: "preview",
      };
    case "github":
      return {
        lines: text(content.about.links.github, "cyan"),
        session: sessionNext,
        openUrl: content.about.links.github,
      };
    case "linkedin":
      return {
        lines: text(content.about.links.linkedin, "cyan"),
        session: sessionNext,
        openUrl: content.about.links.linkedin,
      };
    case "neofetch":
    case "fastfetch":
      return { lines: neofetch(), session: sessionNext };
    case "du":
      return { lines: [{ type: "du", rows: DU_ROWS }], session: sessionNext };
    case "fortune": {
      const bits = [
        content.kushgpt.interviewAnswers.whyHireMe,
        content.kushgpt.funFacts.likesBuilding.join(" · "),
        `Based in ${content.kushgpt.funFacts.basedIn}. ${content.kushgpt.funFacts.educationShort}`,
        content.kushgpt.careerGoals.shortTermGoal,
      ];
      return asText(bits[Math.floor(Math.random() * bits.length)]);
    }
    case "cowsay":
      return asText(cowsay(args.join(" ")));
    case "ping": {
      const host = args[0] ?? "github.com";
      return asText(
        `PING ${host}: 3 packets transmitted, 3 received, 0% packet loss\nround-trip min/avg/max = 12.1/18.4/24.0 ms`,
        "dim",
      );
    }
    case "curl": {
      const url = args[0] ?? content.about.links.github;
      if (/github/i.test(url)) {
        return {
          lines: text(content.about.links.github, "cyan"),
          session: sessionNext,
          openUrl: content.about.links.github,
        };
      }
      if (/linkedin/i.test(url)) {
        return {
          lines: text(content.about.links.linkedin, "cyan"),
          session: sessionNext,
          openUrl: content.about.links.linkedin,
        };
      }
      return asText(`curl: (6) Could not resolve host: ${url}`, "red");
    }
    case "npm":
      return asText(
        args[0] === "start" || args[0] === "run"
          ? "> macfolio@0.1.0 start\nPortfolioOS is already running in this window."
          : "usage: npm start",
        "dim",
      );
    case "git": {
      const sub = args[0] ?? "status";
      if (sub === "status" || sub === "st") {
        return asText(
          "On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean",
        );
      }
      if (sub === "log") return asText(gitLog(), "dim");
      if (sub === "remote") return asText(`origin  ${content.about.links.github} (fetch)\norigin  ${content.about.links.github} (push)`);
      return asText("git: try status, log, or remote", "yellow");
    }
    case "ps": {
      const rows = [
        spansLine([
          { text: "USER       PID  %CPU  COMMAND", tone: "dim" },
        ]),
        ...ctx.windows.map((w, i) =>
          spansLine([
            {
              text: `${USER.padEnd(9)} ${String(200 + i).padStart(4)}   ${(1.2 + i * 0.3).toFixed(1)}  ${w.minimized ? `(${w.title})` : w.title}`,
              tone: w.minimized ? "dim" : "white",
            },
          ]),
        ),
      ];
      return { lines: rows, session: sessionNext };
    }
    case "top":
    case "htop":
      return asText(
        [
          `Processes: ${ctx.windows.length} apps  CPU: user`,
          `${content.about.name}  ${content.stats.projectsCompleted} projects  ${content.stats.yearsCoding} yrs`,
          `Learning: ${content.kushgpt.careerGoals.currentlyLearning.join(", ")}`,
        ].join("\n"),
      );
    case "sudo":
      if (args.join(" ").toLowerCase().startsWith("hire")) {
        return {
          lines: text(
            [
              "Password:",
              "",
              "Access Granted.",
              `${content.about.name} is available for hiring.`,
              "Opening Messages…",
            ].join("\n"),
            "green",
          ),
          session: sessionNext,
          openApp: "messages",
        };
      }
      return asText(`sudo: ${args[0] ?? ""}: command not found`, "red");
    case "ssh":
      return {
        lines: text(
          `Welcome to ${HOST}.\nAuthenticated as ${USER}.\nOpening Messages…`,
          "green",
        ),
        session: sessionNext,
        openApp: "messages",
      };
    case "code":
      return {
        lines: text("Opening VS Code…"),
        session: sessionNext,
        openApp: "vscode",
      };
    case "cd": {
      const dest = resolvePath(session.cwd, args[0] || "~");
      const node = lookup(dest);
      if (!node) return { lines: err(`cd: no such file or directory: ${args[0] ?? dest}`), session: sessionNext };
      if (node.kind !== "dir") return { lines: err(`cd: not a directory: ${args[0]}`), session: sessionNext };
      sessionNext.cwd = dest === "/" ? HOME : dest;
      return { lines: [], session: sessionNext };
    }
    case "ls": {
      const flags = args.filter((a) => a.startsWith("-")).join("");
      const pathArg = args.find((a) => !a.startsWith("-"));
      const long = flags.includes("l");
      const all = flags.includes("a");
      const dest = resolvePath(session.cwd, pathArg);
      const node = lookup(dest);
      if (!node) return { lines: err(`ls: ${pathArg ?? dest}: No such file or directory`), session: sessionNext };
      if (node.kind === "file") return asText(node.name);
      const kids = listDir(node, all);
      if (long) {
        return {
          lines: kids.map((c) => {
            const mode = c.kind === "dir" ? "drwxr-xr-x" : "-rw-r--r--";
            return spansLine([
              { text: `${mode}  ${USER}  staff  `, tone: "dim" },
              { text: c.name, tone: c.kind === "dir" ? "cyan" : "white" },
            ]);
          }),
          session: sessionNext,
        };
      }
      if (!kids.length) return empty;
      return {
        lines: [
          spansLine(
            kids.flatMap((c, i) => [
              { text: c.name, tone: c.kind === "dir" ? "cyan" : "white" },
              { text: i === kids.length - 1 ? "" : "   " },
            ]),
          ),
        ],
        session: sessionNext,
      };
    }
    case "cat": {
      if (!args[0]) return asText("cat: missing file operand", "red");
      const dest = resolvePath(session.cwd, args[0]);
      const node = lookup(dest);
      if (!node) return { lines: err(`cat: ${args[0]}: No such file or directory`), session: sessionNext };
      if (node.kind !== "file") return { lines: err(`cat: ${args[0]}: Is a directory`), session: sessionNext };
      if (node.openApp === "preview") {
        return { lines: text(node.body), session: sessionNext, openApp: "preview" };
      }
      return asText(node.body);
    }
    case "head": {
      const dest = resolvePath(session.cwd, args[0] || "README.md");
      const node = lookup(dest);
      if (!node || node.kind !== "file") return { lines: err("head: not a file"), session: sessionNext };
      return asText(node.body.split("\n").slice(0, 8).join("\n"));
    }
    case "file": {
      const dest = resolvePath(session.cwd, args[0]);
      const node = lookup(dest);
      if (!node) return { lines: err(`file: ${args[0]}: cannot open`), session: sessionNext };
      return asText(
        node.kind === "dir" ? `${node.name}: directory` : `${node.name}: ${node.name.endsWith(".pdf") ? "PDF document" : "ASCII text"}`,
      );
    }
    case "tree": {
      const dest = resolvePath(session.cwd, args[0]);
      const node = lookup(dest);
      if (!node || node.kind !== "dir") return { lines: err("tree: not a directory"), session: sessionNext };
      return {
        lines: [
          spansLine([{ text: promptPath(dest), tone: "cyan" }]),
          ...treeLines(node).map((s) => spansLine(s)),
        ],
        session: sessionNext,
      };
    }
    case "find": {
      const q = (args[0] ?? "").toLowerCase();
      if (!q) return asText("usage: find <name>", "yellow");
      const home = lookup(HOME);
      if (!home || home.kind !== "dir") return empty;
      const hits = collectFiles(home, HOME).filter((f) =>
        f.path.toLowerCase().includes(q),
      );
      if (!hits.length) return asText("find: no matches", "dim");
      return {
        lines: hits.map((h) => spansLine([{ text: h.path.replace(HOME, "~"), tone: "cyan" }])),
        session: sessionNext,
      };
    }
    case "grep": {
      const q = args.join(" ").toLowerCase();
      if (!q) return asText("usage: grep <query>", "yellow");
      const home = lookup(HOME);
      if (!home || home.kind !== "dir") return empty;
      const hits = collectFiles(home, HOME).flatMap((f) =>
        f.file.body
          .split("\n")
          .map((line, n) => ({ f, line, n }))
          .filter((x) => x.line.toLowerCase().includes(q)),
      );
      if (!hits.length) return asText("grep: no matches", "dim");
      return {
        lines: hits.slice(0, 24).map((h) =>
          spansLine([
            { text: `${h.f.path.replace(HOME, "~")}:${h.n + 1}:`, tone: "cyan" },
            { text: ` ${h.line.trim()}` },
          ]),
        ),
        session: sessionNext,
      };
    }
    case "open": {
      const target = args.join(" ").toLowerCase();
      if (!target) return asText("usage: open <app|file|project>", "yellow");
      if (APP_ALIASES[target] || APP_ALIASES[slug(target)]) {
        const id = APP_ALIASES[target] ?? APP_ALIASES[slug(target)];
        return { lines: text(`Opening ${APPS[id].name}…`), session: sessionNext, openApp: id };
      }
      const dest = resolvePath(session.cwd, args.join(" "));
      const node = lookup(dest);
      if (node?.kind === "file" && node.openApp) {
        return { lines: text(`Opening ${node.name}…`), session: sessionNext, openApp: node.openApp, openUrl: node.openUrl };
      }
      const project = content.projects.find(
        (p) => slug(p.name).includes(slug(target)) || slug(p.id).includes(slug(target)),
      );
      if (project) {
        return { lines: text(`Opening project: ${project.name}`), session: sessionNext, openApp: "projects" };
      }
      return { lines: err(`open: ${args.join(" ")}: No such app or project`), session: sessionNext };
    }
    default:
      return {
        lines: err(`zsh: command not found: ${tokens[0]}\nType 'help' to see commands.`),
        session: sessionNext,
      };
  }
}

export function runCommand(
  raw: string,
  session: Session,
  ctx: { windows: { appId: AppId; title: string; minimized: boolean }[]; history: string[] },
): RunResult {
  let current = session;
  const lines: OutLine[] = [];
  let openApp: AppId | undefined;
  let openUrl: string | undefined;
  let clear = false;
  let exit = false;

  for (const chunk of splitCommands(raw)) {
    const result = runOne(chunk, current, ctx);
    current = result.session;
    lines.push(...result.lines);
    openApp = result.openApp ?? openApp;
    openUrl = result.openUrl ?? openUrl;
    if (result.clear) {
      clear = true;
      lines.length = 0;
    }
    if (result.exit) {
      exit = true;
      break;
    }
  }
  return { lines, session: current, openApp, openUrl, clear, exit };
}

export function complete(input: string, cwd: string): { value: string; hint?: string } {
  const tokens = tokenize(input);
  const trailing = input.endsWith(" ");
  const q = trailing ? "" : (tokens.at(-1) ?? "");
  const inCmd = tokens.length === 0 || (tokens.length === 1 && !trailing);
  const base = trailing || inCmd ? tokens : tokens.slice(0, -1);
  const names: string[] = [];

  if (inCmd) {
    names.push(...COMMANDS);
  } else {
    const from = q.includes("/") ? parentPath(resolvePath(cwd, q)) : cwd;
    const node = lookup(from);
    if (node?.kind === "dir") names.push(...listDir(node, q.startsWith(".")).map((c) => c.name));
    if (tokens[0]?.toLowerCase() === "open") {
      names.push(...Object.keys(APP_ALIASES), ...content.projects.map((p) => p.id));
    }
    if (tokens[0]?.toLowerCase() === "cd") {
      const dirNode = lookup(from);
      if (dirNode?.kind === "dir") {
        names.length = 0;
        names.push(
          ...listDir(dirNode, false)
            .filter((c) => c.kind === "dir")
            .map((c) => c.name),
        );
      }
    }
  }

  const matches = [...new Set(names)].filter((n) => n.toLowerCase().startsWith(q.toLowerCase()));
  if (!matches.length) return { value: input };
  const prefix = commonPrefix(matches);
  const filled = q.includes("/") ? `${q.slice(0, q.lastIndexOf("/") + 1)}${prefix}` : prefix;
  const value = [...(inCmd ? [] : base), filled].filter(Boolean).join(" ");
  if (matches.length === 1) {
    return { value: inCmd ? `${value} ` : value };
  }
  return { value, hint: matches.join("   ") };
}

function commonPrefix(items: string[]) {
  if (!items.length) return "";
  let p = items[0];
  for (const s of items.slice(1)) {
    let i = 0;
    while (i < p.length && i < s.length && p[i].toLowerCase() === s[i].toLowerCase()) i++;
    p = p.slice(0, i);
  }
  return p;
}

export { APP_ALIASES, USER, HOST };
