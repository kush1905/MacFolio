"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppIcon } from "@/components/icons/AppIcon";
import { HELP_TOPICS, type HelpTopic } from "@/lib/help";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";
import type { AppId } from "@/types";

const APP_IDS = new Set<string>([
  "finder",
  "launchpad",
  "safari",
  "messages",
  "photos",
  "projects",
  "notes",
  "terminal",
  "vscode",
  "assistant",
  "activity",
  "settings",
  "preview",
  "trash",
]);

function asTopicId(id: string | null | undefined): HelpTopic["id"] {
  if (id && HELP_TOPICS.some((t) => t.id === id)) {
    return id as HelpTopic["id"];
  }
  return "finder";
}

export function HelpCenter() {
  const open = useOSStore((s) => s.helpCenterOpen);
  const topicId = useOSStore((s) => s.helpTopicId);
  const setOpen = useOSStore((s) => s.setHelpCenterOpen);
  const setTopic = useOSStore((s) => s.setHelpTopicId);
  const openApp = useWindowStore((s) => s.openApp);
  const [selected, setSelected] = useState<HelpTopic["id"]>("finder");

  useEffect(() => {
    if (open && topicId) setSelected(asTopicId(topicId));
  }, [open, topicId]);

  const topic =
    HELP_TOPICS.find((t) => t.id === selected) ?? HELP_TOPICS[0];

  const canOpenApp = APP_IDS.has(topic.id);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[170] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-label="PortfolioOS Help"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="help-center fixed left-1/2 top-[10%] z-[180] flex h-[min(560px,72vh)] w-[min(720px,92vw)] -translate-x-1/2 overflow-hidden rounded-[12px] text-white shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
          >
            {/* Sidebar */}
            <aside className="mac-scroll flex w-[220px] shrink-0 flex-col border-r border-white/10 bg-[#2a2a2c]/95 pt-3">
              <div className="px-3 pb-2 text-[11px] font-semibold tracking-[-0.01em] text-white/40">
                PortfolioOS Help
              </div>
              <div className="space-y-px px-1.5 pb-3">
                {HELP_TOPICS.map((t) => {
                  const active = t.id === selected;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelected(t.id);
                        setTopic(t.id);
                      }}
                      className={`flex w-full cursor-default items-center gap-2 rounded-[6px] px-2 py-[5px] text-left text-[12.5px] ${
                        active
                          ? "bg-mac-accent text-white"
                          : "text-white/85 hover:bg-white/10"
                      }`}
                    >
                      <TopicIcon id={t.id} />
                      <span className="truncate">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Detail */}
            <div className="flex min-w-0 flex-1 flex-col bg-[#1e1e20]/98">
              <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/10 px-4">
                <div className="text-[13px] font-semibold tracking-[-0.015em]">
                  {topic.name}
                </div>
                <button
                  type="button"
                  className="cursor-default rounded-md px-2 py-1 text-[12px] text-white/55 hover:bg-white/10 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="mac-scroll flex-1 space-y-5 p-5">
                <div>
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    Used for
                  </div>
                  <p className="text-[14px] leading-relaxed text-white/90">
                    {topic.usedFor}
                  </p>
                </div>

                <div>
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    What it displays
                  </div>
                  <ul className="space-y-1.5">
                    {topic.shows.map((line) => (
                      <li
                        key={line}
                        className="flex gap-2 text-[13px] leading-snug text-white/80"
                      >
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/45" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>

                {topic.tip && (
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[12.5px] text-white/70">
                    <span className="font-semibold text-white/85">Tip · </span>
                    {topic.tip}
                  </div>
                )}

                {canOpenApp && (
                  <button
                    type="button"
                    className="cursor-default rounded-md bg-mac-accent px-3.5 py-1.5 text-[12.5px] font-medium"
                    onClick={() => {
                      openApp(topic.id as AppId);
                      setOpen(false);
                    }}
                  >
                    Open {topic.name}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function TopicIcon({ id }: { id: HelpTopic["id"] }) {
  if (APP_IDS.has(id)) {
    return (
      <div className="h-4 w-4 shrink-0">
        <AppIcon id={id as AppId} />
      </div>
    );
  }
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[10px] text-white/55">
      {id === "spotlight" ? "⌕" : id === "mission" ? "⊞" : "·"}
    </span>
  );
}
