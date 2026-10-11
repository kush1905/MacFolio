/**
 * The first frame of the homepage, before (or instead of) WebGL: the signal rises from the
 * lower right over a field of nodes receding to a horizon — the same composition the 3D
 * scene settles into. Pure SVG + CSS; reduced-motion visitors get the finished state.
 */
const SIGNAL = "M1290 905 C 1190 720, 1080 540, 935 368";
const ROWS = 14;
const HORIZON = 470;
const NEAR = 805;
const VANISH_X = 780;

function rows() {
  return Array.from({ length: ROWS }, (_, r) => {
    const t = r / (ROWS - 1); // 0 = nearest row
    const k = Math.pow(1 - t, 1.8);
    const y = HORIZON + (NEAR - HORIZON) * k;
    const width = 300 + 2700 * k;
    const left = VANISH_X - width / 2;
    const steps = 40;
    // A gentle swell so the field reads as alive, not ruled paper.
    const points = Array.from({ length: steps + 1 }, (_, i) => {
      const u = i / steps;
      const x = left + width * u;
      const swell = Math.sin(u * 11 + r * 0.7) * 5 * (0.3 + k);
      return `${x.toFixed(1)} ${(y + swell).toFixed(1)}`;
    });
    return {
      d: `M${points.join(" L")}`,
      spacing: width / steps,
      dot: 1.2 + 1.6 * k,
      delay: 0.25 + t * 0.9,
      opacity: 0.25 + 0.55 * (1 - t * 0.8),
    };
  });
}

const FIELD = rows();

export function StaticSignal() {
  return (
    <svg className="static-signal" viewBox="0 0 1200 800" preserveAspectRatio="xMaxYMid slice">
      <defs>
        <radialGradient id="pu-signal-glow">
          <stop offset="0" stopColor="#ffc46b" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffc46b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pu-field-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="pu-field-mask">
          <rect width="1200" height="800" fill="url(#pu-field-fade)" />
        </mask>
      </defs>
      <g className="static-field" mask="url(#pu-field-mask)">
        {FIELD.map((row, i) => (
          <g key={i} style={{ animationDelay: `${row.delay}s`, opacity: row.opacity }}>
            <path className="static-field-line" d={row.d} />
            <path
              className="static-field-dots"
              d={row.d}
              strokeWidth={row.dot}
              strokeDasharray={`0 ${row.spacing.toFixed(1)}`}
            />
          </g>
        ))}
      </g>
      <ellipse className="static-field-glow" cx="935" cy="520" rx="240" ry="70" />
      <path className="static-signal-path" d={SIGNAL} pathLength={1} />
      <g className="static-signal-head" style={{ offsetPath: `path("${SIGNAL}")` }}>
        <circle r={20} className="static-signal-glow" />
        <rect x={-70} y={-0.8} width={140} height={1.6} rx={0.8} className="static-signal-streak" />
        <circle r={3.8} />
      </g>
    </svg>
  );
}
