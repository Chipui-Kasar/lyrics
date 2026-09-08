"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { slugMaker } from "@/lib/utils";
import { Paginator } from "@/components/ui/pagination";

const PAGE_SIZE = 10;

interface Contribution {
  _id: string;
  title: string;
  artistId?: { name: string };
  status: "pending" | "published" | "rejected";
  rejectionReason?: string;
  publishedLyricsId?: string;
}

const STATUS_STYLES: Record<Contribution["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<Contribution["status"], string> = {
  pending: "Pending Review",
  published: "Published",
  rejected: "Rejected",
};

const MyContributions = () => {
  const { data: session, status } = useSession();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    const fetchContributions = async () => {
      try {
        const res = await fetch("/api/lyrics/my-contributions");
        if (res.ok) {
          setContributions(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch contributions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContributions();
  }, [session]);

  const totalPages = Math.ceil(contributions.length / PAGE_SIZE);
  const paginatedContributions = contributions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <section className="container py-4 sm:py-8 md:py-10 m-auto">
      <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
        <h1 className="text-2xl font-bold">My Contributions</h1>
        <p className="mt-2 text-muted-foreground">
          Track the status of the lyrics you've submitted.
        </p>

        {status === "loading" || loading ? null : !session ? (
          <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded-md">
            You must be signed in to view your contributions.{" "}
            <a
              href="/auth/signin?returnUrl=/my-contributions"
              className="font-bold underline"
            >
              Sign in here
            </a>
            .
          </div>
        ) : contributions.length === 0 ? (
          <p className="mt-6 text-gray-500">
            You haven't contributed any lyrics yet.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {paginatedContributions.map((c) => (
              <div
                key={c._id}
                className="p-4 border rounded-md shadow-sm bg-white"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    {c.status === "published" && c.publishedLyricsId ? (
                      <Link
                        href={`/lyrics/${c.publishedLyricsId}/${slugMaker(
                          c.title
                        )}_${slugMaker(c.artistId?.name || "unknown")}`}
                        prefetch={false}
                        className="text-xl font-bold hover:underline"
                      >
                        {c.title}
                      </Link>
                    ) : (
                      <h3 className="text-xl font-bold">{c.title}</h3>
                    )}
                    <p className="text-gray-600">{c.artistId?.name}</p>
                  </div>
                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[c.status]}`}
                  >
                    {STATUS_LABELS[c.status]}
                  </span>
                </div>
                {c.status === "rejected" && c.rejectionReason && (
                  <p className="mt-2 text-sm text-red-700">
                    Reason: {c.rejectionReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Paginator
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default MyContributions;
