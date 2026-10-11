import type { ReactNode } from "react";
import "../site.css";
import "./public.css";
import { CommandPalette } from "@/components/command/CommandPalette";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { homeProjects, techNodes } from "@/lib/portfolio";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-site pu">
      <a className="pu-skip" href="#content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="content" className="public-main">
        {children}
      </main>
      <SiteFooter />
      <CommandPalette projects={homeProjects} techNodes={techNodes} />
    </div>
  );
}
