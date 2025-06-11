import {
  EstimateGridSizeResponse,
  DownscaleResponse,
  EstimateGridSizeWASMResponse,
  DownscaleImageWASMResponse,
} from "../shared-types";

// Helper function to convert any image to PNG format
export const convertToPng = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log("Start c");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
    console.log("End c");
  });
};

let worker: Worker | null = null;

function getWorker() {
  if (!worker) {
    console.log("[Image Processing] Creating new C++ worker");
    try {
      // Create worker from a blob to ensure correct MIME type
      const workerCode = `
        importScripts('${window.location.origin}/workers/cpp.worker.js');
      `;
      const blob = new Blob([workerCode], { type: "application/javascript" });
      worker = new Worker(URL.createObjectURL(blob));
      console.log("[Image Processing] C++ worker created successfully");

      // Add error handler
      worker.onerror = (error) => {
        console.error("[Image Processing] Worker error:", {
          message: error.message,
          filename: error.filename,
          lineno: error.lineno,
          colno: error.colno,
        });
      };

      // Add message error handler
      worker.onmessageerror = (error) => {
        console.error("[Image Processing] Worker message error:", error);
      };
    } catch (error: any) {
      console.error("[Image Processing] Failed to create worker:", {
        message: error.message,
        stack: error.stack,
        type: typeof error,
      });
      throw error;
    }
  } else {
    console.log("[Image Processing] Using existing C++ worker");
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
    hasKey: !!key,
    hasUserId: !!userId,
    timestamp,
    hasNonce: !!nonce,
  });

  return new Promise((resolve, reject) => {
    const worker = getWorker();
    console.log("[Image Processing] Worker ready for estimateGridSize");

    worker.onmessage = (e) => {
      console.log("[Image Processing] Received estimateGridSize response:", {
        success: e.data.success,
        hasError: !!e.data.error,
        hasResult: !!e.data.result,
        gridSize: e.data.result?.gridSize,
      });

      if (e.data.success) {
        resolve({ gridSize: e.data.result.gridSize });
      } else {
        console.error("[Image Processing] Worker error:", e.data.error);
        reject(new Error(e.data.error));
      }
    };

    console.log(
      "[Image Processing] Sending estimateGridSize request to worker",
    );
    worker.postMessage({
      type: "estimateGridSize",
      payload: {
        base64Image,
        key,
        userId,
        timestamp,
        serverNonce: nonce,
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
  console.log("[Image Processing] Starting downscaleImage with params:", {
    base64Length: base64Image?.length,
    grid,
    hasKey: !!key,
    hasUserId: !!userId,
    timestamp,
    hasNonce: !!nonce,
  });

  return new Promise((resolve, reject) => {
    const worker = getWorker();
    console.log("[Image Processing] Worker ready for downscaleImage");

    worker.onmessage = (e) => {
      console.log("[Image Processing] Received downscaleImage response:", {
        success: e.data.success,
        hasError: !!e.data.error,
        hasResult: !!e.data.result,
        resultsLength: e.data.result?.results?.length,
      });

      if (e.data.success) {
        resolve(e.data.result);
      } else {
        console.error("[Image Processing] Worker error:", e.data.error);
        reject(new Error(e.data.error));
      }
    };

    console.log("[Image Processing] Sending downscaleImage request to worker");
    worker.postMessage({
      type: "downscaleImage",
      payload: {
        base64Image,
        gridSize: grid,
        key,
        userId,
        timestamp,
        serverNonce: nonce,
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

export function sortByLuminance(colors: string[]): string[] {
  return [...colors].sort((a, b) => {
    const getLuminance = (color: string) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return 0.299 * r + 0.587 * g + 0.114 * b;
    };
    return getLuminance(a) - getLuminance(b);
  });
}
