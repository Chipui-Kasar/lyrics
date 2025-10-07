"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export function useDeletedUserCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const lastCheckRef = useRef<number>(0);

  const checkIfUserExists = useCallback(async () => {
    if (!session?.user?.id) return;

    const now = Date.now();
    // Only check every 5 minutes to avoid excessive API calls
    if (now - lastCheckRef.current < 300000) return;

    try {
      const response = await fetch("/api/validate-session", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        console.log("User account has been deleted, signing out...");
        await signOut({ redirect: false });
        alert(
          "Your account has been removed. You will be redirected to the home page."
        );
        router.push("/");
      }

      lastCheckRef.current = now;
    } catch (error) {
      console.error("Failed to check user existence:", error);
    }
  }, [session?.user?.id, router]);

  useEffect(() => {
    if (status === "authenticated") {
      // Check immediately when component mounts
      checkIfUserExists();

      // Then check every 5 minutes
      const interval = setInterval(checkIfUserExists, 300000);

      return () => clearInterval(interval);
    }
  }, [status, checkIfUserExists]);

  return { session, status };
}
