import { EstimateGridSizeResponse, DownscaleResponse } from "../shared-types";

let worker: Worker | null = null;

function getWorker() {
  if (!worker) {
    console.log("[Image Processing] Creating new worker");
    worker = new Worker(
      new URL("../workers/image.worker.js", import.meta.url),
      {
        type: "module",
      },
    );
    console.log("[Image Processing] Worker created successfully");
  }
  return worker;
}

export async function estimateGridSize(
  base64Image: string,
): Promise<EstimateGridSizeResponse> {
  console.log("[Image Processing] Starting estimateGridSize");
  return new Promise((resolve, reject) => {
    const worker = getWorker();

    worker.onmessage = (e) => {
      console.log("[Image Processing] Received worker response:", e.data);
      if (e.data.success) {
        resolve({ gridSize: e.data.result.gridSize });
      } else {
        console.error("[Image Processing] Worker error:", e.data.error);
        reject(new Error(e.data.error));
      }
    };

    worker.onerror = (error) => {
      console.error("[Image Processing] Worker error details:", {
        message: error.message,
        filename: error.filename,
        lineno: error.lineno,
        colno: error.colno,
        error: error.error,
      });
      console.error("[Image Processing] Worker state:", {
        origin: self.location.origin,
        wasmExecPath: `${self.location.origin}/wasm_exec.js`,
        wasmPath: `${self.location.origin}/main.wasm`,
      });
      reject(error);
    };

    console.log(
      "[Image Processing] Sending estimateGridSize request to worker",
    );
    worker.postMessage({
      type: "estimateGridSize",
      payload: { base64Image },
    });
  });
}

export async function downscaleImage(
  base64Image: string,
  grid: number,
): Promise<DownscaleResponse> {
  console.log("[Image Processing] Starting downscaleImage");
  return new Promise((resolve, reject) => {
    const worker = getWorker();

    worker.onmessage = (e) => {
      console.log("[Image Processing] Received worker response:", e.data);
      if (e.data.success) {
        resolve(e.data.result);
      } else {
        console.error("[Image Processing] Worker error:", e.data.error);
        reject(new Error(e.data.error));
      }
    };

    worker.onerror = (error) => {
      console.error("[Image Processing] Worker error details:", {
        message: error.message,
        filename: error.filename,
        lineno: error.lineno,
        colno: error.colno,
        error: error.error,
      });
      console.error("[Image Processing] Worker state:", {
        origin: self.location.origin,
        wasmExecPath: `${self.location.origin}/wasm_exec.js`,
        wasmPath: `${self.location.origin}/main.wasm`,
      });
      reject(error);
    };

    console.log("[Image Processing] Sending downscaleImage request to worker");
    worker.postMessage({
      type: "downscaleImage",
      payload: { base64Image, grid },
    });
  });
}

// Helper function if you need to convert a File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
