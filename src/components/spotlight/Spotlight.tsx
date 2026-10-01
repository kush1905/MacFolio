"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";
import { content } from "@/lib/content";
import { APPS, DOCK_ORDER } from "@/lib/apps";
import { AppIcon, MacOSAssetIcon } from "@/components/icons/AppIcon";
import type { AppId } from "@/types";

type SectionTitle =
  | "Top Hit"
  | "Applications"
  | "Documents"
  | "Folders"
  | "Projects"
  | "Definitions";

type Result = {
  key: string;
  title: string;
  subtitle: string;
  kindLabel: string;
  score: number;
  icon: "app" | "pdf" | "folder" | "person" | "skill";
  appIconId?: AppId;
  action: () => void;
};

type Section = { title: SectionTitle; items: Result[] };

const SKILL_GROUPS = [
  ["Languages", content.skills.languages],
  ["Frontend", content.skills.frontend],
  ["Mobile", content.skills.mobile],
  ["Backend", content.skills.backend],
  ["Databases", content.skills.databases],
  ["Cloud", content.skills.cloud],
  ["AI", content.skills.ai],
  ["Tools", content.skills.tools],
] as const;

function scoreMatch(q: string, ...fields: string[]) {
  if (!q) return 0;
  const hay = fields.join(" ").toLowerCase();
  const title = fields[0]?.toLowerCase() ?? "";
  if (title === q) return 100;
  if (title.startsWith(q)) return 86;
  if (title.includes(q)) return 72;
  if (hay.includes(q)) return 48;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1 && tokens.every((t) => hay.includes(t))) return 58;
  return 0;
}

