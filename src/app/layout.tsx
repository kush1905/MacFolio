import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { PERSON_NAME, PERSON_TITLE_TAG } from "@/lib/identity";
import { defaultKeywords, homeDescription } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Only the two faces every page shows above the fold are preloaded; the italic display
// face (homepage tagline) and the mono labels load on demand with font-display: swap.
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});
const displayItalic = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-display-italic",
  display: "swap",
  preload: false,
});
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", preload: false });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: PERSON_TITLE_TAG,
    template: "%s · Kush Gangwal",
  },
  description: homeDescription,
  applicationName: "Macfolio",
  authors: [{ name: SITE_NAME, url: `${SITE_URL}/about-kush-gangwal` }],
  creator: PERSON_NAME,
  publisher: PERSON_NAME,
  category: "portfolio",
  keywords: defaultKeywords,
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: PERSON_TITLE_TAG,
    description: homeDescription,
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: PERSON_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: PERSON_TITLE_TAG,
    description: homeDescription,
    creator: "@kushgg19",
    images: ["/og/home.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${displayItalic.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <link rel="alternate" type="application/rss+xml" title="Kush Gangwal" href="/feed.xml" />
        <link rel="author" href="/about-kush-gangwal" />
        <link rel="me" href="https://github.com/kush1905" />
        <link rel="me" href="https://www.linkedin.com/in/kush-gangwal" />
        <link rel="me" href="https://leetcode.com/u/kushgangwal" />
        <link rel="me" href="https://medium.com/@kushgangwal" />
        <link rel="me" href="https://dev.to/kushgangwal" />
        <link rel="me" href="https://hashnode.com/@kushgangwal" />
        <link rel="me" href="https://x.com/kushgg19" />
      </head>
      <body>{children}</body>
    </html>
  );
}
