"use client";

import { useEffect, useState } from "react";

export default function OfflineIndicator() {
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-md bg-yellow-500 text-black px-3 py-2 shadow-md text-sm">
      Offline mode: showing cached content
    </div>
  );
}
