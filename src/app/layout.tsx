import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "macOS Tahoe — Kush Gangwal",
  description:
    "A macOS Tahoe–inspired developer portfolio that behaves like a Mac.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden antialiased">{children}</body>
    </html>
  );
}
