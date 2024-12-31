import { useCallback, useState } from "react";
import { Tool, ToolType, Layer, SelectionState } from "@/types/editor";
import { getToolById } from "@/lib/tools";
import { getCanvasCoordinates } from "@/lib/utils/coordinates";

interface UseToolHandlerProps {
  selectedTool: ToolType;
  primaryColor: string;
  secondaryColor: string;
  brushSize: number;
  bucketTolerance: number;
  layers: Layer[];
  selectedLayerId: string;
  viewport: { x: number; y: number; scale: number };
  onColorPick?: (color: string, isRightPressed: boolean) => void;
  shouldClearOriginal: boolean;
  selection: SelectionState;
  setSelection: (selection: SelectionState) => void;
}

export function useToolHandler({
  selectedTool,
  primaryColor,
  secondaryColor,
  brushSize,
  bucketTolerance,
  layers,
  selectedLayerId,
  viewport,
  onColorPick,
  shouldClearOriginal,
  selection,
  setSelection,
}: UseToolHandlerProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastDrawPosition, setLastDrawPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleToolStart = useCallback(
    (
      e: React.MouseEvent<HTMLCanvasElement>,
      displayCanvas: HTMLCanvasElement,
      drawingCanvas: HTMLCanvasElement,
    ) => {
      const coords = getCanvasCoordinates(e, displayCanvas, viewport);
      const selectedLayer = layers.find(
        (layer) => layer.id === selectedLayerId,
      );
      if (!selectedLayer || !selectedLayer.visible) return;

      const tool = getToolById(selectedTool);
      const ctx = drawingCanvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const toolContext = {
        canvas: drawingCanvas,
        ctx,
        viewport: { x: 0, y: 0, scale: 1 },
        primaryColor,
        secondaryColor,
        brushSize,
        bucketTolerance,
        layers,
        selectedLayerId,
        onColorPick,
        shouldClearOriginal,
        selection,
        setSelection,
      };

      tool.onMouseDown?.(
        {
          ...e,
          clientX: coords.x,
          clientY: coords.y,
          nativeEvent: {
            ...e.nativeEvent,
            clientX: coords.x,
            clientY: coords.y,
          },
        },
        toolContext,
      );

      setIsDrawing(true);
      setLastDrawPosition(coords);
    },
    [
      viewport,
      selectedTool,
      primaryColor,
      secondaryColor,
      brushSize,
      bucketTolerance,
      layers,
      selectedLayerId,
      onColorPick,
      shouldClearOriginal,
      selection,
      setSelection,
    ],
  );

  const handleToolMove = useCallback(
    (
      e: React.MouseEvent<HTMLCanvasElement>,
      displayCanvas: HTMLCanvasElement,
      drawingCanvas: HTMLCanvasElement,
    ) => {
      if (!isDrawing) return;

      const coords = getCanvasCoordinates(e, displayCanvas, viewport);
      const selectedLayer = layers.find(
        (layer) => layer.id === selectedLayerId,
      );
      if (!selectedLayer || !selectedLayer.visible) return;

      const tool = getToolById(selectedTool);
      const ctx = drawingCanvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const toolContext = {
        canvas: drawingCanvas,
        ctx,
        viewport: { x: 0, y: 0, scale: 1 },
        primaryColor,
        secondaryColor,
        brushSize,
        bucketTolerance,
        layers,
        selectedLayerId,
        onColorPick,
        shouldClearOriginal,
        selection,
        setSelection,
      };

      tool.onMouseMove?.(
        {
          ...e,
          clientX: coords.x,
          clientY: coords.y,
          nativeEvent: {
            ...e.nativeEvent,
            clientX: coords.x,
            clientY: coords.y,
          },
        },
        toolContext,
      );

      setLastDrawPosition(coords);
    },
    [
      isDrawing,
      viewport,
      selectedTool,
      primaryColor,
      secondaryColor,
      brushSize,
      bucketTolerance,
      layers,
      selectedLayerId,
      onColorPick,
      shouldClearOriginal,
      selection,
      setSelection,
    ],
  );

  const handleToolEnd = useCallback(
    (
      e: React.MouseEvent<HTMLCanvasElement>,
      displayCanvas: HTMLCanvasElement,
      drawingCanvas: HTMLCanvasElement,
    ) => {
      if (!isDrawing) return;

      const coords = getCanvasCoordinates(e, displayCanvas, viewport);
      const selectedLayer = layers.find(
        (layer) => layer.id === selectedLayerId,
      );
      if (!selectedLayer || !selectedLayer.visible) return;

      const tool = getToolById(selectedTool);
      const ctx = drawingCanvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const toolContext = {
        canvas: drawingCanvas,
        ctx,
        viewport: { x: 0, y: 0, scale: 1 },
        primaryColor,
        secondaryColor,
        brushSize,
        bucketTolerance,
        layers,
        selectedLayerId,
        onColorPick,
        shouldClearOriginal,
        selection,
        setSelection,
      };

      tool.onMouseUp?.(
        {
          ...e,
          clientX: coords.x,
          clientY: coords.y,
          nativeEvent: {
            ...e.nativeEvent,
            clientX: coords.x,
            clientY: coords.y,
          },
        },
        toolContext,
      );

      setIsDrawing(false);
      setLastDrawPosition(null);
    },
    [
      isDrawing,
      viewport,
      selectedTool,
      primaryColor,
      secondaryColor,
      brushSize,
      bucketTolerance,
      layers,
      selectedLayerId,
      onColorPick,
      shouldClearOriginal,
      selection,
      setSelection,
    ],
  );

  const getCursorStyle = useCallback(
    (isPanning: boolean) => {
      if (isPanning) return "cursor-grab";
      const tool = getToolById(selectedTool);
      return tool.cursor ? `cursor-${tool.cursor}` : "cursor-crosshair";
    },
    [selectedTool],
  );

  return {
    isDrawing,
    lastDrawPosition,
    handleToolStart,
    handleToolMove,
    handleToolEnd,
    getCursorStyle,
  };
}
