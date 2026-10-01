"use client";

import { useMemo, useState, type ReactNode } from "react";
import { content } from "@/lib/content";
import { UserAvatar } from "@/components/icons/UserAvatar";
import { useWindowStore } from "@/store/windowStore";

type FileId = "readme" | "skills" | "projects" | "experience" | "about";
type Mode = "preview" | "source";

const FILES: {
  id: FileId;
  name: string;
  folder: string;
  lang: string;
  badge: string;
  badgeBg: string;
}[] = [
  { id: "readme", name: "README.md", folder: "kush", lang: "markdown", badge: "MD", badgeBg: "#3e8ed0" },
  { id: "skills", name: "skills.ts", folder: "kush", lang: "typescript", badge: "TS", badgeBg: "#3178c6" },
  { id: "projects", name: "projects.ts", folder: "kush", lang: "typescript", badge: "TS", badgeBg: "#3178c6" },
  { id: "experience", name: "experience.ts", folder: "kush", lang: "typescript", badge: "TS", badgeBg: "#3178c6" },
  { id: "about", name: "about.ts", folder: "kush", lang: "typescript", badge: "TS", badgeBg: "#3178c6" },
];

const SKILL_GROUPS: { key: keyof typeof content.skills; label: string; color: string }[] = [
  { key: "languages", label: "Languages", color: "#f1c40f" },
  { key: "frontend", label: "Frontend", color: "#61dafb" },
  { key: "mobile", label: "Mobile", color: "#a78bfa" },
  { key: "backend", label: "Backend", color: "#34d399" },
  { key: "databases", label: "Databases", color: "#f97316" },
  { key: "cloud", label: "Cloud", color: "#38bdf8" },
  { key: "ai", label: "AI", color: "#fb7185" },
  { key: "concepts", label: "Concepts", color: "#94a3b8" },
  { key: "tools", label: "Tools", color: "#818cf8" },
];

function fileBody(id: FileId): string {
  switch (id) {
    case "readme":
      return [
        `# ${content.about.name}`,
        ``,
        `> ${content.about.tagline}`,
        ``,
        content.about.bio,
        ``,
        `## Quick links`,
        `- Resume: ${content.about.links.resume}`,
        `- GitHub: ${content.about.links.github}`,
        `- LinkedIn: ${content.about.links.linkedin}`,
      ].join("\n");
    case "skills":
      return `export const skills = ${JSON.stringify(content.skills, null, 2)} as const;\n`;
    case "projects":
      return `export const projects = ${JSON.stringify(
        content.projects.map((p) => ({
          id: p.id,
          name: p.name,
          tagline: p.tagline,
          tech: p.tech,
          github: p.github,
        })),
        null,
        2,
      )} as const;\n`;
    case "experience":
      return `export const experience = ${JSON.stringify(content.experience.experience, null, 2)} as const;\n`;
    case "about":
      return `export const about = {\n  name: "${content.about.name}",\n  role: "${content.about.role}",\n  email: "${content.about.email}",\n  location: "${content.about.location}",\n};\n`;
  }
}

