import { ToolContext } from "@/types/editor";
import { CircleIcon } from "lucide-react";
import { PreviewTool } from "@/lib/utils/baseTool";

class CircleToolImpl extends PreviewTool {
  id = "circle" as const;
  name = "Circle";
  icon = CircleIcon;
  shortcut = "C";
  private _isFilled = false;
  protected lastPoint: { x: number; y: number } | null = null;

  get isFilled(): boolean {
    return this._isFilled;
  }

  onMouseDown(e: React.MouseEvent, context: ToolContext): void {
    if (e.button !== 0 && e.button !== 2) return;

    const coords = this.getCoordinates(e, context);
    this.lastPoint = coords;
    super.onMouseDown(e, context);
  }

  protected handlePreview(
    from: { x: number; y: number },
    to: { x: number; y: number },
    e: React.MouseEvent,
    context: ToolContext,
  ): void {
    const points: { x: number; y: number }[] = [];
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    const centerX = Math.round((from.x + to.x) / 2);
    const centerY = Math.round((from.y + to.y) / 2);
    const radius = Math.round(Math.max(dx, dy) / 2);

    if (this._isFilled) {
      this.generateFilledCirclePoints(centerX, centerY, radius, points);
    } else {
      this.generateCirclePoints(centerX, centerY, radius, points);
    }

    // Expand points based on brush size
    const expandedPoints = new Set<string>();
    const shouldExpand = context.brushSize > 1;

    points.forEach((point) => {
      // Always add the original point
      expandedPoints.add(`${point.x},${point.y}`);

      // If brush size > 1, add one pixel around the point
      if (shouldExpand) {
        expandedPoints.add(`${point.x + 1},${point.y}`);
        expandedPoints.add(`${point.x - 1},${point.y}`);
        expandedPoints.add(`${point.x},${point.y + 1}`);
        expandedPoints.add(`${point.x},${point.y - 1}`);
      }
    });

    // Convert back to points array
    this.lastPreviewPoints = Array.from(expandedPoints).map((pos) => {
      const [xStr, yStr] = pos.split(",");
      const x = parseInt(xStr ?? "0");
      const y = parseInt(yStr ?? "0");
      return { x, y };
    });
  }

  private addCirclePoints(
    centerX: number,
    centerY: number,
    x: number,
    y: number,
    points: { x: number; y: number }[],
  ) {
    if (x === 0) {
      points.push(
        { x: centerX, y: centerY + y },
        { x: centerX, y: centerY - y },
        { x: centerX + y, y: centerY },
        { x: centerX - y, y: centerY },
      );
    } else if (x === y) {
      points.push(
        { x: centerX + x, y: centerY + y },
        { x: centerX - x, y: centerY + y },
        { x: centerX + x, y: centerY - y },
        { x: centerX - x, y: centerY - y },
      );
    } else if (x < y) {
      points.push(
        { x: centerX + x, y: centerY + y },
        { x: centerX - x, y: centerY + y },
        { x: centerX + x, y: centerY - y },
        { x: centerX - x, y: centerY - y },
        { x: centerX + y, y: centerY + x },
        { x: centerX - y, y: centerY + x },
        { x: centerX + y, y: centerY - x },
        { x: centerX - y, y: centerY - x },
      );
    }
  }

  private generateCirclePoints(
    centerX: number,
    centerY: number,
    radius: number,
    points: { x: number; y: number }[],
  ) {
    let x = 0;
    let y = radius;
    let p = (5 - radius * 4) / 4;

    this.addCirclePoints(centerX, centerY, x, y, points);
    while (x < y) {
      x++;
      if (p < 0) {
        p += 2 * x + 1;
      } else {
        y--;
        p += 2 * (x - y) + 1;
      }
      this.addCirclePoints(centerX, centerY, x, y, points);
    }
  }

