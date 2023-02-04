/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/organizations",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
