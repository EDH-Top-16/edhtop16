/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/v2",
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/commanders",
      },
    ];
  },
};

module.exports = nextConfig;
