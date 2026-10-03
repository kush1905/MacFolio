/** @type {import('next').NextConfig} */
const legacyHosts = [
  "kushgangwal.vercel.app",
  "kushgangwal-macfolio.vercel.app",
  "www.kushgangwal.site",
];

const nextConfig = {
  devIndicators: false,
  serverExternalPackages: ["pg"],
  async redirects() {
    return [
      { source: "/", destination: "/about-kush-gangwal", permanent: true },
      { source: "/who-is-kush-gangwal", destination: "/about-kush-gangwal", permanent: true },
      { source: "/kush-gangwal", destination: "/about-kush-gangwal", permanent: true },
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
          destination: "https://kushgangwal.site/about-kush-gangwal",
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
