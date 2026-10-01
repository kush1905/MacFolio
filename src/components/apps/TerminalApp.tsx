"use client";

import { useEffect, useRef, useState } from "react";
import {
  HOME,
  complete,
  lastLoginLine,
  promptPath,
  runCommand,
  type OutLine,
  type Session,
  type Span,
  type Tone,
} from "@/lib/terminal";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";
import { APPS } from "@/lib/apps";
import type { AppId } from "@/types";

const TONE: Record<Tone, string> = {
  dim: "term-dim",
  green: "term-green",
  cyan: "term-cyan",
  yellow: "term-yellow",
  red: "term-red",
  magenta: "term-magenta",
  white: "mac-terminal-output",
};

function bootLines(): OutLine[] {
  return [
    { type: "out", spans: [{ text: lastLoginLine(), tone: "dim" }] },
    { type: "out", spans: [{ text: " " }] },
    {
      type: "out",
      spans: [
        { text: "PortfolioOS zsh — ", tone: "dim" },
        { text: "help", tone: "green" },
        { text: " · ", tone: "dim" },
        { text: "ls", tone: "cyan" },
        { text: " · ", tone: "dim" },
        { text: "neofetch", tone: "green" },
        { text: " · ", tone: "dim" },
        { text: "sudo hire kush", tone: "yellow" },
      ],
    },
    { type: "out", spans: [{ text: " " }] },
  ];
}

function flattenLines(lines: OutLine[]): OutLine[] {
  return lines.flatMap((line) => {
    if (line.type !== "du") return [line];
    return line.rows.map((row) => ({
      type: "out" as const,
      spans: [
        { text: `${row.size.padStart(5, " ")}\t`, tone: "yellow" as const },
        { text: row.path, tone: "dim" as const },
      ],
    }));
  });
}

function lineDelay(count: number) {
  if (count <= 1) return 40;
  if (count <= 8) return 38;
  if (count <= 24) return 22;
  return 12;
}

function sleep(ms: number, signal: { id: number; current: () => number }) {
  return new Promise<boolean>((resolve) => {
    window.setTimeout(() => resolve(signal.current() === signal.id), ms);
  });
}

