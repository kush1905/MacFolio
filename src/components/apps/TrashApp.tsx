"use client";

export function TrashApp() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-[13px] text-white/55">
      <div className="mb-3 text-5xl opacity-60">🗑</div>
      <div className="font-medium text-white/80">Trash is Empty</div>
      <p className="mt-1 max-w-xs text-center text-white/45">
        Bad commits go here. Placeholder — nothing to restore.
      </p>
    </div>
  );
}
