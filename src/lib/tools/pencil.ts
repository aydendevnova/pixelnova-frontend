import { Tool, ToolContext } from "@/types/editor";
import { PencilIcon } from "@heroicons/react/24/outline";
import { drawPixel } from "@/lib/utils/canvas";

export const PencilTool: Tool = {
  id: "pencil",
  name: "Pencil",
  icon: PencilIcon,
  shortcut: "B",
  cursor: "crosshair",

  onMouseDown: (e: React.MouseEvent, context: ToolContext) => {
    const {
      canvas,
      viewport,
      primaryColor,
      secondaryColor,
      brushSize,
      layers,
      selectedLayerId,
    } = context;
    const isRightClick = e.button === 2;
    const coords = getCanvasCoordinates(e, canvas, viewport);

    drawPixel({
      x: coords.x,
      y: coords.y,
      color: isRightClick ? secondaryColor : primaryColor,
      size: brushSize,
      layers,
      selectedLayerId,
      canvas,
    });
  },

  onMouseMove: (e: React.MouseEvent, context: ToolContext) => {
    if (e.buttons === 0) return; // Not drawing

    const {
      canvas,
      viewport,
      primaryColor,
      secondaryColor,
      brushSize,
      layers,
      selectedLayerId,
    } = context;
    const isRightClick = (e.buttons & 2) !== 0; // Check if right button is pressed
    const coords = getCanvasCoordinates(e, canvas, viewport);

    drawPixel({
      x: coords.x,
      y: coords.y,
      color: isRightClick ? secondaryColor : primaryColor,
      size: brushSize,
      layers,
      selectedLayerId,
      canvas,
    });
  },
};

function getCanvasCoordinates(
  e: React.MouseEvent,
  canvas: HTMLCanvasElement,
  viewport: { x: number; y: number; scale: number },
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  return {
    x: Math.floor((mouseX - viewport.x) / viewport.scale),
    y: Math.floor((mouseY - viewport.y) / viewport.scale),
  };
}
