// Load wasm_exec.js content as a text
async function loadWasmExec() {
  console.log("[WASM Worker] Fetching wasm_exec.js");
  const response = await fetch("/wasm_exec.js");
  const text = await response.text();
  console.log("[WASM Worker] Executing wasm_exec.js content");
  eval(text);
}

let wasmInstance = null;

async function initWasmInWorker() {
  if (wasmInstance) {
    console.log("[WASM Worker] Using existing WASM instance");
    return wasmInstance;
  }

  try {
    console.log("[WASM Worker] Starting WASM initialization in worker");
    await loadWasmExec();

    console.log("[WASM Worker] Creating Go instance");
    const go = new Go();

    console.log("[WASM Worker] Fetching main.wasm");
    const response = await fetch("/main.wasm");
    if (!response.ok) {
      throw new Error(
        `Failed to fetch main.wasm: ${response.status} ${response.statusText}`,
      );
    }

    console.log("[WASM Worker] Instantiating WASM module");
    const result = await WebAssembly.instantiateStreaming(
      response,
      go.importObject,
    );

    console.log("[WASM Worker] Running WASM instance");
    go.run(result.instance);

    wasmInstance = self;
    console.log("[WASM Worker] WASM initialization complete in worker");
    return wasmInstance;
  } catch (error) {
    console.error("[WASM Worker] Failed to initialize WASM in worker:", error);
    throw error;
  }
}

self.onmessage = async (e) => {
  const { type, payload } = e.data;
  console.log("[WASM Worker] Received message:", type);

  try {
    if (!wasmInstance) {
      await initWasmInWorker();
    }

    let result;
    switch (type) {
      case "estimateGridSize":
        console.log("[WASM Worker] Estimating grid size");
        result = wasmInstance.estimateGridSize(payload.base64Image);
        break;
      case "downscaleImage":
        console.log("[WASM Worker] Downscaling image");
        result = wasmInstance.downscaleImage(payload.base64Image, payload.grid);
        break;
      default:
        throw new Error(`Unknown operation: ${type}`);
    }

    console.log("[WASM Worker] Operation completed successfully");
    self.postMessage({ success: true, result });
  } catch (error) {
    console.error("[WASM Worker] Operation failed:", error);
    self.postMessage({ success: false, error: error.message });
  }
};
