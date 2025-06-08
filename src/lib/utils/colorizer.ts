export const SKIN_TONE_RANGES = [
  ["#FFE4C8", "#D4B292"],
  ["#F1C27D", "#8D5524"],
  ["#E5B887", "#8B5E34"],
  ["#C68642", "#4A3728"],
  ["#8D5524", "#291807"],
] as const;

export function interpolateColor(
  color1: string,
  color2: string,
  factor: number,
): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

export function generateColorRange(
  startColor: string,
  endColor: string,
  count: number,
): string[] {
  const range: string[] = [];
  for (let i = 0; i < count; i++) {
    const factor = i / (count - 1);
    range.push(interpolateColor(startColor, endColor, factor));
  }
  return range;
}

export function generateMultiColorRange(
  colors: string[],
  count: number,
): string[] {
  if (colors.length < 2) throw new Error("Need at least 2 colors");

  const segmentSize = (count - 1) / (colors.length - 1);
  const range: string[] = [];

  for (let i = 0; i < count; i++) {
    const segment = Math.min(Math.floor(i / segmentSize), colors.length - 2);
    const factor = (i - segment * segmentSize) / segmentSize;
    const color1 = colors[segment];
    const color2 = colors[segment + 1];

    if (!color1 || !color2) throw new Error("Invalid color index");
    range.push(interpolateColor(color1, color2, factor));
  }

  return range;
}

export function isGrayscaleColor(r: number, g: number, b: number): boolean {
  const tolerance = 5; // Allow small variations in RGB values
  return (
    Math.abs(r - g) <= tolerance &&
    Math.abs(g - b) <= tolerance &&
    Math.abs(r - b) <= tolerance
  );
}

function enhanceColor(grayValue: number, targetColor: string): string {
  const r = parseInt(targetColor.slice(1, 3), 16);
  const g = parseInt(targetColor.slice(3, 5), 16);
  const b = parseInt(targetColor.slice(5, 7), 16);

  // Calculate luminance of the gray value (0-1)
  const luminance = grayValue / 255;

  // Enhance saturation based on the gray value
  const saturationFactor = 1.5; // Increase this for more vibrant colors
  const enhancedR = Math.round(r * saturationFactor * luminance);
  const enhancedG = Math.round(g * saturationFactor * luminance);
  const enhancedB = Math.round(b * saturationFactor * luminance);

  // Ensure values stay within 0-255 range
  const finalR = Math.min(255, Math.max(0, enhancedR));
  const finalG = Math.min(255, Math.max(0, enhancedG));
  const finalB = Math.min(255, Math.max(0, enhancedB));

  return `#${[finalR, finalG, finalB]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function colorizeImage(
  imageData: ImageData,
  colors: string[],
  isGrayscale = false,
): ImageData {
  if (colors.length < 2) throw new Error("Need at least 2 colors");

  const pixels = new Uint8ClampedArray(imageData.data);
  const outputPixels = new Uint8ClampedArray(imageData.data);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] ?? 0;
    const g = pixels[i + 1] ?? 0;
    const b = pixels[i + 2] ?? 0;
    const a = pixels[i + 3] ?? 255;

    // Skip transparent pixels
    if (a === 0) continue;

    // For grayscale mode, use tolerance-based detection
    if (isGrayscale && !isGrayscaleColor(r, g, b)) continue;

    // Calculate brightness (0-1)
    const brightness = isGrayscale ? r / 255 : (r + g + b) / (3 * 255);

    // Find the appropriate color from the palette based on brightness
    const colorIndex = Math.floor(brightness * (colors.length - 1));
    const targetColor = colors[colorIndex];

    if (!targetColor) continue;

    // Apply the color
    const newColor = isGrayscale ? enhanceColor(r, targetColor) : targetColor;

    const [nr, ng, nb] = [
      parseInt(newColor.slice(1, 3), 16),
      parseInt(newColor.slice(3, 5), 16),
      parseInt(newColor.slice(5, 7), 16),
    ];

    outputPixels[i] = nr;
    outputPixels[i + 1] = ng;
    outputPixels[i + 2] = nb;
    outputPixels[i + 3] = a;
  }

  return new ImageData(outputPixels, imageData.width, imageData.height);
}

export function convertToGrayscale(imageData: ImageData): ImageData {
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

    // Convert to grayscale using luminance formula
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    outputPixels[i] = gray;
    outputPixels[i + 1] = gray;
    outputPixels[i + 2] = gray;
    outputPixels[i + 3] = a;
  }

  return new ImageData(outputPixels, imageData.width, imageData.height);
}

export function colorizeGrayscale(
  imageData: ImageData,
  colors: string[],
  offset = 0, // -100 to 100, representing percentage shift
): ImageData {
  if (colors.length < 2) throw new Error("Need at least 2 colors");

  // Sort colors by brightness (darkest to lightest)
  const sortedColors = [...colors].sort((a, b) => {
    const getBrightness = (color: string) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return (r + g + b) / 3;
    };
    return getBrightness(a) - getBrightness(b);
  });

  const pixels = new Uint8ClampedArray(imageData.data);
  const outputPixels = new Uint8ClampedArray(imageData.data);

  for (let i = 0; i < pixels.length; i += 4) {
    const gray = pixels[i] ?? 0; // Since it's grayscale, we only need one channel
    const a = pixels[i + 3] ?? 255;

    // Skip transparent pixels
    if (a === 0) {
      outputPixels[i] = 0;
      outputPixels[i + 1] = 0;
      outputPixels[i + 2] = 0;
      outputPixels[i + 3] = 0;
      continue;
    }

    // Apply offset to grayscale value (-100 to 100 maps to -255 to 255)
    const offsetValue = (offset / 100) * 255;
    const adjustedGray = Math.max(0, Math.min(255, gray + offsetValue));

    // Map grayscale value to color index
    const colorIndex = Math.floor(
      (adjustedGray / 255) * (sortedColors.length - 1),
    );
    const targetColor = sortedColors[colorIndex];

    if (!targetColor) continue;

    // Apply the color
    const r = parseInt(targetColor.slice(1, 3), 16);
    const g = parseInt(targetColor.slice(3, 5), 16);
    const b = parseInt(targetColor.slice(5, 7), 16);

    outputPixels[i] = r;
    outputPixels[i + 1] = g;
    outputPixels[i + 2] = b;
    outputPixels[i + 3] = a;
  }

  return new ImageData(outputPixels, imageData.width, imageData.height);
}
