import { useState, useCallback } from "react";

export function useImageProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(
    async (imageData: ImageData, operation: string) => {
      setIsProcessing(true);
      setError(null);

      return new Promise((resolve, reject) => {
        // Modern way to create a worker in Next.js
        const worker = new Worker(
          new URL("../workers/image.worker.ts", import.meta.url),
        );

        worker.onmessage = (e) => {
          setIsProcessing(false);
          if (e.data.success) {
            resolve(e.data.result);
          } else {
            setError(e.data.error);
            reject(new Error(e.data.error));
          }
          worker.terminate();
        };

        worker.onerror = (e) => {
          setIsProcessing(false);
          setError(e.message);
          reject(e);
          worker.terminate();
        };

        // Use transferable objects to avoid copying large data
        worker.postMessage(
          { imageData, operation },
          [imageData.data.buffer], // Transfer the underlying ArrayBuffer
        );
      });
    },
    [],
  );

  return { processImage, isProcessing, error };
}
