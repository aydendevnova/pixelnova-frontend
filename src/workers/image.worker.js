const wasmExecPath = `${self.location.origin}/wasm_exec.js`;
const wasmPath = `${self.location.origin}/main.wasm`;

async function loadWasmExec() {
  const response = await fetch(wasmExecPath);
  const text = await response.text();
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
    console.log("[WASM Worker] Worker location:", self.location.href);
    console.log("[WASM Worker] WASM exec path:", wasmExecPath);
    console.log("[WASM Worker] WASM path:", wasmPath);

    await loadWasmExec();

    if (typeof Go === "undefined") {
      throw new Error(
        "[WASM Worker] Go is not defined after loading wasm_exec.js",
      );
    }

    console.log("[WASM Worker] Creating Go instance");
    const go = new Go();
    console.log(
      "[WASM Worker] Go instance created:",
      !!go,
      "importObject:",
      !!go.importObject,
    );

    console.log("[WASM Worker] Fetching main.wasm");
    const response = await fetch(wasmPath);
    console.log("[WASM Worker] WASM fetch response:", {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      throw new Error(
        `[WASM Worker] Failed to fetch main.wasm: ${response.status} ${response.statusText}`,
      );
    }

    try {
      console.log("[WASM Worker] Instantiating WASM module");
      const result = await WebAssembly.instantiateStreaming(
        response,
        go.importObject,
      );
      console.log("[WASM Worker] WASM instantiation successful:", !!result);

      console.log("[WASM Worker] Running WASM instance");
      await go.run(result.instance);

      wasmInstance = self;
      console.log(
        "[WASM Worker] Available global functions:",
        Object.keys(self),
      );
      return wasmInstance;
    } catch (instantiateError) {
      console.error("[WASM Worker] WASM instantiation error:", {
        name: instantiateError.name,
        message: instantiateError.message,
        stack: instantiateError.stack,
      });
      throw instantiateError;
    }
  } catch (error) {
    console.error("[WASM Worker] Full initialization error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
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
