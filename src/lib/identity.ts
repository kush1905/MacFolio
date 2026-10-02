import { content } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const { about } = content;

export const PERSON_NAME = "Kush Gangwal";
export const PERSON_HEADLINE = "Full Stack Developer & React Native Developer";
export const PERSON_JOB_TITLE = "Full Stack Developer";
export const PERSON_TITLE_TAG = "Kush Gangwal | Full Stack Developer | React Native Developer";
export const ABOUT_PATH = "/about-kush-gangwal";
export const NOW_PATH = "/now";

export const personUrl = `${SITE_URL}${ABOUT_PATH}`;
export const personId = `${personUrl}#person`;

export type OfficialProfile = {
  label: "LinkedIn" | "GitHub" | "LeetCode" | "Medium" | "Dev.to" | "Hashnode" | "X";
  href: string;
  handle: string;
};

function handleFrom(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export const officialProfiles: OfficialProfile[] = [
  { label: "LinkedIn", href: about.links.linkedin, handle: "linkedin.com/in/kush-gangwal" },
  { label: "GitHub", href: about.links.github, handle: "github.com/kush1905" },
  { label: "LeetCode", href: about.links.leetcode, handle: "leetcode.com/u/kushgangwal" },
  { label: "Medium", href: about.links.medium, handle: "medium.com/@kushgangwal" },
  { label: "Dev.to", href: about.links.devto, handle: "dev.to/kushgangwal" },
  { label: "Hashnode", href: about.links.hashnode, handle: "hashnode.com/@kushgangwal" },
  { label: "X", href: about.links.x, handle: "x.com/kushgg19" },
];

export const extraProfiles = [
  { label: "GitHub", href: "https://github.com/Kush-PB", handle: "github.com/Kush-PB" },
  { label: "Instagram", href: about.links.instagram, handle: "instagram.com/kush_gangwal_19" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kush-gangwal-96ab38263", handle: "linkedin.com/in/kush-gangwal-96ab38263" },
  { label: "Potato Bazaar", href: about.links.portfolio, handle: "potatobazaar.com" },
].filter((profile) => profile.href.trim());

export const sameAs = [
  ...officialProfiles.map((profile) => profile.href),
  ...about.sameAsExtra,
  about.links.instagram,
  about.links.portfolio,
].filter((href, index, list) => href.trim() && list.indexOf(href) === index);

export const identityLine = `${PERSON_NAME} · ${PERSON_HEADLINE}`;

export function whoIsKushGangwal() {
  return about.whoIs;
}

export function pageTitle(suffix?: string) {
  return suffix ? `${suffix} | ${PERSON_NAME}` : PERSON_TITLE_TAG;
}

export { SITE_NAME, SITE_URL, handleFrom };
