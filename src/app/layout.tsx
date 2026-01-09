import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navigation from "@/components/component/Navigation/Navigation";
import Footer from "@/components/component/Footer/Footer";
import SessionProviderWrapper from "@/components/component/SessionProviderWrapper";
import SessionValidator from "@/components/SessionValidator";
import ErrorBoundary from "@/components/component/ErrorBoundary/ErrorBoundary";
import Script from "next/script";
import ClientShell from "@/components/component/ClientShell/ClientShell";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: true,
  display: "swap",
  variable: "--font-inter",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Arial",
    "sans-serif",
  ],
  adjustFontFallback: true, // Reduce layout shift
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  title: {
    default: "Tangkhul Song Lyrics | Best Collection of Tangkhul Music",
    template: "%s | Tangkhul Lyrics",
  },
  description:
    "Discover the largest collection of Tangkhul song lyrics online. Find trending hits, traditional favorites, and new releases from your favorite Tangkhul artists. Updated daily with accurate lyrics. | Tangkhul Lyrics Translation",
  applicationName: "Tangkhul Lyrics",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Tangkhul lyrics",
    "Tangkhul artists",
    "Tangkhul lyrics translation",
    "Tangkhul songs",
    "Tangkhul music",
    "Tangkhul Laa lyrics",
    "Manipur songs",
    "Northeast India music",
    "Tribal songs",
    "Traditional music",
    "Contemporary Tangkhul music",
    "Tangkhul song lyrics translation",
    "Tangkhul song meanings",
  ],
  authors: [
    { name: "Tangkhul Lyrics Team", url: "https://tangkhullyrics.com/about" },
  ],
  creator: "Tangkhul Lyrics",
  publisher: "Tangkhul Lyrics",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://tangkhullyrics.com"),
  alternates: {
    canonical: "https://tangkhullyrics.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
      { url: "/tangkhullyrics.ico", sizes: "46x46", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    shortcut: "/tangkhullyrics.ico",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#667eea",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tangkhullyrics.com",
    siteName: "Tangkhul Lyrics",
    title:
      "Tangkhul Lyrics - Best Collection of Tangkhul Song Lyrics | Tangkhul Lyrics Translation",
    description:
      "Discover the largest collection of Tangkhul song lyrics online. Find trending hits, traditional favorites, and new releases from your favorite Tangkhul artists.",
    images: [
      {
        url: "/ogImage.jpg",
        width: 1200,
        height: 630,
        alt: "Tangkhul Song Lyrics Collection",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TangkhulLyrics",
    creator: "@TangkhulLyrics",
    title:
      "Tangkhul Lyrics - Best Collection of Tangkhul Song Lyrics | Tangkhul Lyrics Translation",
    description:
      "Discover the largest collection of Tangkhul song lyrics online. Find trending hits, traditional favorites, and new releases.",
    images: ["/ogImage.jpg"],
  },
  verification: {
    google: "QThzXenD8T7A0SAtb_L2qOy3Wzbw72-7AJfE3vQbxIA",
    yandex: "27e339faa60d25cd",
  },
  category: "music",
  classification: "Music & Entertainment",
  other: {
    "google-adsense-account": "ca-pub-1569774903364815",
    "msapplication-TileColor": "#FAD4F1",
    "theme-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Tangkhul Lyrics",
    "mobile-web-app-capable": "yes",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const dynamic = "force-static";
export const revalidate = 3600; // Increased to 1 hour for better caching

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        {/* Preconnect for external resources - high priority */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Preload critical font files to reduce FCP/LCP */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external resources - lower priority */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Preload only critical LCP image */}
        <link
          rel="preload"
          href="/ogImage.jpg"
          as="image"
          type="image/jpeg"
          fetchPriority="high"
        />

        {/* Critical CSS for LCP optimization */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .above-fold { content-visibility: visible; contain: none; }
            .layout-stable { contain: layout style paint; }
            .skeleton-loading { background-color: hsl(200, 20%, 90%); }
            /* Font fallback to reduce CLS */
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }
          `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <noscript>
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#f3f4f6",
            }}
          >
            JavaScript is required for the best experience on Tangkhul Lyrics.
          </div>
        </noscript>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1569774903364815"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Tangkhul Lyrics",
            description:
              "The largest collection of Tangkhul song lyrics online",
            url: "https://tangkhullyrics.com",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://tangkhullyrics.com/search?query={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
            publisher: {
              "@type": "Organization",
              name: "Tangkhul Lyrics",
              url: "https://tangkhullyrics.com",
              logo: {
                "@type": "ImageObject",
                url: "https://tangkhullyrics.com/ogImage.jpg",
              },
            },
          })}
        </Script>
        <SessionProviderWrapper>
          <SessionValidator>
            <ErrorBoundary>
              <ClientShell />
              <header>
                <Navigation />
              </header>
              <main>{children}</main>
              <Footer />
            </ErrorBoundary>
          </SessionValidator>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
