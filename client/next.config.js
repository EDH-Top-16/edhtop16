/** @type {import('next').NextConfig} */
const nextConfig = {
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
