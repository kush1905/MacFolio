"use client";

import { content } from "@/lib/content";

export function UserAvatar({
  className = "",
  size = 40,
  alt,
}: {
  className?: string;
  size?: number;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={content.about.avatar}
      alt={alt ?? content.about.name}
      width={size}
      height={size}
      draggable={false}
      className={`shrink-0 rounded-full object-cover object-[center_16%] ${className}`}
    />
  );
}
