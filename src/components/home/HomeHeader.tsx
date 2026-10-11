"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useSceneStore } from "@/store/sceneStore";

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#core", label: "Stack" },
  { href: "/about-kush-gangwal", label: "About" },
  { href: "/blog", label: "Writing" },
];

export function HomeHeader() {
  const openPalette = useSceneStore((state) => state.openPalette);
  const mac = useSyncExternalStore(
    () => () => {},
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => true,
  );

  return (
    <header className="home-header">
      <Link className="home-brand" href="/" aria-label="Kush Gangwal, home">
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG mark, no optimisation needed */}
        <img src="/assets/kush/mark.svg" alt="" width={32} height={32} />
        <span>Kush Gangwal</span>
      </Link>
      <nav aria-label="Primary">
        {NAV.map((item) =>
          item.href.startsWith("#") ? (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ) : (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ),
        )}
      </nav>
      <div className="home-header-actions">
        <button type="button" className="ask-trigger" onClick={() => openPalette()}>
          Ask <kbd>{mac ? "⌘" : "Ctrl"} K</kbd>
        </button>
        <a className="btn btn-primary btn-small" href="#contact">
          Contact
        </a>
      </div>
    </header>
  );
}
