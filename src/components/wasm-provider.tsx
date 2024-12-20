"use client";

import { useEffect, useState } from "react";

export function WasmProvider({ children }: { children: React.ReactNode }) {
  const [wasmLoaded, setWasmLoaded] = useState(false);

  useEffect(() => {
    // Load wasm_exec.js script
    const script = document.createElement("script");
    script.src = "/wasm_exec.js";
    script.async = true;
    script.onload = () => setWasmLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!wasmLoaded) {
    return null; // Or a loading indicator
  }

  return <>{children}</>;
}
