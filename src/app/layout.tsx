import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navigation from "@/components/component/Navigation/Navigation";
import Footer from "@/components/component/Footer/Footer";
import DarkTheme from "@/components/component/DarkTheme/DarkTheme";
import PageLoader from "@/components/component/Spinner/Spinner";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tangkhul Song Lyrics",
  description: "Tangkhul Lyrics | Tangkhul Laa Lyrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="google-site-verification"
          content="KrT1sWgLJCi0eyUJuGBI4aZ3Nc1PjP0Pqe1z4Jeq22I"
        />
      </Head>
      <body className={`${inter.className}`}>
        <DarkTheme />
        <header>
          <Navigation />
        </header>
        <div className="p-4">
          <PageLoader />
          {children}
        </div>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
