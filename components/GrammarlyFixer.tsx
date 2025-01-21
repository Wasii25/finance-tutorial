"use client";

import { useEffect } from "react";

export default function GrammarlyFixer() {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.className?.includes("gr-")) {
          console.log("Grammarly modification detected:", mutation.target);
          mutation.target.remove(); // Remove Grammarly-injected elements
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null; // No UI; purely for side effects
}
