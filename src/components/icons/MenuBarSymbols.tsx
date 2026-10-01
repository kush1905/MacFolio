/** SF Symbols–style menu bar glyphs (not Apple's binary assets).
 * Reference shapes: wifi, battery.*, magnifyingglass, switch.2
 * Export authentic vectors from Apple’s SF Symbols app if you need pixel-perfect paths:
 * https://developer.apple.com/sf-symbols/
 */

export function ControlCenterSymbol({ className = "h-[13px] w-[15px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 17 15" className={className} aria-hidden fill="currentColor">
      <rect x="0.75" y="1.35" width="15.5" height="4.4" rx="2.2" />
      <circle cx="12.35" cy="3.55" r="1.45" fill="#1c1c1e" />
      <rect x="0.75" y="9.25" width="15.5" height="4.4" rx="2.2" />
      <circle cx="4.65" cy="11.45" r="1.45" fill="#1c1c1e" />
    </svg>
  );
}

export function SpotlightSymbol({ className = "h-[14px] w-[14px]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
    >
      <circle cx="6.6" cy="6.6" r="4.55" />
      <path d="M10.05 10.05 14.1 14.1" />
    </svg>
  );
}

export function WifiSymbol({
  on,
  className = "h-[12px] w-[16px]",
}: {
  on: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 18 14"
      className={`${className} ${on ? "text-white" : "text-white/35"}`}
      aria-hidden
    >
      <circle cx="9" cy="12.15" r="1.15" fill="currentColor" />
      <path
        d="M5.55 8.7a5 5 0 0 1 6.9 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="M3.15 6.05a8.2 8.2 0 0 1 11.7 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="M1.05 3.4a11.3 11.3 0 0 1 15.9 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        opacity={on ? 1 : 0.35}
      />
    </svg>
  );
}

/** battery.100percent / battery.75percent + bolt when charging */
export function BatterySymbol({
  charging,
  pct,
  className = "h-[12px] w-[25px]",
}: {
  charging?: boolean;
  pct: number;
  className?: string;
}) {
  const fillW = Math.max(1.2, (Math.min(100, Math.max(0, pct)) / 100) * 13.6);
  return (
    <svg viewBox="0 0 28 13" className={className} aria-hidden>
      <rect
        x="0.7"
        y="1.45"
        width="22.2"
        height="10.1"
        rx="2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path
        d="M23.7 4.2h1.7c.75 0 1.35.55 1.35 1.25v2.1c0 .7-.6 1.25-1.35 1.25h-1.7"
        fill="currentColor"
      />
      <rect
        x="2.35"
        y="3.15"
        width={fillW}
        height="6.7"
        rx="1.15"
        fill="currentColor"
      />
      {charging && (
        <path
          d="M13.05 2.7 10.35 7.15h2.45L11.55 11.2l4.35-5.55h-2.35L15.2 2.7z"
          fill="#1c1c1e"
        />
      )}
    </svg>
  );
}
