import type { ReactNode } from "react";
import { DesktopCanvas } from "@/components/system/DesktopCanvas";
import { DesktopGate } from "@/components/system/DesktopGate";
import { DesktopGateHost } from "@/components/system/DesktopGateHost";

export default function DesktopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/assets/macos/wallpapers/space-black.jpg"
        fetchPriority="high"
      />
      <DesktopGateHost>
        <DesktopGate />
      </DesktopGateHost>
      <DesktopCanvas>{children}</DesktopCanvas>
    </>
  );
}
