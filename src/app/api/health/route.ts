import { databaseUrl, query } from "@/lib/db/pool";

export const runtime = "nodejs";

export async function GET() {
  const url = databaseUrl();
  if (!url) {
    return Response.json({
      ok: true,
      database: "unconfigured",
      hint: "Set DATABASE_URL and run npm run db:up && npm run db:migrate && npm run db:seed",
    });
  }
  try {
    const res = await query<{ now: Date }>("SELECT now() AS now");
    return Response.json({
      ok: true,
      database: "connected",
      now: res?.rows[0]?.now ?? null,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        database: "error",
        error: error instanceof Error ? error.message : "query failed",
      },
      { status: 503 },
    );
  }
}
