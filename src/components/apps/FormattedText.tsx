"use client";

import type { ReactNode } from "react";

/** Render chat markdown as real bold / lists instead of raw ** asterisks. */
export function FormattedText({ text }: { text: string }) {
  const cleaned = unwrapQuotes(text).replace(/\r\n/g, "\n").trim();
  const blocks = splitBlocks(cleaned);

  return (
    <div className="space-y-2 text-[13px] leading-[1.55]">
      {blocks.map((block, i) => {
        if (block.type === "list") {
          return (
            <ul key={i} className="space-y-1 pl-0.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2">
                  <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-white/45" />
                  <span className="min-w-0">
                    <Inline text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "heading") {
          return (
            <div key={i} className="text-[14px] font-semibold tracking-[-0.02em] text-white">
              <Inline text={block.text} />
            </div>
          );
        }
        return (
          <p key={i} className="text-white/90">
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

function unwrapQuotes(text: string) {
  let t = text.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'")) ||
    (t.startsWith("“") && t.endsWith("”"))
  ) {
    t = t.slice(1, -1).trim();
  }
  return t;
}

function splitBlocks(text: string) {
  const lines = text.split("\n");
  const blocks: (
    | { type: "p"; text: string }
    | { type: "heading"; text: string }
    | { type: "list"; items: string[] }
  )[] = [];

  let para: string[] = [];
  let list: string[] = [];

  const flushPara = () => {
    const t = para.join(" ").replace(/\s+/g, " ").trim();
    if (t) blocks.push({ type: "p", text: t });
    para = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: "list", items: list });
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      flushPara();
      continue;
    }
    const heading = line.match(/^#{1,3}\s+(.+)/);
    if (heading) {
      flushList();
      flushPara();
      blocks.push({ type: "heading", text: heading[1] });
      continue;
    }
    const bullet = line.match(/^[-*•]\s+(.+)/);
    const numbered = line.match(/^\d+[.)]\s+(.+)/);
    if (bullet || numbered) {
      flushPara();
      list.push((bullet?.[1] ?? numbered?.[1] ?? "").trim());
      continue;
    }
    flushList();
    para.push(line);
  }
  flushList();
  flushPara();
  return blocks;
}

function Inline({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const re =
    /(\*\*[^*]+?\*\*|__[^_]+?__|\*[^*\n]+?\*|`[^`]+?`|\[[^\]]+?\]\([^)]+?\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(
        <strong key={key++} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*")) {
      nodes.push(
        <em key={key++} className="italic text-white/80">
          {token.slice(1, -1)}
        </em>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="rounded-[4px] bg-white/10 px-1 py-px font-mono text-[12px]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        nodes.push(
          <a
            key={key++}
            href={link[2]}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[color:var(--mac-accent)] underline decoration-white/20 underline-offset-2"
          >
            {link[1]}
          </a>,
        );
      }
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
