import type { AppId, Preferences } from "@/types";
import { badRequest, json, visitorHeader } from "@/lib/db/http";
import { getSettings, upsertSettings } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const visitorId = visitorHeader(req);
  const result = await getSettings(visitorId);
  if (!result.available) {
    return json({ source: "local", settings: null });
  }
  return json({ source: "postgres", settings: result.settings });
}

export async function PUT(req: Request) {
  let body: { preferences?: Preferences; dockPins?: AppId[] };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return badRequest("Invalid JSON");
  }
  if (!body.preferences || !Array.isArray(body.dockPins)) {
    return badRequest("preferences and dockPins are required");
  }

  const ok = await upsertSettings({
    visitorId: visitorHeader(req),
    preferences: body.preferences,
    dockPins: body.dockPins,
  });

  if (!ok) {
    return json({ source: "local", saved: false }, 503);
  }
  return json({ source: "postgres", saved: true });
}
