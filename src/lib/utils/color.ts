export function extractColors(imageData: ImageData): string[] {
  const colors = new Set<string>();
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] as number;
    const g = data[i + 1] as number;
    const b = data[i + 2] as number;
    const a = data[i + 3] as number;

    // Skip fully transparent pixels
    if (a === 0) continue;

    // Convert to hex
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    colors.add(hex);
  }

  return Array.from(colors);
}
