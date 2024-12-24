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
): Promise<EstimateGridSizeWASMResponse> {
  console.log("[Image Processing] Starting estimateGridSize");
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
        base64Image,
        key,
        userId,
        timestamp,
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
        base64Image,
        grid,
        key,
        userId,
        timestamp,
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
