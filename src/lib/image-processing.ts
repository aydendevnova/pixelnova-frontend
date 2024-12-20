import { EstimateGridSizeResponse, DownscaleResponse } from "../shared-types";

let worker: Worker | null = null;

function getWorker() {
  if (!worker) {
    worker = new Worker(
      new URL("../workers/image.worker.js", import.meta.url),
      {
        type: "module",
      },
    );
  }
  return worker;
}

export async function estimateGridSize(
  base64Image: string,
): Promise<EstimateGridSizeResponse> {
  return new Promise((resolve, reject) => {
    const worker = getWorker();

    worker.onmessage = (e) => {
      if (e.data.success) {
        resolve({ gridSize: e.data.result.gridSize });
      } else {
        reject(new Error(e.data.error));
      }
    };

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
  return new Promise((resolve, reject) => {
    const worker = getWorker();

    worker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.result);
      } else {
        reject(new Error(e.data.error));
      }
    };

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
