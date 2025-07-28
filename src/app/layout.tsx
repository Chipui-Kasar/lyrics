import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navigation from "@/components/component/Navigation/Navigation";
import Footer from "@/components/component/Footer/Footer";
import DarkTheme from "@/components/component/DarkTheme/DarkTheme";
import PageLoader from "@/components/component/Spinner/Spinner";
import SessionProviderWrapper from "@/components/component/SessionProviderWrapper";
import Script from "next/script";

const inter = Inter({ 
  subsets: ["latin"], 
  preload: true,
  display: 'swap',
  variable: '--font-inter'
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Tangkhul Song Lyrics | Best Collection of Tangkhul Music",
    template: "%s | Tangkhul Lyrics"
  },
  description:
    "Discover the largest collection of Tangkhul song lyrics online. Find trending hits, traditional favorites, and new releases from your favorite Tangkhul artists. Updated daily with accurate lyrics.",
  applicationName: "Tangkhul Lyrics",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Tangkhul lyrics",
    "Tangkhul songs", 
    "Tangkhul music",
    "Tangkhul Laa lyrics",
    "Manipur songs",
    "Northeast India music",
    "Tribal songs",
    "Traditional music",
    "Contemporary Tangkhul music"
  ],
  authors: [{ name: "Tangkhul Lyrics Team", url: "https://tangkhullyrics.com/about" }],
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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/tangkhullyrics.ico", sizes: "any" },
      { url: "/tangkhullyrics.ico", type: "image/x-icon" },
    ],
    apple: [
      { url: "/tangkhullyrics.ico", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tangkhullyrics.com",
    siteName: "Tangkhul Lyrics",
    title: "Tangkhul Lyrics - Best Collection of Tangkhul Song Lyrics",
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
    title: "Tangkhul Lyrics - Best Collection of Tangkhul Song Lyrics",
    description:
      "Discover the largest collection of Tangkhul song lyrics online. Find trending hits, traditional favorites, and new releases.",
    images: ["/ogImage.jpg"],
  },
  verification: {
    google: "QThzXenD8T7A0SAtb_L2qOy3Wzbw72-7AJfE3vQbxIA",
    yandex: "verification_code_here",
    yahoo: "verification_code_here",
  },
  category: "music",
  classification: "Music & Entertainment",
  other: {
    "google-adsense-account": "ca-pub-1569774903364815",
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#ffffff",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className="font-sans">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1569774903364815"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Tangkhul Lyrics",
            "description": "The largest collection of Tangkhul song lyrics online",
            "url": "https://tangkhullyrics.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://tangkhullyrics.com/search?query={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Tangkhul Lyrics",
              "url": "https://tangkhullyrics.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://tangkhullyrics.com/ogImage.jpg"
              }
            }
          })}
        </Script>
        <SessionProviderWrapper>
          <DarkTheme />
          <header>
            <Navigation />
          </header>
          <main>
            <PageLoader />
            {children}
          </main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
