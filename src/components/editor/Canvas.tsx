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
import { Layer, ToolType } from "@/types/editor";

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
}

type ViewportState = {
  x: number;
  y: number;
  scale: number;
};

interface SelectionState {
  isSelecting: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isMoving: boolean;
  moveStartX: number;
  moveStartY: number;
  selectedImageData?: ImageData;
  originalX?: number;
  originalY?: number;
}

export interface CanvasRef {
  clearCanvas: () => void;
  importImage: (imageData: ImageData) => void;
  getLayerImageData: () => ImageData | null;
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
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
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
  });

  const [isPickingColor, setIsPickingColor] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

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

  // Update render function to handle multiple layers
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

    // Clear canvas
    ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);

    // Apply viewport transform
    ctx.save();
    ctx.translate(viewport.x, viewport.y);
    ctx.scale(viewport.scale, viewport.scale);

    // Draw checkerboard pattern for transparency
    if (checkerboardPattern) {
      const pattern = ctx.createPattern(checkerboardPattern, "repeat");
      if (pattern) {
        const patternTransform = new DOMMatrix()
          .translateSelf(0, 0)
          .scaleSelf(1 / viewport.scale);
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
    if (
      (selection.isSelecting || selection.selectedImageData) &&
      !selection.isMoving
    ) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1 / viewport.scale;
      ctx.setLineDash([2 / viewport.scale, 2 / viewport.scale]);

      const x = Math.min(selection.startX, selection.endX);
      const y = Math.min(selection.startY, selection.endY);
      const width = Math.abs(selection.endX - selection.startX);
      const height = Math.abs(selection.endY - selection.startY);

      ctx.strokeRect(x, y, width, height);

      // Draw inverted color outline
      ctx.strokeStyle = "#000000";
      ctx.setLineDash([2 / viewport.scale, 2 / viewport.scale]);
      ctx.lineDashOffset = 2 / viewport.scale;
      ctx.strokeRect(x, y, width, height);
    }

    // Draw selection overlay when moving
    if (selection.isMoving) {
      ctx.drawImage(selectionCanvas, 0, 0);
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

    // Draw brush preview
    if (
      hoverPosition &&
      (selectedTool === "pencil" || selectedTool === "eraser") &&
      !isDrawing &&
      !isPanning
    ) {
      const size = brushSize;
      const halfSize = Math.floor(size / 2);

      const x = hoverPosition.x - halfSize;
      const y = hoverPosition.y - halfSize;

      ctx.globalAlpha = 0.5;
      if (selectedTool === "eraser") {
        ctx.clearRect(x, y, size, size);
      } else {
        ctx.fillStyle = primaryColor;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1.0;

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1 / viewport.scale;
      ctx.setLineDash([]);
      ctx.strokeRect(x, y, size, size);

      ctx.strokeStyle = "#000000";
      ctx.strokeRect(x, y, size, size);
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

  // Update floodFill to work with layers
  const floodFill = useCallback(
    (
      startX: number,
      startY: number,
      targetColor: string,
      replacementColor: string,
    ) => {
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

      const imageData = tempCtx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      const visited = new Set<string>();
      const MAX_PIXELS = width * height;
      let processedPixels = 0;

      const getColorArray = (color: string): number[] => {
        if (color === "transparent") return [0, 0, 0, 0];

        if (color.startsWith("#")) {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          return [r, g, b, 255];
        }

        return [0, 0, 0, 255];
      };

      const targetRGBA = getColorArray(targetColor);
      const replacementRGBA = getColorArray(replacementColor);

      if (targetRGBA.every((val, i) => val === replacementRGBA[i])) {
        return;
      }

      const getPixel = (x: number, y: number): number[] => {
        const i = (y * width + x) * 4;
        return [
          pixels[i] ?? 0,
          pixels[i + 1] ?? 0,
          pixels[i + 2] ?? 0,
          pixels[i + 3] ?? 0,
        ];
      };

      const setPixel = (x: number, y: number, color: number[]) => {
        const i = (y * width + x) * 4;
        pixels[i] = color[0] ?? 0;
        pixels[i + 1] = color[1] ?? 0;
        pixels[i + 2] = color[2] ?? 0;
        pixels[i + 3] = color[3] ?? 0;
      };

      const colorsMatch = (a: number[], b: number[]): boolean => {
        const tolerance = (bucketTolerance ?? 1) / 20;

        if (b[3] === 0 && a[3] === 0) return true;
        if (b[3] === 0 || a[3] === 0) return false;

        const rDiff = Math.abs((a[0] ?? 0) - (b[0] ?? 0)) / 255;
        const gDiff = Math.abs((a[1] ?? 0) - (b[1] ?? 0)) / 255;
        const bDiff = Math.abs((a[2] ?? 0) - (b[2] ?? 0)) / 255;

        const maxDiff = Math.max(rDiff, gDiff, bDiff);

        return maxDiff <= tolerance;
      };

      const queue: [number, number][] = [[startX, startY]];
      const targetPixel = getPixel(startX, startY);

      while (queue.length > 0 && processedPixels < MAX_PIXELS) {
        const [x, y] = queue.shift()!;
        const pixelKey = `${x},${y}`;

        if (visited.has(pixelKey)) continue;
        visited.add(pixelKey);

        if (x < 0 || x >= width || y < 0 || y >= height) {
          continue;
        }

        const currentPixel = getPixel(x, y);
        if (!colorsMatch(currentPixel, targetPixel)) {
          continue;
        }

        setPixel(x, y, replacementRGBA);
        processedPixels++;

        const neighbors = [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1],
        ];

        for (const [nx, ny] of neighbors) {
          const neighborKey = `${nx},${ny}`;
          if (!visited.has(neighborKey)) {
            queue.push([nx ?? 0, ny ?? 0]);
          }
        }
      }

      tempCtx.putImageData(imageData, 0, 0);
      selectedLayer.imageData = tempCtx.getImageData(0, 0, width, height);

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(() => {
          render();
          animationFrameRef.current = undefined;
        });
      }
    },
    [layers, selectedLayerId, width, height, render, bucketTolerance],
  );

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

        selectedLayer.imageData = imageData;

        render();

        // Center the viewport on the new image
        const displayCanvas = displayCanvasRef.current;
        if (!displayCanvas) return;
        setTimeout(() => {
          setViewport((prev) => ({
            ...prev,
            x: (displayCanvas.width - imageData.width * prev.scale) / 2,
            y: (displayCanvas.height - imageData.height * prev.scale) / 2,
          }));
        }, 4);
      },

      getLayerImageData: () => {
        const selectedLayer = layers.find(
          (layer) => layer.id === selectedLayerId,
        );
        return selectedLayer?.imageData ?? null;
      },
    }),
    [width, height, layers, selectedLayerId],
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
    displayCanvas.width = container.clientWidth;
    displayCanvas.height = container.clientHeight;

    // Center the viewport
    setViewport((prev) => ({
      ...prev,
      x: (displayCanvas.width - width * prev.scale) / 2,
      y: (displayCanvas.height - height * prev.scale) / 2,
    }));

    // Cleanup previous animation frame
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [width, height]);

  // Start render loop
  useEffect(() => {
    render();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render]);

  // Optimized pixel coordinate calculation
  const getPixelCoords = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = displayCanvasRef.current;
      if (!canvas) return { x: -1, y: -1 };

      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(
        (e.clientX - rect.left - viewport.x) / viewport.scale,
      );
      const y = Math.floor(
        (e.clientY - rect.top - viewport.y) / viewport.scale,
      );
      return { x, y };
    },
    [viewport.x, viewport.y, viewport.scale],
  );

  // Throttled pan handler
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

  // Selection helpers
  const getSelectionBounds = useCallback(() => {
    const minX = Math.min(selection.startX, selection.endX);
    const maxX = Math.max(selection.startX, selection.endX);
    const minY = Math.min(selection.startY, selection.endY);
    const maxY = Math.max(selection.startY, selection.endY);
    return { minX, maxX, minY, maxY };
  }, [selection]);

  // Add color picking function
  const pickColor = useCallback(
    (x: number, y: number, isRightClick: boolean) => {
      const canvas = drawingCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      // Get pixel data at the clicked position
      const pixel = ctx.getImageData(x, y, 1, 1);
      const [r, g, b, a] = pixel.data;

      // If pixel is fully transparent
      if (a === 0) {
        onColorPick?.("transparent", isRightClick);
        return;
      }

      // Convert to hex color
      const color = `#${((1 << 24) + (r ?? 0 << 16) + (g ?? 0 << 8) + (b ?? 0))
        .toString(16)
        .slice(1)
        .toUpperCase()}`;
      onColorPick?.(color, isRightClick);
    },
    [onColorPick],
  );

  // Mouse event handlers with debounced state updates
  // Handle mouse events for selection
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsMouseDown(true);
      const isRightClick = e.button === 2;

      const color = isRightClick ? secondaryColor : primaryColor;

      if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
        setIsPanning(true);
        return;
      }

      if (e.button === 0 || e.button === 2) {
        const { x, y } = getPixelCoords(e);

        // Add immediate painting for pencil and eraser tools
        if (
          (selectedTool === "pencil" || selectedTool === "eraser") &&
          !selection.isSelecting
        ) {
          const coords = getCanvasCoordinates(e);
          drawPixel(coords.x, coords.y, isRightClick);
        }

        if (selectedTool === "bucket") {
          const canvas = drawingCanvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) return;

          const imageData = ctx.getImageData(x, y, 1, 1);
          const [r, g, b, a] = imageData.data;

          let targetColor = "transparent";
          if (a === 255) {
            targetColor = `#${[r, g, b]
              .map((x) => x?.toString(16).padStart(2, "0"))
              .join("")
              .toUpperCase()}`;
          }

          floodFill(x, y, targetColor, color);
          return;
        }

        if (selectedTool === "eyedropper") {
          const canvas = drawingCanvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) return;

          // Get pixel data at the clicked position
          const pixel = ctx.getImageData(x, y, 1, 1);
          const [r, g, b, a] = pixel.data;

          // If pixel is fully transparent
          if (a === 0) {
            onColorPick?.("transparent", isRightClick);
            return;
          }

          // For partially transparent pixels, include alpha in color
          if (a && a < 255) {
            const rgba = `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
            onColorPick?.(rgba, isRightClick);
            return;
          }

          // For fully opaque pixels, use hex
          const hex =
            "#" +
            [r, g, b]
              .map((x) => x?.toString(16).padStart(2, "0"))
              .join("")
              .toUpperCase();

          onColorPick?.(hex, isRightClick);
          return;
        }
        const coords = getCanvasCoordinates(e);
        if (selectedTool === "select") {
          // Check if clicking inside existing selection
          if (selection.selectedImageData) {
            const { minX, maxX, minY, maxY } = getSelectionBounds();
            if (
              coords.x >= minX &&
              coords.x <= maxX &&
              coords.y >= minY &&
              coords.y <= maxY
            ) {
              // Start moving existing selection
              setSelection((prev) => ({
                ...prev,
                isMoving: true,
                moveStartX: coords.x,
                moveStartY: coords.y,
              }));
              return;
            }
          }

          // Start new selection
          setSelection({
            isSelecting: true,
            startX: coords.x,
            startY: coords.y,
            endX: coords.x,
            endY: coords.y,
            isMoving: false,
            moveStartX: coords.x,
            moveStartY: coords.y,
            selectedImageData: undefined,
            originalX: undefined,
            originalY: undefined,
          });
        }
      }
    },
    [
      isSpacePressed,
      selectedTool,
      primaryColor,
      secondaryColor,
      getPixelCoords,
      floodFill,
      selection,
      getSelectionBounds,
      drawPixel,
      onColorPick,
    ],
  );

  const getCanvasCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
      const canvas = displayCanvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();

      // Get mouse position relative to canvas
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Reverse the viewport transformation
      const x = Math.floor((mouseX - viewport.x) / viewport.scale);
      const y = Math.floor((mouseY - viewport.y) / viewport.scale);

      return { x, y };
    },
    [viewport],
  );

  // Update handleMouseMove to handle continuous painting
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Check for right click using e.buttons
      // e.buttons is a bitmask: 1 = left, 2 = right
      const isRightClick = (e.buttons & 2) === 2;

      const coords = getCanvasCoordinates(e);
      setHoverPosition(coords);

      if (!isMouseDown) return;

      if (isPanning) {
        handlePan(e);
        return;
      }

      if (isPickingColor) {
        pickColor(coords.x, coords.y, isRightClick);
        return;
      }

      if (selection.isSelecting) {
        setSelection((prev) => ({
          ...prev,
          endX: coords.x,
          endY: coords.y,
        }));
        // Draw preview of moved selection
        const selectionCanvas = selectionCanvasRef.current;
        if (selectionCanvas && selection.selectedImageData) {
          const ctx = selectionCanvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
            ctx.putImageData(
              selection.selectedImageData,
              (selection.originalX ?? 0) + coords.x,
              (selection.originalY ?? 0) + coords.y,
            );
          }
        }
        render();
        return;
      }

      if (selection.isMoving && selection.selectedImageData) {
        const deltaX = coords.x - selection.moveStartX;
        const deltaY = coords.y - selection.moveStartY;

        const selectionCanvas = selectionCanvasRef.current;
        if (selectionCanvas) {
          const ctx = selectionCanvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
            ctx.putImageData(
              selection.selectedImageData,
              (selection.originalX ?? 0) + deltaX,
              (selection.originalY ?? 0) + deltaY,
            );
          }
        }
        render();
        return;
      }

      // Handle continuous painting for brush and eraser
      if (
        (selectedTool === "pencil" || selectedTool === "eraser") &&
        !selection.isSelecting
      ) {
        drawPixel(coords.x, coords.y, isRightClick);
      }
    },
    [
      isMouseDown,
      isPanning,
      isPickingColor,
      // activeButton,
      selectedTool,
      selection,
      handlePan,
      pickColor,
      drawPixel,
      render,
      getCanvasCoordinates,
    ],
  );

  // Optimized wheel handler with debouncing
  const handleWheel = useCallback((e: WheelEvent) => {
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

  // Trigger render when selectedLayerId changes
  useEffect(() => {
    clearSelection();
    render();
  }, [selectedLayerId]);

  // Handle selection movement
  const moveSelection = useCallback(
    (newX: number, newY: number) => {
      if (!selection.selectedImageData) return;

      const selectedLayer = layers.find(
        (layer) => layer.id === selectedLayerId,
      );
      if (!selectedLayer || !selectedLayer.visible) return;

      // Create a temporary canvas for the layer if it doesn't exist
      if (!selectedLayer.imageData) {
        selectedLayer.imageData = new ImageData(width, height);
      }

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
      if (!tempCtx) return;

      // Draw existing layer data
      tempCtx.putImageData(selectedLayer.imageData, 0, 0);

      // Clear the original selection area if it exists
      if (
        selection.originalX !== undefined &&
        selection.originalY !== undefined
      ) {
        tempCtx.clearRect(
          selection.originalX,
          selection.originalY,
          selection.selectedImageData.width,
          selection.selectedImageData.height,
        );
      }

      // Create another temporary canvas for the selection
      const selectionCanvas = document.createElement("canvas");
      selectionCanvas.width = selection.selectedImageData.width;
      selectionCanvas.height = selection.selectedImageData.height;
      const selectionCtx = selectionCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (!selectionCtx) return;

      // Draw the selection data
      selectionCtx.putImageData(selection.selectedImageData, 0, 0);

      // Draw the selection at the new position
      tempCtx.drawImage(selectionCanvas, newX, newY);

      // Update the layer's imageData
      selectedLayer.imageData = tempCtx.getImageData(0, 0, width, height);

      // Update selection state with new bounds
      setSelection((prev) => ({
        ...prev,
        startX: newX,
        startY: newY,
        endX: newX + prev.selectedImageData!.width,
        endY: newY + prev.selectedImageData!.height,
        originalX: newX,
        originalY: newY,
        isMoving: false,
      }));

      // Clear selection canvas
      const selectionCtx2 = selectionCanvasRef.current?.getContext("2d");
      if (selectionCtx2) {
        selectionCtx2.clearRect(0, 0, width, height);
      }

      // Trigger a render
      render();
    },
    [selection, layers, selectedLayerId, width, height, render],
  );

  // Update handleMouseUp to properly capture the selection
  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsMouseDown(false);

      const coords = getCanvasCoordinates(e);

      if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
        setIsPanning(false);
      } else if (e.button === 0 || e.button === 2) {
        if (selection.isSelecting) {
          // Finish new selection
          const { minX, maxX, minY, maxY } = getSelectionBounds();
          const width = maxX - minX + 1;
          const height = maxY - minY + 1;

          if (width > 0 && height > 0) {
            const selectedLayer = layers.find(
              (layer) => layer.id === selectedLayerId,
            );
            if (!selectedLayer || !selectedLayer.imageData) return;

            // Create a temporary canvas for the selection
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = width;
            tempCanvas.height = height;
            const tempCtx = tempCanvas.getContext("2d", {
              willReadFrequently: true,
            });
            if (!tempCtx) return;

            // Draw the full layer first
            tempCtx.putImageData(selectedLayer.imageData, -minX, -minY);

            // Get the selection area
            const imageData = tempCtx.getImageData(0, 0, width, height);

            setSelection((prev) => ({
              ...prev,
              isSelecting: false,
              selectedImageData: imageData,
              originalX: minX,
              originalY: minY,
            }));
          }
        } else if (selection.isMoving && selection.selectedImageData) {
          const deltaX = coords.x - selection.moveStartX;
          const deltaY = coords.y - selection.moveStartY;

          moveSelection(
            (selection.originalX ?? 0) + deltaX,
            (selection.originalY ?? 0) + deltaY,
          );
        }
      }
    },
    [
      isSpacePressed,
      selection,
      getSelectionBounds,
      layers,
      selectedLayerId,

      moveSelection,
      getCanvasCoordinates,
    ],
  );

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
        // Get the selected layer
        const selectedLayer = layers.find(
          (layer) => layer.id === selectedLayerId,
        );
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
        const deleteWidth = selection.selectedImageData.width;
        const deleteHeight = selection.selectedImageData.height;

        // Clear the selected area
        tempCtx.clearRect(deleteX, deleteY, deleteWidth, deleteHeight);

        // Update layer's imageData
        selectedLayer.imageData = tempCtx.getImageData(0, 0, width, height);

        // Clear the selection state
        clearSelection();

        // Trigger render
        render();
      }

      // if ((e.metaKey || e.ctrlKey) && e.key === "z") {
      //   e.preventDefault();
      //   if (e.shiftKey) {
      //     redo();
      //   } else {
      //     undo();
      //   }
      // }
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
    containerRef.current?.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      containerRef.current?.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  // Add after initialization effects
  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Save initial blank state
    const initialState = {
      layers: layers.map((layer) => ({
        ...layer,
        imageData: layer.imageData
          ? new ImageData(
              new Uint8ClampedArray(layer.imageData.data),
              layer.imageData.width,
              layer.imageData.height,
            )
          : new ImageData(width, height),
      })),
      timestamp: Date.now(),
    };

    render();
  }, [width, height, layers]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        setIsSpacePressed(true);
      } else if (e.code === "Escape") {
        clearSelection();
      } else if (e.code === "Delete" || e.code === "Backspace") {
        if (selection.selectedImageData) {
          const ctx = drawingCanvasRef.current?.getContext("2d", {
            willReadFrequently: true,
          });
          if (!ctx) return;

          const { minX, maxX, minY, maxY } = getSelectionBounds();
          const width = maxX - minX + 1;
          const height = maxY - minY + 1;

          // Clear the selected area
          ctx.clearRect(minX, minY, width, height);
          clearSelection();

          // Trigger a render after clearing
          requestAnimationFrame(() => {
            render();
          });
        }
      }

      // if ((e.metaKey || e.ctrlKey) && e.key === "z") {
      //   e.preventDefault();
      //   if (e.shiftKey) {
      //     redo();
      //   } else {
      //     undo();
      //   }
      // }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearSelection, getSelectionBounds, render]);

  // Add useEffect to watch for tool changes
  useEffect(() => {
    // Clear selection when tool changes
    clearSelection();
  }, [selectedTool, clearSelection]);

  // Add onMouseLeave handler
  const handleMouseLeave = useCallback(() => {
    setHoverPosition(null);
    setIsMouseDown(false);
    setIsDrawing(false);
    setIsPanning(false);
    if (selection.isSelecting) {
      clearSelection();
    }
  }, [clearSelection]);

  // Add window mouse up listener to catch mouse releases outside canvas
  useEffect(() => {
    const handleWindowMouseUp = () => {
      setIsMouseDown(false);
      setIsDrawing(false);
      setIsPanning(false);
    };

    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => window.removeEventListener("mouseup", handleWindowMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden bg-gray-800"
    >
      <canvas
        ref={displayCanvasRef}
        className={`absolute left-0 top-0 ${
          isPanning
            ? "cursor-grab"
            : selectedTool === "eyedropper"
              ? "cursor-crosshair"
              : selection.isMoving
                ? "cursor-move"
                : selectedTool === "select"
                  ? "cursor-crosshair"
                  : "cursor-crosshair"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onContextMenu={(e) => e.preventDefault()}
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
