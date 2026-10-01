"use client";

import { useMemo, useState } from "react";
import { content } from "@/lib/content";

type NoteId = "journey" | "experience" | "education" | "achievements";

export function NotesApp() {
  const edu = content.experience.education;
  const notes = useMemo(
    () => [
      {
        id: "journey" as const,
        title: "Journey",
        date: "2022 – 2026",
        preview: content.experience.journey[0]?.body ?? "",
      },
      {
        id: "experience" as const,
        title: "Experience",
        date: content.experience.experience[0]?.duration ?? "",
        preview: `${content.experience.experience[0]?.company} · ${content.experience.experience[0]?.role}`,
      },
      {
        id: "education" as const,
        title: "Education",
        date: edu.duration,
        preview: edu.school,
      },
      {
        id: "achievements" as const,
        title: "Achievements",
        date: "Pinned",
        preview: content.experience.achievements[0] ?? "",
      },
    ],
    [edu.duration, edu.school],
  );

  const [activeId, setActiveId] = useState<NoteId>("journey");
  const [query, setQuery] = useState("");
  const active = notes.find((n) => n.id === activeId) ?? notes[0];

  const filtered = notes.filter((n) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return n.title.toLowerCase().includes(q) || n.preview.toLowerCase().includes(q);
  });

  return (
    <div className="flex h-full text-[13px] text-white/90">
      <aside className="finder-sidebar flex w-[260px] shrink-0 flex-col border-r border-white/[0.06] pt-11">
        <div className="px-3 pb-2">
          <div className="relative">
            <svg
              viewBox="0 0 16 16"
              className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/35"
            >
              <circle cx="6.5" cy="6.5" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M9.6 9.6L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="h-[28px] w-full rounded-[7px] border-0 bg-white/[0.08] pl-8 pr-3 text-[12px] text-white/90 outline-none placeholder:text-white/35 focus:bg-white/[0.12]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-1 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/45">
            <NotesFolderIcon />
            iCloud
          </div>
          <span className="text-[11px] tabular-nums text-white/30">{filtered.length}</span>
        </div>

        <div className="mac-scroll min-h-0 flex-1 px-2 pb-3">
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-[12px] text-white/35">
              No matching notes
            </div>
          )}
          {filtered.map((n) => {
            const selected = activeId === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setActiveId(n.id)}
                className={`mb-[3px] w-full cursor-default rounded-[8px] px-3 py-[9px] text-left transition-colors ${
                  selected ? "bg-white/[0.12]" : "hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="truncate text-[13px] font-semibold tracking-[-0.016em]">
                    {n.title}
                  </div>
                  <div className="shrink-0 text-[11px] text-white/35">{n.date}</div>
                </div>
                <div className="mt-[3px] line-clamp-2 text-[11px] leading-[1.35] text-white/40">
                  {n.preview}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-[#1c1c1e]">
        <div className="flex h-11 shrink-0 items-center justify-between px-6">
          <span className="text-[11px] text-white/30">Notes</span>
          <span className="text-[11px] text-white/30">{active.date}</span>
        </div>

        <div className="mac-scroll min-h-0 flex-1 px-8 pb-12 pt-2">
          <h1 className="mb-7 text-[32px] font-bold leading-none tracking-[-0.035em] text-white">
            {active.title}
          </h1>
          {activeId === "journey" && <JourneyNote />}
          {activeId === "experience" && <ExperienceNote />}
          {activeId === "education" && <EducationNote />}
          {activeId === "achievements" && <AchievementsNote />}
        </div>
      </div>
    </div>
  );
}

function JourneyNote() {
  const items = content.experience.journey;
  return (
    <div className="relative max-w-[580px]">
      {items.map((j, i) => (
        <div key={`${j.year}-${j.title}`} className="relative flex gap-[14px] pb-8 last:pb-0">
          {i < items.length - 1 && (
            <div className="absolute left-[13px] top-[30px] bottom-0 w-px bg-white/[0.1]" />
          )}
          <div className="relative z-10 mt-0.5 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-[10px] font-semibold tabular-nums text-white/70 ring-1 ring-white/10">
            {j.year.slice(2)}
          </div>
          <div className="min-w-0 pt-0.5">
            <div className="text-[11px] font-medium tabular-nums text-white/40">{j.year}</div>
            <h2 className="mt-1 text-[15px] font-semibold leading-snug tracking-[-0.018em] text-white">
              {j.title}
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-[1.58] text-white/62">{j.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceNote() {
  return (
    <div className="flex max-w-[600px] flex-col gap-3">
      {content.experience.experience.map((job) => (
        <article
          key={`${job.company}-${job.role}`}
          className="rounded-[12px] bg-white/[0.045] px-[18px] py-4 ring-1 ring-white/[0.06]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold tracking-[-0.018em] text-white">
                {job.role}
              </h2>
              <div className="mt-0.5 text-[13px] text-white/55">{job.company}</div>
            </div>
            <span className="shrink-0 rounded-full bg-white/[0.08] px-2 py-[3px] text-[10px] font-medium text-white/50">
              {job.type}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-white/35">{job.duration}</div>
          {job.skillSet.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.skillSet.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/[0.08] px-2 py-[3px] text-[11px] text-white/70"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          <ul className="mt-3 space-y-[7px]">
            {job.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-[13px] leading-[1.5] text-white/68">
                <span className="mt-[8px] h-[5px] w-[5px] shrink-0 rounded-full bg-white/35" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function EducationNote() {
  const edu = content.experience.education;
  return (
    <div className="max-w-[520px] rounded-[14px] bg-white/[0.045] px-5 py-5 ring-1 ring-white/[0.06]">
      <div className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/35">
        University
      </div>
      <h2 className="mt-1.5 text-[20px] font-semibold tracking-[-0.022em] text-white">
        {edu.school}
      </h2>
      <p className="mt-1 text-[14px] text-white/60">{edu.degree}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Chip>{edu.cgpa}</Chip>
        <Chip>{edu.duration}</Chip>
        <Chip>{edu.location}</Chip>
      </div>
    </div>
  );
}

function AchievementsNote() {
  return (
    <div className="max-w-[540px] divide-y divide-white/[0.06] overflow-hidden rounded-[14px] bg-white/[0.045] ring-1 ring-white/[0.06]">
      {content.experience.achievements.map((a) => (
        <div key={a} className="flex items-start gap-3 px-4 py-3">
          <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-white/[0.12] text-white/80">
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
              <path
                d="M2.2 6.2l2.4 2.4 5.2-5.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="text-[14px] leading-snug text-white/82">{a}</p>
        </div>
      ))}
    </div>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[12px] text-white/70">
      {children}
    </span>
  );
}

function NotesFolderIcon() {
  return (
    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 fill-current">
      <path d="M1.4 3.2A1.6 1.6 0 0 1 3 1.6h2.1c.4 0 .7.16 1 .44l.6.62c.2.2.5.34.8.34H11a1.6 1.6 0 0 1 1.6 1.6v6.2A1.6 1.6 0 0 1 11 12.4H3A1.6 1.6 0 0 1 1.4 10.8V3.2Z" />
    </svg>
  );
}