  private generateFilledCirclePoints(
    centerX: number,
    centerY: number,
    radius: number,
    points: { x: number; y: number }[],
  ) {
    const outlinePoints = new Set<string>();
    let x = 0;
    let y = radius;
    let p = (5 - radius * 4) / 4;

    const addToOutline = (x: number, y: number) => {
      outlinePoints.add(`${x},${y}`);
    };

    // Generate outline points
    const addOutlinePoints = (x: number, y: number) => {
      if (x === 0) {
        addToOutline(centerX, centerY + y);
        addToOutline(centerX, centerY - y);
        addToOutline(centerX + y, centerY);
        addToOutline(centerX - y, centerY);
      } else if (x === y) {
        addToOutline(centerX + x, centerY + y);
        addToOutline(centerX - x, centerY + y);
        addToOutline(centerX + x, centerY - y);
        addToOutline(centerX - x, centerY - y);
      } else if (x < y) {
        addToOutline(centerX + x, centerY + y);
        addToOutline(centerX - x, centerY + y);
        addToOutline(centerX + x, centerY - y);
        addToOutline(centerX - x, centerY - y);
        addToOutline(centerX + y, centerY + x);
        addToOutline(centerX - y, centerY + x);
        addToOutline(centerX + y, centerY - x);
        addToOutline(centerX - y, centerY - x);
      }
    };

    addOutlinePoints(x, y);
    while (x < y) {
      x++;
      if (p < 0) {
        p += 2 * x + 1;
      } else {
        y--;
        p += 2 * (x - y) + 1;
      }
      addOutlinePoints(x, y);
    }

    // Find bounds for each y-coordinate
    const bounds = new Map<number, { minX: number; maxX: number }>();
    outlinePoints.forEach((pos) => {
      const parts = pos.split(",");
      if (parts.length !== 2) return;

      const [xStr, yStr] = parts;
      const x = parseInt(xStr ?? "");
      const y = parseInt(yStr ?? "");

      if (isNaN(x) || isNaN(y)) return;

      const current = bounds.get(y) ?? { minX: x, maxX: x };
      bounds.set(y, {
        minX: Math.min(current.minX, x),
        maxX: Math.max(current.maxX, x),
      });
    });

    // Fill between bounds
    bounds.forEach((bound, y) => {
      for (let x = bound.minX; x <= bound.maxX; x++) {
        points.push({ x, y });
      }
    });
  }

  protected handleFinalDraw(
    from: { x: number; y: number },
    to: { x: number; y: number },
    e: React.MouseEvent,
    context: ToolContext,
  ): void {
    const color = this.getColor(e, context);
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    const centerX = Math.round((from.x + to.x) / 2);
    const centerY = Math.round((from.y + to.y) / 2);
    const radius = Math.round(Math.max(dx, dy) / 2);

    // Create a temporary canvas for batch drawing
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = context.canvas.width;
    tempCanvas.height = context.canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // Set the color for drawing
    tempCtx.fillStyle = color;

    // Generate base points
    const points: { x: number; y: number }[] = [];
    if (this._isFilled) {
      this.generateFilledCirclePoints(centerX, centerY, radius, points);
    } else {
      this.generateCirclePoints(centerX, centerY, radius, points);
    }

    // Expand points based on brush size
    const expandedPoints = new Set<string>();
    const shouldExpand = context.brushSize > 1;

    points.forEach((point) => {
      // Always add the original point
      expandedPoints.add(`${point.x},${point.y}`);

      // If brush size > 1, add one pixel around the point
      if (shouldExpand) {
        expandedPoints.add(`${point.x + 1},${point.y}`);
        expandedPoints.add(`${point.x - 1},${point.y}`);
        expandedPoints.add(`${point.x},${point.y + 1}`);
        expandedPoints.add(`${point.x},${point.y - 1}`);
      }
    });

    // Draw expanded points
    Array.from(expandedPoints).forEach((pos) => {
      const [xStr, yStr] = pos.split(",");
      const x = parseInt(xStr ?? "0");
      const y = parseInt(yStr ?? "0");
      if (!isNaN(x) && !isNaN(y)) {
        tempCtx.fillRect(x, y, 1, 1);
      }
    });

    // Calculate the bounding box of the circle with brush size
    const padding = shouldExpand ? 1 : 0;
    const minX = centerX - radius - padding - 1;
    const minY = centerY - radius - padding - 1;
    const size = radius * 2 + padding * 2 + 2;

    // Get the image data and apply it to the layer
    const imageData = tempCtx.getImageData(minX, minY, size, size);
    const selectedLayer = context.layers.find(
      (layer) => layer.id === context.selectedLayerId,
    );
    if (!selectedLayer?.imageData) return;

    // Copy the pixels from the temp canvas to the layer
    const layerData = selectedLayer.imageData.data;
    const tempData = imageData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const layerPos = ((minY + y) * context.canvas.width + (minX + x)) * 4;
        const tempPos = (y * size + x) * 4;

        const r = tempData[tempPos] ?? 0;
        const g = tempData[tempPos + 1] ?? 0;
        const b = tempData[tempPos + 2] ?? 0;
        const a = tempData[tempPos + 3] ?? 0;

        if (a > 0) {
          // Only copy non-transparent pixels
          layerData[layerPos] = r;
          layerData[layerPos + 1] = g;
          layerData[layerPos + 2] = b;
          layerData[layerPos + 3] = a;
        }
      }
    }
  }

  setFilled(filled: boolean) {
    this._isFilled = filled;
  }
}

export const CircleTool = new CircleToolImpl();
