"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useSceneStore } from "@/store/sceneStore";

/** Primary navigation. Section links point at homepage anchors. */
const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
  { href: "/about-kush-gangwal", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/stack", label: "Stack" },
  { href: "/desktop", label: "Macfolio" },
];

const subscribeNoop = () => () => {};

export function SiteHeader() {
  const pathname = usePathname();
  const openPalette = useSceneStore((state) => state.openPalette);
  const menu = useRef<HTMLDetailsElement>(null);
  const mac = useSyncExternalStore(
    subscribeNoop,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => true,
  );

  // Close the mobile menu after navigating.
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname]);

  const isCurrent = (href: string) =>
    href.startsWith("/#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  const links = NAV.map((item) => (
    <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
      {item.label}
    </Link>
  ));

  return (
    <header className="site-header">
      <Link className="site-brand" href="/" aria-label="Kush Gangwal, home">
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG mark */}
        <img src="/assets/kush/mark.svg" alt="" width={32} height={32} />
        <span>Kush Gangwal</span>
      </Link>
      <nav className="site-nav" aria-label="Primary">
        {links}
      </nav>
      <div className="site-actions">
        <button type="button" className="ask-trigger" onClick={() => openPalette()}>
          Ask <kbd>{mac ? "⌘" : "Ctrl"} K</kbd>
        </button>
        <Link className="btn btn-primary btn-small" href="/#contact">
          Contact
        </Link>
        <details className="site-menu" ref={menu}>
          <summary aria-label="Menu">
            <span aria-hidden="true" />
          </summary>
          <nav aria-label="Menu">{links}</nav>
        </details>
      </div>
    </header>
  );
}