export function Spotlight() {
  const open = useOSStore((s) => s.spotlightOpen);
  const setOpen = useOSStore((s) => s.setSpotlightOpen);
  const openApp = useWindowStore((s) => s.openApp);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setIndex(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(t);
  }, [open]);

  const catalog = useMemo(() => {
    const apps: Omit<Result, "score">[] = DOCK_ORDER.filter(
      (id) => id !== "launchpad",
    ).map((id) => ({
      key: `app-${id}`,
      title: APPS[id].name,
      subtitle: "Applications",
      kindLabel: "Application",
      appIconId: id,
      icon: "app" as const,
      action: () => openApp(id),
    }));

    apps.push({
      key: "app-preview",
      title: APPS.preview.name,
      subtitle: "Applications",
      kindLabel: "Application",
      appIconId: "preview",
      icon: "app",
      action: () => openApp("preview"),
    });

    const docs: Omit<Result, "score">[] = [
      {
        key: "doc-resume",
        title: "Resume.pdf",
        subtitle: "Documents — Desktop",
        kindLabel: "PDF Document",
        icon: "pdf",
        action: () => openApp("preview"),
      },
      {
        key: "doc-about",
        title: `${content.about.name}.txt`,
        subtitle: "Documents — About Me",
        kindLabel: "Text Document",
        icon: "person",
        action: () => openApp("finder"),
      },
    ];

    const folders: Omit<Result, "score">[] = [
      {
        key: "folder-projects",
        title: "Projects",
        subtitle: "Folders — Macintosh HD",
        kindLabel: "Folder",
        icon: "folder",
        action: () => openApp("projects"),
      },
      {
        key: "folder-about",
        title: "About Me",
        subtitle: "Folders — Macintosh HD",
        kindLabel: "Folder",
        icon: "folder",
        action: () => openApp("finder"),
      },
      {
        key: "folder-experience",
        title: "Experience",
        subtitle: "Folders — Macintosh HD",
        kindLabel: "Folder",
        icon: "folder",
        action: () => openApp("notes"),
      },
      {
        key: "folder-photos",
        title: "Photos",
        subtitle: "Folders — Pictures",
        kindLabel: "Folder",
        icon: "folder",
        action: () => openApp("photos"),
      },
    ];

    const projects: Omit<Result, "score">[] = content.projects.map((p) => ({
      key: `proj-${p.id}`,
      title: p.name,
      subtitle: p.tagline,
      kindLabel: "Project",
      icon: "folder" as const,
      action: () => openApp("projects"),
    }));

    const defs: Omit<Result, "score">[] = [
      {
        key: "def-kush",
        title: content.about.name,
        subtitle: content.about.role,
        kindLabel: "Definition",
        icon: "person",
        action: () => openApp("finder"),
      },
      ...SKILL_GROUPS.flatMap(([group, list]) =>
        list.map((skill) => ({
          key: `skill-${group}-${skill}`,
          title: skill,
          subtitle: `Skills › ${group}`,
          kindLabel: "Definition" as const,
          icon: "skill" as const,
          action: () => openApp("finder"),
        })),
      ),
    ];

    return { apps, docs, folders, projects, defs };
  }, [openApp]);

  const { flat, sections } = useMemo(() => {
    const q = query.trim().toLowerCase();

    const rank = (
      items: Omit<Result, "score">[],
      idleBoost: number,
    ): Result[] =>
      items
        .map((item) => ({
          ...item,
          score: q
            ? scoreMatch(q, item.title, item.subtitle, item.kindLabel)
            : idleBoost,
        }))
        .filter((r) => (q ? r.score > 0 : true));

    if (!q) {
      const apps = rank(catalog.apps, 40).slice(0, 5);
      const docs = rank(catalog.docs, 30).slice(0, 2);
      const idleSections: Section[] = (
        [
          { title: "Applications", items: apps },
          { title: "Documents", items: docs },
        ] as Section[]
      ).filter((s) => s.items.length > 0);
      return {
        flat: idleSections.flatMap((s) => s.items),
        sections: idleSections,
      };
    }

    const apps = rank(catalog.apps, 0);
    const docs = rank(catalog.docs, 0);
    const folders = rank(catalog.folders, 0);
    const projects = rank(catalog.projects, 0);
    const defs = rank(catalog.defs, 0);

    const pool = [...apps, ...docs, ...folders, ...projects, ...defs].sort(
      (a, b) => b.score - a.score || a.title.localeCompare(b.title),
    );

    const topHit = pool[0] ? [pool[0]] : [];
    const used = new Set(topHit.map((t) => t.key));

    const carve = (list: Result[], limit = 5) =>
      list
        .filter((r) => !used.has(r.key))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    const sectioned: Section[] = (
      [
        { title: "Top Hit", items: topHit },
        { title: "Applications", items: carve(apps) },
        { title: "Documents", items: carve(docs) },
        { title: "Folders", items: carve(folders) },
        { title: "Projects", items: carve(projects) },
        { title: "Definitions", items: carve(defs, 6) },
      ] as Section[]
    ).filter((s) => s.items.length > 0);

    return {
      flat: sectioned.flatMap((s) => s.items),
      sections: sectioned,
    };
  }, [catalog, query]);

  // Precompute flat index for each key
  const indexByKey = useMemo(() => {
    const map = new Map<string, number>();
    flat.forEach((r, i) => map.set(r.key, i));
    return map;
  }, [flat]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-spotlight-index="${index}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const launch = (r: Result) => {
    r.action();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/30 pt-[16vh] backdrop-blur-[1.5px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 480, damping: 34 }}
            className="spotlight-glass w-[min(680px,calc(100vw-28px))] overflow-hidden rounded-[12px]"
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Spotlight Search"
          >
            <div className="flex items-center gap-3 px-4 py-[13px]">
              <SpotlightSearchGlyph className="h-[22px] w-[22px] shrink-0 text-white/45" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.preventDefault();
                    if (query) setQuery("");
                    else setOpen(false);
                  }
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setIndex((i) =>
                      Math.min(i + 1, Math.max(flat.length - 1, 0)),
                    );
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setIndex((i) => Math.max(i - 1, 0));
                  }
                  if (e.key === "Enter" && flat[index]) {
                    e.preventDefault();
                    launch(flat[index]);
                  }
                }}
                placeholder="Spotlight Search"
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                className="select-text w-full bg-transparent text-[26px] font-normal leading-none tracking-[-0.025em] text-white outline-none placeholder:text-white/35"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Clear"
                  className="flex h-[18px] w-[18px] shrink-0 cursor-default items-center justify-center rounded-full bg-white/20 text-[12px] leading-none text-white/80 hover:bg-white/30"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                >
                  ×
                </button>
              ) : null}
            </div>

            <div
              ref={listRef}
              className="spotlight-results mac-scroll max-h-[min(420px,52vh)] border-t border-white/[0.08]"
            >
              {flat.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <div className="text-[14px] text-white/45">No results</div>
                  <div className="mt-1 text-[12px] text-white/30">
                    Try apps, Resume, skills, or a project name
                  </div>
                </div>
              ) : (
                <div className="pb-2 pt-1">
                  {sections.map((section) => (
                    <div key={section.title} className="mb-0.5">
                      <div className="spotlight-section-label px-4 pb-1 pt-2.5">
                        {section.title}
                      </div>
                      {section.items.map((r) => {
                        const i = indexByKey.get(r.key) ?? 0;
                        const selected = i === index;
                        const isTop = section.title === "Top Hit";
                        return (
                          <button
                            key={r.key}
                            type="button"
                            data-spotlight-index={i}
                            onMouseEnter={() => setIndex(i)}
                            onClick={() => launch(r)}
                            className={`mx-2 flex w-[calc(100%-16px)] cursor-default items-center gap-3 rounded-[8px] px-2.5 text-left ${
                              isTop ? "py-[9px]" : "py-[6px]"
                            } ${
                              selected
                                ? "bg-mac-accent text-white"
                                : "text-white/92 hover:bg-white/[0.06]"
                            }`}
                          >
                            <ResultIcon
                              result={r}
                              large={isTop}
                              selected={selected}
                            />
                            <div className="min-w-0 flex-1">
                              <div
                                className={`truncate tracking-[-0.015em] ${
                                  isTop
                                    ? "text-[15px] font-semibold"
                                    : "text-[14px] font-medium"
                                }`}
                              >
                                <Highlight text={r.title} query={query} />
                              </div>
                              <div
                                className={`truncate text-[11px] tracking-[-0.01em] ${
                                  selected ? "text-white/80" : "text-white/40"
                                }`}
                              >
                                {r.subtitle}
                              </div>
                            </div>
                            <div
                              className={`shrink-0 text-[11px] tracking-[-0.01em] ${
                                selected ? "text-white/75" : "text-white/30"
                              }`}
                            >
                              {r.kindLabel}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-[7px] text-[11px] text-white/35">
              <span>
                {flat.length > 0
                  ? `${flat.length} result${flat.length === 1 ? "" : "s"}`
                  : "PortfolioOS Spotlight"}
              </span>
              <span className="flex items-center gap-3">
                <span>
                  <kbd className="spotlight-kbd">↵</kbd> Open
                </span>
                <span>
                  <kbd className="spotlight-kbd">esc</kbd>{" "}
                  {query ? "Clear" : "Close"}
                </span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="underline decoration-white/35 underline-offset-[3px]">
        {text.slice(i, i + q.length)}
      </span>
      {text.slice(i + q.length)}
    </>
  );
}

function ResultIcon({
  result,
  large,
  selected,
}: {
  result: Result;
  large?: boolean;
  selected: boolean;
}) {
  const size = large ? "h-10 w-10" : "h-8 w-8";
  if (result.icon === "app" && result.appIconId) {
    return (
      <div className={`${size} shrink-0 drop-shadow`}>
        <AppIcon id={result.appIconId} />
      </div>
    );
  }
  if (result.icon === "pdf") {
    return (
      <div className={`${size} shrink-0`}>
        <MacOSAssetIcon name="document" className="h-full w-full" />
      </div>
    );
  }
  if (result.icon === "folder") {
    return (
      <div className={`${size} shrink-0`}>
        <MacOSAssetIcon name="folder" className="h-full w-full" />
      </div>
    );
  }
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-[9px] ${
        selected ? "bg-white/20" : "bg-white/10"
      }`}
    >
      {result.icon === "person" ? (
        <svg viewBox="0 0 20 20" className="h-[55%] w-[55%] fill-white/85">
          <circle cx="10" cy="7" r="3.2" />
          <path d="M4.2 16c.9-3.2 2.9-4.6 5.8-4.6s4.9 1.4 5.8 4.6" />
        </svg>
      ) : (
        <span className="text-[13px] font-semibold text-white/80">◇</span>
      )}
    </div>
  );
}

function SpotlightSearchGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle
        cx="10.5"
        cy="10.5"
        r="6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M15.4 15.4L20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
