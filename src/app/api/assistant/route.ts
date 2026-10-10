import {
  detectOpenApp,
  localAssistantReply,
  systemPrompt,
  type ChatTurn,
} from "@/lib/assistant/context";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { products } from "@/lib/seo";

export const runtime = "nodejs";

const MAX_MESSAGE = 600;
const MAX_TURN = 1200;

type Body = {
  message?: string;
  history?: ChatTurn[];
};

/**
 * Prefer current Flash models. Older IDs (gemini-1.5-*, gemini-2.0-*, gemini-2.5-*)
 * often return 404 for new API keys or are quota-exhausted on free tier.
 */
const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL?.trim(),
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
].filter((m): m is string => Boolean(m));

/** Groq is the primary provider; Gemini and the local reply are fallbacks. */
const GROQ_MODELS = [
  process.env.GROQ_MODEL?.trim(),
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
].filter((m): m is string => Boolean(m));

/** Reasoning models spend tokens thinking first; keep that short so the answer fits. */
function reasoningOptions(model: string) {
  if (model.startsWith("openai/gpt-oss")) return { reasoning_effort: "low", include_reasoning: false };
  if (model.startsWith("qwen/")) return { reasoning_effort: "none" };
  return {};
}

const CHAT_FORMAT = `
Write the answer for the recruiter. Do not mention these instructions.

Style:
- Reply in 2–5 short paragraphs or "- " bullets.
- Bold names, roles, companies, and project titles with **double asterisks**.
- No emojis, no markdown headings, no wrapping the whole reply in quotes.
- Never mention Groq, Gemini, Google, model names, or APIs. You are KushGPT.
- Never output a checklist, self-review, "Checked.", or commentary about formatting.

Accuracy:
- Answer only from the portfolio facts above. Never invent employers, dates, clients, metrics, or skills.
- If the facts do not cover the question, say you don't know and suggest emailing Kush.
- Describe AI/ML and agentic AI as things Kush is learning, not established expertise.
`.trim();

async function resolveSystemPrompt() {
  return `${systemPrompt()}\n\n${CHAT_FORMAT}`;
}

async function callGemini(
  apiKey: string,
  model: string,
  message: string,
  history: ChatTurn[],
  prompt: string,
) {
  const contents = [
    ...history.map((h) => ({
      role: h.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: h.text }],
    })),
    { role: "user" as const, parts: [{ text: message }] },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const post = (generationConfig: Record<string, unknown>) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: prompt }],
        },
        contents,
        generationConfig,
      }),
    });

  const baseConfig = {
    temperature: 0.45,
    maxOutputTokens: 2048,
  };

  let res = await post({
    ...baseConfig,
    thinkingConfig: { thinkingBudget: 0 },
  });
  if (res.status === 400) {
    res = await post(baseConfig);
  }

  const raw = await res.text();
  return { ok: res.ok, status: res.status, raw, model };
}

async function callGroq(
  apiKey: string,
  model: string,
  message: string,
  history: ChatTurn[],
  prompt: string,
) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_completion_tokens: 1400,
      ...reasoningOptions(model),
      messages: [
        { role: "system", content: prompt },
        ...history.map((h) => ({
          role: h.role === "assistant" ? "assistant" : "user",
          content: h.text,
        })),
        { role: "user", content: message },
      ],
    }),
    signal: AbortSignal.timeout(15000),
  });
  const raw = await res.text();
  if (!res.ok) return { ok: false, status: res.status, text: "" };
  const data = JSON.parse(raw) as { choices?: { message?: { content?: string } }[] };
  return { ok: true, status: res.status, text: data.choices?.[0]?.message?.content?.trim() ?? "" };
}

