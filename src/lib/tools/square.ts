import { ToolContext } from "@/types/editor";
import { SquareIcon } from "lucide-react";
import { PreviewTool } from "@/lib/utils/baseTool";

class SquareToolImpl extends PreviewTool {
  id = "square" as const;
  name = "Square";
  icon = SquareIcon;
  shortcut = "S";
  private _isFilled = false;

  get isFilled(): boolean {
    return this._isFilled;
  }

  protected handlePreview(
    from: { x: number; y: number },
    to: { x: number; y: number },
    e: React.MouseEvent,
    context: ToolContext,
  ): void {
    const points: { x: number; y: number }[] = [];
    const minX = Math.min(from.x, to.x);
    const maxX = Math.max(from.x, to.x);
    const minY = Math.min(from.y, to.y);
    const maxY = Math.max(from.y, to.y);

    if (this._isFilled) {
      // For filled preview, only generate outline points to reduce computation
      // Top and bottom lines
      for (let x = minX; x <= maxX; x++) {
        points.push({ x, y: minY }, { x, y: maxY });
      }
      // Left and right lines (excluding corners)
      for (let y = minY + 1; y < maxY; y++) {
        points.push({ x: minX, y }, { x: maxX, y });
      }
    } else {
      // For outline, generate only the perimeter points
      // Top and bottom lines
      for (let x = minX; x <= maxX; x++) {
        points.push({ x, y: minY }, { x, y: maxY });
      }
      // Left and right lines (excluding corners)
      for (let y = minY + 1; y < maxY; y++) {
        points.push({ x: minX, y }, { x: maxX, y });
      }
    }

    this.lastPreviewPoints = points;
  }

  protected handleFinalDraw(
    from: { x: number; y: number },
    to: { x: number; y: number },
    e: React.MouseEvent,
    context: ToolContext,
  ): void {
    const color = this.getColor(e, context);
    const minX = Math.min(from.x, to.x);
    const maxX = Math.max(from.x, to.x);
    const minY = Math.min(from.y, to.y);
    const maxY = Math.max(from.y, to.y);
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    if (this._isFilled) {
      // Create a temporary canvas for batch drawing
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = context.canvas.width;
      tempCanvas.height = context.canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      // Draw the filled rectangle in one operation
      tempCtx.fillStyle = color;
      tempCtx.fillRect(minX, minY, width, height);

      // Get the image data and apply it to the layer
      const imageData = tempCtx.getImageData(minX, minY, width, height);
      const selectedLayer = context.layers.find(
        (layer) => layer.id === context.selectedLayerId,
      );
      if (!selectedLayer?.imageData) return;

      // Copy the pixels from the temp canvas to the layer
      const layerData = selectedLayer.imageData.data;
      const tempData = imageData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const layerPos = ((minY + y) * context.canvas.width + (minX + x)) * 4;
          const tempPos = (y * width + x) * 4;

          const r = tempData[tempPos] ?? 0;
          const g = tempData[tempPos + 1] ?? 0;
          const b = tempData[tempPos + 2] ?? 0;
          const a = tempData[tempPos + 3] ?? 0;

          layerData[layerPos] = r;
          layerData[layerPos + 1] = g;
          layerData[layerPos + 2] = b;
          layerData[layerPos + 3] = a;
        }
      }
    } else {
      // For outline, draw only the perimeter
      // Top and bottom lines
      for (let x = minX; x <= maxX; x++) {
        this.drawAtPoint(x, minY, color, context);
        this.drawAtPoint(x, maxY, color, context);
      }
      // Left and right lines (excluding corners)
      for (let y = minY + 1; y < maxY; y++) {
        this.drawAtPoint(minX, y, color, context);
        this.drawAtPoint(maxX, y, color, context);
      }
    }
  }

  setFilled(filled: boolean) {
    this._isFilled = filled;
  }
}

export const SquareTool = new SquareToolImpl();
