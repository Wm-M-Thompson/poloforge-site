import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "images.poloforge.com",
      },
      {
        protocol: "https",
        hostname: "images.thompsonsoftware.tech",
      },      
      {
        protocol: "https",
        hostname: "images.poloforge.com",
      },
    ],
  },
};

export default nextConfig;
