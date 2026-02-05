import { NavigationLink } from "@/components/NavigationLink";
import { Paginator } from "@/components/ui/pagination";
import { ILyrics } from "@/models/IObjects";
import { slugMaker } from "@/lib/utils";
interface AllLyricsProps {
  lyrics: ILyrics[];
  isLoading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
}
const AllLyrics = ({ lyrics, isLoading, pagination }: AllLyricsProps) => {
  const totalCount = pagination?.totalCount ?? 0;
  const pageSize = pagination?.pageSize ?? 0;
  const currentPage = pagination?.currentPage ?? 1;
  const startIndex =
    totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex =
    totalCount > 0 ? Math.min(currentPage * pageSize, totalCount) : 0;
  return (
    <div className="col-span-2 md:col-span-2 lg:col-span-1  rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
      <h2 className="text-2xl font-bold">
        Tangkhul Song Lyrics | Explore and Discover new Lyrics
      </h2>
      <p className="mt-2 text-muted-foreground">
        Explore the growing collection of lyrics from various artists and
        genres.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {lyrics.map((lyric) => (
          <NavigationLink
            href={`/lyrics/${lyric._id}/${slugMaker(lyric.title)}_${slugMaker(
              lyric.artistId?.name
            )}`}
            prefetch={false}
            className="group flex items-center gap-4 rounded-lg bg-background p-2 transition-colors hover:bg-muted"
            key={lyric._id}
            rel="noopener noreferrer"
          >
            <div className="flex-1">
              <h3 className="font-medium text-sm">{lyric.title}</h3>{" "}
              {/* ✅ Removed nested <Link> */}
              <p className="text-xs text-muted-foreground">
                by{" "}
                <span className="font-medium">
                  {lyric.artistId?.name ?? "Unknown Artist"}
                </span>{" "}
                {/* ✅ No nested <Link> */}
              </p>
            </div>
          </NavigationLink>
        ))}
      </div>

      {isLoading && (
        <p className="mt-4 text-sm text-muted-foreground">
          Loading more lyrics...
        </p>
      )}

      {!isLoading && lyrics.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          No lyrics found yet.
        </p>
      )}

      {pagination && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {totalCount > 0
              ? `Showing ${startIndex}-${endIndex} of ${totalCount} lyrics`
              : "Showing 0 lyrics"}
          </p>
          <Paginator
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AllLyrics;
