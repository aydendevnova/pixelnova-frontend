import { Layer } from "@/types/editor";

export type WidthPadDirection = "left" | "center" | "right";
export type HeightPadDirection = "top" | "center" | "bottom";

export interface PadDirection {
  width: WidthPadDirection;
  height: HeightPadDirection;
}

/**
 * Resizes a single layer to new dimensions with specified padding direction
 */
export function resizeLayer(
  layer: Layer,
  newWidth: number,
  newHeight: number,
  padDirection: PadDirection,
): ImageData {
  if (!layer.imageData) {
    return new ImageData(newWidth, newHeight);
  }

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = newWidth;
  tempCanvas.height = newHeight;
  const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
  if (!tempCtx) throw new Error("Failed to get canvas context");

  // Create a temporary canvas for the original image
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = layer.imageData.width;
  sourceCanvas.height = layer.imageData.height;
  const sourceCtx = sourceCanvas.getContext("2d");
  if (!sourceCtx) throw new Error("Failed to get source canvas context");

  // Draw the original image data
  sourceCtx.putImageData(layer.imageData, 0, 0);

  // Calculate position based on padding direction
  let x = 0;
  let y = 0;

  // Calculate x position based on width padding direction
  switch (padDirection.width) {
    case "center":
      x = Math.floor((newWidth - layer.imageData.width) / 2);
      break;
    case "right":
      x = newWidth - layer.imageData.width;
      break;
    case "left":
      x = 0;
      break;
  }

  // Calculate y position based on height padding direction
  switch (padDirection.height) {
    case "center":
      y = Math.floor((newHeight - layer.imageData.height) / 2);
      break;
    case "bottom":
      y = newHeight - layer.imageData.height;
      break;
    case "top":
      y = 0;
      break;
  }

  // Draw the image at the calculated position
  tempCtx.drawImage(sourceCanvas, x, y);

  return tempCtx.getImageData(0, 0, newWidth, newHeight);
}

/**
 * Resizes all layers in a canvas to new dimensions
 */
export function resizeAllLayers(
  layers: Layer[],
  newWidth: number,
  newHeight: number,
  padDirection: PadDirection,
): Layer[] {
  return layers.map((layer) => ({
    ...layer,
    imageData: resizeLayer(layer, newWidth, newHeight, padDirection),
  }));
}

/**
 * Creates a preview of how the canvas will look after resizing
 */
export function generateResizePreview(
  layers: Layer[],
  currentWidth: number,
  currentHeight: number,
  newWidth: number,
  newHeight: number,
  padDirection: PadDirection,
  thumbnailSize = 300,
): string {
  const previewCanvas = document.createElement("canvas");
  previewCanvas.width = thumbnailSize;
  previewCanvas.height = thumbnailSize;
  const ctx = previewCanvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get preview canvas context");

  // Clear canvas
  ctx.clearRect(0, 0, thumbnailSize, thumbnailSize);

  // Draw checkerboard pattern for transparency
  ctx.fillStyle = "#E5E7EB";
  for (let x = 0; x < thumbnailSize; x += 8) {
    for (let y = 0; y < thumbnailSize; y += 8) {
      if ((x + y) % 16 === 0) {
        ctx.fillRect(x, y, 8, 8);
      }
    }
  }
  ctx.fillStyle = "#D1D5DB";
  for (let x = 0; x < thumbnailSize; x += 8) {
    for (let y = 0; y < thumbnailSize; y += 8) {
      if ((x + y) % 16 !== 0) {
        ctx.fillRect(x, y, 8, 8);
      }
    }
  }

  // Create temporary canvas for the resized content
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = newWidth;
  tempCanvas.height = newHeight;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) throw new Error("Failed to get temp canvas context");

  // Draw all visible layers to temp canvas
  layers.forEach((layer) => {
    if (layer.visible && layer.imageData) {
      const resizedLayer = resizeLayer(
        layer,
        newWidth,
        newHeight,
        padDirection,
      );
      tempCtx.putImageData(resizedLayer, 0, 0);
    }
  });

  // Calculate scale to fit thumbnail
  const scale = Math.min(thumbnailSize / newWidth, thumbnailSize / newHeight);

  // Center the image in the thumbnail
  const x = (thumbnailSize - newWidth * scale) / 2;
  const y = (thumbnailSize - newHeight * scale) / 2;

  // Draw scaled image
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, x, y, newWidth * scale, newHeight * scale);

  // Draw grid if dimensions are small enough
  if (newWidth <= 64 && newHeight <= 64) {
    tempCtx.beginPath();
    tempCtx.strokeStyle = "rgba(128, 128, 128, 0.5)";
    tempCtx.lineWidth = 0.5;

    for (let i = 0; i <= newWidth; i++) {
      tempCtx.moveTo(i + 0.5, 0);
      tempCtx.lineTo(i + 0.5, newHeight);
    }
    for (let i = 0; i <= newHeight; i++) {
      tempCtx.moveTo(0, i + 0.5);
      tempCtx.lineTo(newWidth, i + 0.5);
    }
    tempCtx.stroke();
  }

  // Draw canvas bounds outline
  // Draw white outline
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, newWidth * scale, newHeight * scale);

  // Draw black outline offset
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 1, y - 1, newWidth * scale + 2, newHeight * scale + 2);

  // Draw previous size outline if canvas is being resized larger
  if (newWidth > currentWidth || newHeight > currentHeight) {
    // Calculate previous size position
    const prevX = x + ((newWidth - currentWidth) * scale) / 2;
    const prevY = y + ((newHeight - currentHeight) * scale) / 2;

    // Draw dashed outline for previous size
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(prevX, prevY, currentWidth * scale, currentHeight * scale);
    ctx.setLineDash([]); // Reset dash pattern
  }

  return previewCanvas.toDataURL();
}
