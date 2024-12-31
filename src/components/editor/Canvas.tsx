"use client";

import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
  useState,
} from "react";
import { Layer, ToolType, ViewportState } from "@/types/editor";
import { useEditorStore } from "@/store/editorStore";
import { useUserAgent } from "@/lib/utils/user-agent";
import { useHistoryStore } from "@/store/historyStore";
import { useCanvasSetup } from "@/hooks/useCanvasSetup";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTouchHandlers } from "@/hooks/useTouchHandlers";
import { useViewport } from "@/hooks/useViewport";
import { useSelection } from "@/hooks/useSelection";
import { useToolHandler } from "@/hooks/useToolHandler";

interface CanvasProps {
  width: number;
  height: number;
  primaryColor: string;
  secondaryColor: string;
  selectedTool: ToolType;
  bucketTolerance: number;
  brushSize: number;
  showGrid: boolean;
  onColorPick?: (color: string, isRightPressed: boolean) => void;
  onToolSelect: (tool: ToolType) => void;
  layers: Layer[];
  selectedLayerId: string;
  setValidSelection: (isValid: boolean) => void;
  onDeleteSelection: () => void;
}

export interface CanvasRef {
  clearCanvas: () => void;
  importImage: (imageData: ImageData) => void;
  getLayerImageData: () => ImageData | null;
  deleteSelection: () => void;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>(function Canvas(props, ref) {
  const {
    width,
    height,
    primaryColor,
    secondaryColor,
    selectedTool,
    bucketTolerance,
    brushSize,
    showGrid,
    onColorPick,
    onToolSelect,
    layers,
    selectedLayerId,
    setValidSelection,
    onDeleteSelection,
  } = props;

  const { shouldClearOriginal } = useEditorStore();
  const { pushHistory } = useHistoryStore();
  const { isMobile } = useUserAgent();
  const [isPanning, setIsPanning] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const renderRef = useRef<() => void>();

  // Custom hooks
  const { viewport, setViewport, handlePan, handleZoom, centerViewport } =
    useViewport();

  // Helper function to create checkerboard pattern
  const createCheckerboardPattern = useCallback(() => {
    const patternCanvas = document.createElement("canvas");
    const size = 16;
    patternCanvas.width = size * 2;
    patternCanvas.height = size * 2;

    const patternCtx = patternCanvas.getContext("2d");
    if (!patternCtx) return null;

    patternCtx.fillStyle = "#f0f0f0";
    patternCtx.fillRect(0, 0, size * 2, size * 2);
    patternCtx.fillStyle = "#e0e0e0";
    patternCtx.fillRect(0, 0, size, size);
    patternCtx.fillRect(size, size, size, size);

    return patternCanvas;
  }, []);

  const {
    selection,
    setSelection,
    clearSelection,
    deleteSelection,
    startSelection,
    updateSelection,
    moveSelection,
    updateSelectionMove,
  } = useSelection({
    width,
    height,
    layers,
    selectedLayerId,
    onDeleteSelection,
    onRender: () => renderRef.current?.(),
  });

  // Render function
  const render = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    if (!displayCanvas || !drawingCanvas) return;

    const ctx = displayCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) return;

    // Enable crisp pixel rendering
    ctx.imageSmoothingEnabled = false;

    // Clear the entire canvas
    ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);

    // Apply viewport transform with pixel-perfect alignment
    ctx.save();
    const pixelRatio = window.devicePixelRatio || 1;
    ctx.scale(pixelRatio, pixelRatio);

    // Translate to the viewport position and apply scale
    ctx.translate(Math.round(viewport.x), Math.round(viewport.y));
    ctx.scale(viewport.scale, viewport.scale);

    // Draw checkerboard background for transparency
    const checkerboard = createCheckerboardPattern();
    if (checkerboard) {
      const pattern = ctx.createPattern(checkerboard, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
    }

    // Draw layers
    layers.forEach((layer) => {
      if (layer.visible && layer.imageData) {
        // Create a temporary canvas for the layer
        const layerCanvas = document.createElement("canvas");
        layerCanvas.width = width;
        layerCanvas.height = height;
        const layerCtx = layerCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        if (!layerCtx) return;

        // Draw the layer data
        layerCtx.putImageData(layer.imageData, 0, 0);

        // Set opacity based on whether the layer is selected
        ctx.globalAlpha = layer.id === selectedLayerId ? 1 : 0.5;
        ctx.drawImage(layerCanvas, 0, 0);
        ctx.globalAlpha = 1.0;
      }
    });

    // Draw selection
    if (selection?.isSelecting || selection?.selectedImageData) {
      // Draw selection overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.rect(
        Math.round(Math.min(selection.startX, selection.endX)),
        Math.round(Math.min(selection.startY, selection.endY)),
        Math.round(Math.abs(selection.endX - selection.startX)),
        Math.round(Math.abs(selection.endY - selection.startY)),
      );
      ctx.fill("evenodd");

      // Draw selection outline
      const selectionBounds = {
        x: Math.round(Math.min(selection.startX, selection.endX)),
        y: Math.round(Math.min(selection.startY, selection.endY)),
        width: Math.round(Math.abs(selection.endX - selection.startX)),
        height: Math.round(Math.abs(selection.endY - selection.startY)),
      };

      // Draw white outline
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1 / viewport.scale;
      ctx.setLineDash([4 / viewport.scale, 4 / viewport.scale]);
      ctx.strokeRect(
        selectionBounds.x,
        selectionBounds.y,
        selectionBounds.width,
        selectionBounds.height,
      );
    }

