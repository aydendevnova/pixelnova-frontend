import { Tool, ToolContext } from "@/types/editor";
import { PencilIcon } from "@heroicons/react/24/outline";
import { drawPixel } from "@/lib/utils/canvas";

// Track the last point for interpolation
let lastPoint: { x: number; y: number } | null = null;

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

    // Set the initial point
    lastPoint = coords;

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
    if (e.buttons === 0) {
      lastPoint = null;
      return;
    }

    const {
      canvas,
      viewport,
      primaryColor,
      secondaryColor,
      brushSize,
      layers,
      selectedLayerId,
    } = context;
    const isRightClick = (e.buttons & 2) !== 0;
    const currentPoint = getCanvasCoordinates(e, canvas, viewport);

    if (lastPoint) {
      // Calculate points between last and current position
      const points = getLinePoints(
        lastPoint.x,
        lastPoint.y,
        currentPoint.x,
        currentPoint.y,
      );

      // Draw all interpolated points
      for (const point of points) {
        drawPixel({
          x: point.x,
          y: point.y,
          color: isRightClick ? secondaryColor : primaryColor,
          size: brushSize,
          layers,
          selectedLayerId,
          canvas,
        });
      }
    }

    lastPoint = currentPoint;
  },

  onMouseUp: () => {
    lastPoint = null;
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

// Bresenham's line algorithm for smooth interpolation
function getLinePoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    points.push({ x: x0, y: y0 });

    if (x0 === x1 && y0 === y1) break;

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return points;
}
