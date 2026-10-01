/** SF Symbol–style glyphs sized for Finder sidebar (~16pt optical) */

type Props = { className?: string; active?: boolean };

const accent = "var(--mac-accent)";

export function SFClock({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.25" stroke={accent} strokeWidth="1.35" />
      <path
        d="M8 4.75V8.1l2.35 1.45"
        stroke={accent}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SFAppGrid({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      {[
        [2.2, 2.2],
        [6.5, 2.2],
        [10.8, 2.2],
        [2.2, 6.5],
        [6.5, 6.5],
        [10.8, 6.5],
        [2.2, 10.8],
        [6.5, 10.8],
        [10.8, 10.8],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="3"
          height="3"
          rx="0.7"
          fill={accent}
        />
      ))}
    </svg>
  );
}

export function SFDownload({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path
        d="M8 2.5v7.2M5.2 7.2L8 10l2.8-2.8"
        stroke={accent}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12.5h10"
        stroke={accent}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SFDesktop({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <rect
        x="1.75"
        y="2.25"
        width="12.5"
        height="8.25"
        rx="1.4"
        stroke={accent}
        strokeWidth="1.3"
      />
      <path
        d="M5.5 13.25h5M8 10.5v2.75"
        stroke={accent}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SFDocuments({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path
        d="M4 1.75h5.1L12.5 5.2V14.25H4V1.75z"
        stroke={accent}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M9 1.75V5.4h3.5"
        stroke={accent}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M6 8h4.2M6 10.25h4.2"
        stroke={accent}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SFPerson({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="8" cy="5.2" r="2.55" fill={accent} />
      <path
        d="M2.8 13.3c0-2.55 2.3-4.15 5.2-4.15s5.2 1.6 5.2 4.15"
        fill={accent}
      />
    </svg>
  );
}

export function SFFolder({
  className = "h-4 w-4",
  color = accent,
}: Props & { color?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path
        d="M1.75 4.4c0-.9.7-1.65 1.6-1.65H6.1l1.35 1.45h5.2c.9 0 1.6.75 1.6 1.65v6.55c0 .9-.7 1.65-1.6 1.65h-9.3c-.9 0-1.6-.75-1.6-1.65V4.4z"
        fill={color}
      />
    </svg>
  );
}

export function SFPdf({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path
        d="M3.5 1.5h5.2L12.5 5.3V14.5H3.5V1.5z"
        fill="#FF453A"
      />
      <path d="M8.7 1.5V5.5h4" fill="#FF6961" />
      <text
        x="8"
        y="11.2"
        textAnchor="middle"
        fill="white"
        fontSize="3.6"
        fontWeight="700"
        fontFamily="SF Pro Text, Helvetica Neue, sans-serif"
      >
        PDF
      </text>
    </svg>
  );
}

export function SFiCloud({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path
        d="M4.4 12.25h7.3a2.85 2.85 0 00.25-5.68A3.85 3.85 0 008.2 3.1a3.9 3.9 0 00-3.55 2.35A2.95 2.95 0 004.4 12.25z"
        fill={accent}
      />
    </svg>
  );
}

export function SFHome({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path
        d="M2.25 7.1L8 2.6l5.75 4.5V13.1a1 1 0 01-1 1H9.1V9.6H6.9V14.1H3.25a1 1 0 01-1-1V7.1z"
        fill={accent}
      />
    </svg>
  );
}

export function SFAirDrop({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <circle cx="8" cy="8" r="1.65" fill={accent} />
      <circle cx="8" cy="8" r="3.85" stroke={accent} strokeWidth="1.25" />
      <circle
        cx="8"
        cy="8"
        r="5.95"
        stroke={accent}
        strokeWidth="1.15"
        opacity="0.45"
      />
    </svg>
  );
}

export function SFTrash({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path
        d="M3.25 4.25h9.5M6 4.25l.45-1.35h3.1L10 4.25M4.35 4.25l.7 9.1c.05.55.5 1 1.05 1h4c.55 0 1-.45 1.05-1l.7-9.1"
        stroke="#98989D"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SFCloudBadge({ className = "h-2.5 w-3" }: Props) {
  return (
    <svg viewBox="0 0 12 9" className={className} aria-hidden>
      <path
        d="M3.1 7.6h5.9A2.2 2.2 0 009.2 3.4 2.95 2.95 0 006.15 1.2 2.9 2.9 0 003.5 2.95 2.25 2.25 0 003.1 7.6z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Large Finder folder icon (icon view) */
export function FinderFolderIcon({
  color = "#1A96F0",
  className = "h-[64px] w-[76px]",
}: {
  color?: string;
  className?: string;
}) {
  const dark = shade(color, -28);
  const light = shade(color, 18);
  const id = color.replace("#", "");
  return (
    <svg viewBox="0 0 76 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={`fg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <linearGradient id={`fb-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
      </defs>
      <path
        d="M6 18c0-3.3 2.5-6 5.6-6h16.2l5.2 5.8H64.4c3.1 0 5.6 2.7 5.6 6v2.2H6V18z"
        fill={`url(#fg-${id})`}
      />
      <path
        d="M4 26.5c0-2.8 2.3-5 5.1-5h57.8c2.8 0 5.1 2.2 5.1 5V52c0 3.3-2.7 6-6 6H10c-3.3 0-6-2.7-6-6V26.5z"
        fill={`url(#fb-${id})`}
      />
      <path d="M4 28h68v4.5H4z" fill="#fff" opacity="0.12" />
    </svg>
  );
}

export function FinderPdfIcon({ className = "h-[68px] w-[54px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 54 68" className={className} aria-hidden>
      <defs>
        <linearGradient id="pdfPaper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0f0f2" />
        </linearGradient>
        <filter id="pdfShadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#pdfShadow)">
        <path
          d="M4 2h32l14 14v48a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z"
          fill="url(#pdfPaper)"
        />
        <path d="M36 2v12a2 2 0 002 2h12L36 2z" fill="#D1D1D6" />
        <rect x="8" y="40" width="38" height="14" rx="2" fill="#FF3B30" />
        <text
          x="27"
          y="50.5"
          textAnchor="middle"
          fill="white"
          fontSize="9"
          fontWeight="700"
          fontFamily="SF Pro Text, Helvetica Neue, sans-serif"
          letterSpacing="0.4"
        >
          PDF
        </text>
        <path
          d="M10 16h22M10 22h26M10 28h18"
          stroke="#C7C7CC"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function FinderImageIcon({ className = "h-[64px] w-[76px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="imgBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1040" />
          <stop offset="45%" stopColor="#6b3fa0" />
          <stop offset="100%" stopColor="#ff8a5c" />
        </linearGradient>
        <filter id="imgShadow" x="-15%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.4" floodOpacity="0.4" />
        </filter>
      </defs>
      <g filter="url(#imgShadow)">
        <rect x="4" y="4" width="68" height="56" rx="6" fill="url(#imgBg)" />
        <circle cx="24" cy="22" r="6" fill="#fff" opacity="0.85" />
        <path
          d="M4 44l16-12 12 9 14-14 26 20v7a6 6 0 01-6 6H10a6 6 0 01-6-6v-10z"
          fill="#000"
          opacity="0.25"
        />
      </g>
    </svg>
  );
}

function shade(hex: string, amt: number) {
  const n = hex.replace("#", "");
  const full = n.length === 3 ? n.replace(/(.)/g, "$1$1") : n;
  const num = parseInt(full, 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
