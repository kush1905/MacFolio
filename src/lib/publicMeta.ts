import type { Metadata } from "next";
import { PERSON_NAME, PERSON_TITLE_TAG } from "@/lib/identity";
import { SITE_URL } from "@/lib/site";

export function publicMeta(input: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  type?: "website" | "article" | "profile";
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${input.path}`;
  const resolvedTitle =
    input.absoluteTitle || input.title.includes(PERSON_NAME)
      ? input.title
      : `${input.title} · ${PERSON_NAME}`;
  return {
    title: { absolute: resolvedTitle },
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: resolvedTitle,
      description: input.description,
      url,
      type: input.type === "article" ? "article" : "website",
      siteName: PERSON_NAME,
      locale: "en_IN",
      images: [{ url: input.image ?? "/assets/kush/avatar.png", alt: PERSON_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: input.description,
      creator: "@kushgg19",
      images: [input.image ?? "/assets/kush/avatar.png"],
    },
  };
}

export const aboutTitle = PERSON_TITLE_TAG;
