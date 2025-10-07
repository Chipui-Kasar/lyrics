"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export function useSessionValidation() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const lastValidationRef = useRef<number>(0);
  const validationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const validateSession = useCallback(async () => {
    if (session?.user?.id) {
      const now = Date.now();
      // Only validate if it's been more than 2 minutes since last validation
      if (now - lastValidationRef.current < 120000) {
        return;
      }

      try {
        // Use a lightweight API call instead of session update
        const response = await fetch("/api/validate-session", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Session validation failed");
        }

        lastValidationRef.current = now;
      } catch (error) {
        console.error("Session validation failed:", error);
        // If session validation fails, sign out the user
        await signOut({
          redirect: false,
          callbackUrl: "/",
        });
        router.push("/");
      }
    }
  }, [session?.user?.id, router]);

  useEffect(() => {
    if (status === "authenticated") {
      // Clear any existing interval
      if (validationIntervalRef.current) {
        clearInterval(validationIntervalRef.current);
      }

      // Set up periodic session validation every 5 minutes instead of 30 seconds
      validationIntervalRef.current = setInterval(validateSession, 300000); // 5 minutes

      return () => {
        if (validationIntervalRef.current) {
          clearInterval(validationIntervalRef.current);
        }
      };
    }
  }, [status, validateSession]);

  // Handle session status changes
  useEffect(() => {
    if (status === "unauthenticated" && typeof window !== "undefined") {
      // Clear any cached data
      localStorage.removeItem("next-auth.session-token");
      sessionStorage.clear();
    }
  }, [status]);

  return { session, status };
}
