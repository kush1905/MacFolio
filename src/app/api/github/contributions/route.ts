import {
  allowedLogins,
  fetchContributionAccount,
  githubAccounts,
  mergeCalendars,
  summarize,
} from "@/lib/github/contributions";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const allowed = allowedLogins();
  const requested = new URL(req.url).searchParams.get("logins");
  const logins = (
    requested
      ? requested.split(",").map((s) => s.trim()).filter(Boolean)
      : githubAccounts().map((a) => a.login)
  ).filter((login) => allowed.has(login.toLowerCase()));

  if (!logins.length) {
    return Response.json({ error: "No accounts" }, { status: 400 });
  }

  const accounts = await Promise.all(logins.map((login) => fetchContributionAccount(login)));
  const combinedDays = mergeCalendars(accounts);
  const combined = summarize(combinedDays);

  return Response.json(
    {
      accounts,
      combined: { days: combinedDays, ...combined },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    },
  );
}