export function TerminalApp() {
  const openApp = useWindowStore((s) => s.openApp);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const windows = useWindowStore((s) => s.windows);
  const reduceMotion = useOSStore((s) => s.preferences.reduceMotion);
  const [session, setSession] = useState<Session>({ cwd: HOME });
  const [lines, setLines] = useState<OutLine[]>(bootLines);
  const [input, setInput] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const cwdRef = useRef(session.cwd);
  const jobRef = useRef(0);
  cwdRef.current = session.cwd;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [lines, hint, busy]);

  const abortJob = () => {
    jobRef.current += 1;
    setBusy(false);
  };

  const redirect = (opts: { openApp?: AppId; openUrl?: string; exit?: boolean }) => {
    if (opts.openApp) {
      const name = APPS[opts.openApp]?.name ?? opts.openApp;
      setLines((prev) => [
        ...prev,
        { type: "out", spans: [{ text: `→ opening ${name}…`, tone: "cyan" }] },
      ]);
      window.setTimeout(() => openApp(opts.openApp!), 320);
    }
    if (opts.openUrl) {
      if (!opts.openApp) {
        setLines((prev) => [
          ...prev,
          { type: "out", spans: [{ text: `→ opening ${opts.openUrl}…`, tone: "cyan" }] },
        ]);
      }
      window.setTimeout(() => window.open(opts.openUrl, "_blank"), 320);
    }
    if (opts.exit) {
      const mine = useWindowStore
        .getState()
        .windows.find((w) => w.appId === "terminal" && w.focused);
      if (mine) window.setTimeout(() => closeWindow(mine.id), 360);
    }
  };

  const printThenRedirect = async (
    output: OutLine[],
    follow: { openApp?: AppId; openUrl?: string; exit?: boolean },
  ) => {
    const id = ++jobRef.current;
    const live = { id, current: () => jobRef.current };
    setBusy(true);
    window.setTimeout(() => shellRef.current?.focus(), 0);

    if (reduceMotion || output.length === 0) {
      if (output.length) setLines((prev) => [...prev, ...output]);
      const ok = await sleep(output.length ? 160 : 0, live);
      if (!ok) return;
      setBusy(false);
      redirect(follow);
      window.setTimeout(() => inputRef.current?.focus(), 40);
      return;
    }

    const wait = lineDelay(output.length);
    for (const line of output) {
      const ok = await sleep(wait, live);
      if (!ok) return;
      setLines((prev) => [...prev, line]);
    }
    const hold = follow.openApp || follow.openUrl || follow.exit ? 220 : 0;
    const ok = await sleep(hold, live);
    if (!ok) return;
    setBusy(false);
    redirect(follow);
    window.setTimeout(() => inputRef.current?.focus(), 40);
  };

  const submit = (value: string) => {
    if (busy) return;
    setHint(null);
    const result = runCommand(value, session, {
      windows: windows.map((w) => ({
        appId: w.appId,
        title: w.title,
        minimized: w.minimized,
      })),
      history,
    });

    if (result.clear) {
      abortJob();
      setLines([]);
      setSession(result.session);
      setInput("");
      return;
    }

    setLines((prev) => [...prev, { type: "in", cwd: session.cwd, cmd: value }]);
    setSession(result.session);
    if (value.trim()) {
      setHistory((h) => (h[h.length - 1] === value ? h : [...h, value]));
      setHistIdx(-1);
    }
    setInput("");

    void printThenRedirect(flattenLines(result.lines), {
      openApp: result.openApp,
      openUrl: result.openUrl,
      exit: result.exit,
    });
  };

  return (
    <div
      ref={shellRef}
      className="mac-terminal flex h-full flex-col text-[13px] leading-[1.38] outline-none"
      tabIndex={busy ? 0 : -1}
      onClick={() => {
        if (!busy) inputRef.current?.focus();
      }}
      onKeyDown={(e) => {
        if (!busy) return;
        if (e.key === "c" && e.ctrlKey) {
          e.preventDefault();
          abortJob();
          setLines((prev) => [
            ...prev,
            { type: "out", spans: [{ text: "^C", tone: "dim" }] },
          ]);
        }
      }}
    >
      <div className="mac-scroll mac-terminal-body select-text flex-1 overflow-x-auto px-4 py-3">
        {lines.map((line, i) => (
          <LineView key={i} line={line} />
        ))}
        {busy && (
          <div className="term-dim" aria-hidden>
            ▍
          </div>
        )}
        {!busy && (
          <div className="flex items-baseline whitespace-pre">
            <Prompt cwd={session.cwd} />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setHint(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit(input);
                }
                if (e.key === "Tab") {
                  e.preventDefault();
                  const next = complete(input, cwdRef.current);
                  setInput(next.value);
                  setHint(next.hint ?? null);
                }
                if (e.key === "l" && e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  abortJob();
                  setLines([]);
                  setHint(null);
                }
                if (e.key === "c" && e.ctrlKey) {
                  e.preventDefault();
                  abortJob();
                  setLines((prev) => [
                    ...prev,
                    { type: "in", cwd: session.cwd, cmd: `${input}^C` },
                  ]);
                  setInput("");
                  setHint(null);
                }
                if (e.key === "u" && e.ctrlKey) {
                  e.preventDefault();
                  setInput("");
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (!history.length) return;
                  const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
                  setHistIdx(next);
                  setInput(history[next] ?? "");
                }
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (histIdx < 0) return;
                  const next = histIdx + 1;
                  if (next >= history.length) {
                    setHistIdx(-1);
                    setInput("");
                  } else {
                    setHistIdx(next);
                    setInput(history[next] ?? "");
                  }
                }
              }}
              className="mac-terminal-input mac-terminal-output min-w-[8ch] flex-1 bg-transparent outline-none"
              autoFocus
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Terminal input"
            />
          </div>
        )}
        {hint && (
          <div className="term-dim whitespace-pre-wrap pt-0.5 text-[12px]">{hint}</div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="whitespace-pre">
      <span className="term-green">kushgangwal</span>
      <span className="term-dim">@</span>
      <span className="term-cyan">MacBook-Pro</span>
      <span> </span>
      <span className="term-magenta">{promptPath(cwd)}</span>
      <span className="mac-terminal-prompt"> % </span>
    </span>
  );
}

function LineView({ line }: { line: OutLine }) {
  if (line.type === "du") {
    return (
      <div className="mac-terminal-output">
        {line.rows.map((row) => (
          <div key={row.path} className="whitespace-pre">
            <span className="inline-block w-[5ch] text-right tabular-nums term-yellow">
              {row.size}
            </span>
            {"\t"}
            <span className="term-dim">{row.path}</span>
          </div>
        ))}
      </div>
    );
  }
  if (line.type === "in") {
    return (
      <div className="flex items-baseline whitespace-pre">
        <Prompt cwd={line.cwd} />
        <span className="mac-terminal-output">{line.cmd}</span>
      </div>
    );
  }
  return (
    <div className="whitespace-pre">
      {line.spans.map((s, i) => (
        <SpanView key={i} span={s} />
      ))}
    </div>
  );
}

function SpanView({ span }: { span: Span }) {
  const cls = span.tone ? TONE[span.tone] : "mac-terminal-output";
  const url = span.text.match(/https?:\/\/\S+/)?.[0];
  if (url && span.text.trim() === url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={`${cls} underline decoration-white/20`}
      >
        {span.text}
      </a>
    );
  }
  return <span className={cls}>{span.text}</span>;
}
