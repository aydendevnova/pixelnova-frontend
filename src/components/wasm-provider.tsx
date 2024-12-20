"use client";

import { useEffect, useState } from "react";

export function WasmProvider({ children }: { children: React.ReactNode }) {
  const [wasmLoaded, setWasmLoaded] = useState(false);

  useEffect(() => {
    console.log("[WASM] Starting WASM provider initialization");

    // Load wasm_exec.js script
    const script = document.createElement("script");
    script.src = "/wasm_exec.js";
    script.async = true;

    script.onload = () => {
      console.log("[WASM] wasm_exec.js loaded successfully");
      setWasmLoaded(true);
    };

    script.onerror = (error) => {
      console.error("[WASM] Failed to load wasm_exec.js:", error);
    };

    document.body.appendChild(script);

    return () => {
      console.log("[WASM] Cleaning up WASM provider");
      document.body.removeChild(script);
    };
  }, []);

  if (!wasmLoaded) {
    console.log("[WASM] Still waiting for WASM to load");
    return null;
  }

  console.log("[WASM] WASM provider ready");
  return <>{children}</>;
}
