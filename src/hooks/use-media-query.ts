"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  // Initialize with null to indicate no match on server
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the listener
    mediaQuery.addEventListener("change", listener);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, [query]); // Re-run if query changes

  return matches;
}
