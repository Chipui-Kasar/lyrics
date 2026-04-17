"use client";

import { useMemo, useState } from "react";
import { Clock3, ExternalLink, Loader2, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SitemapTrackerResponse } from "@/lib/sitemapTracker.types";

interface SitemapTrackerProps {
  onSelectLink?: (link: string) => void;
}

const DEFAULT_TRACKER_STATE: SitemapTrackerResponse = {
  sitemapUrl: "",
  lookbackDays: 7,
  hasConfiguredSitemap: false,
  currentLinkCount: 0,
  recentLinksCount: 0,
  fetchedAt: null,
  missingLastModifiedCount: 0,
  lastError: null,
  links: [],
};

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "Not checked yet";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const shortenSitemap = (value: string | null) => {
  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(value);
    return `${parsed.hostname}${parsed.pathname}`;
  } catch {
    return value;
  }
};

export default function SitemapTracker({
  onSelectLink,
}: SitemapTrackerProps) {
  const [trackerData, setTrackerData] =
    useState<SitemapTrackerResponse>(DEFAULT_TRACKER_STATE);
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [lookbackDays, setLookbackDays] = useState("7");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestTracker = async () => {
    const trimmedSitemapUrl = sitemapUrl.trim();
    const numericDays = Number(lookbackDays);

    if (!trimmedSitemapUrl) {
      setError("Enter a sitemap URL before retrieving links.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/sitemap-tracker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sitemapUrl: trimmedSitemapUrl,
          days: numericDays,
        }),
      });

      const payload = (await response.json()) as SitemapTrackerResponse & {
        error?: string;
      };

      setTrackerData(payload);

      if (payload.sitemapUrl) {
        setSitemapUrl(payload.sitemapUrl);
      }

      setLookbackDays(String(payload.lookbackDays));

      if (!response.ok) {
        throw new Error(payload.error || "Failed to load sitemap tracker");
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load sitemap tracker"
      );
    } finally {
      setLoading(false);
    }
  };

  const statusMessage = useMemo(() => {
    if (!trackerData.hasConfiguredSitemap && !sitemapUrl.trim()) {
      return "Paste a competitor sitemap URL, choose the day window, and retrieve links.";
    }

    if (!trackerData.hasConfiguredSitemap) {
      return "No sitemap data loaded yet.";
    }

    if (trackerData.missingLastModifiedCount > 0) {
      return `Showing URLs whose sitemap lastmod is within the last ${trackerData.lookbackDays} day${trackerData.lookbackDays === 1 ? "" : "s"}. ${trackerData.missingLastModifiedCount} URL${trackerData.missingLastModifiedCount === 1 ? "" : "s"} were skipped because lastmod is missing.`;
    }

    return `Showing URLs whose sitemap lastmod is within the last ${trackerData.lookbackDays} day${trackerData.lookbackDays === 1 ? "" : "s"}.`;
  }, [
    sitemapUrl,
    trackerData.hasConfiguredSitemap,
    trackerData.lookbackDays,
    trackerData.missingLastModifiedCount,
  ]);

  return (
    <aside className="bg-white rounded-lg shadow-md p-6 xl:sticky xl:top-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Competitor Sitemap Watch
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Retrieve competitor URLs directly from a sitemap and send matching
            links into the extractor.
          </p>
        </div>
        <SearchCheck className="h-6 w-6 text-blue-600 shrink-0" />
      </div>

      <div className="mt-5 space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="competitorSitemapUrl">Sitemap URL</Label>
          <Input
            id="competitorSitemapUrl"
            type="url"
            placeholder="https://competitor.com/sitemap.xml"
            value={sitemapUrl}
            onChange={(event) => setSitemapUrl(event.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="competitorLookbackDays">Past n days</Label>
          <Input
            id="competitorLookbackDays"
            type="number"
            min={1}
            max={90}
            value={lookbackDays}
            onChange={(event) => setLookbackDays(event.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            className="flex-1"
            onClick={() => void requestTracker()}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Retrieving...
              </>
            ) : (
              "Retrieve Links"
            )}
          </Button>
        </div>
      </div>

      {(error || trackerData.lastError) && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error || trackerData.lastError}
        </div>
      )}

      <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
        {statusMessage}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Current URLs
          </p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {trackerData.currentLinkCount}
          </p>
        </div>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Matched URLs
          </p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {trackerData.recentLinksCount}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <Clock3 className="h-4 w-4" />
        <span>Retrieved: {formatDateTime(trackerData.fetchedAt)}</span>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent sitemap links
          </h3>
          <span className="text-sm text-gray-500">
            {trackerData.links.length} item
            {trackerData.links.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-4 space-y-3 max-h-[32rem] overflow-y-auto pr-1">
          {loading ? (
            <div className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-500">
              Loading tracked sitemap links...
            </div>
          ) : trackerData.links.length > 0 ? (
            trackerData.links.map((item) => (
              <div
                key={item.link}
                className="rounded-md border border-gray-200 p-4"
              >
                <p className="text-xs text-gray-500">
                  Last modified {formatDateTime(item.lastModifiedAt)}
                </p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-sm font-medium text-blue-700 hover:underline"
                >
                  {item.link}
                </a>
                {item.sourceSitemap && (
                  <p className="mt-2 text-xs text-gray-500">
                    Source sitemap: {shortenSitemap(item.sourceSitemap)}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {onSelectLink && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onSelectLink(item.link)}
                    >
                      Use Link
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(item.link, "_blank", "noopener,noreferrer")
                    }
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-500">
              {trackerData.hasConfiguredSitemap
                ? `No sitemap URLs with lastmod in the last ${trackerData.lookbackDays} day${trackerData.lookbackDays === 1 ? "" : "s"} were found.`
                : "No sitemap data loaded yet."}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
