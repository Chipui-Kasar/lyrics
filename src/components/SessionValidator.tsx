"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export default function SessionValidator({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once when component mounts and user is unauthenticated
    if (status === "unauthenticated" && !hasInitialized.current) {
      hasInitialized.current = true;

      // Defer to idle time to avoid blocking main thread
      if ("requestIdleCallback" in window) {
        requestIdleCallback(
          () => {
            localStorage.clear();
            sessionStorage.clear();
          },
          { timeout: 2000 }
        );
      } else {
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
        }, 100);
      }
    }
  }, [status]);

  return <>{children}</>;
}
