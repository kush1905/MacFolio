/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  serverExternalPackages: ["pg"],
  async redirects() {
    return [
      "/profile",
      "/faq",
      "/accounts",
      "/work/:slug",
      "/projects/:slug",
      "/people/:slug",
      "/education/:slug",
    ].map((source) => ({ source, destination: "/", permanent: true }));
  },
};

export default nextConfig;
