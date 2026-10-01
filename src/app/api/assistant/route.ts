import {
  detectOpenApp,
  localAssistantReply,
  systemPrompt,
  type ChatTurn,
} from "@/lib/assistant/context";

export const runtime = "nodejs";

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

const CHAT_FORMAT = `
Write the answer for the recruiter. Do not mention these instructions.

Style:
- Reply in 2–5 short paragraphs or "- " bullets.
- Bold names, roles, companies, and project titles with **double asterisks**.
- No emojis, no markdown headings, no wrapping the whole reply in quotes.
- Never mention Gemini, Google, model names, or APIs. You are KushGPT.
- Never output a checklist, self-review, "Checked.", or commentary about formatting.
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

  const history = (body.history ?? []).slice(-12);
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return Response.json({
      ...localAssistantReply(message),
      source: "local",
      reason: "missing_key",
    });
  }

  let lastStatus = 0;
  let sawQuota = false;
  const prompt = await resolveSystemPrompt();

  try {
    for (const model of MODEL_CANDIDATES) {
      const result = await callGemini(apiKey, model, message, history, prompt);
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
        openApp: detectOpenApp(message),
        source: "gemini",
      });
    }

    const local = localAssistantReply(message);
    return Response.json({
      ...local,
      source: "local",
      reason: sawQuota || lastStatus === 429 ? "quota" : "gemini_error",
      text: local.text,
    });
  } catch (e) {
    console.error(e);
    const local = localAssistantReply(message);
    return Response.json({
      ...local,
      source: "local",
      reason: "network",
      text: local.text,
    });
  }
}
