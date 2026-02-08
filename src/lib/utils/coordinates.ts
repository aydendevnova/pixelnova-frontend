import { ViewportState } from "@/types/editor";
import { Touch } from "react";

export function getCanvasCoordinates(
  e: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
  viewport: ViewportState,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left - viewport.x) / viewport.scale);
  const y = Math.floor((e.clientY - rect.top - viewport.y) / viewport.scale);
  return { x, y };
}

export function getTouchCoordinates(
  touch: Touch,
  canvas: HTMLCanvasElement,
  viewport: ViewportState,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(
    (touch.clientX - rect.left - viewport.x) / viewport.scale,
  );
  const y = Math.floor(
    (touch.clientY - rect.top - viewport.y) / viewport.scale,
  );
  return { x, y };
}

export function getLinePoints(
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

// Alias for bresenhamLine for better semantic understanding
export const bresenhamLine = getLinePoints;
