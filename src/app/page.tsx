import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { OS } from "@/components/OS";
import { PERSON_HEADLINE, PERSON_NAME, PERSON_TITLE_TAG } from "@/lib/identity";
import { homeDescription, homeGraph, products } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: PERSON_TITLE_TAG,
  },
  description: homeDescription,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: PERSON_TITLE_TAG,
    description: homeDescription,
    url: SITE_URL,
    type: "profile",
    firstName: "Kush",
    lastName: "Gangwal",
    username: "kushgangwal",
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={homeGraph()} />
      <article className="seo-fallback">
        <h1>{PERSON_NAME}</h1>
        <p>{PERSON_HEADLINE}</p>
        <p className="who-is-kush-gangwal">
          Kush Gangwal is a Full Stack Developer from India specializing in React Native, React.js,
          Next.js, Node.js and AI-powered applications. He has worked on Potato Bazaar, Tybee Go,
          Nexus, Resumind, and CodeMace.
        </p>
        <nav>
          <Link href="/about-kush-gangwal">About Kush Gangwal</Link>
          <Link href="/now">Now</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Writing</Link>
          {products.map((product) => (
            <Link key={product.slug} href={`/projects/${product.slug}`}>
              {product.name}
            </Link>
          ))}
        </nav>
      </article>
      <OS />
    </>
  );
}
