"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Layer,
  ToolType,
  ViewportState,
  SelectionState,
  Tool,
  PreviewableTool,
} from "@/types/editor";
import { getToolById } from "@/lib/tools";
import {
  getCanvasCoordinates,
  getTouchCoordinates,
} from "@/lib/utils/coordinates";
import { useEditorStore } from "@/store/editorStore";
import { useUserAgent } from "@/lib/utils/user-agent";
import { useHistoryStore } from "@/store/historyStore";
import {
  resizeLayer,
  resizeAllLayers,
  PadDirection,
} from "@/lib/utils/resizeCanvas";

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
  getAllLayers: () => Layer[];
  deleteSelection: () => void;
  resizeCanvas: (
    newWidth: number,
    newHeight: number,
    padDirection: PadDirection,
  ) => void;
}

// Add type guard as a standalone function
const isPreviewableTool = (tool: Tool): tool is PreviewableTool => {
  return "lastPreviewPoints" in tool;
};

interface TouchState {
  touchStartX: number;
  touchStartY: number;
  initialPinchDistance: number | null;
  initialScale: number | null;
  lastTouchX: number | null;
  lastTouchY: number | null;
  touchStartTime: number | null;
  lastDrawTime: number | null;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>(function Canvas(
  {
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
  },
  ref,
) {
  const { shouldClearOriginal } = useEditorStore();
  const { pushHistory } = useHistoryStore();
  const { isMobile } = useUserAgent();
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastLayerStateRef = useRef<ImageData | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [lastDrawPosition, setLastDrawPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [viewport, setViewport] = useState<ViewportState>({
    x: 0,
    y: 0,
    scale: 4,
  });
  const [selection, setSelection] = useState<SelectionState>({
    isSelecting: false,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isMoving: false,
    moveStartX: 0,
    moveStartY: 0,
    selectedImageData: undefined,
    originalX: undefined,
    originalY: undefined,
  });

  const [isPickingColor, setIsPickingColor] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [mouseButtons, setMouseButtons] = useState<number>(0);

  const [touchState, setTouchState] = useState<TouchState>({
    touchStartX: 0,
    touchStartY: 0,
    initialPinchDistance: null,
    initialScale: null,
    lastTouchX: null,
    lastTouchY: null,
    touchStartTime: null,
    lastDrawTime: null,
  });

  // Create offscreen canvas for checkerboard pattern
  const checkerboardPattern = useMemo(() => {
    if (typeof document === "undefined") return null;
    const patternCanvas = document.createElement("canvas");
    const size = 16; // Fixed size for checkerboard pattern
    patternCanvas.width = size;
    patternCanvas.height = size;
    const ctx = patternCanvas.getContext("2d");
    if (!ctx) return null;

    // Draw squares with fixed size
    const squareSize = size / 2;
    ctx.fillStyle = "#E5E7EB";
    ctx.fillRect(0, 0, squareSize, squareSize);
    ctx.fillRect(squareSize, squareSize, squareSize, squareSize);
    ctx.fillStyle = "#D1D5DB";
    ctx.fillRect(squareSize, 0, squareSize, squareSize);
    ctx.fillRect(0, squareSize, squareSize, squareSize);

    return patternCanvas;
  }, []); // No dependencies since size is fixed

  // Add render function
  const render = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    const selectionCanvas = selectionCanvasRef.current;
    if (!displayCanvas || !drawingCanvas || !selectionCanvas) return;

    const ctx = displayCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) return;

    // Enable nearest-neighbor interpolation
    ctx.imageSmoothingEnabled = false;

    // Clear canvas with pixel ratio consideration
    const pixelRatio = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);

    // Apply viewport transform with pixel ratio consideration
    ctx.save();
    ctx.scale(pixelRatio, pixelRatio);
    ctx.translate(viewport.x, viewport.y);
    ctx.scale(viewport.scale, viewport.scale);

    // Draw checkerboard pattern for transparency
    if (checkerboardPattern) {
      const pattern = ctx.createPattern(checkerboardPattern, "repeat");
      if (pattern) {
        const patternTransform = new DOMMatrix()
          .translateSelf(0, 0)
          .scaleSelf(0.0625);
        pattern.setTransform(patternTransform);
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
      }
    }

    // Draw all visible layers from bottom to top
    layers.forEach((layer) => {
      if (layer.visible && layer.imageData) {
        const layerCanvas = document.createElement("canvas");
        layerCanvas.width = width;
        layerCanvas.height = height;
        const layerCtx = layerCanvas.getContext("2d");
        if (layerCtx) {
          layerCtx.putImageData(layer.imageData, 0, 0);
          // Set opacity based on whether the layer is selected
          ctx.globalAlpha = layer.id === selectedLayerId ? 1 : 0.5;
          ctx.drawImage(layerCanvas, 0, 0);
          ctx.globalAlpha = 1.0; // Reset opacity
        }
      }
    });

    // Draw selection if it exists
    if (selection.isSelecting || selection.selectedImageData) {
      // Save the current context state
      ctx.save();

      // Create selection overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";

      // Normalize coordinates for the selection area
      const selectionBounds = {
        x: Math.min(selection.startX, selection.endX),
        y: Math.min(selection.startY, selection.endY),
        width: Math.abs(selection.endX - selection.startX),
        height: Math.abs(selection.endY - selection.startY),
      };

      // Draw the overlay as a single path with a cutout
      ctx.beginPath();
      // Outer rectangle (full canvas)
      ctx.rect(0, 0, drawingCanvas.width, drawingCanvas.height);
      // Inner rectangle (selection area) - will be cut out
      ctx.rect(
        selectionBounds.x + selectionBounds.width,
        selectionBounds.y + selectionBounds.height,
        -selectionBounds.width,
        -selectionBounds.height,
      );
      ctx.fill("evenodd"); // Use even-odd fill rule to create cutout

      // Draw selection outline
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2 / viewport.scale;
      ctx.setLineDash([6 / viewport.scale, 4 / viewport.scale]);
      ctx.lineDashOffset = 0;
      ctx.strokeRect(
        selectionBounds.x,
        selectionBounds.y,
        selectionBounds.width,
        selectionBounds.height,
      );

      // Draw inverted color outline
      ctx.strokeStyle = "#000000";
      ctx.lineDashOffset = 6 / viewport.scale;
      ctx.strokeRect(
        selectionBounds.x,
        selectionBounds.y,
        selectionBounds.width,
        selectionBounds.height,
      );

      // If we have selected image data and we're moving it, draw it at the current position
      if (selection.selectedImageData && selection.isMoving) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = selection.selectedImageData.width;
        tempCanvas.height = selection.selectedImageData.height;
        const tempCtx = tempCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        if (tempCtx) {
          tempCtx.putImageData(selection.selectedImageData, 0, 0);
          ctx.globalAlpha = 0.8; // Make it slightly transparent while moving
          ctx.drawImage(tempCanvas, selectionBounds.x, selectionBounds.y);
          ctx.globalAlpha = 1.0;
        }
      }

      // Restore the context state
      ctx.restore();
    }

