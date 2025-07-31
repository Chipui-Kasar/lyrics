/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [], // Add external domains if needed
    remotePatterns: [
      // Add remote patterns for external images if needed
    ],
  },

  // Remove unused imports at build time
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-label",
      "@radix-ui/react-toggle",
    ],
  },

  // Turbopack configuration (stable in Next.js 15+)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Enhanced security headers for Best Practices score
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=(), accelerometer=(), gyroscope=(), magnetometer=(), midi=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googletagmanager.com https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob: https://i.ytimg.com https://img.youtube.com; connect-src 'self' https: wss: https://www.youtube.com; frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://googleads.g.doubleclick.net https://www.google.com; media-src 'self' https: blob: https://www.youtube.com https://youtube.com; object-src 'none'; base-uri 'self'; form-action 'self';",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
        ],
      },
    ];
  },

  // Redirect trailing slashes
  trailingSlash: false,

  // Remove powered by header
  poweredByHeader: false,

  // Note: Webpack config removed in favor of Turbopack
  // Turbopack handles module optimization automatically
};

export default nextConfig;
