"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Music2,
  Users,
  FileText,
  Eye,
  FilePenLine,
  ArrowRight,
  Plus,
  UserPlus,
  Download,
} from "lucide-react";
import AdminNavigation from "@/components/component/Admin/Navigation/AdminNav";

interface Stats {
  totalLyrics: number;
  draftLyrics: number;
  totalArtists: number;
  totalUsers: number;
  pendingContributions: number;
  totalViews: number;
  recentLyrics: {
    _id: string;
    title: string;
    artistId?: { name: string };
    createdAt: string;
  }[];
  recentContributions: {
    _id: string;
    title: string;
    artistId?: { name: string };
    contributedBy?: string;
    createdAt: string;
  }[];
}

function timeAgo(dateString: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  const units: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secondsInUnit, label] of units) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) return `${value}${label} ago`;
  }
  return "just now";
}

const AVATAR_GRADIENTS = [
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-rose-500 to-pink-400",
];

function Avatar({ label, index }: { label: string; index: number }) {
  return (
    <div
      className={`h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br ${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white text-sm font-semibold`}
    >
      {label.charAt(0).toUpperCase() || "?"}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  accent,
  iconClass,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  href?: string;
  accent?: boolean;
  iconClass: string;
}) {
  const content = (
    <div
      className={`h-full rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
        accent
          ? "border-amber-200 ring-1 ring-amber-200 bg-amber-50/40"
          : "border-slate-100"
      }`}
    >
      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center ${iconClass}`}
      >
        <Icon className="h-[17px] w-[17px]" />
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-900 tabular-nums">
        {value.toLocaleString()}
      </p>
      <p className="text-xs font-medium text-slate-400 mt-0.5">{label}</p>
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
  primary,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-xl text-sm font-medium px-4 py-2.5 transition-colors ${
        primary
          ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800"
          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function ActivityList({
  title,
  viewAllHref,
  emptyLabel,
  items,
}: {
  title: string;
  viewAllHref: string;
  emptyLabel: string;
  items: { key: string; label: string; sub: string; time: string }[];
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <Link
          href={viewAllHref}
          className="text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors"
        >
          View all &rarr;
        </Link>
      </div>
      <ul className="divide-y divide-slate-100">
        {items.length === 0 ? (
          <li className="px-5 py-10 text-center text-sm text-slate-400">
            {emptyLabel}
          </li>
        ) : (
          items.map((item, i) => (
            <li
              key={item.key}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <Avatar label={item.label} index={i} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {item.label}
                </p>
                <p className="text-xs text-slate-400 truncate">{item.sub}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0">
                {item.time}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          setStats(await res.json());
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      <AdminNavigation />
      <div className="flex-1 min-w-0 pt-14 lg:pt-0">
        <header className="hidden lg:flex sticky top-0 z-10 h-16 items-center justify-between px-8 bg-white/80 backdrop-blur border-b border-slate-200">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
            <p className="text-xs text-slate-400">
              Welcome back, here&apos;s what&apos;s happening.
            </p>
          </div>
        </header>

        <main className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
          ) : error || !stats ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-500">
              Couldn&apos;t load dashboard stats. Please refresh the page.
            </div>
          ) : (
            <>
              {stats.pendingContributions > 0 && (
                <Link
                  href="/admin/contributions"
                  className="group flex items-center justify-between rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-3.5 transition-all hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <FileText className="h-[17px] w-[17px]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        {stats.pendingContributions} contribution
                        {stats.pendingContributions === 1 ? "" : "s"} waiting
                        for review
                      </p>
                      <p className="text-xs text-amber-700/70">
                        Take a moment to approve or reject new submissions
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-amber-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                </Link>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard
                  icon={Music2}
                  label="Published Lyrics"
                  value={stats.totalLyrics}
                  href="/admin/lyrics"
                  iconClass="bg-violet-50 text-violet-600"
                />
                <StatCard
                  icon={FilePenLine}
                  label="Drafts"
                  value={stats.draftLyrics}
                  iconClass="bg-sky-50 text-sky-600"
                />
                <StatCard
                  icon={Users}
                  label="Artists"
                  value={stats.totalArtists}
                  href="/admin/artists"
                  iconClass="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                  icon={FileText}
                  label="Pending Contributions"
                  value={stats.pendingContributions}
                  href="/admin/contributions"
                  accent={stats.pendingContributions > 0}
                  iconClass="bg-amber-100 text-amber-600"
                />
                <StatCard
                  icon={Eye}
                  label="Total Views"
                  value={stats.totalViews}
                  iconClass="bg-rose-50 text-rose-600"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <QuickAction
                  icon={Plus}
                  label="Add Lyrics"
                  href="/admin/lyrics"
                  primary
                />
                <QuickAction
                  icon={UserPlus}
                  label="Add Artist"
                  href="/admin/artists"
                />
                <QuickAction
                  icon={Download}
                  label="Extract Lyrics"
                  href="/admin/extract-lyrics"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 pb-10">
                <ActivityList
                  title="Recently Published"
                  viewAllHref="/admin/lyrics"
                  emptyLabel="No lyrics published yet."
                  items={stats.recentLyrics.map((lyric) => ({
                    key: lyric._id,
                    label: lyric.title,
                    sub: lyric.artistId?.name ?? "Unknown artist",
                    time: timeAgo(lyric.createdAt),
                  }))}
                />
                <ActivityList
                  title="Pending Review"
                  viewAllHref="/admin/contributions"
                  emptyLabel="Nothing to review right now."
                  items={stats.recentContributions.map((c) => ({
                    key: c._id,
                    label: c.title,
                    sub: c.contributedBy
                      ? `${c.artistId?.name ?? "Unknown artist"} · by ${c.contributedBy}`
                      : (c.artistId?.name ?? "Unknown artist"),
                    time: timeAgo(c.createdAt),
                  }))}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
