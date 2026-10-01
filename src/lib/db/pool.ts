import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool | null = null;
let warned = false;

export function databaseUrl(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  return url || null;
}

export function getPool(): Pool | null {
  const url = databaseUrl();
  if (!url) {
    if (!warned) {
      console.warn("[db] DATABASE_URL is not set — APIs will use local fallbacks.");
      warned = true;
    }
    return null;
  }
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      max: 8,
      idleTimeoutMillis: 20_000,
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T> | null> {
  const p = getPool();
  if (!p) return null;
  try {
    return await p.query<T>(text, params);
  } catch (error) {
    console.error("[db] query failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function withClient<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T | null> {
  const p = getPool();
  if (!p) return null;
  const client = await p.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
