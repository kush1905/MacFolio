"use client";

import { useEffect, type ReactNode } from "react";
import { syncDisplayMode, useDesktopAllowed, useIsOsHome } from "@/lib/desktop";

export function DesktopCanvas({ children }: { children: ReactNode }) {
  const osHome = useIsOsHome();
  const allowed = useDesktopAllowed();
  const lock = osHome && !allowed;

  // Leaving /desktop on a phone must restore the public viewport and scrolling.
  useEffect(() => () => void syncDisplayMode("/"), []);

  return (
    <div className="min-h-full" inert={lock || undefined}>
      {children}
    </div>
  );
}
