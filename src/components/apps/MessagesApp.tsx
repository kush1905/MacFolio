"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { content } from "@/lib/content";
import { useOSStore } from "@/store/osStore";
import { UserAvatar } from "@/components/icons/UserAvatar";
import type { ContactMessage } from "@/types";

const about = content.about;
const phoneDigits = about.phone.replace(/\D/g, "");
const telHref = phoneDigits.length === 10 ? `tel:+91${phoneDigits}` : `tel:${phoneDigits}`;
const waHref =
  phoneDigits.length === 10
    ? `https://wa.me/91${phoneDigits}`
    : `https://wa.me/${phoneDigits}`;
const prettyPhone =
  phoneDigits.length === 10
    ? `+91 ${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}`
    : about.phone;

type Channel = {
  id: string;
  label: string;
  detail: string;
  href: string;
  external?: boolean;
};

function contactChannels(): Channel[] {
  const extraGithub = (about.githubAccounts ?? [])
    .filter((a) => !about.links.github.toLowerCase().includes(a.login.toLowerCase()))
    .map((a) => ({
      id: `github-${a.login}`,
      label: "GitHub",
      detail: a.login,
      href: `https://github.com/${a.login}`,
      external: true,
    }));

  const instagram = about.links.instagram?.trim();
  const x = about.links.x?.trim();
  const peerlist = about.links.peerlist?.trim();

  return [
    {
      id: "email",
      label: "Email",
      detail: about.email,
      href: `mailto:${about.email}`,
    },
    ...(about.emailAlt
      ? [
          {
            id: "email-alt",
            label: "Email",
            detail: about.emailAlt,
            href: `mailto:${about.emailAlt}`,
          },
        ]
      : []),
    {
      id: "phone",
      label: "Phone",
      detail: prettyPhone,
      href: telHref,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      detail: prettyPhone,
      href: waHref,
      external: true,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      detail: "kush-gangwal",
      href: about.links.linkedin,
      external: true,
    },
    {
      id: "github",
      label: "GitHub",
      detail: "kush1905",
      href: about.links.github,
      external: true,
    },
    ...extraGithub,
    ...(instagram
      ? [
          {
            id: "instagram",
            label: "Instagram",
            detail: instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, ""),
            href: instagram,
            external: true,
          },
        ]
      : []),
    ...(x
      ? [
          {
            id: "x",
            label: "X",
            detail: x.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//, "").replace(/\/$/, ""),
            href: x,
            external: true,
          },
        ]
      : []),
    ...(peerlist
      ? [
          {
            id: "peerlist",
            label: "Peerlist",
            detail: peerlist.replace(/^https?:\/\/(www\.)?peerlist\.io\//, "").replace(/\/$/, ""),
            href: peerlist,
            external: true,
          },
        ]
      : []),
    {
      id: "resume",
      label: "Resume",
      detail: "PDF",
      href: about.links.resume,
      external: true,
    },
    {
      id: "web",
      label: "Portfolio",
      detail: "potatobazaar.com",
      href: about.links.portfolio,
      external: true,
    },
  ];
}