    // Draw grid if enabled
    if (showGrid && viewport.scale >= 4) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(128, 128, 128, 0.5)";
      ctx.lineWidth = 1 / viewport.scale;
      ctx.setLineDash([]);

      // Draw vertical lines
      for (let x = 0; x <= drawingCanvas.width; x++) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, drawingCanvas.height);
      }

      // Draw horizontal lines
      for (let y = 0; y <= drawingCanvas.height; y++) {
        ctx.moveTo(0, y);
        ctx.lineTo(drawingCanvas.width, y);
      }

      ctx.stroke();
    }

    // Show brush preview
    if (
      hoverPosition &&
      (selectedTool === "pencil" ||
        selectedTool === "eraser" ||
        selectedTool === "line" ||
        selectedTool === "square" ||
        selectedTool === "circle") &&
      !isDrawing &&
      !isPanning
    ) {
      const size = brushSize;
      const halfSize = Math.floor(size / 2);

      // Only show hover preview on non-mobile devices when not drawing
      if (!isMobile) {
        const x = Math.floor(hoverPosition.x - halfSize);
        const y = Math.floor(hoverPosition.y - halfSize);

        ctx.globalAlpha = 0.5;
        if (selectedTool === "eraser") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x, y, size, size);
        } else {
          // Use secondary color if right mouse button is pressed
          ctx.fillStyle = mouseButtons === 2 ? secondaryColor : primaryColor;
          ctx.fillRect(x, y, size, size);
        }
        ctx.globalAlpha = 1.0;

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1 / viewport.scale;
        ctx.setLineDash([]);
        ctx.strokeRect(x, y, size, size);
      }

      // Show preview for previewable tools when drawing
      if (isMouseDown) {
        ctx.globalAlpha = 0.5;
        const tool = getToolById(selectedTool);
        if (isPreviewableTool(tool)) {
          // Draw preview points with correct color based on mouse button
          const points = tool.lastPreviewPoints;
          ctx.fillStyle = mouseButtons === 2 ? secondaryColor : primaryColor;

          // For shape tools, draw single pixels for preview
          if (selectedTool === "circle" || selectedTool === "square") {
            points.forEach((point) => {
              ctx.fillRect(point.x, point.y, 1, 1);
            });
          } else {
            // For other tools, use brush size
            points.forEach((point) => {
              ctx.fillRect(point.x - halfSize, point.y - halfSize, size, size);
            });
          }
        }
        ctx.globalAlpha = 1.0;
      }
    }

    ctx.restore();
  }, [
    viewport,
    selection,
    checkerboardPattern,
    showGrid,
    hoverPosition,
    selectedTool,
    brushSize,
    isDrawing,
    isPanning,
    primaryColor,
    layers,
    width,
    height,
    selectedLayerId,
  ]);

  // Start render loop
  useEffect(() => {
    render();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render]);

  // Update drawPixel to draw on the selected layer
  const drawPixel = useCallback(
    (x: number, y: number, isRightClick: boolean) => {
      const selectedLayer = layers.find(
        (layer) => layer.id === selectedLayerId,
      );
      if (!selectedLayer || !selectedLayer.visible) return;

      // Create a new canvas for the layer if it doesn't exist
      if (!selectedLayer.imageData) {
        const newImageData = new ImageData(width, height);
        selectedLayer.imageData = newImageData;
      }

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      // Draw existing layer data
      tempCtx.putImageData(selectedLayer.imageData, 0, 0);

      const size = brushSize;
      const halfSize = Math.floor(size / 2);

      // Draw new pixels
      tempCtx.beginPath();
      for (let offsetY = 0; offsetY < size; offsetY++) {
        for (let offsetX = 0; offsetX < size; offsetX++) {
          const pixelX = x - halfSize + offsetX;
          const pixelY = y - halfSize + offsetY;

          const color = isRightClick ? secondaryColor : primaryColor;

          if (pixelX < 0 || pixelX >= width || pixelY < 0 || pixelY >= height) {
            continue;
          }

          if (selectedTool === "eraser") {
            tempCtx.clearRect(pixelX, pixelY, 1, 1);
          } else {
            if (color === "transparent") {
              tempCtx.clearRect(pixelX, pixelY, 1, 1);
            } else {
              if (tempCtx.fillStyle !== color) {
                tempCtx.fillStyle = color;
              }
              tempCtx.fillRect(pixelX, pixelY, 1, 1);
            }
          }
        }
      }

      // Update layer's imageData
      selectedLayer.imageData = tempCtx.getImageData(0, 0, width, height);

      // Only render once per frame
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(() => {
          render();
          animationFrameRef.current = undefined;
        });
      }
    },
    [
      primaryColor,
      secondaryColor,
      render,
      brushSize,
      selectedTool,
      layers,
      selectedLayerId,
      width,
      height,
      selectedLayerId,
    ],
  );

  // Helper functions
  const handlePan = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isPanning) return;

      setViewport((prev) => ({
        ...prev,
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    },
    [isPanning],
  );

  const clearSelection = useCallback(() => {
    setSelection({
      isSelecting: false,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      isMoving: false,
      moveStartX: 0,
      moveStartY: 0,
      selectedImageData: undefined,
      originalX: undefined,
      originalY: undefined,
    });
  }, []);

  const deleteSelection = () => {
    // Get the selected layer
    const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);
    if (!selectedLayer || !selectedLayer.visible) return;

    // Create a temporary canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // Draw existing layer data
    if (selectedLayer.imageData) {
      tempCtx.putImageData(selectedLayer.imageData, 0, 0);
    }

    // Calculate deletion coordinates
    const deleteX = selection.originalX ?? 0;
    const deleteY = selection.originalY ?? 0;
    const deleteWidth = selection.selectedImageData?.width ?? 0;
    const deleteHeight = selection.selectedImageData?.height ?? 0;

    // Clear the selected area
    tempCtx.clearRect(deleteX, deleteY, deleteWidth, deleteHeight);

    // Update layer's imageData
    selectedLayer.imageData = tempCtx.getImageData(0, 0, width, height);

    // Push to history before clearing selection
    pushHistory({
      type: "editor" as const,
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
      canvasSize: { width, height },
    });

    // Clear the selection state
    clearSelection();

    // Trigger render
    render();
  };

  // Update clearCanvas to clear the selected layer
  useImperativeHandle(
    ref,
    () => ({
      clearCanvas: () => {
        const selectedLayer = layers.find(
          (layer) => layer.id === selectedLayerId,
        );
        if (!selectedLayer) return;

        selectedLayer.imageData = new ImageData(width, height);
        render();
      },
      importImage: (imageData: ImageData) => {
        const selectedLayer = layers.find(
          (layer) => layer.id === selectedLayerId,
        );
        if (!selectedLayer) return;

        // Only resize if the imported image is larger than current canvas
        const needsResize =
          imageData.width > width || imageData.height > height;

        if (needsResize) {
          const newWidth = Math.max(width, imageData.width);
          const newHeight = Math.max(height, imageData.height);

          // Resize all layers to match the new dimensions
          layers.forEach((layer) => {
            layer.imageData = resizeLayer(layer, newWidth, newHeight, {
              width: "center",
              height: "center",
            });
          });
        }

        // Create a new ImageData with current canvas dimensions
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        // Calculate center position
        const x = Math.floor((width - imageData.width) / 2);
        const y = Math.floor((height - imageData.height) / 2);

        // Create a temporary canvas for the imported image
        const importCanvas = document.createElement("canvas");
        importCanvas.width = imageData.width;
        importCanvas.height = imageData.height;
        const importCtx = importCanvas.getContext("2d");
        if (!importCtx) return;

        // Draw the imported image data exactly as is
        importCtx.putImageData(imageData, 0, 0);

        // Draw the imported image centered on the target canvas
        tempCtx.drawImage(importCanvas, x, y);

        // Update the selected layer with the new image data
        selectedLayer.imageData = tempCtx.getImageData(0, 0, width, height);

        render();

        // Center the viewport on the canvas
        const displayCanvas = displayCanvasRef.current;
        if (!displayCanvas) return;
        setTimeout(() => {
          setViewport((prev) => ({
            ...prev,
            x: (displayCanvas.width - width * prev.scale) / 2,
            y: (displayCanvas.height - height * prev.scale) / 2,
          }));
        }, 4);
      },
      getLayerImageData: () => {
        const selectedLayer = layers.find(
          (layer) => layer.id === selectedLayerId,
        );
        return selectedLayer?.imageData ?? null;
      },
      getAllLayers: () => layers,
      deleteSelection,
      resizeCanvas: (
        newWidth: number,
        newHeight: number,
        padDirection: PadDirection,
      ) => {
        // Update drawing canvas dimensions first
        const drawingCanvas = drawingCanvasRef.current;
        if (drawingCanvas) {
          drawingCanvas.width = newWidth;
          drawingCanvas.height = newHeight;
        }

        // Resize all layers using the utility function
        layers.forEach((layer) => {
          layer.imageData = resizeLayer(
            layer,
            newWidth,
            newHeight,
            padDirection,
          );
        });

        // Clear any active selection
        clearSelection();

        // Re-center the viewport
        const displayCanvas = displayCanvasRef.current;
        if (displayCanvas) {
          setViewport((prev) => ({
            ...prev,
            x: (displayCanvas.width - newWidth * prev.scale) / 2,
            y: (displayCanvas.height - newHeight * prev.scale) / 2,
          }));
        }

        // Force a re-render
        render();
      },
    }),
    [
      width,
      height,
      layers,
      selectedLayerId,
      clearSelection,
      deleteSelection,
      render,
    ],
  );

  // Initialize canvases
  useEffect(() => {
    const drawingCanvas = drawingCanvasRef.current;
    const displayCanvas = displayCanvasRef.current;
    if (!drawingCanvas || !displayCanvas) return;

    // Set up drawing canvas (actual pixel art size)
    drawingCanvas.width = width;
    drawingCanvas.height = height;
    const drawingCtx = drawingCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!drawingCtx) return;

    // Set up display canvas (viewport size)
    const container = containerRef.current;
    if (!container) return;

    // Handle mobile viewport scaling
    const updateCanvasSize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const containerWidth = container.clientWidth * pixelRatio;
      const containerHeight = container.clientHeight * pixelRatio;

      // Set display canvas size accounting for pixel ratio
      displayCanvas.width = containerWidth;
      displayCanvas.height = containerHeight;
      displayCanvas.style.width = `${container.clientWidth}px`;
      displayCanvas.style.height = `${container.clientHeight}px`;

      // Calculate initial scale to fit the canvas
      const scaleX = containerWidth / width;
      const scaleY = containerHeight / height;
      const initialScale = Math.min(
        Math.max(1, Math.min(scaleX, scaleY) * 0.8),
        32,
      );

      // Center the viewport
      setViewport((prev) => ({
        ...prev,
        x: (containerWidth / pixelRatio - width * initialScale) / 2,
        y: (containerHeight / pixelRatio - height * initialScale) / 2,
        scale: initialScale,
      }));
    };

    // Initial update
    updateCanvasSize();

    // Handle resize events
    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup previous animation frame and event listener
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [width, height]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { deltaY } = e;
    const direction = deltaY > 0 ? -1 : 1;

    // Reset drawing states but maintain mouse button state
    setIsDrawing(false);
    setIsPanning(false);

    // Force reset mouse state if button is not actually pressed
    if (!e.buttons) {
      setIsMouseDown(false);
    }

    setViewport((prev) => {
      const newScale = Math.max(
        1,
        Math.min(32, prev.scale * (1 + 0.1 * direction)),
      );

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return prev;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const worldX = (mouseX - prev.x) / prev.scale;
      const worldY = (mouseY - prev.y) / prev.scale;

      const newX = mouseX - worldX * newScale;
      const newY = mouseY - worldY * newScale;

      return {
        x: newX,
        y: newY,
        scale: newScale,
      };
    });
  }, []);

  // Remove tool-specific logic from handleMouseDown
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsMouseDown(true);
      setMouseButtons(e.buttons);
      const isRightClick = e.button === 2;

      if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
        setIsPanning(true);
        return;
      }

      if (e.button === 0 || e.button === 2) {
        const displayCanvas = displayCanvasRef.current;
        const drawingCanvas = drawingCanvasRef.current;
        if (!displayCanvas || !drawingCanvas) {
          console.error("❌ Canvas refs not available");
          return;
        }

        const coords = getCanvasCoordinates(e, displayCanvas, viewport);

        setHoverPosition(coords);

        const selectedLayer = layers.find(
          (layer) => layer.id === selectedLayerId,
        );
        if (!selectedLayer || !selectedLayer.visible) {
          console.warn("⚠️ No selected layer or layer not visible");
          return;
        }

        const tool = getToolById(selectedTool);

        const toolContext = {
          canvas: drawingCanvas,
          ctx: drawingCanvas.getContext("2d", { willReadFrequently: true })!,
          viewport: {
            x: 0,
            y: 0,
            scale: 1,
          },
          primaryColor,
          secondaryColor,
          brushSize,
          bucketTolerance,
          layers,
          selectedLayerId,
          onColorPick,
          selection,
          setSelection,
          shouldClearOriginal,
        };

        // Pass the coordinates directly to the tool

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
        render();
      }
    },
    [
      isSpacePressed,
      selectedTool,
      viewport,
      primaryColor,
      secondaryColor,
      brushSize,
      bucketTolerance,
      layers,
      selectedLayerId,
      onColorPick,
      selection,
      setSelection,
      shouldClearOriginal,
      render,
    ],
  );

  // Update handleMouseMove to use tool architecture
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setMouseButtons(e.buttons);
      const displayCanvas = displayCanvasRef.current;
      const drawingCanvas = drawingCanvasRef.current;
      if (!displayCanvas || !drawingCanvas) return;

      const coords = getCanvasCoordinates(e, displayCanvas, viewport);
      setHoverPosition(coords);

      if (!isMouseDown) return;

      if (isPanning) {
        handlePan(e);
        return;
      }

      const selectedLayer = layers.find(
        (layer) => layer.id === selectedLayerId,
      );
      if (!selectedLayer || !selectedLayer.visible) {
        console.warn("⚠️ MouseMove - No selected layer or layer not visible");
        return;
      }

      const tool = getToolById(selectedTool);

      const toolContext = {
        canvas: drawingCanvas,
        ctx: drawingCanvas.getContext("2d", { willReadFrequently: true })!,
        viewport: {
          x: 0,
          y: 0,
          scale: 1,
        },
        primaryColor,
        secondaryColor,
        brushSize,
        bucketTolerance,
        layers,
        selectedLayerId,
        onColorPick,
        selection,
        setSelection,
        shouldClearOriginal,
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
      render();
    },
    [
      isMouseDown,
      isPanning,
      selectedTool,
      viewport,
      primaryColor,
      secondaryColor,
      brushSize,
      bucketTolerance,
      layers,
      selectedLayerId,
      onColorPick,
      selection,
      setSelection,
      shouldClearOriginal,
      handlePan,
      render,
    ],
  );

  // Update handleMouseUp to use tool architecture
  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsMouseDown(false);
      setMouseButtons(e.buttons);

      if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
        setIsPanning(false);
        return;
      }

      const displayCanvas = displayCanvasRef.current;
      const drawingCanvas = drawingCanvasRef.current;
      if (!displayCanvas || !drawingCanvas) {
        console.error("❌ MouseUp - Canvas refs not available");
        return;
      }

      const coords = getCanvasCoordinates(e, displayCanvas, viewport);

      const selectedLayer = layers.find(
        (layer) => layer.id === selectedLayerId,
      );
      if (!selectedLayer || !selectedLayer.visible) {
        console.warn("⚠️ MouseUp - No selected layer or layer not visible");
        return;
      }

      const tool = getToolById(selectedTool);
      const toolContext = {
        canvas: drawingCanvas,
        ctx: drawingCanvas.getContext("2d", { willReadFrequently: true })!,
        viewport: {
          x: 0,
          y: 0,
          scale: 1,
        },
        primaryColor,
        secondaryColor,
        brushSize,
        bucketTolerance,
        layers,
        selectedLayerId,
        onColorPick,
        selection,
        setSelection,
        shouldClearOriginal,
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
      render();

      // Store history state after drawing
      if (layers.length > 0) {
        pushHistory({
          type: "editor" as const,
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
          canvasSize: { width, height },
        });
      }
    },
    [
      isSpacePressed,
      selectedTool,
      viewport,
      primaryColor,
      secondaryColor,
      brushSize,
      bucketTolerance,
      layers,
      selectedLayerId,
      onColorPick,
      selection,
      setSelection,
      shouldClearOriginal,
      render,
      pushHistory,
    ],
  );

  // Update cursor style based on tool
  const getCursorStyle = useCallback(() => {
    if (isPanning) return "cursor-grab";
    const tool = getToolById(selectedTool);
    return tool.cursor ? `cursor-${tool.cursor}` : "cursor-crosshair";
  }, [isPanning, selectedTool]);

  // Update keyboard event handler for proper deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tool shortcuts (Aseprite-like)
      switch (e.key.toLowerCase()) {
        case "b": // Brush
          onToolSelect("pencil");
          break;
        case "i": // Eye dropper
          onToolSelect("eyedropper");
          break;
        case "g": // Paint bucket
          onToolSelect("bucket");
          break;
        case "m": // Selection
          onToolSelect("select");
          break;
        case "e": // Eraser
          onToolSelect("eraser");
          break;
      }
      if (e.code === "Space" && !e.repeat) {
        setIsSpacePressed(true);
      } else if (e.code === "Escape") {
        clearSelection();
      } else if (
        (e.code === "Delete" || e.code === "Backspace") &&
        selection.selectedImageData
      ) {
        deleteSelection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selection,
    layers,
    selectedLayerId,
    width,
    height,
    clearSelection,
    onToolSelect,
    render,
  ]);

  // Event listeners with cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    containerRef.current?.addEventListener("wheel", handleWheel as any, {
      passive: false,
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      containerRef.current?.removeEventListener("wheel", handleWheel as any);
    };
  }, [handleWheel]);

  // Add after initialization effects
  useEffect(() => {
    // Only render once on initialization
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        render();
        animationFrameRef.current = undefined;
      });
    }
  }, [width, height, layers, selectedLayerId, pushHistory, render]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        setIsSpacePressed(true);
      } else if (e.code === "Escape") {
        clearSelection();
      } else if (e.code === "Delete" || e.code === "Backspace") {
        if (selection.selectedImageData) {
          deleteSelection();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selection,
    layers,
    selectedLayerId,
    width,
    height,
    clearSelection,
    deleteSelection,
  ]);

  // Add useEffect to watch for tool changes
  useEffect(() => {
    // Only clear selection when switching away from select tool
    if (selectedTool !== "select") {
      clearSelection();
    }
  }, [selectedTool, clearSelection]);

  // Trigger render when selectedLayerId changes
  useEffect(() => {
    // Only render on layer change, don't clear selection
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        render();
        animationFrameRef.current = undefined;
      });
    }
  }, [selectedLayerId, render]);

  // Add onMouseLeave handler
  const handleMouseLeave = useCallback(() => {
    setHoverPosition(null);
    setIsMouseDown(false);
    setIsDrawing(false);
    setIsPanning(false);
    // Only clear selection if we're in the middle of selecting
    if (selection.isSelecting) {
      clearSelection();
    }
  }, [clearSelection, selection.isSelecting]);

  // Add window mouse up listener to catch mouse releases outside canvas
  useEffect(() => {
    const handleWindowMouseUp = () => {
      setIsMouseDown(false);
      setIsDrawing(false);
      setIsPanning(false);
      // Don't clear selection here
    };

    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => window.removeEventListener("mouseup", handleWindowMouseUp);
  }, []);

  // Add event listeners for pan tool
  useEffect(() => {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) return;

    const handleStartPanning = () => {
      setIsPanning(true);
    };

    const handleEndPanning = () => {
      setIsPanning(false);
    };

    displayCanvas.addEventListener("startPanning", handleStartPanning);
    displayCanvas.addEventListener("endPanning", handleEndPanning);

    return () => {
      displayCanvas.removeEventListener("startPanning", handleStartPanning);
      displayCanvas.removeEventListener("endPanning", handleEndPanning);
    };
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const displayCanvas = displayCanvasRef.current;
      const drawingCanvas = drawingCanvasRef.current;
      if (!displayCanvas || !drawingCanvas || !e.touches[0]) return;

      const touch = e.touches[0];
      const coords = getTouchCoordinates(touch, displayCanvas, viewport);
      setHoverPosition(coords);

      const now = Date.now();

      if (e.touches.length === 2 && e.touches[1]) {
        // Starting a pinch gesture - disable drawing
        setIsMouseDown(false);
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );

        // Check if we recently drew a pixel (within 5ms) and undo it
        if (touchState.lastDrawTime && now - touchState.lastDrawTime < 50) {
          // Restore the previous state if it exists
          const selectedLayer = layers.find(
            (layer) => layer.id === selectedLayerId,
          );
          if (selectedLayer && lastLayerStateRef.current) {
            selectedLayer.imageData = lastLayerStateRef.current;
            render();
          }
        }

        setTouchState({
          touchStartX: touch.clientX,
          touchStartY: touch.clientY,
          lastTouchX: touch.clientX,
          lastTouchY: touch.clientY,
          initialPinchDistance: distance,
          initialScale: viewport.scale,
          touchStartTime: now,
          lastDrawTime: null, // Reset draw time
        });
      } else if (e.touches.length === 1 && selectedTool !== "pan") {
        // Store the current state before drawing
        const selectedLayer = layers.find(
          (layer) => layer.id === selectedLayerId,
        );
        if (selectedLayer?.imageData) {
          lastLayerStateRef.current = new ImageData(
            new Uint8ClampedArray(selectedLayer.imageData.data),
            selectedLayer.imageData.width,
            selectedLayer.imageData.height,
          );
        }

        // For non-pan tools, start drawing immediately on single touch
        setIsMouseDown(true);
        const tool = getToolById(selectedTool);
        const ctx = drawingCanvas.getContext("2d", {
          willReadFrequently: true,
        });
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
          selection,
          setSelection,
          shouldClearOriginal,
        };

        tool.onMouseDown?.(
          {
            ...e,
            clientX: coords.x,
            clientY: coords.y,
            button: 0,
            nativeEvent: {
              ...e.nativeEvent,
              clientX: coords.x,
              clientY: coords.y,
            },
          } as any,
          toolContext,
        );

        // Render immediately for responsiveness
        render();

        // Update touch state and record draw time
        setTouchState({
          touchStartX: touch.clientX,
          touchStartY: touch.clientY,
          lastTouchX: touch.clientX,
          lastTouchY: touch.clientY,
          initialPinchDistance: null,
          initialScale: viewport.scale,
          touchStartTime: now,
          lastDrawTime: now, // Record when we drew
        });
      } else {
        // Pan tool or other cases
        setTouchState({
          touchStartX: touch.clientX,
          touchStartY: touch.clientY,
          lastTouchX: touch.clientX,
          lastTouchY: touch.clientY,
          initialPinchDistance: null,
          initialScale: viewport.scale,
          touchStartTime: now,
          lastDrawTime: touchState.lastDrawTime, // Preserve last draw time
        });
      }
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
      selection,
      setSelection,
      shouldClearOriginal,
      render,
      touchState.lastDrawTime,
    ],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const displayCanvas = displayCanvasRef.current;
      const drawingCanvas = drawingCanvasRef.current;
      if (!displayCanvas || !drawingCanvas || !e.touches[0]) return;

      if (e.touches.length === 2 && e.touches[1]) {
        // Pinch to zoom - disable drawing
        setIsMouseDown(false);
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY,
        );

        if (touchState.initialPinchDistance && touchState.initialScale) {
          const scale =
            (currentDistance / touchState.initialPinchDistance) *
            touchState.initialScale;
          const newScale = Math.max(1, Math.min(32, scale));

          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;

          // Calculate the center point of the pinch gesture relative to the canvas
          const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
          const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

          // Convert the center point to world coordinates before scaling
          const worldX = (centerX - viewport.x) / viewport.scale;
          const worldY = (centerY - viewport.y) / viewport.scale;

          // Calculate the new viewport position to keep the center point fixed
          const newX = centerX - worldX * newScale;
          const newY = centerY - worldY * newScale;

          setViewport({
            x: newX,
            y: newY,
            scale: newScale,
          });

          // Update touch state with both touch positions
          setTouchState((prev) => ({
            ...prev,
            lastTouchX: touch1.clientX,
            lastTouchY: touch1.clientY,
          }));
        }
      } else if (e.touches.length === 1) {
        const touch = e.touches[0];
        const coords = getTouchCoordinates(touch, displayCanvas, viewport);
        setHoverPosition(coords);

        if (selectedTool === "pan") {
          // Handle panning
          if (
            touchState.lastTouchX !== null &&
            touchState.lastTouchY !== null
          ) {
            const deltaX = touch.clientX - touchState.lastTouchX;
            const deltaY = touch.clientY - touchState.lastTouchY;

            setViewport((prev) => ({
              ...prev,
              x: prev.x + deltaX,
              y: prev.y + deltaY,
            }));
          }
        } else if (isMouseDown) {
          // Continue drawing if already started
          const tool = getToolById(selectedTool);
          const ctx = drawingCanvas.getContext("2d", {
            willReadFrequently: true,
          });
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
            selection,
            setSelection,
            shouldClearOriginal,
          };

          tool.onMouseMove?.(
            {
              ...e,
              clientX: coords.x,
              clientY: coords.y,
              button: 0,
              nativeEvent: {
                ...e.nativeEvent,
                clientX: coords.x,
                clientY: coords.y,
              },
            } as any,
            toolContext,
          );

          // Render immediately for responsiveness
          render();
        }

        // Always update the last touch position for next frame
        setTouchState((prev) => ({
          ...prev,
          lastTouchX: touch.clientX,
          lastTouchY: touch.clientY,
        }));
      }
    },
    [
      viewport,
      isMouseDown,
      selectedTool,
      primaryColor,
      secondaryColor,
      brushSize,
      bucketTolerance,
      layers,
      selectedLayerId,
      onColorPick,
      selection,
      setSelection,
      shouldClearOriginal,
      touchState,
      render,
    ],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const displayCanvas = displayCanvasRef.current;
      const drawingCanvas = drawingCanvasRef.current;
      if (!displayCanvas || !drawingCanvas) return;

      // If we still have touches, update the state for the remaining touches
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (touch) {
          setTouchState((prev) => ({
            ...prev,
            lastTouchX: touch.clientX,
            lastTouchY: touch.clientY,
            initialPinchDistance: null,
            initialScale: viewport.scale,
            touchStartTime: prev.touchStartTime,
          }));
        }
      } else if (e.touches.length === 0) {
        // All touches ended
        setIsMouseDown(false);
        setHoverPosition(null);

        const changedTouch = e.changedTouches[0];
        if (isMouseDown && changedTouch) {
          const coords = getTouchCoordinates(
            changedTouch,
            displayCanvas,
            viewport,
          );
          const tool = getToolById(selectedTool);
          const ctx = drawingCanvas.getContext("2d", {
            willReadFrequently: true,
          });
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
            selection,
            setSelection,
            shouldClearOriginal,
          };

          tool.onMouseUp?.(
            {
              ...e,
              clientX: coords.x,
              clientY: coords.y,
              button: 0,
              nativeEvent: {
                ...e.nativeEvent,
                clientX: coords.x,
                clientY: coords.y,
              },
            } as any,
            toolContext,
          );

          requestAnimationFrame(() => {
            render();
          });

          // Store history state after drawing
          if (layers.length > 0) {
            pushHistory({
              type: "editor" as const,
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
              canvasSize: { width, height },
            });
          }
        }

        // Reset touch state while preserving the last scale
        setTouchState({
          touchStartX: 0,
          touchStartY: 0,
          initialPinchDistance: null,
          initialScale: viewport.scale,
          lastTouchX: null,
          lastTouchY: null,
          touchStartTime: null,
          lastDrawTime: null,
        });
      }
    },
    [
      viewport,
      isMouseDown,
      selectedTool,
      primaryColor,
      secondaryColor,
      brushSize,
      bucketTolerance,
      layers,
      selectedLayerId,
      onColorPick,
      selection,
      setSelection,
      shouldClearOriginal,
      render,
      pushHistory,
    ],
  );

  // Add meta viewport tag for proper mobile rendering
  useEffect(() => {
    // Find or create viewport meta tag
    let viewportMeta = document.querySelector(
      'meta[name="viewport"]',
    ) as HTMLMetaElement | null;
    if (!viewportMeta) {
      viewportMeta = document.createElement("meta");
      viewportMeta.name = "viewport";
      document.head.appendChild(viewportMeta);
    }

    // Set viewport properties for proper mobile rendering
    viewportMeta.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";

    return () => {
      // Reset viewport on cleanup
      if (viewportMeta && viewportMeta.parentNode) {
        viewportMeta.content = "width=device-width, initial-scale=1.0";
      }
    };
  }, []);

  // Update isValidSelection when selection state changes
  useEffect(() => {
    setValidSelection(!!selection.selectedImageData);
  }, [selection.selectedImageData, setValidSelection]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full touch-none overflow-hidden bg-gray-800"
    >
      <canvas
        ref={displayCanvasRef}
        className={`absolute left-0 top-0 touch-none ${getCursorStyle()}`}
        style={
          {
            touchAction: "none",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            WebkitTapHighlightColor: "transparent",
            width: "100%",
            height: "100%",
          } as React.CSSProperties
        }
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
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
