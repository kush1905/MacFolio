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
    ];
  },
};

export default nextConfig;
