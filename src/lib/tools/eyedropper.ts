import { ToolContext } from "@/types/editor";
import { Pipette } from "lucide-react";
import { BaseTool } from "@/lib/utils/baseTool";
import { getPixelColor } from "@/lib/utils/drawing";

class EyedropperToolImpl extends BaseTool {
  id = "eyedropper" as const;
  name = "Color Picker";
  icon = Pipette;
  shortcut = "I";
  cursor = "crosshair";

  onMouseDown(e: React.MouseEvent, context: ToolContext): void {
    const { canvas, viewport, layers, onColorPick } = context;
    const coords = this.getCoordinates(e, context);
    const color = getPixelColor(coords.x, coords.y, layers);

    if (color && onColorPick) {
      onColorPick(color, e.button === 2);
    }
  }
}

export const EyedropperTool = new EyedropperToolImpl();
