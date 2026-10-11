import type { ReactNode } from "react";
import "./desktop.css";
import { DESKTOP_BOOT_SCRIPT } from "@/lib/desktopMode";
import { DesktopCanvas } from "@/components/system/DesktopCanvas";
import { DesktopGate } from "@/components/system/DesktopGate";
import { DesktopGateHost } from "@/components/system/DesktopGateHost";

export default function DesktopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Sets data-display-mode before paint so phones get the desktop gate, not a broken OS. */}
      <script dangerouslySetInnerHTML={{ __html: DESKTOP_BOOT_SCRIPT }} />
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
