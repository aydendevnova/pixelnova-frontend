import { Tool, ToolContext } from "@/types/editor";
import { EraserIcon } from "lucide-react";
import { drawPixel } from "@/lib/utils/canvas";
import { getCanvasCoordinates } from "@/lib/utils/coordinates";

export const EraserTool: Tool = {
  id: "eraser",
  name: "Eraser",
  icon: EraserIcon,
  shortcut: "E",
  cursor: "crosshair",

  onMouseDown: (e: React.MouseEvent, context: ToolContext) => {
    const { canvas, viewport, brushSize, layers, selectedLayerId } = context;
    const coords = getCanvasCoordinates(e, canvas, viewport);

    drawPixel({
      x: coords.x,
      y: coords.y,
      color: "transparent",
      size: brushSize,
      layers,
      selectedLayerId,
      canvas,
    });
  },

  onMouseMove: (e: React.MouseEvent, context: ToolContext) => {
    if (e.buttons === 0) return; // Not erasing

    const { canvas, viewport, brushSize, layers, selectedLayerId } = context;
    const coords = getCanvasCoordinates(e, canvas, viewport);

    drawPixel({
      x: coords.x,
      y: coords.y,
      color: "transparent",
      size: brushSize,
      layers,
      selectedLayerId,
      canvas,
    });
  },
};
