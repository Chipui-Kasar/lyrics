"use client";

import { useEffect } from "react";

interface ButtonAdProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
}

export default function ButtonAd({
  slot,
  format = "auto",
  className = "",
}: ButtonAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Ad loading error:", err);
    }
  }, []);

  return (
    <div className={`my-4 flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: "inline-block",
          minWidth: "250px",
          maxWidth: "400px",
          width: "100%",
          height: "auto",
        }}
        data-ad-client="ca-pub-1569774903364815"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="false"
      />
    </div>
  );
}
