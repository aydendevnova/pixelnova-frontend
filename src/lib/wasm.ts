let wasmInstance: any = null;

export async function initWasm() {
  if (wasmInstance) return wasmInstance;

  try {
    // Load the wasm_exec.js script
    const go = new (window as any).Go();

    // Fetch and instantiate the WASM module
    const result = await WebAssembly.instantiateStreaming(
      fetch("/main.wasm"),
      go.importObject,
    );

    go.run(result.instance);
    wasmInstance = window as any;
    return wasmInstance;
  } catch (error) {
    console.error("Failed to initialize WASM:", error);
    throw error;
  }
}
