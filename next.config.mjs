/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Remove unused imports at build time
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-label', '@radix-ui/react-toggle'],
  },
  
  // Turbopack configuration (stable in Next.js 15+)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Redirect trailing slashes
  trailingSlash: false,
  
  // Remove powered by header
  poweredByHeader: false,
  
  // Webpack optimization (only when not using Turbopack)
  webpack: (config, { dev, isServer }) => {
    // Only apply webpack optimizations in production builds without turbopack
    if (!dev && !isServer && process.env.NODE_ENV === 'production') {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    return config;
  },
};

export default nextConfig;
