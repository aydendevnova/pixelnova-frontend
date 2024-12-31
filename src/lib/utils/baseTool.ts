import { Tool, ToolContext, ToolType, PreviewableTool } from "@/types/editor";
import { getCanvasCoordinates } from "./coordinates";
import { drawPixel } from "./drawing";
import { getDrawingColor } from "./toolState";

export abstract class BaseTool implements Tool {
  abstract id: ToolType;
  abstract name: string;
  abstract icon: React.ComponentType<{ className?: string }>;
  abstract shortcut: string;
  cursor?: string;

  protected getCoordinates(e: React.MouseEvent, context: ToolContext) {
    return getCanvasCoordinates(e, context.canvas, context.viewport);
  }

  protected getColor(
    e: React.MouseEvent | { button: number; buttons: number },
    context: ToolContext,
  ) {
    const isRightClick = e.button === 2 || (e.buttons & 2) !== 0;
    return getDrawingColor(
      isRightClick,
      context.primaryColor,
      context.secondaryColor,
    );
  }

  protected drawAtPoint(
    x: number,
    y: number,
    color: string,
    context: ToolContext,
  ) {
    drawPixel({
      x,
      y,
      color,
      size: context.brushSize,
      layers: context.layers,
      selectedLayerId: context.selectedLayerId,
      canvas: context.canvas,
    });
  }

  onMouseDown?(e: React.MouseEvent, context: ToolContext): void;
  onMouseMove?(e: React.MouseEvent, context: ToolContext): void;
  onMouseUp?(e: React.MouseEvent, context: ToolContext): void;
}

export abstract class DrawingTool extends BaseTool {
  cursor = "crosshair";
  protected lastPoint: { x: number; y: number } | null = null;

  onMouseDown(e: React.MouseEvent, context: ToolContext) {
    if (e.button !== 0 && e.button !== 2) return;

    const coords = this.getCoordinates(e, context);
    this.lastPoint = coords;
    this.drawAtPoint(coords.x, coords.y, this.getColor(e, context), context);
  }

  onMouseMove(e: React.MouseEvent, context: ToolContext) {
    if (e.buttons === 0) {
      this.lastPoint = null;
      return;
    }

    const coords = this.getCoordinates(e, context);
    if (this.lastPoint) {
      this.handleDrawing(this.lastPoint, coords, e, context);
    }
    this.lastPoint = coords;
  }

  onMouseUp() {
    this.lastPoint = null;
  }

  protected abstract handleDrawing(
    from: { x: number; y: number },
    to: { x: number; y: number },
    e: React.MouseEvent,
    context: ToolContext,
  ): void;
}

export abstract class PreviewTool extends BaseTool implements PreviewableTool {
  cursor = "crosshair";
  protected startPoint: { x: number; y: number } | null = null;
  lastPreviewPoints: { x: number; y: number }[] = [];

  onMouseDown(e: React.MouseEvent, context: ToolContext) {
    if (e.button !== 0 && e.button !== 2) return;

    const coords = this.getCoordinates(e, context);
    this.startPoint = coords;
    this.lastPreviewPoints = [];
    this.drawAtPoint(coords.x, coords.y, this.getColor(e, context), context);
  }

  onMouseMove(e: React.MouseEvent, context: ToolContext) {
    if (!this.startPoint) return;

    const coords = this.getCoordinates(e, context);
    this.handlePreview(this.startPoint, coords, e, context);
  }

  onMouseUp(e: React.MouseEvent, context: ToolContext) {
    if (!this.startPoint || (e.button !== 0 && e.button !== 2)) return;

    const coords = this.getCoordinates(e, context);
    this.handleFinalDraw(this.startPoint, coords, e, context);
    this.startPoint = null;
    this.lastPreviewPoints = [];
  }

  protected abstract handlePreview(
    from: { x: number; y: number },
    to: { x: number; y: number },
    e: React.MouseEvent,
    context: ToolContext,
  ): void;

  protected abstract handleFinalDraw(
    from: { x: number; y: number },
    to: { x: number; y: number },
    e: React.MouseEvent,
    context: ToolContext,
  ): void;
}