    // Draw grid
    if (showGrid && viewport.scale >= 4) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(128, 128, 128, 0.5)";
      ctx.lineWidth = 1 / viewport.scale;
      ctx.setLineDash([]);

      // Draw vertical lines
      for (let x = 0; x <= width; x++) {
        ctx.moveTo(Math.round(x), 0);
        ctx.lineTo(Math.round(x), height);
      }

      // Draw horizontal lines
      for (let y = 0; y <= height; y++) {
        ctx.moveTo(0, Math.round(y));
        ctx.lineTo(width, Math.round(y));
      }

      ctx.stroke();
    }

    ctx.restore();
  }, [
    viewport,
    layers,
    selectedLayerId,
    selection,
    showGrid,
    width,
    height,
    createCheckerboardPattern,
  ]);

  // Update renderRef after render function is defined
  useEffect(() => {
    renderRef.current = render;
  }, [render]);

  const {
    isDrawing,
    lastDrawPosition,
    handleToolStart,
    handleToolMove,
    handleToolEnd,
    getCursorStyle,
  } = useToolHandler({
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
  });

  // Initialize canvas setup
  useCanvasSetup({
    containerRef,
    displayCanvasRef,
    drawingCanvasRef,
    width,
    height,
    setViewport,
  });

  // Handle keyboard shortcuts
  useKeyboardShortcuts({
    onToolSelect,
    onSpacePressed: (pressed) => setIsPanning(pressed),
    onEscapePressed: clearSelection,
    onDeletePressed: deleteSelection,
  });

  // Handle touch interactions
  const { touchState, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useTouchHandlers({
      viewport,
      setViewport,
      containerRef,
      displayCanvasRef,
      onTouchDraw: (x, y) => {
        if (displayCanvasRef.current && drawingCanvasRef.current) {
          handleToolStart(
            {
              button: 0,
              clientX: x,
              clientY: y,
            } as any,
            displayCanvasRef.current,
            drawingCanvasRef.current,
          );
        }
      },
    });

  // Expose canvas methods via ref
  useImperativeHandle(
    ref,
    () => ({
      clearCanvas: () => {
        const selectedLayer = layers.find(
          (layer) => layer.id === selectedLayerId,
        );
        if (!selectedLayer) return;

        selectedLayer.imageData = new ImageData(width, height);
        requestAnimationFrame(() => render());
      },
      importImage: (imageData: ImageData) => {
        const selectedLayer = layers.find(
          (layer) => layer.id === selectedLayerId,
        );
        if (!selectedLayer) return;

        selectedLayer.imageData = imageData;
        requestAnimationFrame(() => {
          render();
          if (containerRef.current) {
            centerViewport(
              containerRef.current.clientWidth,
              containerRef.current.clientHeight,
              width,
              height,
            );
          }
        });
      },
      getLayerImageData: () => {
        const selectedLayer = layers.find(
          (layer) => layer.id === selectedLayerId,
        );
        return selectedLayer?.imageData ?? null;
      },
      deleteSelection,
    }),
    [layers, selectedLayerId, width, height, centerViewport, deleteSelection],
  );

  // Update isValidSelection when selection state changes
  useEffect(() => {
    setValidSelection(!!selection.selectedImageData);
  }, [selection.selectedImageData, setValidSelection]);

  // Event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!displayCanvasRef.current || !drawingCanvasRef.current) return;

      handleToolStart(e, displayCanvasRef.current, drawingCanvasRef.current);
      requestAnimationFrame(() => render());
    },
    [handleToolStart, render],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!displayCanvasRef.current || !drawingCanvasRef.current) return;

      handleToolMove(e, displayCanvasRef.current, drawingCanvasRef.current);
      requestAnimationFrame(() => render());
    },
    [handleToolMove, render],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!displayCanvasRef.current || !drawingCanvasRef.current) return;

      handleToolEnd(e, displayCanvasRef.current, drawingCanvasRef.current);
      requestAnimationFrame(() => render());

      // Store history state after drawing
      if (layers.length > 0) {
        pushHistory({
          type: "editor",
          layers: layers.map((layer) => ({
            ...layer,
            imageData: layer.imageData
              ? new ImageData(
                  new Uint8ClampedArray(layer.imageData.data),
                  layer.imageData.width,
                  layer.imageData.height,
                )
              : null,
          })),
          selectedLayerId,
        });
      }
    },
    [handleToolEnd, render, layers, selectedLayerId, pushHistory],
  );

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full touch-none overflow-hidden bg-gray-800"
    >
      <canvas
        ref={displayCanvasRef}
        className={`absolute left-0 top-0 touch-none ${getCursorStyle(false)}`}
        style={{
          touchAction: "none",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          WebkitTapHighlightColor: "transparent",
          width: "100%",
          height: "100%",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      <canvas ref={drawingCanvasRef} className="hidden" data-canvas="drawing" />
      <canvas
        ref={selectionCanvasRef}
        className="pointer-events-none absolute left-0 top-0"
        width={width}
        height={height}
      />
    </div>
  );
});

export default Canvas;
