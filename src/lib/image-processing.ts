import {
  EstimateGridSizeResponse,
  DownscaleResponse,
  EstimateGridSizeWASMResponse,
  DownscaleImageWASMResponse,
} from "../shared-types";

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

export async function estimateGridSizeWASM(
  base64Image: string,
  key: string,
  userId: string,
  timestamp: number,
  nonce: string,
): Promise<EstimateGridSizeWASMResponse> {
  console.log("[Image Processing] Starting estimateGridSize with params:", {
    base64Length: base64Image?.length,
    key,
    userId,
    timestamp,
    nonce,
  });

  return new Promise((resolve, reject) => {
    const worker = getWorker();

    worker.onmessage = (e) => {
      if (e.data.success) {
        resolve({ gridSize: e.data.result.gridSize });
      } else {
        console.error("[Image Processing] Worker error:", e.data.error);
        reject(new Error(e.data.error));
      }
    };

    worker.postMessage({
      type: "estimateGridSize",
      payload: {
        a: base64Image,
        b: key,
        c: userId,
        d: timestamp,
        e: nonce,
      },
    });
  });
}

export async function downscaleImageWASM(
  base64Image: string,
  grid: number,
  key: string,
  userId: string,
  timestamp: number,
  nonce: string,
): Promise<DownscaleImageWASMResponse> {
  console.log("[Image Processing] Starting downscaleImage");
  return new Promise((resolve, reject) => {
    const worker = getWorker();

    worker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.result);
      } else {
        console.error("[Image Processing] Worker error:", e.data.error);
        reject(new Error(e.data.error));
      }
    };

    worker.postMessage({
      type: "downscaleImage",

      payload: {
        a: base64Image,
        b: grid,
        c: key,
        d: userId,
        e: timestamp,
        f: nonce,
      },
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
