import { Layer, SelectionState, ViewportState } from "@/types/editor";

export interface DrawingContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  viewport: ViewportState;
  primaryColor: string;
  secondaryColor: string;
  brushSize: number;
  bucketTolerance: number;
  layers: Layer[];
  selectedLayerId: string;
  selection?: SelectionState;
  setSelection: (selection: SelectionState) => void;
  onColorPick?: (color: string, isRightClick: boolean) => void;
}

export function createDrawingContext(
  canvas: HTMLCanvasElement,
  viewport: ViewportState,
  options: Omit<DrawingContext, "canvas" | "ctx" | "viewport">,
): DrawingContext | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  return {
    canvas,
    ctx,
    viewport,
    ...options,
  };
}

export function updateDrawingContext(
  context: DrawingContext,
  updates: Partial<Omit<DrawingContext, "canvas" | "ctx">>,
): DrawingContext {
  return { ...context, ...updates };
}

export function getLayerContext(
  context: DrawingContext,
  layerId: string,
): { layer: Layer; ctx: CanvasRenderingContext2D } | null {
  const layer = context.layers.find((l) => l.id === layerId);
  if (!layer?.imageData) return null;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = layer.imageData.width;
  tempCanvas.height = layer.imageData.height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return null;

  tempCtx.putImageData(layer.imageData, 0, 0);
  return { layer, ctx: tempCtx };
}

export function applyToSelectedLayer(
  context: DrawingContext,
  operation: (ctx: CanvasRenderingContext2D, layer: Layer) => void,
): void {
  const layerContext = getLayerContext(context, context.selectedLayerId);
  if (!layerContext) return;

  const { layer, ctx } = layerContext;
  operation(ctx, layer);

  // Update the layer's image data
  if (layer.imageData) {
    layer.imageData = ctx.getImageData(
      0,
      0,
      layer.imageData.width,
      layer.imageData.height,
    );
  }
}

export function withTemporaryContext<T>(
  context: DrawingContext,
  operation: (tempCtx: CanvasRenderingContext2D) => T,
): T | null {
  const selectedLayer = context.layers.find(
    (layer) => layer.id === context.selectedLayerId,
  );
  if (!selectedLayer?.imageData) return null;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = selectedLayer.imageData.width;
  tempCanvas.height = selectedLayer.imageData.height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return null;

  return operation(tempCtx);
}
