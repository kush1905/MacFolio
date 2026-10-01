"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { APPS } from "@/lib/apps";
import { content } from "@/lib/content";
import { useOSStore } from "@/store/osStore";
import type { AppId } from "@/types";

type ContributionDay = { date: string; count: number; level: number };
type ContributionAccount = {
  login: string;
  total: number;
  today: number;
  week: number;
  streak: number;
  days: ContributionDay[];
  error: string | null;
};
type ContribPayload = {
  accounts: ContributionAccount[];
  combined: {
    days: ContributionDay[];
    total: number;
    today: number;
    week: number;
    streak: number;
  };
};

type Tab = "Overview" | "Portfolio" | "GitHub";

type AnalyticsSummary = {
  visitors: number;
  events: Record<string, number>;
  topApps: { appId: string; opens: number }[];
};

type GhUser = {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  avatar_url: string;
  bio: string | null;
  created_at: string;
};

type GhRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
  fork: boolean;
  owner: { login: string };
};

type AccountBundle = {
  login: string;
  label: string;
  user: GhUser | null;
  repos: GhRepo[];
  error: string | null;
};

const ACCOUNTS =
  content.about.githubAccounts ??
  ([
    { login: "kush1905", label: "Personal" },
    { login: "Kush-PB", label: "Potato Bazaar" },
  ] as const);

const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Swift: "#fa7343",
  Kotlin: "#a97bff",
  Go: "#00add8",
  Rust: "#dea584",
  Dart: "#00b4ab",
  Shell: "#89e051",
  Ruby: "#701516",
  PHP: "#4f5d95",
  C: "#555555",
  "C++": "#f34b7d",
};

const SKILL_KIND: Record<string, string> = {
  Languages: "Runtime",
  Frontend: "UI",
  Mobile: "UI",
  Backend: "Service",
  Databases: "Storage",
  Concepts: "System",
  Cloud: "Network",
  AI: "Compute",
  Tools: "Utility",
};

async function fetchAccount(login: string, label: string): Promise<AccountBundle> {
  try {
    const [uRes, rRes] = await Promise.all([
      fetch(`https://api.github.com/users/${login}`),
      fetch(
        `https://api.github.com/users/${login}/repos?sort=updated&per_page=30&type=owner`,
      ),
    ]);
    if (uRes.status === 404) {
      return { login, label, user: null, repos: [], error: `GitHub user “${login}” not found` };
    }
    if (!uRes.ok) {
      return { login, label, user: null, repos: [], error: `GitHub API ${uRes.status} for ${login}` };
    }
    const user = (await uRes.json()) as GhUser;
    const repos = rRes.ok ? ((await rRes.json()) as GhRepo[]) : [];
    return {
      login: user.login,
      label,
      user,
      repos: Array.isArray(repos) ? repos.filter((r) => !r.fork) : [],
      error: rRes.ok ? null : `Repos unavailable (${rRes.status})`,
    };
  } catch {
    return { login, label, user: null, repos: [], error: "Network error talking to GitHub" };
  }
}

function languageBreakdown(repos: GhRepo[]) {
  const counts: Record<string, number> = {};
  for (const r of repos) {
    if (!r.language) continue;
    counts[r.language] = (counts[r.language] ?? 0) + 1;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / total) * 100),
      color: LANG_COLOR[name] ?? "#8e8e93",
    }))
    .sort((a, b) => b.count - a.count);
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function langColor(name: string | null) {
  if (!name) return "#8e8e93";
  return LANG_COLOR[name] ?? "#8e8e93";
}

const REPO_BLURB: Record<string, string> = Object.fromEntries(
  Object.entries(content.githubRepos).flatMap(([name, blurb]) => [
    [name, blurb],
    [name.toLowerCase(), blurb],
  ]),
);

function repoBlurb(r: { name: string; description: string | null }) {
  const live = r.description?.trim();
  if (live) return live;
  return REPO_BLURB[r.name] ?? REPO_BLURB[r.name.toLowerCase()] ?? "No description";
}

function seedLoad(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const base = 42 + Math.sin(i / 3.1) * 16 + Math.sin(i / 7.4) * 11;
    return Math.max(14, Math.min(88, base + ((i * 13) % 8) - 3));
  });
}

