/**
 * The first frame of the homepage, before (or instead of) WebGL: the signal draws itself
 * across the dark and lays down a small lattice where it lands. Pure SVG + CSS, so it
 * costs nothing on load; reduced-motion visitors get the finished state.
 */
const SIGNAL = "M-40 700 C 220 620, 380 650, 560 480 S 860 300, 1010 330";

function lattice() {
  // Tiny deterministic PRNG so server and client render the same lattice.
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const nodes: [number, number][] = [];
  for (let x = 0; x < 7; x++)
    for (let y = 0; y < 5; y++) {
      if (random() < 0.32) continue;
      nodes.push([860 + x * 62 + (random() - 0.5) * 22, 190 + y * 66 + (random() - 0.5) * 20]);
    }
  const edges: { a: [number, number]; b: [number, number]; delay: number }[] = [];
  nodes.forEach((a, i) =>
    nodes.slice(i + 1).forEach((b) => {
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (d < 92) edges.push({ a, b, delay: Math.hypot(a[0] - 1010, a[1] - 330) / 260 });
    }),
  );
  return { nodes, edges };
}

const { nodes, edges } = lattice();

export function StaticSignal() {
  return (
    <svg className="static-signal" viewBox="0 0 1200 800" preserveAspectRatio="xMaxYMid slice">
      <defs>
        <radialGradient id="pu-signal-glow">
          <stop offset="0" stopColor="#ffc46b" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffc46b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="static-lattice">
        {edges.map(({ a, b, delay }, i) => (
          <line
            key={i}
            x1={a[0]}
            y1={a[1]}
            x2={b[0]}
            y2={b[1]}
            style={{ animationDelay: `${1.1 + delay * 0.6}s` }}
          />
        ))}
        {nodes.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={1.8}
            style={{ animationDelay: `${1.1 + (Math.hypot(x - 1010, y - 330) / 260) * 0.6}s` }}
          />
        ))}
      </g>
      <path className="static-signal-path" d={SIGNAL} pathLength={1} />
      <g className="static-signal-head" style={{ offsetPath: `path("${SIGNAL}")` }}>
        <circle r={16} className="static-signal-glow" />
        <circle r={3.5} />
      </g>
    </svg>
  );
}
