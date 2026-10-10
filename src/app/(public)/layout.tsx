import type { ReactNode } from "react";
import { CommandPalette } from "@/components/command/CommandPalette";
import { PublicFooter, PublicHeader } from "@/components/public/PublicChrome";
import { homeProjects, techNodes } from "@/lib/portfolio";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-site">
      <a className="public-skip" href="#content">
        Skip to content
      </a>
      <PublicHeader />
      <main id="content" className="public-main">
        {children}
      </main>
      <PublicFooter />
      <CommandPalette projects={homeProjects} techNodes={techNodes} />
    </div>
  );
}
