import { slugMaker, cloudinaryWebP, stripInvisibleChars } from "@/lib/utils";
import { IArtists } from "@/models/IObjects";
import Image from "next/image";
import { NavigationLink } from "@/components/NavigationLink";
import ArtistViewToggle from "./ArtistViewToggle";

interface PopularArtistsProps {
  artists: IArtists[];
}

const PopularArtists = ({ artists }: PopularArtistsProps) => {
  return (
    <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
      <ArtistViewToggle
        header={
          <>
            <h2 className="text-2xl font-bold">Browse by Artists</h2>
            <p className="mt-2 text-muted-foreground">
              Explore the most popular artists on our platform.
            </p>
          </>
        }
      >
        {artists.map((artist, key) => (
          <NavigationLink
            key={key}
            href={`/artists/${slugMaker(stripInvisibleChars(artist.name))}`}
            className="flex flex-col items-center gap-2 rounded-lg bg-background p-4 transition-colors hover:bg-muted group-data-[view=list]:items-start group-data-[view=list]:rounded-md group-data-[view=list]:bg-transparent group-data-[view=list]:px-2 group-data-[view=list]:py-1.5 group-data-[view=list]:hover:bg-background/70"
            prefetch={false}
            rel="noopener noreferrer"
          >
            <Image
              src={cloudinaryWebP(artist.image) || "/placeholder-user.jpg"}
              width={44}
              height={44}
              alt={artist.name}
              className="h-9 w-9 shrink-0 object-cover group-data-[view=list]:hidden"
              style={{ borderRadius: "50%" }}
            />
            <div className="min-w-0 text-center group-data-[view=list]:flex group-data-[view=list]:w-full group-data-[view=list]:items-baseline group-data-[view=list]:gap-2 group-data-[view=list]:text-left">
              <h3 className="text-xs font-medium group-data-[view=list]:truncate group-data-[view=list]:text-sm">
                {stripInvisibleChars(artist.name)}
              </h3>
              <p className="text-xs text-muted-foreground group-data-[view=list]:shrink-0">
                {artist.songCount
                  ? `${artist.songCount} ${artist.songCount === 1 ? "Song" : "Songs"}`
                  : ""}
              </p>
            </div>
          </NavigationLink>
        ))}
      </ArtistViewToggle>
    </div>
  );
};

export default PopularArtists;
