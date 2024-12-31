import { useState, useCallback } from "react";
import { ViewportState } from "@/types/editor";

interface UseViewportProps {
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
}

export function useViewport({
  initialScale = 4,
  minScale = 1,
  maxScale = 32,
}: UseViewportProps = {}) {
  const [viewport, setViewport] = useState<ViewportState>({
    x: 0,
    y: 0,
    scale: initialScale,
  });

  const handlePan = useCallback((movementX: number, movementY: number) => {
    setViewport((prev) => ({
      ...prev,
      x: prev.x + movementX,
      y: prev.y + movementY,
    }));
  }, []);

  const handleZoom = useCallback(
    (
      deltaY: number,
      mouseX: number,
      mouseY: number,
      currentViewport: ViewportState,
    ) => {
      const direction = deltaY > 0 ? -1 : 1;
      const newScale = Math.max(
        minScale,
        Math.min(maxScale, currentViewport.scale * (1 + 0.1 * direction)),
      );

      const worldX = (mouseX - currentViewport.x) / currentViewport.scale;
      const worldY = (mouseY - currentViewport.y) / currentViewport.scale;

      const newX = mouseX - worldX * newScale;
      const newY = mouseY - worldY * newScale;

      setViewport({
        x: newX,
        y: newY,
        scale: newScale,
      });
    },
    [minScale, maxScale],
  );

  const centerViewport = useCallback(
    (
      containerWidth: number,
      containerHeight: number,
      canvasWidth: number,
      canvasHeight: number,
    ) => {
      const scaleX = containerWidth / canvasWidth;
      const scaleY = containerHeight / canvasHeight;
      const newScale = Math.min(
        Math.max(minScale, Math.min(scaleX, scaleY) * 0.8),
        maxScale,
      );

      setViewport({
        x: (containerWidth - canvasWidth * newScale) / 2,
        y: (containerHeight - canvasHeight * newScale) / 2,
        scale: newScale,
      });
    },
    [minScale, maxScale],
  );

  return {
    viewport,
    setViewport,
    handlePan,
    handleZoom,
    centerViewport,
  };
}
