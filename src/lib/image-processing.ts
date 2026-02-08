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
