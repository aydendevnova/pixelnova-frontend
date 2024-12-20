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
    console.log("[WASM] Using existing WASM instance");
    return wasmInstance;
  }

  try {
    console.log("[WASM] Starting WASM initialization");

    // Load the wasm_exec.js script
    const go = new (window as any).Go();
    console.log("[WASM] Created Go instance");

    // Fetch and instantiate the WASM module
    console.log("[WASM] Fetching main.wasm");
    const response = await fetch("/main.wasm");
    if (!response.ok) {
      throw new Error(
        `Failed to fetch main.wasm: ${response.status} ${response.statusText}`,
      );
    }

    console.log("[WASM] Instantiating WASM module");
    const result = await WebAssembly.instantiateStreaming(
      response,
      go.importObject,
    );

    console.log("[WASM] Running WASM instance");
    go.run(result.instance);

    wasmInstance = window as any;
    console.log("[WASM] WASM initialization complete");
    return wasmInstance;
  } catch (error) {
    console.error("[WASM] Failed to initialize WASM:", error);
    throw error;
  }
}
