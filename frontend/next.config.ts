import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    console.log('Backend URL from env:', process.env.NEXT_PUBLIC_API_BASE_URL);
    console.log('Using backend URL:', backendUrl);
    
    // Ensure the URL has proper protocol
    let finalUrl = backendUrl;
    if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
      finalUrl = 'http://localhost:8000';
      console.log('Invalid URL format, using default:', finalUrl);
    }
    
    return [
      {
        source: '/api/:path*',
        destination: `${finalUrl}/api/:path*`,
      },
    ];
  },
  // Enable webpack polling for Docker on Windows
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay rebuild after changes
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

export default nextConfig;
