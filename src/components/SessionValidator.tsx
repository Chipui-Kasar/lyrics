"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDeletedUserCheck } from "@/hooks/useDeletedUserCheck";

export default function SessionValidator({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the optimized deleted user check hook
  useDeletedUserCheck();

  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      // If user becomes unauthenticated, clear local storage
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [status]);

  return <div>{children}</div>;
}
