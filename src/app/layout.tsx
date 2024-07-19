import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navigation from "@/components/component/Navigation/Navigation";
import Footer from "@/components/component/Footer/Footer";
import DarkTheme from "@/components/component/DarkTheme/DarkTheme";

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
      <body className={`${inter.className}`}>
        <DarkTheme />
        <header>
          <Navigation />
        </header>
        <div className="p-4">{children}</div>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
