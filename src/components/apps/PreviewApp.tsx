"use client";

import { content } from "@/lib/content";

export function PreviewApp() {
  return (
    <div className="flex h-full flex-col bg-[#1c1c1e]">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/10 bg-[#2a2a2c] px-3 text-[12px] text-white/70">
        <span className="font-medium text-white/90">Resume.pdf</span>
        <div className="flex items-center gap-2">
          <a
            href={content.about.links.resume}
            download
            className="rounded-md bg-white/10 px-2.5 py-1 text-white/80 hover:bg-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            Download
          </a>
          <a
            href={content.about.links.resume}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-mac-accent px-2.5 py-1 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            Open in Browser
          </a>
        </div>
      </div>
      <div className="relative min-h-0 flex-1 bg-[#111]">
        <iframe
          title="Resume"
          src={`${content.about.links.resume}#toolbar=0&navpanes=0`}
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
