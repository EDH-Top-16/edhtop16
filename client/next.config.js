/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cards.scryfall.io",
      },
    ],
  },
  compiler: { relay: require("./relay.config") },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /lib\/server/ }),
      );
    }

    return config;
  },
};

module.exports = nextConfig;
