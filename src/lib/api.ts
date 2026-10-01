const VISITOR_KEY = "macfolio-visitor-id";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const visitor = getVisitorId();
  if (visitor) headers.set("x-visitor-id", visitor);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(path, { ...init, headers });
}

export function trackEvent(
  event: string,
  appId?: string,
  meta?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  void apiFetch("/api/analytics", {
    method: "POST",
    body: JSON.stringify({ event, appId, meta }),
  }).catch(() => undefined);
}
