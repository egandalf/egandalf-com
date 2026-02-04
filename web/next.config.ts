import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    // Skip image optimization in development to avoid SSL issues
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
