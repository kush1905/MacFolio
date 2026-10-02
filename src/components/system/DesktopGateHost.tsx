"use client";

import type { ReactNode } from "react";
import { useIsOsHome } from "@/lib/desktop";

export function DesktopGateHost({ children }: { children: ReactNode }) {
  const osHome = useIsOsHome();
  if (!osHome) return null;
  return children;
}
