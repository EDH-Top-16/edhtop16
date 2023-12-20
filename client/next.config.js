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
  compiler: { relay: require("./relay.config") },
};

module.exports = nextConfig;
