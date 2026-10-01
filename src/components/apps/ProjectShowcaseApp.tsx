"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { content } from "@/lib/content";
import { useOSStore } from "@/store/osStore";
import type { Project } from "@/lib/content";

const ACCENT: Record<string, string> = {
  macfolio: "#7aa2ff",
  "potato-bazaar": "#f5c16c",
  "tybee-go": "#5ee0d0",
  findanio: "#c084fc",
  nexus: "#86efac",
};

function coverOf(p: Project) {
  return "cover" in p && typeof p.cover === "string" ? p.cover : "";
}

function accentOf(p: Project) {
  return ACCENT[p.id] ?? "#7aa2ff";
}

export function ProjectShowcaseApp() {
  const projects = content.projects;
  const reduceMotion = useOSStore((s) => s.preferences.reduceMotion);
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const featuredId = hoveredId ?? activeId;
  const featured = projects.find((p) => p.id === featuredId) ?? projects[0];

  useEffect(() => {
    if (reduceMotion || paused || openId || hoveredId) return;
    const id = window.setInterval(() => {
      setActiveId((cur) => {
        const i = projects.findIndex((p) => p.id === cur);
        return projects[(i + 1) % projects.length]?.id ?? cur;
      });
    }, 5200);
    return () => window.clearInterval(id);
  }, [hoveredId, openId, paused, projects, reduceMotion]);

  if (!featured) return null;

  return (
    <div
      className="projects-app relative flex h-full flex-col overflow-hidden text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setHoveredId(null);
      }}
    >
      <Aurora accent={accentOf(featured)} />

      <header className="relative z-20 flex items-end justify-between px-6 pb-2 pl-[78px] pt-[14px]">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
            Now showing
          </div>
          <div className="mt-0.5 text-[22px] font-semibold tracking-[-0.04em]">Projects</div>
        </div>
        <div className="text-[12px] text-white/40">{projects.length} titles</div>
      </header>

      <div className="relative z-10 min-h-0 flex-1 px-5 pb-4">
        <Hero
          project={featured}
          playing={!reduceMotion && !openId}
          reduceMotion={reduceMotion}
          onOpen={() => setOpenId(featured.id)}
        />

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between px-1">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/40">
              Trailers
            </div>
            <div className="text-[11px] text-white/30">Hover to preview · click for details</div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 pt-1">
            {projects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                active={featured.id === p.id}
                reduceMotion={reduceMotion}
                onHover={() => setHoveredId(p.id)}
                onLeave={() => setHoveredId(null)}
                onOpen={() => setOpenId(p.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openId && (
          <Detail
            project={projects.find((p) => p.id === openId) ?? featured}
            reduceMotion={reduceMotion}
            onClose={() => setOpenId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Hero({
  project,
  playing,
  reduceMotion,
  onOpen,
}: {
  project: Project;
  playing: boolean;
  reduceMotion: boolean;
  onOpen: () => void;
}) {
  const accent = accentOf(project);
  return (
    <motion.div
      layout
      className="projects-hero relative overflow-hidden rounded-[22px]"
      style={{ height: "min(46vh, 340px)" }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={project.id}
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Trailer src={coverOf(project)} playing={playing} accent={accent} />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />

      <div className="relative z-10 flex h-full max-w-[58%] flex-col justify-end p-6">
        <motion.div
          key={project.id + "-copy"}
          initial={reduceMotion ? false : { y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
            Trailer
          </div>
          <h2 className="text-[32px] font-semibold leading-none tracking-[-0.045em]">{project.name}</h2>
          <p className="mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-white/72">{project.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={onOpen} className="projects-cta pointer-events-auto">
              Watch details
            </button>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className="projects-ghost pointer-events-auto">
                Live demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="projects-ghost pointer-events-auto">
                GitHub
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
  active,
  reduceMotion,
  onHover,
  onLeave,
  onOpen,
}: {
  project: Project;
  index: number;
  active: boolean;
  reduceMotion: boolean;
  onHover: () => void;
  onLeave: () => void;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 220, damping: 18 });
  const accent = accentOf(project);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      onMouseEnter={onHover}
      onMouseLeave={() => {
        onLeave();
        mx.set(0);
        my.set(0);
      }}
      onMouseMove={(e) => {
        if (reduceMotion || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -8, scale: 1.03 }}
      style={reduceMotion ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="projects-card group relative w-[210px] shrink-0 cursor-default overflow-hidden rounded-[16px] text-left"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Trailer src={coverOf(project)} playing={active && !reduceMotion} accent={accent} compact />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
        <div
          className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/90"
          style={{ background: `${accent}33`, boxShadow: `inset 0 0 0 0.5px ${accent}88` }}
        >
          {active ? "Playing" : "Preview"}
        </div>
      </div>
      <div className="px-3 py-2.5">
        <div className="truncate text-[13px] font-semibold tracking-[-0.02em]">{project.name}</div>
        <div className="truncate text-[11px] text-white/45">{project.tagline}</div>
      </div>
      {active && (
        <span
          className="pointer-events-none absolute inset-0 rounded-[16px]"
          style={{ boxShadow: `inset 0 0 0 1.5px ${accent}` }}
        />
      )}
    </motion.button>
  );
}

function Detail({
  project,
  reduceMotion,
  onClose,
}: {
  project: Project;
  reduceMotion: boolean;
  onClose: () => void;
}) {
  const accent = accentOf(project);
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-end bg-black/55 p-4 pt-10 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="projects-sheet relative w-full overflow-hidden rounded-[22px]"
        initial={reduceMotion ? false : { y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={reduceMotion ? undefined : { y: 32, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[210px] overflow-hidden">
          <Trailer src={coverOf(project)} playing={!reduceMotion} accent={accent} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-black/20 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[12px] text-white/80 backdrop-blur"
          >
            Close
          </button>
        </div>
        <div className="px-5 pb-5 pt-4">
          <div className="text-[11px] uppercase tracking-[0.12em] text-white/35">{project.period}</div>
          <div className="text-[26px] font-semibold tracking-[-0.04em]">{project.name}</div>
          <div className="mt-1 text-[13px]" style={{ color: accent }}>
            {project.tagline}
          </div>
          <p className="mt-3 max-w-[70ch] text-[13px] leading-relaxed text-white/68">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span key={t} className="projects-chip">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="projects-cta">
                GitHub
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className="projects-ghost">
                Live demo
              </a>
            )}
            {"playStore" in project && project.playStore && (
              <a href={project.playStore} target="_blank" rel="noreferrer" className="projects-ghost">
                Play Store
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Trailer({
  src,
  playing,
  accent,
  compact,
}: {
  src: string;
  playing: boolean;
  accent: string;
  compact?: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {src ? (
        <motion.img
          src={src}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          animate={
            playing
              ? { scale: [1.12, 1.22, 1.12], x: ["0%", "-3%", "1%", "0%"], y: ["0%", "-2%", "0%"] }
              : { scale: 1.08, x: "0%", y: "0%" }
          }
          transition={
            playing
              ? { duration: compact ? 10 : 16, repeat: Infinity, ease: "linear" }
              : { duration: 0.6 }
          }
        />
      ) : (
        <div className="h-full w-full" style={{ background: accent }} />
      )}
      <div className="projects-grain pointer-events-none absolute inset-0" />
      {playing && <div className="projects-sweep pointer-events-none absolute inset-0" />}
      {playing && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
          <motion.div
            className="h-full"
            style={{ background: accent }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: compact ? 5 : 5.2, ease: "linear", repeat: Infinity }}
          />
        </div>
      )}
    </div>
  );
}

function Aurora({ accent }: { accent: string }) {
  const glow = useMemo(() => accent, [accent]);
  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute -left-24 -top-24 h-72 w-72 rounded-full blur-[90px]"
        style={{ background: glow }}
        animate={{ opacity: [0.18, 0.32, 0.18], scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-[#0c0c10]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_480px_at_80%_-10%,rgba(255,255,255,0.07),transparent_60%)]" />
    </div>
  );
}
