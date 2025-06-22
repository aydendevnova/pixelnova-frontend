import JSZip from "jszip";

export interface ImageResult {
  preset: string;
  imageData: ImageData;
}

/**
 * Download selected images as a zip file
 */
export const downloadAsZip = async (
  results: ImageResult[],
  selectedIndices: Set<number>,
) => {
  const zip = new JSZip();
  const selectedResults = Array.from(selectedIndices)
    .map((i) => results[i])
    .filter((result): result is ImageResult => result !== undefined);

  // Add each image to the zip
  for (const result of selectedResults) {
    const canvas = document.createElement("canvas");
    canvas.width = result.imageData.width;
    canvas.height = result.imageData.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    ctx.putImageData(result.imageData, 0, 0);

    // Convert canvas to blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve);
    });

    if (blob) {
      const filename = `${result.preset.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`;
      zip.file(filename, blob);
    }
  }

  // Generate and download the zip
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pixelart_images_${new Date().toISOString().split("T")[0]}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Create a spritesheet with images arranged in a grid, optimizing layout for less than 3 images
 */
export const downloadAsSpritesheet = (
  results: ImageResult[],
  selectedIndices: Set<number>,
) => {
  const selectedResults = Array.from(selectedIndices)
    .map((i) => results[i])
    .filter((result): result is ImageResult => result !== undefined);

  if (selectedResults.length === 0) return;

  // Get the first image dimensions (assuming all images are the same size)
  const firstImage = selectedResults[0];
  if (!firstImage) return;

  const imageWidth = firstImage.imageData.width;
  const imageHeight = firstImage.imageData.height;

  // Calculate grid dimensions based on number of images
  let cols = Math.min(selectedResults.length, 3); // Max 3 columns, but use less if fewer images
  let rows = Math.ceil(selectedResults.length / cols);

  // For 2 images, use 2 columns and 1 row
  if (selectedResults.length === 2) {
    cols = 2;
    rows = 1;
  }

  // Create spritesheet canvas with optimized dimensions
  const spritesheetCanvas = document.createElement("canvas");
  spritesheetCanvas.width = imageWidth * cols;
  spritesheetCanvas.height = imageHeight * rows;
  const ctx = spritesheetCanvas.getContext("2d");

  if (!ctx) return;

  // Fill background with transparent
  ctx.clearRect(0, 0, spritesheetCanvas.width, spritesheetCanvas.height);

  // Place each image in the grid
  selectedResults.forEach((result, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = col * imageWidth;
    const y = row * imageHeight;

    // Create temporary canvas for this image
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = imageWidth;
    tempCanvas.height = imageHeight;
    const tempCtx = tempCanvas.getContext("2d");

    if (tempCtx) {
      tempCtx.putImageData(result.imageData, 0, 0);
      ctx.drawImage(tempCanvas, x, y);
    }
  });

  // Download the spritesheet
  spritesheetCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spritesheet.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
};
