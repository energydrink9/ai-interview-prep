import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    rewrites: async () => [{
        source: '/api/:path*',
        destination: `http://localhost:5328/:path*`, // Proxy to Backend
    }],
    experimental: {
        proxyTimeout: 120000,
    },
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "*.googleusercontent.com",
            port: "",
            pathname: "**",
          },
        ],
    },
};

export default nextConfig;
