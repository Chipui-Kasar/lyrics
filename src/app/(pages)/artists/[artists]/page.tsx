import ArtistsSongLists from "@/components/component/AllArtists/ArtistsSongList/ArtistsSongLists";

const Slug = ({ params }: { params: { artists: string } }) => {
  return <ArtistsSongLists params={params} />;
};

export default Slug;
