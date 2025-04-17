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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function AdminPanel() {
  return (
    <div className="flex min-h-[95vh] w-full flex-col bg-muted/40">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <div className="flex h-14 items-center border-b bg-background px-4 md:px-6">
            <div className="ml-auto">
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="mx-auto max-w-5xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Dashboard</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card title="Total Users" value="12,345" />
                <Card title="Total Orders" value="1,234" />
                <Card title="Total Revenue" value="$123,456" />
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
                <div className="space-y-4">
                  <ActivityItem
                    title="New user registered"
                    description="John Doe just created an account"
                    time="2 minutes ago"
                  />
                  <ActivityItem
                    title="New order placed"
                    description="Order #12345 was placed"
                    time="15 minutes ago"
                  />
                  <ActivityItem
                    title="Product updated"
                    description="iPhone 15 Pro stock updated to 25 units"
                    time="1 hour ago"
                  />
                  <ActivityItem
                    title="Payment received"
                    description="Payment of $1,234 received for order #12344"
                    time="3 hours ago"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
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
