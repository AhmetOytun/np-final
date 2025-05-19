import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow all HTTPS hostnames
      },
      {
        protocol: "http",
        hostname: "**", // allow all HTTP hostnames if needed
      },
    ],
  },
};

export default nextConfig;
