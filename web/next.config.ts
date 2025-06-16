// web/next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // This is the new configuration block you need to add.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/wdir2d6w/production/**',
      },
    ],
  },
};

export default nextConfig;