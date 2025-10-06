import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static optimization
  output: "standalone",
  // Configure caching
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
