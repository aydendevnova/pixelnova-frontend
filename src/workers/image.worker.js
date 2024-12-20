// Load wasm_exec.js content as a text
async function loadWasmExec() {
  const response = await fetch("/wasm_exec.js");
  const text = await response.text();
  // Execute the wasm_exec.js content in the worker scope
  eval(text);
}

let wasmInstance = null;

async function initWasmInWorker() {
  if (wasmInstance) return wasmInstance;

  try {
    // Load and execute wasm_exec.js first
    await loadWasmExec();

    const go = new Go();
    const result = await WebAssembly.instantiateStreaming(
      fetch("/main.wasm"),
      go.importObject,
    );

    go.run(result.instance);
    wasmInstance = self;
    return wasmInstance;
  } catch (error) {
    console.error("Failed to initialize WASM in worker:", error);
    throw error;
  }
}

self.onmessage = async (e) => {
  const { type, payload } = e.data;

  try {
    if (!wasmInstance) {
      await initWasmInWorker();
    }

    let result;
    switch (type) {
      case "estimateGridSize":
        result = wasmInstance.estimateGridSize(payload.base64Image);
        break;
      case "downscaleImage":
        result = wasmInstance.downscaleImage(payload.base64Image, payload.grid);
        break;
      default:
        throw new Error(`Unknown operation: ${type}`);
    }

    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
