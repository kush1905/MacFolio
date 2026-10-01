import type { AppId, ContactMessage, Preferences } from "@/types";
import { query } from "./pool";

export async function touchVisitor(visitorId: string): Promise<boolean> {
  const res = await query(
    `INSERT INTO visitors (id)
     VALUES ($1)
     ON CONFLICT (id) DO UPDATE SET last_seen = now()`,
    [visitorId],
  );
  return Boolean(res);
}

export async function insertMessage(input: {
  visitorId: string;
  name: string;
  email: string;
  message: string;
}): Promise<ContactMessage | null> {
  await touchVisitor(input.visitorId);
  const res = await query<{
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: Date;
  }>(
    `INSERT INTO contact_messages (visitor_id, name, email, message)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, message, created_at`,
    [input.visitorId, input.name, input.email, input.message],
  );
  const row = res?.rows[0];
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at.toISOString(),
  };
}

export async function listMessages(
  visitorId: string,
  limit = 50,
): Promise<ContactMessage[] | null> {
  const res = await query<{
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: Date;
  }>(
    `SELECT id, name, email, message, created_at
     FROM contact_messages
     WHERE visitor_id = $1
     ORDER BY created_at ASC
     LIMIT $2`,
    [visitorId, limit],
  );
  if (!res) return null;
  return res.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function getSettings(visitorId: string): Promise<
  | { available: false }
  | {
      available: true;
      settings: {
        preferences: Preferences;
        dockPins: AppId[];
        updatedAt: string;
      } | null;
    }
> {
  const res = await query<{
    preferences: Preferences;
    dock_pins: AppId[];
    updated_at: Date;
  }>(
    `SELECT preferences, dock_pins, updated_at
     FROM os_settings
     WHERE visitor_id = $1`,
    [visitorId],
  );
  if (!res) return { available: false };
  const row = res.rows[0];
  if (!row) return { available: true, settings: null };
  return {
    available: true,
    settings: {
      preferences: row.preferences,
      dockPins: row.dock_pins,
      updatedAt: row.updated_at.toISOString(),
    },
  };
}

export async function upsertSettings(input: {
  visitorId: string;
  preferences: Preferences;
  dockPins: AppId[];
}): Promise<boolean> {
  await touchVisitor(input.visitorId);
  const res = await query(
    `INSERT INTO os_settings (visitor_id, preferences, dock_pins, updated_at)
     VALUES ($1, $2::jsonb, $3::jsonb, now())
     ON CONFLICT (visitor_id) DO UPDATE SET
       preferences = EXCLUDED.preferences,
       dock_pins = EXCLUDED.dock_pins,
       updated_at = now()`,
    [
      input.visitorId,
      JSON.stringify(input.preferences),
      JSON.stringify(input.dockPins),
    ],
  );
  return Boolean(res);
}

export async function insertAnalytics(input: {
  visitorId: string;
  event: string;
  appId?: string | null;
  meta?: Record<string, unknown>;
}): Promise<boolean> {
  await touchVisitor(input.visitorId);
  const res = await query(
    `INSERT INTO analytics_events (visitor_id, event, app_id, meta)
     VALUES ($1, $2, $3, $4::jsonb)`,
    [
      input.visitorId,
      input.event,
      input.appId ?? null,
      JSON.stringify(input.meta ?? {}),
    ],
  );
  return Boolean(res);
}

export async function analyticsSummary() {
  const totals = await query<{ event: string; count: string }>(
    `SELECT event, COUNT(*)::text AS count
     FROM analytics_events
     GROUP BY event
     ORDER BY COUNT(*) DESC`,
  );
  const apps = await query<{ app_id: string; count: string }>(
    `SELECT app_id, COUNT(*)::text AS count
     FROM analytics_events
     WHERE event = 'app_open' AND app_id IS NOT NULL
     GROUP BY app_id
     ORDER BY COUNT(*) DESC
     LIMIT 12`,
  );
  const visits = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM visitors`,
  );
  if (!totals || !apps || !visits) return null;
  return {
    visitors: Number(visits.rows[0]?.count ?? 0),
    events: Object.fromEntries(
      totals.rows.map((r) => [r.event, Number(r.count)]),
    ),
    topApps: apps.rows.map((r) => ({
      appId: r.app_id,
      opens: Number(r.count),
    })),
  };
}

export async function getContentDocument<T>(key: string): Promise<T | null> {
  const res = await query<{ payload: T }>(
    `SELECT payload FROM content_documents WHERE key = $1`,
    [key],
  );
  if (!res) return null;
  return res.rows[0]?.payload ?? null;
}

export async function upsertContentDocument(key: string, payload: unknown) {
  return query(
    `INSERT INTO content_documents (key, payload, updated_at)
     VALUES ($1, $2::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`,
    [key, JSON.stringify(payload)],
  );
}

export async function loadAllContentDocuments() {
  const res = await query<{ key: string; payload: unknown }>(
    `SELECT key, payload FROM content_documents`,
  );
  if (!res) return null;
  return Object.fromEntries(res.rows.map((r) => [r.key, r.payload]));
}
