import { ViewportState } from "@/types/editor";

export function getCanvasCoordinates(
  e: React.MouseEvent,
  canvas: HTMLCanvasElement,
  viewport: ViewportState,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  return {
    x: Math.floor((mouseX - viewport.x) / viewport.scale),
    y: Math.floor((mouseY - viewport.y) / viewport.scale),
  };
}

export function screenToCanvasCoordinates(
  screenX: number,
  screenY: number,
  canvas: HTMLCanvasElement,
  viewport: ViewportState,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const mouseX = screenX - rect.left;
  const mouseY = screenY - rect.top;

  return {
    x: Math.floor((mouseX - viewport.x) / viewport.scale),
    y: Math.floor((mouseY - viewport.y) / viewport.scale),
  };
}

export function canvasToScreenCoordinates(
  canvasX: number,
  canvasY: number,
  viewport: ViewportState,
): { x: number; y: number } {
  return {
    x: canvasX * viewport.scale + viewport.x,
    y: canvasY * viewport.scale + viewport.y,
  };
}
