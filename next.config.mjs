/** @type {import('next').NextConfig} */
const legacyHosts = [
  "kushgangwal.vercel.app",
  "kushgangwal-macfolio.vercel.app",
  "www.kushgangwal.site",
];

const nextConfig = {
  devIndicators: false,
  serverExternalPackages: ["pg"],
  experimental: {
    // Public pages ship ~8 KB (gzip) of CSS; inlining it removes three render-blocking
    // requests on first visit, which is most portfolio traffic.
    inlineCss: true,
  },
  async redirects() {
    return [
      // "/" was a 308 to /about-kush-gangwal until the 3D homepage launched (2026-10).
      { source: "/who-is-kush-gangwal", destination: "/about-kush-gangwal", permanent: true },
      { source: "/kush-gangwal", destination: "/about-kush-gangwal", permanent: true },
      // Bakaner (Dhar, Madhya Pradesh) was wrongly merged with Bikaner (Rajasthan).
      { source: "/kush-gangwal-bikaner", destination: "/kush-gangwal-bakaner", permanent: true },
      { source: "/portfolio", destination: "/kush-gangwal-portfolio", permanent: true },
      { source: "/writing", destination: "/blog", permanent: true },
      { source: "/for-ai", destination: "/knowledge-base", permanent: true },
      { source: "/llm-profile", destination: "/knowledge-base", permanent: true },
      { source: "/sk-groups", destination: "/companies/sk-groups", permanent: true },
      { source: "/sk-agri-exports", destination: "/companies/sk-agri-exports-private-limited", permanent: true },
      {
        source: "/sk-agri-exports-private-limited",
        destination: "/companies/sk-agri-exports-private-limited",
        permanent: true,
      },
      { source: "/mantra-agri-solutions", destination: "/companies/mantra-agri-solutions", permanent: true },
      { source: "/potato-trading", destination: "/industries/potato-trading", permanent: true },
      { source: "/cold-storage", destination: "/industries/cold-storage", permanent: true },
      { source: "/agri-marketplace", destination: "/industries/agri-marketplace", permanent: true },
      { source: "/agriculture-logistics", destination: "/industries/agriculture-logistics", permanent: true },
      { source: "/farmer-marketplace", destination: "/industries/farmer-marketplace", permanent: true },
      { source: "/agri-export-platform", destination: "/industries/agri-export-platform", permanent: true },
      ...legacyHosts.flatMap((host) => [
        {
          source: "/",
          has: [{ type: "host", value: host }],
          destination: "https://kushgangwal.site/",
          permanent: true,
        },
        {
          source: "/:path*",
          has: [{ type: "host", value: host }],
          destination: "https://kushgangwal.site/:path*",
          permanent: true,
        },
      ]),
    ];
  },
};

export default nextConfig;
