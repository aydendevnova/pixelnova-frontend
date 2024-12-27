import { Tool, ToolContext } from "@/types/editor";
import { MinusIcon } from "@heroicons/react/24/outline";
import { drawPixel } from "@/lib/utils/canvas";
import { ListEndIcon, PenLineIcon } from "lucide-react";

// Track the start point for the line
let startPoint: { x: number; y: number } | null = null;
let lastPreviewPoints: { x: number; y: number }[] = [];

function getCanvasCoordinates(
  e: React.MouseEvent,
  canvas: HTMLCanvasElement,
  viewport: { x: number; y: number; scale: number },
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left - viewport.x) / viewport.scale);
  const y = Math.floor((e.clientY - rect.top - viewport.y) / viewport.scale);
  return { x, y };
}

function bresenhamLine(
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

export const LineTool: Tool = {
  id: "line",
  name: "Line",
  icon: MinusIcon,
  shortcut: "L",
  cursor: "crosshair",

  onMouseDown: (e: React.MouseEvent, context: ToolContext) => {
    if (e.button !== 0 && e.button !== 2) return;

    const coords = getCanvasCoordinates(e, context.canvas, context.viewport);
    startPoint = coords;
    lastPreviewPoints = [];

    // Draw initial point
    drawPixel({
      x: coords.x,
      y: coords.y,
      color: e.button === 2 ? context.secondaryColor : context.primaryColor,
      size: context.brushSize,
      layers: context.layers,
      selectedLayerId: context.selectedLayerId,
      canvas: context.canvas,
    });
  },

  onMouseMove: (e: React.MouseEvent, context: ToolContext) => {
    if (!startPoint || (e.buttons !== 1 && e.buttons !== 2)) return;

    const currentPoint = getCanvasCoordinates(
      e,
      context.canvas,
      context.viewport,
    );
    const points = bresenhamLine(
      startPoint.x,
      startPoint.y,
      currentPoint.x,
      currentPoint.y,
    );
    const color =
      e.buttons === 2 ? context.secondaryColor : context.primaryColor;

    // Clear previous preview by redrawing with transparent color
    lastPreviewPoints.forEach((point) => {
      drawPixel({
        x: point.x,
        y: point.y,
        color: "transparent",
        size: context.brushSize,
        layers: context.layers,
        selectedLayerId: context.selectedLayerId,
        canvas: context.canvas,
      });
    });

    // Draw new preview
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

    lastPreviewPoints = points;
  },

  onMouseUp: (e: React.MouseEvent, context: ToolContext) => {
    if (!startPoint || (e.button !== 0 && e.button !== 2)) {
      return;
    }

    const endPoint = getCanvasCoordinates(e, context.canvas, context.viewport);

    // Draw the final line
    const points = bresenhamLine(
      startPoint.x,
      startPoint.y,
      endPoint.x,
      endPoint.y,
    );
    const color =
      e.button === 2 ? context.secondaryColor : context.primaryColor;

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

    // Reset state
    startPoint = null;
    lastPreviewPoints = [];
  },
};
