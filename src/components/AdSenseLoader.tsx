"use client";

import { useEffect } from "react";

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1569774903364815";
// Load ads on the visitor's first interaction, or after this long if they
// don't interact. AdSense is ~220KB of JS and ~300ms of main-thread work, so
// keeping it out of the initial load helps the page the visitor came for.
const FALLBACK_DELAY_MS = 5000;
const EVENTS = ["scroll", "pointerdown", "keydown", "touchstart"] as const;

export default function AdSenseLoader() {
  useEffect(() => {
    if (document.querySelector(`script[src="${ADSENSE_SRC}"]`)) return;

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      cleanup();
      const script = document.createElement("script");
      script.async = true;
      script.src = ADSENSE_SRC;
      script.crossOrigin = "anonymous";
      script.setAttribute("data-ad-frequency-hint", "30s");
      document.head.appendChild(script);
    };

    const timer = window.setTimeout(load, FALLBACK_DELAY_MS);
    EVENTS.forEach((e) =>
      window.addEventListener(e, load, { passive: true, once: true }),
    );
    function cleanup() {
      window.clearTimeout(timer);
      EVENTS.forEach((e) => window.removeEventListener(e, load));
    }
    return cleanup;
  }, []);

  return null;
}
