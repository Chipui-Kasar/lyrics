"use client";
import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Users,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Artists",
    href: "/admin/artists",
    icon: Users,
  },
  {
    title: "Lyrics",
    href: "/admin/lyrics",
    icon: Package,
  },
  {
    title: "Contributions",
    href: "/admin/contributions",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="flex-1 mt-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-gray-700 text-white border-r-2 border-blue-400"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-gray-800 bg-white hover:bg-gray-100"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-semibold"
          rel="noopener noreferrer"
        >
          <Package className="h-6 w-6" />
          <span>Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <span className="text-sm font-medium">AD</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg border p-3">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Package className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  );
}
