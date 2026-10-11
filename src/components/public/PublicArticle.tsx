import { ViewTransition, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { RelatedEntities } from "@/components/public/RelatedEntities";
import { PERSON_HEADLINE, PERSON_NAME } from "@/lib/identity";

/**
 * The signal line under every page hero (decorative). It hugs the hero's bottom edge
 * beneath the text and only rises at the far right, so it never crosses copy.
 */
function PageSignal() {
  return (
    <>
      <svg className="pa-signal" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="pa-signal-path"
          d="M-10 396 C 260 392, 470 372, 600 300 S 730 120, 780 90"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="pa-signal-head" aria-hidden="true" />
    </>
  );
}

export function PublicArticle({
  kicker,
  title,
  subtitle,
  updated,
  crumbs,
  portrait,
  transitionName,
  aside,
  actions,
  width = "prose",
  children,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  updated?: string;
  crumbs?: { href: string; label: string }[];
  portrait?: { src: string; alt: string };
  /** Shared view-transition name, so the homepage title morphs into this one. */
  transitionName?: string;
  /** Right-hand hero content on wide screens (facts, a cover). Portraits render here too. */
  aside?: ReactNode;
  /** Buttons under the lede. */
  actions?: ReactNode;
  /** "wide" for index pages with card grids. */
  width?: "prose" | "wide";
  children: ReactNode;
}) {
  const side =
    aside ??
    (portrait ? (
      <figure className="pa-portrait">
        <Image src={portrait.src} alt={portrait.alt} width={1024} height={1024} sizes="(max-width: 900px) 60vw, 340px" priority />
      </figure>
    ) : null);

  return (
    <article className={`pa pa-${width}`}>
      <header className="pa-hero">
        <PageSignal />
        <div className={side ? "pa-hero-inner pa-hero-split" : "pa-hero-inner"}>
          <div className="pa-hero-main">
            {crumbs && crumbs.length > 0 ? (
              <nav className="pa-crumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                {crumbs.map((crumb) => (
                  <span key={crumb.href}>
                    <span aria-hidden="true">/</span>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </span>
                ))}
              </nav>
            ) : null}
            {kicker ? <p className="eyebrow">{kicker}</p> : null}
            <h1 className="pa-title">
              {transitionName ? (
                <ViewTransition name={transitionName}>
                  <span>{title}</span>
                </ViewTransition>
              ) : (
                title
              )}
            </h1>
            {subtitle ? <p className="pa-lede">{subtitle}</p> : null}
            <p className="pa-byline">
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG mark */}
              <img src="/assets/kush/mark.svg" alt="" width={22} height={22} />
              <span>{PERSON_NAME}</span>
              <span aria-hidden="true">·</span>
              <span>{PERSON_HEADLINE}</span>
              {updated ? (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={updated}>Updated {updated}</time>
                </>
              ) : null}
            </p>
            {actions ? <div className="pa-actions">{actions}</div> : null}
          </div>
          {side ? <div className="pa-hero-aside">{side}</div> : null}
        </div>
      </header>
      <div className="pa-body">{children}</div>
      <RelatedEntities />
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

/** A small "label / value" facts card for hero asides. */
export function FactsCard({ title, facts }: { title?: string; facts: { label: string; value: ReactNode }[] }) {
  return (
    <div className="pa-facts">
      {title ? <p className="pa-facts-title">{title}</p> : null}
      <dl>
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
