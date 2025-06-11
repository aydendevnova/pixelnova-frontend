import { generateColorRange } from "@/lib/utils/colorizer";
import { SKIN_TONE_RANGES } from "@/lib/utils/skin-colors";

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
  // Since we can't use JSZip or similar libraries without adding dependencies,
  // we'll create a simple download approach by creating a multi-part file
  // For now, let's just download the first image as a fallback
  // In a real implementation, you'd want to add JSZip as a dependency

  if (variations.length === 0) {
    throw new Error("No variations to download");
  }

  // Convert the first image to blob for download
  const response = await fetch(variations[0]!.image);
  return response.blob();
}
