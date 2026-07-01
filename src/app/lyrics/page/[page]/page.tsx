import { notFound, permanentRedirect } from "next/navigation";
import AllLyricsHydrated from "@/components/component/AllLyrics/AllLyricsHydrated";
import { getLyricsPage } from "@/service/allartists";
import { generatePageMetadata } from "@/lib/utils";

export const dynamic = "force-static";
export const revalidate = 3600;

const PAGE_SIZE = 60;

const parsePage = (value: string) => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : null;
};

const TOTAL_PAGES = 7;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: rawPage } = await params;
  const page = parsePage(rawPage);

  return generatePageMetadata({
    title: page
      ? `All Tangkhul Lyrics — Page ${page} of ${TOTAL_PAGES} | Tangkhul Lyrics`
      : "Tangkhul Lyrics Directory",
    description: page
      ? `Browse page ${page} of Tangkhul song lyrics. Discover traditional and contemporary songs with full lyrics from top Tangkhul artists.`
      : "Browse Tangkhul song lyrics by page with crawlable links to every song in the collection.",
    url: page
      ? `https://tangkhullyrics.com/lyrics/page/${page}`
      : "https://tangkhullyrics.com/lyrics",
    keywords:
      "Tangkhul lyrics, Tangkhul songs, lyrics directory, Tangkhul music",
  });
}

const LyricsDirectoryPage = async ({
  params,
}: {
  params: Promise<{ page: string }>;
}) => {
  const { page: rawPage } = await params;
  const page = parsePage(rawPage);

  if (!page) {
    notFound();
  }

  if (page === 1) {
    permanentRedirect("/lyrics");
  }

  const pageData = await getLyricsPage({
    page,
    limit: PAGE_SIZE,
    sort: "title",
    order: "asc",
    fields: "summary",
  });

  if (page > pageData.pagination.totalPages) {
    notFound();
  }

  const prevHref =
    page - 1 <= 1
      ? "https://tangkhullyrics.com/lyrics"
      : `https://tangkhullyrics.com/lyrics/page/${page - 1}`;
  const nextHref =
    page < pageData.pagination.totalPages
      ? `https://tangkhullyrics.com/lyrics/page/${page + 1}`
      : null;

  return (
    <div className="flex min-h-screen flex-col dark:bg-background">
      {/* Next.js hoists <link> tags rendered here into <head> */}
      <link rel="prev" href={prevHref} />
      {nextHref && <link rel="next" href={nextHref} />}
      <main className="flex-1">
        <section className="container py-4 sm:py-8 md:py-10 m-auto">
          <AllLyricsHydrated
            initialLyrics={pageData.items}
            initialPagination={pageData.pagination}
          />
        </section>
      </main>
    </div>
  );
};

export default LyricsDirectoryPage;
