import { badRequest, json, visitorHeader } from "@/lib/db/http";
import { insertMessage, listMessages } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const messages = await listMessages(visitorHeader(req));
  if (!messages) {
    return json({ source: "local", messages: [] });
  }
  return json({ source: "postgres", messages });
}

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return badRequest("Invalid JSON");
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  if (!name || !email || !message) {
    return badRequest("name, email, and message are required");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("Invalid email");
  }

  const saved = await insertMessage({
    visitorId: visitorHeader(req),
    name,
    email,
    message,
  });

  if (!saved) {
    return json({
      source: "local",
      error: "database_unavailable",
      message: {
        id: `local_${Date.now()}`,
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
      },
    });
  }

  return json({ source: "postgres", message: saved }, 201);
}
