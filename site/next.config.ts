import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'export',
    basePath: '/tab-samurai',
    assetPrefix: '/tab-samurai/',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
