import { useEffect, RefObject } from "react";
import { ViewportState } from "@/types/editor";

interface UseCanvasSetupProps {
  containerRef: RefObject<HTMLDivElement>;
  displayCanvasRef: RefObject<HTMLCanvasElement>;
  drawingCanvasRef: RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
  setViewport: (
    viewport: ViewportState | ((prev: ViewportState) => ViewportState),
  ) => void;
}

export function useCanvasSetup({
  containerRef,
  displayCanvasRef,
  drawingCanvasRef,
  width,
  height,
  setViewport,
}: UseCanvasSetupProps) {
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

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    width,
    height,
    containerRef,
    displayCanvasRef,
    drawingCanvasRef,
    setViewport,
  ]);
}
