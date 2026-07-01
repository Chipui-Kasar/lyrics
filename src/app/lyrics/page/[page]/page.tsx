import { notFound, permanentRedirect } from "next/navigation";

const parsePage = (value: string) => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : null;
};

// Legacy path-based pagination (/lyrics/page/2) now lives at /lyrics?page=2.
// Redirect permanently so indexed/inbound links keep working.
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

  permanentRedirect(page === 1 ? "/lyrics" : `/lyrics?page=${page}`);
};

export default LyricsDirectoryPage;
