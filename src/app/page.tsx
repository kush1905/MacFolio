import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { OS } from "@/components/OS";
import { homeDescription, homeGraph } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Kush Gangwal — Junior Software Developer at SK Groups",
  },
  description: homeDescription,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Kush Gangwal — Junior Software Developer",
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
      <OS />
    </>
  );
}
