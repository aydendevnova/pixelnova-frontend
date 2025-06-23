export const PRESET_RESOLUTIONS = [
  { value: 32, label: "32x32" },
  { value: 64, label: "64x64" },
  { value: 96, label: "96x96" },
  { value: 128, label: "128x128" },
];

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

function getImageData(image: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = image;
  });
}

function findMedianColor(colors: Color[]): Color {
  if (colors.length === 0) return { r: 0, g: 0, b: 0, a: 255 };
  if (colors.length === 1) return colors[0]!;

  // Extract individual channels
  const rs = colors.map((c) => c.r);
  const gs = colors.map((c) => c.g);
  const bs = colors.map((c) => c.b);
  const as = colors.map((c) => c.a);

  // Find median for each channel
  const medianIndex = Math.floor(colors.length / 2);

  // Sort and get median
  rs.sort((a, b) => a - b);
  gs.sort((a, b) => a - b);
  bs.sort((a, b) => a - b);
  as.sort((a, b) => a - b);

  return {
    r: rs[medianIndex] ?? 0,
    g: gs[medianIndex] ?? 0,
    b: bs[medianIndex] ?? 0,
    a: as[medianIndex] ?? 255,
  };
}

export interface DownscaleOptions {
  colorProcessing?: boolean;
  colorQuantization?: boolean;
  maxColors?: number;
}

function calculateTargetDimensions(
  srcWidth: number,
  srcHeight: number,
  targetSize: number,
): { width: number; height: number } {
  const aspectRatio = srcWidth / srcHeight;

  if (aspectRatio > 1) {
    // Landscape
    const width = targetSize;
    const height = Math.max(1, Math.floor(width / aspectRatio));
    return { width, height };
  } else {
    // Portrait or square
    const height = targetSize;
    const width = Math.max(1, Math.floor(height * aspectRatio));
    return { width, height };
  }
}

export async function downscaleImage(
  imageUrl: string,
  targetSize: number,
  options: DownscaleOptions = {
    colorProcessing: true,
    colorQuantization: false,
    maxColors: 32,
  },
): Promise<string> {
  const imageData = await getImageData(imageUrl);
  const { width: srcWidth, height: srcHeight, data: srcData } = imageData;

  // Calculate target dimensions - always use targetSize as width
  const targetWidth = targetSize;
  const targetHeight = Math.max(
    1,
    Math.floor((targetSize * srcHeight) / srcWidth),
  );

  // Create output canvas with calculated dimensions
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  if (!options.colorProcessing) {
    // Simple downscaling without color processing
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });
    // Disable image smoothing for pixel art
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  } else {
    // Calculate precise cell dimensions
    const cellWidth = srcWidth / targetWidth;
    const cellHeight = srcHeight / targetHeight;

    // Process each cell
    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        // Calculate source rectangle for this cell with precise boundaries
        const startX = Math.floor(x * cellWidth);
        const startY = Math.floor(y * cellHeight);
        const endX = Math.min(Math.ceil((x + 1) * cellWidth), srcWidth);
        const endY = Math.min(Math.ceil((y + 1) * cellHeight), srcHeight);

        // Get the exact pixel data for this cell
        const cellData = new Uint8ClampedArray(
          (endX - startX) * (endY - startY) * 4,
        );
        let idx = 0;

        for (let sy = startY; sy < endY; sy++) {
          for (let sx = startX; sx < endX; sx++) {
            const i = (sy * srcWidth + sx) * 4;
            if (i >= 0 && i + 3 < srcData.length) {
              cellData[idx++] = srcData[i] ?? 0; // r
              cellData[idx++] = srcData[i + 1] ?? 0; // g
              cellData[idx++] = srcData[i + 2] ?? 0; // b
              cellData[idx++] = srcData[i + 3] ?? 0; // a
            }
          }
        }

        const colors: Color[] = [];
        for (let i = 0; i < cellData.length; i += 4) {
          colors.push({
            r: cellData[i] ?? 0,
            g: cellData[i + 1] ?? 0,
            b: cellData[i + 2] ?? 0,
            a: cellData[i + 3] ?? 0,
          });
        }

        if (colors.length === 0) continue;

        // Find median color for this cell
        const medianColor = findMedianColor(colors);

        // Set output pixel
        const outData = ctx.createImageData(1, 1);
        outData.data[0] = medianColor.r;
        outData.data[1] = medianColor.g;
        outData.data[2] = medianColor.b;
        outData.data[3] = medianColor.a;
        ctx.putImageData(outData, x, y);
      }
    }
  }

  // Return as data URL
  return canvas.toDataURL("image/png");
}
