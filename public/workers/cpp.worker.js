/* eslint-disable no-restricted-globals */
let wasmInstance = null;

// Add global error handler for uncaught errors
self.addEventListener('error', (event) => {
  console.error('[CPP Worker] Uncaught error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

// Add global unhandled rejection handler
self.addEventListener('unhandledrejection', (event) => {
  console.error('[CPP Worker] Unhandled rejection:', {
    reason: event.reason,
    promise: event.promise
  });
});

// Helper function to get base URL
function getBaseUrl() {
  const origin = self.location.origin;
  // Check if we're in a Next.js environment with a base path
  const pathname = self.location.pathname;
  const basePath = pathname.substring(0, pathname.indexOf('/workers/'));
  return `${origin}${basePath}`;
}

async function initWasmInWorker() {
  if (wasmInstance) {
    console.log("[CPP Worker] Using existing WASM instance");
    return wasmInstance;
  }

  try {
    console.log("[CPP Worker] Starting WASM initialization in worker");
    const baseUrl = getBaseUrl();
    console.log("[CPP Worker] Base URL:", baseUrl);

    // Fetch and instantiate the WASM module
    console.log("[CPP Worker] Fetching CppWasm.wasm");
    const wasmUrl = `${baseUrl}/CppWasm.wasm`;
    console.log("[CPP Worker] WASM URL:", wasmUrl);
    
    const wasmResponse = await fetch(wasmUrl);
    console.log("[CPP Worker] WASM fetch response:", {
      ok: wasmResponse.ok,
      status: wasmResponse.status,
      statusText: wasmResponse.statusText,
      headers: Object.fromEntries(wasmResponse.headers.entries())
    });
    
    if (!wasmResponse.ok) {
      throw new Error(
        `[CPP Worker] Failed to fetch CppWasm.wasm: ${wasmResponse.status} ${wasmResponse.statusText}`,
      );
    }

    // Verify WASM file is valid
    const wasmBuffer = await wasmResponse.arrayBuffer();
    console.log("[CPP Worker] WASM buffer size:", wasmBuffer.byteLength);

    console.log("[CPP Worker] Loading JavaScript glue code");
    try {
      const jsUrl = `${baseUrl}/CppWasm.js`;
      console.log("[CPP Worker] JS URL:", jsUrl);
      const jsResponse = await fetch(jsUrl);
      console.log("[CPP Worker] JS glue code fetch response:", {
        ok: jsResponse.ok,
        status: jsResponse.status,
        statusText: jsResponse.statusText
      });

      if (!jsResponse.ok) {
        throw new Error(
          `[CPP Worker] Failed to fetch CppWasm.js: ${jsResponse.status} ${jsResponse.statusText}`
        );
      }

      const jsCode = await jsResponse.text();
      console.log("[CPP Worker] JS glue code size:", jsCode.length);

      // Create a blob URL for the JS code
      const blob = new Blob([jsCode], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      console.log("[CPP Worker] Created blob URL for JS glue code");

      // Use importScripts instead of dynamic import in worker
      importScripts(blobUrl);
      console.log("[CPP Worker] JavaScript glue code loaded successfully");
      
      console.log("[CPP Worker] Initializing WASM module");
      // @ts-ignore
      wasmInstance = await createCppWasmModule({
        wasmBinary: wasmBuffer,
        locateFile: (path) => {
          console.log("[CPP Worker] Resolving path:", path);
          if (path.endsWith('.wasm')) {
            return wasmUrl;
          }
          return `${baseUrl}/${path}`;
        }
      });
      console.log("[CPP Worker] WASM module initialized successfully");

      // Clean up blob URL
      URL.revokeObjectURL(blobUrl);

      // Verify functions are available
      console.log("[CPP Worker] Checking available functions:", {
        estimateGridSize: typeof wasmInstance.estimateGridSize === "function",
        downscaleImage: typeof wasmInstance.downscaleImage === "function"
      });

      return wasmInstance;
    } catch (jsError) {
      console.error("[CPP Worker] Failed to load JavaScript glue code:", {
        name: jsError.name,
        message: jsError.message,
        stack: jsError.stack,
        type: typeof jsError
      });
      throw jsError;
    }
  } catch (error) {
    console.error("[CPP Worker] Full initialization error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: typeof error
    });
    throw error;
  }
}

self.onmessage = async (e) => {
  const { type, payload } = e.data;
  console.log("[CPP Worker] Received message:", type, "with payload:", {
    type,
    base64Length: payload.base64Image?.length,
    hasKey: !!payload.key,
    hasUserId: !!payload.userId,
    timestamp: payload.timestamp,
    hasNonce: !!payload.serverNonce,
    gridSize: payload.gridSize
  });

  try {
    console.log("[CPP Worker] Checking WASM instance");
    if (!wasmInstance) {
      console.log("[CPP Worker] No WASM instance found, initializing...");
      await initWasmInWorker();
      console.log("[CPP Worker] WASM instance initialized");
    }

    if (!wasmInstance) {
      throw new Error("Failed to initialize WASM instance");
    }

    console.log("[CPP Worker] Processing request type:", type);
    let result;
    switch (type) {
      case "estimateGridSize":
        console.log("[CPP Worker] Starting grid size estimation");
        result = await wasmInstance.estimateGridSize(
          payload.base64Image,
          payload.key,
          payload.userId,
          payload.timestamp,
          payload.serverNonce,
        );
        console.log("[CPP Worker] Grid size estimation completed:", result);
        break;

      case "downscaleImage":
        console.log("[CPP Worker] Starting image downscaling");
        result = await wasmInstance.downscaleImage(
          payload.base64Image,
          payload.gridSize,
          payload.key,
          payload.userId,
          payload.timestamp,
          payload.serverNonce,
        );
        console.log("[CPP Worker] Image downscaling completed:", {
          hasResult: !!result,
          hasError: !!result?.error,
          resultsLength: result?.results?.length
        });
        break;

      default:
        throw new Error(`Unknown operation: ${type}`);
    }

    if (result && result.error) {
      console.error("[CPP Worker] Operation returned error:", result.error);
      throw new Error(result.error);
    }

    console.log("[CPP Worker] Operation completed successfully");
    self.postMessage({ success: true, result });
  } catch (error) {
    console.error("[CPP Worker] Operation failed:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: typeof error
    });
    self.postMessage({ success: false, error: error.message });
  }
}; 