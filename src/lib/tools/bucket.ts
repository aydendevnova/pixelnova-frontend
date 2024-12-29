import { ToolContext } from "@/types/editor";
import { PaintBucketIcon } from "lucide-react";
import { BaseTool } from "@/lib/utils/baseTool";

class BucketToolImpl extends BaseTool {
  id = "bucket" as const;
  name = "Fill";
  icon = PaintBucketIcon;
  shortcut = "G";
  cursor = "crosshair";

  onMouseDown(e: React.MouseEvent, context: ToolContext): void {
    const { layers, selectedLayerId, bucketTolerance } = context;
    const coords = this.getCoordinates(e, context);
    const color = this.getColor(e, context);

    const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);
    if (!selectedLayer?.imageData) return;

    this.floodFill(
      selectedLayer.imageData,
      coords.x,
      coords.y,
      color,
      bucketTolerance,
    );
  }

  private floodFill(
    imageData: ImageData,
    startX: number,
    startY: number,
    fillColor: string,
    tolerance: number,
  ) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    // Convert fill color to RGBA
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 1;
    tempCanvas.height = 1;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCtx.fillStyle = fillColor;
    tempCtx.fillRect(0, 0, 1, 1);
    const fillColorData = tempCtx.getImageData(0, 0, 1, 1).data;
    const [fillR, fillG, fillB, fillA] = [
      fillColorData[0] ?? 0,
      fillColorData[1] ?? 0,
      fillColorData[2] ?? 0,
      fillColorData[3] ?? 0,
    ];

    // Get target color
    const startPos = (startY * width + startX) * 4;
    const targetR = data[startPos] ?? 0;
    const targetG = data[startPos + 1] ?? 0;
    const targetB = data[startPos + 2] ?? 0;
    const targetA = data[startPos + 3] ?? 0;

    // Don't fill if colors are the same
    if (
      targetR === fillR &&
      targetG === fillG &&
      targetB === fillB &&
      targetA === fillA
    ) {
      return;
    }

    // Stack for flood fill
    const stack: [number, number][] = [[startX, startY]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      const pos = (y * width + x) * 4;
      const r = data[pos] ?? 0;
      const g = data[pos + 1] ?? 0;
      const b = data[pos + 2] ?? 0;
      const a = data[pos + 3] ?? 0;

      // Check if color is within tolerance
      if (
        Math.abs(r - targetR) <= tolerance &&
        Math.abs(g - targetG) <= tolerance &&
        Math.abs(b - targetB) <= tolerance &&
        Math.abs(a - targetA) <= tolerance
      ) {
        // Fill pixel
        data[pos] = fillR;
        data[pos + 1] = fillG;
        data[pos + 2] = fillB;
        data[pos + 3] = fillA;

        // Add adjacent pixels
        if (x > 0) stack.push([x - 1, y]);
        if (x < width - 1) stack.push([x + 1, y]);
        if (y > 0) stack.push([x, y - 1]);
        if (y < height - 1) stack.push([x, y + 1]);
      }
    }
  }
}

export const BucketTool = new BucketToolImpl();
