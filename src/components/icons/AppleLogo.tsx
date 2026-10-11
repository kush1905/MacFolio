"use client";

type Props = {
  className?: string;
  /** White mark for dark UI (default). Black for light surfaces. */
  tone?: "white" | "black";
};

/** The "K" signal mark (public/assets/kush/mark.svg). */
export function AppleLogo({ className = "h-14 w-14", tone = "white" }: Props) {
  void tone;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/kush/mark.svg"
      alt=""
      draggable={false}
      className={`select-none rounded-[4px] object-cover ${className}`}
      aria-hidden
    />
  );
}
