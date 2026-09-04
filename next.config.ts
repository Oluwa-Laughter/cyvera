import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { webpack }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      "@x402/evm": false,
      "@x402/core": false,
      "@x402/svm": false,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      "@x402/evm": false,
      "@x402/core": false,
      "@x402/svm": false,
    };
    if (webpack) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^@x402\//,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
