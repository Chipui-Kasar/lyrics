import Link from "next/link";

const About = () => {
  return (
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
            Tangkhul Lyrical Oasis
          </h1>
          <p className="max-w-[700px] mx-auto mt-4 md:text-xl text-primary-foreground">
            Discover the stories behind your favorite songs. Explore our
            comprehensive database of song lyrics and artist profiles.
          </p>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 m-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold">Searchable Lyrics Database</h2>
              <p className="mt-4 text-muted-foreground">
                Easily search through our extensive collection of song lyrics
                from a wide range of artists and genres. Find the perfect lyrics
                to your favorite tunes.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Artist Profiles</h2>
              <p className="mt-4 text-muted-foreground">
                Dive into the stories and inspirations behind the music with our
                detailed artist profiles. Learn more about the creative minds
                behind the songs you love.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Lyrical Analysis</h2>
              <p className="mt-4 text-muted-foreground">
                Explore the deeper meanings and hidden messages within the
                lyrics of your favorite songs. Our team of experts provide
                insightful analysis to help you appreciate the art of
                songwriting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
