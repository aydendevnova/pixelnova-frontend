import { ToolContext } from "@/types/editor";
import { MinusIcon } from "@heroicons/react/24/outline";
import { PreviewTool } from "@/lib/utils/baseTool";
import { bresenhamLine } from "@/lib/utils/coordinates";
import { drawPixel } from "@/lib/utils/drawing";

class LineToolImpl extends PreviewTool {
  id = "line" as const;
  name = "Line";
  icon = MinusIcon;
  shortcut = "L";

  onMouseDown(e: React.MouseEvent, context: ToolContext) {
    if (e.button !== 0 && e.button !== 2) return;
    const coords = this.getCoordinates(e, context);
    this.startPoint = coords;
    this.lastPreviewPoints = [];
  }

  protected handlePreview(
    from: { x: number; y: number },
    to: { x: number; y: number },
    e: React.MouseEvent,
    context: ToolContext,
  ): void {
    const points = bresenhamLine(from.x, from.y, to.x, to.y);
    this.lastPreviewPoints = points;
  }

  protected handleFinalDraw(
    from: { x: number; y: number },
    to: { x: number; y: number },
    e: React.MouseEvent,
    context: ToolContext,
  ): void {
    const points = bresenhamLine(from.x, from.y, to.x, to.y);
    const color = this.getColor(e, context);

    // Draw final line to layer
    points.forEach((point) => {
      drawPixel({
        x: point.x,
        y: point.y,
        color,
        size: context.brushSize,
        layers: context.layers,
        selectedLayerId: context.selectedLayerId,
        canvas: context.canvas,
      });
    });
  }
}

export const LineTool = new LineToolImpl();
