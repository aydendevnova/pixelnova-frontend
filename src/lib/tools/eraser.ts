import { ToolContext } from "@/types/editor";
import { EraserIcon } from "lucide-react";
import { DrawingTool } from "@/lib/utils/baseTool";
import { getLinePoints } from "@/lib/utils/coordinates";

class EraserToolImpl extends DrawingTool {
  id = "eraser" as const;
  name = "Eraser";
  icon = EraserIcon;
  shortcut = "E";

  protected handleDrawing(
    from: { x: number; y: number },
    to: { x: number; y: number },
    e: React.MouseEvent,
    context: ToolContext,
  ): void {
    const points = getLinePoints(from.x, from.y, to.x, to.y);

    points.forEach((point) => {
      this.drawAtPoint(point.x, point.y, "transparent", context);
    });
  }

  onMouseDown(e: React.MouseEvent, context: ToolContext): void {
    if (e.button !== 0 && e.button !== 2) return;

    const coords = this.getCoordinates(e, context);
    this.lastPoint = coords;
    this.drawAtPoint(coords.x, coords.y, "transparent", context);
  }
}

export const EraserTool = new EraserToolImpl();
