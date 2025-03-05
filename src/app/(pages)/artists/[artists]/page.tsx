"use client";
import ArtistsSongLists from "@/components/component/AllArtists/ArtistsSongList/ArtistsSongLists";
import { useSearchParams } from "next/navigation";

const Slug = ({ params }: { params: { artists: string } }) => {
  const searchParams = useSearchParams();
  const artistId = searchParams.get("artistId") || "";

  return <ArtistsSongLists params={{ ...params, artistId }} />;
};

export default Slug;
