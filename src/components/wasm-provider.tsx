"use client";

import { useEffect, useState } from "react";

export function WasmProvider({ children }: { children: React.ReactNode }) {
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[WASM] Starting WASM provider initialization");
    console.log("[WASM] Current origin:", window.location.origin);

    const script = document.createElement("script");
    script.src = "/wasm_exec.js";
    script.async = true;

    // Add more detailed load monitoring
    script.onload = () => {
      console.log("[WASM] wasm_exec.js loaded successfully");
      // Verify Go object is available
      if (typeof (window as any).Go === "undefined") {
        const error = "Go object not found after script load";
        console.error("[WASM]", error);
        setLoadError(error);
        return;
      }
      console.log("[WASM] Go object is available");
      setWasmLoaded(true);
    };

    script.onerror = (error) => {
      /* eslint-disable-next-line @typescript-eslint/no-base-to-string */
      const errorMsg = `Failed to load wasm_exec.js: ${error.toString()}`;
      console.error("[WASM]", errorMsg);
      setLoadError(errorMsg);

      // Log the script's properties
      console.log("[WASM] Script details:", {
        src: script.src,
        crossOrigin: script.crossOrigin,
      });
    };

    // Monitor script state changes
    script.addEventListener("load", () => {
      console.log("[WASM] Script load event fired");
    });

    script.addEventListener("error", (event) => {
      console.error("[WASM] Script error event:", event);
    });

    document.body.appendChild(script);
    console.log("[WASM] Script element added to document");

    // Verify script was added to DOM
    const scriptInDOM = document.querySelector(`script[src="${script.src}"]`);
    console.log("[WASM] Script found in DOM:", !!scriptInDOM);

    return () => {
      console.log("[WASM] Cleaning up WASM provider");
      document.body.removeChild(script);
    };
  }, []);

  if (loadError) {
    console.error("[WASM] Failed to initialize:", loadError);
    return <div>Failed to load WASM: {loadError}</div>;
  }

  if (!wasmLoaded) {
    console.log("[WASM] Still waiting for WASM to load");
    return null;
  }

  console.log("[WASM] WASM provider ready");
  return <>{children}</>;
}
