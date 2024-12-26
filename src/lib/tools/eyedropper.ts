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
    console.log("👁️ Eyedropper onMouseDown");
    const { canvas, viewport, layers } = context;
    const coords = getCanvasCoordinates(e, canvas, viewport);
    console.log("👁️ Coordinates:", coords);

    const color = getPixelColor(coords.x, coords.y, layers);
    console.log("👁️ Picked color:", color);

    if (color) {
      console.log("👁️ Setting color, isRightClick:", e.button === 2);
      context.onColorPick?.(color, e.button === 2);
    } else {
      console.log("👁️ No color found at coordinates");
    }
  },
};