function nextLoad(prev: number) {
  const walk = prev + (Math.random() * 14 - 7);
  return Math.max(16, Math.min(90, walk));
}

export function ActivityMonitorApp() {
  const reduceMotion = useOSStore((s) => s.preferences.reduceMotion);
  const [tab, setTab] = useState<Tab>("Overview");
  const [query, setQuery] = useState("");
  const [accounts, setAccounts] = useState<AccountBundle[]>([]);
  const [loadingGh, setLoadingGh] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [contrib, setContrib] = useState<ContribPayload | null>(null);
  const [loadingContrib, setLoadingContrib] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [load, setLoad] = useState(() => seedLoad(48));

  useEffect(() => {
    let cancelled = false;
    setLoadingGh(true);
    void (async () => {
      const results = await Promise.all(ACCOUNTS.map((a) => fetchAccount(a.login, a.label)));
      if (!cancelled) {
        setAccounts(results);
        setLoadingGh(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await apiFetch("/api/analytics");
        const data = (await res.json()) as {
          source?: string;
          summary?: AnalyticsSummary | null;
        };
        if (!cancelled && data.source === "postgres" && data.summary) {
          setAnalytics(data.summary);
        }
      } catch {
        // Analytics stay hidden when the database is down.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingContrib(true);
    void (async () => {
      try {
        const res = await fetch("/api/github/contributions");
        const data = (await res.json()) as ContribPayload;
        if (!cancelled && data?.combined) setContrib(data);
      } catch {
        // Graph stays empty if GitHub is unreachable.
      } finally {
        if (!cancelled) setLoadingContrib(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setLoad((p) => [...p.slice(1), nextLoad(p[p.length - 1] ?? 40)]);
    }, 320);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const allRepos = useMemo(() => accounts.flatMap((a) => a.repos), [accounts]);
  const languages = useMemo(() => languageBreakdown(allRepos), [allRepos]);
  const totalStars = allRepos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalFollowers = accounts.reduce((s, a) => s + (a.user?.followers ?? 0), 0);
  const totalPublicRepos = accounts.reduce((s, a) => s + (a.user?.public_repos ?? 0), 0);
  const livePct = Math.round(load[load.length - 1] ?? 40);

  const { stats, projects, skills, experience, kushgpt } = content;
  const skillGroups = [
    { name: "Languages", items: skills.languages },
    { name: "Frontend", items: skills.frontend },
    { name: "Mobile", items: skills.mobile },
    { name: "Backend", items: skills.backend },
    { name: "Databases", items: skills.databases },
    { name: "Concepts", items: skills.concepts ?? [] },
    { name: "Cloud", items: skills.cloud },
    { name: "AI", items: skills.ai },
    { name: "Tools", items: skills.tools },
  ].filter((g) => g.items.length > 0);
  const skillTotal = skillGroups.reduce((s, g) => s + g.items.length, 0) || 1;

  const q = query.trim().toLowerCase();
  const shownProjects = projects.filter((p) => {
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.tech.some((t) => t.toLowerCase().includes(q))
    );
  });
  const shownRepos = allRepos.filter((r) => {
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      repoBlurb(r).toLowerCase().includes(q) ||
      (r.language ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="activity-app flex h-full flex-col text-[12px] text-white/90">
      <header className="activity-toolbar relative z-20 flex items-center gap-3 px-3 pb-2.5 pl-[76px] pt-[11px]">
        <div
          className="activity-seg relative"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {(["Overview", "Portfolio", "GitHub"] as const).map((t) => (
            <button
              key={t}
              type="button"
              data-on={tab === t || undefined}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                setTab(t);
                setQuery("");
                setSelected(null);
              }}
              className="cursor-default"
            >
              {t}
            </button>
          ))}
        </div>
        <div
          className="relative ml-auto w-[180px]"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <svg
            viewBox="0 0 16 16"
            className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-white/35"
          >
            <circle cx="6.5" cy="6.5" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M9.6 9.6L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === "GitHub" ? "Search repos" : tab === "Portfolio" ? "Search work" : "Filter"}
            className="h-[26px] w-full rounded-[7px] border-0 bg-white/[0.08] pl-7 pr-2 text-[11px] text-white/90 outline-none placeholder:text-white/35 focus:bg-white/[0.12]"
          />
        </div>
        <div className="pointer-events-none flex items-center gap-1.5 pr-1 text-[11px] text-white/45">
          <span className={`h-1.5 w-1.5 rounded-full bg-[#30d158] ${reduceMotion ? "" : "activity-live"}`} />
          {livePct}% CPU
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="mac-scroll absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "Overview" && (
              <OverviewPane
                stats={stats}
                projects={projects}
                skillGroups={skillGroups}
                skillTotal={skillTotal}
                languages={languages}
                loadingGh={loadingGh}
                accounts={accounts}
                totalPublicRepos={totalPublicRepos}
                totalStars={totalStars}
                totalFollowers={totalFollowers}
                load={load}
                livePct={livePct}
                analytics={analytics}
                selected={selected}
                onSelect={setSelected}
                kushgpt={kushgpt}
              />
            )}
            {tab === "Portfolio" && (
              <PortfolioPane
                projects={shownProjects}
                experience={experience}
                kushgpt={kushgpt}
                selected={selected}
                onSelect={setSelected}
              />
            )}
            {tab === "GitHub" && (
              <GitHubPane
                accounts={accounts}
                loading={loadingGh}
                languages={languages}
                repos={shownRepos}
                selected={selected}
                onSelect={setSelected}
                contrib={contrib}
                loadingContrib={loadingContrib}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function OverviewPane({
  stats,
  projects,
  skillGroups,
  skillTotal,
  languages,
  loadingGh,
  accounts,
  totalPublicRepos,
  totalStars,
  totalFollowers,
  load,
  livePct,
  analytics,
  selected,
  onSelect,
  kushgpt,
}: {
  stats: typeof content.stats;
  projects: typeof content.projects;
  skillGroups: { name: string; items: string[] }[];
  skillTotal: number;
  languages: ReturnType<typeof languageBreakdown>;
  loadingGh: boolean;
  accounts: AccountBundle[];
  totalPublicRepos: number;
  totalStars: number;
  totalFollowers: number;
  load: number[];
  livePct: number;
  analytics: AnalyticsSummary | null;
  selected: string | null;
  onSelect: (id: string) => void;
  kushgpt: typeof content.kushgpt;
}) {
  return (
    <div className="space-y-3 p-3 pb-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="activity-card px-3 py-3">
          <div className="mb-3 flex items-baseline justify-between">
            <div className="text-[11px] font-semibold tracking-[0.04em] text-white/45">
              SYSTEM LOAD
            </div>
            <div className="text-[11px] tabular-nums text-white/35">
              {content.about.name}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1">
            <Gauge label="Projects" value={stats.projectsCompleted} max={6} color="#0a84ff" />
            <Gauge label="Years" value={stats.yearsCoding} max={6} color="#30d158" />
            <Gauge label="CGPA" value={stats.cgpa} max={10} color="#bf5af2" digits={2} />
            <Gauge label="Interns" value={stats.internships} max={3} color="#ff9f0a" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            <ChipStat label="Hackathons" value={stats.hackathons} hint={kushgpt.achievements.hackathons.map((h) => h.name).join(" · ")} />
            <ChipStat label="Badges" value={stats.leetcodeBadges} hint={kushgpt.achievements.competitiveProgramming.platforms.join(" · ")} />
            <ChipStat label="Commits/yr" value={`~${stats.commitsThisYear.toLocaleString()}`} />
          </div>
        </div>

        <div className="activity-card overflow-hidden px-3 py-3">
          <div className="mb-2 flex items-baseline justify-between">
            <div className="text-[11px] font-semibold tracking-[0.04em] text-white/45">
              CPU HISTORY
            </div>
            <div className="text-[11px] tabular-nums text-[#30d158]">{livePct}%</div>
          </div>
          <LoadGraph values={load} color="#30d158" />
          <div className="mt-2 flex justify-between text-[10px] text-white/30">
            <span>60s</span>
            <span>Sampling every 0.3s</span>
            <span>Now</span>
          </div>
        </div>
      </div>

      <div className="activity-card overflow-hidden">
        <TableHead
          layout="cpu"
          cols={[
            { label: "Process Name" },
            { label: "Kind" },
            { label: "% CPU" },
            { label: "Threads" },
            { label: "Energy" },
          ]}
        />
        {skillGroups.map((g) => {
          const pct = (g.items.length / skillTotal) * 100;
          const id = `skill-${g.name}`;
          return (
            <ProcessRow
              key={g.name}
              layout="cpu"
              active={selected === id}
              onClick={() => onSelect(id)}
              title={g.name}
              subtitle={g.items.slice(0, 6).join(", ")}
              kind={SKILL_KIND[g.name] ?? "User"}
              cpu={pct}
              threads={g.items.length}
              energy={Math.min(100, pct * 1.4)}
            />
          );
        })}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="activity-card p-3">
          <div className="mb-2 flex items-baseline justify-between">
            <div className="text-[11px] font-semibold tracking-[0.04em] text-white/45">
              GITHUB
            </div>
            <div className="text-[11px] text-white/35">
              {loadingGh
                ? "Sampling…"
                : `${totalPublicRepos} repos · ${totalStars}★ · ${totalFollowers} followers`}
            </div>
          </div>
          <div className="space-y-2">
            {ACCOUNTS.map((meta) => {
              const a = accounts.find(
                (x) =>
                  x.login.toLowerCase() === meta.login.toLowerCase() ||
                  x.label === meta.label,
              );
              return (
                <AccountRow
                  key={meta.login}
                  label={meta.label}
                  login={meta.login}
                  loading={loadingGh}
                  bundle={a}
                />
              );
            })}
          </div>
        </div>

        <div className="activity-card p-3">
          <div className="mb-2 flex items-baseline justify-between">
            <div className="text-[11px] font-semibold tracking-[0.04em] text-white/45">
              LANGUAGE MIX
            </div>
            <div className="text-[11px] text-white/35">public repos</div>
          </div>
          {languages.length > 0 ? (
            <>
              <StackedBar parts={languages} />
              <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
                {languages.slice(0, 8).map((lang) => (
                  <div key={lang.name} className="flex items-center gap-1.5 text-[11px] text-white/70">
                    <span className="h-2 w-2 rounded-full" style={{ background: lang.color }} />
                    {lang.name}
                    <span className="tabular-nums text-white/35">{lang.pct}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-[12px] text-white/35">
              {loadingGh ? "Reading GitHub…" : "No language data yet"}
            </div>
          )}
        </div>
      </div>

      {analytics && (
        <div className="activity-card overflow-hidden">
          <div className="flex items-baseline justify-between px-3 py-2">
            <div className="text-[11px] font-semibold tracking-[0.04em] text-white/45">
              SITE ENERGY
            </div>
            <div className="text-[11px] text-white/35">{analytics.visitors} visitors</div>
          </div>
          <div className="grid grid-cols-4 gap-px border-t border-white/[0.06] bg-white/[0.04]">
            <MiniCell label="Visitors" value={analytics.visitors} />
            <MiniCell label="Visits" value={analytics.events.visit ?? 0} />
            <MiniCell label="App opens" value={analytics.events.app_open ?? 0} />
            <MiniCell
              label="Events"
              value={Object.values(analytics.events).reduce((s, n) => s + n, 0)}
            />
          </div>
          {analytics.topApps.length > 0 && (
            <div className="space-y-0 border-t border-white/[0.06]">
              {analytics.topApps.map((row) => {
                const max = analytics.topApps[0]?.opens || 1;
                const name = APPS[row.appId as AppId]?.name ?? row.appId;
                return (
                  <ProcessRow
                    key={row.appId}
                    layout="cpu"
                    active={selected === `app-${row.appId}`}
                    onClick={() => onSelect(`app-${row.appId}`)}
                    title={name}
                    subtitle="PortfolioOS"
                    kind="App"
                    cpu={(row.opens / max) * 100}
                    threads={row.opens}
                    energy={(row.opens / max) * 100}
                    energyColor="#ff9f0a"
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="px-1 text-[10px] text-white/30">
        {projects.length} projects · {skillTotal} skills · {ACCOUNTS.length} GitHub accounts
      </div>
    </div>
  );
}

function PortfolioPane({
  projects,
  experience,
  kushgpt,
  selected,
  onSelect,
}: {
  projects: typeof content.projects;
  experience: typeof content.experience;
  kushgpt: typeof content.kushgpt;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3 p-3 pb-4">
      <div className="activity-card overflow-hidden">
        <TableHead
          layout="energy"
          cols={[
            { label: "Process Name" },
            { label: "Status" },
            { label: "Uptime" },
            { label: "Threads" },
            { label: "Energy" },
          ]}
        />
        {projects.map((p) => {
          const running = /present/i.test(p.period);
          const energy = Math.min(100, 28 + p.tech.length * 14);
          return (
            <ProcessRow
              key={p.id}
              layout="energy"
              active={selected === p.id}
              onClick={() => onSelect(p.id)}
              title={p.name}
              subtitle={p.tagline}
              kind={running ? "Running" : "Idle"}
              kindTone={running ? "green" : "muted"}
              cpu={energy}
              threads={p.tech.length}
              energy={energy}
              extra={p.period}
            />
          );
        })}
      </div>

      {selected && projects.some((p) => p.id === selected) && (
        <ProjectDetail project={projects.find((p) => p.id === selected)!} />
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="activity-card p-3">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.04em] text-white/45">
            EXPERIENCE
          </div>
          <div className="relative space-y-0 pl-4">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10" />
            {experience.experience.map((e) => (
              <div key={`${e.company}-${e.role}`} className="relative py-2.5">
                <span className="absolute left-[-13px] top-[18px] h-2 w-2 rounded-full bg-mac-accent ring-4 ring-[#1c1c1e]" />
                <div className="text-[13px] font-semibold tracking-[-0.01em] text-white">
                  {e.role}
                </div>
                <div className="text-[11px] text-white/50">
                  {e.company} · {e.duration}
                </div>
                {e.skillSet.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {e.skillSet.map((s) => (
                      <span key={s} className="activity-pill">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="activity-card p-3">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.04em] text-white/45">
              EDUCATION
            </div>
            <div className="space-y-2">
              {(content.about.educationHistory ?? []).map((e) => (
                <div key={`${e.level}-${e.school}`} className="rounded-[10px] bg-white/[0.04] px-3 py-2">
                  <div className="text-[12.5px] font-semibold text-white">{e.level}</div>
                  <div className="text-[11px] text-white/50">{e.school}</div>
                  <div className="text-[11px] text-white/35">
                    {e.duration} · {e.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="activity-card p-3">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.04em] text-white/45">
              KEEP AWAKE
            </div>
            <div className="flex flex-wrap gap-1.5">
              {kushgpt.careerGoals.currentlyLearning.map((item) => (
                <span key={item} className="activity-pill activity-pill-on">
                  {item}
                </span>
              ))}
            </div>
            <ul className="mt-3 space-y-1.5">
              {experience.achievements.slice(0, 4).map((a) => (
                <li key={a} className="flex gap-2 text-[12px] text-white/70">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#30d158]" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ project }: { project: (typeof content.projects)[number] }) {
  return (
    <div className="activity-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-semibold tracking-[-0.02em] text-white">
            {project.name}
          </div>
          <div className="text-[12px] text-white/50">{project.tagline}</div>
        </div>
        <div className="shrink-0 text-[11px] text-white/35">{project.period}</div>
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-white/70">{project.description}</p>
      <div className="mt-2.5 flex flex-wrap gap-1">
        {project.tech.map((t) => (
          <span key={t} className="activity-pill">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function GitHubPane({
  accounts,
  loading,
  languages,
  repos,
  selected,
  onSelect,
  contrib,
  loadingContrib,
}: {
  accounts: AccountBundle[];
  loading: boolean;
  languages: ReturnType<typeof languageBreakdown>;
  repos: GhRepo[];
  selected: string | null;
  onSelect: (id: string) => void;
  contrib: ContribPayload | null;
  loadingContrib: boolean;
}) {
  const maxStars = Math.max(1, ...repos.map((r) => r.stargazers_count));

  return (
    <div className="space-y-3 p-3 pb-4">
      {loading && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="activity-skel h-[88px] rounded-[14px]" />
          <div className="activity-skel h-[88px] rounded-[14px]" />
        </div>
      )}

      {!loading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {accounts.map((a) => {
            const stats = contrib?.accounts.find(
              (c) => c.login.toLowerCase() === a.login.toLowerCase(),
            );
            return (
              <a
                key={a.login}
                href={a.user?.html_url ?? `https://github.com/${a.login}`}
                target="_blank"
                rel="noreferrer"
                className="activity-card flex items-center gap-3 p-3 hover:bg-white/[0.04]"
              >
                {a.user?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.user.avatar_url} alt="" className="h-12 w-12 rounded-full ring-1 ring-white/15" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-white/10" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-semibold">{a.label}</span>
                    <span className="text-[12px] text-[#64d2ff]">@{a.user?.login ?? a.login}</span>
                  </div>
                  {a.user?.bio && (
                    <div className="truncate text-[11px] text-white/40">{a.user.bio}</div>
                  )}
                  {a.user ? (
                    <div className="mt-1 text-[11px] text-white/45">
                      {a.user.public_repos} repos · {a.user.followers} followers · joined{" "}
                      {formatDate(a.user.created_at)}
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#ff9f0a]">{a.error}</div>
                  )}
                </div>
                {stats && !stats.error && (
                  <div className="shrink-0 text-right">
                    <div className="text-[16px] font-semibold tabular-nums text-[#39d353]">
                      {stats.today}
                    </div>
                    <div className="text-[10px] text-white/40">today</div>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      )}

      <ContributionCard loading={loadingContrib} payload={contrib} />

      {languages.length > 0 && (
        <div className="activity-card p-3">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.04em] text-white/45">
            COMBINED LANGUAGE MIX
          </div>
          <StackedBar parts={languages} tall />
          <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
            {languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-1.5 text-[11px] text-white/70">
                <span className="h-2 w-2 rounded-full" style={{ background: lang.color }} />
                {lang.name}
                <span className="tabular-nums text-white/35">
                  {lang.pct}% · {lang.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="activity-card overflow-hidden">
        <TableHead
          layout="github"
          cols={[
            { label: "Repository" },
            { label: "Language" },
            { label: "Stars" },
            { label: "Forks" },
            { label: "Updated" },
          ]}
        />
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-t border-white/[0.05] px-3 py-2.5">
              <div className="activity-skel h-3 w-1/3 rounded" />
            </div>
          ))}
        {!loading && repos.length === 0 && (
          <div className="px-3 py-8 text-center text-white/40">No public repositories to list.</div>
        )}
        {!loading &&
          repos.map((r) => {
            const id = String(r.id);
            return (
              <a
                key={r.id}
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
                onClick={() => onSelect(id)}
                className={`activity-row activity-grid-github items-center border-t border-white/[0.05] ${
                  selected === id ? "activity-row-on" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate text-[12.5px] font-medium text-white/92">{r.name}</div>
                  <div className="truncate text-[11px] text-white/38">
                    {repoBlurb(r)}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/60">
                  {r.language && (
                    <span className="h-2 w-2 rounded-full" style={{ background: langColor(r.language) }} />
                  )}
                  {r.language ?? "—"}
                </div>
                <div className="text-right tabular-nums text-white/70">{r.stargazers_count}</div>
                <div className="text-right tabular-nums text-white/55">{r.forks_count}</div>
                <div className="pr-0 text-right text-[11px] text-white/40">
                  {formatDate(r.updated_at)}
                  <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-[#ffd60a]"
                      style={{ width: `${Math.max(8, (r.stargazers_count / maxStars) * 100)}%` }}
                    />
                  </div>
                </div>
              </a>
            );
          })}
      </div>
    </div>
  );
}

const CONTRIB_LEVEL = ["#2c2c2e", "#0e4429", "#006d32", "#26a641", "#39d353"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOW = ["", "Mon", "", "Wed", "", "Fri", ""];

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function shiftDate(iso: string, delta: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, (d ?? 1) + delta);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function weekdayShort(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return ["S", "M", "T", "W", "T", "F", "S"][new Date(y, (m ?? 1) - 1, d ?? 1).getDay()];
}

function weeksFromDays(days: ContributionDay[]) {
  if (!days.length) return [] as (ContributionDay | null)[][];
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const [y, m, d] = sorted[0].date.split("-").map(Number);
  const pad = new Date(y, (m ?? 1) - 1, d ?? 1).getDay();
  const cells: (ContributionDay | null)[] = Array.from({ length: pad }, () => null);
  cells.push(...sorted);
  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function ContributionCard({
  loading,
  payload,
}: {
  loading: boolean;
  payload: ContribPayload | null;
}) {
  const combined = payload?.combined;
  const today = localToday();

  if (loading) {
    return <div className="activity-skel h-[210px] rounded-[14px]" />;
  }
  if (!combined?.days.length) {
    return (
      <div className="activity-card px-3 py-8 text-center text-[12px] text-white/40">
        Couldn’t load GitHub contribution history right now.
      </div>
    );
  }

  const recent = Array.from({ length: 14 }, (_, i) => {
    const date = shiftDate(today, i - 13);
    const hit = combined.days.find((d) => d.date === date);
    return { date, count: hit?.count ?? 0, level: hit?.level ?? 0 };
  });
  const recentMax = Math.max(1, ...recent.map((d) => d.count));

  return (
    <div className="activity-card p-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div className="text-[11px] font-semibold tracking-[0.04em] text-white/45">
          DAILY CONTRIBUTIONS
        </div>
        <div className="text-[11px] text-white/35">
          {combined.total.toLocaleString()} in the last year
          {payload && payload.accounts.length > 1 ? " · both accounts" : ""}
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-1.5">
        <ChipStat label="Today" value={combined.today} />
        <ChipStat label="This week" value={combined.week} />
        <ChipStat label="Streak" value={`${combined.streak}d`} />
      </div>

      <div className="mb-3">
        <div className="mb-1.5 text-[10px] font-semibold tracking-[0.04em] text-white/35">
          LAST 14 DAYS
        </div>
        <div className="flex h-[58px] items-end gap-[3px]">
          {recent.map((d) => (
            <div
              key={d.date}
              title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-1"
            >
              <div
                className="w-full min-h-[6px] rounded-[3px]"
                style={{
                  height: `${Math.max(10, (d.count / recentMax) * 100)}%`,
                  background: CONTRIB_LEVEL[d.level] ?? CONTRIB_LEVEL[0],
                }}
              />
              <div className={`text-[9px] ${d.date === today ? "text-white/70" : "text-white/30"}`}>
                {weekdayShort(d.date)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ContributionHeatmap days={combined.days} today={today} />

      {payload && payload.accounts.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/45">
          {payload.accounts.map((a) => (
            <span key={a.login}>
              @{a.login}
              <span className="ml-1 tabular-nums text-white/70">{a.today} today</span>
              <span className="text-white/30"> · {a.total} yr</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ContributionHeatmap({ days, today }: { days: ContributionDay[]; today: string }) {
  const weeks = weeksFromDays(days);
  const labels = weeks.map((week, i) => {
    const day = week.find((d) => d)?.date;
    if (!day) return "";
    const month = Number(day.slice(5, 7));
    const prev = weeks[i - 1]?.find((d) => d)?.date;
    const prevMonth = prev ? Number(prev.slice(5, 7)) : -1;
    return month !== prevMonth ? MONTHS[month - 1] : "";
  });

  return (
    <div>
      <div className="contrib-scroll mac-scroll">
        <div className="contrib-months">
          <span className="contrib-dow-spacer" />
          {labels.map((label, i) => (
            <span key={i} className="contrib-month">
              {label}
            </span>
          ))}
        </div>
        <div className="flex gap-[3px]">
          <div className="contrib-dows">
            {DOW.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <span
                  key={di}
                  title={
                    day
                      ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`
                      : undefined
                  }
                  className={`contrib-cell ${day?.date === today ? "contrib-today" : ""}`}
                  style={{
                    background: day
                      ? CONTRIB_LEVEL[Math.min(4, day.level)]
                      : "transparent",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-white/35">
        Less
        {CONTRIB_LEVEL.map((c) => (
          <span key={c} className="contrib-cell" style={{ background: c }} />
        ))}
        More
      </div>
    </div>
  );
}

function TableHead({
  cols,
  layout,
}: {
  cols: { label: string }[];
  layout: "cpu" | "energy" | "github";
}) {
  return (
    <div className={`activity-thead activity-grid-${layout} items-center py-1.5`}>
      {cols.map((c, i) => (
        <div
          key={c.label}
          className={`text-[10.5px] font-semibold tracking-[0.04em] text-white/40 ${
            i >= 2 ? "text-right" : ""
          }`}
        >
          {c.label.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

function ProcessRow({
  title,
  subtitle,
  kind,
  kindTone = "muted",
  cpu,
  threads,
  energy,
  energyColor = "#30d158",
  extra,
  layout = "cpu",
  active,
  onClick,
}: {
  title: string;
  subtitle?: string;
  kind: string;
  kindTone?: "green" | "muted";
  cpu: number;
  threads: number;
  energy: number;
  energyColor?: string;
  extra?: string;
  layout?: "cpu" | "energy";
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`activity-row activity-grid-${layout} w-full cursor-default items-center border-t border-white/[0.05] text-left ${
        active ? "activity-row-on" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="truncate text-[12.5px] font-medium text-white/92">{title}</div>
        {subtitle && <div className="truncate text-[11px] text-white/38">{subtitle}</div>}
      </div>
      <div className={`text-[11px] ${kindTone === "green" ? "text-[#30d158]" : "text-white/50"}`}>
        {kind}
      </div>
      <div className="truncate text-right text-[11px] tabular-nums text-white/75">
        {extra ?? cpu.toFixed(1)}
      </div>
      <div className="text-right tabular-nums text-white/50">{threads}</div>
      <div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.max(6, Math.min(100, energy))}%`,
              background: energyColor,
            }}
          />
        </div>
      </div>
    </button>
  );
}

function Gauge({
  label,
  value,
  max,
  color,
  digits = 0,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  digits?: number;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const r = 22;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative h-[58px] w-[58px]">
        <svg viewBox="0 0 56 56" className="absolute inset-0 -rotate-90">
          <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold tabular-nums tracking-tight text-white">
          {digits ? value.toFixed(digits) : value}
        </div>
      </div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.06em] text-white/40">
        {label}
      </div>
    </div>
  );
}

function ChipStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-[10px] bg-white/[0.045] px-2.5 py-1.5" title={hint}>
      <div className="text-[10px] text-white/40">{label}</div>
      <div className="text-[14px] font-semibold tabular-nums tracking-tight">{value}</div>
    </div>
  );
}

function MiniCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#1c1c1e] px-3 py-2">
      <div className="text-[10px] text-white/40">{label}</div>
      <div className="text-[16px] font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function AccountRow({
  label,
  login,
  loading,
  bundle,
}: {
  label: string;
  login: string;
  loading: boolean;
  bundle?: AccountBundle;
}) {
  if (loading) {
    return <div className="activity-skel h-[52px] rounded-[10px]" />;
  }
  const u = bundle?.user;
  return (
    <a
      href={u?.html_url ?? `https://github.com/${login}`}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2.5 rounded-[10px] bg-white/[0.04] px-2.5 py-2 hover:bg-white/[0.07]"
    >
      {u?.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={u.avatar_url} alt="" className="h-8 w-8 rounded-full" />
      ) : (
        <div className="h-8 w-8 rounded-full bg-white/10" />
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-white/40">{label}</div>
        <div className="truncate font-medium text-[#64d2ff]">@{u?.login ?? login}</div>
      </div>
      <div className="text-right text-[11px] text-white/40">
        {u ? (
          <>
            {u.public_repos} repos
            <div>{u.followers} followers</div>
          </>
        ) : (
          bundle?.error ?? "Unavailable"
        )}
      </div>
    </a>
  );
}

function StackedBar({
  parts,
  tall,
}: {
  parts: { name: string; pct: number; color: string }[];
  tall?: boolean;
}) {
  return (
    <div className={`flex overflow-hidden rounded-full ${tall ? "h-2.5" : "h-2"}`}>
      {parts.map((p) => (
        <div
          key={p.name}
          title={`${p.name} ${p.pct}%`}
          style={{ width: `${Math.max(2, p.pct)}%`, background: p.color }}
        />
      ))}
    </div>
  );
}

function LoadGraph({ values, color }: { values: number[]; color: string }) {
  const gid = useId().replace(/:/g, "");
  const w = 480;
  const h = 108;
  const max = 100;
  const step = w / Math.max(1, values.length - 1);
  const line = values.map((v, i) => `${i * step},${h - (v / max) * (h - 6) - 3}`).join(" ");
  const area = `0,${h} ${line} ${(values.length - 1) * step},${h}`;
  return (
    <div className="activity-graph h-[112px] w-full overflow-hidden rounded-[10px]">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`ag-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((y) => (
          <line
            key={y}
            x1="0"
            x2={w}
            y1={h * y}
            y2={h * y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}
        <polygon points={area} fill={`url(#ag-${gid})`} />
        <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
