import type { Metadata } from "next";
import "./globals.css";
import { homeDescription } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Junior Software Developer`,
    template: "%s · Kush Gangwal",
  },
  description: homeDescription,
  applicationName: "Macfolio",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "portfolio",
  keywords: [
    "Kush Gangwal",
    "SK Groups",
    "SK Agri Exports Private Ltd",
    "AgniPratap Singh Chouhan",
    "Yuvraj Singh",
    "Ansh Kumar Rana",
    "Akshat Agrawal",
    "Gregory Dsouza",
    "Founding Engineer",
    "Protonshub Technologies",
    "Django Softwares",
    "Potato Bazaar",
    "Tybee Go",
    "Findanio",
    "Scalelr",
    "Nexus",
    "Macfolio",
    "Medicaps University",
    "Junior Software Developer",
    "Indore",
  ],
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
    title: `${SITE_NAME} — Junior Software Developer`,
    description: homeDescription,
    images: [{ url: "/assets/kush/avatar.png", alt: "Kush Gangwal" }],
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — Junior Software Developer`,
    description: homeDescription,
    images: ["/assets/kush/avatar.png"],
  },
  icons: {
    icon: "/assets/kush/logo-icon.png",
    apple: "/assets/kush/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-full">
      <head>
        <link
          rel="preload"
          as="image"
          href="/assets/macos/wallpapers/space-black.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
