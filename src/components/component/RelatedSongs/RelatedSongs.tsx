import Link from "next/link";
import { slugMaker } from "@/lib/utils";
import { ILyrics } from "@/models/IObjects";

const MAX_SONGS = 12;

/**
 * Server-rendered "More songs by this artist" block. Plain links, so it adds
 * no client JS, gives visitors a next step, and gives Google internal links
 * between song pages.
 */
export default function RelatedSongs({
  artistName,
  currentId,
  songs,
}: {
  artistName: string;
  currentId: string;
  songs: ILyrics[];
}) {
  const artistSlug = slugMaker(artistName);
  const others = songs
    .filter((song) => song._id && String(song._id) !== String(currentId) && song.title)
    .slice(0, MAX_SONGS);

  if (others.length === 0) return null;

  return (
    <section
      aria-labelledby="related-songs-heading"
      className="container mx-auto px-4 pb-10 md:px-6"
    >
      <h2 id="related-songs-heading" className="text-xl font-bold">
        More songs by {artistName}
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((song) => (
          <li key={song._id}>
            <Link
              href={`/lyrics/${song._id}/${slugMaker(song.title)}_${artistSlug}`}
              prefetch={false}
              className="block rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              {song.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`/artists/${artistSlug}`}
        prefetch={false}
        className="mt-3 inline-block text-sm font-medium underline-offset-4 hover:underline"
      >
        View all songs by {artistName}
      </Link>
    </section>
  );
}
