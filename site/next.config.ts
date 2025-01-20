import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'export',
    basePath: process.env.NODE_ENV === 'development' ? '' : '/tab-samurai',
    assetPrefix: process.env.NODE_ENV === 'development' ? '' : '/tab-samurai/',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
