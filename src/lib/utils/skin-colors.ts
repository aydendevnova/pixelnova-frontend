import { generateColorRange } from "./colorizer";

export const SKIN_TONE_RANGES = [
  ["#FFD4B0", "#E89E6C"],
  ["#F1C27D", "#8D5524"],
  ["#E8B98C", "#966B4D"],
  ["#C68642", "#4A3728"],
  ["#8D5524", "#291807"],
] as const;

export type SkinToneRange = (typeof SKIN_TONE_RANGES)[number];

export function getBrightness(color: string): number {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return (r + g + b) / 3;
}

export function sortByBrightness(colors: string[]): string[] {
  return [...colors].sort((a, b) => getBrightness(a) - getBrightness(b));
}

export function extractColors(imageData: ImageData): string[] {
  const colors = new Set<string>();
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] ?? 0;
    const g = pixels[i + 1] ?? 0;
    const b = pixels[i + 2] ?? 0;
    const a = pixels[i + 3] ?? 0;

    // Skip fully transparent pixels
    if (a === 0) continue;

    const hex = `#${[r, g, b]
      .map((x) => x?.toString(16).padStart(2, "0") ?? "00")
      .join("")}`;
    colors.add(hex);
  }

  return sortByBrightness(Array.from(colors));
}

export function generateSkinToneGradient(
  range: SkinToneRange,
  steps = 15,
): string[] {
  return generateColorRange(range[0], range[1], steps);
}

export function colorizeToSkinTone(
  imageData: ImageData,
  skinToneRange: SkinToneRange,
  selectedColors: string[],
  offset = 0, // -100 to 100, representing percentage shift
): ImageData {
  // Generate a gradient of skin tones
  const skinTones = generateSkinToneGradient(skinToneRange);

  // Sort colors by brightness (darkest to lightest)
  const sortedColors = sortByBrightness(skinTones);
  const selectedColorsSet = new Set(selectedColors.map((c) => c.toLowerCase()));

  const pixels = new Uint8ClampedArray(imageData.data);
  const outputPixels = new Uint8ClampedArray(imageData.data);

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

    // Apply offset to brightness value (-100 to 100 maps to -255 to 255)
    const brightness = getBrightness(hex);
    const offsetValue = (offset / 100) * 255;
    const adjustedBrightness = Math.max(
      0,
      Math.min(255, brightness + offsetValue),
    );

    // Map brightness to color index
    const colorIndex = Math.floor(
      (adjustedBrightness / 255) * (sortedColors.length - 1),
    );
    const targetColor = sortedColors[colorIndex];

    if (!targetColor) continue;

    // Apply the color
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
