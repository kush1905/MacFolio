"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DESKTOP_LAYOUT_WIDTH } from "@/lib/desktopMode";

const BOT_UA =
  /Googlebot|Google-InspectionTool|bingbot|BingPreview|Baiduspider|Yandex|DuckDuckBot|Slurp|GPTBot|ChatGPT|ClaudeBot|Perplexity|Applebot|Bytespider|facebookexternalhit|LinkedInBot|Twitterbot|Slackbot/i;

function isCrawler() {
  return BOT_UA.test(navigator.userAgent || "");
}

function isPhoneHardware() {
  const min = Math.min(screen.width || 0, screen.height || 0);
  const touch = (navigator.maxTouchPoints || 0) > 0 || "ontouchend" in document;
  return touch && min > 0 && min < 600;
}

function requestedDesktopSite() {
  if (!isPhoneHardware()) return false;
  const ua = navigator.userAgent || "";
  const ch = (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData;
  if (ch && typeof ch.mobile === "boolean") return ch.mobile === false;
  if (/Macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1) return true;
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return true;
  if (!/iPhone|iPod|Mobile/i.test(ua)) return true;
  const vw = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
  return vw >= 980;
}

export function syncDisplayMode(pathname = window.location.pathname) {
  const publicPage = pathname !== "/";
  const allowed =
    isCrawler() || publicPage || requestedDesktopSite() || window.innerWidth >= 1100;
  document.documentElement.setAttribute("data-display-mode", allowed ? "desktop" : "mobile");
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    meta.setAttribute(
      "content",
      allowed && isPhoneHardware() && !publicPage && !isCrawler()
        ? `width=${DESKTOP_LAYOUT_WIDTH}`
        : "width=device-width, initial-scale=1",
    );
  }
  return allowed;
}

export function useDesktopAllowed() {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const sync = () => setAllowed(syncDisplayMode(pathname));
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, [pathname]);

  return allowed;
}

export function useIsOsHome() {
  return usePathname() === "/";
}
