"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { HomeProject, TechNode } from "@/lib/portfolio";
import { useSceneStore } from "@/store/sceneStore";

type Item = { id: string; label: string; hint: string; href: string; keywords: string };
type Answer = { text: string; links: { label: string; href: string }[] };
type Turn = { role: "user" | "assistant"; text: string };

const PAGES: Item[] = [
  { id: "about", label: "About Kush Gangwal", hint: "Profile", href: "/about-kush-gangwal", keywords: "about bio profile who education medicaps" },
  { id: "projects", label: "All projects", hint: "Case studies", href: "/projects", keywords: "projects work case studies portfolio" },
  { id: "now", label: "Now", hint: "Current focus", href: "/now", keywords: "now current learning working" },
  { id: "stack", label: "Technology stack", hint: "Stack", href: "/stack", keywords: "stack skills technologies" },
  { id: "blog", label: "Writing", hint: "Blog", href: "/blog", keywords: "blog writing articles posts" },
  { id: "resume", label: "Resume", hint: "Resume", href: "/resume", keywords: "resume cv" },
  { id: "faq", label: "FAQ", hint: "Questions", href: "/faq", keywords: "faq questions answers" },
  { id: "contact", label: "Contact Kush", hint: "Email or message", href: "/#contact", keywords: "contact email hire message reach" },
  { id: "desktop", label: "Macfolio desktop", hint: "macOS-style portfolio", href: "/desktop", keywords: "desktop macos macfolio os" },
];

const SUGGESTIONS = [
  "What has Kush built?",
  "Tell me about Potato Bazaar.",
  "What is his React Native experience?",
  "How can I contact him?",
];

function looksLikeQuestion(query: string) {
  return /\?\s*$/.test(query) || /^(what|who|how|which|where|when|why|tell|does|did|is|can|has|show)\b/i.test(query);
}

