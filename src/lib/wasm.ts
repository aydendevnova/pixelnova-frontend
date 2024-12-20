function checkWasmSupport() {
  if (typeof WebAssembly === "undefined") {
    console.error("[WASM] WebAssembly is not supported in this browser");
    return false;
  }

  try {
    const module = new WebAssembly.Module(
      new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]),
    );
    if (module instanceof WebAssembly.Module) {
      const instance = new WebAssembly.Instance(module);
      return instance instanceof WebAssembly.Instance;
    }
  } catch (e) {
    console.error("[WASM] WebAssembly instantiation failed:", e);
    return false;
  }
  return true;
}

let wasmInstance: any = null;

export async function initWasm() {
  if (!checkWasmSupport()) {
    throw new Error("WebAssembly is not supported in this environment");
  }

  if (wasmInstance) {
    console.log("[WASM Init] Using existing WASM instance");
    return wasmInstance;
  }

  try {
    console.log("[WASM Init] Starting WASM initialization");

    if (typeof (window as any).Go === "undefined") {
      throw new Error(
        "Go is not defined - wasm_exec.js may not be loaded correctly",
      );
    }

    // Load the wasm_exec.js script
    const go = new (window as any).Go();
    console.log("[WASM Init] Created Go instance:", !!go);

    // Fetch and instantiate the WASM module
    console.log("[WASM Init] Fetching main.wasm");
    const response = await fetch("/main.wasm");

    if (!response.ok) {
      console.error(
        "[WASM Init] Failed to fetch main.wasm:",
        response.status,
        response.statusText,
      );
      throw new Error(
        `Failed to fetch main.wasm: ${response.status} ${response.statusText}`,
      );
    }

    console.log("[WASM Init] main.wasm fetched successfully");

    try {
      console.log("[WASM Init] Instantiating WASM module");
      const result = await WebAssembly.instantiateStreaming(
        response,
        go.importObject,
      );
      console.log("[WASM Init] WASM module instantiated successfully");

      console.log("[WASM Init] Running WASM instance");
      go.run(result.instance);

      wasmInstance = window as any;

      // Verify WASM functions are available
      console.log("[WASM Init] Checking WASM functions:", {
        estimateGridSize: typeof wasmInstance.estimateGridSize === "function",
        downscaleImage: typeof wasmInstance.downscaleImage === "function",
      });

      return wasmInstance;
    } catch (instantiateError) {
      console.error(
        "[WASM Init] Failed to instantiate WASM:",
        instantiateError,
      );
      throw instantiateError;
    }
  } catch (error) {
    console.error("[WASM Init] Failed to initialize WASM:", error);
    throw error;
  }
}
