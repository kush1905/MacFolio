/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  serverExternalPackages: ["pg"],
  async redirects() {
    return [
      { source: "/who-is-kush-gangwal", destination: "/about-kush-gangwal", permanent: true },
      { source: "/kush-gangwal", destination: "/about-kush-gangwal", permanent: true },
      { source: "/portfolio", destination: "/kush-gangwal-portfolio", permanent: true },
      { source: "/writing", destination: "/blog", permanent: true },
      {
        source: "/",
        has: [{ type: "host", value: "kushgangwal-macfolio.vercel.app" }],
        destination: "https://kushgangwal.vercel.app/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "kushgangwal-macfolio.vercel.app" }],
        destination: "https://kushgangwal.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
