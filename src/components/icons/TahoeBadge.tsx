export function TahoeBadge({
  size = 52,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.35)] ring-1 ring-white/15 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 30% 25%, #7ec8ff 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 75% 70%, #3a6cff 0%, transparent 50%), linear-gradient(155deg, #1a4a8a 0%, #0a2a6a 40%, #1e5a9e 70%, #4a90d9 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 120% 40% at 50% 0%, rgba(255,255,255,0.35), transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center font-semibold tracking-tight text-white/90"
        style={{
          fontSize: size * 0.38,
          textShadow: "0 1px 8px rgba(0,40,100,0.55)",
        }}
      >
        26
      </div>
    </div>
  );
}
