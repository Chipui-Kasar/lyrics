"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AdminNavigation from "@/components/component/Admin/Navigation/AdminNav";

interface Lyric {
  _id: string;
  title: string;
  artistId: { name: string };
  status: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [drafts, setDrafts] = useState<Lyric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await fetch("/api/lyrics/drafts");
        if (res.ok) {
          const data = await res.json();
          setDrafts(data);
        }
      } catch (error) {
        console.error("Failed to fetch drafts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const handleApprove = async (id: string) => {
    await handleUpdate(id, "published");
  };

  const handleReject = async (id: string) => {
    if (window.confirm("Are you sure you want to reject this submission?")) {
      try {
        const res = await fetch(`/api/lyrics/${id}`, { method: "DELETE" });
        if (res.ok) {
          setDrafts(drafts.filter((d) => d._id !== id));
        }
      } catch (error) {
        console.error("Failed to reject lyric", error);
      }
    }
  };

  const handleUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/lyrics/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setDrafts(drafts.filter((d) => d._id !== id));
      }
    } catch (error) {
      console.error("Failed to update lyric status", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNavigation />
      <div className="flex-1">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b px-6 py-4 mt-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
        </header>

        <main className="p-8">
          <h2 className="text-xl font-semibold mb-4">
            Draft Lyrics for Review
          </h2>
          <div className="space-y-4">
            {drafts.length > 0 ? (
              drafts.map((draft) => (
                <div
                  key={draft._id}
                  className="p-4 border rounded-md shadow-sm bg-white"
                >
                  <h3 className="text-xl font-bold">{draft.title}</h3>
                  <p className="text-gray-600">{draft.artistId?.name}</p>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => handleApprove(draft._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(draft._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No draft lyrics to review at the moment.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
