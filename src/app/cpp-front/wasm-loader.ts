import type { PixelNovaModule } from './types';

let worker: Worker | null = null;

function getWorker() {
  if (!worker) {
    console.log("[CPP Processing] Creating new worker");
    try {
      // Create worker from a blob to ensure correct MIME type
      const workerCode = `
        importScripts('${window.location.origin}/workers/cpp.worker.js');
      `;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      worker = new Worker(URL.createObjectURL(blob));
      console.log("[CPP Processing] Worker created successfully");

      // Add error handler
      worker.onerror = (error) => {
        console.error("[CPP Processing] Worker error:", {
          message: error.message,
          filename: error.filename,
          lineno: error.lineno,
          colno: error.colno
        });
      };

      // Add message error handler
      worker.onmessageerror = (error) => {
        console.error("[CPP Processing] Worker message error:", error);
      };

    } catch (error: any) {
      console.error("[CPP Processing] Failed to create worker:", {
        message: error.message,
        stack: error.stack,
        type: typeof error
      });
      throw error;
    }
  } else {
    console.log("[CPP Processing] Using existing worker");
  }
  return worker;
}

export async function estimateGridSize(
  base64Image: string,
  key: string,
  userId: string,
  timestamp: number,
  serverNonce: string,
): Promise<{ gridSize: number }> {
  console.log("[CPP Processing] Starting estimateGridSize with params:", {
    base64Length: base64Image?.length,
    hasKey: !!key,
    hasUserId: !!userId,
    timestamp,
    hasNonce: !!serverNonce
  });

  return new Promise((resolve, reject) => {
    const worker = getWorker();
    console.log("[CPP Processing] Worker ready for estimateGridSize");

    worker.onmessage = (e) => {
      console.log("[CPP Processing] Received estimateGridSize response:", {
        success: e.data.success,
        hasError: !!e.data.error,
        hasResult: !!e.data.result,
        gridSize: e.data.result?.gridSize
      });

      if (e.data.success) {
        resolve({ gridSize: e.data.result.gridSize });
      } else {
        console.error("[CPP Processing] Worker error:", e.data.error);
        reject(new Error(e.data.error));
      }
    };

    console.log("[CPP Processing] Sending estimateGridSize request to worker");
    worker.postMessage({
      type: "estimateGridSize",
      payload: {
        base64Image,
        key,
        userId,
        timestamp,
        serverNonce,
      },
    });
  });
}

export async function downscaleImage(
  base64Image: string,
  gridSize: number,
  key: string,
  userId: string,
  timestamp: number,
  serverNonce: string,
): Promise<{
  results: Array<{
    image: string;
    grid: number;
  }>;
}> {
  console.log("[CPP Processing] Starting downscaleImage with params:", {
    base64Length: base64Image?.length,
    gridSize,
    hasKey: !!key,
    hasUserId: !!userId,
    timestamp,
    hasNonce: !!serverNonce
  });

  return new Promise((resolve, reject) => {
    const worker = getWorker();
    console.log("[CPP Processing] Worker ready for downscaleImage");

    worker.onmessage = (e) => {
      console.log("[CPP Processing] Received downscaleImage response:", {
        success: e.data.success,
        hasError: !!e.data.error,
        hasResult: !!e.data.result,
        resultsLength: e.data.result?.results?.length
      });

      if (e.data.success) {
        resolve(e.data.result);
      } else {
        console.error("[CPP Processing] Worker error:", e.data.error);
        reject(new Error(e.data.error));
      }
    };

    console.log("[CPP Processing] Sending downscaleImage request to worker");
    worker.postMessage({
      type: "downscaleImage",
      payload: {
        base64Image,
        gridSize,
        key,
        userId,
        timestamp,
        serverNonce,
      },
    });
  });
} 