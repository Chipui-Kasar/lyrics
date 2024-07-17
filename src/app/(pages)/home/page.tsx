import ContributeLyrics from "@/components/component/ContributeLyrics/ContributeLyrics";
import FeaturedLyrics from "@/components/component/FeaturedLyrics/FeaturedLyrics";
import Footer from "@/components/component/Footer/Footer";
import Navigation from "@/components/component/Navigation/Navigation";
import PopularArtists from "@/components/component/PopularArtists/PopularArtists";
import TopLyrics from "@/components/component/TopLyrics/toplyrics";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* <Navigation /> */}
      <main className="flex-1">
        <section className="container py-4 sm:py-8 md:py-10 m-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2 grid gap-4">
              <FeaturedLyrics />
              <PopularArtists />
            </div>
            <TopLyrics />
          </div>
        </section>
        <ContributeLyrics />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;
