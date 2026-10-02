"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { officialProfiles } from "@/lib/identity";
import { UserAvatar } from "@/components/icons/UserAvatar";

const BOOKMARKS = [
  { title: "About", url: "/about-kush-gangwal", hint: "Identity" },
  { title: "Resume", url: content.about.links.resume, hint: "PDF" },
  ...officialProfiles.map((profile) => ({
    title: profile.label,
    url: profile.href,
    hint: profile.handle.split("/").at(-1) ?? profile.label,
  })),
  {
    title: "Potato Bazaar",
    url: "https://potatobazaar.com",
    hint: "Live",
  },
];

export function SafariApp() {
  const [url, setUrl] = useState("https://kushgangwal.local/start");
  const [active, setActive] = useState(BOOKMARKS[0]);

  return (
    <div className="flex h-full flex-col bg-[#1c1c1e] text-[13px]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#2c2c2e] px-3 py-2">
        <div className="flex gap-1">
          <NavChevron dir="left" />
          <NavChevron dir="right" />
        </div>
        <form
          className="flex-1"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="select-text w-full rounded-lg border border-white/10 bg-black/30 px-3 py-1 text-center text-[12px] outline-none focus:border-white/25"
          />
        </form>
      </div>

      <div className="mac-scroll flex-1 p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-1 text-3xl font-semibold tracking-tight">
            Favorites
          </h1>
          <div className="mb-8 flex items-center gap-4">
            <UserAvatar size={56} className="ring-1 ring-white/15 shadow-md" />
            <p className="text-white/50">
              {content.about.name} · {content.about.role}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {BOOKMARKS.map((b) => (
              <a
                key={b.title}
                href={b.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  setActive(b);
                  setUrl(b.url);
                }}
                className="group flex cursor-default flex-col items-center gap-2"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-[18px] text-xl font-bold shadow-lg transition ${
                    active.title === b.title
                      ? "ring-2 ring-mac-accent"
                      : "group-hover:scale-105"
                  }`}
                  style={{
                    background:
                      "linear-gradient(145deg,#5ac8fa,#007aff 55%,#5856d6)",
                  }}
                >
                  {b.title.charAt(0)}
                </div>
                <div className="text-center">
                  <div className="font-medium">{b.title}</div>
                  <div className="text-[11px] text-white/40">{b.hint}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <UserAvatar size={52} className="ring-1 ring-white/15" />
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Contact
              </div>
              <p className="leading-relaxed text-white/75">
                {content.about.email}
                <br />
                {content.about.phone}
                <br />
                {content.about.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavChevron({ dir }: { dir: "left" | "right" }) {
  return (
    <button
      type="button"
      className="flex h-7 w-8 cursor-default items-center justify-center rounded-md bg-white/8 text-white/60"
      aria-label={dir}
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  );
}
