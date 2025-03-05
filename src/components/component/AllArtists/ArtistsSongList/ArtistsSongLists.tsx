"use client";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { ILyrics } from "@/models/IObjects";

const ArtistsSongLists = ({
  params,
}: {
  params: { artists: string; artistId: string };
}) => {
  const [lyrics, setLyrics] = useState<ILyrics[]>([]);

  useEffect(() => {
    fetch(`/api/lyrics/author/lyrics?artistId=${params.artistId}`).then(
      (res) => {
        if (res.ok) {
          res.json().then((data) => setLyrics(data));
        }
      }
    );

    return () => {};
  }, []);

  return (
    <>
      <main className="flex-1 py-8 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            {params.artists.replace(/-/g, " ")}
          </h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="py-3 px-4 text-left">Song Title</th>
                </tr>
              </thead>
              <tbody>
                {lyrics.map((lyric) => (
                  <tr className="border-b hover:bg-muted/20">
                    <td className="py-3 px-4 text-left">
                      <Link
                        href={`/artists/${
                          params.artists
                        }/lyrics/${lyric.title.replace(/ /g, "-")}`}
                        className="font-medium hover:underline"
                        prefetch={false}
                      >
                        {lyric.title}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <div className="container mx-auto flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default ArtistsSongLists;
