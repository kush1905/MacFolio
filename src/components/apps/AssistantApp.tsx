"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowStore } from "@/store/windowStore";
import { useOSStore } from "@/store/osStore";
import { UserAvatar } from "@/components/icons/UserAvatar";
import { FormattedText } from "@/components/apps/FormattedText";
import { content } from "@/lib/content";
import type { AppId } from "@/types";

type Msg = { id: string; role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  {
    q: "Why should a recruiter hire Kush, and what kind of work is he strongest at?",
    kicker: "Hire",
    label: "Why hire Kush?",
  },
  {
    q: "Which project best shows what Kush can ship, and what did he actually build?",
    kicker: "Work",
    label: "His strongest project",
  },
  {
    q: "What is Kush doing at SK Groups, and what did he ship at Protonshub and Django Softwares?",
    kicker: "Career",
    label: "Role and internships",
  },
  {
    q: "What is Kush's stack, what is he learning next, and how do I contact him?",
    kicker: "Next",
    label: "Skills and how to reach him",
  },
];

const WELCOME: Msg = {
  id: "welcome",
  role: "assistant",
  text: `Hi — I'm KushGPT.\n\nI answer from Kush's knowledge base: story, projects, internships, skills, and goals. I won't invent details I don't have.`,
};

export function AssistantApp() {
  const openApp = useWindowStore((s) => s.openApp);
  const reduceMotion = useOSStore((s) => s.preferences.reduceMotion);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [focused, setFocused] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const started = msgs.some((m) => m.role === "user");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, [msgs, busy, reduceMotion]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const history = msgs.filter((m) => m.id !== "welcome").slice(-10);
    setMsgs((m) => [...m, { id: uid(), role: "user", text: q }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history }),
        signal: ac.signal,
      });
      const data = (await res.json()) as {
        text?: string;
        openApp?: AppId;
        error?: string;
      };

      if (!res.ok) throw new Error(data.error || "Request failed");

      const reply =
        data.text?.trim() ||
        "I couldn't form an answer — try asking about skills, projects, or experience.";

      setMsgs((m) => [...m, { id: uid(), role: "assistant", text: reply }]);

      if (data.openApp) {
        window.setTimeout(() => openApp(data.openApp!), 400);
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setMsgs((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          text: "Something went wrong for a moment. Try asking again.",
        },
      ]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMsgs([WELCOME]);
    setBusy(false);
    setInput("");
  };

  return (
    <div className="kushgpt-app relative flex h-full flex-col overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="kushgpt-aurora" />
        {!reduceMotion && (
          <>
            <motion.div
              className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-[var(--mac-accent)]/30 blur-[70px]"
              animate={{ x: [0, 28, 0], y: [0, 22, 0], opacity: [0.55, 0.9, 0.55] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -right-16 bottom-16 h-64 w-64 rounded-full bg-[#bf5af2]/22 blur-[80px]"
              animate={{ x: [0, -22, 0], y: [0, -26, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
        <div className="kushgpt-grid absolute inset-0 opacity-[0.18]" />
        <div className="kushgpt-vignette absolute inset-0" />
      </div>

      <header className="relative z-10 px-3 pt-10">
        <div className="kushgpt-glass flex items-center gap-3 rounded-[16px] px-3 py-2">
          <div className="relative shrink-0">
            <UserAvatar size={30} className="ring-1 ring-white/20" />
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#141418] ${
                busy ? "bg-[#ffd60a] kushgpt-live" : "bg-[#30d158]"
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="kushgpt-wordmark text-[14px] font-semibold tracking-[-0.03em]">
              KushGPT
            </div>
            <div className="truncate text-[11px] text-white/45">
              {busy ? "Writing a reply…" : `Personal AI for ${content.about.name}`}
            </div>
          </div>
          {started && (
            <button
              type="button"
              onClick={reset}
              className="cursor-default rounded-full bg-white/8 px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/14"
            >
              New chat
            </button>
          )}
        </div>
      </header>

      <div className="relative z-10 min-h-0 flex-1">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="hero"
              className="mac-scroll flex h-full flex-col px-4"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-1 flex-col items-center justify-center pb-3 pt-4 text-center">
                <Orb reduceMotion={reduceMotion} />
                <h1 className="kushgpt-title mt-6 text-[28px] font-semibold tracking-[-0.04em]">
                  Ask anything about Kush
                </h1>
                <p className="mt-2 max-w-[300px] text-[12.5px] leading-relaxed text-white/48">
                  Projects, internships, skills, and how to reach him — grounded in his own story.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pb-3">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s.q}
                    type="button"
                    disabled={busy}
                    onClick={() => void send(s.q)}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 + i * 0.07, duration: 0.4 }}
                    whileHover={reduceMotion ? undefined : { y: -2 }}
                    className="kushgpt-prompt group cursor-default rounded-[16px] px-3 py-2.5 text-left disabled:opacity-40"
                  >
                    <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/30">
                      {s.kicker}
                    </div>
                    <div className="mt-1 text-[13px] font-medium tracking-[-0.015em] text-white/92">
                      {s.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="thread"
              className="mac-scroll h-full space-y-3.5 px-4 py-3"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {msgs
                .filter((m) => m.id !== "welcome")
                .map((m) => (
                  <motion.div
                    key={m.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className={m.role === "user" ? "flex justify-end" : "flex items-end gap-2"}
                  >
                    {m.role === "assistant" && (
                      <UserAvatar size={24} className="mb-0.5 ring-1 ring-white/12" />
                    )}
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[84%] whitespace-pre-wrap rounded-[20px] rounded-br-[7px] bg-mac-accent px-3.5 py-2.5 text-[13px] leading-[1.5] text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
                          : "kushgpt-reply max-w-[86%] rounded-[20px] rounded-bl-[7px] px-3.5 py-2.5"
                      }
                    >
                      {m.role === "assistant" ? (
                        <FormattedText text={m.text} />
                      ) : (
                        m.text
                      )}
                    </div>
                  </motion.div>
                ))}
              {busy && <ThinkingDots />}
              <div ref={endRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form
        className="relative z-10 px-3 pb-3.5 pt-1"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <div
          className={`kushgpt-composer flex items-center gap-2 rounded-[22px] py-1.5 pl-4 pr-1.5 transition-[box-shadow] ${
            focused ? "kushgpt-composer-on" : ""
          }`}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={busy}
            placeholder="Ask about work, projects, or how to reach him…"
            className="min-w-0 flex-1 border-0 bg-transparent py-2 text-[13px] outline-none placeholder:text-white/32 disabled:opacity-50"
          />
          <motion.button
            type="submit"
            disabled={busy || !input.trim()}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            className="flex h-9 w-9 shrink-0 cursor-default items-center justify-center rounded-full bg-white text-black shadow-[0_6px_16px_rgba(255,255,255,0.12)] disabled:opacity-28"
            aria-label="Send"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
              <path
                d="M8 12.5V3.5M8 3.5L4.2 7.2M8 3.5l3.8 3.7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>
      </form>
    </div>
  );
}

function Orb({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative h-[108px] w-[108px]">
      {!reduceMotion && (
        <>
          <div className="kushgpt-orb-glow absolute inset-2 rounded-full" />
          <div className="kushgpt-ring absolute inset-0 rounded-full" />
          <div className="kushgpt-orbit absolute inset-0">
            <span className="kushgpt-spark" />
          </div>
          <div className="kushgpt-orbit kushgpt-orbit-rev absolute inset-0">
            <span className="kushgpt-spark kushgpt-spark-soft" />
          </div>
        </>
      )}
      <div className="absolute inset-[10px] overflow-hidden rounded-full bg-[#16161a] shadow-[0_0_48px_rgba(10,132,255,0.38)] ring-1 ring-white/25">
        <UserAvatar size={88} className="h-full w-full" />
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-end gap-2">
      <UserAvatar size={24} className="mb-0.5 ring-1 ring-white/12" />
      <div className="kushgpt-reply flex items-center gap-2 rounded-[18px] rounded-bl-[7px] px-3.5 py-2.5">
        <span className="text-[12px] text-white/45">Writing</span>
        <span className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="kushgpt-dot h-1.5 w-1.5 rounded-full bg-white/75"
              style={{ animationDelay: `${i * 0.14}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
