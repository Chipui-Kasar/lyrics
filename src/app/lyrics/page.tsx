import { notFound } from "next/navigation";
import AllLyricsHydrated from "@/components/component/AllLyrics/AllLyricsHydrated";
import { getLyricsPage } from "@/service/allartists";
import { generatePageMetadata } from "@/lib/utils";

export const revalidate = 3600; // 1 hour

const PAGE_SIZE = 60;
const BASE_URL = "https://tangkhullyrics.com/lyrics";

const parsePage = (value?: string) => {
  if (!value) return 1;
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : null;
};

type SearchParams = { page?: string };

// ✅ Enhanced SEO Metadata using utility function
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page: rawPage } = await searchParams;
  const page = parsePage(rawPage);

  if (!page) {
    return generatePageMetadata({
      title: "All Tangkhul Lyrics - Complete Song Collection",
      description:
        "Explore 416+ authentic Tangkhul song lyrics from 80+ artists. Browse our complete collection of traditional and contemporary Tangkhul music.",
      url: BASE_URL,
      keywords:
        "Tangkhul lyrics, Tangkhul songs, Tangkhul Laa, Ukhrul music, Tangkhul artists, traditional songs, Manipur music",
    });
  }

  const pageData = await getLyricsPage({
    page,
    limit: PAGE_SIZE,
    sort: "title",
    order: "asc",
    fields: "summary",
  });
  const totalPages = pageData.pagination.totalPages;

  if (page === 1) {
    return generatePageMetadata({
      title: "All Tangkhul Lyrics - Complete Song Collection",
      description:
        "Explore 416+ authentic Tangkhul song lyrics from 80+ artists. Browse our complete collection of traditional and contemporary Tangkhul music.",
      url: BASE_URL,
      keywords:
        "Tangkhul lyrics, Tangkhul songs, Tangkhul Laa, Ukhrul music, Tangkhul artists, traditional songs, Manipur music",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Tangkhul Lyrics Collection",
        description:
          "Complete collection of Tangkhul song lyrics and traditional music",
        url: BASE_URL,
        mainEntity: {
          "@type": "MusicPlaylist",
          name: "Tangkhul Song Collection",
          description: "Traditional and contemporary Tangkhul songs",
          genre: "Traditional Music",
        },
      },
    });
  }

  return generatePageMetadata({
    title: `All Tangkhul Lyrics — Page ${page} of ${totalPages} | Tangkhul Lyrics`,
    description: `Browse page ${page} of Tangkhul song lyrics. Discover traditional and contemporary songs with full lyrics from top Tangkhul artists.`,
    url: `${BASE_URL}?page=${page}`,
    keywords:
      "Tangkhul lyrics, Tangkhul songs, Tangkhul Laa, Ukhrul music, Tangkhul artists, traditional songs, Manipur music",
  });
}

// ✅ Page Component
const Lyrics = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { page: rawPage } = await searchParams;
  const page = parsePage(rawPage);

  if (!page) {
    notFound();
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
    page <= 1
      ? null
      : page - 1 === 1
        ? BASE_URL
        : `${BASE_URL}?page=${page - 1}`;
  const nextHref =
    page < pageData.pagination.totalPages
      ? `${BASE_URL}?page=${page + 1}`
      : null;

  return (
    <div className="flex min-h-screen flex-col dark:bg-background">
      {/* Next.js hoists <link> tags rendered here into <head> */}
      {prevHref && <link rel="prev" href={prevHref} />}
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

export default Lyrics;
