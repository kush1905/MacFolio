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
