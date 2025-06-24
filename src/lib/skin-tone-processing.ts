import { generateColorRange } from "@/lib/utils/colorizer";
import { SKIN_TONE_RANGES } from "@/lib/utils/skin-colors";
import JSZip from "jszip";

export interface GeneratedVariant {
  id: string;
  name: string;
  image: string;
}

export interface SkinToneProcessingInput {
  image: string; // base64 data URL
  selectedColors: string[];
  maskedPixels: string[];
}

// Helper functions for base64 and buffer conversion
function base64ToImageData(base64: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = base64;
  });
}

function imageDataToBase64(imageData: ImageData): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}

function processImageWithColorRange(
  imageData: ImageData,
  selectedColors: string[],
  maskedPixels: Set<string>,
  colorRange: string[],
): ImageData {
  const pixels = new Uint8ClampedArray(imageData.data);
  const outputPixels = new Uint8ClampedArray(imageData.data);
  const selectedColorsSet = new Set(selectedColors.map((c) => c.toLowerCase()));

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] ?? 0;
    const g = pixels[i + 1] ?? 0;
    const b = pixels[i + 2] ?? 0;
    const a = pixels[i + 3] ?? 255;

    // Skip transparent pixels
    if (a === 0) {
      outputPixels[i] = 0;
      outputPixels[i + 1] = 0;
      outputPixels[i + 2] = 0;
      outputPixels[i + 3] = 0;
      continue;
    }

    // Calculate pixel position for masking
    const pixelIndex = Math.floor(i / 4);
    const x = pixelIndex % imageData.width;
    const y = Math.floor(pixelIndex / imageData.width);
    const pixelKey = `${x},${y}`;

    // Skip masked pixels
    if (maskedPixels.has(pixelKey)) {
      outputPixels[i] = r;
      outputPixels[i + 1] = g;
      outputPixels[i + 2] = b;
      outputPixels[i + 3] = a;
      continue;
    }

    // Get the color in hex format
    const hex = `#${[r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")}`.toLowerCase();

    // Only process selected colors
    if (!selectedColorsSet.has(hex)) {
      outputPixels[i] = r;
      outputPixels[i + 1] = g;
      outputPixels[i + 2] = b;
      outputPixels[i + 3] = a;
      continue;
    }

    // Find the index of the current color in selectedColors
    const originalColorIndex = selectedColors.findIndex(
      (c) => c.toLowerCase() === hex,
    );
    if (originalColorIndex === -1) {
      outputPixels[i] = r;
      outputPixels[i + 1] = g;
      outputPixels[i + 2] = b;
      outputPixels[i + 3] = a;
      continue;
    }

    // Map to the corresponding color in the range
    const targetColorIndex = Math.min(
      originalColorIndex,
      colorRange.length - 1,
    );
    const targetColor = colorRange[targetColorIndex];

    if (!targetColor) {
      outputPixels[i] = r;
      outputPixels[i + 1] = g;
      outputPixels[i + 2] = b;
      outputPixels[i + 3] = a;
      continue;
    }

    // Apply the new color
    const nr = parseInt(targetColor.slice(1, 3), 16);
    const ng = parseInt(targetColor.slice(3, 5), 16);
    const nb = parseInt(targetColor.slice(5, 7), 16);

    outputPixels[i] = nr;
    outputPixels[i + 1] = ng;
    outputPixels[i + 2] = nb;
    outputPixels[i + 3] = a;
  }

  return new ImageData(outputPixels, imageData.width, imageData.height);
}

export async function generateSkinTones(
  input: SkinToneProcessingInput,
): Promise<{ variations: GeneratedVariant[] }> {
  const { image, selectedColors, maskedPixels } = input;

  // Reverse colors to match server behavior
  const processedSelectedColors =
    selectedColors.length > 0 ? [...selectedColors].reverse() : [];

  // Convert base64 to ImageData
  const imageData = await base64ToImageData(image);

  // Convert maskedPixels array to Set for faster lookup
  const maskedPixelsSet = new Set(maskedPixels);

  const numColors = processedSelectedColors.length;

  const variations = await Promise.all(
    SKIN_TONE_RANGES.map(async ([startColor, endColor], index) => {
      const toneRange = generateColorRange(
        startColor ?? "",
        endColor ?? "",
        numColors,
      );

      const processedImageData = processImageWithColorRange(
        imageData,
        processedSelectedColors,
        maskedPixelsSet,
        toneRange,
      );

      const names = [
        "Very Light",
        "Light",
        "Medium",
        "Dark",
        "Very Dark",
      ] as const;
      const name = names[index] ?? "Unknown";

      return {
        id: crypto.randomUUID(),
        name,
        image: imageDataToBase64(processedImageData),
      };
    }),
  );

  return { variations };
}

export async function downloadVariations(
  variations: { name: string; image: string }[],
): Promise<Blob> {
  const zip = new JSZip();

  // Add each image to the zip
  for (const variation of variations) {
    const response = await fetch(variation.image);
    const blob = await response.blob();
    const filename = `${variation.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`;
    zip.file(filename, blob);
  }

  // Generate and download the zip
  return zip.generateAsync({ type: "blob" });
}

export async function downloadAsSpritesheet(
  variations: { name: string; image: string }[],
): Promise<void> {
  if (variations.length === 0) return;

  // Load all images first to get their dimensions
  const loadedImages = await Promise.all(
    variations.map(async (variation) => {
      const img = await new Promise<HTMLImageElement>((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.src = variation.image;
      });
      return img;
    }),
  );

  // Find the maximum width and height among all images
  let maxWidth = 0;
  let maxHeight = 0;

  loadedImages.forEach((img) => {
    maxWidth = Math.max(maxWidth, img.width);
    maxHeight = Math.max(maxHeight, img.height);
  });

  // Calculate grid dimensions (3 columns, as many rows as needed)
  const cols = 3;
  const rows = Math.ceil(variations.length / cols);

  // Create spritesheet canvas using max dimensions
  const spritesheetCanvas = document.createElement("canvas");
  spritesheetCanvas.width = maxWidth * cols;
  spritesheetCanvas.height = maxHeight * rows;
  const ctx = spritesheetCanvas.getContext("2d");

  if (!ctx) return;

  // Fill background with transparent
  ctx.clearRect(0, 0, spritesheetCanvas.width, spritesheetCanvas.height);

  // Place each image in the grid, centered within its cell
  loadedImages.forEach((img, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    // Calculate cell position
    const cellX = col * maxWidth;
    const cellY = row * maxHeight;

    // Calculate centered position within the cell
    const x = cellX + Math.floor((maxWidth - img.width) / 2);
    const y = cellY + Math.floor((maxHeight - img.height) / 2);

    ctx.drawImage(img, x, y);
  });

  // Download the spritesheet
  spritesheetCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skin_tone_spritesheet.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
