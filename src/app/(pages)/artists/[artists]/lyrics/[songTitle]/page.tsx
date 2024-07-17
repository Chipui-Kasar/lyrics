import Lyrics from "@/components/component/AllArtists/ArtistsSongList/Lyrics/Lyrics";

const LyricsPage = ({
  params,
}: {
  params: { artists: string; songTitle: string };
}) => {
  return <Lyrics params={params} />;
};
export default LyricsPage;
