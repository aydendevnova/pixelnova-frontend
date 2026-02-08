import { Layer } from "@/types/editor";

export interface DrawPixelParams {
  x: number;
  y: number;
  color: string;
  size: number;
  layers: Layer[];
  selectedLayerId: string;
  canvas: HTMLCanvasElement;
}

export function drawPixel({
  x,
  y,
  color,
  size,
  layers,
  selectedLayerId,
  canvas,
}: DrawPixelParams) {
  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);
  if (!selectedLayer?.imageData) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Create a temporary canvas for the new pixel
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = selectedLayer.imageData.width;
  tempCanvas.height = selectedLayer.imageData.height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;

  // Draw the current layer
  tempCtx.putImageData(selectedLayer.imageData, 0, 0);

  const offset = Math.floor(size / 2);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const pixelX = x - offset + i;
      const pixelY = y - offset + j;
      if (
        pixelX >= 0 &&
        pixelX < canvas.width &&
        pixelY >= 0 &&
        pixelY < canvas.height
      ) {
        if (color === "transparent") {
          tempCtx.clearRect(pixelX, pixelY, 1, 1);
        } else {
          tempCtx.fillStyle = color;
          tempCtx.fillRect(pixelX, pixelY, 1, 1);
        }
      }
    }
  }

  // Update the layer with the new image data
  selectedLayer.imageData = tempCtx.getImageData(
    0,
    0,
    tempCanvas.width,
    tempCanvas.height,
  );
}

export function drawPreviewPixel({
  x,
  y,
  color,
  size,
  canvas,
}: Omit<DrawPixelParams, "layers" | "selectedLayerId">) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = color;
  const offset = Math.floor(size / 2);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const pixelX = x - offset + i;
      const pixelY = y - offset + j;
      if (
        pixelX >= 0 &&
        pixelX < canvas.width &&
        pixelY >= 0 &&
        pixelY < canvas.height
      ) {
        ctx.fillRect(pixelX, pixelY, 1, 1);
      }
    }
  }
}

export function getPixelColor(
  x: number,
  y: number,
  layers: Layer[],
  selectedLayerId?: string,
): string | null {
  // Create a temporary canvas to sample colors
  const tempCanvas = document.createElement("canvas");
  const visibleLayers = layers.filter(
    (layer) => layer.visible && layer.imageData,
  );

  if (visibleLayers.length === 0) return null;

  const firstLayer = visibleLayers[0];
  if (!firstLayer?.imageData) return null;

  tempCanvas.width = firstLayer.imageData.width;
  tempCanvas.height = firstLayer.imageData.height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return null;

  // If we have a selected layer, start from there and search upwards
  if (selectedLayerId) {
    const selectedLayerIndex = visibleLayers.findIndex(
      (layer) => layer.id === selectedLayerId,
    );
    if (selectedLayerIndex !== -1) {
      // First check the selected layer
      const selectedLayer = visibleLayers[selectedLayerIndex];
      if (selectedLayer?.imageData) {
        tempCtx.putImageData(selectedLayer.imageData, 0, 0);
        const pixel = tempCtx.getImageData(x, y, 1, 1).data;
        if (pixel[3] !== 0) {
          // Found a non-transparent pixel in the selected layer
          if (pixel[3] === 255) {
            return `#${[pixel[0], pixel[1], pixel[2]]
              .map((x) => x?.toString(16).padStart(2, "0"))
              .join("")
              .toUpperCase()}`;
          }
          return `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${(pixel[3] ?? 0) / 255})`;
        }

        // If not found in selected layer, check layers above it
        for (let i = selectedLayerIndex - 1; i >= 0; i--) {
          const layer = visibleLayers[i];
          if (layer?.imageData) {
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.putImageData(layer.imageData, 0, 0);
            const pixel = tempCtx.getImageData(x, y, 1, 1).data;
            if (pixel[3] !== 0) {
              // Found a non-transparent pixel
              if (pixel[3] === 255) {
                return `#${[pixel[0], pixel[1], pixel[2]]
                  .map((x) => x?.toString(16).padStart(2, "0"))
                  .join("")
                  .toUpperCase()}`;
              }
              return `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${(pixel[3] ?? 0) / 255})`;
            }
          }
        }
      }
    }
  }

  return "transparent";
}

export function drawToolPreview(
  points: { x: number; y: number }[],
  color: string,
  size: number,
  layers: Layer[],
  selectedLayerId: string,
  canvas: HTMLCanvasElement,
  lastPreviewPoints?: { x: number; y: number }[],
): { x: number; y: number }[] {
  const ctx = canvas.getContext("2d");
  if (!ctx) return points;

  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);
  if (!selectedLayer?.imageData) return points;

  // Clear the previous preview by redrawing the original layer
  ctx.putImageData(selectedLayer.imageData, 0, 0);

  // Draw the preview directly on the canvas
  ctx.fillStyle = color;
  points.forEach((point) => {
    const offset = Math.floor(size / 2);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const pixelX = point.x - offset + i;
        const pixelY = point.y - offset + j;
        if (
          pixelX >= 0 &&
          pixelX < canvas.width &&
          pixelY >= 0 &&
          pixelY < canvas.height
        ) {
          ctx.fillRect(pixelX, pixelY, 1, 1);
        }
      }
    }
  });

  return points;
}

export function convertToBasicColors(imageData: ImageData): ImageData {
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    // Get RGBA values
    const r = data[i] as number;
    const g = data[i + 1] as number;
    const b = data[i + 2] as number;
    const a = data[i + 3] as number;

    // Convert to basic colors (quantize to 32 levels)
    const newR = Math.round(r / 32) * 32;
    const newG = Math.round(g / 32) * 32;
    const newB = Math.round(b / 32) * 32;

    // Set new values
    newData[i] = newR;
    newData[i + 1] = newG;
    newData[i + 2] = newB;
    newData[i + 3] = a;
  }

  return new ImageData(newData, imageData.width, imageData.height);
}
