import type { ReactNode } from "react";
import { PublicFooter, PublicHeader } from "@/components/public/PublicChrome";

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
    </div>
  );
}
