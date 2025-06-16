import React from "react";
import PopularArtists from "../PopularArtists/PopularArtists";
import { IArtists } from "@/models/IObjects";

const AllArtists = async ({ artists }: { artists: IArtists[] }) => {
  return (
    <section className="container py-4 sm:py-8 md:py-10 m-auto">
      <PopularArtists artists={artists} />
    </section>
  );
};

export default AllArtists;