export function ProjectsApp() {
  const openApp = useWindowStore((s) => s.openApp);
  const [file, setFile] = useState<FileId>("readme");
  const [mode, setMode] = useState<Mode>("preview");
  const [query, setQuery] = useState("");
  const [sidebar, setSidebar] = useState<"files" | "search">("files");
  const body = useMemo(() => fileBody(file), [file]);
  const lines = body.split("\n");
  const active = FILES.find((f) => f.id === file)!;
  const q = query.trim().toLowerCase();
  const shown = FILES.filter(
    (f) => !q || f.name.toLowerCase().includes(q) || f.id.includes(q),
  );

  const openFile = (id: FileId) => {
    setFile(id);
    setMode("preview");
  };

  return (
    <div className="vscode-app flex h-full text-[13px] text-[#cccccc]">
      <nav className="vscode-activity flex w-[48px] shrink-0 flex-col items-center py-2">
        <ActivityBtn
          label="Explorer"
          active={sidebar === "files"}
          onClick={() => setSidebar("files")}
        >
          <IconFiles />
        </ActivityBtn>
        <ActivityBtn
          label="Search"
          active={sidebar === "search"}
          onClick={() => setSidebar("search")}
        >
          <IconSearch />
        </ActivityBtn>
        <ActivityBtn label="Source Control">
          <IconGit />
        </ActivityBtn>
        <ActivityBtn label="Extensions">
          <IconGrid />
        </ActivityBtn>
        <div className="mt-auto flex flex-col items-center gap-1 pb-1">
          <ActivityBtn label="Account">
            <UserAvatar size={22} className="ring-1 ring-white/20" />
          </ActivityBtn>
          <ActivityBtn label="Settings" onClick={() => openApp("settings")}>
            <IconGear />
          </ActivityBtn>
        </div>
      </nav>

      <aside className="vscode-side mac-scroll w-[220px] shrink-0">
        <div className="flex h-9 items-center justify-between px-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
            {sidebar === "search" ? "Search" : "Explorer"}
          </span>
          <span className="text-[10px] text-white/25">⌘B</span>
        </div>

        {sidebar === "search" && (
          <div className="px-2 pb-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files"
              className="h-7 w-full rounded-[6px] border-0 bg-white/[0.07] px-2.5 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:bg-white/[0.1]"
            />
          </div>
        )}

        <div className="px-2 pb-1 text-[11px] font-semibold tracking-wide text-white/55">
          PORTFOLIO
        </div>
        <div className="px-1.5 pb-3">
          <div className="flex items-center gap-1 px-1.5 py-1 text-[12px] text-white/70">
            <Caret />
            <FolderMark />
            <span>kush</span>
          </div>
          {shown.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => openFile(f.id)}
              className={`flex w-full cursor-default items-center gap-2 rounded-[5px] py-1 pl-6 pr-2 text-left ${
                file === f.id ? "vscode-file-on" : "text-white/70 hover:bg-white/[0.05]"
              }`}
            >
              <span
                className="flex h-[15px] w-[18px] items-center justify-center rounded-[3px] text-[8px] font-bold text-white"
                style={{ background: f.badgeBg }}
              >
                {f.badge}
              </span>
              <span className="truncate">{f.name}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="vscode-tabs flex h-9 items-center gap-px">
          {FILES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => openFile(f.id)}
              className={`flex h-full min-w-[128px] items-center gap-2 border-r border-black/30 px-3 text-[12px] ${
                file === f.id
                  ? "vscode-tab-on"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <span
                className="flex h-[14px] w-[16px] items-center justify-center rounded-[3px] text-[7px] font-bold text-white"
                style={{ background: f.badgeBg }}
              >
                {f.badge}
              </span>
              {f.name}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1 pr-2">
            {(["preview", "source"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-[6px] px-2 py-0.5 text-[11px] capitalize ${
                  mode === m
                    ? "bg-white/[0.12] text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="vscode-crumb flex h-7 items-center gap-1.5 px-3 text-[11px] text-white/40">
          <span>kush</span>
          <span className="text-white/20">/</span>
          <span className="text-white/70">{active.name}</span>
          <span className="ml-auto text-white/25">{active.lang}</span>
        </div>

        <div className="mac-scroll min-h-0 flex-1">
          {mode === "preview" ? (
            <Preview id={file} onOpenFile={openFile} />
          ) : (
            <Source lines={lines} lang={active.lang} />
          )}
        </div>

        <div className="vscode-status flex h-[22px] items-center justify-between px-2.5 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#7dce8a]">
              <BranchIcon />
              main
            </span>
            <span className="text-white/35">0 ⚠  0 ✕</span>
          </div>
          <div className="flex items-center gap-3 text-white/45">
            <span>UTF-8</span>
            <span>{active.lang}</span>
            <span>Ln {lines.length}</span>
            <span>Prettier</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Preview({
  id,
  onOpenFile,
}: {
  id: FileId;
  onOpenFile: (id: FileId) => void;
}) {
  const about = content.about;

  if (id === "readme") {
    return (
      <div className="vscode-preview px-8 py-7">
        <div className="vscode-hero mb-6 overflow-hidden rounded-[16px] p-5">
          <div className="flex items-center gap-4">
            <UserAvatar size={64} className="ring-2 ring-white/15" />
            <div className="min-w-0">
              <div className="text-[22px] font-semibold tracking-[-0.04em] text-white">
                {about.name}
              </div>
              <div className="mt-0.5 text-[13px] text-[#9cdcfe]">{about.tagline}</div>
              <div className="mt-1 text-[12px] text-white/45">
                {about.location} · {about.role}
              </div>
            </div>
          </div>
        </div>
        <p className="max-w-[62ch] text-[13.5px] leading-[1.65] text-white/72">{about.bio}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <LinkChip href={about.links.github} label="GitHub" />
          <LinkChip href={about.links.linkedin} label="LinkedIn" />
          <LinkChip href={about.links.resume} label="Resume" />
          {about.emailAlt ? (
            <LinkChip href={`mailto:${about.email}`} label={about.email} />
          ) : (
            <LinkChip href={`mailto:${about.email}`} label="Email" />
          )}
        </div>
        <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FILES.filter((f) => f.id !== "readme").map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onOpenFile(f.id)}
              className="vscode-jump cursor-default rounded-[12px] px-3 py-2.5 text-left"
            >
              <div className="text-[10px] uppercase tracking-[0.08em] text-white/35">{f.badge}</div>
              <div className="mt-1 text-[12.5px] font-medium text-white/90">{f.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (id === "skills") {
    return (
      <div className="vscode-preview space-y-5 px-7 py-6">
        <Head kicker="skills.ts" title="Stack" />
        {SKILL_GROUPS.map((g) => {
          const items = content.skills[g.key];
          if (!Array.isArray(items) || items.length === 0 || typeof items[0] !== "string")
            return null;
          return (
            <div key={g.key}>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
                {g.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(items as string[]).map((s) => (
                  <span key={s} className="vscode-chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        {content.skills.certifications.length > 0 && (
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
              Certifications
            </div>
            {content.skills.certifications.map((c) => (
              <div key={c.name} className="vscode-card px-3 py-2.5">
                <div className="text-[13px] font-medium text-white/90">{c.name}</div>
                <div className="text-[12px] text-white/45">
                  {c.issuer} · {c.year}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (id === "projects") {
    return (
      <div className="vscode-preview space-y-3 px-7 py-6">
        <Head kicker="projects.ts" title="Shipped work" />
        {content.projects.map((p) => (
          <article key={p.id} className="vscode-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[15px] font-semibold tracking-[-0.02em] text-white">
                  {p.name}
                </div>
                <div className="mt-0.5 text-[12.5px] text-[#9cdcfe]">{p.tagline}</div>
              </div>
              <div className="shrink-0 text-[11px] text-white/35">{p.period}</div>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-white/60">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span key={t} className="vscode-chip">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.github && <LinkChip href={p.github} label="GitHub" />}
              {p.demo && <LinkChip href={p.demo} label="Demo" />}
              {p.playStore && <LinkChip href={p.playStore} label="Play Store" />}
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (id === "experience") {
    return (
      <div className="vscode-preview space-y-3 px-7 py-6">
        <Head kicker="experience.ts" title="Career" />
        {content.experience.experience.map((job) => (
          <article key={job.company} className="vscode-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[15px] font-semibold text-white">{job.role}</div>
                <div className="text-[12.5px] text-[#9cdcfe]">{job.company}</div>
              </div>
              <div className="text-right text-[11px] text-white/40">
                <div>{job.duration}</div>
                <div>{job.type}</div>
              </div>
            </div>
            {job.skillSet.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.skillSet.map((s) => (
                  <span key={s} className="vscode-chip">
                    {s}
                  </span>
                ))}
              </div>
            )}
            <ul className="mt-3 space-y-1.5">
              {job.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-[12.5px] leading-relaxed text-white/62">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7dce8a]" />
                  {h}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="vscode-preview px-7 py-6">
      <Head kicker="about.ts" title="Identity" />
      <div className="vscode-card mt-3 flex items-center gap-4 p-4">
        <UserAvatar size={72} className="ring-2 ring-white/12" />
        <div>
          <div className="text-[18px] font-semibold text-white">{about.name}</div>
          <div className="text-[13px] text-[#9cdcfe]">{about.role}</div>
          <div className="mt-1 text-[12px] text-white/45">{about.location}</div>
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Meta label="Email" value={about.email} href={`mailto:${about.email}`} />
        {about.emailAlt && (
          <Meta label="Work email" value={about.emailAlt} href={`mailto:${about.emailAlt}`} />
        )}
        <Meta label="Phone" value={about.phone} />
        <Meta label="GitHub" value="kush1905" href={about.links.github} />
        <Meta label="LinkedIn" value="kush-gangwal" href={about.links.linkedin} />
        <Meta
          label="Education"
          value={`${about.education.degree} · ${about.education.cgpa}`}
        />
      </div>
    </div>
  );
}

function Source({ lines, lang }: { lines: string[]; lang: string }) {
  return (
    <div className="flex min-h-full font-mono text-[12.5px] leading-[1.7]">
      <div className="shrink-0 select-none px-3 py-4 text-right text-white/22">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <pre className="min-w-0 flex-1 whitespace-pre-wrap py-4 pr-6">
        {lines.map((line, i) => (
          <div key={i}>
            <CodeLine line={line} lang={lang} />
          </div>
        ))}
      </pre>
    </div>
  );
}

function CodeLine({ line, lang }: { line: string; lang: string }) {
  if (lang === "markdown") {
    if (line.startsWith("# "))
      return <span className="text-[15px] font-semibold text-[#569cd6]">{line}</span>;
    if (line.startsWith("## "))
      return <span className="font-semibold text-[#569cd6]">{line}</span>;
    if (line.startsWith("> "))
      return <span className="text-[#6a9955]">{line}</span>;
    if (line.startsWith("- "))
      return (
        <span>
          <span className="text-[#d4d4d4]">- </span>
          <span className="text-[#ce9178]">{line.slice(2)}</span>
        </span>
      );
    return <span className="text-[#d4d4d4]">{line || " "}</span>;
  }
  return <span>{highlightTs(line)}</span>;
}

function highlightTs(line: string): ReactNode {
  if (!line) return " ";
  const parts: ReactNode[] = [];
  const re =
    /(\bexport\b|\bconst\b|\bas\b|\btrue\b|\bfalse\b|\bnull\b)|("(?:\\.|[^"\\])*")|(\b\d+\b)|([{}\[\]:,])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) parts.push(line.slice(last, m.index));
    if (m[1])
      parts.push(
        <span key={i++} className="text-[#c586c0]">
          {m[1]}
        </span>,
      );
    else if (m[2])
      parts.push(
        <span key={i++} className="text-[#ce9178]">
          {m[2]}
        </span>,
      );
    else if (m[3])
      parts.push(
        <span key={i++} className="text-[#b5cea8]">
          {m[3]}
        </span>,
      );
    else
      parts.push(
        <span key={i++} className="text-white/40">
          {m[4]}
        </span>,
      );
    last = m.index + m[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

function Head({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.1em] text-white/30">{kicker}</div>
      <div className="mt-0.5 text-[20px] font-semibold tracking-[-0.03em] text-white">{title}</div>
    </div>
  );
}

function LinkChip({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") || href.startsWith("mailto") ? "_blank" : undefined}
      rel="noreferrer"
      className="vscode-link"
    >
      {label}
    </a>
  );
}

function Meta({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="vscode-card px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-[0.08em] text-white/35">{label}</div>
      <div className="mt-0.5 truncate text-[13px] text-white/88">{value}</div>
    </div>
  );
  if (!href) return inner;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="block">
      {inner}
    </a>
  );
}

function ActivityBtn({
  children,
  active,
  label,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`flex h-11 w-full items-center justify-center ${
        active ? "vscode-activity-on text-white" : "text-white/38 hover:text-white/80"
      }`}
    >
      {children}
    </button>
  );
}

function IconFiles() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor">
      <path d="M3 4h7l2 2h9v14H3z" opacity="0.35" />
      <path d="M3 8h18v12H3z" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.2" />
      <path d="M16 16l4 4" strokeLinecap="round" />
    </svg>
  );
}
function IconGit() {
  return (
    <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="12" r="2.2" />
      <path d="M6 8.2v7.6M8.2 18h5.2c2 0 2.6-1.2 2.6-3.2V14" />
    </svg>
  );
}
function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
      <rect x="3" y="3" width="8" height="8" rx="1.4" />
      <rect x="13" y="3" width="8" height="8" rx="1.4" />
      <rect x="3" y="13" width="8" height="8" rx="1.4" />
      <rect x="13" y="13" width="8" height="8" rx="1.4" opacity="0.45" />
    </svg>
  );
}
function IconGear() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.8 6.5l1.6 1.6M17.6 15.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.8 17.5l1.6-1.6M17.6 8.1l1.6-1.6" strokeLinecap="round" />
    </svg>
  );
}
function Caret() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 text-white/45" fill="currentColor">
      <path d="M3 2.5 L9 6 L3 9.5z" />
    </svg>
  );
}
function FolderMark() {
  return (
    <svg viewBox="0 0 16 13" className="h-3.5 w-4 text-[#dcb67a]" fill="currentColor">
      <path d="M1 2.2c0-.6.5-1.1 1.1-1.1h3.1l.8 1.1h7.9c.6 0 1.1.5 1.1 1.1v7.5c0 .6-.5 1.1-1.1 1.1H2.1C1.5 12 1 11.5 1 10.9V2.2z" />
    </svg>
  );
}
function BranchIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="3" cy="3" r="1.4" />
      <circle cx="3" cy="9" r="1.4" />
      <circle cx="9" cy="6" r="1.4" />
      <path d="M3 4.4v3.2M4.4 9H6.2c1.2 0 1.4-.6 1.4-1.6V7.2" />
    </svg>
  );
}
