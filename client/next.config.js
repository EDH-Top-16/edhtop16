/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/v2",
        destination: "/v2/commanders",
      },
    ];
  },
  compiler: { relay: require("./relay.config") },
};

module.exports = nextConfig;
