import { content } from "@/lib/content";

export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type ContributionAccount = {
  login: string;
  total: number;
  today: number;
  week: number;
  streak: number;
  days: ContributionDay[];
  error: string | null;
};

const LEVEL_NAME: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export function githubAccounts() {
  return (
    content.about.githubAccounts ?? [
      { login: "kush1905", label: "Personal" },
      { login: "Kush-PB", label: "Potato Bazaar" },
    ]
  );
}

export function allowedLogins() {
  return new Set(githubAccounts().map((a) => a.login.toLowerCase()));
}

export function todayISO() {
  const d = new Date();
  return isoDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function isoDate(y: number, m: number, day: number) {
  return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addDays(iso: string, delta: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + delta);
  return isoDate(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
}

export function summarize(days: ContributionDay[], today = todayISO()) {
  const map = new Map(days.map((d) => [d.date, d.count]));
  const todayCount = map.get(today) ?? 0;
  let week = 0;
  for (let i = 0; i < 7; i++) week += map.get(addDays(today, -i)) ?? 0;

  let streak = 0;
  let cursor = todayCount > 0 ? today : addDays(today, -1);
  while ((map.get(cursor) ?? 0) > 0) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  const total = days.reduce((s, d) => s + d.count, 0);
  return { total, today: todayCount, week, streak };
}

export function mergeCalendars(accounts: ContributionAccount[]): ContributionDay[] {
  const map = new Map<string, number>();
  for (const a of accounts) {
    for (const d of a.days) {
      map.set(d.date, (map.get(d.date) ?? 0) + d.count);
    }
  }
  const counts = [...map.values()].filter((n) => n > 0).sort((a, b) => a - b);
  const q = (p: number) => counts[Math.min(counts.length - 1, Math.floor(counts.length * p))] ?? 1;

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      count,
      level:
        count <= 0
          ? 0
          : count <= q(0.25)
            ? 1
            : count <= q(0.5)
              ? 2
              : count <= q(0.75)
                ? 3
                : 4,
    }));
}

export async function fetchContributionAccount(login: string): Promise<ContributionAccount> {
  try {
    const token = process.env.GITHUB_TOKEN?.trim();
    const days = token ? await fromGraphQL(login, token) : await fromHtml(login);
    if (!days.length) {
      return { login, days: [], total: 0, today: 0, week: 0, streak: 0, error: "No calendar data" };
    }
    return { login, days, error: null, ...summarize(days) };
  } catch (e) {
    return {
      login,
      days: [],
      total: 0,
      today: 0,
      week: 0,
      streak: 0,
      error: e instanceof Error ? e.message : "Failed to load contributions",
    };
  }
}

async function fromGraphQL(login: string, token: string): Promise<ContributionDay[]> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "macfolio",
    },
    body: JSON.stringify({
      query: `query ($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }`,
      variables: { login },
    }),
    next: { revalidate: 1800 },
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);
  const json = (await res.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            weeks?: {
              contributionDays?: {
                date: string;
                contributionCount: number;
                contributionLevel: string;
              }[];
            }[];
          };
        };
      };
    };
    errors?: { message: string }[];
  };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
  return weeks.flatMap((w) =>
    (w.contributionDays ?? []).map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: LEVEL_NAME[d.contributionLevel] ?? 0,
    })),
  );
}

async function fromHtml(login: string): Promise<ContributionDay[]> {
  const res = await fetch(
    `https://github.com/users/${encodeURIComponent(login)}/contributions`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X) Macfolio",
        Accept: "text/html",
      },
      next: { revalidate: 1800 },
    },
  );
  if (!res.ok) throw new Error(`GitHub contributions ${res.status}`);
  return parseContributionHtml(await res.text());
}

export function parseContributionHtml(html: string): ContributionDay[] {
  const tips = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip[^>]*\sfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/gi)) {
    const text = m[2];
    tips.set(
      m[1],
      /no contributions/i.test(text)
        ? 0
        : Number(text.match(/(\d+)\s+contribution/i)?.[1] ?? 0),
    );
  }

  const days: ContributionDay[] = [];
  const seen = new Set<string>();
  for (const m of html.matchAll(/<td\b[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/gi)) {
    const tag = m[0];
    const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    if (!date || seen.has(date)) continue;
    seen.add(date);
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
    const id = tag.match(/\sid="([^"]+)"/)?.[1];
    const count = (id && tips.has(id) ? tips.get(id) : undefined) ?? (level > 0 ? 1 : 0);
    days.push({ date, count, level });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}
