"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminGuard from "@/components/component/AdminGuard/AdminGuard";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();


  // Wrap all other admin pages with AdminGuard
  return <AdminGuard>{children}</AdminGuard>;
}
