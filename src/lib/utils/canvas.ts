import { Layer } from "@/types/editor";

interface DrawPixelParams {
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
  if (!selectedLayer || !selectedLayer.visible) return;

  // Create a new canvas for the layer if it doesn't exist
  if (!selectedLayer.imageData) {
    selectedLayer.imageData = new ImageData(canvas.width, canvas.height);
  }

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
  if (!tempCtx) return;

  // Draw existing layer data
  tempCtx.putImageData(selectedLayer.imageData, 0, 0);

  const halfSize = Math.floor(size / 2);

  // Draw new pixels
  for (let offsetY = 0; offsetY < size; offsetY++) {
    for (let offsetX = 0; offsetX < size; offsetX++) {
      const pixelX = x - halfSize + offsetX;
      const pixelY = y - halfSize + offsetY;

      if (
        pixelX < 0 ||
        pixelX >= canvas.width ||
        pixelY < 0 ||
        pixelY >= canvas.height
      ) {
        continue;
      }

      if (color === "transparent") {
        tempCtx.clearRect(pixelX, pixelY, 1, 1);
      } else {
        tempCtx.fillStyle = color;
        tempCtx.fillRect(pixelX, pixelY, 1, 1);
      }
    }
  }

  // Update layer's imageData
  selectedLayer.imageData = tempCtx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  );
}

export function getPixelColor(
  x: number,
  y: number,
  layers: Layer[],
): string | null {
  console.log("🎨 getPixelColor called with x:", x, "y:", y);
  console.log("🎨 Number of layers:", layers.length);

  // Find the topmost visible layer with a pixel at the given coordinates
  for (const layer of layers.slice().reverse()) {
    if (!layer.visible || !layer.imageData) {
      console.log(
        "🎨 Skipping layer - visible:",
        layer.visible,
        "has imageData:",
        !!layer.imageData,
      );
      continue;
    }

    const index = (y * layer.imageData.width + x) * 4;
    const data = layer.imageData.data;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const a = data[index + 3];

    console.log("🎨 Checking pixel - r:", r, "g:", g, "b:", b, "a:", a);

    if (!r || !g || !b || !a) {
      console.log("🎨 Skipping - missing color component");
      continue;
    }
    if (a === 0) {
      console.log("🎨 Skipping - transparent pixel");
      continue;
    }

    if (a < 255) {
      const color = `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
      console.log("🎨 Returning rgba color:", color);
      return color;
    }

    const color = `#${[r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()}`;
    console.log("🎨 Returning hex color:", color);
    return color;
  }

  console.log("🎨 No color found, returning null");
  return null;
}

export function createImageData(
  width: number,
  height: number,
  fillStyle?: string,
): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, width, height);
  }

  return ctx.getImageData(0, 0, width, height);
}
