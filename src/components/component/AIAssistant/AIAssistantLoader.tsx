"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the actual AI Assistant
const AIAssistant = dynamic(() => import("./AIAssistant"), {
  ssr: false,
});

export default function AIAssistantLoader() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay loading AI Assistant by 2 seconds after page load
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;

  return <AIAssistant />;
}