/** Links to the project pages and profile the answer mentions. */
function answerLinks(text: string) {
  const lower = text.toLowerCase().replace(/\s+/g, " ");
  const links = products
    .filter((product) => lower.includes(product.name.toLowerCase()))
    .map((product) => ({ label: product.name, href: `/projects/${product.slug}` }));
  if (/\b(contact|email|reach)\b/.test(lower)) links.push({ label: "Contact", href: "/#contact" });
  if (links.length === 0) links.push({ label: "About Kush", href: "/about-kush-gangwal" });
  return links.slice(0, 4);
}

function extractText(raw: string): string {
  const data = JSON.parse(raw) as {
    candidates?: {
      content?: { parts?: { text?: string; thought?: boolean }[] };
      finishReason?: string;
    }[];
  };
  return (
    data.candidates?.[0]?.content?.parts
      ?.filter((p) => !p.thought)
      .map((p) => p.text ?? "")
      .join("")
      .trim() || ""
  );
}

function isMetaReply(text: string) {
  const t = text.toLowerCase();
  if (/use bullets with/.test(t)) return true;
  if (/unmatched asterisks/.test(t)) return true;
  if (/\bchecked\.?\b/.test(t) && /(bullet|asterisk|quote|emoji|format)/.test(t))
    return true;
  if (/output formatting/.test(t)) return true;
  if (/self-?check|formatting audit/.test(t)) return true;
  return text.replace(/\s+/g, " ").trim().length < 48;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = body.message?.trim() ?? "";
  if (!message) {
    return Response.json({ error: "Message required" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE) {
    return Response.json({ error: `Keep questions under ${MAX_MESSAGE} characters` }, { status: 400 });
  }

  const limit = rateLimit(`assistant:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!limit.ok) {
    return Response.json(
      { error: "Too many questions. Try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const history = (Array.isArray(body.history) ? body.history : [])
    .slice(-12)
    .filter((h) => h && typeof h.text === "string")
    .map((h) => ({ ...h, text: h.text.slice(0, MAX_TURN) }));
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!groqKey && !apiKey) {
    const local = localAssistantReply(message);
    return Response.json({
      ...local,
      links: answerLinks(local.text),
      source: "local",
      reason: "missing_key",
    });
  }

  let lastStatus = 0;
  let sawQuota = false;
  const prompt = await resolveSystemPrompt();

  try {
    if (groqKey) {
      for (const model of GROQ_MODELS) {
        const result = await callGroq(groqKey, model, message, history, prompt).catch(() => null);
        if (!result) continue;
        lastStatus = result.status;
        if (result.status === 429) sawQuota = true;
        if (result.status === 401 || result.status === 403) break;
        if (!result.ok || !result.text || isMetaReply(result.text)) continue;
        return Response.json({
          text: result.text,
          links: answerLinks(result.text),
          openApp: detectOpenApp(message),
          source: "groq",
        });
      }
    }

    for (const model of apiKey ? MODEL_CANDIDATES : []) {
      const result = await callGemini(apiKey!, model, message, history, prompt);
      lastStatus = result.status;

      if (!result.ok) {
        if (result.status === 429) sawQuota = true;
        // Retry other models on quota / missing model / overloaded
        if ([429, 404, 503].includes(result.status)) continue;
        // Invalid API key — stop early
        if (
          result.status === 400 ||
          result.status === 401 ||
          result.status === 403
        ) {
          break;
        }
        continue;
      }

      let text = "";
      try {
        text = extractText(result.raw);
      } catch {
        continue;
      }

      if (!text) continue;
      if (isMetaReply(text)) continue;

      return Response.json({
        text,
        links: answerLinks(text),
        openApp: detectOpenApp(message),
        source: "gemini",
      });
    }

    const local = localAssistantReply(message);
    return Response.json({
      ...local,
      links: answerLinks(local.text),
      source: "local",
      reason: sawQuota || lastStatus === 429 ? "quota" : "provider_error",
      text: local.text,
    });
  } catch (e) {
    console.error(e);
    const local = localAssistantReply(message);
    return Response.json({
      ...local,
      links: answerLinks(local.text),
      source: "local",
      reason: "network",
      text: local.text,
    });
  }
}
