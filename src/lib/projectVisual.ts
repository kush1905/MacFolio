import type { HomeProject } from "@/lib/portfolio";

export type ProjectVisual = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** browser/phone are real captures; cover is concept art. */
  kind: "browser" | "phone" | "cover";
};

/** Picks the most honest visual: a real web capture, then a phone capture, then cover art. */
export function projectVisual(project: HomeProject): ProjectVisual | null {
  const browser = project.screenshots.find((shot) => shot.frame === "browser");
  if (browser) return { ...browser, kind: "browser" };
  const phone = project.screenshots.find((shot) => shot.frame !== "browser");
  if (phone) return { ...phone, kind: "phone" };
  if (project.cover && !project.cover.endsWith(".svg"))
    return { src: project.cover, alt: "", width: 1536, height: 1024, kind: "cover" };
  return null;
}
