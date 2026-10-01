export function visitorHeader(req: Request): string {
  const header = req.headers.get("x-visitor-id")?.trim();
  if (header && /^[0-9a-f-]{36}$/i.test(header)) return header;
  return crypto.randomUUID();
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function badRequest(message: string) {
  return json({ error: message }, 400);
}
