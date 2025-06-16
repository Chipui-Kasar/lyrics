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
    "Tangkhul Lyrics | Tangkhul Laa Lyrics | Tangkhul Songs Lyrics | Tangkhul Lyrical Oasis",
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
    title: "Tangkhul Song Lyrics",
    description:
      "Explore the rich and vibrant world of Tangkhul song lyrics, where tradition meets melody. Dive into our extensive collection of Tangkhul Laa Lyrics and immerse yourself in the Tangkhul lyrical oasis.",
    images: [
      {
        url: "/ogImage.jpg",
        width: 1200,
        height: 630,
        alt: "Tangkhul Song Lyrics",
      },
    ],
  },
  verification: {
    google: "QThzXenD8T7A0SAtb_L2qOy3Wzbw72-7AJfE3vQbxIA",
  },
  other: {
    keywords:
      "lyrics, tangkhul, tangkhul lyrics, tangkhul laa, tangkhul laa lyrics",
  },
};
export const dynamic = "force-static";
export const revalidate = 604800;

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
