// components/GoogleAdSense.tsx
"use client";
import Script from "next/script";

export function GoogleAdScript() {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1569774903364815`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
