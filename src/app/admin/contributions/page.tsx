"use client";

import { useState, useEffect } from "react";
import AdminNavigation from "@/components/component/Admin/Navigation/AdminNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/richTextEditor";
import { sanitizeAndDeduplicateHTML } from "@/lib/utils";
import { Paginator } from "@/components/ui/pagination";

const PAGE_SIZE = 10;

interface Lyric {
  _id: string;
  title: string;
  artistId: { _id?: string; name: string };
  album?: string;
  releaseYear?: number;
  lyrics: string;
  thumbnail?: string;
  contributedBy?: string;
  streamingLinks?: { youtube?: string; spotify?: string };
  status: string;
}

interface EditableFields {
  title: string;
  album: string;
  releaseYear: number;
  thumbnail: string;
  contributedBy: string;
  lyrics: string;
  streamingLinks: { youtube: string; spotify: string };
}

export default function ContributionsPage() {
  const [drafts, setDrafts] = useState<Lyric[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, EditableFields>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(drafts.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedDrafts = drafts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const toggleExpand = (draft: Lyric) => {
    if (expandedId === draft._id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(draft._id);
    setEdits((prev) =>
      prev[draft._id]
        ? prev
        : {
            ...prev,
            [draft._id]: {
              title: draft.title || "",
              album: draft.album || "",
              releaseYear: draft.releaseYear || new Date().getFullYear(),
              thumbnail: draft.thumbnail || "",
              contributedBy: draft.contributedBy || "",
              lyrics: draft.lyrics || "",
              streamingLinks: {
                youtube: draft.streamingLinks?.youtube || "",
                spotify: draft.streamingLinks?.spotify || "",
              },
            },
          }
    );
  };

  const handleEditChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: name === "releaseYear" ? Number(value) || 0 : value,
      },
    }));
  };

  const handleLyricsChange = (id: string, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], lyrics: sanitizeAndDeduplicateHTML(value) },
    }));
  };

  const handleStreamingChange = (
    id: string,
    platform: "youtube" | "spotify",
    value: string
  ) => {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        streamingLinks: { ...prev[id].streamingLinks, [platform]: value },
      },
    }));
  };

  const saveDraft = async (id: string, publish: boolean) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/lyrics/contributions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...edits[id],
          ...(publish ? { status: "published" } : {}),
        }),
      });
      if (res.ok) {
        if (publish) {
          setDrafts((prev) => prev.filter((d) => d._id !== id));
          setExpandedId(null);
        } else {
          setDrafts((prev) =>
            prev.map((d) => (d._id === id ? { ...d, ...edits[id] } : d))
          );
        }
      } else {
        alert("Failed to save changes.");
      }
    } catch (error) {
      console.error("Failed to save changes", error);
      alert("Failed to save changes.");
    } finally {
      setSavingId(null);
    }
  };

  const handleApprove = async (id: string) => {
    await handleUpdate(id, "published");
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt(
      "Reason for rejecting this submission (optional). Click OK to reject, or Cancel to abort:"
    );
    if (reason === null) return;
    try {
      const res = await fetch(`/api/lyrics/contributions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", rejectionReason: reason }),
      });
      if (res.ok) {
        setDrafts((prev) => prev.filter((d) => d._id !== id));
      }
    } catch (error) {
      console.error("Failed to reject lyric", error);
    }
  };

  const handleUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/lyrics/contributions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setDrafts((prev) => prev.filter((d) => d._id !== id));
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
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Contributions</h1>
          </div>
        </header>

        <main className="p-8">
          <div className="space-y-4">
            {drafts.length > 0 ? (
              paginatedDrafts.map((draft) => {
                const isExpanded = expandedId === draft._id;
                const edit = edits[draft._id];
                const isSaving = savingId === draft._id;
                return (
                  <div
                    key={draft._id}
                    className="p-4 border rounded-md shadow-sm bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{draft.title}</h3>
                        <p className="text-gray-600">{draft.artistId?.name}</p>
                        {draft.contributedBy && (
                          <p className="text-sm text-gray-400">
                            Submitted by {draft.contributedBy}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => toggleExpand(draft)}
                      >
                        {isExpanded ? "Hide Details" : "View Details"}
                      </Button>
                    </div>

                    {isExpanded && edit && (
                      <div className="mt-4 grid gap-4 border-t pt-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`title-${draft._id}`}>
                            Song Title
                          </Label>
                          <Input
                            id={`title-${draft._id}`}
                            name="title"
                            value={edit.title}
                            onChange={(e) => handleEditChange(draft._id, e)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor={`album-${draft._id}`}>Album</Label>
                            <Input
                              id={`album-${draft._id}`}
                              name="album"
                              value={edit.album}
                              onChange={(e) => handleEditChange(draft._id, e)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor={`releaseYear-${draft._id}`}>
                              Release Year
                            </Label>
                            <Input
                              id={`releaseYear-${draft._id}`}
                              name="releaseYear"
                              type="number"
                              value={edit.releaseYear}
                              onChange={(e) => handleEditChange(draft._id, e)}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`thumbnail-${draft._id}`}>
                            Thumbnail URL
                          </Label>
                          <Input
                            id={`thumbnail-${draft._id}`}
                            name="thumbnail"
                            value={edit.thumbnail}
                            onChange={(e) => handleEditChange(draft._id, e)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`contributedBy-${draft._id}`}>
                            Contributed By
                          </Label>
                          <Input
                            id={`contributedBy-${draft._id}`}
                            name="contributedBy"
                            value={edit.contributedBy}
                            onChange={(e) => handleEditChange(draft._id, e)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor={`youtube-${draft._id}`}>
                              YouTube Link
                            </Label>
                            <Input
                              id={`youtube-${draft._id}`}
                              value={edit.streamingLinks.youtube}
                              onChange={(e) =>
                                handleStreamingChange(
                                  draft._id,
                                  "youtube",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor={`spotify-${draft._id}`}>
                              Spotify Link
                            </Label>
                            <Input
                              id={`spotify-${draft._id}`}
                              value={edit.streamingLinks.spotify}
                              onChange={(e) =>
                                handleStreamingChange(
                                  draft._id,
                                  "spotify",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`lyrics-${draft._id}`}>Lyrics</Label>
                          <RichTextEditor
                            name="lyrics"
                            defaultValue={edit.lyrics}
                            onChange={({ target }) =>
                              handleLyricsChange(draft._id, target.value)
                            }
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            disabled={isSaving}
                            onClick={() => saveDraft(draft._id, false)}
                          >
                            Save Changes
                          </Button>
                          <Button
                            disabled={isSaving}
                            className="bg-green-500 text-white hover:bg-green-600"
                            onClick={() => saveDraft(draft._id, true)}
                          >
                            Save &amp; Approve
                          </Button>
                        </div>
                      </div>
                    )}

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
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No contributions to review at the moment.
                </p>
              </div>
            )}
          </div>

          {drafts.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Paginator
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