export function MessagesApp() {
  const addMessage = useOSStore((s) => s.addMessage);
  const setMessages = useOSStore((s) => s.setMessages);
  const messages = useOSStore((s) => s.messages);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [source, setSource] = useState<"postgres" | "local" | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const channels = useMemo(() => contactChannels(), []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await apiFetch("/api/messages");
        const data = (await res.json()) as {
          source?: string;
          messages?: ContactMessage[];
        };
        if (cancelled) return;
        if (data.source === "postgres" && Array.isArray(data.messages)) {
          setMessages(data.messages);
          setSource("postgres");
        } else {
          setSource("local");
        }
      } catch {
        if (!cancelled) setSource("local");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setMessages]);

  const copy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* ignore */
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !body.trim() || sending) return;
    setSending(true);
    const payload = {
      name: name.trim(),
      email: email.trim(),
      message: body.trim(),
    };
    try {
      const res = await apiFetch("/api/messages", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        source?: string;
        message?: ContactMessage;
        error?: string;
      };
      if (data.message) {
        addMessage(data.message);
        setSource(data.source === "postgres" ? "postgres" : "local");
      } else {
        addMessage(payload);
        setSource("local");
      }
      setName("");
      setEmail("");
      setBody("");
      setSent(true);
      window.setTimeout(() => setSent(false), 2500);
    } catch {
      addMessage(payload);
      setSource("local");
      setName("");
      setEmail("");
      setBody("");
      setSent(true);
      window.setTimeout(() => setSent(false), 2500);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full text-[13px]">
      <aside className="w-[240px] shrink-0 border-r border-white/10 bg-black/25 pt-10">
        <div className="border-b border-white/10 px-4 py-2 font-semibold">
          Messages
        </div>
        <div className="px-2 py-2">
          <div className="flex cursor-default items-center gap-3 rounded-lg bg-mac-accent/25 px-2 py-2">
            <UserAvatar size={36} className="ring-1 ring-white/15" />
            <div>
              <div className="font-medium">{about.name}</div>
              <div className="text-[11px] text-white/45">iMessage · Portfolio</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-[#1c1c1e]">
        <div className="border-b border-white/10 px-4 py-2 text-center font-medium">
          {about.name}
        </div>

        <div className="mac-scroll flex-1 space-y-3 p-4">
          <Bubble from="them">
            Hey! I&apos;m Kush — {about.role} at SK Groups. Tap a channel below
            to reach me, or leave a note in this thread.
          </Bubble>

          <div className="max-w-[min(100%,420px)] overflow-hidden rounded-[20px] bg-[#2c2c2e] ring-1 ring-white/8">
            <div className="flex items-center gap-3 px-3.5 py-3">
              <UserAvatar size={44} className="ring-1 ring-white/15" />
              <div className="min-w-0">
                <div className="font-semibold tracking-[-0.015em]">{about.name}</div>
                <div className="truncate text-[11px] text-white/45">{about.tagline}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-white/8">
              {channels.map((c) => (
                <a
                  key={c.id}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noreferrer" : undefined}
                  className="flex items-center gap-2.5 bg-[#2c2c2e] px-3.5 py-2.5 hover:bg-white/[0.06]"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    void copy(c.id, c.detail);
                  }}
                >
                  <ChannelIcon id={c.id} />
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-white/50">
                      {copied === c.id ? "Copied" : c.label}
                    </div>
                    <div className="truncate text-[12.5px] text-white/90">{c.detail}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <Bubble from="them">
            Email {about.email}
            {about.emailAlt ? ` or ${about.emailAlt}` : ""} · Phone {prettyPhone}.
            Right-click a channel to copy. Drop a message anytime — it&apos;s saved
            in Postgres when the backend is up.
          </Bubble>

          {messages.map((m) => (
            <div key={m.id} className="space-y-1">
              <Bubble from="me">
                <strong>{m.name}</strong> · {m.email}
                {"\n"}
                {m.message}
              </Bubble>
            </div>
          ))}

          {sent && (
            <div className="text-center text-[11px] text-white/40">
              {source === "postgres" ? "Delivered · saved" : "Delivered · saved locally"}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => void submit(e)}
          className="space-y-2 border-t border-white/10 p-3"
        >
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="select-text flex-1 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 outline-none placeholder:text-white/35 focus:border-mac-accent"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="select-text flex-1 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 outline-none placeholder:text-white/35 focus:border-mac-accent"
            />
          </div>
          <div className="flex gap-2">
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="iMessage"
              className="select-text flex-1 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 outline-none placeholder:text-white/35 focus:border-mac-accent"
            />
            <button
              type="submit"
              disabled={sending}
              className="cursor-default rounded-full bg-mac-accent px-4 py-1.5 font-medium text-white hover:bg-mac-accent/90 disabled:opacity-50"
            >
              {sending ? "Sending" : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Bubble({
  from,
  children,
}: {
  from: "me" | "them";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`max-w-[75%] whitespace-pre-wrap rounded-[18px] px-3.5 py-2 leading-relaxed ${
        from === "me"
          ? "ml-auto bg-mac-accent text-white"
          : "bg-[#3a3a3c] text-white"
      }`}
    >
      {children}
    </div>
  );
}

function ChannelIcon({ id }: { id: string }) {
  const common = "h-[18px] w-[18px] shrink-0 text-mac-accent";
  if (id === "email" || id.startsWith("email-")) {
    return (
      <svg viewBox="0 0 18 18" className={common}>
        <rect x="2" y="4" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 5.2L9 10l6-4.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === "phone") {
    return (
      <svg viewBox="0 0 18 18" className={common}>
        <path
          d="M5.2 2.8h2.1l1 2.4-1.3 1.3a9 9 0 0 0 4.5 4.5l1.3-1.3 2.4 1v2.1c0 .6-.5 1.2-1.2 1.2A12.2 12.2 0 0 1 2.8 4c0-.7.6-1.2 1.2-1.2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (id === "whatsapp") {
    return (
      <svg viewBox="0 0 18 18" className={common}>
        <path
          d="M9 2.6A6.4 6.4 0 0 0 3.4 12L2.6 15.4 6.1 14.6A6.4 6.4 0 1 0 9 2.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <path
          d="M6.4 7.4c.2 1.8 2.3 3.8 4.1 4.1.4 0 .8-.1 1-.5l.5-1.1-.9-.5c-.2-.1-.4 0-.6.1-.4.3-.9.5-1.1.2-1-.7-1.6-1.5-2-2.3-.1-.3 0-.7.3-1 .2-.2.2-.4.1-.6L6.8 6.2 5.7 6.7c-.4.2-.5.6-.5.9Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (id === "linkedin") {
    return (
      <svg viewBox="0 0 18 18" className={common}>
        <rect x="2.4" y="2.4" width="13.2" height="13.2" rx="2" fill="none" stroke="currentColor" strokeWidth="1.35" />
        <path d="M6 8.2V13M6 5.6h.01M9.2 13V9.4c0-1.2.8-1.6 1.5-1.6s1.5.5 1.5 1.6V13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (id.startsWith("github")) {
    return (
      <svg viewBox="0 0 18 18" className={common}>
        <path
          d="M9 2.5c-3.6 0-6.5 2.9-6.5 6.5 0 2.9 1.9 5.3 4.5 6.2.3.05.4-.14.4-.3v-1.1c-1.8.4-2.2-.8-2.2-.8-.3-.7-.7-.9-.7-.9-.6-.4.05-.4.05-.4.7.05 1 .7 1 .7.6 1 1.5.7 1.9.55.05-.4.2-.7.4-.9-1.5-.15-3-.7-3-3.2 0-.7.25-1.3.7-1.75-.05-.2-.3-.9.1-1.85 0 0 .55-.2 1.85.7a6.3 6.3 0 0 1 3.4 0c1.3-.9 1.85-.7 1.85-.7.4.95.15 1.66.1 1.85.45.45.7 1.05.7 1.75 0 2.5-1.55 3.05-3 3.2.2.2.4.55.4 1.15v1.7c0 .16.1.36.4.3A6.52 6.52 0 0 0 15.5 9c0-3.6-2.9-6.5-6.5-6.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (id === "instagram") {
    return (
      <svg viewBox="0 0 18 18" className={common}>
        <rect x="3" y="3" width="12" height="12" rx="3.2" fill="none" stroke="currentColor" strokeWidth="1.35" />
        <circle cx="9" cy="9" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.35" />
        <circle cx="12.4" cy="5.6" r="0.7" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 18 18" className={common}>
      <path
        d="M7 5.2h6.2A1.6 1.6 0 0 1 14.8 6.8v7A1.6 1.6 0 0 1 13.2 15.4H6.8A1.6 1.6 0 0 1 5.2 13.8V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M5.2 8V4.2A1.2 1.2 0 0 1 6.4 3h4.2L13 5.4V6" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
    </svg>
  );
}
