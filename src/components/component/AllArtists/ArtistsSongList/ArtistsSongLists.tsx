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
import { ILyrics } from "@/models/IObjects";
import { slugMaker } from "@/lib/utils";

const ArtistsSongLists = ({ lyrics }: { lyrics: ILyrics[] }) => {
  return (
    <>
      <main className="flex-1 py-8 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            {lyrics[0]?.artistId?.name}
          </h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="py-3 px-4 text-left">Song Title</th>
                </tr>
              </thead>
              <tbody>
                {lyrics.map((lyric, key) => (
                  <tr className="border-b hover:bg-muted/20" key={key}>
                    <td className="py-3 px-4 text-left">
                      <Link
                        href={`/lyrics/${lyric._id}/${slugMaker(
                          lyric.title
                        )}~${slugMaker(lyric.artistId?.name)}`}
                        className="font-medium hover:underline"
                        prefetch={true}
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
