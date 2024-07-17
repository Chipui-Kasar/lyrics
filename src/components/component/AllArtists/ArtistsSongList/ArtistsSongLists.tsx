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

const ArtistsSongLists = ({ params }: { params: { artists: string } }) => {
  return (
    <>
      <main className="flex-1 py-8 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6">{params.artists}</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="py-3 px-4 text-left">Song Title</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/20">
                  <td className="py-3 px-4 text-left">
                    <Link
                      href={`/artists/${params.artists}/lyrics/Song Title 1`}
                      className="font-medium hover:underline"
                      prefetch={false}
                    >
                      Song Title 1
                    </Link>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/20">
                  <td className="py-3 px-4 text-left">
                    <Link
                      href="#"
                      className="font-medium hover:underline"
                      prefetch={false}
                    >
                      Song Title 2
                    </Link>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/20">
                  <td className="py-3 px-4 text-left">
                    <Link
                      href="#"
                      className="font-medium hover:underline"
                      prefetch={false}
                    >
                      Song Title 3
                    </Link>
                  </td>
                </tr>
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
