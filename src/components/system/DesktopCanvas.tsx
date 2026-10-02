"use client";

import type { ReactNode } from "react";
import { useDesktopAllowed, useIsOsHome } from "@/lib/desktop";

export function DesktopCanvas({ children }: { children: ReactNode }) {
  const osHome = useIsOsHome();
  const allowed = useDesktopAllowed();
  const lock = osHome && !allowed;
  return (
    <div className="min-h-full" inert={lock || undefined}>
      {children}
    </div>
  );
}
