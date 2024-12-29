import { ToolContext } from "@/types/editor";
import { PencilIcon } from "@heroicons/react/24/outline";
import { DrawingTool } from "@/lib/utils/baseTool";
import { getLinePoints } from "@/lib/utils/coordinates";

class PencilToolImpl extends DrawingTool {
  id = "pencil" as const;
  name = "Pencil";
  icon = PencilIcon;
  shortcut = "B";

  protected handleDrawing(
    from: { x: number; y: number },
    to: { x: number; y: number },
    e: React.MouseEvent,
    context: ToolContext,
  ): void {
    const points = getLinePoints(from.x, from.y, to.x, to.y);
    const color = this.getColor(e, context);

    points.forEach((point) => {
      this.drawAtPoint(point.x, point.y, color, context);
    });
  }
}

export const PencilTool = new PencilToolImpl();
