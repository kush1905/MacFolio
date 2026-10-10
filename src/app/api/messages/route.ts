import { badRequest, json, visitorHeader } from "@/lib/db/http";
import { insertMessage, listMessages } from "@/lib/db/queries";
import { content } from "@/lib/content";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const LIMITS = { name: 100, email: 200, message: 5000 };

export async function GET(req: Request) {
  const messages = await listMessages(visitorHeader(req));
  if (!messages) {
    return json({ source: "local", messages: [] });
  }
  return json({ source: "postgres", messages });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** Sends the message to Kush through Resend. Returns false when not configured or on failure. */
async function deliver(input: { name: string; email: string; message: string }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;
  const to = process.env.CONTACT_TO_EMAIL?.trim() || content.about.email;
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || "Portfolio <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: input.email,
        subject: `Portfolio message from ${input.name}`,
        text: `${input.message}\n\n— ${input.name} <${input.email}>`,
        html: `<p>${escapeHtml(input.message).replace(/\n/g, "<br>")}</p><p>— ${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;</p>`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error("resend", res.status, await res.text());
    return res.ok;
  } catch (error) {
    console.error("resend", error);
    return false;
  }
}

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string; company?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return badRequest("Invalid JSON");
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  if (!name || !email || !message) {
    return badRequest("name, email, and message are required");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("Invalid email");
  }
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return badRequest("Message is too long");
  }

  // Honeypot: real visitors never see or fill the "company" field.
  if (body.company) {
    return json({ source: "local", delivered: true, stored: false }, 201);
  }

  const limit = rateLimit(`messages:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return json({ error: "Too many messages. Try again later." }, 429);
  }

  const [delivered, saved] = await Promise.all([
    deliver({ name, email, message }),
    insertMessage({ visitorId: visitorHeader(req), name, email, message }),
  ]);

  if (!delivered && !saved) {
    return json(
      {
        source: "local",
        delivered: false,
        stored: false,
        error: "delivery_unavailable",
        fallback: `mailto:${content.about.email}`,
      },
      503,
    );
  }

  return json(
    {
      source: saved ? "postgres" : "local",
      delivered,
      stored: Boolean(saved),
      message: saved ?? {
        id: `sent_${Date.now()}`,
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
      },
    },
    201,
  );
}
