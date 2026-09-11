"use client";
import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  LogOut,
  Music2,
  Settings,
  Users,
  FileText,
  Download,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export default function AdminNavigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setPendingCount(data.pendingContributions ?? 0);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Close the mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems: NavItem[] = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Artists", href: "/admin/artists", icon: Users },
    { title: "Lyrics", href: "/admin/lyrics", icon: Music2 },
    {
      title: "Contributions",
      href: "/admin/contributions",
      icon: FileText,
      badge: pendingCount,
    },
    { title: "Extract Lyrics", href: "/admin/extract-lyrics", icon: Download },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "AD";

  return (
    <>
      {/* Mobile top bar. Fixed (not sticky) so it's taken out of flow —
          otherwise it'd sit as an in-flow sibling in the page's horizontal
          flex row and eat its own content-width slot, squeezing the content
          column next to the sidebar. */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b bg-white px-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-slate-900">Admin Panel</span>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 shrink-0 text-slate-300 flex flex-col transition-transform duration-300 z-50",
          "fixed lg:sticky top-0 left-0 h-screen",
          "bg-[#0b1220]",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/5 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
          <span className="text-white font-semibold tracking-tight truncate">
            Tangkhul Admin
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.title}
                </span>
                {!!item.badge && (
                  <span className="h-5 min-w-5 px-1 rounded-full bg-amber-400 text-[11px] font-bold text-amber-950 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name ?? "Admin"}
              </p>
              <p className="text-xs text-slate-500 truncate">Admin</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
