const About = () => {
  return (
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
            About Tangkhul Lyrics
          </h1>
          <p className="max-w-[700px] mx-auto mt-4 md:text-xl text-primary-foreground">
            A community-driven archive preserving the songs, stories, and
            language of the Tangkhul Naga people of Manipur, Northeast India.
          </p>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 m-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold">Who We Are</h2>
              <p className="mt-4 text-muted-foreground">
                Tangkhul Lyrics was created by members of the Tangkhul community
                who noticed that song lyrics — the most accessible form of our
                oral tradition — were disappearing from living memory and
                scattered across inaccessible recordings. We built this platform
                so every verse can be found, read, and shared freely.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">Tangkhul Culture &amp; Music</h2>
              <p className="mt-4 text-muted-foreground">
                The Tangkhul Naga are an indigenous people inhabiting the
                Ukhrul district of Manipur, with a rich heritage of folk songs
                called <em>Laa</em>. These songs document harvests, courtship,
                war, faith, and everyday village life, often in dialects that
                vary from village to village. They are a living record of
                Tangkhul history sung across generations.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="mt-4 text-muted-foreground">
                We exist to preserve Tangkhul cultural heritage through music.
                By making lyrics searchable and shareable, we help younger
                generations connect with their roots — even those growing up
                outside Ukhrul. Every song contributed is a small act of
                cultural preservation.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">Contribute</h2>
              <p className="mt-4 text-muted-foreground">
                This archive grows because community members share what they
                know. If you have lyrics, translations, or corrections, please{" "}
                <a href="/contribute" className="underline underline-offset-4">
                  contribute them here
                </a>
                . Together we can ensure that no song is forgotten.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
