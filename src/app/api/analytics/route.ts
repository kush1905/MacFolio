import { analyticsSummary, insertAnalytics } from "@/lib/db/queries";
import { badRequest, json, visitorHeader } from "@/lib/db/http";

export const runtime = "nodejs";

export async function GET() {
  const summary = await analyticsSummary();
  if (!summary) {
    return json({ source: "local", summary: null });
  }
  return json({ source: "postgres", summary });
}

export async function POST(req: Request) {
  let body: {
    event?: string;
    appId?: string;
    meta?: Record<string, unknown>;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return badRequest("Invalid JSON");
  }

  const event = body.event?.trim();
  if (!event) return badRequest("event is required");

  const saved = await insertAnalytics({
    visitorId: visitorHeader(req),
    event,
    appId: body.appId ?? null,
    meta: body.meta,
  });

  if (!saved) {
    return json({ source: "local", saved: false }, 503);
  }
  return json({ source: "postgres", saved: true }, 201);
}