/** Renders **bold** spans from the assistant without trusting any HTML. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <p key={i}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j}>{part.slice(2, -2)}</strong>
            ) : (
              <Fragment key={j}>{part}</Fragment>
            ),
          )}
        </p>
      ))}
    </>
  );
}

export function CommandPalette({
  projects,
  techNodes,
}: {
  projects: HomeProject[];
  techNodes: TechNode[];
}) {
  const open = useSceneStore((state) => state.paletteOpen);
  const initialQuery = useSceneStore((state) => state.paletteQuery);
  const openPalette = useSceneStore((state) => state.openPalette);
  const closePalette = useSceneStore((state) => state.closePalette);
  const session = useSceneStore((state) => state.paletteSession);

  // Global shortcut: Cmd/Ctrl + K.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (useSceneStore.getState().paletteOpen) closePalette();
        else openPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPalette, closePalette]);

  if (!open) return null;
  return (
    <PaletteDialog
      key={session}
      initialQuery={initialQuery}
      projects={projects}
      techNodes={techNodes}
      onClose={closePalette}
    />
  );
}

const sharedHistory: Turn[] = [];

function PaletteDialog({
  initialQuery,
  projects,
  techNodes,
  onClose,
}: {
  initialQuery: string;
  projects: HomeProject[];
  techNodes: TechNode[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [asking, setAsking] = useState(Boolean(initialQuery));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(
    () => [
      ...projects.map((p) => ({
        id: `project-${p.slug}`,
        label: p.name,
        hint: p.tagline,
        href: `/projects/${p.slug}`,
        keywords: `${p.name} ${p.tagline} ${p.tech.join(" ")} ${p.context}`.toLowerCase(),
      })),
      ...techNodes.map((t) => ({
        id: `tech-${t.slug}`,
        label: t.name,
        hint: t.projects.length
          ? `${t.group} · used in ${t.projects.length} ${t.projects.length === 1 ? "project" : "projects"}`
          : t.group,
        href: t.page ? `/stack/${t.slug}` : "/#core",
        keywords: `${t.name} ${t.group} ${t.use}`.toLowerCase(),
      })),
      ...PAGES,
    ],
    [projects, techNodes],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.filter((item) => item.id.startsWith("project-")).slice(0, 6);
    const terms = q.split(/\s+/).filter((t) => t.length > 1);
    return items
      .map((item) => {
        const hay = `${item.label.toLowerCase()} ${item.keywords}`;
        const score =
          (item.label.toLowerCase().startsWith(q) ? 5 : 0) +
          terms.reduce((sum, term) => sum + (hay.includes(term) ? 1 : 0), 0);
        return { item, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 7)
      .map((r) => r.item);
  }, [items, query]);

  const trimmed = query.trim();
  const askFirst = trimmed.length > 0 && (looksLikeQuestion(trimmed) || results.length === 0);
  const rows = trimmed
    ? askFirst
      ? ["ask", ...results.map((r) => r.id)]
      : [...results.map((r) => r.id), "ask"]
    : results.map((r) => r.id);

  /** Fetches an answer; only sets state after the request resolves. */
  const fetchAnswer = useCallback(async (question: string) => {
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history: sharedHistory.slice(-8) }),
      });
      const data = (await res.json()) as { text?: string; links?: Answer["links"]; error?: string };
      if (!res.ok || !data.text) {
        setError(data.error ?? "The assistant couldn't answer right now. Try the search results instead.");
        return;
      }
      setAnswer({ text: data.text, links: data.links ?? [] });
      sharedHistory.push({ role: "user", text: question }, { role: "assistant", text: data.text });
    } catch {
      setError("Network error. The search results still work.");
    } finally {
      setAsking(false);
    }
  }, []);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    setAsking(true);
    setError(null);
    setAnswer(null);
    void fetchAnswer(q);
  };

  // On open: focus the input, lock page scroll, auto-ask a suggested question, restore focus on close.
  useEffect(() => {
    const restore = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    // fetchAnswer only sets state after the request resolves, so this is a fetch-on-mount, not a cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialQuery) void fetchAnswer(initialQuery);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      restore?.focus?.();
    };
  }, [initialQuery, fetchAnswer]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function activate(index: number) {
    const id = rows[index];
    if (id === "ask") ask(query);
    else {
      const item = items.find((i) => i.id === id);
      if (item) go(item.href);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((s) => Math.min(s + 1, rows.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (event.key === "Enter" && event.target === inputRef.current) {
      event.preventDefault();
      if (rows.length > 0) activate(Math.min(selected, rows.length - 1));
    } else if (event.key === "Tab") {
      // Keep focus inside the dialog.
      const focusables = event.currentTarget.querySelectorAll<HTMLElement>("input, button, a[href]");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <div className="palette-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-labelledby="palette-title"
        onKeyDown={onKeyDown}
      >
        <div className="palette-head">
          <h2 id="palette-title">Ask Kush</h2>
          <button type="button" className="palette-close" onClick={onClose} aria-label="Close">
            Esc
          </button>
        </div>
        <input
          ref={inputRef}
          className="palette-input"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-results"
          aria-activedescendant={rows[selected] ? `palette-row-${rows[selected]}` : undefined}
          aria-label="Search projects, technologies, and pages, or ask a question"
          placeholder="Search, or ask a question about Kush's work…"
          value={query}
          maxLength={600}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
        />

        <ul id="palette-results" className="palette-results" role="listbox" aria-label="Results">
          {rows.map((id, index) => {
            const active = index === selected;
            if (id === "ask") {
              return (
                <li
                  key="ask"
                  id="palette-row-ask"
                  role="option"
                  aria-selected={active}
                  className="palette-row palette-ask"
                  onMouseEnter={() => setSelected(index)}
                  onClick={() => activate(index)}
                >
                  <span>Ask: “{trimmed}”</span>
                  <span className="palette-hint">Answer from portfolio facts</span>
                </li>
              );
            }
            const item = items.find((i) => i.id === id)!;
            return (
              <li
                key={id}
                id={`palette-row-${id}`}
                role="option"
                aria-selected={active}
                className="palette-row"
                onMouseEnter={() => setSelected(index)}
                onClick={() => activate(index)}
              >
                <span>{item.label}</span>
                <span className="palette-hint">{item.hint}</span>
              </li>
            );
          })}
        </ul>

        {!trimmed && !answer && !asking ? (
          <div className="palette-suggest">
            <p>Try asking</p>
            <div>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setQuery(s);
                    ask(s);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {asking || answer || error ? (
          <div className="palette-answer" aria-live="polite" aria-busy={asking}>
            {asking ? <p className="palette-thinking">Looking through the portfolio…</p> : null}
            {error ? <p className="palette-error">{error}</p> : null}
            {answer ? (
              <>
                <Rich text={answer.text} />
                {answer.links.length > 0 ? (
                  <p className="palette-links">
                    {answer.links.map((link) => (
                      <Link key={link.href} href={link.href} onClick={() => onClose()}>
                        {link.label} →
                      </Link>
                    ))}
                  </p>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
