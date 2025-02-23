"use client";

import { useEffect, useState } from "react";

export function WasmProvider({ children }: { children: React.ReactNode }) {
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[WASM] Starting C++ WASM provider initialization");
    console.log("[WASM] Current origin:", window.location.origin);

    // Load the C++ WebAssembly module
    const loadWasmModule = async () => {
      try {
        // First check if files exist
        const wasmResponse = await fetch("/CppWasm.wasm");
        if (!wasmResponse.ok) {
          throw new Error(`Failed to fetch CppWasm.wasm: ${wasmResponse.status} ${wasmResponse.statusText}`);
        }

        const jsResponse = await fetch("/CppWasm.js");
        if (!jsResponse.ok) {
          throw new Error(`Failed to fetch CppWasm.js: ${jsResponse.status} ${jsResponse.statusText}`);
        }

        // Load the JavaScript glue code
        const script = document.createElement("script");
        script.src = "/CppWasm.js";
        script.async = true;

        script.onload = () => {
          console.log("[WASM] C++ module JavaScript glue code loaded successfully");
          // Verify the module is available
          if (typeof (window as any).createCppWasmModule === "undefined") {
            const error = "createCppWasmModule function not found after script load";
            console.error("[WASM]", error);
            setLoadError(error);
            return;
          }
          console.log("[WASM] C++ module is available");
          setWasmLoaded(true);
        };

        script.onerror = (error) => {
          if (typeof error == "object") {
            error = JSON.stringify(error);
          }
          const errorMsg = `Failed to load CppWasm.js: ${error.toString()}`;
          console.error("[WASM]", errorMsg);
          setLoadError(errorMsg);
        };

        // Add script to document
        document.body.appendChild(script);
        console.log("[WASM] Script element added to document");

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error loading WASM";
        console.error("[WASM] Failed to initialize:", errorMsg);
        setLoadError(errorMsg);
      }
    };

    void loadWasmModule();

    return () => {
      console.log("[WASM] Cleaning up C++ WASM provider");
      const script = document.querySelector('script[src="/CppWasm.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (loadError) {
    console.error("[WASM] Failed to initialize:", loadError);
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="p-6 bg-gray-100 border rounded-lg max-w-lg">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Unable to Load Editor
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            We encountered an issue loading the pixel editor. This could be due to:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mb-4 space-y-1">
            <li>An unstable internet connection</li>
            <li>Browser compatibility issues</li>
            <li>Security settings blocking WebAssembly</li>
          </ul>
          <div className="text-sm text-muted-foreground">
            Try refreshing the page or using a different browser. If the problem persists, please contact support.
            <br />
            <span className="text-xs text-destructive/80 mt-2 block">
              Failed to load WASM module: <br/>{loadError}
            </span>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  if (!wasmLoaded) {
    console.log("[WASM] Still waiting for WASM to load");
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-6 p-8 rounded-lg">
          {/* Pixel Art Loading Animation */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 pixel-grid animate-pixel-wave">
              {Array.from({ length: 8 * 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-primary/80"
                  style={{
                    left: `${(i % 8) * 12}px`,
                    top: `${Math.floor(i / 8) * 12}px`,
                    animation: `pixel-fade 2s infinite ${i * 0.05}s`,
                    opacity: 0
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-xl font-bold text-primary">Loading PixelNova</h3>
            <p className="text-sm text-muted-foreground animate-pulse">
             Downloading Editor Tools...
            </p>
          </div>
        </div>
      </div>
    );
  }

  console.log("[WASM] C++ WASM provider ready");
  return <>{children}</>;
}


