"use client";
import React from "react";
import { useSession } from "next-auth/react";
import AdminLogin from "./signin/page";
import AdminNavigation from "@/components/component/Admin/Navigation/AdminNav";

const AdminPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <AdminLogin />;
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminNavigation />
    </div>
  );
};

export default AdminPage;
