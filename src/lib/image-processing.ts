import { initWasm } from "./wasm";
import { EstimateGridSizeResponse, DownscaleResponse } from "../shared-types";

export async function estimateGridSize(
  base64Image: string,
): Promise<EstimateGridSizeResponse> {
  try {
    const wasm = await initWasm();
    const result = wasm.estimateGridSize(base64Image);

    if (result.error) {
      throw new Error(result.error);
    }

    return { gridSize: result.gridSize };
  } catch (error) {
    console.error("Estimate grid size error:", error);
    throw error;
  }
}

export async function downscaleImage(
  base64Image: string,
  grid: number,
): Promise<DownscaleResponse> {
  try {
    const wasm = await initWasm();
    const result = wasm.downscaleImage(base64Image, grid);

    if (!result) {
      throw new Error("WASM function returned no result");
    }

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error("Downscale image error:", error);
    throw error;
  }
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
