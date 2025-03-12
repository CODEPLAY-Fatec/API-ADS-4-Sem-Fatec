import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // All requests to `/api/*` will be redirected
        destination: "http://localhost:3001/api/:path*", // Proxy requests to port 3001
      },
    ];
  },
};

export default nextConfig;
