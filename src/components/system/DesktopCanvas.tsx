"use client";

import type { ReactNode } from "react";
import { useDesktopAllowed } from "@/lib/desktop";

export function DesktopCanvas({ children }: { children: ReactNode }) {
  const allowed = useDesktopAllowed();
  return (
    <div className="min-h-full" inert={!allowed || undefined}>
      {children}
    </div>
  );
}
