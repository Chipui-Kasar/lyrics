import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navigation from "@/components/component/Navigation/Navigation";
import Footer from "@/components/component/Footer/Footer";
import DarkTheme from "@/components/component/DarkTheme/DarkTheme";
import PageLoader from "@/components/component/Spinner/Spinner";
import SessionProviderWrapper from "@/components/component/SessionProviderWrapper";
// const ico = require("../../public/tangkhullyrics.ico");

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tangkhul Song Lyrics",
  description:
    "Tangkhul Song Lyrics offers the best collection of Tangkhul song lyrics, including new releases, trending hits, and traditional favorites—updated regularly for every music lover. Tangkhul Lyrics | Tangkhul Laa Lyrics | Tangkhul Songs Lyrics | Tangkhul Lyrical Oasis",
  // viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
  metadataBase: new URL("https://tangkhullyrics.com/"),
  authors: [{ name: "Tangkhul Lyrics", url: "https://tangkhullyrics.com/" }],
  creator: "Tangkhul Lyrics",
  publisher: "Tangkhul Lyrics",
  icons: {
    icon: "/tangkhullyrics.ico",
  },
  openGraph: {
    type: "website",
    url: "https://tangkhullyrics.com/",
    title:
      "Tangkhul Laa Lyrics – Latest Tangkhul Song Lyrics Collection | Tangkhul Songs Lyrics",
    description:
      "Discover the latest Tangkhul songs and lyrics. Tangkhul Laa Lyrics offers a rich collection of traditional and modern Tangkhul song lyrics for every music lover.",
    images: [
      {
        url: "/ogImage.jpg",
        width: 1200,
        height: 630,
        alt: "Tangkhul Song Lyrics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Tangkhul Laa Lyrics – Latest Tangkhul Song Lyrics Collection | Tangkhul Songs Lyrics",
    description:
      "Explore trending Tangkhul songs and lyrics. Tangkhul Laa Lyrics brings you the best of traditional and new Tangkhul music.",
    images: ["/ogImage.jpg"],
  },
  verification: {
    google: "ca-pub-1569774903364815",
  },
  other: {
    keywords:
      "lyrics, tangkhul, tangkhul lyrics, tangkhul laa, tangkhul laa lyrics",
    "google-adsense-account": "ca-pub-1569774903364815",
  },
};
export const dynamic = "force-static";
export const revalidate = 300;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <SessionProviderWrapper>
          <DarkTheme />
          <header>
            <Navigation />
          </header>
          <div>
            <PageLoader />
            {children}
          </div>
          <footer>
            <Footer />
          </footer>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
