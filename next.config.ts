import type { NextConfig } from "next";


const nextConfig: NextConfig = {
    rewrites: async () => [{
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5328/:path*', // Proxy to Backend
    }],
    experimental: {
        proxyTimeout: 120000,
    }
};

export default nextConfig;
