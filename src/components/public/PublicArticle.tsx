import type { ReactNode } from "react";
import Link from "next/link";
import { PERSON_HEADLINE, PERSON_NAME } from "@/lib/identity";

export function PublicArticle({
  kicker,
  title,
  subtitle,
  updated,
  crumbs,
  children,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  updated?: string;
  crumbs?: { href: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <article className="public-article">
      {crumbs && crumbs.length > 0 ? (
        <nav className="public-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {crumbs.map((crumb) => (
            <span key={crumb.href}>
              <span aria-hidden="true"> / </span>
              <Link href={crumb.href}>{crumb.label}</Link>
            </span>
          ))}
        </nav>
      ) : null}
      {kicker ? <p className="public-kicker">{kicker}</p> : null}
      <h1>{title}</h1>
      {subtitle ? <p className="public-lede">{subtitle}</p> : null}
      <p className="public-byline">
        {PERSON_NAME}
        <span aria-hidden="true"> · </span>
        {PERSON_HEADLINE}
        {updated ? (
          <>
            <span aria-hidden="true"> · </span>
            <time dateTime={updated}>{updated}</time>
          </>
        ) : null}
      </p>
      {children}
    </article>
  );
}

export function ProseSection({
  heading,
  paragraphs,
  bullets,
}: {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}) {
  return (
    <section>
      <h2>{heading}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
      {bullets && bullets.length > 0 ? (
        <ul>
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
