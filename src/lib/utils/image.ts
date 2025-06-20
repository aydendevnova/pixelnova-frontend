import Pica from "pica";

// Initialize pica instance
const pica = new Pica({
  features: ["js", "wasm", "ww"],
});

export async function loadImageFromFile(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function extractColors(imageData: ImageData): string[] {
  const colorSet = new Set<string>();
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip fully transparent pixels
    if (a === 0) continue;

    // Convert to hex color
    const color = `#${(
      (1 << 24) +
      ((r ?? 0) << 16) +
      ((g ?? 0) << 8) +
      (b ?? 0)
    )
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
    colorSet.add(color);
  }

  return Array.from(colorSet);
}

export async function resizeImageWithPica(imageUrl: string): Promise<string> {
  // Create an image element to load the source
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageUrl;
  });

  // Calculate new dimensions maintaining aspect ratio
  let newWidth = img.width;
  let newHeight = img.height;
  const maxDimension = 512;

  if (newWidth > maxDimension || newHeight > maxDimension) {
    if (newWidth > newHeight) {
      newHeight = Math.round((newHeight * maxDimension) / newWidth);
      newWidth = maxDimension;
    } else {
      newWidth = Math.round((newWidth * maxDimension) / newHeight);
      newHeight = maxDimension;
    }
  }

  // Create source and destination canvases
  const from = document.createElement("canvas");
  from.width = img.width;
  from.height = img.height;
  const fromCtx = from.getContext("2d");
  if (!fromCtx) throw new Error("Failed to get canvas context");
  fromCtx.drawImage(img, 0, 0);

  const to = document.createElement("canvas");
  to.width = newWidth;
  to.height = newHeight;

  // Perform the resize operation
  await pica.resize(from, to, {
    unsharpAmount: 160,
    unsharpRadius: 0.6,
    unsharpThreshold: 1,
  });

  // Convert to blob and then to data URL
  const blob = await pica.toBlob(to, "image/png", 0.9);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
