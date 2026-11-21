/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,

  // Production optimizations for mobile
  productionBrowserSourceMaps: false,
  eslint: {
    // Prevent ESLint errors from failing the Vercel build
    ignoreDuringBuilds: true,
  },
  // Optimize images for mobile
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000, // 1 year — artist images rarely change
    deviceSizes: [640, 750, 828, 1080, 1200], // Mobile-first device sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Smaller image sizes for mobile
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: "default",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Enhanced experimental features for ultra performance
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-label",
      "@radix-ui/react-toggle",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
    ],
    scrollRestoration: true,
    optimizeCss: true,
  },

  // Turbopack configuration (stable in Next.js 15)
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
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googletagmanager.com https://www.youtube.com https://s.ytimg.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob: https://i.ytimg.com https://img.youtube.com; connect-src 'self' https: wss: https://www.youtube.com; frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://googleads.g.doubleclick.net https://www.google.com; media-src 'self' https: blob: https://www.youtube.com https://youtube.com; object-src 'none'; base-uri 'self'; form-action 'self';",
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
      // Lyrics pages: serve stale while revalidating (matches revalidate = 1 year)
      {
        source: "/lyrics/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=31536000, stale-while-revalidate=86400",
          },
        ],
      },
      // Artist pages: serve stale while revalidating (matches revalidate = 1 week)
      {
        source: "/artists/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
      // Cache static assets for 1 year
      {
        source: "/(.*)\\.(js|css|woff|woff2|ttf|otf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache images for 1 year
      {
        source: "/(.*)\\.(jpg|jpeg|png|gif|svg|ico|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Manifest with moderate cache
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
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
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  // Redirect trailing slashes
  trailingSlash: false,

  // Remove powered by header
  poweredByHeader: false,
  // Modularize imports to reduce bundle size (e.g., lodash)
  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
    },
  },
};

export default nextConfig;
