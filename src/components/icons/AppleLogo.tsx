"use client";

type Props = {
  className?: string;
  /** White mark for dark UI (default). Black for light surfaces. */
  tone?: "white" | "black";
};

/** Macfolio KUSH apple mark. */
export function AppleLogo({ className = "h-14 w-14", tone = "white" }: Props) {
  const src =
    tone === "black"
      ? "/assets/kush/logo.png"
      : "/assets/kush/logo-white.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      className={`select-none object-contain ${className}`}
      aria-hidden
    />
  );
}
