import { Tool, ToolContext } from "@/types/editor";
import { Pipette } from "lucide-react";
import { getCanvasCoordinates } from "@/lib/utils/coordinates";
import { getPixelColor } from "@/lib/utils/canvas";

export const EyedropperTool: Tool = {
  id: "eyedropper",
  name: "Color Picker",
  icon: Pipette,
  shortcut: "I",
  cursor: "crosshair",

  onMouseDown: (e: React.MouseEvent, context: ToolContext) => {
    const { canvas, viewport, layers } = context;
    const coords = getCanvasCoordinates(e, canvas, viewport);

    const color = getPixelColor(coords.x, coords.y, layers);

    context.onColorPick?.(color || "transparent", e.button === 2);
  },
};
